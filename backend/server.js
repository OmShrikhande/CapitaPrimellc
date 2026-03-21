require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');
const assetRoutes = require('./routes/assetRoutes');
const contentRoutes = require('./routes/content');

// Initialize Firebase (this will validate the configuration)
const { db, isFirebaseConfigured } = require('./config/firebase');
const { INITIAL_DATA } = require('./utils/initialData');

// Initialize default content in database
const initializeDefaultContent = async () => {
  if (!isFirebaseConfigured()) {
    console.log('⚠️ Firebase not configured, skipping content initialization');
    return;
  }

  try {
    const contentRef = db.collection('content').doc('main');
    const doc = await contentRef.get();

    if (!doc.exists) {
      console.log('📝 Initializing default content in database...');
      await contentRef.set({
        ...INITIAL_DATA,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Default content initialized');
    } else {
      const existingData = doc.data();
      const mergedContent = {
        ...INITIAL_DATA,
        ...existingData,
        popupSettings: {
          ...INITIAL_DATA.popupSettings,
          ...(existingData.popupSettings || {})
        }
      };

      const missingTopLevelFields = Object.keys(INITIAL_DATA).filter((key) => existingData[key] === undefined);
      const popupSettingsChanged = JSON.stringify(existingData.popupSettings || {}) !== JSON.stringify(mergedContent.popupSettings);

      if (missingTopLevelFields.length > 0 || popupSettingsChanged) {
        console.log('🔧 Content missing new fields, patching defaults...');
        await contentRef.set({
          ...mergedContent,
          updatedAt: new Date()
        }, { merge: true });
        console.log('✅ Content schema updated');
      } else {
        console.log('✅ Content already exists in database');
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize default content:', error);
  }
};

// Initialize default theme and fix missing colors in database
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
      console.log('✅ Active theme found, checking for missing colors...');
      // Check and fix missing colors in the active theme
      const activeThemeDoc = activeThemesQuery.docs[0];
      const activeThemeData = activeThemeDoc.data();

      const DEFAULT_THEME = {
        primary: '#C9A84C', primaryLight: '#E8D5A3', primaryDark: '#8B6B14', primaryMuted: '#6B5520',
        secondary: '#0a0a0a', accent: '#ffffff',
        bgPrimary: '#060606', bgSecondary: '#0C0C0C', bgTertiary: '#111111', bgCard: '#0a0a0a', bgCardHover: 'rgba(16, 14, 10, 0.9)',
        textPrimary: '#ffffff', textSecondary: 'rgba(255, 255, 255, 0.6)', textMuted: 'rgba(255, 255, 255, 0.28)',
        surfaceGlass: 'rgba(255, 255, 255, 0.025)', surfaceGlassDark: 'rgba(6, 6, 6, 0.85)', surfaceBadge: 'rgba(6, 6, 6, 0.88)',
        borderPrimary: 'rgba(255, 255, 255, 0.07)', borderSecondary: 'rgba(255, 255, 255, 0.06)', borderAccent: 'rgba(201, 168, 76, 0.15)', borderGold: 'rgba(201, 168, 76, 0.3)',
        hoverPrimary: 'rgba(201, 168, 76, 0.09)', hoverSecondary: 'rgba(201, 168, 76, 0.18)', focusRing: 'rgba(201, 168, 76, 0.05)',
        mode: 'dark'
      };

      const completeThemeData = { ...DEFAULT_THEME, ...activeThemeData };
      const hasMissingColors = Object.keys(DEFAULT_THEME).some(key =>
        !activeThemeData.hasOwnProperty(key) || activeThemeData[key] === undefined || activeThemeData[key] === null
      );

      if (hasMissingColors) {
        console.log('⚠️ Active theme missing colors, updating...');
        await activeThemeDoc.ref.update({
          ...completeThemeData,
          updatedAt: new Date()
        });
        console.log('✅ Active theme updated with missing colors');
      } else {
        console.log('✅ Active theme has all colors');
      }
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
    // Don't crash the server if theme initialization fails
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Required for displaying local uploads
}));

// Simplified CORS for robustness
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API routes
app.use('/', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/content', contentRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Handle different types of errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize default theme and content before starting server
    await initializeDefaultTheme();
    await initializeDefaultContent();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Admin login: http://localhost:${PORT}/api/admin/login`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
