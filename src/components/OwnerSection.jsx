import useReveal from '../hooks/useReveal';

const OWNER_IMAGE = '/owner%20info.jpeg';

const OwnerSection = () => {
  const leftRef = useReveal('animate-on-scroll-left');
  const rightRef = useReveal('animate-on-scroll-right');

  return (
    <section
      id="leadership"
      className="py-28 bg-void relative overflow-hidden"
      aria-labelledby="owner-section-title"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 90%, rgba(201,168,76,0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="px-6 sm:px-10 lg:px-16 relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div ref={leftRef} className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, rgba(201,168,76,0.12) 0%, rgba(6,6,6,0.95) 45%)',
              }}
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={OWNER_IMAGE}
                  alt="Anshuman Kasera, Founder and CEO of Capita Prime LLC"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(6,6,6,0.85) 0%, transparent 45%)',
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <p className="text-[10px] font-bold tracking-[0.28em] text-gold uppercase mb-2">Leadership</p>
                <p className="font-serif text-2xl lg:text-3xl text-white font-semibold tracking-tight">Anshuman Kasera</p>
                <p className="text-sm text-white/55 mt-1 font-medium tracking-wide">Founder &amp; CEO</p>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="gold-line-h w-10 lg:w-12" />
                <span className="section-label text-[9px] lg:text-[10px]">Our team</span>
              </div>
              <h2
                id="owner-section-title"
                className="text-white"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(32px, 4.5vw, 52px)',
                  fontWeight: 600,
                  lineHeight: 1.08,
                }}
              >
                Guided by <span className="text-gold-gradient">experience</span> in Dubai real estate
              </h2>
            </div>

            <div
              className="space-y-6 text-[15px] leading-relaxed "
              style={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255,255,255,0.52)',
                textAlign: 'justify',
                textJustify: 'inter-word',
              
              }}
            >
              <p>
                Anshuman Kasera brings <strong className="text-white/80 font-medium">14+ years</strong> in real estate,
                grounded by an <strong className="text-white/80 font-medium">MBA</strong> and a{' '}
                <strong className="text-white/80 font-medium">Physics degree</strong> from Mumbai University, where he
                graduated with distinction and ranked second in the university.
              </p>
              <p>
                His path began in the mechanical industry before an MBA and a deliberate move into sales-led roles. He
                spent <strong className="text-white/80 font-medium">eight years at Indiabulls</strong> across the stock
                market and real estate, including as a pioneer leader helping launch mandate business in 2012–13. He
                then led <strong className="text-white/80 font-medium">Grade-A developer portfolios</strong> (L&amp;T,
                Wadhwa) at Property Pistol, built{' '}
                <strong className="text-white/80 font-medium">Homesy&apos;s Harbour region</strong> presence, and
                helped establish real estate verticals at Finwizz before founding Capita Prime.
              </p>
              <p>
                Core strengths include <strong className="text-white/80 font-medium">sales leadership</strong>, deep
                understanding of <strong className="text-white/80 font-medium">mandate and sales-service</strong>{' '}
                models, and a clear vision for how advisory teams should serve investors and landowners.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-4 pt-2"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                paddingTop: '1.5rem',
              }}
            >
              {['Sales excellence', 'Mandate industry pioneer', 'Developer-grade portfolios'].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-gold/25 text-gold/90 bg-gold/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerSection;
