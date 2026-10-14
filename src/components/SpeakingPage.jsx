import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { parseExtra, useCms } from '../cms/CmsContext';
import { submitForm } from '../cms/tracking';

export const SpeakingPage = () => {
  const { t } = useTranslation();
  const { sections, lists } = useCms();
  const page = sections.speaking_page || {};
  const patternSize = Number(page.pattern_size);
  const patternOffsetX = Number(page.pattern_offset_x);
  const patternOffsetY = Number(page.pattern_offset_y);
  const patternOpacity = Number(page.pattern_opacity);
  const ornamentStyle = {
    '--pattern-size': `${Number.isFinite(patternSize) ? patternSize : 79}%`,
    '--pattern-x': `${Number.isFinite(patternOffsetX) ? patternOffsetX : 40}%`,
    '--pattern-y': `${Number.isFinite(patternOffsetY) ? patternOffsetY : 45}%`,
    '--pattern-opacity': String((Number.isFinite(patternOpacity) ? patternOpacity : 38) / 100),
  };
  const audiences = lists.speaking_audiences || [];
  const steps = lists.speaking_steps || [];
  const meta = lists.retreat_meta || [];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    enquiryType: '',
    city: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm('speaking', formData);
    setIsSubmitted(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="speaking-page-root">
      {/* ── 1. HERO SECTION ── */}
      <section className="speaking-hero-section">
        <div className="speaking-hero-ornaments" aria-hidden="true" style={ornamentStyle}>
          <span className="speaking-hero-ornament is-tr" />
          <span className="speaking-hero-ornament is-tl" />
          <span className="speaking-hero-ornament is-br" />
          <span className="speaking-hero-ornament is-bl" />
        </div>

        <div className="speaking-hero-content">
          <div className="speaking-hero-info">
            {page.hero_kicker ? <p className="speaking-hero-kicker">{t(page.hero_kicker)}</p> : null}
            <h1 className="speaking-hero-title">
              {t(page.hero_title_1)}<br />
              {t(page.hero_title_2)}
            </h1>

            <p className="speaking-hero-subtitle">
              {t(page.hero_subtitle)}
            </p>
          </div>

          <div className="speaking-hero-actions">
            <button
              className="btn-speaking-primary"
              onClick={() => scrollToSection('enquiry-form')}
            >
              <span>{t(page.cta_enquire)}</span>
              <span className="speaking-gold-dot" />
            </button>

            <button
              className="btn-speaking-secondary"
              onClick={() => scrollToSection('retreat-details')}
            >
              <span>{t(page.cta_retreat)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. AUDIENCE / OFFERINGS SECTION (2x2 GRID) ── */}
      <section className="speaking-audiences-section">
        <div className="speaking-audiences-inner">
          <div className="speaking-audiences-header">
            <h2 className="speaking-audiences-title">
              {t(page.audiences_title)}
            </h2>
            <span className="speaking-audiences-tags">{t(page.audiences_tags)}</span>
          </div>

          <div className="speaking-cards-grid">
            {audiences.map((item) => (
              <div className="speaking-card" key={item.id}>
                <div className="speaking-card-icon">
                  <img src={item.icon} alt="" />
                </div>
                <h3 className="speaking-card-title">{t(item.title)}</h3>
                <p className="speaking-card-desc">{t(item.description)}</p>
                <span className="speaking-card-target">
                  {t(parseExtra(item.extra).target || '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THE RETREAT PROCESS / STEPS SECTION ── */}
      <section className="speaking-retreat-section" id="retreat-details">
        <div className="speaking-retreat-inner">
          <div className="speaking-retreat-header">
            <span className="speaking-retreat-kicker">{t(page.retreat_kicker)}</span>
            <h2 className="speaking-retreat-title">
              {t(page.retreat_title)}
            </h2>
          </div>

          {/* 3-Step Process (horizontal on desktop, vertical on mobile) */}
          <div className="speaking-steps-flow">
            {steps.map((item, index) => {
              const extra = parseExtra(item.extra);
              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <div className="speaking-step-connector" aria-hidden="true" />}
                  <div className="speaking-step-item">
                    <div className="speaking-step-num-box">
                      <span className="speaking-step-roman">{extra.numeral}</span>
                      <span className="speaking-step-sanskrit">{extra.sanskrit}</span>
                    </div>
                    <div className="speaking-step-content">
                      <h3 className="speaking-step-title">{t(item.title)}</h3>
                      <p className="speaking-step-desc">{t(item.description)}</p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="speaking-retreat-meta-row">
            {meta.map((item) => (
              <div className="speaking-meta-block" key={item.id}>
                <span className="speaking-meta-label">{t(item.title)}</span>
                <span className="speaking-meta-value">{t(parseExtra(item.extra).value || '')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. EVENT ENQUIRY FORM SECTION ── */}
      <section className="speaking-form-section" id="enquiry-form">
        <div className="speaking-form-inner">
          <div className="speaking-form-header">
            <h2 className="speaking-form-title">{t(page.form_title)}</h2>
            <p className="speaking-form-subtitle">
              {t(page.form_subtitle)}
            </p>
          </div>

          {isSubmitted ? (
            <div className="speaking-form-success">
              <h3>{t('Thank you for reaching out!')}</h3>
              <p>{t(page.form_success || 'Thank you. We will respond within two working days.')}</p>
              <button
                className="btn-speaking-primary"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    organization: '',
                    phone: '',
                    enquiryType: '',
                    city: '',
                    message: '',
                  });
                }}
              >
                <span>{t('Send another message')}</span>
                <span className="speaking-gold-dot" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="speaking-enquiry-form">
              <div className="speaking-form-grid">
                {/* Name */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-name">{t('Name')}</label>
                  <input
                    id="speaker-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-email">{t('Email')}</label>
                  <input
                    id="speaker-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Organization */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-org">{t('Organisation')}</label>
                  <input
                    id="speaker-org"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-phone">{t('Phone')}</label>
                  <input
                    id="speaker-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Type of enquiry */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-type">{t('Type of enquiry')}</label>
                  <select
                    id="speaker-type"
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                  >
                    <option value="">{t(page.enquiry_placeholder || 'Select one')}</option>
                    {(page.enquiry_options || 'Golf club or association; Corporate leadership; Philosophy or wellness; School or university; Retreat; Other')
                      .split(';')
                      .map((option) => option.trim())
                      .filter(Boolean)
                      .map((option) => (
                        <option key={option} value={option}>{t(option)}</option>
                      ))}
                  </select>
                </div>

                {/* City */}
                <div className="speaking-form-group">
                  <label htmlFor="speaker-city">{t('City')}</label>
                  <input
                    id="speaker-city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                {/* Message (Full Width) */}
                <div className="speaking-form-group full-width">
                  <label htmlFor="speaker-message">{t('Message')}</label>
                  <textarea
                    id="speaker-message"
                    rows={5}
                    placeholder={t("Tell us about the event, your audience, and what you're hoping for.")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="speaking-form-submit-row">
                <button type="submit" className="btn-speaking-submit">
                  <span>{t(page.form_send || 'Send enquiry')}</span>
                  <span className="speaking-gold-dot" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SpeakingPage;
