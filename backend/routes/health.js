const express = require('express');
const { getRoot, getHealth } = require('../controllers/healthController');

const router = express.Router();

// Root endpoint
router.get('/', getRoot);

// Health check endpoint
router.get('/health', getHealth);

module.exports = router;