import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { buildDefaultContent } from '../src/cms/defaults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'golf-gita.db');

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      formats TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS holes (
      hole INTEGER PRIMARY KEY,
      par INTEGER,
      distance TEXT,
      numeral TEXT,
      title TEXT,
      subtitle TEXT,
      sanskrit TEXT,
      devanagari TEXT,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      read_time TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS book_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS nav_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id TEXT NOT NULL,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS content_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      field_key TEXT NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      UNIQUE(section, field_key)
    );

    CREATE TABLE IF NOT EXISTS list_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_key TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      subtitle TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      extra TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      first_seen TEXT NOT NULL,
      last_seen TEXT NOT NULL,
      page_count INTEGER NOT NULL DEFAULT 0,
      user_agent TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      page TEXT NOT NULL,
      referrer TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS platform_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      platform_slug TEXT NOT NULL,
      platform_name TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'modal',
      page TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      name TEXT NOT NULL,
      payload TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_profiles (
      local_id TEXT PRIMARY KEY,
      profile_json TEXT NOT NULL DEFAULT '{}',
      topics_json TEXT NOT NULL DEFAULT '[]',
      privacy_accepted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const addColumn = (sql) => {
    try {
      db.exec(sql);
    } catch {
      /* already exists */
    }
  };
  addColumn("ALTER TABLE articles ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  addColumn("ALTER TABLE articles ADD COLUMN hole_tag TEXT NOT NULL DEFAULT ''");
}

function seed() {
  const adminCount = db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count;
  if (adminCount === 0) {
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(
      'admin',
      hashPassword('GolfGita@2026'),
    );
  }

  const settingsCount = db.prepare('SELECT COUNT(*) AS count FROM site_settings').get().count;
  if (settingsCount > 0) return;

  const content = buildDefaultContent();
  const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
  const insertPlatform = db.prepare(`
    INSERT INTO platforms (slug, name, formats, icon, url, sort_order, is_active)
    VALUES (@slug, @name, @formats, @icon, @url, @sort_order, @is_active)
  `);
  const insertHole = db.prepare(`
    INSERT INTO holes (hole, par, distance, numeral, title, subtitle, sanskrit, devanagari, description, image)
    VALUES (@hole, @par, @distance, @numeral, @title, @subtitle, @sanskrit, @devanagari, @description, @image)
  `);
  const insertArticle = db.prepare(`
    INSERT INTO articles (title, description, body, image, read_time, sort_order, is_active)
    VALUES (@title, @description, @body, @image, @read_time, @sort_order, @is_active)
  `);
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)');
  const insertGallery = db.prepare('INSERT INTO book_gallery (image, sort_order) VALUES (?, ?)');
  const insertNav = db.prepare('INSERT INTO nav_links (page_id, label, sort_order) VALUES (?, ?, ?)');
  const insertBlock = db.prepare('INSERT INTO content_blocks (section, field_key, value) VALUES (?, ?, ?)');
  const insertList = db.prepare(`
    INSERT INTO list_items (list_key, title, subtitle, description, extra, icon, image, sort_order)
    VALUES (@list_key, @title, @subtitle, @description, @extra, @icon, @image, @sort_order)
  `);

  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(content.settings)) {
      insertSetting.run(key, value);
    }
    for (const platform of content.platforms) insertPlatform.run(platform);
    for (const hole of content.holes) insertHole.run(hole);
    for (const article of content.articles) insertArticle.run(article);
    for (const faq of content.faqs) insertFaq.run(faq.question, faq.answer, faq.sort_order);
    for (const item of content.gallery) insertGallery.run(item.image, item.sort_order);
    for (const item of content.nav) insertNav.run(item.page_id, item.label, item.sort_order);
    for (const [section, fields] of Object.entries(content.sections)) {
      for (const [field_key, value] of Object.entries(fields)) {
        insertBlock.run(section, field_key, value ?? '');
      }
    }
    for (const items of Object.values(content.lists)) {
      for (const item of items) insertList.run(item);
    }
  });
  tx();
}

migrate();
seed();

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const next = crypto.scryptSync(password, salt, 64);
  const current = Buffer.from(hash, 'hex');
  return next.length === current.length && crypto.timingSafeEqual(next, current);
}

export function getContent() {
  const settings = Object.fromEntries(
    db.prepare('SELECT key, value FROM site_settings').all().map((row) => [row.key, row.value]),
  );
  const blocks = db.prepare('SELECT section, field_key, value FROM content_blocks').all();
  const sections = {};
  for (const row of blocks) {
    sections[row.section] ||= {};
    sections[row.section][row.field_key] = row.value;
  }
  const listRows = db.prepare('SELECT * FROM list_items ORDER BY list_key, sort_order, id').all();
  const lists = {};
  for (const row of listRows) {
    lists[row.list_key] ||= [];
    lists[row.list_key].push(row);
  }
  return {
    settings,
    platforms: db.prepare('SELECT * FROM platforms ORDER BY sort_order, id').all(),
    holes: db.prepare('SELECT * FROM holes ORDER BY hole').all(),
    articles: db.prepare('SELECT * FROM articles ORDER BY sort_order, id').all(),
    faqs: db.prepare('SELECT * FROM faqs ORDER BY sort_order, id').all(),
    gallery: db.prepare('SELECT * FROM book_gallery ORDER BY sort_order, id').all(),
    nav: db.prepare('SELECT * FROM nav_links ORDER BY sort_order, id').all(),
    sections,
    lists,
  };
}

export function replaceTable(table, rows, insertSql, bind) {
  const insert = db.prepare(insertSql);
  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM ${table}`).run();
    for (const row of rows) insert.run(bind(row));
  });
  tx();
}

export function syncSeedContent() {
  try {
    const data = getContent();
    const seedPath = path.join(__dirname, '../src/cms/seedContent.json');
    fs.writeFileSync(seedPath, JSON.stringify(data, null, 2), 'utf8');
  } catch { /* quiet */ }
}

export { hashPassword };
