const { uploadJobImage } = require("../config/cloudinary");

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Choose an image to upload." });
  }

  const result = await uploadJobImage(req.file.buffer);
  res.status(201).json({
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
  });
}

module.exports = { uploadImage };
