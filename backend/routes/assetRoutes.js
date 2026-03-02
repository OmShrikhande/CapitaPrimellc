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
router.post('/', authenticateToken, upload.single('image'), createAsset);
router.put('/:id', authenticateToken, upload.single('image'), updateAsset);
router.delete('/:id', authenticateToken, deleteAsset);

module.exports = router;
