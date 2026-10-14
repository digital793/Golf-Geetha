import { FooterSunLogo } from './FooterSunLogo';
import { LanguageSelector, useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';
import { trackPlatformClick } from '../cms/tracking';
import { isModifiedClick, pathFromPage } from '../routing';

export const Footer = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { nav, platforms, settings } = useCms();
  const footerLinks = (nav || []).map((item) => ({
    source: item.label,
    id: item.page_id,
    href: pathFromPage(item.page_id),
  }));
  const stores = (platforms || []).filter((store) => store.is_active);

  return (
    <footer className="figma-footer-section">
      <div className="footer-brand-mark-frame">

        {/* Sun Emblem - Exactly the existing Sun from logo with 14 rays spinning 360deg infinitely */}
        <a
          href="/"
          className="footer-sun-emblem-wrap"
          aria-label={t('Golf Gita Home')}
          onClick={(e) => {
            if (!onNavigate || isModifiedClick(e)) return;
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <FooterSunLogo size={210} />
        </a>

        {/* Brand Title */}
        <h2 className="footer-brand-title">{settings.brand_name}</h2>

        {/* Available Platforms */}
        <div className="footer-available-group">
          <p className="platform-label-title">{t('Available on')}</p>
          <div className="footer-platform-links">
            {stores.map((store) => (
              <a
                key={store.slug}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-link-box"
                title={store.name}
                onClick={() => trackPlatformClick(store.slug, 'footer', 'footer')}
              >
                <img
                  src={store.icon}
                  alt={store.name}
                  className="platform-store-icon"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav-links-row">
          {footerLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="footer-nav-item"
              onClick={(e) => {
                if (!onNavigate || isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate(link.id);
              }}
            >
              {t(link.source)}
            </a>
          ))}
        </div>

        <LanguageSelector />

        <div className="footer-legal-links">
          <a
            href="/privacy"
            className="footer-legal-item"
            onClick={(e) => {
              if (!onNavigate || isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('privacy');
            }}
          >
            {t(settings.legal_privacy || 'Privacy Policy')}
          </a>
          <a
            href="/terms"
            className="footer-legal-item"
            onClick={(e) => {
              if (!onNavigate || isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('terms');
            }}
          >
            {t(settings.legal_terms || 'Terms of Service')}
          </a>
          <a
            href="/cookies"
            className="footer-legal-item"
            onClick={(e) => {
              if (!onNavigate || isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('cookies');
            }}
          >
            {t(settings.legal_cookies || 'Cookie Policy')}
          </a>
        </div>

        <p className="footer-copyright-text">
          {settings.copyright}
        </p>
      </div>
    </footer>
  );
};
