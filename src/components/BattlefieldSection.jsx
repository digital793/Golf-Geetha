import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const BattlefieldSection = () => {
  const { t } = useTranslation();
  const { sections } = useCms();
  const battlefield = sections.battlefield || {};
  return (
    <section className="figma-battlefield-section" id="chapters">
      <div className="battlefield-container">
        <h2 className="battlefield-section-title">
          {t(battlefield.title)}
        </h2>

        <div className="battlefield-horizontal-container">
          {/* Left Description */}
          <div className="battlefield-desc-left">
            <p>
              {t(battlefield.left_before)} <strong>{t(battlefield.left_strong)}</strong> {t(battlefield.left_after)}
            </p>
          </div>

          {/* Center 18 Hero Circle */}
          <div className="center-18-hero-wrapper">
            <div className="center-18-circle">
              <span className="center-18-number">{battlefield.center_number}</span>
            </div>
            <span className="center-18-label">{t(battlefield.center_label)}</span>
          </div>

          {/* Right Description */}
          <div className="battlefield-desc-right">
            <p>
              {t(battlefield.right_before)} <strong>18</strong> {t('holes to')} <strong>18</strong> {t('chapters')}
              {battlefield.right_after ? <>. {t(battlefield.right_after)}</> : '.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
