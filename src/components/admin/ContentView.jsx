import React, { useState } from 'react';

const ContentView = ({ data, updateData }) => {
  const [hero, setHero] = useState(data.hero);
  const [about, setAbout] = useState(data.about);

  const handleSave = () => {
    updateData({ hero, about });
    alert('Global assets redeployed successfully.');
  };

  return (
    <div className="space-y-12 w-full">
      <div className="px-2">
        <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Site Architect</h3>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Global Content Deployment Node</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔭</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6">Hero Nexus</h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Section Label</label>
              <input value={hero.label} onChange={e => setHero({...hero, label: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Title Line 1</label>
                <input value={hero.titleLine1} onChange={e => setHero({...hero, titleLine1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Title Line 2 (Shimmer)</label>
                <input value={hero.titleLine2} onChange={e => setHero({...hero, titleLine2: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold text-gold" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Hero Narrative</label>
              <textarea rows="4" value={hero.description} onChange={e => setHero({...hero, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-medium leading-relaxed" />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🏛️</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6">Legacy Engine</h3>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Main Title</label>
                <input value={about.titleLine1} onChange={e => setAbout({...about, titleLine1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Establishment</label>
                <input value={about.estYear} onChange={e => setAbout({...about, estYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-mono font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Mission Narrative</label>
              <textarea rows="4" value={about.description1} onChange={e => setAbout({...about, description1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-medium leading-relaxed" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Operational Strategy</label>
              <textarea rows="3" value={about.description2} onChange={e => setAbout({...about, description2: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-medium leading-relaxed" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 px-2 flex justify-center">
        <button 
          onClick={handleSave} 
          className="group relative bg-gold text-black font-black py-6 px-20 rounded-2xl overflow-hidden transition-all shadow-2xl hover:bg-white scale-110 active:scale-95"
        >
          <span className="relative z-10 tracking-[0.4em] uppercase text-[11px]">Sync Global Content</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default ContentView;
