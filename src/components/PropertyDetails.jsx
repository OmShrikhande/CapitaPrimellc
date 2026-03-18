import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/useCMS';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const PropertyDetails = ({ id }) => {
  const { data } = useCMS();
  const { theme } = useTheme();
  const property = data?.properties?.items?.find(p => p.id === id);

  const [activeImage, setActiveImage] = useState(() => {
    return property?.gallery && property.gallery[0] ? property.gallery[0] : '/flaw.png';
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h2 className="text-3xl font-serif">Property Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondary, color: theme.accent }}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 relative group">
              <img 
                src={activeImage} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-gold text-black text-[10px] font-black tracking-widest uppercase rounded-full">
                  {property.badge}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {property.gallery && property.gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 text-gold text-[11px] font-black tracking-[0.4em] uppercase mb-4">
                <span className="w-8 h-[1px] bg-gold" />
                {property.category} Asset
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                {property.title}
              </h1>
              <p className="text-xl text-white/60 flex items-center gap-3">
                <span className="text-gold">📍</span> {property.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/10">
              <div>
                <p className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-2">Asking Price</p>
                <p className="text-3xl font-serif font-bold text-gold">
                  <span className="text-sm font-sans mr-2">AED</span>
                  {property.price}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-2">Total Area</p>
                <p className="text-3xl font-serif font-bold">
                  {property.area} <span className="text-sm font-sans text-white/40">SQ.FT</span>
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-bold tracking-tight">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">🏗️</div>
                  <div>
                    <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">Zoning</p>
                    <p className="text-sm font-bold">{property.specs?.zoning || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">📜</div>
                  <div>
                    <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">Permit</p>
                    <p className="text-sm font-bold">{property.specs?.permit || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">📐</div>
                  <div>
                    <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">Coverage</p>
                    <p className="text-sm font-bold">{property.specs?.coverage || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">🤝</div>
                  <div>
                    <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">Ownership</p>
                    <p className="text-sm font-bold">{property.specs?.ownership || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-10">
              <button className="flex-1 bg-gold text-black font-black py-6 rounded-2xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs shadow-2xl shadow-gold/20">
                Book Consultation
              </button>
              <button className="flex-1 bg-white/5 text-white font-black py-6 rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase text-xs border border-white/10">
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Features & Narrative */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <h2 className="text-3xl font-serif font-bold">Investment Narrative</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              This exceptional {property.category.toLowerCase()} plot in {property.location} offers a rare opportunity for discerning investors. With a total area of {property.area} sq.ft and prime positioning, it represents the pinnacle of Dubai's real estate potential. The site is fully serviced and ready for immediate development, supported by all necessary NOCs and approvals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-gold">✦</span>
                  <span className="text-sm font-bold tracking-tight text-white/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gold/5 border border-gold/10 p-10 rounded-[3rem] space-y-8">
            <h3 className="text-xl font-bold tracking-tight text-gold">Ready for Next Steps?</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Our consultants are ready to provide detailed feasibility studies and site visits for this asset.
            </p>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-gold/40 text-sm" />
              <input type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-gold/40 text-sm" />
              <button className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gold transition-all tracking-widest uppercase text-[10px]">
                Enquire for Asset
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
