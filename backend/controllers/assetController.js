const { db } = require('../config/firebase');
const fs = require('fs');
const path = require('path');
const { deleteFromCloudinary, extractPublicId, isCloudinaryConfigured } = require('../utils/cloudinary');
const { verifyAssetViewingUnlock } = require('../utils/assetUnlock');

const sanitizeQuery = (value, max) => {
  if (value == null) return '';
  const s = String(value).trim();
  return s.length > max ? s.slice(0, max) : s;
};

const getSafeCoverIndex = (coverImageIndex, imagesLength) => {
  const parsed = Number(coverImageIndex);
  if (!Number.isInteger(parsed) || parsed < 0) return 0;
  if (!Number.isInteger(imagesLength) || imagesLength <= 0) return 0;
  return Math.min(parsed, imagesLength - 1);
};

const normalizeImageListWithCoverFirst = (images, coverImageIndex) => {
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  if (list.length === 0) {
    return { imageUrls: [], coverImageIndex: 0, coverImageUrl: null };
  }
  const safeCoverIndex = getSafeCoverIndex(coverImageIndex, list.length);
  const cover = list[safeCoverIndex] || list[0];
  return { imageUrls: list, coverImageIndex: safeCoverIndex, coverImageUrl: cover || null };
};

/** Public list: hide rich details for special listings unless caller is admin. */
const redactSpecialForPublic = (id, data) => {
  const images = Array.isArray(data.imageUrls) ? data.imageUrls : [];
  const safeCoverIndex = getSafeCoverIndex(data.coverImageIndex, images.length);
  const coverImage = images.length > 0 ? (images[safeCoverIndex] || images[0]) : null;
  return {
    id,
    name: data.name,
    type: data.type,
    quantity: data.quantity,
    location: data.location,
    price: data.price,
    compareAtPrice: data.compareAtPrice,
    area: data.area,
    propertyType: data.propertyType,
    listingType: data.listingType,
    yearBuilt: data.yearBuilt,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    parking: data.parking,
    coverImageIndex: 0,
    coverImageUrl: coverImage || null,
    imageUrls: coverImage ? [coverImage] : [],
    features: Array.isArray(data.features) ? data.features.slice(0, 3) : [],
    isVisible: data.isVisible,
    isSpecial: true,
    viewingFeeAed: data.viewingFeeAed,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase().trim();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
};

// Normalizes multi-value fields coming from multipart/form-data.
// Depending on the client + multer behavior, values may arrive as:
// - an array (most ideal)
// - a JSON string of an array (recommended)
// - a comma-separated string
const normalizeStringArray = (value) => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value.map(String).map(s => s.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    // Try JSON array first
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map(s => s.trim()).filter(Boolean);
      }
    } catch {
      // fallthrough
    }

    // Fallback: comma-separated list
    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    // Single value
    return [trimmed];
  }

  // Unknown type: coerce to single string
  return [String(value).trim()].filter(Boolean);
};

const normalizeImagePath = (value) => String(value || '').trim().replace(/\\/g, '/');
const normalizeImageCompareKey = (value) => {
  const raw = normalizeImagePath(value);
  if (!raw) return '';
  try {
    return decodeURI(raw);
  } catch {
    return raw;
  }
};
const findCoverIndexByUrl = (images, candidateUrl) => {
  const list = Array.isArray(images) ? images : [];
  const key = normalizeImageCompareKey(candidateUrl);
  if (!key) return -1;
  for (let i = 0; i < list.length; i += 1) {
    if (normalizeImageCompareKey(list[i]) === key) return i;
  }
  return -1;
};

/** Rich broker / JV fields (optional strings on inventory assets). */
const LISTING_EXTENSION_FIELDS = [
  'marketingHeadline',
  'grossFloorAreaSqFt',
  'floorAreaRatio',
  'totalBuiltUpAreaSqFt',
  'buildingHeightDescription',
  'totalUnitsApproved',
  'usageType',
  'jvInventorySplit',
  'jvUpfrontNote',
  'mapsUrl',
  'advantagesNotes',
  'commissionPercent',
  'drawingsStatusNotes',
  'titleDeedsFeesNotes',
  'paymentTermsNotes',
  'investmentNarrative',
  'jvTermsRich',
];

