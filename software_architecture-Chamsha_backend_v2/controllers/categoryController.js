const FineCategory = require("../models/FineCategory");

/**
 * GET /api/categories
 * Get all active fine categories (public - needed for payment lookup)
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await FineCategory.find({ isActive: true }).sort("categoryCode");
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories/:id
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await FineCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/categories
 * Admin only
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { categoryCode, name, description, amount } = req.body;

    if (!categoryCode || !name || amount === undefined) {
      return res.status(400).json({ message: "categoryCode, name, and amount are required" });
    }

    const category = await FineCategory.create({ categoryCode, name, description, amount });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/categories/:id
 * Admin only
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await FineCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/categories/:id
 * Admin only - soft delete
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await FineCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deactivated" });
  } catch (err) {
    next(err);
  }
};
