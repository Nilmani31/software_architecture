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
const validateRequest = require("../middleware/validateRequest");

// Officer auth
router.post(
  "/officer/register",
  validateRequest({ body: ["fullName", "badgeId", "email", "password", "phone", "district"] }),
  registerOfficer
);
router.post(
  "/officer/login",
  validateRequest({ body: ["email", "password"] }),
  loginOfficer
);

// Admin auth
router.post(
  "/admin/register",
  validateRequest({ body: ["name", "email", "password"] }),
  registerAdmin
);
router.post(
  "/admin/login",
  validateRequest({ body: ["email", "password"] }),
  loginAdmin
);

// Current user (protected)
router.get("/me", protect, getMe);

module.exports = router;