const MAX_INDEXED_TEXT_LENGTH = 1400;
const LONG_TEXT_CHUNK_SIZE = 1200;

const chunkText = (value, chunkSize = LONG_TEXT_CHUNK_SIZE) => {
  const raw = String(value || '').trim();
  if (!raw) return [];
  const out = [];
  for (let i = 0; i < raw.length; i += chunkSize) {
    out.push(raw.slice(i, i + chunkSize));
  }
  return out;
};

const normalizeListingTextField = (value) => {
  const s = String(value || '').trim();
  if (!s) return { shortValue: null, chunks: [] };
  if (s.length <= MAX_INDEXED_TEXT_LENGTH) {
    return { shortValue: s, chunks: [] };
  }
  // Firestore can reject very long indexed string values. Keep a short indexed preview
  // and persist the full content in chunk fields so no text is lost.
  return {
    shortValue: s.slice(0, MAX_INDEXED_TEXT_LENGTH),
    chunks: chunkText(s),
  };
};

const pickListingExtensionsForCreate = (body) => {
  const o = {};
  if (!body || typeof body !== 'object') return o;
  for (const key of LISTING_EXTENSION_FIELDS) {
    const v = body[key];
    if (v === undefined || v === null) continue;
    const { shortValue, chunks } = normalizeListingTextField(v);
    if (!shortValue) continue;
    o[key] = shortValue;
    if (chunks.length > 1) {
      o[`${key}Chunks`] = chunks;
    }
  }
  return o;
};

