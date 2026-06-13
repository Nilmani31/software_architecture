const express = require("express");
const router = express.Router();
const {
  payFine,
  getAllPayments,
  getPaymentByTxn,
} = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

// Public - pay a fine (mobile app + web portal)
router.post("/pay", payFine);

// Protected
router.use(protect);

// Admin only - view all payments
router.get("/", authorize("ADMIN", "SUPER_ADMIN"), getAllPayments);
router.get("/:transactionId", authorize("ADMIN", "SUPER_ADMIN"), getPaymentByTxn);

module.exports = router;
