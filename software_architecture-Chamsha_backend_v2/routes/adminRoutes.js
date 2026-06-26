const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getDistrictAnalytics,
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getOfficers,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/analytics/district", getDistrictAnalytics);
router.get("/analytics/category", getCategoryAnalytics);
router.get("/analytics/monthly", getMonthlyAnalytics);
router.get("/officers", getOfficers);

module.exports = router;
