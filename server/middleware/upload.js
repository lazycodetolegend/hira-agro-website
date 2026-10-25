const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure absolute path pointing to server/uploads
const uploadDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const cleanExt = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${file.fieldname}-${Date.now()}${cleanExt}`);
  }
});

function checkFileType(file, cb) {
  const allowedExtensions = /\.(jpeg|jpg|png|webp|avif|jfif|gif|bmp)$/i;
  const isExtValid = allowedExtensions.test(path.extname(file.originalname));
  const isMimeValid = file.mimetype && (file.mimetype.startsWith('image/') || allowedExtensions.test(file.mimetype));

  if (isExtValid || isMimeValid) {
    return cb(null, true);
  } else {
    cb(new Error('Only valid image files (JPEG, JPG, PNG, WEBP, AVIF, GIF) are allowed!'));
  }
}

const multerInstance = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Wrap single upload to handle Multer errors gracefully with HTTP 400 instead of 500
const originalSingle = multerInstance.single.bind(multerInstance);
multerInstance.single = (fieldName) => (req, res, next) => {
  originalSingle(fieldName)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Image size exceeds 15MB limit. Please upload a smaller image.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'Invalid image file' });
    }
    next();
  });
};

module.exports = multerInstance;
