import React from 'react';

const ThemeView = ({ theme, updateTheme }) => {
  const handleChange = (field, value) => {
    updateTheme({ [field]: value });
  };

  return (
    <div className="space-y-12">
      <div className="px-2">
        <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Theme Pulsar</h3>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Global Style Node Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 space-y-8">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-6">Color Matrix</h4>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">Primary Color</p>
                <p className="text-[9px] text-gray-700 font-bold uppercase">Main accent and CTA color</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-white/50">{theme.primary}</span>
                <input 
                  type="color" 
                  value={theme.primary} 
                  onChange={(e) => handleChange('primary', e.target.value)}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 cursor-pointer transition-transform hover:scale-110"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">Secondary Color</p>
                <p className="text-[9px] text-gray-700 font-bold uppercase">Background and depth color</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-white/50">{theme.secondary}</span>
                <input 
                  type="color" 
                  value={theme.secondary} 
                  onChange={(e) => handleChange('secondary', e.target.value)}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 cursor-pointer transition-transform hover:scale-110"
                />
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">Accent Color</p>
                <p className="text-[9px] text-gray-700 font-bold uppercase">Text and highlights</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-white/50">{theme.accent}</span>
                <input 
                  type="color" 
                  value={theme.accent} 
                  onChange={(e) => handleChange('accent', e.target.value)}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 cursor-pointer transition-transform hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 space-y-8">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-6">Mode Control</h4>
          
          <div className="space-y-10">
            <div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">Interface Mode</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleChange('mode', 'dark')}
                  className={`flex-1 py-10 rounded-3xl border transition-all text-sm font-black tracking-[0.2em] uppercase ${theme.mode === 'dark' ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  Dark Node
                </button>
                <button 
                  onClick={() => handleChange('mode', 'light')}
                  className={`flex-1 py-10 rounded-3xl border transition-all text-sm font-black tracking-[0.2em] uppercase ${theme.mode === 'light' ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  Light Node
                </button>
              </div>
            </div>

            <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
              <h5 className="text-[11px] font-black text-gold uppercase tracking-[0.3em] mb-4">Preview Engine</h5>
              <div className="space-y-4">
                <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                <div className="h-4 w-full bg-white/5 rounded-full" />
                <div className="h-12 w-32 bg-gold rounded-2xl mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeView;
