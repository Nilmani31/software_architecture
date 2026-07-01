const Fine = require("../models/Fine");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const FineCategory = require("../models/FineCategory");

/**
 * GET /api/fines/lookup?ref=TF-XXX&categoryCode=OVS
 * Public endpoint - look up a fine by reference number + optional category code
 * Used by both mobile app and web portal to fetch fine before payment
 */
exports.lookupFine = async (req, res, next) => {
  try {
    const { ref, categoryCode } = req.query;

    if (!ref) {
      return res.status(400).json({ message: "Reference number is required" });
    }

    const query = { referenceNumber: ref.toUpperCase() };

    // If categoryCode provided, validate it exists but don't require match
    let category = null;
    if (categoryCode) {
      category = await FineCategory.findOne({
        categoryCode: categoryCode.toUpperCase(),
      });
      // Don't fail if category not found - just proceed without category filter
    }

    const fine = await Fine.findOne(query)
      .populate("categoryId", "name categoryCode amount")
      .populate("vehicleId", "plateNumber vehicleType")
      .populate("driverId", "name licenseNumber")
      .populate("officerId", "name badgeNumber district");

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    res.json({
      fine: {
        id: fine._id,
        referenceNumber: fine.referenceNumber,
        isPaid: fine.isPaid,
        issuedDate: fine.issuedDate,
        dueDate: fine.dueDate,
        location: fine.location,
        district: fine.district,
        description: fine.description,
        category: fine.categoryId,
        vehicle: fine.vehicleId,
        driver: fine.driverId,
        officer: fine.officerId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/fines/ref/:referenceNumber
 * Public endpoint - look up a fine by reference number only
 */
exports.getFineByRef = async (req, res, next) => {
  try {
    const fine = await Fine.findOne({
      referenceNumber: req.params.referenceNumber.toUpperCase(),
    })
      .populate("categoryId", "name categoryCode amount")
      .populate("vehicleId", "plateNumber vehicleType")
      .populate("driverId", "name licenseNumber")
      .populate("officerId", "name badgeNumber district phone");

    if (!fine) return res.status(404).json({ message: "Fine not found" });

    res.json({ fine });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/fines
 * Officer only - issue a new fine
 */
exports.issueFine = async (req, res, next) => {
  try {
    const {
      plateNumber,
      vehicleType,
      driverName,
      licenseNumber,
      driverPhone,
      categoryId,
      location,
      district,
      description,
    } = req.body;

    if (!plateNumber || !licenseNumber || !driverName || !categoryId) {
      return res.status(400).json({
        message: "plateNumber, licenseNumber, driverName, and categoryId are required",
      });
    }

    // Verify category exists
    const category = await FineCategory.findById(categoryId);
    if (!category || !category.isActive) {
      return res.status(404).json({ message: "Fine category not found" });
    }

    // Find or create driver
    let driver = await Driver.findOne({ licenseNumber: licenseNumber.toUpperCase() });
    if (!driver) {
      driver = await Driver.create({
        name: driverName,
        licenseNumber: licenseNumber.toUpperCase(),
        phone: driverPhone,
      });
    }

    // Find or create vehicle
    let vehicle = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        plateNumber: plateNumber.toUpperCase(),
        vehicleType: vehicleType || "CAR",
        driverId: driver._id,
      });
    }

    const fine = await Fine.create({
      vehicleId: vehicle._id,
      driverId: driver._id,
      categoryId,
      officerId: req.user.id,
      location,
      district: district || (await require("../models/Officer").findById(req.user.id))?.district,
      description,
    });

    await fine.populate([
      { path: "categoryId", select: "name categoryCode amount" },
      { path: "vehicleId", select: "plateNumber vehicleType" },
      { path: "driverId", select: "name licenseNumber" },
    ]);

    res.status(201).json({
      message: "Fine issued successfully",
      fine: {
        id: fine._id,
        referenceNumber: fine.referenceNumber,
        category: fine.categoryId,
        vehicle: fine.vehicleId,
        driver: fine.driverId,
        issuedDate: fine.issuedDate,
        dueDate: fine.dueDate,
        location: fine.location,
        district: fine.district,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/fines
 * Officer: own fines | Admin: all fines with filters
 */
exports.getFines = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isPaid, district, from, to } = req.query;
    const query = {};

    if (req.user.role === "OFFICER") {
      query.officerId = req.user.id;
    }

    if (isPaid !== undefined) query.isPaid = isPaid === "true";
    if (district) query.district = { $regex: district, $options: "i" };
    if (from || to) {
      query.issuedDate = {};
      if (from) query.issuedDate.$gte = new Date(from);
      if (to) query.issuedDate.$lte = new Date(to);
    }

    const total = await Fine.countDocuments(query);
    const fines = await Fine.find(query)
      .populate("categoryId", "name categoryCode amount")
      .populate("vehicleId", "plateNumber vehicleType")
      .populate("driverId", "name licenseNumber")
      .populate("officerId", "name badgeNumber district")
      .sort({ issuedDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      fines,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/fines/:id
 * Officer or Admin
 */
exports.getFineById = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id)
      .populate("categoryId", "name categoryCode amount")
      .populate("vehicleId", "plateNumber vehicleType")
      .populate("driverId", "name licenseNumber phone")
      .populate("officerId", "name badgeNumber district phone");

    if (!fine) return res.status(404).json({ message: "Fine not found" });

    // Officers can only see their own fines
    if (req.user.role === "OFFICER" && String(fine.officerId._id) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ fine });
  } catch (err) {
    next(err);
  }
};
