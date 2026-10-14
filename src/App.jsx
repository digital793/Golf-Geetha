import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BattlefieldSection } from './components/BattlefieldSection';
import { ScorecardNine } from './components/ScorecardNine';
import { TheTurn } from './components/TheTurn';
import { ArticlesSection } from './components/ArticlesSection';
import { CaddiesNoteSection } from './components/CaddiesNoteSection';
import { BookPage } from './components/BookPage';
import { EighteenHolesPage } from './components/EighteenHolesPage';
import { SpeakingPage } from './components/SpeakingPage';
import { AuthorPage } from './components/AuthorPage';
import { ContactPage } from './components/ContactPage';
import { DiscoverPage } from './components/DiscoverPage';
import { ArticlesPage } from './components/ArticlesPage';
import { LegalPage } from './components/LegalPage';
import { WhereToBuyModal } from './components/WhereToBuyModal';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { useTranslation } from './i18n';
import { useCms } from './cms/CmsContext';
import { submitForm, trackEvent, trackPageView } from './cms/tracking';
import { isAppPage, normalizePath, pageFromPath, pathFromPage } from './routing';

export function App() {
  const { t } = useTranslation();
  const { frontNine, backNine, sections, articles } = useCms();
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: null,
  });

  const trackedPage = React.useRef(null);
  useEffect(() => {
    const onPop = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (trackedPage.current === currentPage) return;
    trackedPage.current = currentPage;
    trackPageView(currentPage, document.documentElement.lang || 'en');
  }, [currentPage]);

  useEffect(() => {
    const titles = {
      home: 'Golf Gita | 18 Holes, 18 Chapters, One Ancient Map',
      book: sections.book?.seo_title || 'The Book | Golf Gita',
      '18-holes': '18 Holes | Golf Gita',
      discover: sections.discover?.seo_title || 'Discover Your Round | Golf Gita',
      speaking: sections.speaking_page?.seo_title || 'Speaking & Retreats | Golf Gita',
      events: sections.speaking_page?.seo_title || 'Speaking & Retreats | Golf Gita',
      author: sections.author?.seo_title || 'About the Author | Golf Gita',
      articles: 'Articles | Golf Gita',
      contact: sections.contact?.seo_title || 'Contact | Golf Gita',
      privacy: 'Privacy Policy | Golf Gita',
      terms: 'Terms of Service | Golf Gita',
      cookies: 'Cookie Policy | Golf Gita',
    };
    document.title = titles[currentPage] || 'Golf Gita';
  }, [currentPage, sections]);

  const goToPage = (pageId) => {
    const nextPage = pageId === 'events' ? 'speaking' : pageId;
    const nextPath = pathFromPage(nextPage);
    if (normalizePath(window.location.pathname) !== nextPath) {
      window.history.pushState({ page: nextPage }, '', nextPath);
    }
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (pageId) => {
    if (isAppPage(pageId)) {
      goToPage(pageId);
      return;
    }
    const scrollToSection = () => {
      const el = document.getElementById(pageId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (currentPage !== 'home') {
      goToPage('home');
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }
  };

  const openBuyModal = () => {
    trackEvent('buy_modal_open', { page: currentPage });
    setIsBuyModalOpen(true);
  };

  const openSampleModal = () => {
    setModalState({
      isOpen: true,
      title: t(sections.sample_modal?.title),
      content: (
        <div>
          <p style={{ marginBottom: '1rem' }}>
            {t(sections.sample_modal?.body)}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.elements[0].value;
              submitForm('sample', { email });
              alert(t('Sample chapters have been sent to your email!'));
              setModalState({ isOpen: false, title: '', content: null });
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              type="email"
              placeholder={t('Your email address')}
              required
              className="newsletter-email-input"
              style={{ width: '100%', color: '#171717', border: '1px solid #CECECE', background: '#F7F0E6' }}
            />
            <button
              type="submit"
              className="btn-where-to-buy"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t(sections.sample_modal?.cta)}
            </button>
          </form>
        </div>
      ),
    });
  };

  const openArticleModal = (article) => {
    setModalState({
      isOpen: true,
      title: article.title,
      content: (
        <div>
          <img
            src={article.image}
            alt=            {t(article.title)}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
          />
          <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem' }}>
            {t(article.description)}
          </p>
          <p style={{ lineHeight: '1.7', color: '#333' }}>
            {t(article.body || articles.find((item) => item.id === article.id)?.body || '')}
          </p>
        </div>
      ),
    });
  };

  return (
    <div className={`golf-gita-app page-${currentPage}-active`}>
      {currentPage === 'book' ? (
        /* ── BOOK DETAIL PAGE ── */
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="book"
            onNavigate={handleNavigate}
            theme="light"
          />
          <BookPage
            onBuyClick={openBuyModal}
            onSampleClick={openSampleModal}
          />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === '18-holes' ? (
        /* ── 18 HOLES PAGE ── */
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="18-holes"
            onNavigate={handleNavigate}
            theme="light"
          />
          <EighteenHolesPage
            onBuyClick={openBuyModal}
            onNavigate={handleNavigate}
          />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'speaking' || currentPage === 'events' ? (
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="speaking"
            onNavigate={handleNavigate}
            theme="light"
          />
          <SpeakingPage />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'discover' ? (
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="discover"
            onNavigate={handleNavigate}
            theme="light"
          />
          <DiscoverPage />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'articles' ? (
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="articles"
            onNavigate={handleNavigate}
            theme="light"
          />
          <ArticlesPage onArticleClick={openArticleModal} />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'cookies' ? (
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage=""
            onNavigate={handleNavigate}
            theme="light"
          />
          <LegalPage kind={currentPage} />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'author' ? (
        /* ── AUTHOR PAGE ── */
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="author"
            onNavigate={handleNavigate}
            theme="light"
          />
          <AuthorPage onNavigate={handleNavigate} />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : currentPage === 'contact' ? (
        <div className="book-page-wrapper">
          <Header
            onBuyClick={openBuyModal}
            activePage="contact"
            onNavigate={handleNavigate}
            theme="light"
          />
          <ContactPage onNavigate={handleNavigate} />
          <Footer onNavigate={handleNavigate} />
        </div>
      ) : (
        /* ── HOME LANDING PAGE ── */
        <div className="home-page-wrapper">
          {/* 1 & 2. Hero Master Container (Header, 2-line Sanskrit, Marquee & Floating Book) */}
          <div className="hero-master-container">
            <Header
              onBuyClick={openBuyModal}
              activePage="home"
              onNavigate={handleNavigate}
              theme="dark"
            />
            <Hero onBuyClick={openBuyModal} onSampleClick={openSampleModal} />
          </div>

          {/* 3. Where The Fairway Meets The Battlefield */}
          <div id="author">
            <BattlefieldSection />
          </div>

          {/* 4. Front Nine Scorecard & Carousel */}
          <div id="18-holes">
            <ScorecardNine
              title={sections.home_ui?.front_nine || 'The front nine'}
              holes={frontNine}
              defaultActive={1}
            />
          </div>

          <TheTurn />

          <ScorecardNine
            title={sections.home_ui?.back_nine || 'The Back Nine'}
            holes={backNine}
            defaultActive={1}
          />

          <div id="articles">
            <ArticlesSection onArticleClick={openArticleModal} onNavigate={handleNavigate} />
          </div>

          {/* 9. Newsletter Signup: The Caddie's Note */}
          <CaddiesNoteSection />

          {/* 10. Footer */}
          <Footer onNavigate={handleNavigate} />
        </div>
      )}

      {/* Interactive Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: '', content: null })}
        title={modalState.title}
      >
        {modalState.content}
      </Modal>

      {/* Where To Buy Overlay Modal (Figma Design) */}
      <WhereToBuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        page={currentPage}
      />
    </div>
  );
}

export default App;
