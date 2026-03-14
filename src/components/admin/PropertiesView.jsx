import React, { useState } from 'react';
import Sparkline from './Sparkline';
import PropertyForm from './PropertyForm';

const PropertiesView = ({ properties, addProperty, updateProperty, deleteProperty }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingProperty(properties[index]);
    setIsAdding(true);
  };

  const handleFormSubmit = (propertyData) => {
    if (editingIndex !== null) {
      updateProperty(editingIndex, propertyData);
    } else {
      addProperty({ ...propertyData, id: Date.now().toString() });
    }

    setIsAdding(false);
    setEditingIndex(null);
    setEditingProperty(null);
  };

  const handleFormCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setEditingProperty(null);
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
          onClick={() => { setIsAdding(true); setEditingIndex(null); setEditingProperty(null); }}
          className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95 shrink-0"
        >
          + Add New Land Asset
        </button>
      </div>

      <PropertyForm
        isOpen={isAdding}
        onClose={handleFormCancel}
        editingIndex={editingIndex}
        property={editingProperty}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

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
