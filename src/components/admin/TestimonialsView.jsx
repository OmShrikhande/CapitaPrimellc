import React, { useState } from 'react';

const TestimonialsView = ({ testimonials, updateData }) => {
  const [items, setItems] = useState(testimonials);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    updateData({ testimonials: items });
    alert('Echo hub successfully calibrated.');
  };

  return (
    <div className="space-y-12 w-full">
      <div className="px-2">
        <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Echo Streams</h3>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Client Sentiment Management</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
        {items.map((t, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl group hover:border-gold/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-8xl font-serif">"</span>
            </div>
            
            <div className="flex items-center gap-4 mb-10 relative">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-2xl border border-gold/10 text-gold shadow-lg shadow-gold/5">
                💬
              </div>
              <div>
                <h4 className="text-[11px] font-black text-gold uppercase tracking-[0.4em]">Signal Node {i + 1}</h4>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Verified Endorsement</p>
              </div>
            </div>
            
            <div className="relative mb-10">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 px-1">Raw Content</label>
              <textarea 
                value={t.quote} 
                onChange={e => handleChange(i, 'quote', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-lg text-gray-300 outline-none focus:border-gold/20 transition-all italic leading-relaxed" 
                rows="5"
                placeholder="Enter client quote..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-8 relative">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 px-1">Subject Identity</label>
                <input 
                  value={t.name} 
                  onChange={e => handleChange(i, 'name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white outline-none focus:border-gold/30 transition-all" 
                  placeholder="Client Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 px-1">Operational Role</label>
                <input 
                  value={t.title} 
                  onChange={e => handleChange(i, 'title', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white outline-none focus:border-gold/30 transition-all" 
                  placeholder="Client Title"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-8 px-2 flex justify-center">
        <button 
          onClick={handleSave} 
          className="group relative bg-gold text-black font-black py-6 px-20 rounded-2xl overflow-hidden transition-all shadow-2xl hover:bg-white scale-110 active:scale-95"
        >
          <span className="relative z-10 tracking-[0.4em] uppercase text-[11px]">Calibrate Echo Hub</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialsView;
