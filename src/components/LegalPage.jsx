import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

const TITLES = {
  privacy: 'privacy_title',
  terms: 'terms_title',
  cookies: 'cookies_title',
};

export const LegalPage = ({ kind = 'privacy' }) => {
  const { t } = useTranslation();
  const { sections } = useCms();
  const legal = sections.legal || {};
  const title = legal[TITLES[kind]] || 'Legal';

  return (
    <div className="legal-page-root">
      <section className="legal-page-inner">
        <h1>{t(title)}</h1>
        <p>{t(legal.placeholder)}</p>
      </section>
    </div>
  );
};

export default LegalPage;
