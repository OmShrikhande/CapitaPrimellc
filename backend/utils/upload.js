const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { uploadToCloudinary, isCloudinaryConfigured } = require('./cloudinary');

// Ensure uploads directory exists (fallback for local storage)
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage - use memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for Cloudinary
  }
});

// Middleware to upload files to Cloudinary after multer processing
const uploadToCloudinaryMiddleware = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    // If Cloudinary is configured, upload files there
    if (isCloudinaryConfigured()) {
      console.log('☁️ Uploading files to Cloudinary...');

      const cloudinaryUrls = [];

      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            public_id: `property-${Date.now()}-${uuidv4()}`,
            folder: 'capita-properties'
          });

          cloudinaryUrls.push(result.secure_url);
          console.log(`✅ Uploaded ${file.originalname} to Cloudinary: ${result.secure_url}`);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${file.originalname} to Cloudinary:`, uploadError);
          // Continue with other files, don't fail the whole request
        }
      }

      // Store Cloudinary URLs in req.cloudinaryUrls
      req.cloudinaryUrls = cloudinaryUrls;
    } else {
      // Fallback to local storage if Cloudinary is not configured
      console.log('⚠️ Cloudinary not configured, falling back to local storage');

      const localUrls = [];
      for (const file of req.files) {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
        const filepath = path.join(uploadDir, filename);

        try {
          fs.writeFileSync(filepath, file.buffer);
          localUrls.push(`/uploads/${filename}`);
          console.log(`💾 Saved ${file.originalname} locally: ${filename}`);
        } catch (writeError) {
          console.error(`❌ Failed to save ${file.originalname} locally:`, writeError);
        }
      }

      req.cloudinaryUrls = localUrls; // Use same property name for consistency
    }

    next();
  } catch (error) {
    console.error('Upload middleware error:', error);
    next(error);
  }
};

module.exports = {
  upload,
  uploadToCloudinaryMiddleware
};
