import React, { useState } from 'react';

const CommandPalette = ({ isOpen, onClose, data, setActiveTab }) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const results = [
    ...data.properties.map(p => ({ type: 'Asset', label: p.title, action: () => { setActiveTab('properties'); onClose(); } })),
    { type: 'View', label: 'Go to Nexus Overview', action: () => { setActiveTab('dashboard'); onClose(); } },
    { type: 'View', label: 'Go to Site Architect', action: () => { setActiveTab('content'); onClose(); } },
    { type: 'Command', label: 'Toggle Maintenance Mode', action: () => { alert('Maintenance Mode Toggled'); onClose(); } },
  ].filter(r => r.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <span className="text-xl">🔍</span>
          <input 
            autoFocus 
            placeholder="Search assets, views or commands..." 
            className="bg-transparent border-none outline-none text-white text-lg w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {results.map((res, i) => (
            <button 
              key={i} 
              onClick={res.action}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                  {res.type}
                </span>
                <span className="text-sm font-bold text-gray-300 group-hover:text-white">{res.label}</span>
              </div>
              <span className="text-gray-700 text-xs">↵</span>
            </button>
          ))}
        </div>
        <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
          <p className="text-[9px] text-gray-600 font-bold tracking-widest uppercase">Esc to Close | ↑↓ to Navigate</p>
          <div className="flex gap-2">
            <span className="text-[9px] text-gold font-bold bg-gold/5 px-2 py-1 rounded">PRO ACCESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
