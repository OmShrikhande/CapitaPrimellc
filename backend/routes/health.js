const express = require('express');
const { getRoot, getLightHealth, getHealth } = require('../controllers/healthController');

const router = express.Router();

// Root endpoint
router.get('/', getRoot);

// Lightweight ping (no Firebase) — use for uptime / Render keep-alive
router.get('/health/light', getLightHealth);

// Health check endpoint
router.get('/health', getHealth);

module.exports = router;