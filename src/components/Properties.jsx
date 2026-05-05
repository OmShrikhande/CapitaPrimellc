import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import { useCMS } from '../context/useCMS';
import { adminAPI, getImageURL } from '../context/api';
import { PriceOfferDisplay, getOfferMeta } from './PriceOfferDisplay';

const CATEGORY_COLORS = {
  Residential: '#4ade80',
  Commercial: '#60a5fa',
  'Mixed Use': '#c084fc',
};

const PropertyCard = ({ property, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { hasOffer, pct } = getOfferMeta(property.price, property.compareAtPrice);
  const unlockFee =
    property.viewingFeeAed != null && property.viewingFeeAed !== ''
      ? Number(property.viewingFeeAed)
      : 0;
  const paidUnlock = !!property.isSpecial && Number.isFinite(unlockFee) && unlockFee > 0;
  const coverIndex =
    Number.isInteger(property.coverImageIndex) && property.coverImageIndex >= 0
      ? property.coverImageIndex
      : 0;
  const coverImage =
    property.coverImageUrl
      ? property.coverImageUrl
      : Array.isArray(property.gallery) && property.gallery.length > 0
      ? property.gallery[Math.min(coverIndex, property.gallery.length - 1)] || property.gallery[0]
      : null;

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
      className="property-card animate-on-scroll group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        setIsHovered(false);
        handleMouseLeave(e);
      }}
      style={{ transitionDelay: `${(index % 3) * 0.12}s` }}
    >
      <div
        className="property-card-img group"
        style={{
          background: property.gradient,
          aspectRatio: '9 / 16',
          minHeight: 'auto',
          height: 'auto',
        }}
      >
        {coverImage ? (
          <img
            src={getImageURL(coverImage) || coverImage}
            alt={property.title}
            className="absolute inset-0 z-[1] w-full h-full object-cover opacity-90"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <>
            <div className="prop-blueprint-fine" />
            <div className="prop-blueprint" />
            <div className="prop-scan" />
          </>
        )}

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
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          {property.badge}
        </div>

        {hasOffer ? (
          <div
            style={{
              position: 'absolute',
              top: 52,
              left: 16,
              zIndex: 10,
              padding: '5px 11px',
              borderRadius: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: '8px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.55) 0%, rgba(201, 168, 76, 0.25) 100%)',
              border: '1px solid rgba(248, 113, 113, 0.65)',
              color: '#fecaca',
              boxShadow: '0 6px 28px rgba(0,0,0,0.35)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          >
            {pct}% off
          </div>
        ) : null}

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
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          {property.category}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 16,
            zIndex: 10,
            background: paidUnlock ? 'rgba(127, 29, 29, 0.7)' : 'rgba(22, 101, 52, 0.55)',
            border: paidUnlock ? '1px solid rgba(248, 113, 113, 0.65)' : '1px solid rgba(74, 222, 128, 0.55)',
            backdropFilter: 'blur(12px)',
            padding: '4px 10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '8px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: paidUnlock ? '#fecaca' : '#bbf7d0',
            textTransform: 'uppercase',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          {paidUnlock ? 'Paid' : 'Free'}
        </div>

        {property.fromInventory ? (
          <div
            style={{
              position: 'absolute',
              bottom: 66,
              left: 16,
              zIndex: 10,
              maxWidth: 'calc(100% - 32px)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontFamily: "'Inter', sans-serif",
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: 4,
                border: paidUnlock ? '1px solid rgba(248, 113, 113, 0.5)' : '1px solid rgba(74, 222, 128, 0.45)',
                background: paidUnlock ? 'rgba(127, 29, 29, 0.55)' : 'rgba(22, 101, 52, 0.45)',
                color: paidUnlock ? '#fecaca' : '#bbf7d0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              }}
            >
              {paidUnlock
                ? `Paid unlock · AED ${unlockFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : 'Free to view'}
            </span>
          </div>
        ) : null}

        <div
          className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 flex-wrap transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0px)' : 'translateY(8px)',
          }}
        >
          {(property.features || []).map(f => (
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

      <div
        className="property-card-content absolute left-0 right-0 bottom-0 z-20 transition-all duration-500 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0%)' : 'translateY(104%)',
          visibility: isHovered ? 'visible' : 'hidden',
          pointerEvents: isHovered ? 'auto' : 'none',
          background: 'rgba(6, 6, 6, 0.92)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          backdropFilter: 'blur(8px)',
          padding: '1.75rem',
        }}
      >
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
          <PriceOfferDisplay
            label="Asking Price"
            saleDisplay={property.price}
            compareAtNumeric={property.compareAtPrice}
            variant="card"
            align="right"
          />
        </div>

        <a
          href={`#property/${property.id}`}
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
          <span>View Detailed Specs</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const Properties = () => {
  const headingRef = useReveal();
  const { data, loading: cmsLoading } = useCMS();
  const propertiesData = data.properties || {};
  const cmsProperties = (propertiesData.items || []).filter((p) => p.isVisible);
  const [apiProperties, setApiProperties] = useState([]);
  /** pending | cms | api | api-empty — API returned rows but none are published (visible) on site. */
  const [homeSource, setHomeSource] = useState('pending');
  const HOME_FEATURED_MAX = 12;

  useEffect(() => {
    // Only load API assets after CMS data has loaded to avoid conflicts
    if (cmsLoading) {
      return;
    }

    const loadAssetsForHome = async () => {
      try {
        const response = await adminAPI.assets.getAll();

        if (!response?.success || !Array.isArray(response.data) || response.data.length === 0) {
          setHomeSource('cms');
          setApiProperties([]);
          return;
        }

        const filtered = response.data.filter((asset) => asset?.isVisible !== false);

        if (filtered.length === 0) {
          setHomeSource('api-empty');
          setApiProperties([]);
          return;
        }

        const mapped = filtered
          .map((asset) => ({
            id: asset.id,
            title: asset.name || 'Unnamed Property',
            location: asset.location || 'Dubai, UAE',
            area: asset.area != null && asset.area !== '' ? String(asset.area) : 'N/A',
            price:
              asset.price != null && asset.price !== ''
                ? Number(asset.price).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 'Contact',
            compareAtPrice:
              asset.compareAtPrice != null && asset.compareAtPrice !== ''
                ? Number(asset.compareAtPrice)
                : null,
            category: asset.propertyType || asset.type || 'Property',
            badge: asset.isSpecial ? 'SPECIAL' : (asset.listingType || (asset.quantity > 0 ? 'AVAILABLE' : 'OUT OF STOCK')),
            gradient: 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
            accent: '#1a4d1a',
            features: asset.features?.length
              ? asset.features
              : [
                  asset.bedrooms ? `${asset.bedrooms} Beds` : null,
                  asset.bathrooms ? `${asset.bathrooms} Baths` : null,
                  asset.parking ? `${asset.parking} Parking` : null,
                ].filter(Boolean),
            gallery: Array.isArray(asset.imageUrls) && asset.imageUrls.length > 0 ? asset.imageUrls : ['/flaw.png'],
            coverImageUrl: asset.coverImageUrl || null,
            coverImageIndex:
              Number.isInteger(asset.coverImageIndex) && asset.coverImageIndex >= 0
                ? asset.coverImageIndex
                : 0,
            isVisible: asset.isVisible !== false,
            isSpecial: !!asset.isSpecial,
            viewingFeeAed: asset.viewingFeeAed,
            fromInventory: true,
          }));

        mapped.sort((a, b) => {
          if (a.isSpecial !== b.isSpecial) return a.isSpecial ? -1 : 1;
          return 0;
        });

        setHomeSource('api');
        setApiProperties(mapped.slice(0, HOME_FEATURED_MAX));
      } catch (error) {
        console.error('Failed to load home assets from API:', error);
        setHomeSource('cms');
        setApiProperties([]);
      }
    };

    loadAssetsForHome();
  }, [cmsLoading]);

  const mapCmsForOffers = (items) =>
    items.map((p) => ({
      ...p,
      compareAtPrice:
        p.compareAtPrice != null && p.compareAtPrice !== ''
          ? parseFloat(String(p.compareAtPrice).replace(/,/g, '')) || null
          : null,
    }));

  const cmsWithOffers = mapCmsForOffers(cmsProperties);

  const properties =
    homeSource === 'api-empty'
      ? []
      : homeSource === 'api'
        ? apiProperties
        : cmsWithOffers;

  // Setup intersection observer for animations
  useEffect(() => {
    if (properties.length > 0) {
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
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        document.querySelectorAll(SELECTORS).forEach((el) => obs.observe(el));
      }, 100);

      return () => obs.disconnect();
    }
  }, [properties]);

  return (
    <section id="properties" className="py-32 bg-void relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 80% 30%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="px-6 sm:px-10 lg:px-16 relative"  >
        <div ref={headingRef} className="mb-12 lg:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="gold-line-h w-8 lg:w-12" />
            <span className="section-label text-[9px] lg:text-[10px]">{propertiesData.label}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 px-0 sm:px-5" style={{marginBottom:"1.5%"}}>
            <h2
              className="max-w-[800px]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 5vw, 58px)',
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#ffffff'
              }}
            >
              {propertiesData.titleLine1}
              <span className="text-gold-gradient"> {propertiesData.titleLine2}</span>
            </h2>
            <a href="#listings" className="btn-outline self-start lg:self-end py-3 px-6 lg:py-4 lg:px-8">
              <span>View All Listings</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {properties.length === 0 ? (
          <div
            className="rounded-sm border border-white/10 px-8 py-16 text-center max-w-xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-3">Featured inventory</p>
            <p className="text-white/70 font-serif text-xl mb-2">No published inventory on the home page right now.</p>
            <p className="text-white/45 text-sm mb-6">
              In Asset Inventory, turn on <strong className="text-white/70">Show on website</strong> for listings you want public. Special listings can also charge a one-time unlock fee.
            </p>
            <a href="#listings" className="btn-outline inline-flex py-3 px-6">
              <span>View all listings</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property, i) => (
              <PropertyCard key={property.id || i} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
