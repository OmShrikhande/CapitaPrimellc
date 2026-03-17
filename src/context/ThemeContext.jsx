import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from './api';

const ThemeContext = createContext();

const DEFAULT_THEME = {
  primary: '#C9A84C',
  secondary: '#0a0a0a',
  accent: '#ffffff',
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
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
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