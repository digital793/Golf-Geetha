import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={`book-faq-item ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="book-faq-question">
        <span className="faq-question-text">{t(q)}</span>
        <button
          className="faq-toggle-btn"
          aria-label={t(open ? 'Collapse answer' : 'Expand answer')}
          tabIndex={-1}
        >
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>
      {open && <div className="book-faq-answer">{t(a)}</div>}
    </div>
  );
}

export const BookPage = ({ onBuyClick, onSampleClick }) => {
  const { t } = useTranslation();
  const { holes, faqs, gallery, lists, sections, settings } = useCms();
  const book = sections.book || {};
  const allHoles = holes || [];
  const formats = (lists.book_formats || []).map((item) => item.title);
  const thumbnails = (gallery || []).map((item) => item.image);
  const whoFor = lists.who_for || [];
  const [selectedFormat, setSelectedFormat] = useState(formats[0] || 'Hardcover');
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [mobileDescOpen, setMobileDescOpen] = useState(true);
  const chapterRowRef = useRef(null);
  const chapterRefs = useRef([]);
  const skipRowScroll = useRef(true);

  const currentHole = allHoles[activeChapterIdx] || allHoles[0];

  useEffect(() => {
    if (skipRowScroll.current) {
      skipRowScroll.current = false;
      return;
    }
    const row = chapterRowRef.current;
    const activeButton = chapterRefs.current[activeChapterIdx];
    if (!row || !activeButton) return;

    const rowRect = row.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    row.scrollTo({
      left: row.scrollLeft + (buttonRect.left - rowRect.left) - rowRect.width / 2 + buttonRect.width / 2,
      behavior: 'smooth',
    });
  }, [activeChapterIdx]);

  const handlePrevChapter = () => {
    setSlideDirection('previous');
    setActiveChapterIdx((prev) => (prev > 0 ? prev - 1 : allHoles.length - 1));
  };

  const handleNextChapter = () => {
    setSlideDirection('next');
    setActiveChapterIdx((prev) => (prev < allHoles.length - 1 ? prev + 1 : 0));
  };

  const handleSelectChapter = (idx) => {
    if (idx === activeChapterIdx) return;
    setSlideDirection(idx > activeChapterIdx ? 'next' : 'previous');
    setActiveChapterIdx(idx);
  };

  return (
    <div className="book-page-root">
      {/* ── 1. PRODUCT / BOOK HERO SECTION ── */}
      <section className="book-hero-section">
        <div className="book-hero-inner">
          {/* Left Column: Main Cover & Thumbnails Gallery */}
          <div className="book-cover-col">
            <div className="book-cover-main-wrap">
              <img
                src={thumbnails[activeThumb] || settings.book_cover}
                alt={t('Golf Gita Book Cover')}
                className="book-cover-main-img"
              />
            </div>
            <div className="book-thumb-row">
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  className={`book-thumb-btn ${activeThumb === i ? 'active' : ''}`}
                  onClick={() => setActiveThumb(i)}
                  aria-label={`Preview book image ${i + 1}`}
                >
                  <img src={src} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Book Details & CTAs */}
          <div className="book-info-col">
            {/* Mobile collapsible toggle */}
            <button
              className="book-mobile-desc-toggle"
              onClick={() => setMobileDescOpen(!mobileDescOpen)}
              aria-expanded={mobileDescOpen}
            >
              <span>{t(book.description_label)}</span>
              {mobileDescOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <div className={`book-info-content ${mobileDescOpen ? 'mobile-open' : ''}`}>
              <h1 className="book-title-main">{book.title}</h1>
              <p className="book-subtitle-kicker">{t(book.kicker)}</p>

              <div className="book-desc-body">
                <p className="book-desc-para">
                  {t(book.para_1)}
                </p>
                <p className="book-desc-para">
                  {t(book.para_2)}
                </p>
              </div>

              {/* Format Selectors */}
              <div className="book-format-badges">
                {formats.map((f) => (
                  <button
                    key={f}
                    className={`book-format-badge ${selectedFormat === f ? 'selected' : ''}`}
                    onClick={() => setSelectedFormat(f)}
                  >
                    <span className="book-format-dot" />
                    <span>{t(f)}</span>
                  </button>
                ))}
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="book-cta-row">
                <button className="btn-where-to-buy book-btn-primary" onClick={onBuyClick}>
                  <span>{t('Where to buy')}</span>
                  <span className="gold-dot" />
                </button>
                <button className="btn-get-sample book-btn-secondary" onClick={onSampleClick}>
                  <span>{t(book.cta_sample || 'Read the preface free')}</span>
                </button>
              </div>

              {/* Target Audience / "Who is this for?" */}
              <div className="book-who-section">
                <p className="book-who-label">{t(book.who_label)}</p>
                <ul className="book-who-list">
                  {whoFor.map((item) => (
                    <li key={item.id}>{t(item.title)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CHAPTERS OVERVIEW (SINGLE ROW CONTAINING ALL 18 CHAPTERS) ── */}
      <section className="book-chapters-section">
        <div className="book-chapters-inner">
          <h2 className="book-chapters-title">{t(book.chapters_title)}</h2>

          {/* Single-row scorecard bar containing all 18 chapters as per user request */}
          <div className="scorecard-bar-container book-scorecard-bar">
            <div className="scorecard-hole-label">{t('Hole')}</div>
            <div className="scorecard-numbers-row book-chapters-single-row" ref={chapterRowRef}>
              {allHoles.map((h, idx) => {
                const isActive = idx === activeChapterIdx;
                return (
                  <button
                    key={h.hole}
                    ref={(el) => {
                      chapterRefs.current[idx] = el;
                    }}
                    className={`scorecard-num-box ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectChapter(idx)}
                    title={`${t('Chapter / Hole')} ${h.hole}: ${t(h.title)}`}
                  >
                    {h.hole}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Details Card flanked by Navigation Arrows */}
          <div className="hole-card-nav-container book-chapter-nav-row">
            <button
              className="arrow-circle-btn"
              onClick={handlePrevChapter}
              aria-label={t('Previous chapter')}
            >
              <ChevronLeft size={22} />
            </button>

            <div className="hole-card-slider-viewport">
              <div
                key={activeChapterIdx}
                className={`hole-content-card book-chapter-preview-card slide-in-${slideDirection}`}
              >
                <span className="hole-big-numeral">{currentHole.numeral}</span>

                <div className="hole-card-inner">
                  <div className="hole-title-wrap">
                    <h4 className="hole-card-title">{t(currentHole.title)}</h4>
                    <p className="hole-card-sanskrit">{currentHole.sanskrit}</p>
                  </div>

                  {currentHole.image && (
                    <div className="hole-card-circle-img">
                      <img
                        src={currentHole.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <p className="hole-card-desc">
                    {t(currentHole.description)}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="arrow-circle-btn"
              onClick={handleNextChapter}
              aria-label={t('Next chapter')}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <p className="book-chapters-summary">{t(book.chapters_summary)}</p>
        </div>
      </section>

      {/* ── 3. FAQS SECTION ── */}
      <section className="book-faqs-section">
        <div className="book-faqs-inner">
          <h2 className="book-faqs-title">{t(book.faqs_title)}</h2>
          <div className="book-faqs-list">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} q={faq.question} a={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookPage;
