export const PAGE_PATHS = {
  home: '/',
  book: '/book',
  '18-holes': '/18-holes',
  speaking: '/speaking',
  events: '/speaking',
  author: '/author',
  articles: '/articles',
  discover: '/discover',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
};

const PATH_PAGES = {
  '/': 'home',
  '/book': 'book',
  '/18-holes': '18-holes',
  '/speaking': 'speaking',
  '/events': 'speaking',
  '/author': 'author',
  '/articles': 'articles',
  '/discover': 'discover',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/cookies': 'cookies',
};

const APP_PAGES = new Set(Object.keys(PAGE_PATHS));

export function normalizePath(pathname) {
  const clean = String(pathname || '/').split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean || '/';
}

export function pageFromPath(pathname) {
  return PATH_PAGES[normalizePath(pathname)] || 'home';
}

export function pathFromPage(pageId) {
  return PAGE_PATHS[pageId] || '/';
}

export function isAppPage(pageId) {
  return APP_PAGES.has(pageId);
}

export function isModifiedClick(event) {
  return Boolean(
    event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button === 1,
  );
}
