const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: [true, "Plate number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ["CAR", "MOTORCYCLE", "THREE_WHEEL", "VAN", "BUS", "TRUCK", "OTHER"],
      default: "CAR",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
