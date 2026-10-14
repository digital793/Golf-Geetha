const SESSION_KEY = 'gg_session_id';

export function getSessionId() {
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function post(url, body) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView(page, language = '') {
  post('/api/track/pageview', {
    sessionId: getSessionId(),
    page,
    referrer: document.referrer || '',
    language,
  });
}

export function trackPlatformClick(platformSlug, source, page) {
  post('/api/track/platform', {
    sessionId: getSessionId(),
    platformSlug,
    source,
    page,
  });
}

export function trackEvent(name, payload = {}) {
  post('/api/track/event', {
    sessionId: getSessionId(),
    name,
    payload,
  });
}

export function submitForm(type, payload) {
  return fetch(`/api/forms/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
