const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    district: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "ADMIN",
      enum: ["ADMIN", "SUPER_ADMIN"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 12).then((hashed) => {
      this.password = hashed;
      next();
    }).catch((err) => next(err));
  } else {
    next();
  }
});

adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);