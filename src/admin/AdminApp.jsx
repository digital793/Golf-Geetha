import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LanguageProvider } from '../i18n.jsx';
import { CmsProvider, parseExtra } from '../cms/CmsContext';
import { buildDefaultContent, fieldMeta } from '../cms/defaults';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { BattlefieldSection } from '../components/BattlefieldSection';
import { TheTurn } from '../components/TheTurn';
import { ArticlesSection } from '../components/ArticlesSection';
import { CaddiesNoteSection } from '../components/CaddiesNoteSection';
import { WhereToBuyModal } from '../components/WhereToBuyModal';
import { ScorecardNine } from '../components/ScorecardNine';
import { AuthorPage } from '../components/AuthorPage';
import { ContactPage } from '../components/ContactPage';
import { BookPage } from '../components/BookPage';
import { EighteenHolesPage } from '../components/EighteenHolesPage';
import { SpeakingPage } from '../components/SpeakingPage';
import { ArticlesPage } from '../components/ArticlesPage';
import './admin.css';

const PATTERN_DEFAULTS = {
  pattern_size: '79',
  pattern_offset_x: '40',
  pattern_offset_y: '45',
  pattern_opacity: '38',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'holes', label: '18 Holes' },
  { id: 'brand', label: 'Brand & Logos' },
  { id: 'home', label: 'Home' },
  { id: 'book', label: 'The Book' },
  { id: 'eighteen', label: '18 Holes Page' },
  { id: 'speaking', label: 'Speaking & Retreats' },
  { id: 'author', label: 'Author' },
  { id: 'articles', label: 'Articles' },
  { id: 'contact', label: 'Contact' },
  { id: 'submissions', label: 'Inbox' },
  { id: 'chat_users', label: 'Chatbot Users' },
  { id: 'languages', label: 'Languages' },
];

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API offline or returned non-JSON');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function Preview({ content, children, mode = 'site' }) {
  const shellRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [innerHeight, setInnerHeight] = useState(720);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;
    const update = () => {
      setScale(Math.min(1, (shell.clientWidth || 900) / 1280));
      setInnerHeight(inner.scrollHeight || 720);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [content, children, mode]);

  const visualHeight = Math.round(innerHeight * scale);

  return (
    <div className="cms-preview-block">
      <div className="cms-preview-label">How it looks on the site</div>
      <div ref={shellRef} className={`cms-preview-clip ${mode === 'modal' ? 'is-modal' : ''}`}>
        <div className="cms-preview-sizer" style={{ height: visualHeight }}>
          <div
            ref={innerRef}
            className="cms-preview-inner golf-gita-app"
            inert
            aria-hidden="true"
            style={{ width: 1280, transform: `scale(${scale})` }}
          >
            <LanguageProvider>
              <CmsProvider override={content}>{children}</CmsProvider>
            </LanguageProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

function parsePayload(payload) {
  try {
    const value = JSON.parse(payload);
    if (value && typeof value === 'object') return value;
  } catch {
    /* use raw */
  }
  return { message: payload };
}

function prettyLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

const INBOX_TYPES = {
  newsletter: 'Newsletter',
  contact: 'Contact form',
  speaking: 'Speaking enquiry',
  sample: 'Sample request',
  enquire: 'Session enquiry',
};

function ImageField({ label, value, onChange, spec }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const data = await api('/api/admin/upload', { method: 'POST', body });
      if (data?.url) {
        onChange(data.url);
        return;
      }
      throw new Error(data?.error || 'No URL returned');
    } catch (err) {
      console.warn('Server upload failed, using Data URL fallback:', err);
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } catch (readErr) {
        setError(err.message || 'Upload failed');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cms-field">
      <label>{label}</label>
      {spec && (
        <div style={{
          background: 'rgba(83, 37, 110, 0.07)',
          border: '1px solid rgba(83, 37, 110, 0.2)',
          borderRadius: '6px',
          padding: '8px 12px',
          marginBottom: '10px',
          fontSize: '12px',
          color: '#53256e',
          lineHeight: 1.6,
        }}>
          <strong style={{ display: 'block', marginBottom: '2px' }}>📐 Recommended Spec</strong>
          {spec.dimensions && <span>Size: <strong>{spec.dimensions}</strong>{spec.dpi ? ` · ${spec.dpi} DPI` : ''}</span>}
          {spec.formats && <span style={{ display: 'block' }}>Format: <strong>{spec.formats}</strong></span>}
          {spec.notes && <span style={{ display: 'block', opacity: 0.8 }}>{spec.notes}</span>}
        </div>
      )}
      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <img
            src={value}
            alt=""
            className="cms-thumb"
            style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <button
            type="button"
            className="cms-btn danger"
            style={{ padding: '4px 10px', fontSize: '12px' }}
            onClick={() => onChange('')}
          >
            Clear image
          </button>
        </div>
      ) : null}
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or choose a file below"
      />
      <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
      {busy ? <span className="cms-muted" style={{ color: '#53256E' }}>Uploading…</span> : null}
      {error ? <span className="cms-muted" style={{ color: '#d9534f' }}>{error}</span> : null}
    </div>
  );
}

