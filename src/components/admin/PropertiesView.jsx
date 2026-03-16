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
          className="bg-gold text-yellow-500 px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95 shrink-0"
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
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:border-gold/40 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold/5 blur-[80px] group-hover:bg-gold/10 transition-all rounded-full" />
            
            <div className="flex gap-6 lg:gap-8 items-center relative flex-1">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-black/40 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 border border-white/10 shadow-inner overflow-hidden flex-shrink-0">
                {p.gallery && p.gallery.length > 0 ? (
                  <img src={p.gallery[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  p.category === 'Commercial' ? '🏢' : '🏡'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-bold text-xl lg:text-2xl tracking-tight text-white/90 truncate">{p.title}</h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.isVisible ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {p.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] lg:text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 group-hover:text-gold transition-colors whitespace-nowrap">📍 {p.location}</span>
                  <span className="flex items-center gap-2 text-white/70 whitespace-nowrap">💰 AED {p.price}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap">🖼️ {p.gallery ? p.gallery.length : 0} Images</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-4 mt-8 lg:mt-0 relative shrink-0 w-full lg:w-auto justify-end">
              <button 
                onClick={() => toggleVisibility(i)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-4 py-3 lg:px-6 lg:py-4 bg-white/5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border ${p.isVisible ? 'border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10' : 'border-green-500/20 text-green-500 hover:bg-green-500/10'}`}
              >
                {p.isVisible ? 'Hide' : 'Show'}
              </button>
              <button 
                onClick={() => handleEdit(i)} 
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-4 py-3 lg:px-6 lg:py-4 bg-white/5 hover:bg-gold hover:text-black rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-white/10"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteProperty(i)} 
                className="p-3 lg:p-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-2xl transition-all border border-red-500/10"
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
