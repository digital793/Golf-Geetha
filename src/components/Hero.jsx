import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

// All the wisdom words that can float randomly in the black hero bg
const WISDOM_WORDS = [
  'INNER BATTLE', 'EGO', 'DUALITY', 'AWARENESS', 'FOCUS',
  'STILLNESS', 'PURPOSE', 'PRESENT', 'BALANCE', 'CLARITY',
  'SURRENDER', 'ACTION', 'WISDOM', 'GITA', 'DEVOTION',
  'RENUNCIATION', 'DISCIPLINE', 'COURAGE', 'TRUTH', 'SELF',
  'THE ETERNAL', 'RESTRAINT', 'MEDITATION', 'KNOWLEDGE', 'LIBERATION',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function FloatingWord({ word, onDone }) {
  const [phase, setPhase] = useState('initial'); // initial → visible → zoomout
  // Position words in left, right, or upper dark hero banner, avoiding the central book
  const pos = useRef(null);
  if (!pos.current) {
    const zone = Math.random();
    let x, y;
    if (zone < 0.42) {
      // Left side of book
      x = randomBetween(3, 30);
      y = randomBetween(22, 80);
    } else if (zone < 0.84) {
      // Right side of book
      x = randomBetween(68, 92);
      y = randomBetween(22, 80);
    } else {
      // Upper band
      x = randomBetween(12, 82);
      y = randomBetween(18, 34);
    }
    pos.current = {
      x,
      y,
      size: randomBetween(22, 54),
    };
  }

  useEffect(() => {
    // 1. Appear normally: fade in at normal scale = 1
    const tEnter = setTimeout(() => setPhase('visible'), 40);
    // 2. Stay legible at scale 1, then disappear with Zoom Out (shrink to distance while fading)
    const tZoomOut = setTimeout(() => setPhase('zoomout'), 1800);
    // 3. Remove once fully vanished
    const tEnd = setTimeout(() => onDone(), 2700);
    return () => {
      clearTimeout(tEnter);
      clearTimeout(tZoomOut);
      clearTimeout(tEnd);
    };
  }, [onDone]);

  // Normal appear: starts at opacity 0, scale 1 -> transitions to opacity 1, scale 1
  // Zoom out disappear: shrinks to scale 0.25 while fading to opacity 0
  let opacity = 0;
  let scale = 1;

  if (phase === 'initial') {
    opacity = 0;
    scale = 1; // Start at normal scale
  } else if (phase === 'visible') {
    opacity = 0.28; // Subtle ambient watermark in dark hero
    scale = 1; // Stay at normal scale
  } else if (phase === 'zoomout') {
    opacity = 0; // Fade out
    scale = 0.25; // Zoom out away into distance
  }

  const transitionDuration = phase === 'zoomout' ? '850ms' : '550ms';
  const transitionEase = phase === 'zoomout'
    ? 'cubic-bezier(0.4, 0, 0.2, 1)'
    : 'cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <span
      style={{
        position: 'absolute',
        left: `${pos.current.x}%`,
        top: `${pos.current.y}%`,
        fontSize: `${pos.current.size}px`,
        fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#ffd89a',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        filter: phase === 'zoomout' ? 'blur(2px)' : 'none',
        transition: `opacity ${transitionDuration} ${transitionEase}, transform ${transitionDuration} ${transitionEase}, filter ${transitionDuration} ease`,
        willChange: 'opacity, transform',
      }}
    >
      {word}
    </span>
  );
}

export const Hero = ({ onBuyClick, onSampleClick }) => {
  const { t } = useTranslation();
  const { settings, sections } = useCms();
  const hero = sections.hero || {};
  const [floaters, setFloaters] = useState([]);
  const nextId = useRef(0);

  // Spawn a new floating word every 700ms in the dark hero background
  useEffect(() => {
    const spawnWord = () => {
      const word = WISDOM_WORDS[Math.floor(Math.random() * WISDOM_WORDS.length)];
      const id = nextId.current++;
      setFloaters((prev) => [...prev.slice(-10), { id, word }]);
    };
    spawnWord();
    const interval = setInterval(spawnWord, 750);
    return () => clearInterval(interval);
  }, []);

  const removeFloater = (id) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="hero-section-wrapper" id="book">
      {/* ── Floating ambient wisdom words across the 496px dark hero zone ── */}
      <div className="hero-word-stage" aria-hidden="true">
        {floaters.map((f) => (
          <FloatingWord
            key={f.id}
            word={t(f.word) || f.word}
            onDone={() => removeFloater(f.id)}
          />
        ))}
      </div>

      {/* ── Document-flow spacer (92px): preserves natural flow so white content begins cleanly below the 496px dark top banner ── */}
      <div className="hero-flow-spacer" aria-hidden="true" />

      {/* ── Floating Book Cover ── */}
      <div className="hero-floating-book" onClick={onBuyClick}>
        <div className="book-ambient-glow" />
        <img
          src={settings.book_cover}
          alt={t('Golf Gita book cover: An ancient map for the modern round')}
          className="hero-book-image"
          loading="eager"
        />
      </div>

      {/* ── White Hero Content Area (Positioned cleanly below the book with no clipping) ── */}
      <div className="hero-bottom-content-area">
        <div className="hero-content-frame">
          <h2 className="hero-title-main">
            {t(hero.title_line_1)}<br />
            {t(hero.title_line_2)}
          </h2>

          <p className="hero-subtitle-desc">
            {t(hero.subtitle)}
          </p>

          <div className="hero-buttons-container">
            <button className="btn-where-to-buy" onClick={onBuyClick}>
              <span>{t(hero.cta_buy)}</span>
              <span className="gold-dot" />
            </button>

            <button className="btn-get-sample" onClick={onSampleClick}>
              <span>{t(hero.cta_sample)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
