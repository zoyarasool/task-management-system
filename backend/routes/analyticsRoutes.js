const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getOverview, getTrends } = require("../controllers/analyticsController");

// GET ANALYTICS OVERVIEW
router.get("/overview", protect, getOverview);

// GET ANALYTICS TRENDS
router.get("/trends", protect, getTrends);

module.exports = router;