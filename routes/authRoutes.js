const express = require("express");
const router = express.Router();
const {
  registerOfficer,
  loginOfficer,
  registerAdmin,
  loginAdmin,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Officer auth
router.post("/officer/register", registerOfficer);
router.post("/officer/login", loginOfficer);

// Admin auth
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Current user (protected)
router.get("/me", protect, getMe);

module.exports = router;
