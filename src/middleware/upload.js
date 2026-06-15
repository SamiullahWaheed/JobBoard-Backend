const multer = require("multer");

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, WebP, and GIF images are allowed.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

module.exports = upload;
