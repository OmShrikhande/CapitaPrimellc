import React, { useState } from 'react';

const ServicesView = ({ services, updateData }) => {
  const [items, setItems] = useState(services);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    updateData({ services: items });
    alert('Matrix node synchronized.');
  };

  return (
    <div className="space-y-12 w-full">
      <div className="px-2">
        <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Matrix Node</h3>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Service Protocol Management</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
        {items.map((s, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl group hover:border-gold/30 transition-all relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-all rounded-full" />
            <div className="flex items-center gap-6 mb-8 relative">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl border border-gold/10 text-gold group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Service Title</label>
                <input 
                  value={s.title} 
                  onChange={e => handleChange(i, 'title', e.target.value)}
                  className="block w-full bg-transparent text-xl font-bold text-white outline-none focus:text-gold transition-colors" 
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Service Description</label>
              <textarea 
                value={s.desc} 
                onChange={e => handleChange(i, 'desc', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-400 text-sm outline-none focus:border-gold/20 transition-all leading-relaxed" 
                rows="4"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-8 px-2 flex justify-center">
        <button 
          onClick={handleSave} 
          className="group relative bg-gold text-black font-black py-6 px-20 rounded-2xl overflow-hidden transition-all shadow-2xl hover:bg-white scale-110 active:scale-95"
        >
          <span className="relative z-10 tracking-[0.4em] uppercase text-[11px]">Deploy Matrix Update</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default ServicesView;
