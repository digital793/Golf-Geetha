import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const Hero = ({ onBuyClick, onSampleClick }) => {
  const { t } = useTranslation();
  const { settings, sections, lists } = useCms();
  const hero = sections.hero || {};
  const marquee = lists.marquee || [];
  const wordSets = [
    {
      center: 'INNER BATTLE',
      leftTop: t(marquee[0]?.title || '18 HOLES'),
      leftBottom: 'EGO',
      rightTop: t(marquee[1]?.title || '18 CHAPTERS'),
      rightBottom: 'DUALITY',
    },
    {
      center: 'ANCIENT WISDOM',
      leftTop: '18 HOLES',
      leftBottom: 'FOCUS',
      rightTop: '18 CHAPTERS',
      rightBottom: 'PURPOSE',
    },
    {
      center: 'THE INNER GAME',
      leftTop: 'PRESENT',
      leftBottom: 'STILLNESS',
      rightTop: 'ONE ANCIENT MAP',
      rightBottom: 'BALANCE',
    },
  ];
  const [activeWordSet, setActiveWordSet] = useState(
    () => Math.floor(Math.random() * wordSets.length),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveWordSet((current) => {
        const next = Math.floor(Math.random() * (wordSets.length - 1));
        return next >= current ? next + 1 : next;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [wordSets.length]);

  const activeWords = wordSets[activeWordSet];

  return (
    <div className="hero-section-wrapper" id="book">
      <div className="hero-word-stage">
        <div className="hero-word-set" key={activeWordSet}>
          <span className="hero-word hero-word-center">{t(activeWords.center)}</span>
          <span className="hero-word hero-word-left-top">{t(activeWords.leftTop)}</span>
          <span className="hero-word hero-word-left-bottom">{t(activeWords.leftBottom)}</span>
          <span className="hero-word hero-word-right-top">{t(activeWords.rightTop)}</span>
          <span className="hero-word hero-word-right-bottom">{t(activeWords.rightBottom)}</span>
        </div>
      </div>

      <div className="hero-floating-book" onClick={onBuyClick}>
        <div className="book-ambient-glow" />
        <img
          src={settings.book_cover}
          alt={t('Golf Gita book cover: An ancient map for the modern round')}
          className="hero-book-image"
          loading="eager"
        />
      </div>

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
