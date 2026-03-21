import useReveal from '../hooks/useReveal';
import { useCMS } from '../context/useCMS';

const About = () => {
  const leftRef = useReveal('animate-on-scroll-left');
  const rightRef = useReveal('animate-on-scroll-right');
  const { data } = useCMS();
  const about = data?.about;

  if (!about) return null;

  return (
    <section id="about" className="py-46 bg-void relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="px-6 sm:px-10 lg:px-16 relative">
        <div className="flex flex-col lg:grid gap-12 lg:gap-16 items-center" style={{ gridTemplateColumns: '65% 35%' }}>
          <div ref={leftRef} className="flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-line-h w-8 lg:w-12" />
                <span className="section-label text-[9px] lg:text-[10px]">{about.label}</span>
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
                {about.titleLine1}
                <br className="hidden sm:block" />
                <span className="text-gold-gradient"> {about.titleLine2}</span>
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
                {about.description1}
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
                {about.description2}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 my-6 lg:my-10">
              {about.values.map(v => (
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
              {about.certifications.map(cert => (
                <span
                  key={cert}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    padding: '6px 10px',
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
                    {about.estYear}
                  </div>
                  <p className="section-label mb-4 lg:mb-6 text-[9px] lg:text-[10px]">{about.estLocation || 'Est. Dubai, UAE'}</p>
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
                    &ldquo;{about.quote}&rdquo;
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
                    height: 20,
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
                    height: 20,
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
                right: 0,
                padding: '16px 24px',
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
                {about.teamSize}
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
