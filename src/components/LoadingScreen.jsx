import { useState, useEffect } from 'react';

const WORD_1 = 'CAPITA';
const WORD_2 = 'PRIME';
const WORD_3 = 'LLC';
const ALL_LETTERS = [...WORD_1.split(''), ' ', ...WORD_2.split(''), ' ', ...WORD_3.split('')];

const LoadingScreen = ({ onDone }) => {
  const [shown, setShown] = useState(0);
  const [lineVisible, setLineVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [];
    ALL_LETTERS.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(s => s + 1), 80 * (i + 1)));
    });
    timers.push(setTimeout(() => setLineVisible(true), 80 * ALL_LETTERS.length + 300));
    timers.push(setTimeout(() => setFadeOut(true), 2600));
    timers.push(setTimeout(() => onDone?.(), 3200));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center gap-6"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="flex items-center gap-0 relative z-10">
        {ALL_LETTERS.map((letter, i) => (
          <span
            key={i}
            className="loading-letter"
            style={{
              opacity: shown > i ? 1 : 0,
              transform: shown > i ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${i * 0.02}s`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: letter === ' ' ? 'transparent' : i < WORD_1.length ? '#ffffff' : '#C9A84C',
              width: letter === ' ' ? '1.2em' : 'auto',
              display: 'inline-block',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>

      <div
        className="origin-left"
        style={{
          height: '1px',
          width: '180px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          transform: lineVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      <p
        className="section-label"
        style={{
          opacity: lineVisible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.3s',
        }}
      >
        Dubai Land Investment
      </p>
    </div>
  );
};

export default LoadingScreen;
