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
  const [phase, setPhase] = useState('appear'); // appear → hold → fade
  const x = useRef(randomBetween(5, 75));
  const y = useRef(randomBetween(8, 82));
  const baseSize = useRef(randomBetween(24, 80));
  const delay = useRef(randomBetween(0, 300));

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), delay.current + 600);
    const t2 = setTimeout(() => setPhase('fade'), delay.current + 1600);
    const t3 = setTimeout(() => onDone(), delay.current + 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const opacity = phase === 'appear' ? 0 : phase === 'hold' ? 1 : 0;
  const scale = phase === 'appear' ? 1.6 : phase === 'hold' ? 1 : 0.5;
  const blur = phase === 'fade' ? 4 : 0;

  return (
    <span
      style={{
        position: 'absolute',
        left: `${x.current}%`,
        top: `${y.current}%`,
        fontSize: `${baseSize.current}px`,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'rgba(247, 240, 230, 0.18)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: `scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        transition: `opacity ${phase === 'appear' ? 600 : 900}ms cubic-bezier(0.4,0,0.2,1), transform ${phase === 'appear' ? 600 : 900}ms cubic-bezier(0.4,0,0.2,1), filter 900ms ease`,
        transitionDelay: `${delay.current}ms`,
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

  // Spawn a new floating word every 600ms, removing done ones
  useEffect(() => {
    const spawnWord = () => {
      const word = WISDOM_WORDS[Math.floor(Math.random() * WISDOM_WORDS.length)];
      const id = nextId.current++;
      setFloaters((prev) => [...prev.slice(-12), { id, word }]);
    };
    spawnWord();
    const interval = setInterval(spawnWord, 700);
    return () => clearInterval(interval);
  }, []);

  const removeFloater = (id) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="hero-section-wrapper" id="book">
      {/* ── Floating ambient wisdom words ── */}
      <div className="hero-word-stage" aria-hidden="true">
        {floaters.map((f) => (
          <FloatingWord
            key={f.id}
            word={t(f.word) || f.word}
            onDone={() => removeFloater(f.id)}
          />
        ))}
      </div>

      <div className="hero-floating-book" onClick={onBuyClick}>
        <div className="book-ambient-glow" />
        <img
          src={settings.book_cover}
          alt={t('Golf Gita book cover: An ancient map for the modern round')}
          className="hero-book-image"
          loading="eager"
        />
      </div>

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
