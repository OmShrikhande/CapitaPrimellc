import React, { useState } from 'react';

const ServicesView = ({ services, updateData }) => {
  const [items, setItems] = useState(services);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    updateData({ services: items });
    alert('Services updated!');
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="grid grid-cols-1 gap-8">
        {items.map((s, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl group hover:border-gold/20 transition-all">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-xl border border-gold/10 text-gold group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <input 
                value={s.title} 
                onChange={e => handleChange(i, 'title', e.target.value)}
                className="block w-full bg-transparent text-2xl font-serif font-bold text-white outline-none focus:text-gold transition-colors" 
              />
            </div>
            <textarea 
              value={s.desc} 
              onChange={e => handleChange(i, 'desc', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-400 text-sm outline-none focus:border-gold/20 transition-all leading-relaxed" 
              rows="3"
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 px-2">
        <button onClick={handleSave} className="bg-gold text-black font-black py-5 px-12 rounded-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,160,89,0.2)] tracking-[0.2em] uppercase text-xs scale-105 active:scale-95">
          Sync Service Matrix
        </button>
      </div>
    </div>
  );
};

export default ServicesView;
