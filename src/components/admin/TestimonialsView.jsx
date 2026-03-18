import React, { useState } from 'react';

const TestimonialsView = ({ testimonials = [], addTestimonial, updateTestimonial, deleteTestimonial }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '', title: '', quote: ''
  });

  // Ensure testimonials is always an array
  const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(testimonialsArray[index]);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      updateTestimonial(editingIndex, formData);
    } else {
      addTestimonial(formData);
    }
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ name: '', title: '', quote: '' });
  };

  return (
    <div className="space-y-12 w-full">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Echo Streams</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Client Sentiment Management</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingIndex(null); setFormData({ name: '', title: '', quote: '' }); }}
          className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95"
        >
          + Add New Echo
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12">
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            <h3 className="text-4xl font-serif font-bold mb-10 tracking-tight">{editingIndex !== null ? 'Modify Echo' : 'Initialize New Echo'}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Subject Identity</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Client Name" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Operational Role</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Client Title" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Raw Content</label>
                <textarea required value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-lg text-gray-300 outline-none focus:border-gold/20 transition-all italic leading-relaxed" rows="5" placeholder="Enter client quote..." />
              </div>
              <div className="flex gap-6 mt-6">
                <button type="submit" className="flex-1 bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-2xl tracking-[0.2em] uppercase text-xs">
                  {editingIndex !== null ? 'Sync Changes' : 'Launch Echo'}
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white/5 text-white font-black py-5 rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase text-xs border border-white/10">
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
        {testimonialsArray.map((t, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl group hover:border-gold/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-8xl font-serif">"</span>
            </div>
            
            <div className="flex justify-between items-start mb-10 relative">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-2xl border border-gold/10 text-gold shadow-lg shadow-gold/5">
                  💬
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gold uppercase tracking-[0.4em]">Signal Node {i + 1}</h4>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Verified Endorsement</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(i)} className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl transition-all border border-white/10">
                  ✏️
                </button>
                <button onClick={() => deleteTestimonial(i)} className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-xl transition-all border border-red-500/10">
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="relative mb-10">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 px-1">Content</label>
              <p className="text-lg text-gray-300 italic leading-relaxed min-h-[120px]">
                "{t.quote}"
              </p>
            </div>
            
            <div className="relative">
              <p className="text-sm font-bold text-white uppercase tracking-widest">{t.name}</p>
              <p className="text-[10px] text-gold/60 uppercase tracking-[0.2em] mt-1">{t.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsView;
