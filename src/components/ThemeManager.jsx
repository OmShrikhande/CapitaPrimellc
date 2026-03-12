import { useEffect } from 'react';
import { useCMS } from '../context/useCMS';

const ThemeManager = () => {
  const { data } = useCMS();
  const { theme } = data;

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--color-gold', theme.primary);
    root.style.setProperty('--color-void', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    
    // Adjust related colors
    root.style.setProperty('--color-gold-light', `${theme.primary}CC`);
    root.style.setProperty('--color-gold-dark', `${theme.primary}88`);
    
    if (theme.mode === 'light') {
      root.style.setProperty('--color-obsidian', '#f5f5f5');
      root.style.setProperty('--color-onyx', '#e5e5e5');
      root.style.setProperty('--color-charcoal', '#d4d4d4');
      document.body.style.backgroundColor = theme.secondary;
      document.body.style.color = '#000000';
    } else {
      root.style.setProperty('--color-obsidian', '#0C0C0C');
      root.style.setProperty('--color-onyx', '#111111');
      root.style.setProperty('--color-charcoal', '#1A1A1A');
      document.body.style.backgroundColor = theme.secondary;
      document.body.style.color = '#ffffff';
    }
  }, [theme]);

  return null;
};

export default ThemeManager;
