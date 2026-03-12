import React, { useState } from 'react';

const TestimonialsView = ({ testimonials, updateData }) => {
  const [items, setItems] = useState(testimonials);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    updateData({ testimonials: items });
    alert('Testimonials updated!');
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="grid grid-cols-1 gap-8">
        {items.map((t, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl group hover:border-gold/20 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-lg border border-gold/10 text-gold">
                💬
              </div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Client Testimonial #{i + 1}</h4>
            </div>
            
            <textarea 
              value={t.quote} 
              onChange={e => handleChange(i, 'quote', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-lg text-gray-300 outline-none focus:border-gold/20 transition-all italic leading-relaxed mb-8" 
              rows="4"
              placeholder="Enter client quote..."
            />
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 px-1">Identity</label>
                <input 
                  value={t.name} 
                  onChange={e => handleChange(i, 'name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none focus:border-gold/30 transition-all" 
                  placeholder="Client Name"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 px-1">Professional Title</label>
                <input 
                  value={t.title} 
                  onChange={e => handleChange(i, 'title', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold outline-none focus:border-gold/30 transition-all" 
                  placeholder="Client Title"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 px-2">
        <button onClick={handleSave} className="bg-gold text-black font-black py-5 px-12 rounded-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,160,89,0.2)] tracking-[0.2em] uppercase text-xs scale-105 active:scale-95">
          Update Echo Hub
        </button>
      </div>
    </div>
  );
};

export default TestimonialsView;
