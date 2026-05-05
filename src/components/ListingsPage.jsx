import { useRef, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Offers from './Offers';
import Footer from './Footer';
import { adminAPI } from '../context/api';
import ImagePreview from './admin/ImagePreview';
import { PriceOfferDisplay, getOfferMeta } from './PriceOfferDisplay';

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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
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
    imageUrls: ['/flaw.png'],
  }
];

const CATEGORY_COLORS = {
  Residential: '#4ade80',
  Commercial: '#60a5fa',
  'Mixed Use': '#c084fc',
};

const getCoverImageFromProperty = (property) => {
  if (property?.coverImageUrl) return property.coverImageUrl;
  const imageUrls = Array.isArray(property?.imageUrls) ? property.imageUrls : [];
  if (imageUrls.length === 0) return null;
  const rawIndex = Number(property?.coverImageIndex);
  const safeIndex =
    Number.isInteger(rawIndex) && rawIndex >= 0
      ? Math.min(rawIndex, imageUrls.length - 1)
      : 0;
  return imageUrls[safeIndex] || imageUrls[0];
};

const PropertyModal = ({ property, isOpen, onClose }) => {
  if (!isOpen || !property) return null;
  const coverImage = getCoverImageFromProperty(property);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.1)',
          animation: 'slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            color: '#C9A84C',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div
              className="h-64 lg:h-full relative"
              style={{ background: property.gradient }}
            >
              {/* Show image if available */}
              {coverImage ? (
                <div className="w-full h-full overflow-hidden relative">
                  <ImagePreview
                    imagePath={coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  {/* Pattern background if no image */}
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

                  {/* Building Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {property.category === 'Residential' ? (
                      <svg width="120" height="120" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
                        <rect x="15" y="35" width="40" height="28" />
                        <polyline points="5,35 35,10 65,35" />
                        <rect x="28" y="45" width="14" height="18" />
                        <line x1="15" y1="35" x2="55" y2="35" />
                        <rect x="18" y="40" width="8" height="8" />
                        <rect x="44" y="40" width="8" height="8" />
                      </svg>
                    ) : property.category === 'Commercial' ? (
                      <svg width="120" height="120" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
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
                      <svg width="120" height="120" viewBox="0 0 70 70" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1">
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
                </>
              )}

              {/* Badges */}
              <div className="absolute top-6 left-6 flex gap-3">
                <div
                  style={{
                    background: 'rgba(6,6,6,0.8)',
                    border: '1px solid rgba(201,168,76,0.4)',
                    backdropFilter: 'blur(12px)',
                    padding: '6px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    color: '#C9A84C',
                  }}
                >
                  {property.badge}
                </div>
                <div
                  style={{
                    background: `${CATEGORY_COLORS[property.category]}18`,
                    border: `1px solid ${CATEGORY_COLORS[property.category]}55`,
                    backdropFilter: 'blur(12px)',
                    padding: '6px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: CATEGORY_COLORS[property.category],
                  }}
                >
                  {property.category}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-8">
              {/* Title */}
              <div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  {property.title}
                </h2>

                {/* Location - Prominently displayed */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    marginBottom: 16,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Location
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '18px',
                        fontWeight: 500,
                        color: '#ffffff',
                      }}
                    >
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Plot Size
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {property.area} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>sq.ft</span>
                  </p>
                </div>
                <div className="text-right">
                  <PriceOfferDisplay
                    label="Asking Price"
                    saleDisplay={property.price}
                    compareAtNumeric={property.compareAtPrice}
                    variant="modal"
                    align="right"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  Key Features
                </p>
                <div className="flex flex-wrap gap-3">
                  {(property.features || []).map(feature => (
                    <span
                      key={feature}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.7)',
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {property.isSpecial && property.viewingFeeAed != null && Number(property.viewingFeeAed) > 0 ? (
                <p
                  className="text-sm text-white/50 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Full listing page may require a one-time access fee (AED{' '}
                  {Number(property.viewingFeeAed).toLocaleString(undefined, { maximumFractionDigits: 2 })}) processed
                  securely on our server via Stripe.
                </p>
              ) : null}

              {/* CTA Button */}
              <div className="pt-4 space-y-3">
                <a
                  href="#contact"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: '16px 32px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Enquire Now</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                {property.id ? (
                  <a
                    href={`#property/${property.id}`}
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '14px 24px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      width: '100%',
                    }}
                  >
                    <span>Open full listing page</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyCard = ({ property, index, onClick }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { hasOffer, pct } = getOfferMeta(property.price, property.compareAtPrice);
  const unlockFee =
    property.viewingFeeAed != null && property.viewingFeeAed !== ''
      ? Number(property.viewingFeeAed)
      : 0;
  const paidUnlock = !!property.isSpecial && Number.isFinite(unlockFee) && unlockFee > 0;
  const fromApi = property.id != null && Object.prototype.hasOwnProperty.call(property, 'isSpecial');

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

  // Check if we have images from the asset
  const coverImage = getCoverImageFromProperty(property);
  const hasImages = !!coverImage;

  return (
    <div
      ref={cardRef}
      className="property-card animate-on-scroll cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        setIsHovered(false);
        handleMouseLeave(e);
      }}
      onClick={onClick}
      style={{ transitionDelay: `${(index % 3) * 0.12}s` }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: property.gradient,
          minHeight: 470,
        }}
      >
        {/* Show image if available, otherwise show pattern background */}
        {hasImages ? (
          <div className="w-full h-full overflow-hidden absolute inset-0">
            <ImagePreview
              imagePath={coverImage}
              alt={property.title}
              className="w-full h-full object-cover"
              fallbackEmoji="🏘️"
            />
            {/* Overlay patterns */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 80% at 20% 20%, ${property.accent}40 0%, transparent 65%)`,
                zIndex: 2,
              }}
            />
          </div>
        ) : (
          <>
            {/* Original pattern styles when no image */}
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
          </>
        )}

        <div
          className="absolute inset-0 z-10 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
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
              background: `${CATEGORY_COLORS[property.category] || CATEGORY_COLORS.Residential}18`,
              border: `1px solid ${CATEGORY_COLORS[property.category] || CATEGORY_COLORS.Residential}55`,
              backdropFilter: 'blur(12px)',
              padding: '4px 12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: CATEGORY_COLORS[property.category] || '#94a3b8',
            }}
          >
            {property.category}
          </div>

          {fromApi ? (
            <div
              style={{
                position: 'absolute',
                bottom: 52,
                left: 16,
                zIndex: 10,
                maxWidth: 'calc(100% - 32px)',
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
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0) 100%)',
            opacity: isHovered ? 0.85 : 0.4,
          }}
        />

        <div
          className="absolute left-0 right-0 bottom-0 z-20 transition-all duration-500 ease-out"
          style={{
            transform: isHovered ? 'translateY(0%)' : 'translateY(102%)',
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
          }}
        >
          <div className="bg-black/92 border-t border-gold/20 backdrop-blur-md p-6 space-y-5">
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '38px',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {property.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.55)',
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

            <div className="gold-line-h opacity-35" />

            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>
                  Plot Size
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
                  {property.area} <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>sq.ft</span>
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
              href="#contact"
              className="mt-2 pointer-events-auto"
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
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await adminAPI.assets.getAll();

        if (response.success && response.data && response.data.length > 0) {
          // Transform assets to match the expected property format for the UI
          const transformedAssets = response.data.map(asset => ({
            id: asset.id,
            title: asset.name || 'Unnamed Property',
            location: asset.location || 'Dubai, UAE',
            area: asset.area != null && asset.area !== '' ? String(asset.area) : 'N/A',
            price:
              asset.price != null && asset.price !== ''
                ? Number(asset.price).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 'Contact for Price',
            category: asset.propertyType || asset.type || 'Property',
            badge: asset.isSpecial ? 'SPECIAL' : (asset.listingType || (asset.quantity > 0 ? 'AVAILABLE' : 'OUT OF STOCK')),
            isSpecial: !!asset.isSpecial,
            viewingFeeAed: asset.viewingFeeAed,
            compareAtPrice:
              asset.compareAtPrice != null && asset.compareAtPrice !== ''
                ? Number(asset.compareAtPrice)
                : null,
            gradient: 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
            accent: '#1a4d1a',
            features: asset.features?.length
              ? asset.features
              : [
              asset.bedrooms ? `${asset.bedrooms} Bedrooms` : null,
              asset.bathrooms ? `${asset.bathrooms} Bathrooms` : null,
              asset.area ? `${asset.area} sq ft` : null,
              asset.parking ? `${asset.parking} Parking` : null,
              asset.neighborhood || null,
              asset.completionStatus || null
            ].filter(Boolean).slice(0, 3), // Limit to 3 features max
            description: asset.description,
            imageUrls: Array.isArray(asset.imageUrls) && asset.imageUrls.length > 0 ? asset.imageUrls : ['/flaw.png'],
            coverImageIndex:
              Number.isInteger(asset.coverImageIndex) && asset.coverImageIndex >= 0
                ? asset.coverImageIndex
                : 0,
            isVisible: asset.isVisible !== undefined ? asset.isVisible : true,
            // Additional data for detailed view
            coordinates: asset.coordinates,
            amenities: asset.amenities || [],
            agentName: asset.agentName,
            agentPhone: asset.agentPhone,
            agentEmail: asset.agentEmail,
            developer: asset.developer,
            yearBuilt: asset.yearBuilt,
            paymentPlan: asset.paymentPlan
          }));
          const visibleAssets = transformedAssets.filter((a) => a.isVisible !== false);
          if (visibleAssets.length > 0) {
            visibleAssets.sort((a, b) => {
              if (a.isSpecial !== b.isSpecial) return a.isSpecial ? -1 : 1;
              return 0;
            });
            setAssets(visibleAssets);
            setError('');
          } else if (transformedAssets.length > 0) {
            setAssets([]);
            setError('All listings are hidden. Enable “Show on website” in Asset Inventory.');
          } else {
            setAssets(ALL_PROPERTIES);
            setError('');
          }
        } else if (response.success && (!response.data || response.data.length === 0)) {
          setAssets(ALL_PROPERTIES);
          setError('');
        } else {
          setAssets(ALL_PROPERTIES);
          setError('');
        }
      } catch (err) {
        console.error('Error loading assets:', err);
        setAssets(ALL_PROPERTIES);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Setup observer for animations after assets are loaded
    if (assets.length > 0) {
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
  }, [assets]);

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="bg-void min-h-screen" >
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <Offers />
      </div>
      
      <main className="pb-20" style={{ zIndex: 0, padding: '48px 60px 80px' }}>
        <div className="px-16 lg:px-24">
          <nav
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-8 text-white/45"
            aria-label="Breadcrumb"
          >
            <a
              href="#"
              className="text-gold/90 hover:text-gold transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
              }}
            >
              Home
            </a>
            <span className="mx-2 text-white/35" aria-hidden="true">
              /
            </span>
            <span className="text-white/55">Listings</span>
          </nav>
          <div className="mb-20 animate-on-scroll">
            <div className="flex items-center gap-4 mb-6" >
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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
                <div className="text-gold text-lg">Loading assets...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4 max-w-md">
                <div className="text-yellow-400 text-2xl">⚠️</div>
                <p className="text-white/60">{error}</p>
              </div>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="text-4xl">🏘️</div>
                <p className="text-white/60">No properties available at the moment</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {assets.map((asset, i) => (
                <PropertyCard
                  key={asset.id || `listing-${i}`}
                  property={asset}
                  index={i}
                  onClick={() => openModal(asset)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Footer />
    </div>
  );
};

export default ListingsPage;
