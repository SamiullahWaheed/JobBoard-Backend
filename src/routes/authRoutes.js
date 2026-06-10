const express = require("express");
const { login, me } = require("../controllers/authController");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAdmin, me);

module.exports = router;
