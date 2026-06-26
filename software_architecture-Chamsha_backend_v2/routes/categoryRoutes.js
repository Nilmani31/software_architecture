const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

// Public - get categories (needed for payment lookup dropdowns)
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin only
router.use(protect);
router.post("/", authorize("ADMIN", "SUPER_ADMIN"), createCategory);
router.put("/:id", authorize("ADMIN", "SUPER_ADMIN"), updateCategory);
router.delete("/:id", authorize("ADMIN", "SUPER_ADMIN"), deleteCategory);

module.exports = router;
