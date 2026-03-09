import useReveal from '../hooks/useReveal';

const VALUES = [
  { label: 'Integrity', desc: 'Transparent dealings, always.' },
  { label: 'Precision', desc: 'Every detail matters.' },
  { label: 'Discretion', desc: 'Your privacy is sacred.' },
  { label: 'Excellence', desc: 'Nothing less, always more.' },
];

const CERTIFICATIONS = [
  'RERA Certified Agency',
  'DLD Registered',
  'ISO 9001 Compliant',
  'Member — Dubai Chamber',
];

const About = () => {
  const leftRef = useReveal('animate-on-scroll-left');
  const rightRef = useReveal('animate-on-scroll-right');

  return (
    <section id="about" className="py-32 bg-void relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="px-6 sm:px-10 lg:px-16 relative" style={{zIndex: 2, padding: 'clamp(60px, 10vh, 100px) clamp(20px, 5vw, 60px) 80px' }}>
        <div className="flex flex-col lg:grid gap-12 lg:gap-16 items-center" style={{ gridTemplateColumns: '65% 35%' }}>
          <div ref={leftRef} className="flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-line-h w-8 lg:w-12" />
                <span className="section-label text-[9px] lg:text-[10px]">Our Legacy</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginBottom: 16,
                }}
              >
                Two Decades of Shaping
                <br className="hidden sm:block" />
                <span className="text-gold-gradient"> Dubai&apos;s Landscape</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(14px, 2vw, 15px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.8,
                  marginBottom: 12,
                }}
              >
                Founded in 2006 in the heart of the Burj Khalifa District, Capita Prime LLC was
                born from a singular vision: to redefine how the world&apos;s elite access and invest
                in Dubai&apos;s most prestigious land assets.
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(14px, 2vw, 15px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.8,
                }}
              >
                Today, with over AED 4.2 billion in completed transactions and a clientele that
                spans 42 nationalities, we stand as Dubai&apos;s most trusted name in bespoke land
                investment advisory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 my-6 lg:my-10">
              {VALUES.map(v => (
                <div
                  key={v.label}
                  className="p-4 lg:p-6 transition-all duration-300 hover:bg-gold/5"
                  style={{
                    border: '1px solid rgba(201,168,76,0.15)',
                    background: 'rgba(201,168,76,0.03)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(20px, 3vw, 22px)',
                      fontWeight: 600,
                      color: '#C9A84C',
                      marginBottom: 8,
                    }}
                  >
                    {v.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(12px, 1.5vw, 13px)',
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.6,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {CERTIFICATIONS.map(cert => (
                <span
                  key={cert}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '9px',
                    lg: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    padding: '6px 10px lg:padding: 6px 12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#C9A84C', fontSize: '8px' }}>✦</span>
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="relative order-1 lg:order-2 w-full max-w-[400px] lg:max-w-none mx-auto">
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: '4/5', maxHeight: 520 }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(145deg, #0a1520 0%, #0d1e30 30%, #060c14 60%, #0a1520 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse 80% 80% at 50% 30%, rgba(201,168,76,0.12) 0%, transparent 70%)',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 20 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(60px, 8vw, 110px)',
                      fontWeight: 700,
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(201,168,76,0.25)',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    2006
                  </div>
                  <p className="section-label mb-4 lg:mb-6 text-[9px] lg:text-[10px]">Est. Dubai, UAE</p>
                  <div className="gold-line-h w-16 lg:w-24 mx-auto mb-4 lg:mb-6" />
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(20px, 3vw, 28px)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.5,
                      maxWidth: 280,
                      margin: '0 auto',
                    }}
                  >
                    &ldquo;Where the desert meets ambition, we build legacies.&rdquo;
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: 20,
                    bottom: 20,
                    border: '1px solid rgba(201,168,76,0.08)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    width: 20,
                    lg: 'width: 30',
                    height: 20,
                    lg: 'height: 30',
                    borderTop: '2px solid rgba(201,168,76,0.4)',
                    borderLeft: '2px solid rgba(201,168,76,0.4)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    width: 20,
                    lg: 'width: 30',
                    height: 20,
                    lg: 'height: 30',
                    borderBottom: '2px solid rgba(201,168,76,0.4)',
                    borderRight: '2px solid rgba(201,168,76,0.4)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: -15,
                lg: 'bottom: -20',
                right: 0,
                lg: 'left: -20',
                padding: '16px 24px lg:padding: 20px 28px',
                background: 'rgba(6,6,6,0.95)',
                border: '1px solid rgba(201,168,76,0.25)',
                backdropFilter: 'blur(20px)',
                zIndex: 10,
              }}
            >
              <p className="section-label mb-1 text-[9px]">Team Size</p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 600,
                  color: '#C9A84C',
                  lineHeight: 1,
                }}
              >
                45+
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: 2,
                }}
              >
                Land Investment Experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
