const express = require('express');
const { login, getProfile } = require('../controllers/adminController');
const { getTheme, updateTheme, getAllThemes, createThemePreset, activateTheme } = require('../controllers/themeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Admin login route
router.post('/login', login);

// Protected admin routes
router.get('/profile', authenticateToken, getProfile);

// Theme management routes
router.get('/theme', getTheme); // Public - anyone can get current theme
router.put('/theme', authenticateToken, updateTheme); // Protected - only admins can update
router.get('/themes', authenticateToken, getAllThemes); // Protected - only admins can see all themes
router.post('/themes', authenticateToken, createThemePreset); // Protected - only admins can create presets
router.put('/themes/:themeId/activate', authenticateToken, activateTheme); // Protected - only admins can activate themes

module.exports = router;