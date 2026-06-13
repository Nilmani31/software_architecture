const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    fineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fine",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["CARD", "MOBILE", "ONLINE_BANKING"],
      required: true,
    },
    cardLastFour: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    paymentChannel: {
      type: String,
      enum: ["MOBILE_APP", "WEB_PORTAL"],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
    smsNotificationSent: {
      type: Boolean,
      default: false,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-generate transactionId
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `PAY-${ts}-${rand}`;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
