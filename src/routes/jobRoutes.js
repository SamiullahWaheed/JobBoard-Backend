const express = require("express");
const {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", requireAdmin, createJob);
router.put("/:id", requireAdmin, updateJob);
router.delete("/:id", requireAdmin, deleteJob);

module.exports = router;
