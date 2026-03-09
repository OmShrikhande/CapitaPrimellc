import { useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ALL_PROPERTIES = [
  {
    title: 'Emirates Hills Grand Estate',
    location: 'Emirates Hills, Dubai',
    area: '15,000',
    price: '18,500,000',
    category: 'Residential',
    badge: 'EXCLUSIVE',
    gradient: 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
    accent: '#1a4d1a',
    features: ['Sea View', 'Corner Plot', 'Freehold'],
  },
  {
    title: 'Palm Jumeirah Frond Plot',
    location: 'Palm Jumeirah, Dubai',
    area: '8,500',
    price: '12,200,000',
    category: 'Residential',
    badge: 'PRIME',
    gradient: 'linear-gradient(135deg, #021929 0%, #032438 40%, #01131e 100%)',
    accent: '#044266',
    features: ['Beachfront', 'Private Access', 'Freehold'],
  },
  {
    title: 'Business Bay Canal Front',
    location: 'Business Bay, Dubai',
    area: '22,000',
    price: '9,750,000',
    category: 'Commercial',
    badge: 'HOT',
    gradient: 'linear-gradient(135deg, #0d0a1f 0%, #151030 40%, #090714 100%)',
    accent: '#2a2060',
    features: ['Canal View', 'G+50 Permitted', 'Freehold'],
  },
  {
    title: 'MBR City Prime Plot',
    location: 'Mohammed Bin Rashid City',
    area: '30,000',
    price: '7,800,000',
    category: 'Mixed Use',
    badge: 'NEW',
    gradient: 'linear-gradient(135deg, #0a0f1f 0%, #101828 40%, #080d1a 100%)',
    accent: '#1a2a50',
    features: ['Master Plan', 'Flexible Zoning', 'Freehold'],
  },
  {
    title: 'Jumeirah Bay Island',
    location: 'Jumeirah Bay Island, Dubai',
    area: '12,000',
    price: '24,000,000',
    category: 'Residential',
    badge: 'ULTRA PRIME',
    gradient: 'linear-gradient(135deg, #011a1a 0%, #022828 40%, #010f0f 100%)',
    accent: '#044040',
    features: ['Island Living', '360° Views', 'Ultra-Premium'],
  },
  {
    title: 'Downtown Dubai Plot',
    location: 'Downtown Dubai, Sheikh Zayed Rd',
    area: '6,000',
    price: '32,000,000',
    category: 'Commercial',
    badge: 'LANDMARK',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #2a1200 40%, #140800 100%)',
    accent: '#4a2000',
    features: ['Burj Khalifa View', 'High ROI', 'Freehold'],
  },
  {
    title: 'Dubai Hills Villa Plot',
    location: 'Dubai Hills Estate',
    area: '12,500',
    price: '15,000,000',
    category: 'Residential',
    badge: 'LUXURY',
    gradient: 'linear-gradient(135deg, #1f1a0a 0%, #2b240d 40%, #1a1609 100%)',
    accent: '#4d411a',
    features: ['Golf Course View', 'Park Facing', 'Freehold'],
  },
  {
    title: 'Al Barari Sanctuary Plot',
    location: 'Al Barari, Dubai',
    area: '18,000',
    price: '13,500,000',
    category: 'Residential',
    badge: 'SERENE',
    gradient: 'linear-gradient(135deg, #0a1f15 0%, #0d2b1e 40%, #091a12 100%)',
    accent: '#1a4d34',
    features: ['Greenery View', 'Private Cul-de-sac', 'Freehold'],
  },
  {
    title: 'Dubai Creek Harbour Plot',
    location: 'Dubai Creek Harbour',
    area: '25,000',
    price: '22,000,000',
    category: 'Commercial',
    badge: 'WATERFRONT',
    gradient: 'linear-gradient(135deg, #0a151f 0%, #0d1e2b 40%, #09121a 100%)',
    accent: '#1a344d',
    features: ['Waterfront', 'Iconic Tower View', 'Freehold'],
  }
];

const CATEGORY_COLORS = {
  Residential: '#4ade80',
  Commercial: '#60a5fa',
  'Mixed Use': '#c084fc',
};

const PropertyCard = ({ property, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 18;
    card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
    card.style.transition = 'transform 0.1s linear';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  };

  return (
    <div
      ref={cardRef}
      className="property-card animate-on-scroll"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transitionDelay: `${(index % 3) * 0.12}s` }}
    >
      <div className="property-card-img" style={{ background: property.gradient }}>
        <div className="prop-blueprint-fine" />
        <div className="prop-blueprint" />
        <div className="prop-scan" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 80% at 20% 20%, ${property.accent}60 0%, transparent 65%)`,
            zIndex: 1,
          }}
        />

        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />

        <div className="prop-building-icon">
          {property.category === 'Residential' ? (
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
              <rect x="15" y="35" width="40" height="28" />
              <polyline points="5,35 35,10 65,35" />
              <rect x="28" y="45" width="14" height="18" />
              <line x1="15" y1="35" x2="55" y2="35" />
              <rect x="18" y="40" width="8" height="8" />
              <rect x="44" y="40" width="8" height="8" />
            </svg>
          ) : property.category === 'Commercial' ? (
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
              <rect x="18" y="10" width="34" height="53" />
              <line x1="18" y1="20" x2="52" y2="20" />
              <line x1="18" y1="30" x2="52" y2="30" />
              <line x1="18" y1="40" x2="52" y2="40" />
              <line x1="18" y1="50" x2="52" y2="50" />
              <rect x="23" y="14" width="6" height="4" />
              <rect x="33" y="14" width="6" height="4" />
              <rect x="43" y="14" width="6" height="4" />
              <rect x="23" y="23" width="6" height="4" />
              <rect x="33" y="23" width="6" height="4" />
              <rect x="43" y="23" width="6" height="4" />
              <rect x="29" y="54" width="12" height="9" />
            </svg>
          ) : (
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
              <rect x="10" y="30" width="22" height="33" />
              <rect x="38" y="15" width="22" height="48" />
              <line x1="32" y1="30" x2="38" y2="30" />
              <line x1="10" y1="45" x2="32" y2="45" />
              <line x1="38" y1="30" x2="38" y2="15" />
              <rect x="43" y="20" width="5" height="5" />
              <rect x="51" y="20" width="5" height="5" />
              <rect x="43" y="30" width="5" height="5" />
              <rect x="51" y="30" width="5" height="5" />
              <rect x="14" y="35" width="5" height="5" />
              <rect x="22" y="35" width="5" height="5" />
            </svg>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            background: 'rgba(6,6,6,0.8)',
            border: '1px solid rgba(201,168,76,0.4)',
            backdropFilter: 'blur(12px)',
            padding: '4px 12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#C9A84C',
          }}
        >
          {property.badge}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: `${CATEGORY_COLORS[property.category]}18`,
            border: `1px solid ${CATEGORY_COLORS[property.category]}55`,
            backdropFilter: 'blur(12px)',
            padding: '4px 12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: CATEGORY_COLORS[property.category],
          }}
        >
          {property.category}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 10,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {property.features.map(f => (
            <span
              key={f}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '9px',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(6,6,6,0.65)',
                padding: '3px 8px',
                letterSpacing: '0.08em',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="property-card-content">
        <div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '22px',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {property.title}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {property.location}
          </p>
        </div>

        <div className="gold-line-h opacity-30" />

        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>
              Plot Size
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
              {property.area} <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>sq.ft</span>
            </p>
          </div>
          <div className="text-right">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>
              Asking Price
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600, color: '#C9A84C' }}>
              <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: 'rgba(201,168,76,0.7)', marginRight: 3 }}>AED</span>
              {property.price}
            </p>
          </div>
        </div>

        <a
          href="#contact"
          className="mt-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.2)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.14)';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
          }}
        >
          <span>Enquire Now</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const ListingsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Setup observer for animations
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
    );

    const SELECTORS = '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right';
    document.querySelectorAll(SELECTORS).forEach((el) => obs.observe(el));
    
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-void min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="px-16 lg:px-24">
          <div className="mb-20 animate-on-scroll">
            <div className="flex items-center gap-4 mb-6">
              <div className="gold-line-h w-12" />
              <span className="section-label">Inventory</span>
            </div>
            <h1
              className="max-w-4xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#ffffff'
              }}
            >
              Full Portfolio of <span className="text-gold-gradient">Premium Plots</span>
            </h1>
            <p className="mt-8 text-white/40 max-w-3xl font-light tracking-wide text-lg leading-relaxed">
              Explore our comprehensive collection of exclusive land opportunities across Dubai's most prestigious locations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ALL_PROPERTIES.map((property, i) => (
              <PropertyCard key={i} property={property} index={i} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListingsPage;
