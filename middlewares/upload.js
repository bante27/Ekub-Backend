const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



// ✅ Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Ekub/kyc',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${req.user?.userId || 'user'}-${Date.now()}`,
    };
  },
});

// ✅ Create Multer Upload Instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;