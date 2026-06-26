const mongoose = require("mongoose");

const fineCategorySchema = new mongoose.Schema(
  {
    categoryCode: {
      type: String,
      required: [true, "Category code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Fine amount is required"],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FineCategory", fineCategorySchema);
