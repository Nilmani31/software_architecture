const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const officerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    badgeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: "OFFICER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

officerSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 12).then((hashed) => {
      this.password = hashed;
      next();
    }).catch((err) => next(err));
  } else {
    next();
  }
});

officerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Officer", officerSchema);