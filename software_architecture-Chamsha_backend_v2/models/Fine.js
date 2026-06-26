const mongoose = require("mongoose");
const { v4: uuidv4 } = require("crypto");

const fineSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      unique: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FineCategory",
      required: true,
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate referenceNumber before saving
fineSchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referenceNumber = `TF-${timestamp}-${random}`;
  }
  if (!this.dueDate) {
    const due = new Date(this.issuedDate || Date.now());
    due.setDate(due.getDate() + 30); // 30 days to pay
    this.dueDate = due;
  }
  next();
});

module.exports = mongoose.model("Fine", fineSchema);
