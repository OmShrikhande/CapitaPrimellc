const { db } = require('../config/firebase');
const fs = require('fs');
const path = require('path');
const { deleteFromCloudinary, extractPublicId, isCloudinaryConfigured } = require('../utils/cloudinary');

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase().trim();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
};

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
const getAssets = async (req, res) => {
  try {
    let assetsSnapshot;
    try {
      assetsSnapshot = await db.collection('assets').orderBy('createdAt', 'desc').get();
    } catch (orderErr) {
      console.warn('assets orderBy failed, using unordered fetch:', orderErr.message);
      assetsSnapshot = await db.collection('assets').get();
    }

    const assets = [];
    assetsSnapshot.forEach(doc => {
      assets.push({ id: doc.id, ...doc.data() });
    });

    const time = (row) => {
      const c = row.createdAt;
      if (c && typeof c.toDate === 'function') return c.toDate().getTime();
      if (c && typeof c._seconds === 'number') return c._seconds * 1000;
      const d = new Date(c);
      return Number.isFinite(d.getTime()) ? d.getTime() : 0;
    };
    assets.sort((a, b) => time(b) - time(a));

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
    const {
      name,
      type,
      quantity,
      location,
      description,
      // Property-specific fields
      price,
      area,
      bedrooms,
      bathrooms,
      parking,
      yearBuilt,
      propertyType,
      listingType,
      // Coordinates
      latitude,
      longitude,
      // Additional details
      amenities,
      features,
      neighborhood,
      developer,
      completionStatus,
      paymentPlan,
      // Contact info
      agentName,
      agentPhone,
      agentEmail
    } = req.body;

    let imageUrls = [];

    const isVisible = parseBoolean(req.body.isVisible, true);

    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      // Use Cloudinary URLs (or fallback local URLs)
      imageUrls = req.cloudinaryUrls.slice(0, 7);
    }

    const newAsset = {
      name,
      type,
      quantity: parseInt(quantity) || 0,
      location,
      description,
      imageUrls,
      isVisible,
      // Property details
      price: price ? parseFloat(price) : null,
      area: area ? parseFloat(area) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      parking: parking ? parseInt(parking) : null,
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
      propertyType,
      listingType,
      // Coordinates
      coordinates: latitude && longitude ? {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      } : null,
      // Additional details
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [],
      features: features ? (Array.isArray(features) ? features : [features]) : [],
      neighborhood,
      developer,
      completionStatus,
      paymentPlan,
      // Contact info
      agentName,
      agentPhone,
      agentEmail,
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
    // Handle both JSON and multipart/form-data requests
    let bodyData = req.body;

    // If it's multipart/form-data, parse the fields
    if (req.files || (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data'))) {
      // Multer has already parsed the fields into req.body
      bodyData = req.body;
    }

    const {
      name,
      type,
      quantity,
      location,
      description,
      // Property-specific fields
      price,
      area,
      bedrooms,
      bathrooms,
      parking,
      yearBuilt,
      propertyType,
      listingType,
      // Coordinates
      latitude,
      longitude,
      // Additional details
      amenities,
      features,
      neighborhood,
      developer,
      completionStatus,
      paymentPlan,
      // Contact info
      agentName,
      agentPhone,
      agentEmail
    } = bodyData;

    // If `isVisible` was provided, normalize it; otherwise keep current value.
    const hasIsVisible = bodyData.isVisible !== undefined;
    const isVisible = parseBoolean(bodyData.isVisible, true);

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

    // Basic fields
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity) || 0;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;

    // Property details
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
    if (area !== undefined) updateData.area = area ? parseFloat(area) : null;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms ? parseInt(bedrooms) : null;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms ? parseInt(bathrooms) : null;
    if (parking !== undefined) updateData.parking = parking ? parseInt(parking) : null;
    if (yearBuilt !== undefined) updateData.yearBuilt = yearBuilt ? parseInt(yearBuilt) : null;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (listingType !== undefined) updateData.listingType = listingType;

    // Coordinates
    if (latitude !== undefined && longitude !== undefined) {
      updateData.coordinates = latitude && longitude ? {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      } : null;
    }

    // Additional details
    if (amenities !== undefined) updateData.amenities = amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [];
    if (features !== undefined) updateData.features = features ? (Array.isArray(features) ? features : [features]) : [];
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
    if (developer !== undefined) updateData.developer = developer;
    if (completionStatus !== undefined) updateData.completionStatus = completionStatus;
    if (paymentPlan !== undefined) updateData.paymentPlan = paymentPlan;

    // Contact info
    if (agentName !== undefined) updateData.agentName = agentName;
    if (agentPhone !== undefined) updateData.agentPhone = agentPhone;
    if (agentEmail !== undefined) updateData.agentEmail = agentEmail;

    if (hasIsVisible) updateData.isVisible = isVisible;

    // Handle new images if uploaded
    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      const oldAsset = assetDoc.data();
      const existingImages = oldAsset.imageUrls || [];
      const newImages = req.cloudinaryUrls.slice(0, 7 - existingImages.length);

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
      for (const imageUrl of asset.imageUrls) {
        if (imageUrl) {
          // Check if it's a Cloudinary URL
          if (imageUrl.includes('cloudinary.com') && isCloudinaryConfigured()) {
            const publicId = extractPublicId(imageUrl);
            if (publicId) {
              try {
                await deleteFromCloudinary(publicId);
                console.log(`🗑️ Deleted image from Cloudinary: ${publicId}`);
              } catch (deleteError) {
                console.error(`❌ Failed to delete image from Cloudinary: ${publicId}`, deleteError);
              }
            }
          } else if (imageUrl.startsWith('/uploads/')) {
            // Local file deletion (fallback)
            const imagePath = path.join(__dirname, '../../public', imageUrl);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`🗑️ Deleted local image: ${imageUrl}`);
            }
          }
        }
      }
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
