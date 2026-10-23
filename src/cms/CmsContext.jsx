import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buildDefaultContent } from './defaults';

const CmsContext = createContext(null);

export function CmsProvider({ children, override }) {
  const [content, setContent] = useState(() => {
    if (override) return override;
    try {
      const cached = window.localStorage.getItem('gg_cms_content_override');
      if (cached) return JSON.parse(cached);
    } catch { /* quiet */ }
    return buildDefaultContent();
  });
  const [loaded, setLoaded] = useState(Boolean(override));

  useEffect(() => {
    if (override) {
      setContent(override);
      setLoaded(true);
      return;
    }
    let cancelled = false;

    // Listen for live updates from admin in same tab or other tabs
    const handleStorageUpdate = (e) => {
      if (e.key === 'gg_cms_content_override' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch { /* quiet */ }
      }
    };
    const handleCustomUpdate = (e) => {
      if (e.detail) {
        setContent(e.detail);
      }
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('gg_cms_updated', handleCustomUpdate);

    fetch('/api/content')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) return res.json();
        return Promise.reject(new Error('Non-JSON response'));
      })
      .then((data) => {
        if (!cancelled && data && data.sections) {
          const defaults = buildDefaultContent();
          const mergedSections = { ...defaults.sections };
          for (const [key, fields] of Object.entries(data.sections || {})) {
            mergedSections[key] = { ...(mergedSections[key] || {}), ...fields };
          }
          const finalContent = {
            ...defaults,
            ...data,
            settings: { ...defaults.settings, ...(data.settings || {}) },
            sections: mergedSections,
          };
          setContent(finalContent);
          try {
            window.localStorage.setItem('gg_cms_content_override', JSON.stringify(finalContent));
          } catch { /* quiet */ }
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          try {
            const cached = window.localStorage.getItem('gg_cms_content_override');
            if (cached) {
              setContent(JSON.parse(cached));
            }
          } catch { /* quiet */ }
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('gg_cms_updated', handleCustomUpdate);
    };
  }, [override]);

  const value = useMemo(
    () => ({
      ...content,
      loaded,
      frontNine: (content.holes || []).filter((hole) => hole.hole <= 9),
      backNine: (content.holes || []).filter((hole) => hole.hole > 9),
    }),
    [content, loaded],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}

export function parseExtra(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === 'object') return { ...fallback, ...value };
  try {
    return { ...fallback, ...JSON.parse(value) };
  } catch {
    return fallback;
  }
}
