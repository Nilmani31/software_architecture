const jwt = require("jsonwebtoken");
const Officer = require("../models/Officer");
const Admin = require("../models/Admin");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// ─── OFFICER AUTH ─────────────────────────────────────────────

/**
 * POST /api/auth/officer/register
 * Register a new traffic officer (Admin only in production)
 */
exports.registerOfficer = async (req, res, next) => {
  try {
    const { name, badgeNumber, email, password, phone, district } = req.body;

    if (!name || !badgeNumber || !email || !password || !phone || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Officer.findOne({ $or: [{ email }, { badgeNumber }] });
    if (existing) {
      return res.status(400).json({ message: "Officer with this email or badge number already exists" });
    }

    const officer = await Officer.create({ name, badgeNumber, email, password, phone, district });

    res.status(201).json({
      message: "Officer registered successfully",
      officer: {
        id: officer._id,
        name: officer.name,
        badgeNumber: officer.badgeNumber,
        email: officer.email,
        district: officer.district,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/officer/login
 */
exports.loginOfficer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const officer = await Officer.findOne({ email });
    if (!officer || !(await officer.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!officer.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const token = generateToken(officer._id, "OFFICER");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: officer._id,
        name: officer.name,
        badgeNumber: officer.badgeNumber,
        email: officer.email,
        district: officer.district,
        role: "OFFICER",
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN AUTH ───────────────────────────────────────────────

/**
 * POST /api/auth/admin/register
 */
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, district } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const admin = await Admin.create({ name, email, password, district });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/admin/login
 */
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        district: admin.district,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns current logged-in user info
 */
exports.getMe = async (req, res, next) => {
  try {
    let user;
    if (req.user.role === "OFFICER") {
      user = await Officer.findById(req.user.id).select("-password");
    } else {
      user = await Admin.findById(req.user.id).select("-password");
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
