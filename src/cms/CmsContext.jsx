import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buildDefaultContent } from './defaults';

const CmsContext = createContext(null);

export function CmsProvider({ children, override }) {
  const [content, setContent] = useState(buildDefaultContent);
  const [loaded, setLoaded] = useState(Boolean(override));

  useEffect(() => {
    if (override) {
      setContent(override);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) {
          const defaults = buildDefaultContent();
          const mergedSections = { ...defaults.sections };
          for (const [key, fields] of Object.entries(data.sections || {})) {
            mergedSections[key] = { ...(mergedSections[key] || {}), ...fields };
          }
          setContent({
            ...defaults,
            ...data,
            settings: { ...defaults.settings, ...(data.settings || {}) },
            sections: mergedSections,
          });
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
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
