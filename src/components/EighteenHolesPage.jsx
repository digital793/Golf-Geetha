import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';
import { TheTurn } from './TheTurn';

function HoleRow({ hole: h, t }) {
  return (
    <div className="eighteen-hole-card">
      <span className="eighteen-card-hole-num">{t('Hole')} {h.hole}</span>
      <div className="eighteen-card-thumb">
        <img
          src={h.image}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="eighteen-card-body">
        <h3 className="eighteen-card-title">{t(h.title)}</h3>
        {h.subtitle && (
          <p className="eighteen-card-subtitle">{t(h.subtitle)}</p>
        )}
        <p className="eighteen-card-desc">{t(h.description)}</p>
      </div>
      <div className="eighteen-card-sanskrit-col">
        <span className="eighteen-sanskrit-roman">{h.sanskrit}</span>
      </div>
    </div>
  );
}

export const EighteenHolesPage = ({ onBuyClick, onNavigate }) => {
  const { t } = useTranslation();
  const { frontNine, backNine, sections } = useCms();
  const page = sections.eighteen || {};
  return (
    <div className="eighteen-holes-page-root">
      {/* ── 1. PAGE HEADER HERO ── */}
      <section className="eighteen-hero-section">
        <div className="eighteen-hero-inner">
          {page.kicker ? <p className="eighteen-hero-kicker">{t(page.kicker)}</p> : null}
          <h1 className="eighteen-title-main">{t(page.title)}</h1>
          <p className="eighteen-subtitle-desc">
            {t(page.subtitle)}
          </p>
          <button
            className="btn-get-the-book"
            onClick={() => {
              if (onNavigate) onNavigate('book');
            }}
          >
            <span>{t(page.cta)}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 2. FRONT NINE SECTION ── */}
      <section className="eighteen-section-group">
        <div className="eighteen-section-inner">
          <h2 className="eighteen-group-kicker">{t(page.front_heading || 'Front Nine')}</h2>

          <div className="eighteen-cards-list">
            {frontNine.map((h) => (
              <HoleRow key={h.hole} hole={h} t={t} />
            ))}
          </div>
        </div>
      </section>

      <TheTurn />

      <section className="eighteen-section-group">
        <div className="eighteen-section-inner">
          <h2 className="eighteen-group-kicker">{t(page.back_heading || 'Back nine 10–18')}</h2>

          <div className="eighteen-cards-list">
            {backNine.map((h) => (
              <HoleRow key={h.hole} hole={h} t={t} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EighteenHolesPage;
