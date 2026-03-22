const express = require('express');
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

// Public routes
router.get('/', getAssets);
router.get('/:id', getAsset);

// Protected admin routes
router.post('/', authenticateToken, upload.array('images', 7), createAsset);

// For updates, use multer conditionally - it will only process multipart/form-data
router.put('/:id', authenticateToken, (req, res, next) => {
  // Check if this is multipart/form-data
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    // Use multer to process files
    upload.array('images', 7)(req, res, next);
  } else {
    // Skip multer for JSON requests
    next();
  }
}, updateAsset);

router.delete('/:id', authenticateToken, deleteAsset);

module.exports = router;
