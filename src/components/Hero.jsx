import { useEffect, useRef, useCallback, useState } from 'react';
import createGlobe from 'cobe';
import { useCMS } from '../context/CMSContext';

const GLOBE_SIZE = 520;

const CobeGlobe = () => {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(1.2);
  const globeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const updatePointerInteraction = useCallback((value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  }, []);

  const updateMovement = useCallback((clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  }, []);

  useEffect(() => {
    let width = GLOBE_SIZE;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    let phi = 1.2;
    let theta = 0.42;

    setTimeout(() => setIsLoaded(true), 100);

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.8,
      mapSamples: 25000,
      mapBrightness: 6,
      baseColor: [0.06, 0.05, 0.02],
      markerColor: [0.788, 0.659, 0.298],
      glowColor: [0.7, 0.5, 0.15],
      scale: 1,
      offset: [0, 0],
      markers: [
        { location: [25.2048, 55.2708], size: 0.18 }, // Dubai Main
        { location: [25.1124, 55.1390], size: 0.12 }, // Palm Jumeirah
        { location: [25.1972, 55.2744], size: 0.1 },  // Downtown
        { location: [25.0777, 55.1304], size: 0.08 }, // Marina
        { location: [25.1314, 55.1887], size: 0.07 }, // Jumeirah
        { location: [24.4539, 54.3773], size: 0.07 }, // Abu Dhabi
        { location: [51.5074, -0.1278], size: 0.04 },
        { location: [40.7128, -74.006], size: 0.04 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + pointerInteractionMovement.current / 200;
        state.theta = theta;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globeRef.current?.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      style={{
        width: '100%',
        maxWidth: GLOBE_SIZE,
        aspectRatio: '1',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'glow 4s ease-in-out infinite',
        }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => updatePointerInteraction(e.clientX - pointerInteractionMovement.current)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          userSelect: 'none',
          filter: 'drop-shadow(0 0 40px rgba(201, 168, 76, 0.2))',
        }}
      />
    </div>
  );
};

const Hero = () => {
  const canvasRef = useRef(null);
  const { data } = useCMS();
  const { hero } = data;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.35 + 0.06,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - dist / 100) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#060606' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 65%)',
          zIndex: 1,
        }}
      />

      <div
        className="mx-auto w-full relative"
        style={{ zIndex: 10, padding: 'clamp(80px, 15vh, 120px) clamp(20px, 5vw, 60px) 80px' }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center min-h-[70vh] lg:min-h-[80vh]"
        >
          <div className="flex flex-col gap-6 lg:gap-8 order-2 lg:order-1 relative" style={{ zIndex: 10 }}>
            <div className="flex items-center gap-4">
              <div className="gold-line-h w-8 lg:w-12" />
              <span className="section-label text-[9px] lg:text-[10px]">{hero.label}</span>
              <div className="gold-line-h w-8 lg:w-12" />
            </div>

            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(40px, 8vw, 88px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                <span className="block text-white">{hero.titleLine1}</span>
                <span className="block text-shimmer">{hero.titleLine2}</span>
                <span className="block text-white">{hero.titleLine3}</span>
                <span
                  className="block"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(201,168,76,0.6)',
                  }}
                >
                  {hero.titleLine4}
                </span>
              </h1>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(14px, 2vw, 15px)',
                fontWeight: 300,
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.72)',
                maxWidth: '460px',
                textShadow: '0 0 10px rgba(0,0,0,0.8)',
              }}
            >
              {hero.description}
            </p>

            <div className="flex items-center gap-4 flex-wrap mt-2">
              <a href="#properties" className="btn-primary py-3 px-6 lg:py-4 lg:px-8">
                <span>{hero.ctaPrimary}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#contact" className="btn-outline py-3 px-6 lg:py-4 lg:px-8">
                <span>{hero.ctaSecondary}</span>
              </a>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 flex-wrap pt-2">
              {hero.locations.map(loc => (
                <span
                  key={loc}
                  className="text-[9px] lg:text-[10px] tracking-widest text-gold/70 px-3 py-1.5 lg:px-4 lg:py-2 border border-gold/20 bg-gold/5"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center lg:relative lg:order-2 w-full max-w-[320px] sm:max-w-[450px] lg:max-w-none mx-auto lg:pl-12 scale-110 sm:scale-100 absolute lg:static top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:translate-y-0 opacity-40 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
            style={{ zIndex: 5 }}
          >
            <div className="relative w-full flex items-center justify-center">
              <CobeGlobe />

              <div
                className="hero-float-badge hidden lg:block"
                style={{ top: '5%', right: '10%', animationDelay: '0s' }}
              >
                <div className="section-label mb-1">Prime Listing</div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#C9A84C',
                  }}
                >
                  AED 24,000,000
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '2px',
                  }}
                >
                  Jumeirah Bay Island
                </div>
              </div>

              <div
                className="hero-float-badge hidden lg:block"
                style={{ bottom: '12%', left: '0%', animationDelay: '2s' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 8px #22c55e',
                    }}
                  />
                  <span className="section-label">RERA Certified</span>
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  DLD Approved Agency
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2 mt-4 lg:mt-6 lg:justify-end w-full lg:pr-12 hidden lg:flex"
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#C9A84C',
                  boxShadow: '0 0 8px rgba(201,168,76,0.8)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(9px, 1.5vw, 10px)',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                }}
              >
                Interactive Intelligence · Dubai, UAE
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 2 }}>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 50,
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 gold-line-h"
        style={{ zIndex: 2 }}
      />
    </section>
  );
};

export default Hero;
