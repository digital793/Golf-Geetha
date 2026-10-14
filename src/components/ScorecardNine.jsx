import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n';

export const ScorecardNine = ({
  title = "FRONT NINE",
  holes = [],
  defaultActive = 1,
}) => {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(defaultActive);
  const [slideDirection, setSlideDirection] = useState('next');
  const numberRowRef = useRef(null);
  const numberRefs = useRef([]);
  const skipRowScroll = useRef(true);

  const currentHole = holes[activeIdx] || holes[0];

  useEffect(() => {
    if (skipRowScroll.current) {
      skipRowScroll.current = false;
      return;
    }
    const row = numberRowRef.current;
    const activeButton = numberRefs.current[activeIdx];
    if (!row || !activeButton) return;

    const rowRect = row.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    row.scrollTo({
      left: row.scrollLeft + (buttonRect.left - rowRect.left) - rowRect.width / 2 + buttonRect.width / 2,
      behavior: 'smooth',
    });
  }, [activeIdx]);

  const handlePrev = () => {
    setSlideDirection('previous');
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : holes.length - 1));
  };

  const handleNext = () => {
    setSlideDirection('next');
    setActiveIdx((prev) => (prev < holes.length - 1 ? prev + 1 : 0));
  };

  const handleSelectHole = (idx) => {
    if (idx === activeIdx) return;
    setSlideDirection(idx > activeIdx ? 'next' : 'previous');
    setActiveIdx(idx);
  };

  return (
    <section className="figma-scorecard-section">
      <div className="scorecard-main-container">
        {/* Section Title: FRONT NINE / BACK NINE */}
        <h3 className="scorecard-section-title">{t(title)}</h3>

        {/* Scorecard Bar (Clean single-row pill matching design) */}
        <div className="scorecard-bar-container">
          <div className="scorecard-hole-label">{t('Hole')}</div>
          <div className="scorecard-numbers-row" ref={numberRowRef}>
            {holes.map((h, idx) => (
              <button
                key={h.hole}
                ref={(el) => {
                  numberRefs.current[idx] = el;
                }}
                className={`scorecard-num-box ${idx === activeIdx ? 'active' : ''}`}
                onClick={() => handleSelectHole(idx)}
                title={`${t('Hole')} ${h.hole}: ${t(h.title)}`}
              >
                {h.hole}
              </button>
            ))}
          </div>
        </div>

        {/* Hole Card & Nav Container */}
        <div className="hole-card-nav-container">
          <button
            className="arrow-circle-btn"
            onClick={handlePrev}
            aria-label={t('Previous hole')}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="hole-card-slider-viewport">
            <div
              key={activeIdx}
              className={`hole-content-card slide-in-${slideDirection}`}
            >
              {/* Top Left Huge Numeral (Cinzel Decorative) */}
              <span className="hole-big-numeral">{currentHole.numeral}</span>

              {/* Center Content Column */}
              <div className="hole-card-inner">
                <div className="hole-title-wrap">
                  <h4 className="hole-card-title">{t(currentHole.title)}</h4>
                  <p className="hole-card-sanskrit">{currentHole.sanskrit}</p>
                </div>

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

                <p className="hole-card-desc">
                  {t(currentHole.description)}
                </p>
              </div>
            </div>
          </div>

          <button
            className="arrow-circle-btn"
            onClick={handleNext}
            aria-label={t('Next hole')}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};
