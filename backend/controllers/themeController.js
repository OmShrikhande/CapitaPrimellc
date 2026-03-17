const { db, isFirebaseConfigured } = require('../config/firebase');

// Default theme configuration
const DEFAULT_THEME = {
  primary: '#C9A84C', // Gold color
  secondary: '#0a0a0a', // Dark background
  accent: '#ffffff', // White text
  mode: 'dark',
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
      themeData = {
        id: themeDoc.id,
        ...themeDoc.data()
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
    const { primary, secondary, accent, mode, name } = req.body;

    console.log('Update theme request:', { primary, secondary, accent, mode, name });

    if (!isFirebaseConfigured()) {
      console.error('Firebase not configured');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    // Validate required fields
    if (!primary || !secondary || !accent || !mode) {
      console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Primary, secondary, accent colors and mode are required'
      });
    }

    // Validate mode
    if (!['dark', 'light'].includes(mode)) {
      console.error('Invalid mode:', mode);
      return res.status(400).json({
        success: false,
        message: 'Mode must be either "dark" or "light"'
      });
    }

    const themeData = {
      primary,
      secondary,
      accent,
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
        console.log('Updating existing theme:', activeThemeDoc.id);

        await activeThemeDoc.ref.update({
          ...themeData,
          updatedAt: new Date()
        });

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
        console.log('Creating new theme document');

        const newThemeRef = await db.collection('themes').add({
          ...themeData,
          createdAt: new Date()
        });

        console.log('New theme created with ID:', newThemeRef.id);

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
    const { primary, secondary, accent, mode, name } = req.body;

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
      primary: primary || DEFAULT_THEME.primary,
      secondary: secondary || DEFAULT_THEME.secondary,
      accent: accent || DEFAULT_THEME.accent,
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