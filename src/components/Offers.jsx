import React from 'react';import { useCMS } from '../context/useCMS';


const Offers = () => {
  const { data } = useCMS();
  const offersData = data.offers || {};
  const activeOffers = (offersData.items || []).filter(o => o.isVisible);

  if (activeOffers.length === 0) return null;

  return (
    <div className="bg-gold/10 border-y border-gold/20 py-4 overflow-hidden relative w-full">
      <div className="flex animate-marquee whitespace-nowrap items-center" style={{justifyContent:'space-around'}}>
        <marquee behavior="scroll" direction="left" scrollamount="3">
        {activeOffers.map((offer, i) => (
          <div key={i} className="flex items-center mx-10">
            <span className="text-gold text-[10px] font-black tracking-[0.4em] uppercase mr-4">{offersData.label}:</span>
            <span className="text-white text-sm font-bold tracking-tight mr-4">{offer.title}</span>
            <span className="text-white/40 text-xs mr-4">—</span>
            <span className="text-white/60 text-xs italic">{offer.description}</span>
            <span className="ml-10 text-gold opacity-20">✦</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {activeOffers.map((offer, i) => (
          <div key={`dup-${i}`} className="flex items-center mx-10">
            <span className="text-gold text-[10px] font-black tracking-[0.4em] uppercase mr-4">{offersData.label}:</span>
            <span className="text-white text-sm font-bold tracking-tight mr-4">{offer.title}</span>
            <span className="text-white/40 text-xs mr-4">—</span>
            <span className="text-white/60 text-xs italic">{offer.description}</span>
            <span className="ml-10 text-gold opacity-20">✦</span>
          </div>
        ))}
        </marquee>
      </div>
    </div>
  );
};

export default Offers;
