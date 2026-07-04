const Fine = require("../models/Fine");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Officer = require("../models/Officer");
const FineCategory = require("../models/FineCategory");

const withFinePopulation = (query) => {
  return query
    .populate("categoryId", "name categoryCode amount")
    .populate("vehicleId", "plateNumber vehicleType")
    .populate("driverId", "name licenseNumber")
    .populate("officerId", "name badgeNumber district phone");
};

const createHttpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const lookupFine = async (referenceNumber, categoryCode) => {
  if (!referenceNumber) {
    throw createHttpError("Reference number is required", 400);
  }

  if (categoryCode) {
    await FineCategory.findOne({ categoryCode: categoryCode.toUpperCase() });
  }

  const fine = await withFinePopulation(
    Fine.findOne({ referenceNumber: referenceNumber.toUpperCase() })
  );

  if (!fine) {
    throw createHttpError("Fine not found", 404);
  }

  return fine;
};

const getFineByReference = async (referenceNumber) => {
  const fine = await withFinePopulation(
    Fine.findOne({ referenceNumber: referenceNumber.toUpperCase() })
  );

  if (!fine) {
    throw createHttpError("Fine not found", 404);
  }

  return fine;
};

const issueFine = async (payload, officerId) => {
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
  } = payload;

  if (!plateNumber || !licenseNumber || !driverName || !categoryId) {
    throw createHttpError(
      "plateNumber, licenseNumber, driverName, and categoryId are required",
      400
    );
  }

  const category = await FineCategory.findById(categoryId);
  if (!category || !category.isActive) {
    throw createHttpError("Fine category not found", 404);
  }

  let driver = await Driver.findOne({ licenseNumber: licenseNumber.toUpperCase() });
  if (!driver) {
    driver = await Driver.create({
      name: driverName,
      licenseNumber: licenseNumber.toUpperCase(),
      phone: driverPhone,
    });
  }

  let vehicle = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() });
  if (!vehicle) {
    vehicle = await Vehicle.create({
      plateNumber: plateNumber.toUpperCase(),
      vehicleType: vehicleType || "CAR",
      driverId: driver._id,
    });
  }

  const officer = await Officer.findById(officerId);
  const fine = await Fine.create({
    vehicleId: vehicle._id,
    driverId: driver._id,
    categoryId,
    officerId,
    location,
    district: district || officer?.district,
    description,
  });

  await fine.populate([
    { path: "categoryId", select: "name categoryCode amount" },
    { path: "vehicleId", select: "plateNumber vehicleType" },
    { path: "driverId", select: "name licenseNumber" },
  ]);

  return fine;
};

const getFines = async ({ page = 1, limit = 20, isPaid, district, from, to }, user) => {
  const query = {};

  if (user.role === "OFFICER") {
    query.officerId = user.id;
  }

  if (isPaid !== undefined) query.isPaid = isPaid === "true";
  if (district) query.district = { $regex: district, $options: "i" };
  if (from || to) {
    query.issuedDate = {};
    if (from) query.issuedDate.$gte = new Date(from);
    if (to) query.issuedDate.$lte = new Date(to);
  }

  const total = await Fine.countDocuments(query);
  const fines = await withFinePopulation(
    Fine.find(query)
      .sort({ issuedDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
  );

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    fines,
  };
};

const getFineById = async (id, user) => {
  const fine = await Fine.findById(id)
    .populate("categoryId", "name categoryCode amount")
    .populate("vehicleId", "plateNumber vehicleType")
    .populate("driverId", "name licenseNumber phone")
    .populate("officerId", "name badgeNumber district phone");

  if (!fine) {
    throw createHttpError("Fine not found", 404);
  }

  if (user.role === "OFFICER" && String(fine.officerId._id) !== user.id) {
    throw createHttpError("Access denied", 403);
  }

  return fine;
};

module.exports = {
  lookupFine,
  getFineByReference,
  issueFine,
  getFines,
  getFineById,
};