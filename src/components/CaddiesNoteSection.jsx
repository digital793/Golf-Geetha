import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';
import { submitForm } from '../cms/tracking';

export const CaddiesNoteSection = () => {
  const { t } = useTranslation();
  const { settings, sections } = useCms();
  const newsletter = sections.newsletter || {};
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      submitForm('newsletter', { email });
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="figma-newsletter-section" id="newsletter">
      <div className="newsletter-inner-frame">
        {/* Issue Number */}
        <p className="newsletter-issue-number">{t(newsletter.issue)}</p>

        {/* Ornate Gold CTA Logo */}
        <div className="newsletter-gold-vector">
          <img
            src={settings.cta_emblem}
            alt={t('Golf Gita CTA Emblem')}
            className="newsletter-gold-emblem-img"
          />
        </div>

        {/* Content Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <h2 className="newsletter-main-title">{t(newsletter.title)}</h2>
          <p className="newsletter-subtext">
            {t(newsletter.subtitle)}
          </p>
        </div>

        {/* Subscription Form */}
        <form className="newsletter-form-container" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="newsletter-email-input"
            aria-label={t('Email Address')}
          />
          <button type="submit" className="newsletter-subscribe-btn">
            {subscribed ? t(newsletter.success || 'Subscribed!') : t(newsletter.subscribe)}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="newsletter-privacy-note">
          {t(newsletter.privacy)}
        </p>
      </div>
    </section>
  );
};
