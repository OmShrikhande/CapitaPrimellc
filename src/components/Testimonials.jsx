import useReveal from '../hooks/useReveal';
import { useCMS } from '../context/useCMS';

const StarRow = () => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  const headingRef = useReveal();
  const { data } = useCMS();
  const { testimonials } = data;

  return (
    <section id="testimonials" className="py-32 bg-obsidian relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="px-16 relative" >
        <div ref={headingRef} className="text-center mb-20" >
          <div className="flex items-center justify-center gap-4 mb-6" >
            <div className="gold-line-h w-12"  />
            <span className="section-label">{testimonials.label}</span>
            <div className="gold-line-h w-12" />
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4.5vw, 58px)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            {testimonials.titleLine1}
            <span className="text-gold-gradient"> {testimonials.titleLine2}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6" style={{maxWidth: "95%", margin: '0 auto', position: 'relative', zIndex: 1, marginBottom: "50px"}}>
          {(testimonials.items || []).map((t, i) => (
            <div
              key={i}
              className="testimonial-card animate-on-scroll"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <StarRow />

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '18px',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.75,
                  marginTop: 24,
                  marginBottom: 28,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {t.quote}
              </p>

              <div className="gold-line-h mb-6" />

              <div className="flex items-center gap-4">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#C9A84C',
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: 2,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {t.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
