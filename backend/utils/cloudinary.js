const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME &&
           process.env.CLOUDINARY_API_KEY &&
           process.env.CLOUDINARY_API_SECRET);
};

// Upload image to Cloudinary
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new Error('Cloudinary is not configured. Please check your environment variables.');
    }

    const defaultOptions = {
      folder: 'capita-properties',
      // Avoid "auto" for format/quality because it can be rejected by Cloudinary upload transformations.
      // Let Cloudinary keep the original format and apply its defaults.
      resource_type: 'image',
      ...options
    };

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });

      stream.end(fileBuffer);
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!isCloudinaryConfigured()) {
      console.warn('Cloudinary not configured, skipping deletion');
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};

// Extract public ID from Cloudinary URL
const extractPublicId = (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
      return null;
    }

    // Extract public ID from URL like: https://res.cloudinary.com/{cloud_name}/image/upload/v123456789/{public_id}.{format}
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');

    if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
      return null;
    }

    // Get the part after 'upload' and before the version number
    const afterUpload = urlParts.slice(uploadIndex + 1);
    // Remove version (starts with 'v') and file extension
    const publicIdParts = afterUpload.filter(part => !part.startsWith('v') && !part.includes('.'));
    const publicId = publicIdParts.join('/');

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId
};