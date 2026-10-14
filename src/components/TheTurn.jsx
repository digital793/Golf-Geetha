import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const TheTurn = () => {
  const { t } = useTranslation();
  const { sections } = useCms();
  const turn = sections.the_turn || {};
  return (
    <section className="figma-the-turn-section">
      <div className="turn-section-container">
        {/* Header Frame */}
        <div className="turn-header-group">
          <p className="turn-subtitle">{t(turn.kicker)}</p>
          <h2 className="turn-title-main">{t(turn.title)}</h2>
        </div>

        {/* Banner with Overlapping Badge */}
        <div className="turn-banner-relative">
          <div className="turn-image-placeholder">
            <img
              src={turn.image}
              alt={t('Golf course at the turn')}
              loading="lazy"
            />
          </div>

          {/* Overlapping Badge - full 3D coin flip on hover */}
          <div className="turn-flip-badge-scene">
            <div className="turn-flip-badge-coin">

              {/* FRONT FACE */}
              <div className="turn-coin-face turn-coin-front">
                <div className="turn-coin-back-inner">
                  <span className="turn-coin-back-symbol">{turn.badge_symbol}</span>
                  <span className="turn-coin-back-text">{t(turn.title)}</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="turn-coin-face turn-coin-back">
                <div className="turn-badge-inner">
                  <span className="turn-badge-number">{turn.badge_number}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Quote Below */}
        <p className="turn-quote-text">
          {t(turn.quote)}
        </p>
      </div>
    </section>
  );
};
