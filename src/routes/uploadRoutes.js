const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const requireAdmin = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/job-image", requireAdmin, upload.single("image"), uploadImage);

module.exports = router;
