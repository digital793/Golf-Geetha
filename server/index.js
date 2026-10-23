import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { db, getContent, verifyPassword, syncSeedContent } from './db.js';
import {
  startBackgroundCrawler,
  getKnowledgeBundle,
  answerBotQuery,
  triggerBackgroundSync,
  crawlAndIndexSite,
} from './botKnowledge.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4000);
const COOKIE = 'gg_admin';
const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 8) || '.bin';
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 32 * 1024 * 1024 } });

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(uploadDir));

function nowIso() {
  return new Date().toISOString();
}

function requireAdmin(req, res, next) {
  const token = req.cookies[COOKIE];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const row = db.prepare('SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?').get(token, nowIso());
  if (!row) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.get('/api/content', (_req, res) => {
  res.json(getContent());
});

// ── GOLF GITA CELESTIAL BOT & BACKGROUND SYNC ENDPOINTS ──
app.get('/api/bot/knowledge', (req, res) => {
  const bundle = getKnowledgeBundle();
  const clientEtag = req.headers['if-none-match'];

  if (clientEtag && clientEtag === bundle.etag) {
    return res.status(304).end();
  }

  res.setHeader('ETag', bundle.etag);
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(bundle);
});

app.post('/api/bot/ask', (req, res) => {
  const { query, userContext, history } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query' });
  }
  const answer = answerBotQuery({ query, userContext: userContext || {}, history: history || [] });
  res.json(answer);
});

// ── CHAT PROFILE (persistent user memory) ──────────────────────────────────
// localId = stable string stored in the user's localStorage (NOT a session)
app.get('/api/bot/profile/:localId', (req, res) => {
  const { localId } = req.params;
  if (!localId) return res.status(400).json({ error: 'Missing localId' });
  const row = db.prepare('SELECT * FROM chat_profiles WHERE local_id = ?').get(localId);
  if (!row) return res.json({ found: false });
  res.json({
    found: true,
    profile: JSON.parse(row.profile_json || '{}'),
    topics: JSON.parse(row.topics_json || '[]'),
    privacyAccepted: !!row.privacy_accepted,
  });
});

app.post('/api/bot/profile', (req, res) => {
  const { localId, profile, topics, privacyAccepted } = req.body || {};
  if (!localId) return res.status(400).json({ error: 'Missing localId' });
  const stamp = nowIso();
  db.prepare(`
    INSERT INTO chat_profiles (local_id, profile_json, topics_json, privacy_accepted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(local_id) DO UPDATE SET
      profile_json = excluded.profile_json,
      topics_json = excluded.topics_json,
      privacy_accepted = excluded.privacy_accepted,
      updated_at = excluded.updated_at
  `).run(
    localId,
    JSON.stringify(profile || {}),
    JSON.stringify(topics || []),
    privacyAccepted ? 1 : 0,
    stamp,
    stamp,
  );
  res.json({ ok: true });
});

app.delete('/api/bot/profile/:localId', (req, res) => {
  const { localId } = req.params;
  if (!localId) return res.status(400).json({ error: 'Missing localId' });
  db.prepare('DELETE FROM chat_profiles WHERE local_id = ?').run(localId);
  res.json({ ok: true });
});

app.post('/api/bot/crawl', (req, res) => {
  const refreshed = crawlAndIndexSite();
  res.json({ ok: true, meta: refreshed.meta });
});

