import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from './api';

const ThemeContext = createContext();

const DEFAULT_THEME = {
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

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      setError(null);

      // Check localStorage cache first (for better UX)
      const cachedTheme = localStorage.getItem('capita_theme_cache');
      if (cachedTheme) {
        try {
          const parsed = JSON.parse(cachedTheme);
          setTheme(parsed);
        } catch (e) {
          // Invalid cache, ignore
        }
      }

      // Theme GET is now public - always try to load from API
      const response = await adminAPI.theme.get();
      if (response.success && response.data) {
        setTheme(response.data);
        setLastUpdated(new Date());

        // Cache the theme for better UX on reloads
        localStorage.setItem('capita_theme_cache', JSON.stringify(response.data));
      }
    } catch (error) {
      console.warn('Failed to load theme from API, using cache/defaults:', error.message);
      setError(error.message);

      // Don't clear cache if API fails - keep cached version
      // Only clear if cache is corrupted
    } finally {
      setLoading(false);
    }
  };

  // Update theme (for admin panel)
  const updateTheme = async (newTheme) => {
    // Optimistic update - update UI immediately
    setTheme(newTheme);
    setLastUpdated(new Date());

    // Cache immediately for better UX
    localStorage.setItem('capita_theme_cache', JSON.stringify(newTheme));

    // If user is authenticated, save to API
    if (adminAPI.isAuthenticated()) {
      try {
        setError(null);
        await adminAPI.theme.update(newTheme);
      } catch (error) {
        console.error('Failed to save theme to API:', error);
        setError('Theme saved locally but failed to sync to server');

        // Revert to previous theme if API fails
        // Note: This would require keeping track of previous theme
        // For now, we keep the optimistic update but show error
      }
    }
  };

  // CSS custom properties for dynamic theming
  const themeCSS = {
    // Primary Palette
    '--theme-primary': theme.primary,
    '--theme-primary-light': theme.primaryLight,
    '--theme-primary-dark': theme.primaryDark,
    '--theme-primary-muted': theme.primaryMuted,

    // Background Colors
    '--theme-bg-primary': theme.bgPrimary,
    '--theme-bg-secondary': theme.bgSecondary,
    '--theme-bg-tertiary': theme.bgTertiary,
    '--theme-bg-card': theme.bgCard,
    '--theme-bg-card-hover': theme.bgCardHover,

    // Text Colors
    '--theme-text-primary': theme.textPrimary,
    '--theme-text-secondary': theme.textSecondary,
    '--theme-text-muted': theme.textMuted,

    // Surface Colors
    '--theme-surface-glass': theme.surfaceGlass,
    '--theme-surface-glass-dark': theme.surfaceGlassDark,
    '--theme-surface-badge': theme.surfaceBadge,

    // Border Colors
    '--theme-border-primary': theme.borderPrimary,
    '--theme-border-secondary': theme.borderSecondary,
    '--theme-border-accent': theme.borderAccent,
    '--theme-border-gold': theme.borderGold,

    // Interactive Colors
    '--theme-hover-primary': theme.hoverPrimary,
    '--theme-hover-secondary': theme.hoverSecondary,
    '--theme-focus-ring': theme.focusRing,

    // Theme Mode
    '--theme-mode': theme.mode,
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeCSS).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply dark/light mode class
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: updateTheme,
    loading,
    error,
    lastUpdated,
    reloadTheme: loadTheme,
    // Utility functions for components
    isDark: theme.mode === 'dark',
    isLight: theme.mode === 'light',
    colors: {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
    },
    // Helper functions
    resetToDefaults: () => updateTheme(DEFAULT_THEME),
    hasError: !!error,
    isStale: lastUpdated && (Date.now() - lastUpdated.getTime()) > 300000, // 5 minutes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;