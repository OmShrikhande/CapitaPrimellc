const { db, isFirebaseConfigured } = require('../config/firebase');

// Default theme configuration with comprehensive color palette
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
  mode: 'dark',

  // Metadata
  name: 'default',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Get current theme
const getTheme = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_THEME
      });
    }

    // Get the active theme (or default if none exists)
    const themeQuery = await db.collection('themes')
      .where('active', '==', true)
      .limit(1)
      .get();

    let themeData;

    if (!themeQuery.empty) {
      const themeDoc = themeQuery.docs[0];
      const dbThemeData = themeDoc.data();
      // Merge database theme with defaults to ensure all fields are present
      themeData = {
        id: themeDoc.id,
        ...DEFAULT_THEME,
        ...dbThemeData
      };
    } else {
      // No active theme, return default
      themeData = DEFAULT_THEME;
    }

    res.json({
      success: true,
      data: themeData
    });

  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update theme
const updateTheme = async (req, res) => {
  try {
    const {
      // Primary Palette
      primary, primaryLight, primaryDark, primaryMuted,
      // Background Colors
      bgPrimary, bgSecondary, bgTertiary, bgCard, bgCardHover,
      // Text Colors
      textPrimary, textSecondary, textMuted,
      // Surface Colors
      surfaceGlass, surfaceGlassDark, surfaceBadge,
      // Border Colors
      borderPrimary, borderSecondary, borderAccent, borderGold,
      // Interactive Colors
      hoverPrimary, hoverSecondary, focusRing,
      // Theme settings
      mode, name
    } = req.body;

    if (!isFirebaseConfigured()) {
      console.error('Firebase not configured');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    // Validate required fields - primary, secondary, accent colors and mode are required
    if (!primary || !mode) {
      console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Primary color and mode are required'
      });
    }

    // For theme reset/updates, ensure we have all the core color fields
    // If secondary or accent are missing, use defaults
    const secondary = req.body.secondary || req.body.bgPrimary || DEFAULT_THEME.bgPrimary;
    const accent = req.body.accent || req.body.textPrimary || DEFAULT_THEME.textPrimary;

    // Validate mode
    if (!['dark', 'light'].includes(mode)) {
      console.error('Invalid mode:', mode);
      return res.status(400).json({
        success: false,
        message: 'Mode must be either "dark" or "light"'
      });
    }

    const themeData = {
      // Primary Palette
      primary,
      primaryLight: primaryLight || DEFAULT_THEME.primaryLight,
      primaryDark: primaryDark || DEFAULT_THEME.primaryDark,
      primaryMuted: primaryMuted || DEFAULT_THEME.primaryMuted,

      // Core colors for compatibility
      secondary,
      accent,

      // Background Colors
      bgPrimary: bgPrimary || DEFAULT_THEME.bgPrimary,
      bgSecondary: bgSecondary || DEFAULT_THEME.bgSecondary,
      bgTertiary: bgTertiary || DEFAULT_THEME.bgTertiary,
      bgCard: bgCard || DEFAULT_THEME.bgCard,
      bgCardHover: bgCardHover || DEFAULT_THEME.bgCardHover,

      // Text Colors
      textPrimary: textPrimary || DEFAULT_THEME.textPrimary,
      textSecondary: textSecondary || DEFAULT_THEME.textSecondary,
      textMuted: textMuted || DEFAULT_THEME.textMuted,

      // Surface Colors
      surfaceGlass: surfaceGlass || DEFAULT_THEME.surfaceGlass,
      surfaceGlassDark: surfaceGlassDark || DEFAULT_THEME.surfaceGlassDark,
      surfaceBadge: surfaceBadge || DEFAULT_THEME.surfaceBadge,

      // Border Colors
      borderPrimary: borderPrimary || DEFAULT_THEME.borderPrimary,
      borderSecondary: borderSecondary || DEFAULT_THEME.borderSecondary,
      borderAccent: borderAccent || DEFAULT_THEME.borderAccent,
      borderGold: borderGold || DEFAULT_THEME.borderGold,

      // Interactive Colors
      hoverPrimary: hoverPrimary || DEFAULT_THEME.hoverPrimary,
      hoverSecondary: hoverSecondary || DEFAULT_THEME.hoverSecondary,
      focusRing: focusRing || DEFAULT_THEME.focusRing,

      // Theme settings
      mode,
      name: name || 'custom',
      active: true,
      updatedAt: new Date()
    };

    console.log('Theme data to save:', themeData);

    // Try a simpler approach - just update/create a single document
    try {
      // Check if there's an existing active theme
      const activeThemesQuery = await db.collection('themes')
        .where('active', '==', true)
        .limit(1)
        .get();

      console.log('Active themes found:', activeThemesQuery.size);

      // If there's an active theme, update it instead of creating a new one
      if (!activeThemesQuery.empty) {
        const activeThemeDoc = activeThemesQuery.docs[0];
        console.log('Updating existing theme document:', activeThemeDoc.id, 'in collection: themes');

        await activeThemeDoc.ref.update({
          ...themeData,
          updatedAt: new Date()
        });

        console.log('Theme updated successfully in Firestore');

        res.json({
          success: true,
          message: 'Theme updated successfully',
          data: {
            id: activeThemeDoc.id,
            ...themeData
          }
        });
      } else {
        // No active theme, create a new one
        console.log('Creating new theme document in collection: themes');

        const newThemeRef = await db.collection('themes').add({
          ...themeData,
          createdAt: new Date()
        });

        console.log('New theme created with ID:', newThemeRef.id, 'in collection: themes');

        res.json({
          success: true,
          message: 'Theme created successfully',
          data: {
            id: newThemeRef.id,
            ...themeData
          }
        });
      }

    } catch (batchError) {
      console.error('Batch operation failed:', batchError);
      throw batchError;
    }

  } catch (error) {
    console.error('Update theme error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all themes
const getAllThemes = async (req, res) => {
  try {
    if (!isFirebaseConfigured()) {
      return res.status(200).json({
        success: true,
        data: [DEFAULT_THEME]
      });
    }

    const themesQuery = await db.collection('themes')
      .orderBy('updatedAt', 'desc')
      .get();

    const themes = themesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // If no themes exist, return default
    if (themes.length === 0) {
      themes.push(DEFAULT_THEME);
    }

    res.json({
      success: true,
      data: themes
    });

  } catch (error) {
    console.error('Get all themes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new theme preset
const createThemePreset = async (req, res) => {
  try {
    const {
      // Primary Palette
      primary, primaryLight, primaryDark, primaryMuted,
      // Core colors
      secondary, accent,
      // Background Colors
      bgPrimary, bgSecondary, bgTertiary, bgCard, bgCardHover,
      // Text Colors
      textPrimary, textSecondary, textMuted,
      // Surface Colors
      surfaceGlass, surfaceGlassDark, surfaceBadge,
      // Border Colors
      borderPrimary, borderSecondary, borderAccent, borderGold,
      // Interactive Colors
      hoverPrimary, hoverSecondary, focusRing,
      // Theme settings
      mode, name
    } = req.body;

    if (!isFirebaseConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Theme name is required'
      });
    }

    const themeData = {
      // Primary Palette
      primary: primary || DEFAULT_THEME.primary,
      primaryLight: primaryLight || DEFAULT_THEME.primaryLight,
      primaryDark: primaryDark || DEFAULT_THEME.primaryDark,
      primaryMuted: primaryMuted || DEFAULT_THEME.primaryMuted,

      // Core colors for compatibility
      secondary: secondary || bgPrimary || DEFAULT_THEME.secondary,
      accent: accent || textPrimary || DEFAULT_THEME.accent,

      // Background Colors
      bgPrimary: bgPrimary || DEFAULT_THEME.bgPrimary,
      bgSecondary: bgSecondary || DEFAULT_THEME.bgSecondary,
      bgTertiary: bgTertiary || DEFAULT_THEME.bgTertiary,
      bgCard: bgCard || DEFAULT_THEME.bgCard,
      bgCardHover: bgCardHover || DEFAULT_THEME.bgCardHover,

      // Text Colors
      textPrimary: textPrimary || DEFAULT_THEME.textPrimary,
      textSecondary: textSecondary || DEFAULT_THEME.textSecondary,
      textMuted: textMuted || DEFAULT_THEME.textMuted,

      // Surface Colors
      surfaceGlass: surfaceGlass || DEFAULT_THEME.surfaceGlass,
      surfaceGlassDark: surfaceGlassDark || DEFAULT_THEME.surfaceGlassDark,
      surfaceBadge: surfaceBadge || DEFAULT_THEME.surfaceBadge,

      // Border Colors
      borderPrimary: borderPrimary || DEFAULT_THEME.borderPrimary,
      borderSecondary: borderSecondary || DEFAULT_THEME.borderSecondary,
      borderAccent: borderAccent || DEFAULT_THEME.borderAccent,
      borderGold: borderGold || DEFAULT_THEME.borderGold,

      // Interactive Colors
      hoverPrimary: hoverPrimary || DEFAULT_THEME.hoverPrimary,
      hoverSecondary: hoverSecondary || DEFAULT_THEME.hoverSecondary,
      focusRing: focusRing || DEFAULT_THEME.focusRing,

      // Theme settings
      mode: mode || DEFAULT_THEME.mode,
      name,
      active: false, // New presets are not active by default
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('themes').add(themeData);

    res.json({
      success: true,
      message: 'Theme preset created successfully',
      data: {
        id: docRef.id,
        ...themeData
      }
    });

  } catch (error) {
    console.error('Create theme preset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Activate a theme
const activateTheme = async (req, res) => {
  try {
    const { themeId } = req.params;

    if (!isFirebaseConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    // First, set all themes to inactive
    const batch = db.batch();
    const allThemes = await db.collection('themes').get();

    allThemes.docs.forEach(doc => {
      batch.update(doc.ref, { active: false });
    });

    // Set the specified theme to active
    const themeRef = db.collection('themes').doc(themeId);
    const themeDoc = await themeRef.get();

    if (!themeDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }

    batch.update(themeRef, {
      active: true,
      updatedAt: new Date()
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Theme activated successfully',
      data: {
        id: themeDoc.id,
        ...themeDoc.data(),
        active: true
      }
    });

  } catch (error) {
    console.error('Activate theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getTheme,
  updateTheme,
  getAllThemes,
  createThemePreset,
  activateTheme
};