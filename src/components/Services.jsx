import useReveal from '../hooks/useReveal';
import { useCMS } from '../context/useCMS';

const ICON_MAP = {
  'Land Acquisition': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  'Investment Strategy': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  'Legal & Compliance': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  'Market Intelligence': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  'Property Valuation': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'Global Investor Relations': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const Services = () => {
  const headingRef = useReveal();
  const { data } = useCMS();
  const { services } = data;

  return (
    <section id="services" className="py-24 bg-obsidian relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="px-6 sm:px-10 lg:px-16 relative">
        <div ref={headingRef} className="text-center mb-12 lg:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="gold-line-h w-8 lg:w-12" />
            <span className="section-label text-[9px] lg:text-[10px]">{services.label}</span>
            <div className="gold-line-h w-8 lg:w-12" />
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 5vw, 58px)',
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            {services.titleLine1}
            <br className="sm:hidden" />
            <span className="text-gold-gradient"> {services.titleLine2}</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(14px, 2vw, 15px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 540,
              margin: '20px auto 0',
              lineHeight: 1.8,
            }}
          >
            {services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{paddingTop:"1%"}}>
          {(services.items || []).map((service, i) => (
            <div
              key={i}
              className="service-card animate-on-scroll p-6 lg:p-8"
              style={{ 
                transitionDelay: `${(i % 3) * 0.1}s`,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div
                className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-6"
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                {ICON_MAP[service.title] || DEFAULT_ICON}
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(20px, 3vw, 24px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: 12,
                }}
              >
                {service.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(13px, 1.5vw, 14px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8,
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
