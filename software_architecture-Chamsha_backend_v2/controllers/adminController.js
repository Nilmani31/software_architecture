const Fine = require("../models/Fine");
const Payment = require("../models/Payment");
const FineCategory = require("../models/FineCategory");
const Officer = require("../models/Officer");

exports.registerOfficer = async (req, res, next) => {
  try {
    const {
      fullName,
      badgeId,
      email,
      password,
      phone,
      district,
      status,
      rank,
      station,
      division,
    } = req.body;

    const name = fullName;
    const badgeNumber = badgeId;
    const isActive = status !== "Inactive" && status !== "Suspended" && status !== "Retired";

    if (!name || !badgeNumber || !email || !password || !phone || !district) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existing = await Officer.findOne({
      $or: [{ email }, { badgeNumber }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Officer already exists (email or badge number)",
      });
    }

    const officer = await Officer.create({
      name,
      badgeNumber,
      email,
      password,
      phone,
      district,
      isActive,
    });

    res.status(201).json({
      message: "Officer registered successfully",
      officer: {
        id: officer._id,
        name: officer.name,
        badgeNumber: officer.badgeNumber,
        email: officer.email,
        district: officer.district,
        phone: officer.phone,
        status: officer.isActive ? "Active" : "Inactive",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/dashboard
 * Overall summary stats
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalFines, paidFines, unpaidFines, totalPayments, topDistrictData] = await Promise.all([
      Fine.countDocuments(),
      Fine.countDocuments({ isPaid: true }),
      Fine.countDocuments({ isPaid: false }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Payment.aggregate([
        {
          $lookup: {
            from: "fines",
            localField: "fineId",
            foreignField: "_id",
            as: "fine",
          },
        },
        { $unwind: { path: "$fine", preserveNullAndEmptyArrays: true } },
        { $match: { "fine.district": { $ne: null, $exists: true } } },
        {
          $group: {
            _id: "$fine.district",
            totalCollected: { $sum: "$amount" },
          },
        },
        { $sort: { totalCollected: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const totalRevenue = totalPayments[0]?.total || 0;
    const topDistrict = topDistrictData[0]?._id || "-";

    res.json({
      summary: {
        totalFines,
        paidFines,
        unpaidFines,
        collectionRate: totalFines > 0 ? ((paidFines / totalFines) * 100).toFixed(2) : 0,
        totalRevenue,
        topDistrict,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/analytics/district
 * District-wise fine collection breakdown
 */
exports.getDistrictAnalytics = async (req, res, next) => {
  try {
    const districtStats = await Payment.aggregate([
      {
        $lookup: {
          from: "fines",
          localField: "fineId",
          foreignField: "_id",
          as: "fine",
        },
      },
      { $unwind: { path: "$fine", preserveNullAndEmptyArrays: true } },
      {
        $match: { "fine.district": { $ne: null, $exists: true } },
      },
      {
        $group: {
          _id: "$fine.district",
          totalCollected: { $sum: "$amount" },
          paymentCount: { $sum: 1 },
        },
      },
      { $sort: { totalCollected: -1 } },
    ]);

    const issuedPerDistrict = await Fine.aggregate([
      {
        $match: { district: { $ne: null, $exists: true } },
      },
      {
        $group: {
          _id: "$district",
          totalIssued: { $sum: 1 },
          totalPaid: { $sum: { $cond: ["$isPaid", 1, 0] } },
        },
      },
    ]);

    const districtMap = {};
    issuedPerDistrict.forEach((d) => {
      districtMap[d._id] = { totalIssued: d.totalIssued, totalPaid: d.totalPaid, totalCollected: 0, paymentCount: 0 };
    });
    districtStats.forEach((d) => {
      if (districtMap[d._id]) {
        districtMap[d._id].totalCollected = d.totalCollected;
        districtMap[d._id].paymentCount = d.paymentCount;
      } else {
        districtMap[d._id] = { totalIssued: 0, totalPaid: 0, totalCollected: d.totalCollected, paymentCount: d.paymentCount };
      }
    });

    const result = Object.entries(districtMap).map(([district, stats]) => ({
      district: district || "Unknown",
      ...stats,
    })).sort((a, b) => b.totalCollected - a.totalCollected);

    res.json({ districtAnalytics: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/analytics/category
 * Breakdown by fine category (both issued fines and payments)
 */
exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const allCategories = await FineCategory.find({ isActive: true }).select("_id name categoryCode amount");

    const paymentStats = await Payment.aggregate([
      {
        $lookup: {
          from: "fines",
          localField: "fineId",
          foreignField: "_id",
          as: "fine",
        },
      },
      { $unwind: { path: "$fine", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "finecategories",
          localField: "fine.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.name" },
          categoryCode: { $first: "$category.categoryCode" },
          fineAmount: { $first: "$category.amount" },
          totalCollected: { $sum: "$amount" },
          paymentCount: { $sum: 1 },
        },
      },
    ]);

    const issuedStats = await Fine.aggregate([
      { $match: { categoryId: { $ne: null } } },
      {
        $group: {
          _id: "$categoryId",
          fineCount: { $sum: 1 },
        },
      },
    ]);

    const categoryMap = {};
    allCategories.forEach((cat) => {
      if (!cat._id) return;
      categoryMap[cat._id.toString()] = {
        _id: cat._id,
        categoryName: cat.name,
        categoryCode: cat.categoryCode,
        fineAmount: cat.amount,
        totalCollected: 0,
        paymentCount: 0,
        fineCount: 0,
      };
    });

    paymentStats.forEach((s) => {
      if (!s._id) return;
      if (categoryMap[s._id.toString()]) {
        categoryMap[s._id.toString()].totalCollected = s.totalCollected;
        categoryMap[s._id.toString()].paymentCount = s.paymentCount;
      }
    });

    issuedStats.forEach((s) => {
      if (!s._id) return;
      if (categoryMap[s._id.toString()]) {
        categoryMap[s._id.toString()].fineCount = s.fineCount;
      } else if (s._id) {
        categoryMap[s._id.toString()] = {
          _id: s._id,
          categoryName: "Unknown",
          categoryCode: "UNK",
          fineAmount: 0,
          totalCollected: 0,
          paymentCount: 0,
          fineCount: s.fineCount,
        };
      }
    });

    const result = Object.values(categoryMap).sort((a, b) => b.totalCollected - a.totalCollected);

    res.json({ categoryAnalytics: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/analytics/monthly?year=2024
 * Monthly collection trend
 */
exports.getMonthlyAnalytics = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthly = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          status: "SUCCESS",
        },
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          totalCollected: { $sum: "$amount" },
          paymentCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const result = monthNames.map((name, i) => {
      const found = monthly.find((m) => m._id === i + 1);
      return {
        month: name,
        monthNumber: i + 1,
        totalCollected: found?.totalCollected || 0,
        paymentCount: found?.paymentCount || 0,
      };
    });

    res.json({ year, monthlyAnalytics: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/district-report
 * District-wise report for frontend PaymentLogs pages
 */
exports.districtReport = async (req, res, next) => {
  try {
    const result = await Fine.aggregate([
      { $match: { district: { $ne: null, $exists: true } } },
      {
        $lookup: {
          from: "finecategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
        {
          $group: {
            _id: "$district",
            count: { $sum: 1 },
            amount: { $sum: { $ifNull: ["$category.amount", 0] } },
          },
        },
      { $sort: { amount: -1 } },
    ]);

    const formatted = result.map((item) => ({
      name: item._id || "Unknown",
      count: item.count,
      amount: item.amount || 0,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/category-report
 * Public category report for frontend
 */
exports.categoryReport = async (req, res, next) => {
  try {
    const result = await FineCategory.aggregate([
      {
        $lookup: {
          from: "fines",
          localField: "_id",
          foreignField: "categoryId",
          as: "fines",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          categoryCode: 1,
          amount: 1,
          fineCount: { $size: "$fines" },
        },
      },
      { $sort: { fineCount: -1 } },
    ]);

    const formatted = result.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      categoryCode: cat.categoryCode,
      amount: cat.amount,
      fineCount: cat.fineCount,
      totalCollected: cat.fineCount * cat.amount,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/officers
 * List all officers (admin view)
 */
exports.getOfficers = async (req, res, next) => {
  try {
    const { district, page = 1, limit = 20 } = req.query;
    const query = {};
    if (district) query.district = { $regex: district, $options: "i" };

    const total = await Officer.countDocuments(query);
    const officers = await Officer.find(query)
      .select("-password")
      .sort("name")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), officers });
  } catch (err) {
    next(err);
  }
};