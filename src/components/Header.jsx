import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { NavUnderline } from './NavUnderline';
import { LanguageSelector, useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';
import { isModifiedClick, pathFromPage } from '../routing';

export const Header = ({
  onBuyClick,
  activePage = 'home',
  onNavigate,
  theme = 'dark',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { t } = useTranslation();
  const { nav, settings } = useCms();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Close mobile menu if user scrolls down actively
      if (delta > 10 && mobileOpen) {
        setMobileOpen(false);
      }

      // If at or near the very top (<= 30px), stay in resting transparent state
      if (currentScrollY <= 30) {
        setIsSticky(false);
        setIsHidden(false);
      } else {
        setIsSticky(true);
        // Scrolling DOWN -> Hide navbar
        if (delta > 6 && currentScrollY > 100) {
          setIsHidden(true);
        }
        // Scrolling UP -> Reveal navbar
        else if (delta < -6) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  const links = (nav || []).map((item) => ({
    id: item.page_id,
    label: t(item.label),
    href: pathFromPage(item.page_id),
  }));

  const handleLinkClick = (e, link) => {
    if (!onNavigate || isModifiedClick(e)) return;
    e.preventDefault();
    onNavigate(link.id);
    setMobileOpen(false);
  };

  const isLight = theme === 'light';
  // On home page, navbar is transparent at top; once scrolled/sticky, it morphs into the light theme like the other pages
  const isEffectiveLight = isLight || isSticky;

  return (
    <header className={`figma-header-frame ${isLight ? 'header-theme-light' : 'header-theme-dark'}`}>
      {/* Smart Sticky Navigation Bar Container */}
      <div
        className={`figma-navbar-sticky-container ${isSticky ? 'is-sticky' : ''} ${isHidden ? 'is-hidden' : ''} ${isEffectiveLight ? 'theme-light header-theme-light' : 'theme-dark header-theme-dark'}`}
      >
        <nav className="figma-navbar" aria-label={t('Main Navigation')}>
          {/* Navigation links left */}
          <div className="navbar-links">
            {links.map((link) => {
              const isActive = activePage === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  <span className="navbar-link-text">{link.label}</span>
                  <NavUnderline active={isActive} />
                </a>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t('Toggle navigation')}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Brand Logo Center */}
          <a
            href="/"
            className="navbar-brand-logo"
            aria-label={t('Golf Gita Home')}
            onClick={(e) => {
              if (!onNavigate || isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <img
              src={isEffectiveLight ? settings.emblem_light : settings.emblem_dark}
              alt={t('Golf Gita Emblem')}
              className="navbar-brand-emblem"
              style={{ width: '48px', height: 'auto', display: 'block' }}
            />
          </a>

          {/* Actions Right */}
          <div className="navbar-actions">
            <LanguageSelector light={isEffectiveLight} compact />

            <button className="purchase-button-nav" onClick={onBuyClick}>
              {t(settings.buy_button_label)}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <div
            className="mobile-nav-drawer"
            style={{
              position: 'absolute',
              top: '80px',
              left: 0,
              right: 0,
              background: isEffectiveLight ? '#F7F0E6' : '#171717',
              padding: '24px',
              borderTop: isEffectiveLight ? '1px solid rgba(83, 37, 110, 0.15)' : '1px solid rgba(247, 240, 230, 0.15)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              zIndex: 100,
              textAlign: 'center',
            }}
          >
            {links.map((link) => {
              const isActive = activePage === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, link)}
                  style={{
                    fontSize: '20px',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: isEffectiveLight ? (isActive ? '#53256E' : '#171717') : (isActive ? '#F7F0E6' : 'rgba(247, 240, 230, 0.7)'),
                  }}
                >
                  <span className="navbar-link-text">{link.label}</span>
                  <NavUnderline active={isActive} />
                </a>
              );
            })}
            <button
              className="purchase-button-nav mobile-drawer-buy"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => {
                setMobileOpen(false);
                onBuyClick();
              }}
            >
              {t(settings.buy_button_label)}
            </button>
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;
