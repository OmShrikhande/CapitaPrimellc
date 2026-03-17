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
router.get('/theme', authenticateToken, getTheme);
router.put('/theme', authenticateToken, updateTheme);
router.get('/themes', authenticateToken, getAllThemes);
router.post('/themes', authenticateToken, createThemePreset);
router.put('/themes/:themeId/activate', authenticateToken, activateTheme);

module.exports = router;