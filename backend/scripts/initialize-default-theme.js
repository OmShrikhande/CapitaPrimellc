const { db, isFirebaseConfigured } = require('../config/firebase');

const initializeDefaultTheme = async () => {
  if (!isFirebaseConfigured()) {
    console.log('⚠️ Firebase not configured, skipping theme initialization');
    return;
  }

  try {
    console.log('🎨 Checking for default theme in database...');

    // Check if any active theme exists
    const activeThemesQuery = await db.collection('themes')
      .where('active', '==', true)
      .limit(1)
      .get();

    if (!activeThemesQuery.empty) {
      console.log('✅ Active theme found, skipping default theme creation');
      return;
    }

    // Check if default theme exists (by name)
    const defaultThemeQuery = await db.collection('themes')
      .where('name', '==', 'default')
      .limit(1)
      .get();

    if (!defaultThemeQuery.empty) {
      console.log('✅ Default theme found, activating it...');
      // Activate the existing default theme
      const defaultThemeDoc = defaultThemeQuery.docs[0];
      await defaultThemeDoc.ref.update({
        active: true,
        updatedAt: new Date()
      });
      console.log('✅ Default theme activated');
      return;
    }

    // Create default theme
    console.log('📝 Creating default theme...');

    const DEFAULT_THEME = {
      // Primary Palette - Main brand colors
      primary: '#C9A84C',
      primaryLight: '#E8D5A3',
      primaryDark: '#8B6B14',
      primaryMuted: '#6B5520',

      // Core colors for API compatibility
      secondary: '#0a0a0a',
      accent: '#ffffff',

      // Background Colors
      bgPrimary: '#060606',
      bgSecondary: '#0C0C0C',
      bgTertiary: '#111111',
      bgCard: '#0a0a0a',
      bgCardHover: 'rgba(16, 14, 10, 0.9)',

      // Text and Accent Colors
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.6)',
      textMuted: 'rgba(255, 255, 255, 0.28)',

      // Surface Colors
      surfaceGlass: 'rgba(255, 255, 255, 0.025)',
      surfaceGlassDark: 'rgba(6, 6, 6, 0.85)',
      surfaceBadge: 'rgba(6, 6, 6, 0.88)',

      // Border and Divider Colors
      borderPrimary: 'rgba(255, 255, 255, 0.07)',
      borderSecondary: 'rgba(255, 255, 255, 0.06)',
      borderAccent: 'rgba(201, 168, 76, 0.15)',
      borderGold: 'rgba(201, 168, 76, 0.3)',

      // Interactive State Colors
      hoverPrimary: 'rgba(201, 168, 76, 0.09)',
      hoverSecondary: 'rgba(201, 168, 76, 0.18)',
      focusRing: 'rgba(201, 168, 76, 0.05)',

      // Theme settings
      mode: 'dark',
      name: 'default',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('themes').add(DEFAULT_THEME);
    console.log(`✅ Default theme created with ID: ${docRef.id}`);

  } catch (error) {
    console.error('❌ Failed to initialize default theme:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDefaultTheme().then(() => {
  console.log('🎉 Default theme initialization complete');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Default theme initialization failed:', error);
  process.exit(1);
});