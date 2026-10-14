import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { parseExtra, useCms } from '../cms/CmsContext';
import { submitForm } from '../cms/tracking';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export const ContactPage = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { sections, lists } = useCms();
  const contact = sections.contact || {};
  const social = lists.social || [];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm('contact', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="contact-page-root">
      <div className="contact-page-inner">
        {/* Left Column: Heading, Subtitle & Social Links */}
        <div className="contact-intro-col">
          <h1 className="contact-heading-title">{t(contact.title)}</h1>

          <p className="contact-intro-desc">
            {t(contact.intro_before)}{' '}
            <button
              type="button"
              className="contact-inline-link"
              onClick={() => {
                if (onNavigate) onNavigate('speaking');
              }}
            >
              {t(contact.intro_link)}
            </button>{' '}
            {t(contact.intro_after)}
          </p>

          <div className="contact-also-here-section">
            <p className="contact-also-label">{t(contact.social_label)}</p>
            <div className="contact-social-list">
              {social.map((item) => {
                const extra = parseExtra(item.extra);
                return (
                  <a
                    key={item.id}
                    href={extra.url && extra.url.startsWith('http') ? extra.url : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-item"
                  >
                    <div className="contact-social-icon-box">
                      {extra.icon === 'whatsapp' ? <WhatsappIcon /> : <InstagramIcon />}
                    </div>
                    <span>{item.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-form-col">
          {isSubmitted ? (
            <div className="contact-success-card">
              <h3>{t('Message Sent')}</h3>
              <p>{t(contact.success_message || 'Thank you. Your message has been sent.')}</p>
              <button
                className="btn-contact-submit"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
              >
                <span>{t('Send another message')}</span>
                <span className="contact-gold-dot" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-actual-form">
              <div className="contact-form-group">
                <label htmlFor="contact-name">{t('Name')}</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">{t('Email')}</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-subject">{t('Subject')}</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-message">{t('Message')}</label>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder={t("Tell us about the event, your audience, and what you're hoping for.")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="contact-submit-row">
                <button type="submit" className="btn-contact-submit">
                  <span>{t(contact.send_button || 'Send message')}</span>
                  <span className="contact-gold-dot" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
