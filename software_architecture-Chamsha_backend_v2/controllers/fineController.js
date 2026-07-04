const fineService = require("../services/fineService");

/**
 * GET /api/fines/lookup?ref=TF-XXX&categoryCode=OVS
 * Public endpoint - look up a fine by reference number + optional category code
 * Used by both mobile app and web portal to fetch fine before payment
 */
exports.lookupFine = async (req, res, next) => {
  try {
    const { ref, categoryCode } = req.query;
    const fine = await fineService.lookupFine(ref, categoryCode);

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
    const fine = await fineService.getFineByReference(req.params.referenceNumber);

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
    const fine = await fineService.issueFine(req.body, req.user.id);

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
    const result = await fineService.getFines(req.query, req.user);
    res.json(result);
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
    const fine = await fineService.getFineById(req.params.id, req.user);

    res.json({ fine });
  } catch (err) {
    next(err);
  }
};
