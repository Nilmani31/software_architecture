const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getDistrictAnalytics,
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getOfficers,
  registerOfficer,
  districtReport,
  categoryReport,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// Public endpoints
router.get("/district-report", districtReport);
router.get("/category-report", categoryReport);

// Protected routes
router.use(protect);
router.use(authorize("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/analytics/district", getDistrictAnalytics);
router.get("/analytics/category", getCategoryAnalytics);
router.get("/analytics/monthly", getMonthlyAnalytics);
router.get("/officers", getOfficers);
router.post("/officers", registerOfficer);

module.exports = router;