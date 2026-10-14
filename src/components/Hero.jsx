import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const Hero = ({ onBuyClick, onSampleClick }) => {
  const { t } = useTranslation();
  const { settings, sections, lists } = useCms();
  const hero = sections.hero || {};
  const marquee = lists.marquee || [];
  const repeats = Math.max(8, Math.ceil(16 / Math.max(marquee.length, 1)));
  const sequence = Array.from({ length: repeats }, () => marquee).flat();
  const renderGroup = (key, hidden) => (
    <div className="marquee-group" key={key} aria-hidden={hidden || undefined}>
      {sequence.map((item, index) => (
        <React.Fragment key={`${key}-${index}`}>
          <span className="marquee-text">{t(item.title)}</span>
          <span className="marquee-separator" aria-hidden="true">·</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="hero-section-wrapper" id="book">
      {/* 1. Marquee / Ticker Bar */}
      <div className="figma-marquee-bar" aria-label={t('Book summary marquee')}>
        <div className="marquee-track">
          {renderGroup('a', false)}
          {renderGroup('b', true)}
        </div>
      </div>

      {/* 2. Floating Book Cover (Positioned to overlap Header, Sanskrit, and Marquee) */}
      <div className="hero-floating-book" onClick={onBuyClick}>
        <div className="book-ambient-glow" />
        <img
          src={settings.book_cover}
          alt={t('Golf Gita book cover: An ancient map for the modern round')}
          className="hero-book-image"
          loading="eager"
        />
      </div>

      {/* 3. White Hero Content Section (Starts below the marquee, padded for the floating book) */}
      <div className="hero-bottom-content-area">
        <div className="hero-content-frame">
          <h2 className="hero-title-main">
            {t(hero.title_line_1)}<br />
            {t(hero.title_line_2)}
          </h2>

          <p className="hero-subtitle-desc">
            {t(hero.subtitle)}
          </p>

          <div className="hero-buttons-container">
            <button className="btn-where-to-buy" onClick={onBuyClick}>
              <span>{t(hero.cta_buy)}</span>
              <span className="gold-dot" />
            </button>

            <button className="btn-get-sample" onClick={onSampleClick}>
              <span>{t(hero.cta_sample)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
