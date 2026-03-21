import React, { useEffect, useState } from 'react';

const createPopupDelayState = (popupSettings) => {
  const delays = Array.isArray(popupSettings?.delaysInSeconds) ? popupSettings.delaysInSeconds : [0, 60, 120];
  return [
    String(delays[0] ?? 0),
    String(delays[1] ?? 60),
    String(delays[2] ?? 120),
  ];
};

const OffersView = ({ offers, popupSettings, addOffer, updateOffer, deleteOffer, updatePopupSettings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [popupConfig, setPopupConfig] = useState(() => ({
    enabled: popupSettings?.enabled !== false,
    delaysInSeconds: createPopupDelayState(popupSettings),
  }));
  const [formData, setFormData] = useState({
    title: '', description: '', expiry: '', isVisible: false
  });

  useEffect(() => {
    setPopupConfig({
      enabled: popupSettings?.enabled !== false,
      delaysInSeconds: createPopupDelayState(popupSettings),
    });
  }, [popupSettings]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(offers[index]);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      updateOffer(editingIndex, formData);
    } else {
      addOffer({ ...formData, id: Date.now().toString() });
    }
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ title: '', description: '', expiry: '', isVisible: false });
  };

  const toggleVisibility = (index) => {
    const offer = offers[index];
    updateOffer(index, { ...offer, isVisible: !offer.isVisible });
  };

  const handlePopupConfigSave = () => {
    const normalizedDelays = popupConfig.delaysInSeconds.map((value, index) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return [0, 60, 120][index];
      }
      return Math.round(parsed);
    });

    updatePopupSettings({
      enabled: popupConfig.enabled,
      delaysInSeconds: normalizedDelays,
    });
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h4 className="font-serif text-2xl font-bold text-white">Popup Sequence Control</h4>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60 mt-2">
                Manage popup timing directly from admin
              </p>
            </div>
            <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
              <input
                type="checkbox"
                checked={popupConfig.enabled}
                onChange={(e) => setPopupConfig((current) => ({ ...current, enabled: e.target.checked }))}
                className="w-5 h-5 rounded bg-white/5 border-white/10 text-gold focus:ring-gold"
              />
              Enabled
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {popupConfig.delaysInSeconds.map((value, index) => (
              <div key={index}>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">
                  Popup {index + 1} Delay
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={value}
                    onChange={(e) => {
                      const nextDelays = [...popupConfig.delaysInSeconds];
                      nextDelays[index] = e.target.value;
                      setPopupConfig((current) => ({ ...current, delaysInSeconds: nextDelays }));
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 outline-none focus:border-gold/30 transition-all font-bold text-white"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                    Sec
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-white/45">
              Sequence runs at {popupConfig.delaysInSeconds.join('s, ')}s after page load.
            </p>
            <button
              type="button"
              onClick={handlePopupConfigSave}
              className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl"
            >
              Save Popup Timing
            </button>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-2xl font-bold text-white">Offers Visibility</h4>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60 mt-2">
              Offer strip is shown below the navbar on public pages
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Visible Offers</p>
              <p className="mt-3 text-4xl font-serif font-bold text-gold">
                {offers.filter((offer) => offer.isVisible).length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Total Offers</p>
              <p className="mt-3 text-4xl font-serif font-bold text-white">
                {offers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Offers Matrix</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Managing {offers.length} Promotional Campaigns</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingIndex(null); setFormData({ title: '', description: '', expiry: '', isVisible: false }); }}
          className="bg-gold text-black px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95"
        >
          + Create New Offer
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12">
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            <h3 className="text-4xl font-serif font-bold mb-10 tracking-tight">{editingIndex !== null ? 'Modify Offer' : 'Initialize New Offer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Offer Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Enter offer title..." />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all min-h-[120px]" placeholder="Enter offer details..." />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Expiry Date</label>
                  <input type="date" required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" />
                </div>
                <div className="flex items-center gap-4 pt-8">
                  <input type="checkbox" id="isVisible" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="w-6 h-6 rounded bg-white/5 border-white/10 text-gold focus:ring-gold" />
                  <label htmlFor="isVisible" className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-60">Visible on Site</label>
                </div>
              </div>
              <div className="flex gap-6 mt-6">
                <button type="submit" className="flex-1 bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-2xl tracking-[0.2em] uppercase text-xs">
                  {editingIndex !== null ? 'Sync Changes' : 'Launch Offer'}
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white/5 text-white font-black py-5 rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase text-xs border border-white/10">
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {offers.map((offer, i) => (
          <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex justify-between items-center hover:border-gold/40 transition-all group relative overflow-hidden">
            <div className="flex items-center gap-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border border-white/10 ${offer.isVisible ? 'bg-gold/10 text-gold' : 'bg-white/5 text-gray-500'}`}>
                {offer.isVisible ? '📢' : '🔇'}
              </div>
              <div>
                <h4 className="font-bold text-xl text-white/90 mb-1">{offer.title}</h4>
                <p className="text-gray-500 text-sm mb-2 max-w-xl">{offer.description}</p>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-600">Expires: {offer.expiry}</span>
                  <span className={offer.isVisible ? 'text-green-500' : 'text-yellow-500'}>
                    {offer.isVisible ? '● Active' : '● Hidden'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleVisibility(i)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all border ${offer.isVisible ? 'border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10' : 'border-green-500/20 text-green-500 hover:bg-green-500/10'}`}
              >
                {offer.isVisible ? 'Hide' : 'Show'}
              </button>
              <button 
                onClick={() => handleEdit(i)} 
                className="p-3 bg-white/5 hover:bg-gold hover:text-black rounded-xl transition-all"
              >
                ✏️
              </button>
              <button 
                onClick={() => deleteOffer(i)} 
                className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-xl transition-all"
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

export default OffersView;
