import React, { useState } from 'react';

const ContentView = ({ data, updateData }) => {
  const [hero, setHero] = useState(data.hero);
  const [about, setAbout] = useState(data.about);

  const handleSave = () => {
    updateData({ hero, about });
    alert('Content updated successfully!');
  };

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-12 shadow-2xl">
        <h3 className="text-2xl font-serif font-bold mb-8 text-gold tracking-tight">Hero Section Configuration</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Section Label</label>
            <input value={hero.label} onChange={e => setHero({...hero, label: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Title Line 1</label>
            <input value={hero.titleLine1} onChange={e => setHero({...hero, titleLine1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Title Line 2 (Golden Highlight)</label>
            <input value={hero.titleLine2} onChange={e => setHero({...hero, titleLine2: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold text-gold" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Hero Description</label>
            <textarea rows="4" value={hero.description} onChange={e => setHero({...hero, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-medium leading-relaxed" />
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-12 shadow-2xl">
        <h3 className="text-2xl font-serif font-bold mb-8 text-gold tracking-tight">About Section Configuration</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Main Heading</label>
            <input value={about.titleLine1} onChange={e => setAbout({...about, titleLine1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Establishment Year</label>
            <input value={about.estYear} onChange={e => setAbout({...about, estYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-mono font-bold" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Legacy & Mission Statement</label>
            <textarea rows="4" value={about.description1} onChange={e => setAbout({...about, description1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold/30 transition-all font-medium leading-relaxed" />
          </div>
        </div>
      </div>

      <div className="pt-4 px-2">
        <button onClick={handleSave} className="bg-gold text-black font-black py-5 px-12 rounded-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,160,89,0.2)] tracking-[0.2em] uppercase text-xs scale-105 active:scale-95">
          Deploy All Changes
        </button>
      </div>
    </div>
  );
};

export default ContentView;