app.post('/api/track/pageview', (req, res) => {
  const { sessionId, page, referrer, language } = req.body || {};
  if (!sessionId || !page) return res.status(400).json({ error: 'Missing session or page' });
  const ua = req.get('user-agent') || '';
  const stamp = nowIso();
  const existing = db.prepare('SELECT id, page_count FROM sessions WHERE id = ?').get(sessionId);
  if (existing) {
    db.prepare('UPDATE sessions SET last_seen = ?, page_count = ?, user_agent = ? WHERE id = ?').run(
      stamp,
      existing.page_count + 1,
      ua,
      sessionId,
    );
  } else {
    db.prepare('INSERT INTO sessions (id, first_seen, last_seen, page_count, user_agent) VALUES (?, ?, ?, 1, ?)').run(
      sessionId,
      stamp,
      stamp,
      ua,
    );
  }
  db.prepare(`
    INSERT INTO page_views (session_id, page, referrer, user_agent, language, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sessionId, page, referrer || '', ua, language || '', stamp);
  res.json({ ok: true });
});

app.post('/api/track/platform', (req, res) => {
  const { sessionId, platformSlug, source, page } = req.body || {};
  if (!sessionId || !platformSlug) return res.status(400).json({ error: 'Missing fields' });
  const platform = db.prepare('SELECT name FROM platforms WHERE slug = ?').get(platformSlug);
  db.prepare(`
    INSERT INTO platform_clicks (session_id, platform_slug, platform_name, source, page, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sessionId, platformSlug, platform?.name || platformSlug, source || 'modal', page || '', nowIso());
  res.json({ ok: true });
});

app.post('/api/track/event', (req, res) => {
  const { sessionId, name, payload } = req.body || {};
  if (!sessionId || !name) return res.status(400).json({ error: 'Missing fields' });
  db.prepare('INSERT INTO events (session_id, name, payload, created_at) VALUES (?, ?, ?, ?)').run(
    sessionId,
    name,
    JSON.stringify(payload || {}),
    nowIso(),
  );
  res.json({ ok: true });
});

app.post('/api/forms/:type', (req, res) => {
  const formType = req.params.type;
  db.prepare('INSERT INTO form_submissions (form_type, payload, created_at) VALUES (?, ?, ?)').run(
    formType,
    JSON.stringify(req.body || {}),
    nowIso(),
  );
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username || '');
  if (!user || !verifyPassword(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)').run(token, expires);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ ok: true, username: user.username });
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.cookies[COOKIE];
  if (token) db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/me', requireAdmin, (_req, res) => {
  res.json({ ok: true, username: 'admin' });
});

app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  const days = Math.min(90, Math.max(1, Number(req.query.days || 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const totals = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM page_views WHERE created_at >= ?) AS views,
      (SELECT COUNT(*) FROM sessions WHERE last_seen >= ?) AS visitors,
      (SELECT COUNT(*) FROM platform_clicks WHERE created_at >= ?) AS platform_clicks,
      (SELECT COUNT(*) FROM events WHERE name = 'buy_modal_open' AND created_at >= ?) AS buy_opens
  `).get(since, since, since, since);

  const viewsByDay = db.prepare(`
    SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
    FROM page_views WHERE created_at >= ?
    GROUP BY day ORDER BY day
  `).all(since);

  const viewsByPage = db.prepare(`
    SELECT page, COUNT(*) AS count
    FROM page_views WHERE created_at >= ?
    GROUP BY page ORDER BY count DESC
  `).all(since);

  const platformClicks = db.prepare(`
    SELECT platform_slug, platform_name, COUNT(*) AS count
    FROM platform_clicks WHERE created_at >= ?
    GROUP BY platform_slug, platform_name
    ORDER BY count DESC
  `).all(since);

  const clicksBySource = db.prepare(`
    SELECT source, COUNT(*) AS count
    FROM platform_clicks WHERE created_at >= ?
    GROUP BY source ORDER BY count DESC
  `).all(since);

  const clicksByDay = db.prepare(`
    SELECT substr(created_at, 1, 10) AS day, platform_name, COUNT(*) AS count
    FROM platform_clicks WHERE created_at >= ?
    GROUP BY day, platform_name ORDER BY day
  `).all(since);

  const recentViews = db.prepare(`
    SELECT page, language, referrer, created_at
    FROM page_views ORDER BY id DESC LIMIT 20
  `).all();

  const recentClicks = db.prepare(`
    SELECT platform_name, source, page, created_at
    FROM platform_clicks ORDER BY id DESC LIMIT 20
  `).all();

  res.json({
    days,
    totals,
    viewsByDay,
    viewsByPage,
    platformClicks,
    clicksBySource,
    clicksByDay,
    recentViews,
    recentClicks,
  });
});

app.get('/api/admin/submissions', requireAdmin, (_req, res) => {
  res.json(db.prepare('SELECT * FROM form_submissions ORDER BY id DESC LIMIT 200').all());
});

app.get('/api/admin/chat-profiles', requireAdmin, (_req, res) => {
  const rows = db.prepare('SELECT * FROM chat_profiles ORDER BY updated_at DESC LIMIT 200').all();
  const parsed = rows.map((r) => ({
    local_id: r.local_id,
    profile: JSON.parse(r.profile_json || '{}'),
    topics: JSON.parse(r.topics_json || '[]'),
    privacy_accepted: !!r.privacy_accepted,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
  res.json(parsed);
});

app.delete('/api/admin/chat-profiles/:localId', requireAdmin, (req, res) => {
  const { localId } = req.params;
  db.prepare('DELETE FROM chat_profiles WHERE local_id = ?').run(localId);
  res.json({ ok: true });
});

app.post('/api/admin/upload', requireAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file received' });
    try {
      const pubDir = path.join(__dirname, '../public/uploads');
      fs.mkdirSync(pubDir, { recursive: true });
      fs.copyFileSync(req.file.path, path.join(pubDir, req.file.filename));
    } catch (copyErr) {
      console.warn('Could not mirror upload to public/uploads:', copyErr);
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

function saveSettings(settings) {
  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(settings || {})) {
      upsert.run(key, String(value ?? ''));
    }
  });
  tx();
}

function saveSections(sections) {
  const upsert = db.prepare(`
    INSERT INTO content_blocks (section, field_key, value) VALUES (?, ?, ?)
    ON CONFLICT(section, field_key) DO UPDATE SET value = excluded.value
  `);
  const tx = db.transaction(() => {
    for (const [section, fields] of Object.entries(sections || {})) {
      for (const [field_key, value] of Object.entries(fields || {})) {
        upsert.run(section, field_key, String(value ?? ''));
      }
    }
  });
  tx();
}

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  saveSettings(req.body || {});
  triggerBackgroundSync();
  res.json(getContent());
});

app.put('/api/admin/sections/:section', requireAdmin, (req, res) => {
  saveSections({ [req.params.section]: req.body || {} });
  triggerBackgroundSync();
  res.json(getContent());
});

app.put('/api/admin/platforms', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  const insert = db.prepare(`
    INSERT INTO platforms (slug, name, formats, icon, url, sort_order, is_active)
    VALUES (@slug, @name, @formats, @icon, @url, @sort_order, @is_active)
  `);
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM platforms').run();
    rows.forEach((row, index) => insert.run({
      slug: row.slug || `platform-${index + 1}`,
      name: row.name || '',
      formats: row.formats || '',
      icon: row.icon || '',
      url: row.url || '',
      sort_order: index + 1,
      is_active: row.is_active ? 1 : 0,
    }));
  });
  tx();
  triggerBackgroundSync();
  res.json(getContent());
});

app.put('/api/admin/holes', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  const insert = db.prepare(`
    INSERT INTO holes (hole, par, distance, numeral, title, subtitle, sanskrit, devanagari, description, image)
    VALUES (@hole, @par, @distance, @numeral, @title, @subtitle, @sanskrit, @devanagari, @description, @image)
  `);
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM holes').run();
    for (const row of rows) {
      insert.run({
        hole: Number(row.hole),
        par: Number(row.par || 0),
        distance: row.distance || '',
        numeral: row.numeral || String(row.hole).padStart(2, '0'),
        title: row.title || '',
        subtitle: row.subtitle || '',
        sanskrit: row.sanskrit || '',
        devanagari: row.devanagari || '',
        description: row.description || '',
        image: row.image || '',
      });
    }
  });
  tx();
  triggerBackgroundSync();
  res.json(getContent());
});

function saveCollection(table, insertSql, rows, bind) {
  const insert = db.prepare(insertSql);
  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM ${table}`).run();
    rows.forEach((row, index) => insert.run(bind(row, index)));
  });
  tx();
}

