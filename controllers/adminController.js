const Fine = require("../models/Fine");
const Payment = require("../models/Payment");
const FineCategory = require("../models/FineCategory");
const Officer = require("../models/Officer");

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
        { $unwind: "$fine" },
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
      { $unwind: "$fine" },
      {
        $group: {
          _id: "$fine.district",
          totalCollected: { $sum: "$amount" },
          paymentCount: { $sum: 1 },
        },
      },
      { $sort: { totalCollected: -1 } },
    ]);

    // Issued (not just paid) per district
    const issuedPerDistrict = await Fine.aggregate([
      {
        $group: {
          _id: "$district",
          totalIssued: { $sum: 1 },
          totalPaid: { $sum: { $cond: ["$isPaid", 1, 0] } },
        },
      },
    ]);

    // Merge
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
 * Breakdown by fine category
 */
exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const categoryStats = await Payment.aggregate([
      {
        $lookup: {
          from: "fines",
          localField: "fineId",
          foreignField: "_id",
          as: "fine",
        },
      },
      { $unwind: "$fine" },
      {
        $lookup: {
          from: "finecategories",
          localField: "fine.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
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
      { $sort: { totalCollected: -1 } },
    ]);

    res.json({ categoryAnalytics: categoryStats });
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

    // Fill all 12 months
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
