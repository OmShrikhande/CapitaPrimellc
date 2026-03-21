const express = require('express');
const { getContent, updateContent, updateSection, updateArrayItem, deleteArrayItem, resetContent } = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can get the content
router.get('/', getContent);

// Protected routes - only admins can update
router.put('/', authenticateToken, updateContent);
router.put('/:section', authenticateToken, updateSection);
router.post('/array/:type/:index', authenticateToken, updateArrayItem);
router.delete('/array/:type/:index', authenticateToken, deleteArrayItem);

// Reset content to default state - admin only
router.post('/reset', authenticateToken, resetContent);

module.exports = router;