app.put('/api/admin/articles', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  saveCollection(
    'articles',
    `INSERT INTO articles (title, description, body, image, read_time, category, hole_tag, sort_order, is_active)
     VALUES (@title, @description, @body, @image, @read_time, @category, @hole_tag, @sort_order, @is_active)`,
    rows,
    (row, index) => ({
      title: row.title || '',
      description: row.description || '',
      body: row.body || '',
      image: row.image || '',
      read_time: row.read_time || '',
      category: row.category || '',
      hole_tag: row.hole_tag || '',
      sort_order: index + 1,
      is_active: row.is_active === 0 ? 0 : 1,
    }),
  );
  triggerBackgroundSync();
  res.json(getContent());
});

app.put('/api/admin/faqs', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  saveCollection(
    'faqs',
    'INSERT INTO faqs (question, answer, sort_order) VALUES (@question, @answer, @sort_order)',
    rows,
    (row, index) => ({ question: row.question || '', answer: row.answer || '', sort_order: index + 1 }),
  );
  triggerBackgroundSync();
  res.json(getContent());
});

app.put('/api/admin/gallery', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  saveCollection(
    'book_gallery',
    'INSERT INTO book_gallery (image, sort_order) VALUES (@image, @sort_order)',
    rows,
    (row, index) => ({ image: row.image || '', sort_order: index + 1 }),
  );
  res.json(getContent());
});

app.put('/api/admin/nav', requireAdmin, (req, res) => {
  const rows = Array.isArray(req.body) ? req.body : [];
  saveCollection(
    'nav_links',
    'INSERT INTO nav_links (page_id, label, sort_order) VALUES (@page_id, @label, @sort_order)',
    rows,
    (row, index) => ({ page_id: row.page_id || '', label: row.label || '', sort_order: index + 1 }),
  );
  res.json(getContent());
});

app.put('/api/admin/lists/:key', requireAdmin, (req, res) => {
  const listKey = req.params.key;
  const rows = Array.isArray(req.body) ? req.body : [];
  const insert = db.prepare(`
    INSERT INTO list_items (list_key, title, subtitle, description, extra, icon, image, sort_order)
    VALUES (@list_key, @title, @subtitle, @description, @extra, @icon, @image, @sort_order)
  `);
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM list_items WHERE list_key = ?').run(listKey);
    rows.forEach((row, index) => insert.run({
      list_key: listKey,
      title: row.title || '',
      subtitle: row.subtitle || '',
      description: row.description || '',
      extra: typeof row.extra === 'string' ? row.extra : JSON.stringify(row.extra || {}),
      icon: row.icon || '',
      image: row.image || '',
      sort_order: index + 1,
    }));
  });
  tx();
  triggerBackgroundSync();
  res.json(getContent());
});

// Serve production build if dist folder exists (for Hostinger production deployment)
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const server = http.createServer(app);
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`CMS API port ${PORT} is already in use. Stop the other process, or keep using the one that is already running.`);
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Golf Gita CMS API running on http://localhost:${PORT}`);
  // Launch background crawler (runs periodically in the background without UI blocking)
  startBackgroundCrawler(300000);
});
