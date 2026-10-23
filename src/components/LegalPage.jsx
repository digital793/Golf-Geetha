import React, { useState } from 'react';
import './LegalPage.css';

export const LegalPage = ({ kind = 'privacy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState(kind);

  return (
    <div className="legal-page-root">
      <div className="legal-page-container">

        {/* Header Block */}
        <header className="legal-header-block">
          <span className="legal-badge">Official Legal Document</span>
          <h1 className="legal-title">
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'terms' && 'Terms of Service'}
            {activeTab === 'cookies' && 'Cookie Policy'}
          </h1>
          <p className="legal-subtitle">
            Golf Gita: The Eternal Game of Celestial Wisdom — Respecting your data, mindfulness, and privacy
          </p>
          <div className="legal-effective-date">
            Last Updated &amp; Effective: January 2026
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="legal-nav-tabs" aria-label="Legal document selection">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'terms' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms of Service
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'cookies' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('cookies')}
          >
            Cookie Policy
          </button>
        </nav>

        {/* Document Content */}
        <main className="legal-doc-content">
          {activeTab === 'privacy' && (
            <article>
              <div className="legal-callout-card">
                <div className="legal-callout-title">
                  <span>🔒</span> Key Highlights of Our Privacy Commitment
                </div>
                <p className="legal-callout-text">
                  We believe personal reflection requires absolute trust. We do not sell or monetize your personal
                  data. Your optional chatbot conversation details (such as nickname, handicap, and city) are stored
                  securely in our local database solely to personalize your guidance, and you may end your session
                  at any time to clear your stored data.
                </p>
              </div>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">1.</span> Introduction &amp; Scope
                </h2>
                <p className="legal-paragraph">
                  This Privacy Policy applies to the website, applications, interactive chatbot, and digital services
                  provided for <em>Golf Gita: The Eternal Game of Celestial Wisdom</em> ("Golf Gita", "we", "us", or "our"),
                  authored by Nazeer Tajudeen. This document explains how we collect, store, safeguard, and use your personal information.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">2.</span> Information We Collect
                </h2>
                <p className="legal-paragraph">
                  We collect information to provide a more meaningful, tailored experience across our philosophical and golf instruction content:
                </p>
                <ul className="legal-list">
                  <li>
                    <strong>Chatbot Profile Details:</strong> When you converse with our digital guide, you may optionally provide your first name or nickname, age, gender, city, country, golf handicap, and years playing. These details allow the guide to contextualize insights according to your experience level.
                  </li>
                  <li>
                    <strong>Form Submissions:</strong> When you request book sample chapters, submit a contact inquiry, request a keynote or retreat, or sign up for newsletters, we collect your name, email address, message content, and contact preferences.
                  </li>
                  <li>
                    <strong>Analytics &amp; Usage Data:</strong> Anonymized interaction logs such as chapter views, scorecard exploration, and platform store clicks (Amazon, Flipkart, Kindle) to help us understand how readers engage with our content.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">3.</span> How We Use Your Information
                </h2>
                <p className="legal-paragraph">
                  Your data is used strictly for the following purposes:
                </p>
                <ul className="legal-list">
                  <li>To provide personalized responses and relevant chapter recommendations via the Golf Gita chatbot.</li>
                  <li>To remember your conversation context across return visits so you do not have to re-enter your details every session.</li>
                  <li>To fulfill requests for sample chapters, signed book copies, speaking engagements, and retreats.</li>
                  <li>To maintain the security, performance, and functionality of our web experience.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">4.</span> Storage, Security &amp; Data Retention
                </h2>
                <p className="legal-paragraph">
                  Your profile and session information are saved in an encrypted, protected server-side database as well as your local browser storage. We implement standard encryption, access control protocols, and firewalls to prevent unauthorized access, alteration, or disclosure.
                </p>
                <p className="legal-paragraph">
                  We retain user information only for as long as necessary to provide our services or until you choose to end your session or request deletion.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">5.</span> Your Rights &amp; "End Session" Control
                </h2>
                <p className="legal-paragraph">
                  You maintain full sovereignty over your personal data:
                </p>
                <ul className="legal-list">
                  <li>
                    <strong>End Session (Switch User):</strong> You can click the <em>"End Session"</em> button located inside the chatbot header at any time. Doing so immediately clears your local browser storage and deletes your saved chat profile from our database.
                  </li>
                  <li>
                    <strong>Access &amp; Rectification:</strong> You may request to review or correct any personal information we hold about you.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> You can contact us at any time to request complete erasure of your email inquiries or submission records.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">6.</span> Third-Party Links &amp; Retail Platforms
                </h2>
                <p className="legal-paragraph">
                  Our website provides outbound links to authorized retailers such as Amazon India, Amazon US, Flipkart, and Kindle. When you navigate to these external platforms to purchase <em>Golf Gita</em>, their independent privacy policies and terms govern your transaction. We do not process credit cards or store payment information on this site.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">7.</span> Contact the Author &amp; Data Officer
                </h2>
                <p className="legal-paragraph">
                  If you have questions, feedback, or requests regarding this Privacy Policy or your personal information, please reach out to our team:
                </p>
                <div className="legal-contact-box">
                  <strong>Golf Gita Administration &amp; Author Office</strong><br />
                  Attn: Nazeer Tajudeen<br />
                  Email: <a href="mailto:contact@golfgita.com">contact@golfgita.com</a><br />
                  Website Inquiries: Use our online <a href="/contact" onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('contact'); } }}>Contact Form</a>
                </div>
              </section>
            </article>
          )}

          {activeTab === 'terms' && (
            <article>
              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">1.</span> Acceptance of Terms
                </h2>
                <p className="legal-paragraph">
                  By accessing and using this website, reading excerpts of <em>Golf Gita: The Eternal Game of Celestial Wisdom</em>, or interacting with our digital assistant, you agree to abide by these Terms of Service.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">2.</span> Intellectual Property Rights
                </h2>
                <p className="legal-paragraph">
                  All text, excerpts, diagrams, 18-hole mapping concepts, illustrations, audio, and branding associated with <em>Golf Gita</em> are the copyrighted intellectual property of Nazeer Tajudeen. Unauthorized reproduction, republication, commercial distribution, or automated scraping is strictly prohibited without prior written consent.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">3.</span> Educational &amp; Philosophical Nature
                </h2>
                <p className="legal-paragraph">
                  The insights, commentary, and conversational advice provided through this site and its chatbot are for philosophical reflection, sports psychology exploration, and personal enrichment. They do not constitute formal medical or psychological diagnosis.
                </p>
              </section>
            </article>
          )}

          {activeTab === 'cookies' && (
            <article>
              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">1.</span> Use of Cookies and Local Storage
                </h2>
                <p className="legal-paragraph">
                  We utilize lightweight essential cookies and browser LocalStorage solely to maintain session state, remember your chatbot preferences (such as accepted consent and profile nickname), and track aggregate, non-personally identifiable page visits.
                </p>
              </section>

              <section className="legal-section">
                <h2 className="legal-section-heading">
                  <span className="legal-section-num">2.</span> Managing Your Preferences
                </h2>
                <p className="legal-paragraph">
                  You can clear your cookies or local storage at any time via your browser settings or by clicking "End Session" in the Golf Gita chatbot.
                </p>
              </section>
            </article>
          )}
        </main>

      </div>
    </div>
  );
};

export default LegalPage;
