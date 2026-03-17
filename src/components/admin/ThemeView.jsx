import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminAPI } from '../../context/api';

const ThemeView = () => {
  const [theme, setTheme] = useState({
    primary: '#C9A84C',
    secondary: '#0a0a0a',
    accent: '#ffffff',
    mode: 'dark'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debouncing refs
  const saveTimeoutRef = useRef(null);
  const lastSavedThemeRef = useRef(null);

  // Load theme data on component mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const loadTheme = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.theme.get();
      if (response.success && response.data) {
        setTheme(response.data);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      setMessage('Failed to load theme data');
    } finally {
      setLoading(false);
    }
  };

  // Debounced save function
  const debouncedSave = useCallback(async (themeToSave) => {
    // Prevent duplicate saves
    if (JSON.stringify(themeToSave) === JSON.stringify(lastSavedThemeRef.current)) {
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setHasUnsavedChanges(false);

      await adminAPI.theme.update(themeToSave);
      lastSavedThemeRef.current = themeToSave;

      setMessage('Theme updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update theme:', error);
      setMessage('Failed to save theme changes');
      setHasUnsavedChanges(true);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleChange = (field, value) => {
    const updatedTheme = { ...theme, [field]: value };
    setTheme(updatedTheme);
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new debounced timeout (800ms delay)
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(updatedTheme);
    }, 800);
  };

  const handleResetTheme = async () => {
    const defaultTheme = {
      primary: '#C9A84C',
      secondary: '#0a0a0a',
      accent: '#ffffff',
      mode: 'dark'
    };

    try {
      setSaving(true);
      setMessage('');
      await adminAPI.theme.update(defaultTheme);
      setTheme(defaultTheme);
      setMessage('Theme reset to default successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to reset theme:', error);
      setMessage('Failed to reset theme');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
      setShowResetModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="px-2">
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Theme Pulsar</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Loading theme data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-3xl font-serif font-bold tracking-tight">Theme Pulsar</h3>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Global Style Node Management</p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Unsaved Changes</span>
              </div>
            )}
            <button
              onClick={() => {
                if (saveTimeoutRef.current) {
                  clearTimeout(saveTimeoutRef.current);
                }
                debouncedSave(theme);
              }}
              disabled={saving || !hasUnsavedChanges}
              className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
            >
              {saving ? 'Saving...' : 'Save Now'}
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
            >
              Reset Theme
            </button>
          </div>
        </div>
        {message && (
          <div className={`mt-4 p-4 rounded-xl border text-sm font-bold uppercase tracking-widest ${
            message.includes('success')
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {saving && <span className="mr-2">💾</span>}
            {message}
          </div>
        )}
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

      {/* Reset Theme Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Resetting Theme</h3>
              <p className="text-gray-400 text-sm mb-8">
                This will reset all theme colors and mode to their default values. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetTheme}
                  disabled={saving}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Resetting...' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeView;
