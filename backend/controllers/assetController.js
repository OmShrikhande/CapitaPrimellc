const { db } = require('../config/firebase');
const fs = require('fs');
const path = require('path');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
const getAssets = async (req, res) => {
  try {
    const assetsSnapshot = await db.collection('assets').orderBy('createdAt', 'desc').get();
    const assets = [];
    assetsSnapshot.forEach(doc => {
      assets.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets',
      error: error.message
    });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Public
const getAsset = async (req, res) => {
  try {
    const assetDoc = await db.collection('assets').doc(req.params.id).get();
    
    if (!assetDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { id: assetDoc.id, ...assetDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset',
      error: error.message
    });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Admin
const createAsset = async (req, res) => {
  try {
    const { name, type, quantity, location, description } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      // Store relative paths for up to 7 images
      imageUrls = req.files.slice(0, 7).map(file => `/uploads/${file.filename}`);
    }

    const newAsset = {
      name,
      type,
      quantity: parseInt(quantity) || 0,
      location,
      description,
      imageUrls, // Changed from imageUrl to imageUrls array
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('assets').add(newAsset);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...newAsset }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create asset',
      error: error.message
    });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Admin
const updateAsset = async (req, res) => {
  try {
    const { name, type, quantity, location, description } = req.body;
    const assetRef = db.collection('assets').doc(req.params.id);
    const assetDoc = await assetRef.get();

    if (!assetDoc.exists) {
      // If files were uploaded but asset not found, delete the files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          fs.unlinkSync(path.join(__dirname, '../../public/uploads', file.filename));
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity) || 0;
    if (location) updateData.location = location;
    if (description) updateData.description = description;

    if (req.files && req.files.length > 0) {
      // Handle new images (up to 7 total)
      const oldAsset = assetDoc.data();
      const existingImages = oldAsset.imageUrls || [];
      const newImages = req.files.slice(0, 7 - existingImages.length).map(file => `/uploads/${file.filename}`);

      updateData.imageUrls = [...existingImages, ...newImages];
    }

    await assetRef.update(updateData);

    const updatedDoc = await assetRef.get();

    res.status(200).json({
      success: true,
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update asset',
      error: error.message
    });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Admin
const deleteAsset = async (req, res) => {
  try {
    const assetRef = db.collection('assets').doc(req.params.id);
    const assetDoc = await assetRef.get();

    if (!assetDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Delete all images if they exist
    const asset = assetDoc.data();
    if (asset.imageUrls && Array.isArray(asset.imageUrls)) {
      asset.imageUrls.forEach(imageUrl => {
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
          const imagePath = path.join(__dirname, '../../public', imageUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    await assetRef.delete();

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete asset',
      error: error.message
    });
  }
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
};