function RangeField({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <div className="cms-field cms-range">
      <label>
        <span>{label}</span>
        <span className="cms-range-value">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Fields({ meta, values, onChange }) {
  return meta.map((field) => (
    field.type === 'image' ? (
      <ImageField
        key={field.key}
        label={field.label}
        spec={field.spec}
        value={values[field.key] || ''}
        onChange={(value) => onChange({ ...values, [field.key]: value })}
      />
    ) : (
      <div className="cms-field" key={field.key}>
        <label>{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea
            value={values[field.key] || ''}
            onChange={(e) => onChange({ ...values, [field.key]: e.target.value })}
          />
        ) : (
          <input
            value={values[field.key] || ''}
            onChange={(e) => onChange({ ...values, [field.key]: e.target.value })}
          />
        )}
      </div>
    )
  ));
}

function BarList({ rows, labelKey, valueKey = 'count' }) {
  const max = Math.max(1, ...rows.map((row) => Number(row[valueKey] || 0)));
  return rows.map((row) => (
    <div className="cms-bar-row" key={row[labelKey] || row.day}>
      <span>{row[labelKey] || row.day}</span>
      <div className="cms-bar"><span style={{ width: `${(Number(row[valueKey]) / max) * 100}%` }} /></div>
      <b>{row[valueKey]}</b>
    </div>
  ));
}

function Dashboard({ analytics, setDays }) {
  if (!analytics || !analytics.totals) {
    return <p style={{ padding: '24px', color: '#666' }}>Loading analytics…</p>;
  }
  const totals = analytics.totals || {};
  return (
    <>
      <h1>Traffic & platform clicks</h1>
      <p className="cms-lead">
        Live tracking from the public site: page views, unique sessions, Where to Buy popup opens, and clicks on Amazon, Flipkart, Kindle (and any platforms you add).
      </p>
      <div className="cms-tabs">
        {[7, 14, 30].map((day) => (
          <button key={day} className={(analytics.days || 30) === day ? 'active' : ''} onClick={() => setDays(day)}>
            Last {day} days
          </button>
        ))}
      </div>
      <div className="cms-stats">
        <div className="cms-stat"><b>{totals.views ?? 0}</b><span>Page views</span></div>
        <div className="cms-stat"><b>{totals.visitors ?? 0}</b><span>Unique visitors</span></div>
        <div className="cms-stat"><b>{totals.buy_opens ?? 0}</b><span>Where to Buy opens</span></div>
        <div className="cms-stat"><b>{totals.platform_clicks ?? 0}</b><span>Platform clicks</span></div>
      </div>
      <div className="cms-grid-2">
        <div className="cms-panel">
          <h3>Views by page</h3>
          <BarList rows={analytics.viewsByPage || []} labelKey="page" />
        </div>
        <div className="cms-panel">
          <h3>Clicks by platform</h3>
          <BarList rows={analytics.platformClicks || []} labelKey="platform_name" />
          <h3 style={{ marginTop: 24 }}>Click source</h3>
          <BarList rows={analytics.clicksBySource || []} labelKey="source" />
        </div>
      </div>
      <div className="cms-grid-2" style={{ marginTop: 18 }}>
        <div className="cms-panel">
          <h3>Daily traffic</h3>
          <BarList rows={analytics.viewsByDay || []} labelKey="day" />
        </div>
        <div className="cms-panel">
          <h3>Recent platform clicks</h3>
          <table className="cms-table">
            <thead><tr><th>Platform</th><th>Source</th><th>Page</th><th>When</th></tr></thead>
            <tbody>
              {(analytics.recentClicks || []).map((row, i) => (
                <tr key={i}><td>{row.platform_name}</td><td>{row.source}</td><td>{row.page}</td><td>{String(row.created_at || '').slice(0, 16).replace('T', ' ')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');
  const [content, setContent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [days, setDays] = useState(30);
  const [submissions, setSubmissions] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [homeTab, setHomeTab] = useState('hero');
  const [speakingTab, setSpeakingTab] = useState('copy');
  const [openHole, setOpenHole] = useState(1);
  const [inboxFilter, setInboxFilter] = useState('all');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    api('/api/admin/me')
      .then(() => setAuthed(true))
      .catch(() => {
        const sessionToken = window.sessionStorage.getItem('gg_offline_admin');
        if (sessionToken === 'true') {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    api('/api/content')
      .then((data) => {
        if (data && typeof data === 'object' && data.sections) {
          setContent(data);
          setDraft(structuredClone(data));
          try {
            window.localStorage.setItem('gg_cms_content_override', JSON.stringify(data));
          } catch { /* quiet */ }
        } else {
          throw new Error('Invalid content payload');
        }
      })
      .catch(() => {
        let fallback = buildDefaultContent();
        try {
          const cached = window.localStorage.getItem('gg_cms_content_override');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.sections) fallback = parsed;
          }
        } catch { /* quiet */ }
        setContent(fallback);
        setDraft(structuredClone(fallback));
      });
  }, [authed]);

  useEffect(() => {
    if (!authed || page !== 'dashboard') return;
    api(`/api/admin/analytics?days=${days}`)
      .then((data) => {
        if (data && data.totals) {
          setAnalytics(data);
        } else {
          throw new Error('Invalid analytics payload');
        }
      })
      .catch(() => {
        setAnalytics({
          days,
          totals: { views: 0, visitors: 0, buy_opens: 0, platform_clicks: 0 },
          viewsByDay: [],
          viewsByPage: [],
          platformClicks: [],
          clicksBySource: [],
          clicksByDay: [],
          recentViews: [],
          recentClicks: [],
        });
      });
  }, [authed, page, days]);

  useEffect(() => {
    if (!authed || page !== 'submissions') return;
    api('/api/admin/submissions')
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]));
  }, [authed, page]);

  useEffect(() => {
    if (!authed || page !== 'chat_users') return;
    api('/api/admin/chat-profiles')
      .then((data) => setChatUsers(Array.isArray(data) ? data : []))
      .catch(() => {
        try {
          const raw = window.localStorage.getItem('gg_bot_profile_cache');
          if (raw) {
            const parsed = JSON.parse(raw);
            setChatUsers([{
              local_id: 'local-session',
              profile: parsed.profile || {},
              topics: parsed.topics || [],
              privacy_accepted: parsed.privacyAccepted,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }]);
          } else {
            setChatUsers([]);
          }
        } catch {
          setChatUsers([]);
        }
      });
  }, [authed, page]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [page, homeTab, speakingTab]);

  const saveNotice = () => {
    setSaved('Saved');
    setTimeout(() => setSaved(''), 1800);
  };

  const persist = async (path, body) => {
    try {
      const data = await api(path, { method: 'PUT', body: JSON.stringify(body) });
      setContent(data);
      setDraft(structuredClone(data));
      try {
        window.localStorage.setItem('gg_cms_content_override', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('gg_cms_updated', { detail: data }));
      } catch { /* quiet */ }
      saveNotice();
    } catch {
      // Offline / static preview fallback (e.g. Vercel preview):
      // Update draft and content in local state, and sync immediately to localStorage & CustomEvent
      // so public pages (e.g. /author, /book, etc.) reflect it immediately!
      const currentDraft = draft ? structuredClone(draft) : buildDefaultContent();
      setContent(currentDraft);
      try {
        window.localStorage.setItem('gg_cms_content_override', JSON.stringify(currentDraft));
        window.dispatchEvent(new CustomEvent('gg_cms_updated', { detail: currentDraft }));
      } catch { /* quiet */ }
      saveNotice();
    }
  };

  if (checking) return <div className="cms-login"><p style={{ color: '#fff' }}>Loading CMS…</p></div>;

  if (!authed) {
    return (
      <div className="cms-login">
        <form
          className="cms-login-card"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            const form = new FormData(e.currentTarget);
            try {
              await api('/api/admin/login', {
                method: 'POST',
                body: JSON.stringify({
                  username: form.get('username'),
                  password: form.get('password'),
                }),
              });
              setAuthed(true);
            } catch (err) {
              const u = form.get('username');
              const p = form.get('password');
              if (u === 'admin' && p === 'GolfGita@2026') {
                window.sessionStorage.setItem('gg_offline_admin', 'true');
                setAuthed(true);
              } else {
                setError(err.message || 'Invalid credentials');
              }
            }
          }}
        >
          <img
            src="/images/golf_gita_emblem_gold_purple.svg"
            alt="Golf Gita"
            style={{ width: '64px', height: '64px', margin: '0 auto 16px', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(246, 184, 52, 0.4))' }}
          />
          <h1>Golf Gita CMS</h1>
          <p>Sign in to manage content, images, icons, and traffic.</p>
          {error ? <p className="cms-error">{error}</p> : null}
          <div className="cms-field"><label>Username</label><input name="username" autoComplete="username" defaultValue={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="cms-field"><label>Password</label><input name="password" type="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} /></div>
          <p className="cms-hint">Default login: admin / GolfGita@2026</p>
          <button className="cms-btn" type="submit">Enter dashboard</button>
        </form>
      </div>
    );
  }

  if (!draft) return <div className="cms-main">Loading content…</div>;

  const previewContent = draft;

  return (
    <div className="cms-root">
      <div className="cms-shell">
        <aside className="cms-sidebar">
          <div className="cms-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/golf_gita_emblem_gold_purple.svg"
              alt="Golf Gita"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <span>Golf Gita CMS</span>
          </div>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`cms-nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => {
                window.scrollTo(0, 0);
                setPage(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            className="cms-logout"
            onClick={async () => {
              try { await api('/api/admin/logout', { method: 'POST' }); } catch { /* quiet */ }
              window.sessionStorage.removeItem('gg_offline_admin');
              setAuthed(false);
            }}
          >
            Log out
          </button>
        </aside>
        <main className="cms-main">
          {saved ? <p className="cms-muted">{saved}</p> : null}

          {page === 'dashboard' && <Dashboard analytics={analytics} setDays={setDays} />}

          {page === 'languages' && <LanguageSettings />}

          {page === 'platforms' && (
            <>
              <h1>Buy platforms</h1>
              <p className="cms-lead">Edited once here, then used in the Where to Buy popup and the footer “Available on” icons. Clicks are tracked per platform.</p>
              <div className="cms-stack">
                <div>
                  {draft.platforms.map((item, index) => (
                    <div className="cms-item" key={item.slug || index}>
                      <div className="cms-item-head">
                        <strong>{item.name || 'New platform'}</strong>
                        <button className="cms-btn danger" onClick={() => setDraft({ ...draft, platforms: draft.platforms.filter((_, i) => i !== index) })}>Remove</button>
                      </div>
                      <div className="cms-field"><label>Name</label><input value={item.name} onChange={(e) => {
                        const platforms = [...draft.platforms]; platforms[index] = { ...item, name: e.target.value }; setDraft({ ...draft, platforms });
                      }} /></div>
                      <div className="cms-field"><label>Slug</label><input value={item.slug} onChange={(e) => {
                        const platforms = [...draft.platforms]; platforms[index] = { ...item, slug: e.target.value }; setDraft({ ...draft, platforms });
                      }} /></div>
                      <div className="cms-field"><label>Formats</label><input value={item.formats} onChange={(e) => {
                        const platforms = [...draft.platforms]; platforms[index] = { ...item, formats: e.target.value }; setDraft({ ...draft, platforms });
                      }} /></div>
                      <div className="cms-field"><label>URL</label><input value={item.url} onChange={(e) => {
                        const platforms = [...draft.platforms]; platforms[index] = { ...item, url: e.target.value }; setDraft({ ...draft, platforms });
                      }} /></div>
                      <ImageField
                        label="Platform Icon"
                        spec={{ dimensions: '120 × 120 px', formats: 'PNG or SVG with transparent background', dpi: 144, notes: 'Platform store logo (Amazon, Flipkart, etc). Square with transparent bg.' }}
                        value={item.icon}
                        onChange={(icon) => {
                          const platforms = [...draft.platforms]; platforms[index] = { ...item, icon }; setDraft({ ...draft, platforms });
                        }}
                      />
                      <label><input type="checkbox" checked={Boolean(item.is_active)} onChange={(e) => {
                        const platforms = [...draft.platforms]; platforms[index] = { ...item, is_active: e.target.checked ? 1 : 0 }; setDraft({ ...draft, platforms });
                      }} /> Active</label>
                    </div>
                  ))}
                  <div className="cms-actions">
                    <button className="cms-btn secondary" onClick={() => setDraft({
                      ...draft,
                      platforms: [...draft.platforms, { slug: `platform-${Date.now()}`, name: '', formats: '', icon: '', url: '', is_active: 1 }],
                    })}>Add platform</button>
                    <button className="cms-btn" onClick={() => persist('/api/admin/platforms', draft.platforms)}>Save platforms</button>
                  </div>
                </div>
                <Preview content={previewContent} mode="modal">
                  <WhereToBuyModal isOpen onClose={() => {}} page="admin-preview" />
                </Preview>
              </div>
            </>
          )}

          {page === 'holes' && (
            <>
              <h1>18 Holes / Chapters</h1>
              <p className="cms-lead">One record per hole. The same data fills the home scorecards, the Book chapters overview, and the 18 Holes page. Edit once, it updates everywhere.</p>
              <div className="cms-stack">
                <div className="cms-hole-list">
                  {draft.holes.map((hole, index) => {
                    const open = openHole === hole.hole;
                    const updateHole = (patch) => {
                      const holes = [...draft.holes];
                      holes[index] = { ...hole, ...patch };
                      setDraft({ ...draft, holes });
                    };
                    return (
                      <div className={`cms-hole-card ${open ? 'is-open' : ''}`} key={hole.hole}>
                        <button type="button" className="cms-hole-toggle" onClick={() => setOpenHole(open ? 0 : hole.hole)}>
                          <span className="cms-hole-num">{String(hole.hole).padStart(2, '0')}</span>
                          <span className="cms-hole-title">{hole.title}</span>
                          <span className="cms-hole-meta">Par {hole.par} · {hole.distance}</span>
                        </button>
                        {open && (
                          <div className="cms-hole-fields">
                            <div className="cms-field cms-span-2">
                              <label>Title</label>
                              <input value={hole.title} onChange={(e) => updateHole({ title: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Subtitle</label>
                              <input value={hole.subtitle} onChange={(e) => updateHole({ subtitle: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Par</label>
                              <input value={hole.par} onChange={(e) => updateHole({ par: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Distance</label>
                              <input value={hole.distance} onChange={(e) => updateHole({ distance: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Numeral</label>
                              <input value={hole.numeral} onChange={(e) => updateHole({ numeral: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Sanskrit</label>
                              <input value={hole.sanskrit} onChange={(e) => updateHole({ sanskrit: e.target.value })} />
                            </div>
                            <div className="cms-field">
                              <label>Devanagari</label>
                              <input value={hole.devanagari} onChange={(e) => updateHole({ devanagari: e.target.value })} />
                            </div>
                            <div className="cms-field cms-span-all">
                              <label>Description</label>
                              <textarea value={hole.description} onChange={(e) => updateHole({ description: e.target.value })} />
                            </div>
                            <div className="cms-span-all">
                              <ImageField
                                label="Hole Image"
                                spec={{
                                  dimensions: '800 × 800 px (1:1 square) or 800 × 600 px (4:3)',
                                  formats: 'PNG, JPG or WebP',
                                  dpi: 72,
                                  notes: 'Hole emblem/artwork displayed in scorecard and 18 Holes chapter modal.'
                                }}
                                value={hole.image}
                                onChange={(image) => updateHole({ image })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button className="cms-btn" onClick={() => persist('/api/admin/holes', draft.holes)}>Save all holes</button>
                </div>
                <Preview content={previewContent}>
                  <ScorecardNine
                    key={openHole || 'front'}
                    title={openHole > 9 ? 'BACK NINE' : 'FRONT NINE'}
                    holes={(previewContent?.holes || []).filter((h) => (openHole > 9 ? h.hole > 9 : h.hole <= 9))}
                    defaultActive={openHole > 9 ? Math.max(0, openHole - 10) : Math.max(0, (openHole || 1) - 1)}
                  />
                </Preview>
              </div>
            </>
          )}

          {page === 'brand' && (
            <>
              <h1>Brand, logos & global copy</h1>
              <p className="cms-lead">Logos, book cover, Sanskrit watermark, copyright, and the header Buy button. These appear across header, hero, newsletter, and footer.</p>
              <div className="cms-stack">
                <div className="cms-form">
                  <Fields meta={fieldMeta.settings} values={draft.settings} onChange={(settings) => setDraft({ ...draft, settings })} />
                  <button className="cms-btn" onClick={() => persist('/api/admin/settings', draft.settings)}>Save brand</button>
                </div>
                <Preview content={previewContent}>
                  <div className="hero-master-container">
                    <Header onBuyClick={() => {}} activePage="home" onNavigate={() => {}} theme="dark" />
                    <Hero onBuyClick={() => {}} onSampleClick={() => {}} />
                  </div>
                </Preview>
              </div>
            </>
          )}

          {page === 'home' && (
            <>
              <h1>Home page</h1>
              <p className="cms-lead">Section copy and images. The Turn is shared with the 18 Holes page. Platforms and holes are edited in their own screens so you never enter them twice.</p>
              <div className="cms-tabs">
                {['hero', 'battlefield', 'home_ui', 'the_turn', 'newsletter', 'buy_modal', 'sample_modal'].map((tab) => (
                  <button key={tab} className={homeTab === tab ? 'active' : ''} onClick={() => setHomeTab(tab)}>{tab.replaceAll('_', ' ')}</button>
                ))}
              </div>
              <div className="cms-stack">
                <div className="cms-form">
                  {homeTab === 'hero' && (
                    <>
                      <Fields meta={fieldMeta.hero} values={draft.sections.hero} onChange={(hero) => setDraft({ ...draft, sections: { ...draft.sections, hero } })} />
                      <h3>Marquee phrases</h3>
                      {(draft.lists.marquee || []).map((item, index) => (
                        <div className="cms-field" key={item.id || index}>
                          <input value={item.title} onChange={(e) => {
                            const marquee = [...draft.lists.marquee]; marquee[index] = { ...item, title: e.target.value };
                            setDraft({ ...draft, lists: { ...draft.lists, marquee } });
                          }} />
                        </div>
                      ))}
                      <button className="cms-btn secondary" onClick={() => setDraft({
                        ...draft,
                        lists: { ...draft.lists, marquee: [...draft.lists.marquee, { title: '' }] },
                      })}>Add phrase</button>
                    </>
                  )}
                  {homeTab !== 'hero' && (
                    <Fields
                      meta={fieldMeta[homeTab]}
                      values={draft.sections[homeTab]}
                      onChange={(value) => setDraft({ ...draft, sections: { ...draft.sections, [homeTab]: value } })}
                    />
                  )}
                  <div className="cms-actions">
                    <button className="cms-btn" onClick={async () => {
                      await persist(`/api/admin/sections/${homeTab === 'hero' ? 'hero' : homeTab}`, draft.sections[homeTab === 'hero' ? 'hero' : homeTab]);
                      if (homeTab === 'hero') await persist('/api/admin/lists/marquee', draft.lists.marquee);
                    }}>Save section</button>
                  </div>
                </div>
                {homeTab === 'hero' && <Preview content={previewContent}><Hero onBuyClick={() => {}} onSampleClick={() => {}} /></Preview>}
                {homeTab === 'battlefield' && <Preview content={previewContent}><BattlefieldSection /></Preview>}
                {homeTab === 'the_turn' && <Preview content={previewContent}><TheTurn /></Preview>}
                {homeTab === 'home_ui' && <Preview content={previewContent}><ArticlesSection onArticleClick={() => {}} onNavigate={() => {}} /></Preview>}
                {homeTab === 'newsletter' && <Preview content={previewContent}><CaddiesNoteSection /></Preview>}
                {homeTab === 'buy_modal' && <Preview content={previewContent} mode="modal"><WhereToBuyModal isOpen onClose={() => {}} /></Preview>}
                {homeTab === 'sample_modal' && (
                  <div className="cms-panel">
                    <h3>{draft.sections.sample_modal.title}</h3>
                    <p>{draft.sections.sample_modal.body}</p>
                    <button className="cms-btn">{draft.sections.sample_modal.cta}</button>
                  </div>
                )}
              </div>
            </>
          )}

          {page === 'book' && (
            <>
              <h1>The Book</h1>
              <p className="cms-lead">Book description, gallery, formats, audience list, and FAQs. Chapter cards come from the shared 18 Holes records.</p>
              <div className="cms-stack">
                <div>
                  <div className="cms-form">
                    <Fields meta={fieldMeta.book} values={draft.sections.book} onChange={(book) => setDraft({ ...draft, sections: { ...draft.sections, book } })} />
                    <button className="cms-btn" onClick={() => persist('/api/admin/sections/book', draft.sections.book)}>Save book copy</button>
                  </div>
                  <h3>Gallery</h3>
                  {(draft.gallery || []).map((item, index) => (
                    <div key={item.id || index} style={{ marginBottom: '16px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', textTransform: 'uppercase', color: '#53256E' }}>
                          Image {index + 1}
                        </strong>
                        {draft.gallery.length > 1 && (
                          <button
                            type="button"
                            className="cms-btn danger"
                            style={{ padding: '2px 8px', fontSize: '11px' }}
                            onClick={() => {
                              const gallery = draft.gallery.filter((_, i) => i !== index);
                              setDraft({ ...draft, gallery });
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <ImageField
                        label="Gallery Image"
                        spec={{
                          dimensions: '1200 × 800 px (3:2 landscape) or 1000 × 1000 px (square)',
                          formats: 'JPG or WebP',
                          dpi: 72,
                          notes: 'High-res book gallery image displayed on The Book page.'
                        }}
                        value={item.image}
                        onChange={(image) => {
                          const gallery = [...draft.gallery];
                          gallery[index] = { ...item, image };
                          setDraft({ ...draft, gallery });
                        }}
                      />
                    </div>
                  ))}
                  <div className="cms-actions" style={{ marginTop: '12px', marginBottom: '24px' }}>
                    <button
                      type="button"
                      className="cms-btn secondary"
                      onClick={() => {
                        const gallery = [...(draft.gallery || []), { image: '', sort_order: (draft.gallery?.length || 0) + 1 }];
                        setDraft({ ...draft, gallery });
                      }}
                    >
                      + Add image slot
                    </button>
                    <button
                      type="button"
                      className="cms-btn"
                      onClick={() => persist('/api/admin/gallery', draft.gallery)}
                    >
                      Save gallery
                    </button>
                  </div>
                  <h3>Who is this for?</h3>
                  {(draft.lists.who_for || []).map((item, index) => (
                    <div className="cms-field" key={item.id || index}>
                      <input value={item.title} onChange={(e) => {
                        const who_for = [...draft.lists.who_for]; who_for[index] = { ...item, title: e.target.value };
                        setDraft({ ...draft, lists: { ...draft.lists, who_for } });
                      }} />
                    </div>
                  ))}
                  <button className="cms-btn secondary" onClick={() => persist('/api/admin/lists/who_for', draft.lists.who_for)}>Save audience list</button>
                  <h3>FAQs</h3>
                  {draft.faqs.map((faq, index) => (
                    <div className="cms-item" key={faq.id || index}>
                      <div className="cms-field"><label>Question</label><input value={faq.question} onChange={(e) => {
                        const faqs = [...draft.faqs]; faqs[index] = { ...faq, question: e.target.value }; setDraft({ ...draft, faqs });
                      }} /></div>
                      <div className="cms-field"><label>Answer</label><textarea value={faq.answer} onChange={(e) => {
                        const faqs = [...draft.faqs]; faqs[index] = { ...faq, answer: e.target.value }; setDraft({ ...draft, faqs });
                      }} /></div>
                    </div>
                  ))}
                  <button className="cms-btn" onClick={() => persist('/api/admin/faqs', draft.faqs)}>Save FAQs</button>
                </div>
                <Preview content={previewContent}>
                  <BookPage onBuyClick={() => {}} onSampleClick={() => {}} />
                </Preview>
              </div>
            </>
          )}

          {page === 'eighteen' && (
            <>
              <h1>18 Holes page intro</h1>
              <p className="cms-lead">Only the page hero is unique here. Hole cards and The Turn are reused from the shared Holes and Home → The Turn editors.</p>
              <div className="cms-stack">
                <div className="cms-form">
                  <Fields meta={fieldMeta.eighteen} values={draft.sections.eighteen} onChange={(eighteen) => setDraft({ ...draft, sections: { ...draft.sections, eighteen } })} />
                  <button className="cms-btn" onClick={() => persist('/api/admin/sections/eighteen', draft.sections.eighteen)}>Save</button>
                </div>
                <Preview content={previewContent}>
                  <EighteenHolesPage onBuyClick={() => {}} onNavigate={() => {}} />
                </Preview>
              </div>
            </>
          )}

          {page === 'speaking' && (
            <>
              <h1>Speaking & retreats</h1>
              <p className="cms-lead">Page copy, audience cards (with icons), retreat steps, floral pattern, and meta. The home speaking teaser is edited under Home.</p>
              <div className="cms-tabs">
                {['copy', 'pattern', 'audiences', 'steps', 'meta'].map((tab) => (
                  <button key={tab} className={speakingTab === tab ? 'active' : ''} onClick={() => setSpeakingTab(tab)}>{tab}</button>
                ))}
              </div>
              {speakingTab === 'copy' && (
                <div className="cms-form">
                  <Fields meta={fieldMeta.speaking_page} values={draft.sections.speaking_page} onChange={(speaking_page) => setDraft({ ...draft, sections: { ...draft.sections, speaking_page } })} />
                  <button className="cms-btn" onClick={() => persist('/api/admin/sections/speaking_page', draft.sections.speaking_page)}>Save copy</button>
                </div>
              )}
              {speakingTab === 'pattern' && (() => {
                const speaking = { ...PATTERN_DEFAULTS, ...(draft.sections.speaking_page || {}) };
                const setPattern = (patch) => {
                  setDraft({
                    ...draft,
                    sections: {
                      ...draft.sections,
                      speaking_page: { ...(draft.sections.speaking_page || {}), ...patch },
                    },
                  });
                };
                return (
                  <div className="cms-stack">
                    <div className="cms-form">
                      <p className="cms-muted">Adjust the four-corner floral watermark on the Speaking hero. Changes preview live; save to publish.</p>
                      <RangeField
                        label="Pattern size"
                        unit="%"
                        min={40}
                        max={110}
                        step={0.5}
                        value={speaking.pattern_size}
                        onChange={(pattern_size) => setPattern({ pattern_size })}
                      />
                      <RangeField
                        label="Side position"
                        unit="%"
                        min={0}
                        max={70}
                        step={0.5}
                        value={speaking.pattern_offset_x}
                        onChange={(pattern_offset_x) => setPattern({ pattern_offset_x })}
                      />
                      <RangeField
                        label="Top / bottom position"
                        unit="%"
                        min={0}
                        max={70}
                        step={0.5}
                        value={speaking.pattern_offset_y}
                        onChange={(pattern_offset_y) => setPattern({ pattern_offset_y })}
                      />
                      <RangeField
                        label="Pattern strength"
                        unit="%"
                        min={5}
                        max={80}
                        step={1}
                        value={speaking.pattern_opacity}
                        onChange={(pattern_opacity) => setPattern({ pattern_opacity })}
                      />
                      <p className="cms-muted">Lower side / top values pull the art onto the page. Higher values hang it further off the corners. Size grows each corner from the edge inward.</p>
                      <div className="cms-actions">
                        <button className="cms-btn" type="button" onClick={() => persist('/api/admin/sections/speaking_page', speaking)}>Save pattern</button>
                        <button
                          className="cms-btn secondary"
                          onClick={() => setPattern(PATTERN_DEFAULTS)}
                          type="button"
                        >
                          Reset to design
                        </button>
                      </div>
                    </div>
                    <Preview content={previewContent}>
                      <SpeakingPage />
                    </Preview>
                  </div>
                );
              })()}
              {speakingTab === 'audiences' && (
                <>
                  {draft.lists.speaking_audiences.map((item, index) => {
                    const extra = parseExtra(item.extra);
                    return (
                      <div className="cms-item" key={item.id || index}>
                        <div className="cms-field"><label>Title</label><input value={item.title} onChange={(e) => {
                          const speaking_audiences = [...draft.lists.speaking_audiences];
                          speaking_audiences[index] = { ...item, title: e.target.value };
                          setDraft({ ...draft, lists: { ...draft.lists, speaking_audiences } });
                        }} /></div>
                        <div className="cms-field"><label>Description</label><textarea value={item.description} onChange={(e) => {
                          const speaking_audiences = [...draft.lists.speaking_audiences];
                          speaking_audiences[index] = { ...item, description: e.target.value };
                          setDraft({ ...draft, lists: { ...draft.lists, speaking_audiences } });
                        }} /></div>
                        <div className="cms-field"><label>For / audience line</label><input value={extra.target || ''} onChange={(e) => {
                          const speaking_audiences = [...draft.lists.speaking_audiences];
                          speaking_audiences[index] = { ...item, extra: JSON.stringify({ ...extra, target: e.target.value }) };
                          setDraft({ ...draft, lists: { ...draft.lists, speaking_audiences } });
                        }} /></div>
                        <ImageField
                          label="Icon"
                          spec={{
                            dimensions: '100 × 100 px (square)',
                            formats: 'PNG or SVG with transparent background',
                            dpi: 72,
                            notes: 'Audience pillar icon/symbol with transparent background.'
                          }}
                          value={item.icon}
                          onChange={(icon) => {
                            const speaking_audiences = [...draft.lists.speaking_audiences];
                            speaking_audiences[index] = { ...item, icon };
                            setDraft({ ...draft, lists: { ...draft.lists, speaking_audiences } });
                          }}
                        />
                      </div>
                    );
                  })}
                  <button className="cms-btn" onClick={() => persist('/api/admin/lists/speaking_audiences', draft.lists.speaking_audiences)}>Save audiences</button>
                </>
              )}
              {speakingTab === 'steps' && (
                <>
                  {draft.lists.speaking_steps.map((item, index) => {
                    const extra = parseExtra(item.extra);
                    return (
                      <div className="cms-item" key={item.id || index}>
                        <div className="cms-grid-3">
                          <div className="cms-field"><label>Numeral</label><input value={extra.numeral || ''} onChange={(e) => {
                            const speaking_steps = [...draft.lists.speaking_steps];
                            speaking_steps[index] = { ...item, extra: JSON.stringify({ ...extra, numeral: e.target.value }) };
                            setDraft({ ...draft, lists: { ...draft.lists, speaking_steps } });
                          }} /></div>
                          <div className="cms-field"><label>Sanskrit numeral</label><input value={extra.sanskrit || ''} onChange={(e) => {
                            const speaking_steps = [...draft.lists.speaking_steps];
                            speaking_steps[index] = { ...item, extra: JSON.stringify({ ...extra, sanskrit: e.target.value }) };
                            setDraft({ ...draft, lists: { ...draft.lists, speaking_steps } });
                          }} /></div>
                          <div className="cms-field"><label>Title</label><input value={item.title} onChange={(e) => {
                            const speaking_steps = [...draft.lists.speaking_steps];
                            speaking_steps[index] = { ...item, title: e.target.value };
                            setDraft({ ...draft, lists: { ...draft.lists, speaking_steps } });
                          }} /></div>
                        </div>
                        <div className="cms-field"><label>Description</label><textarea value={item.description} onChange={(e) => {
                          const speaking_steps = [...draft.lists.speaking_steps];
                          speaking_steps[index] = { ...item, description: e.target.value };
                          setDraft({ ...draft, lists: { ...draft.lists, speaking_steps } });
                        }} /></div>
                      </div>
                    );
                  })}
                  <button className="cms-btn" onClick={() => persist('/api/admin/lists/speaking_steps', draft.lists.speaking_steps)}>Save steps</button>
                </>
              )}
              {speakingTab === 'meta' && (
                <>
                  {draft.lists.retreat_meta.map((item, index) => {
                    const extra = parseExtra(item.extra);
                    return (
                      <div className="cms-item" key={item.id || index}>
                        <div className="cms-field"><label>Label</label><input value={item.title} onChange={(e) => {
                          const retreat_meta = [...draft.lists.retreat_meta];
                          retreat_meta[index] = { ...item, title: e.target.value };
                          setDraft({ ...draft, lists: { ...draft.lists, retreat_meta } });
                        }} /></div>
                        <div className="cms-field"><label>Value</label><input value={extra.value || ''} onChange={(e) => {
                          const retreat_meta = [...draft.lists.retreat_meta];
                          retreat_meta[index] = { ...item, extra: JSON.stringify({ value: e.target.value }) };
                          setDraft({ ...draft, lists: { ...draft.lists, retreat_meta } });
                        }} /></div>
                      </div>
                    );
                  })}
                  <button className="cms-btn" onClick={() => persist('/api/admin/lists/retreat_meta', draft.lists.retreat_meta)}>Save meta</button>
                </>
              )}
            </>
          )}

          {page === 'articles' && (
            <>
              <h1>Articles</h1>
              <p className="cms-lead">These cards appear on the home page and on the Articles page in the main navigation.</p>
              <div className="cms-stack">
                <div>
                  {(draft.articles || []).map((item, index) => (
                    <div className="cms-item" key={item.id || index}>
                      <div className="cms-item-head">
                        <strong>{item.title || 'New article'}</strong>
                        <button className="cms-btn danger" onClick={() => setDraft({
                          ...draft,
                          articles: draft.articles.filter((_, i) => i !== index),
                        })}>Remove</button>
                      </div>
                      <div className="cms-field"><label>Title</label><input value={item.title || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, title: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <div className="cms-field"><label>Category</label><input value={item.category || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, category: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <div className="cms-field"><label>Hole tag</label><input value={item.hole_tag || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, hole_tag: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <div className="cms-field"><label>Read time</label><input value={item.read_time || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, read_time: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <div className="cms-field"><label>Summary</label><textarea value={item.description || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, description: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <div className="cms-field"><label>Body</label><textarea value={item.body || ''} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, body: e.target.value }; setDraft({ ...draft, articles });
                      }} /></div>
                      <ImageField
                        label="Article Image"
                        spec={{
                          dimensions: '1200 × 630 px (1.9:1 landscape) or 800 × 600 px (4:3)',
                          formats: 'JPG or WebP',
                          dpi: 72,
                          notes: 'Article cover thumbnail and reading banner.'
                        }}
                        value={item.image}
                        onChange={(image) => {
                          const articles = [...draft.articles];
                          articles[index] = { ...item, image };
                          setDraft({ ...draft, articles });
                        }}
                      />
                      <label><input type="checkbox" checked={Boolean(item.is_active)} onChange={(e) => {
                        const articles = [...draft.articles]; articles[index] = { ...item, is_active: e.target.checked ? 1 : 0 }; setDraft({ ...draft, articles });
                      }} /> Published</label>
                    </div>
                  ))}
                  <div className="cms-actions">
                    <button className="cms-btn secondary" onClick={() => setDraft({
                      ...draft,
                      articles: [...(draft.articles || []), {
                        title: '', description: '', body: '', image: '', read_time: '4 min', category: '', hole_tag: '', is_active: 1,
                      }],
                    })}>Add article</button>
                    <button className="cms-btn" onClick={() => persist('/api/admin/articles', draft.articles)}>Save articles</button>
                  </div>
                </div>
                <Preview content={previewContent}>
                  <ArticlesPage onArticleClick={() => {}} />
                </Preview>
              </div>
            </>
          )}

          {page === 'author' && (
            <>
              <h1>Author</h1>
              <div className="cms-stack">
                <div className="cms-form">
                  <Fields meta={fieldMeta.author} values={draft.sections.author} onChange={(author) => setDraft({ ...draft, sections: { ...draft.sections, author } })} />
                  <div className="cms-actions">
                    <button className="cms-btn" onClick={() => persist('/api/admin/sections/author', draft.sections.author)}>Save author</button>
                  </div>
                </div>
                <Preview content={previewContent}><AuthorPage onNavigate={() => {}} /></Preview>
              </div>
            </>
          )}

          {page === 'contact' && (
            <>
              <h1>Contact</h1>
              <div className="cms-stack">
                <div className="cms-form">
                  <Fields meta={fieldMeta.contact} values={draft.sections.contact} onChange={(contact) => setDraft({ ...draft, sections: { ...draft.sections, contact } })} />
                  <h3>Social links</h3>
                  {draft.lists.social.map((item, index) => {
                    const extra = parseExtra(item.extra);
                    return (
                      <div className="cms-item" key={item.id || index}>
                        <div className="cms-field"><label>Name</label><input value={item.title} onChange={(e) => {
                          const social = [...draft.lists.social]; social[index] = { ...item, title: e.target.value };
                          setDraft({ ...draft, lists: { ...draft.lists, social } });
                        }} /></div>
                        <div className="cms-field"><label>URL</label><input value={extra.url || ''} onChange={(e) => {
                          const social = [...draft.lists.social]; social[index] = { ...item, extra: JSON.stringify({ ...extra, url: e.target.value }) };
                          setDraft({ ...draft, lists: { ...draft.lists, social } });
                        }} /></div>
                      </div>
                    );
                  })}
                  <button className="cms-btn" onClick={async () => {
                    await persist('/api/admin/sections/contact', draft.sections.contact);
                    await persist('/api/admin/lists/social', draft.lists.social);
                  }}>Save contact</button>
                </div>
                <Preview content={previewContent}><ContactPage onNavigate={() => {}} /></Preview>
              </div>
            </>
          )}

          {page === 'submissions' && (
            <>
              <h1>Inbox</h1>
              <p className="cms-lead">Submitted forms from the public site, grouped so each enquiry is easy to read.</p>
              <div className="cms-tabs">
                <button className={inboxFilter === 'all' ? 'active' : ''} onClick={() => setInboxFilter('all')}>All</button>
                {Object.entries(INBOX_TYPES).map(([id, label]) => (
                  <button key={id} className={inboxFilter === id ? 'active' : ''} onClick={() => setInboxFilter(id)}>{label}</button>
                ))}
              </div>
              {(() => {
                const rows = (Array.isArray(submissions) ? submissions : []).filter((row) => inboxFilter === 'all' || row.form_type === inboxFilter);
                if (!rows.length) {
                  return <div className="cms-empty">No submissions in this view yet.</div>;
                }
                return (
                  <div className="cms-inbox-grid">
                    {rows.map((row) => {
                      const data = parsePayload(row.payload);
                      return (
                        <article className={`cms-inbox-card type-${row.form_type}`} key={row.id}>
                          <header className="cms-inbox-head">
                            <span className={`cms-pill type-${row.form_type}`}>{INBOX_TYPES[row.form_type] || row.form_type}</span>
                            <time>
                              {new Date(row.created_at).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </time>
                          </header>
                          <dl className="cms-inbox-fields">
                            {Object.entries(data).filter(([, value]) => value !== '' && value != null).map(([key, value]) => (
                              <div key={key} className="cms-inbox-row">
                                <dt>{prettyLabel(key)}</dt>
                                <dd>{String(value)}</dd>
                              </div>
                            ))}
                          </dl>
                        </article>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}

          {page === 'chat_users' && (() => {
            const list = Array.isArray(chatUsers) ? chatUsers : [];
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h1 style={{ margin: 0 }}>Chatbot Users</h1>
                  <span className="cms-pill" style={{ background: '#39194c', color: '#ffd89a', fontWeight: 'bold' }}>
                    {list.length} {list.length === 1 ? 'Stored User' : 'Stored Users'}
                  </span>
                </div>
                <p className="cms-lead">
                  Persistent visitor profiles stored in the SQLite database to recall users across conversations. Visitors can end their session manually from the chat bot, or admins can delete records below.
                </p>

                {!list.length ? (
                  <div className="cms-empty">No chatbot user profiles stored in the database yet.</div>
                ) : (
                  <div className="cms-inbox-grid">
                    {list.map((item) => {
                    const prof = item.profile || {};
                    const topics = item.topics || [];
                    const displayName = prof.name || 'Anonymous Reader';
                    return (
                      <article className="cms-inbox-card" key={item.local_id} style={{ borderTop: '3px solid #53256e' }}>
                        <header className="cms-inbox-head">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '16px', color: '#39194c' }}>{displayName}</strong>
                            <span
                              className="cms-pill"
                              style={{
                                background: item.privacy_accepted ? 'rgba(34, 139, 34, 0.15)' : 'rgba(200, 50, 50, 0.15)',
                                color: item.privacy_accepted ? '#1b6b1b' : '#b22222',
                                fontSize: '11px',
                              }}
                            >
                              {item.privacy_accepted ? '✓ Privacy Consent Accepted' : 'No Consent'}
                            </span>
                          </div>
                          <time style={{ fontSize: '12px', color: '#888' }}>
                            {new Date(item.updated_at).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </time>
                        </header>

                        <dl className="cms-inbox-fields">
                          {prof.age && (
                            <div className="cms-inbox-row">
                              <dt>Age</dt>
                              <dd>{prof.age}</dd>
                            </div>
                          )}
                          {prof.gender && (
                            <div className="cms-inbox-row">
                              <dt>Gender</dt>
                              <dd>{prof.gender}</dd>
                            </div>
                          )}
                          {(prof.city || prof.country) && (
                            <div className="cms-inbox-row">
                              <dt>Location</dt>
                              <dd>{[prof.city, prof.country].filter(Boolean).join(', ')}</dd>
                            </div>
                          )}
                          {prof.handicap && (
                            <div className="cms-inbox-row">
                              <dt>Handicap</dt>
                              <dd>{prof.handicap}</dd>
                            </div>
                          )}
                          {prof.yearsPlaying && (
                            <div className="cms-inbox-row">
                              <dt>Experience</dt>
                              <dd>{prof.yearsPlaying}</dd>
                            </div>
                          )}
                          {prof.dominantHand && (
                            <div className="cms-inbox-row">
                              <dt>Dominant Hand</dt>
                              <dd>{prof.dominantHand}</dd>
                            </div>
                          )}
                          {prof.homeCourse && (
                            <div className="cms-inbox-row">
                              <dt>Home Course</dt>
                              <dd>{prof.homeCourse}</dd>
                            </div>
                          )}
                          {topics.length > 0 && (
                            <div className="cms-inbox-row">
                              <dt>Topics</dt>
                              <dd style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {topics.map((t) => (
                                  <span
                                    key={t}
                                    style={{
                                      fontSize: '11px',
                                      background: '#f0eaf4',
                                      color: '#53256e',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="cms-btn danger"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={async () => {
                              if (window.confirm(`Delete stored profile for "${displayName}"?`)) {
                                try {
                                  await api(`/api/admin/chat-profiles/${encodeURIComponent(item.local_id)}`, { method: 'DELETE' });
                                  setChatUsers((prev) => prev.filter((u) => u.local_id !== item.local_id));
                                } catch (err) {
                                  alert('Failed to delete user: ' + err.message);
                                }
                              }
                            }}
                          >
                            Delete User Record
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
        </main>
      </div>
    </div>
  );
}

// ─── Language catalogue ───────────────────────────────────────────────────────
const LANGUAGE_CATALOGUE = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
];

const LS_LANG_KEY = 'gg_enabled_languages';

function loadEnabledLangs() {
  try {
    const raw = window.localStorage.getItem(LS_LANG_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* quiet */ }
  return ['en']; // English always on by default
}

function saveEnabledLangs(codes) {
  try { window.localStorage.setItem(LS_LANG_KEY, JSON.stringify(codes)); } catch { /* quiet */ }
}

function LanguageSettings() {
  const [enabled, setEnabled] = React.useState(loadEnabledLangs);
  const [saved, setSaved] = React.useState(false);

  const toggle = (code) => {
    if (code === 'en') return; // English is always on
    setEnabled((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
    setSaved(false);
  };

  const handleSave = () => {
    const final = enabled.includes('en') ? enabled : ['en', ...enabled];
    saveEnabledLangs(final);
    setEnabled(final);
    setSaved(true);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('gg-languages-updated'));
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h1>Language Settings</h1>
      <p className="cms-lead">
        Enable the languages that should be available on the public site.
        <strong> English is always enabled</strong> and cannot be turned off.
        When only English is enabled, the site remains in pure English with the switcher hidden.
        When you enable additional languages, the language switcher will automatically appear for visitors.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '12px',
        marginTop: '20px',
      }}>
        {LANGUAGE_CATALOGUE.map((lang) => {
          const isEnabled = enabled.includes(lang.code);
          const isEnglish = lang.code === 'en';
          return (
            <div
              key={lang.code}
              onClick={() => toggle(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '8px',
                border: isEnabled ? '2px solid #53256e' : '1px solid #e2d9eb',
                background: isEnabled ? 'rgba(83, 37, 110, 0.06)' : '#ffffff',
                cursor: isEnglish ? 'default' : 'pointer',
                transition: 'all 0.18s ease',
                userSelect: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#39194c' }}>{lang.name}</strong>
                  <span style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: '#7b5ea7',
                    background: '#f4edf9',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}>
                    {lang.code}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>{lang.native}</div>
                {isEnglish && <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>Always on</div>}
              </div>

              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: isEnabled ? '#53256e' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'background 0.18s ease',
              }}>
                {isEnabled && '✓'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '28px',
        padding: '16px',
        background: 'rgba(83,37,110,0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(83,37,110,0.15)',
      }}>
        <strong style={{ display: 'block', marginBottom: '8px', color: '#53256e' }}>Currently enabled</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {LANGUAGE_CATALOGUE.filter((l) => enabled.includes(l.code)).map((l) => (
            <span key={l.code} style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#53256e',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {l.name} <span style={{ opacity: 0.75, fontSize: '12px' }}>({l.code})</span>
            </span>
          ))}
        </div>
      </div>

      <div className="cms-actions" style={{ marginTop: '24px' }}>
        <button className="cms-btn" onClick={handleSave}>Save language settings</button>
        {saved && <span className="cms-muted" style={{ color: 'green', marginLeft: '12px' }}>✓ Saved</span>}
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: '#fff8e1',
        borderRadius: '8px',
        border: '1px solid #ffe082',
      }}>
        <strong style={{ color: '#795548' }}>Note:</strong>
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#5d4037', lineHeight: 1.6 }}>
          Enabling a language here makes it <em>selectable</em> in the site's language switcher.
          Actual translations are defined in <code>src/i18n.jsx</code> for each language code.
          Languages without translations will fall back to English text.
        </p>
      </div>
    </>
  );
}
