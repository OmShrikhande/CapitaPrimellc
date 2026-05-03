const express = require('express');
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const { authenticateToken, optionalAuthenticate } = require('../middleware/auth');
const { upload, uploadToCloudinaryMiddleware } = require('../utils/upload');

const router = express.Router();

// Public routes (optional Bearer token returns full payloads for admin UI)
router.get('/', optionalAuthenticate, getAssets);
router.get('/:id', optionalAuthenticate, getAsset);

// Protected admin routes
router.post('/', authenticateToken, upload.array('images', 7), uploadToCloudinaryMiddleware, createAsset);

// Updates always use multipart (same as create) so booleans, numbers, and arrays parse reliably.
router.put('/:id', authenticateToken, upload.array('images', 7), uploadToCloudinaryMiddleware, updateAsset);

router.delete('/:id', authenticateToken, deleteAsset);

module.exports = router;
