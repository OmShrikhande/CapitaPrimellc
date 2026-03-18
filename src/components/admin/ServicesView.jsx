import React, { useState } from 'react';

const ServicesView = ({ services = [], addService, updateService, deleteService }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '', desc: ''
  });

  // Ensure services is always an array
  const servicesArray = Array.isArray(services) ? services : [];

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(servicesArray[index]);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      updateService(editingIndex, formData);
    } else {
      addService(formData);
    }
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ title: '', desc: '' });
  };

  return (
    <div className="space-y-12 w-full">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Matrix Node</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Service Protocol Management</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingIndex(null); setFormData({ title: '', desc: '' }); }}
          className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95"
        >
          + Add New Service
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12">
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            <h3 className="text-4xl font-serif font-bold mb-10 tracking-tight">{editingIndex !== null ? 'Modify Service' : 'Initialize New Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Service Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Enter service title..." />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Description</label>
                <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all min-h-[120px]" placeholder="Enter service details..." />
              </div>
              <div className="flex gap-6 mt-6">
                <button type="submit" className="flex-1 bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-2xl tracking-[0.2em] uppercase text-xs">
                  {editingIndex !== null ? 'Sync Changes' : 'Deploy Service'}
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
        {servicesArray.map((s, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl group hover:border-gold/30 transition-all relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/5 blur-3xl group-hover:bg-gold/10 transition-all rounded-full" />
            
            <div className="flex justify-between items-start mb-8 relative">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl border border-gold/10 text-gold group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Service Node {i + 1}</label>
                  <h4 className="text-xl font-bold text-white">{s.title}</h4>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(i)} className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl transition-all border border-white/10">
                  ✏️
                </button>
                <button onClick={() => deleteService(i)} className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-xl transition-all border border-red-500/10">
                  🗑️
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Service Description</label>
              <p className="text-gray-400 text-sm leading-relaxed min-h-[80px]">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesView;
