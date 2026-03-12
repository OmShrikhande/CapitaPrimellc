import { useEffect, useRef, useState } from 'react';
import { useCMS } from '../context/useCMS';

const STATS = [
  { value: 4.2, suffix: 'B+', prefix: 'AED ', label: 'Total Transaction Volume', decimal: true },
  { value: 18, suffix: '+', prefix: '', label: 'Years of Excellence', decimal: false },
  { value: 650, suffix: '+', prefix: '', label: 'Satisfied Investors', decimal: false },
  { value: 1200, suffix: '+', prefix: '', label: 'Prime Plots Transacted', decimal: false },
];

const useCounter = (target, decimal = false, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, decimal, duration]);

  return { ref, count };
};

const StatItem = ({ value, suffix, prefix, label, decimal, index }) => {
  const { ref, count } = useCounter(value, decimal);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-8 animate-on-scroll"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="stat-number">
        {prefix}
        {decimal ? count.toFixed(1) : count.toLocaleString()}
        <span style={{ color: '#E8D5A3', fontSize: '0.65em', fontWeight: 400 }}>{suffix}</span>
      </div>
      <div className="gold-line-h w-16 my-4" />
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        {label}
      </p>
    </div>
  );
};

const Stats = () => {
  const { data } = useCMS();
  const { stats } = data;

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="mx-auto px-6 sm:px-10 lg:px-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 lg:gap-0 sm:divide-x divide-[rgba(255,255,255,0.06)]">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