const assignListingExtensionsForUpdate = (updateData, body) => {
  if (!body || typeof body !== 'object') return;
  for (const key of LISTING_EXTENSION_FIELDS) {
    if (body[key] === undefined) continue;
    const v = body[key];
    if (v === null || v === '') {
      updateData[key] = null;
      updateData[`${key}Chunks`] = null;
      continue;
    }
    const { shortValue, chunks } = normalizeListingTextField(v);
    updateData[key] = shortValue;
    updateData[`${key}Chunks`] = chunks.length > 1 ? chunks : null;
  }
};

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
const getAssets = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';

    let assetsSnapshot;
    try {
      assetsSnapshot = await db.collection('assets').orderBy('createdAt', 'desc').get();
    } catch (orderErr) {
      console.warn('assets orderBy failed, using unordered fetch:', orderErr.message);
      assetsSnapshot = await db.collection('assets').get();
    }

    const assets = [];
    assetsSnapshot.forEach((doc) => {
      const row = { id: doc.id, ...doc.data() };
      const isSpecial = parseBoolean(row.isSpecial, false);
      if (!isAdmin && isSpecial) {
        assets.push(redactSpecialForPublic(doc.id, row));
      } else {
        assets.push(row);
      }
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
    const isAdmin = req.user && req.user.role === 'admin';
    const assetDoc = await db.collection('assets').doc(req.params.id).get();

    if (!assetDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const raw = { id: assetDoc.id, ...assetDoc.data() };
    const isSpecial = parseBoolean(raw.isSpecial, false);
    const fee = Number(raw.viewingFeeAed);
    const hasViewingFee = Number.isFinite(fee) && fee > 0;

    if (isAdmin) {
      return res.status(200).json({
        success: true,
        data: { ...raw, locked: false },
      });
    }

    const unlockSession = sanitizeQuery(
      req.query.unlockSession || req.query.unlock_session || req.query.session_id,
      260
    );

    if (!isSpecial || !hasViewingFee) {
      return res.status(200).json({
        success: true,
        data: { ...raw, locked: false },
      });
    }

    const unlocked = unlockSession && (await verifyAssetViewingUnlock(unlockSession, raw.id));
    if (unlocked) {
      return res.status(200).json({
        success: true,
        data: { ...raw, locked: false, unlockSessionId: unlockSession },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: raw.id,
        name: raw.name,
        location: raw.location,
        type: raw.type,
        propertyType: raw.propertyType,
        listingType: raw.listingType,
        price: raw.price,
        compareAtPrice: raw.compareAtPrice,
        area: raw.area,
        imageUrls: (() => {
          const imgs = Array.isArray(raw.imageUrls) ? raw.imageUrls : [];
          if (imgs.length === 0) return [];
          const safeCoverIndex = getSafeCoverIndex(raw.coverImageIndex, imgs.length);
          const cover = imgs[safeCoverIndex] || imgs[0];
          return cover ? [cover] : [];
        })(),
        coverImageIndex: 0,
        isSpecial: true,
        viewingFeeAed: raw.viewingFeeAed,
        locked: true,
      },
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
      compareAtPrice,
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
    const isSpecial = parseBoolean(req.body.isSpecial, false);
    const viewingFeeRaw = req.body.viewingFeeAed;
    const hasFee =
      viewingFeeRaw !== undefined && viewingFeeRaw !== null && String(viewingFeeRaw).trim() !== '';
    const viewingFeeAed = hasFee
      ? parseFloat(String(viewingFeeRaw).replace(/,/g, ''))
      : null;
    const coverImageIndexRaw = req.body.coverImageIndex;
    const coverImageIndexParsed =
      coverImageIndexRaw !== undefined && coverImageIndexRaw !== null && String(coverImageIndexRaw).trim() !== ''
        ? parseInt(String(coverImageIndexRaw), 10)
        : null;
    const coverImageUrlRaw =
      req.body.coverImageUrl !== undefined && req.body.coverImageUrl !== null
        ? String(req.body.coverImageUrl).trim()
        : '';

    if (isSpecial && (!Number.isFinite(viewingFeeAed) || viewingFeeAed <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Special listings require a viewing fee greater than zero (AED).',
      });
    }

    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      // Use Cloudinary URLs (or fallback local URLs)
      imageUrls = req.cloudinaryUrls.slice(0, 7);
    }

    const desiredCoverIndex =
      (() => {
        const byUrl = findCoverIndexByUrl(imageUrls, coverImageUrlRaw);
        if (byUrl >= 0) return byUrl;
        if (Number.isInteger(coverImageIndexParsed) && coverImageIndexParsed >= 0) return coverImageIndexParsed;
        return 0;
      })();
    const normalizedImages = normalizeImageListWithCoverFirst(
      imageUrls,
      desiredCoverIndex
    );

    const newAsset = {
      name,
      type,
      quantity: parseInt(quantity) || 0,
      location,
      description,
      imageUrls: normalizedImages.imageUrls,
      isVisible,
      isSpecial,
      viewingFeeAed: isSpecial ? viewingFeeAed : null,
      coverImageIndex: normalizedImages.coverImageIndex,
      coverImageUrl: normalizedImages.coverImageUrl,
      // Property details
      price: price ? parseFloat(price) : null,
      compareAtPrice: (() => {
        if (compareAtPrice === undefined || compareAtPrice === '' || compareAtPrice === null) return null;
        const p = parseFloat(compareAtPrice);
        return Number.isFinite(p) ? p : null;
      })(),
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
      amenities: normalizeStringArray(amenities),
      features: normalizeStringArray(features),
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

    Object.assign(newAsset, pickListingExtensionsForCreate(req.body));

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
      compareAtPrice,
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
    const hasIsSpecial = bodyData.isSpecial !== undefined;
    const isSpecialBody = parseBoolean(bodyData.isSpecial, false);
    const rawFee = bodyData.viewingFeeAed;
    const hasViewingFee =
      rawFee !== undefined && rawFee !== null && String(rawFee).trim() !== '';
    const viewingFeeParsed = hasViewingFee ? parseFloat(String(rawFee).replace(/,/g, '')) : null;

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

    const existing = assetDoc.data();
    const finalIsSpecial = hasIsSpecial ? isSpecialBody : parseBoolean(existing.isSpecial, false);
    let finalViewingFeeAed = existing.viewingFeeAed;
    if (hasViewingFee && Number.isFinite(viewingFeeParsed)) {
      finalViewingFeeAed = viewingFeeParsed;
    }
    if (hasIsSpecial && !isSpecialBody) finalViewingFeeAed = null;

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
    if (compareAtPrice !== undefined) {
      if (compareAtPrice === '' || compareAtPrice === null) {
        updateData.compareAtPrice = null;
      } else {
        const p = parseFloat(compareAtPrice);
        updateData.compareAtPrice = Number.isFinite(p) ? p : null;
      }
    }
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
    if (amenities !== undefined) updateData.amenities = normalizeStringArray(amenities);
    if (features !== undefined) updateData.features = normalizeStringArray(features);
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
    if (developer !== undefined) updateData.developer = developer;
    if (completionStatus !== undefined) updateData.completionStatus = completionStatus;
    if (paymentPlan !== undefined) updateData.paymentPlan = paymentPlan;

    // Contact info
    if (agentName !== undefined) updateData.agentName = agentName;
    if (agentPhone !== undefined) updateData.agentPhone = agentPhone;
    if (agentEmail !== undefined) updateData.agentEmail = agentEmail;

    assignListingExtensionsForUpdate(updateData, bodyData);

    if (hasIsVisible) updateData.isVisible = isVisible;

    if (hasIsSpecial) updateData.isSpecial = finalIsSpecial;
    if (bodyData.coverImageIndex !== undefined) {
      const c = parseInt(String(bodyData.coverImageIndex), 10);
      updateData.coverImageIndex = Number.isInteger(c) && c >= 0 ? c : 0;
    }

    if (finalIsSpecial) {
      const feeNum = Number(finalViewingFeeAed);
      if (!Number.isFinite(feeNum) || feeNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Special listings require a viewing fee greater than zero (AED).',
        });
      }
      updateData.viewingFeeAed = feeNum;
    } else if (hasIsSpecial || hasViewingFee) {
      updateData.viewingFeeAed = null;
    }

    const currentImages = Array.isArray(existing.imageUrls) ? existing.imageUrls.map(normalizeImagePath) : [];
    const hasRetainedImageUrls = bodyData.retainedImageUrls !== undefined;
    const retainedImageUrls = hasRetainedImageUrls
      ? normalizeStringArray(bodyData.retainedImageUrls).map(normalizeImagePath)
      : currentImages;
    const retainedSet = new Set(retainedImageUrls);
    const orderedRetained = currentImages.filter((img) => retainedSet.has(img));

    if (hasRetainedImageUrls || (req.cloudinaryUrls && req.cloudinaryUrls.length > 0)) {
      const newImages = req.cloudinaryUrls && req.cloudinaryUrls.length > 0 ? req.cloudinaryUrls : [];
      updateData.imageUrls = [...orderedRetained, ...newImages].slice(0, 7);

      const removedImages = currentImages.filter((img) => !updateData.imageUrls.includes(img));
      for (const imageUrl of removedImages) {
        if (!imageUrl) continue;
        if (imageUrl.includes('cloudinary.com') && isCloudinaryConfigured()) {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            try {
              await deleteFromCloudinary(publicId);
            } catch (deleteError) {
              console.error(`❌ Failed to delete image from Cloudinary: ${publicId}`, deleteError);
            }
          }
        } else if (imageUrl.startsWith('/uploads/')) {
          const imagePath = path.join(__dirname, '../../public', imageUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }
    }

    if (updateData.imageUrls) {
      const byUrl = findCoverIndexByUrl(updateData.imageUrls, bodyData.coverImageUrl);
      const c = byUrl >= 0
        ? byUrl
        : Number.isInteger(updateData.coverImageIndex)
          ? updateData.coverImageIndex
          : Number.isInteger(existing.coverImageIndex)
            ? existing.coverImageIndex
            : 0;
      const normalized = normalizeImageListWithCoverFirst(updateData.imageUrls, c);
      updateData.imageUrls = normalized.imageUrls;
      updateData.coverImageIndex = normalized.coverImageIndex;
      updateData.coverImageUrl = normalized.coverImageUrl;
    } else if (bodyData.coverImageIndex !== undefined && Array.isArray(existing.imageUrls)) {
      const byUrl = findCoverIndexByUrl(existing.imageUrls, bodyData.coverImageUrl);
      const desired = byUrl >= 0 ? byUrl : updateData.coverImageIndex;
      const normalized = normalizeImageListWithCoverFirst(existing.imageUrls, desired);
      updateData.imageUrls = normalized.imageUrls;
      updateData.coverImageIndex = normalized.coverImageIndex;
      updateData.coverImageUrl = normalized.coverImageUrl;
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
