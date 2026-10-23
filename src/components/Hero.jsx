import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

// Words that fly into depth across the textured hero background
const WISDOM_WORDS = [
  'INNER BATTLE', 'EGO', 'DUALITY', 'AWARENESS', 'FOCUS',
  'STILLNESS', 'PURPOSE', 'PRESENT', 'BALANCE', 'CLARITY',
  'SURRENDER', 'ACTION', 'WISDOM', 'GITA', 'DEVOTION',
  'RENUNCIATION', 'DISCIPLINE', 'COURAGE', 'TRUTH', 'SELF',
  'THE ETERNAL', 'RESTRAINT', 'MEDITATION', 'KNOWLEDGE', 'LIBERATION',
];

// Start positions (px offset from the centre, as a fraction of the stage)
// x: -1 = far left, 1 = far right | y: -1 = top, 1 = bottom
// Selected to frame the floating book without obstructing it
const SLOTS = [
  [-0.75, -0.45], [0, -0.70],   [0.75, -0.45],
  [-0.80, 0],                   [0.80, 0],
  [-0.75, 0.45],                [0.75, 0.45],
  [-0.50, -0.30], [0.50, -0.30],
  [-0.52, 0.32],  [0.52, 0.32],
  [-0.32, -0.68], [0.32, -0.68],
];

function DepthStage({ t }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wi = 0;
    const active = [];
    let isMounted = true;

    function spawn() {
      if (!isMounted || !stage) return;
      const el = document.createElement('span');
      el.className = 'hero-depth-flyer';
      const rawWord = WISDOM_WORDS[wi++ % WISDOM_WORDS.length];
      el.textContent = t ? (t(rawWord) || rawWord) : rawWord;

      const w = stage.clientWidth || window.innerWidth;
      const h = stage.clientHeight || 496;
      el.style.setProperty('--x', '0px');
      el.style.setProperty('--y', '0px');
      stage.appendChild(el);
      const bw = el.offsetWidth || 140;
      const bh = el.offsetHeight || 38;
      const cw = bw * 1.3; // extra clearance for the initial 1.5 scale
      const ch = bh * 1.3;

      // Try slots in random order, take first that does not overlap a visible word
      const order = SLOTS.map((_, i) => i).sort(() => Math.random() - 0.5);
      let spot = null;
      for (const i of order) {
        const px = w / 2 + SLOTS[i][0] * w * 0.5;
        const py = h / 2 + SLOTS[i][1] * h * 0.5;
        const hit = active.some(
          (a) =>
            Math.abs(a.x - px) < (a.w + cw) / 2 + 24 &&
            Math.abs(a.y - py) < (a.h + ch) / 2 + 16,
        );
        if (!hit) {
          spot = { x: px, y: py, w: cw, h: ch };
          break;
        }
      }

      if (!spot) {
        el.remove();
        wi--;
        return; // No free spot right now
      }

      active.push(spot);
      const x = spot.x;
      const y = spot.y;
      const dur = parseFloat((3.5 + Math.random() * 1.5).toFixed(2));
      el.style.setProperty('--dur', `${dur}s`);

      // Center the text on its anchor point
      el.style.setProperty('--x', `${Math.round(x - bw / 2)}px`);
      el.style.setProperty('--y', `${Math.round(y - bh / 2)}px`);

      // Free slot once word has shrunk into distance
      setTimeout(() => {
        const k = active.indexOf(spot);
        if (k > -1) active.splice(k, 1);
      }, dur * 750);

      el.addEventListener('animationend', () => el.remove());
    }

    spawn();
    const interval = setInterval(spawn, 750);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (stage) stage.innerHTML = '';
    };
  }, [t]);

  return <div className="hero-word-stage" ref={stageRef} aria-hidden="true" />;
}

export const Hero = ({ onBuyClick, onSampleClick }) => {
  const { t } = useTranslation();
  const { settings, sections } = useCms();
  const hero = sections.hero || {};

  return (
    <div className="hero-section-wrapper" id="book">
      {/* ── 3D Text Into Depth Stage: words fly into depth with center vanishing point ── */}
      <DepthStage t={t} />

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
