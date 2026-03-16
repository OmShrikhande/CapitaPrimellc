const express = require('express');
const { login, getProfile } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Admin login route
router.post('/login', login);

// Protected admin routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;