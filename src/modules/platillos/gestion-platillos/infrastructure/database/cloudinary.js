const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wasteless/platillos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('INVALID_IMAGE'), false);
    }
    cb(null, true);
  },
});

const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, deleteImage, cloudinary };