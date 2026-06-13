const express = require("express");
const router = express.Router();
const {
  lookupFine,
  getFineByRef,
  issueFine,
  getFines,
  getFineById,
} = require("../controllers/fineController");
const { protect, authorize } = require("../middleware/auth");

// Public - lookup fine by ref + category (for payment screens)
router.get("/lookup", lookupFine);
router.get("/ref/:referenceNumber", getFineByRef);

// Protected
router.use(protect);

// Officer: issue fine
router.post("/", authorize("OFFICER"), issueFine);

// Officer (own) or Admin (all)
router.get("/", authorize("OFFICER", "ADMIN", "SUPER_ADMIN"), getFines);
router.get("/:id", authorize("OFFICER", "ADMIN", "SUPER_ADMIN"), getFineById);

module.exports = router;
