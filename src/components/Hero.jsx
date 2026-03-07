import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

const GLOBE_SIZE = 520;

const CobeGlobe = () => {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(1.2);
  const globeRef = useRef(null);

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

    let phi = phiRef.current;
    let theta = 0.28;

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 20000,
      mapBrightness: 4.5,
      baseColor: [0.08, 0.06, 0.03],
      markerColor: [0.788, 0.659, 0.298],
      glowColor: [0.5, 0.38, 0.14],
      scale: 1,
      offset: [0, 0],
      markers: [
        { location: [25.2048, 55.2708], size: 0.12 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [22.3964, 114.1095], size: 0.05 },
        { location: [1.3521, 103.8198], size: 0.04 },
        { location: [48.8566, 2.3522], size: 0.04 },
        { location: [35.6762, 139.6503], size: 0.04 },
        { location: [24.4539, 54.3773], size: 0.07 },
        { location: [26.0667, 50.5577], size: 0.05 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.004;
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
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
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
        }}
      />
    </div>
  );
};

const Hero = () => {
  const canvasRef = useRef(null);

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
            'radial-gradient(ellipse 70% 60% at 25% 50%, rgba(201,168,76,0.06) 0%, transparent 65%), radial-gradient(ellipse 50% 70% at 78% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      <div
        className="max-w-[1400px] mx-auto w-full relative"
        style={{ zIndex: 2, padding: '100px 60px 80px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="gold-line-h w-12" />
              <span className="section-label">Dubai&apos;s Premier Land Consultancy</span>
            </div>

            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(48px, 5.5vw, 88px)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                }}
              >
                <span className="block text-white">Where</span>
                <span className="block text-shimmer">Visionaries</span>
                <span className="block text-white">Invest in the</span>
                <span
                  className="block"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(201,168,76,0.6)',
                  }}
                >
                  Golden Horizon
                </span>
              </h1>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.52)',
                maxWidth: '460px',
              }}
            >
              Exclusive access to Dubai&apos;s most coveted land plots. From Palm Jumeirah
              fronds to downtown commercial masterpieces — we connect elite investors with
              tomorrow&apos;s landmarks.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <a href="#properties" className="btn-primary">
                <span>Explore Listings</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#contact" className="btn-outline">
                <span>Book Consultation</span>
              </a>
            </div>

            <div className="flex items-center gap-3 flex-wrap pt-2">
              {['Palm Jumeirah', 'Emirates Hills', 'Creek Harbour', 'MBR City'].map(loc => (
                <span
                  key={loc}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    color: 'rgba(201,168,76,0.7)',
                    padding: '6px 14px',
                    border: '1px solid rgba(201,168,76,0.2)',
                    background: 'rgba(201,168,76,0.05)',
                  }}
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              gap: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CobeGlobe />

              <div
                className="hero-float-badge"
                style={{ top: '5%', right: '-2%', animationDelay: '0s' }}
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
                className="hero-float-badge"
                style={{ bottom: '12%', left: '-2%', animationDelay: '2s' }}
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

              <div
                className="hero-float-badge"
                style={{ bottom: '40%', right: '-4%', animationDelay: '3.5s' }}
              >
                <div className="section-label mb-1">Transaction Volume</div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  AED 4.2<span style={{ color: '#C9A84C' }}>B+</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
              }}
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
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                }}
              >
                Drag to rotate · Dubai, UAE
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
