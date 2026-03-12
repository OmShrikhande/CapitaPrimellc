import React, { useState } from 'react';
import Sparkline from './Sparkline';

const PropertiesView = ({ properties, addProperty, updateProperty, deleteProperty }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '', location: '', area: '', price: '', category: 'Residential', badge: 'NEW', features: '', isVisible: true, gallery: '', specs: { zoning: '', permit: '', coverage: '', ownership: '' }
  });

  const handleEdit = (index) => {
    setEditingIndex(index);
    const p = properties[index];
    setFormData({ 
      ...p, 
      features: p.features.join(', '), 
      gallery: (p.gallery || []).join(', '),
      specs: p.specs || { zoning: '', permit: '', coverage: '', ownership: '' }
    });
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      features: formData.features.split(',').map(s => s.trim()),
      gallery: formData.gallery.split(',').map(s => s.trim()).filter(s => s !== ''),
      gradient: formData.category === 'Commercial' ? 'linear-gradient(135deg, #1a0a00 0%, #2a1200 40%, #140800 100%)' : 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
      accent: formData.category === 'Commercial' ? '#4a2000' : '#1a4d1a'
    };

    if (editingIndex !== null) {
      updateProperty(editingIndex, propertyData);
    } else {
      addProperty({ ...propertyData, id: Date.now().toString() });
    }
    
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ title: '', location: '', area: '', price: '', category: 'Residential', badge: 'NEW', features: '', isVisible: true, gallery: '', specs: { zoning: '', permit: '', coverage: '', ownership: '' } });
  };

  const toggleVisibility = (index) => {
    const p = properties[index];
    updateProperty(index, { ...p, isVisible: !p.isVisible });
  };

  return (
    <div className="space-y-10 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 px-2">
        <div>
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Asset Inventory</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Managing {properties.length} Active Nodes</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingIndex(null); setFormData({ title: '', location: '', area: '', price: '', category: 'Residential', badge: 'NEW', features: '' }); }}
          className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95 shrink-0"
        >
          + Add New Land Asset
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12">
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            <h3 className="text-4xl font-serif font-bold mb-10 tracking-tight">{editingIndex !== null ? 'Modify Asset' : 'Register New Asset'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10">
              <div className="col-span-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Asset Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Enter property name..." />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Location Cluster</label>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="e.g. Dubai Hills" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Asset Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all appearance-none cursor-pointer">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed Use">Mixed Use</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Valuation (AED)</label>
                <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all font-mono" placeholder="2,500,000" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Spatial Area (SQ.FT)</label>
                <input required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all font-mono" placeholder="5,400" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Gallery (Comma Delimited URLs)</label>
                <input value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="/path/to/image1.jpg, /path/to/image2.jpg" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Zoning</label>
                <input value={formData.specs.zoning} onChange={e => setFormData({...formData, specs: {...formData.specs, zoning: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Residential/Commercial" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Permit</label>
                <input value={formData.specs.permit} onChange={e => setFormData({...formData, specs: {...formData.specs, permit: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="G+2" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Coverage</label>
                <input value={formData.specs.coverage} onChange={e => setFormData({...formData, specs: {...formData.specs, coverage: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="65%" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Ownership</label>
                <input value={formData.specs.ownership} onChange={e => setFormData({...formData, specs: {...formData.specs, ownership: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Freehold" />
              </div>
              <div className="col-span-2 flex items-center gap-4">
                <input type="checkbox" id="isVisible" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="w-6 h-6 rounded bg-white/5 border-white/10 text-gold focus:ring-gold" />
                <label htmlFor="isVisible" className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-60">Visible on Site</label>
              </div>
              <div className="col-span-2 flex gap-6 mt-6">
                <button type="submit" className="flex-1 bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-2xl tracking-[0.2em] uppercase text-xs">
                  {editingIndex !== null ? 'Sync Changes' : 'Initialize Asset'}
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white/5 text-white font-black py-5 rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase text-xs border border-white/10">
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-10">
        {properties.map((p, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col xl:flex-row justify-between items-start xl:items-center hover:border-gold/40 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold/5 blur-[80px] group-hover:bg-gold/10 transition-all rounded-full" />
            
            <div className="flex gap-8 items-center relative">
              <div className="w-24 h-24 bg-black/40 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 border border-white/10 shadow-inner overflow-hidden">
                {p.gallery && p.gallery.length > 0 ? (
                  <img src={p.gallery[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  p.category === 'Commercial' ? '🏢' : '🏡'
                )}
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-bold text-2xl tracking-tight text-white/90">{p.title}</h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.isVisible ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {p.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 group-hover:text-gold transition-colors">📍 {p.location}</span>
                  <span className="flex items-center gap-2 text-white/70">💰 AED {p.price}</span>
                  <span className="flex items-center gap-2">🖼️ {p.gallery ? p.gallery.length : 0} Images</span>
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="hidden 2xl:flex items-center gap-10 ml-auto mr-16 py-4 px-10 bg-black/40 rounded-[2rem] border border-white/10 shadow-inner">
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase mb-2 opacity-50">Views</p>
                <p className="text-sm font-mono font-black tracking-tighter">1.{((i * 7) % 9)}K</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase mb-2 opacity-50">Leads</p>
                <p className="text-sm font-mono font-black text-gold tracking-tighter">{((i * 13) % 40) + 10}</p>
              </div>
              <div className="w-20 h-10 ml-4 scale-125">
                <Sparkline color="gold" />
              </div>
            </div>

            <div className="flex gap-4 mt-8 md:mt-0 relative shrink-0">
              <button 
                onClick={() => toggleVisibility(i)}
                className={`flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border ${p.isVisible ? 'border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10' : 'border-green-500/20 text-green-500 hover:bg-green-500/10'}`}
              >
                {p.isVisible ? 'Hide' : 'Show'}
              </button>
              <button 
                onClick={() => handleEdit(i)} 
                className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-gold hover:text-black rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-white/10"
              >
                <span>Edit</span>
              </button>
              <button 
                onClick={() => deleteProperty(i)} 
                className="p-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-2xl transition-all border border-red-500/10"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesView;
