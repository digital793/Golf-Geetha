import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const SpeakingSection = ({ onEnquireClick }) => {
  const { t } = useTranslation();
  const { sections } = useCms();
  const speaking = sections.speaking_home || {};
  return (
    <section className="figma-speaking-section" id="speaking">
      <div className="speaking-split-layout">
        {/* Left Side Image */}
        <div className="speaking-left-image">
          <img
            src={speaking.image}
            alt={t('Golf retreat and leadership speaking session')}
            loading="lazy"
          />
        </div>

        {/* Right Side Content Container */}
        <div className="speaking-right-content">
          <p className="speaking-subtitle-kicker">{t(speaking.kicker)}</p>

          <h2 className="speaking-main-title">
            {t(speaking.title)}
          </h2>

          <p className="speaking-desc-text">
            {t(speaking.description)}
          </p>

          <button className="btn-session-inquiry" onClick={onEnquireClick}>
            <span>{t(speaking.cta)}</span>
            <span className="gold-dot-large" />
          </button>
        </div>
      </div>
    </section>
  );
};
