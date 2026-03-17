import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminAPI } from '../../context/api';

// ColorControl Component
const ColorControl = ({ label, description, value, onChange, disabled = false }) => (
  <div className="flex items-center justify-between group">
    <div className="flex-1">
      <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1 transition-colors group-hover:text-[var(--theme-primary)]">{label}</p>
      <p className="text-[9px] text-gray-700 font-bold uppercase">{description}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-xs font-mono text-white/50 min-w-[80px]">{value}</span>
      <input
        type="color"
        value={value && value.startsWith('#') ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1 cursor-pointer transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

const ThemeView = () => {
  const [theme, setTheme] = useState({
    // Primary Palette - Main brand colors
    primary: '#C9A84C', // Main brand gold color
    primaryLight: '#E8D5A3', // Lighter gold for highlights
    primaryDark: '#8B6B14', // Darker gold for depth
    primaryMuted: '#6B5520', // Muted gold for subtle accents

    // Core colors for API compatibility
    secondary: '#0a0a0a', // Main background color
    accent: '#ffffff', // Primary text color

    // Background Colors
    bgPrimary: '#060606', // Main page background
    bgSecondary: '#0C0C0C', // Secondary background (scrollbar track)
    bgTertiary: '#111111', // Tertiary background (form options)
    bgCard: '#0a0a0a', // Card backgrounds
    bgCardHover: 'rgba(16, 14, 10, 0.9)', // Card hover background

    // Text and Accent Colors
    textPrimary: '#ffffff', // Primary text color
    textSecondary: 'rgba(255, 255, 255, 0.6)', // Secondary text (nav links)
    textMuted: 'rgba(255, 255, 255, 0.28)', // Muted text (placeholders)

    // Surface Colors
    surfaceGlass: 'rgba(255, 255, 255, 0.025)', // Glass effect backgrounds
    surfaceGlassDark: 'rgba(6, 6, 6, 0.85)', // Dark glass backgrounds
    surfaceBadge: 'rgba(6, 6, 6, 0.88)', // Floating badge backgrounds

    // Border and Divider Colors
    borderPrimary: 'rgba(255, 255, 255, 0.07)', // Primary borders
    borderSecondary: 'rgba(255, 255, 255, 0.06)', // Secondary borders
    borderAccent: 'rgba(201, 168, 76, 0.15)', // Accent borders
    borderGold: 'rgba(201, 168, 76, 0.3)', // Gold accent borders

    // Interactive State Colors
    hoverPrimary: 'rgba(201, 168, 76, 0.09)', // Primary hover backgrounds
    hoverSecondary: 'rgba(201, 168, 76, 0.18)', // Secondary hover states
    focusRing: 'rgba(201, 168, 76, 0.05)', // Focus ring color

    // Theme Mode
    mode: 'dark'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Debouncing refs
  const saveTimeoutRef = useRef(null);
  const lastSavedThemeRef = useRef(null);

  // Load theme data on component mount
  useEffect(() => {
    loadTheme();
    setIsAuthenticated(adminAPI.isAuthenticated());
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

    // Check if user is authenticated
    if (!adminAPI.isAuthenticated()) {
      setMessage('Please login as admin to update theme');
      setHasUnsavedChanges(true);
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setHasUnsavedChanges(false);

      console.log('Frontend: Sending theme update:', themeToSave);
      await adminAPI.theme.update(themeToSave);
      lastSavedThemeRef.current = themeToSave;

      setMessage('Theme updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update theme:', error);
      setMessage(`Failed to save theme: ${error.message}`);
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
      // Primary Palette - Main brand colors
      primary: '#C9A84C', // Main brand gold color
      primaryLight: '#E8D5A3', // Lighter gold for highlights
      primaryDark: '#8B6B14', // Darker gold for depth
      primaryMuted: '#6B5520', // Muted gold for subtle accents

      // Core colors for API compatibility
      secondary: '#0a0a0a', // Main background color
      accent: '#ffffff', // Primary text color

      // Background Colors
      bgPrimary: '#060606', // Main page background
      bgSecondary: '#0C0C0C', // Secondary background (scrollbar track)
      bgTertiary: '#111111', // Tertiary background (form options)
      bgCard: '#0a0a0a', // Card backgrounds
      bgCardHover: 'rgba(16, 14, 10, 0.9)', // Card hover background

      // Text and Accent Colors
      textPrimary: '#ffffff', // Primary text color
      textSecondary: 'rgba(255, 255, 255, 0.6)', // Secondary text (nav links)
      textMuted: 'rgba(255, 255, 255, 0.28)', // Muted text (placeholders)

      // Surface Colors
      surfaceGlass: 'rgba(255, 255, 255, 0.025)', // Glass effect backgrounds
      surfaceGlassDark: 'rgba(6, 6, 6, 0.85)', // Dark glass backgrounds
      surfaceBadge: 'rgba(6, 6, 6, 0.88)', // Floating badge backgrounds

      // Border and Divider Colors
      borderPrimary: 'rgba(255, 255, 255, 0.07)', // Primary borders
      borderSecondary: 'rgba(255, 255, 255, 0.06)', // Secondary borders
      borderAccent: 'rgba(201, 168, 76, 0.15)', // Accent borders
      borderGold: 'rgba(201, 168, 76, 0.3)', // Gold accent borders

      // Interactive State Colors
      hoverPrimary: 'rgba(201, 168, 76, 0.09)', // Primary hover backgrounds
      hoverSecondary: 'rgba(201, 168, 76, 0.18)', // Secondary hover states
      focusRing: 'rgba(201, 168, 76, 0.05)', // Focus ring color

      // Theme Mode
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
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                {isAuthenticated ? 'Admin Authenticated' : 'Admin Login Required'}
              </span>
            </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Primary Palette */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Primary Palette</h4>
          <div className="space-y-6">
            <ColorControl
              label="Main Brand Color"
              description="Primary gold color used for CTAs and accents"
              value={theme.primary}
              onChange={(value) => handleChange('primary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Light Gold"
              description="Highlights and lighter gold accents"
              value={theme.primaryLight}
              onChange={(value) => handleChange('primaryLight', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Dark Gold"
              description="Depth and darker gold elements"
              value={theme.primaryDark}
              onChange={(value) => handleChange('primaryDark', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Muted Gold"
              description="Subtle gold accents and muted elements"
              value={theme.primaryMuted}
              onChange={(value) => handleChange('primaryMuted', value)}
              disabled={!isAuthenticated}
            />
          </div>
        </div>

        {/* Background Colors */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Background Colors</h4>
          <div className="space-y-6">
            <ColorControl
              label="Page Background"
              description="Main page background color"
              value={theme.bgPrimary}
              onChange={(value) => handleChange('bgPrimary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Scrollbar Track"
              description="Scrollbar background and secondary areas"
              value={theme.bgSecondary}
              onChange={(value) => handleChange('bgSecondary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Form Options"
              description="Dropdown and select option backgrounds"
              value={theme.bgTertiary}
              onChange={(value) => handleChange('bgTertiary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Card Backgrounds"
              description="Card and panel background colors"
              value={theme.bgCard}
              onChange={(value) => handleChange('bgCard', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Card Hover"
              description="Card background on hover states"
              value={theme.bgCardHover}
              onChange={(value) => handleChange('bgCardHover', value)}
              disabled={!isAuthenticated}
            />
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Text Colors</h4>
          <div className="space-y-6">
            <ColorControl
              label="Primary Text"
              description="Main text color throughout the site"
              value={theme.textPrimary}
              onChange={(value) => handleChange('textPrimary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Secondary Text"
              description="Navigation links and secondary text"
              value={theme.textSecondary}
              onChange={(value) => handleChange('textSecondary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Muted Text"
              description="Placeholders and muted text elements"
              value={theme.textMuted}
              onChange={(value) => handleChange('textMuted', value)}
              disabled={!isAuthenticated}
            />
          </div>
        </div>

        {/* Surface Colors */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Surface Colors</h4>
          <div className="space-y-6">
            <ColorControl
              label="Glass Effect"
              description="Glass card and overlay backgrounds"
              value={theme.surfaceGlass}
              onChange={(value) => handleChange('surfaceGlass', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Dark Glass"
              description="Dark glass panels and modals"
              value={theme.surfaceGlassDark}
              onChange={(value) => handleChange('surfaceGlassDark', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Badge Background"
              description="Floating badges and notification backgrounds"
              value={theme.surfaceBadge}
              onChange={(value) => handleChange('surfaceBadge', value)}
              disabled={!isAuthenticated}
            />
          </div>
        </div>

        {/* Border Colors */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Border Colors</h4>
          <div className="space-y-6">
            <ColorControl
              label="Primary Borders"
              description="Main border color for cards and elements"
              value={theme.borderPrimary}
              onChange={(value) => handleChange('borderPrimary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Secondary Borders"
              description="Secondary border color for subtle dividers"
              value={theme.borderSecondary}
              onChange={(value) => handleChange('borderSecondary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Accent Borders"
              description="Accent border color for highlights"
              value={theme.borderAccent}
              onChange={(value) => handleChange('borderAccent', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Gold Borders"
              description="Gold accent borders and glow effects"
              value={theme.borderGold}
              onChange={(value) => handleChange('borderGold', value)}
              disabled={!isAuthenticated}
            />
          </div>
        </div>

        {/* Interactive States */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 space-y-6">
          <h4 className="text-xl font-bold text-white/90 border-b border-white/5 pb-4">Interactive States</h4>
          <div className="space-y-6">
            <ColorControl
              label="Primary Hover"
              description="Background color for primary hover states"
              value={theme.hoverPrimary}
              onChange={(value) => handleChange('hoverPrimary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Secondary Hover"
              description="Background color for secondary hover states"
              value={theme.hoverSecondary}
              onChange={(value) => handleChange('hoverSecondary', value)}
              disabled={!isAuthenticated}
            />
            <ColorControl
              label="Focus Ring"
              description="Focus ring color for form inputs"
              value={theme.focusRing}
              onChange={(value) => handleChange('focusRing', value)}
              disabled={!isAuthenticated}
            />

            {/* Mode Control */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">Interface Mode</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleChange('mode', 'dark')}
                  disabled={!isAuthenticated}
                  className={`flex-1 py-8 rounded-2xl border transition-all text-sm font-black tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed ${theme.mode === 'dark' ? 'bg-[var(--theme-primary)] border-[var(--theme-primary)] text-black shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => handleChange('mode', 'light')}
                  disabled={!isAuthenticated}
                  className={`flex-1 py-8 rounded-2xl border transition-all text-sm font-black tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed ${theme.mode === 'light' ? 'bg-[var(--theme-primary)] border-[var(--theme-primary)] text-black shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  Light
                </button>
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
