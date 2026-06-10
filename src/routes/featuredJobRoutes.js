const express = require("express");
const { listFeaturedJobs } = require("../controllers/featuredJobController");

const router = express.Router();

router.get("/", listFeaturedJobs);

module.exports = router;
