const Payment = require("../models/Payment");
const Fine = require("../models/Fine");
const Officer = require("../models/Officer");
const { notifyOfficerPayment } = require("../services/smsService");

/**
 * POST /api/payments/pay
 * Public - Pay a fine (used by mobile app on-spot OR web portal)
 * Body: { referenceNumber, categoryCode, paymentMethod, cardNumber, cardExpiry, cardCVV, paymentChannel }
 */
exports.payFine = async (req, res, next) => {
  try {
    const {
      referenceNumber,
      categoryCode,
      paymentMethod,
      cardNumber,
      paymentChannel,
    } = req.body;

    if (!referenceNumber || !paymentMethod || !paymentChannel) {
      return res.status(400).json({
        message: "referenceNumber, paymentMethod, and paymentChannel are required",
      });
    }

    if (!["MOBILE_APP", "WEB_PORTAL"].includes(paymentChannel)) {
      return res.status(400).json({ message: "Invalid paymentChannel" });
    }

    if (!["CARD", "MOBILE", "ONLINE_BANKING"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid paymentMethod" });
    }

    // Lookup the fine
    const fine = await Fine.findOne({
      referenceNumber: referenceNumber.toUpperCase(),
    }).populate("categoryId officerId");

    if (!fine) {
      return res.status(404).json({ message: "Fine not found. Check the reference number." });
    }

    if (fine.isPaid) {
      return res.status(400).json({ message: "This fine has already been paid." });
    }

    // If categoryCode is provided, verify it matches
    if (categoryCode && fine.categoryId.categoryCode !== categoryCode.toUpperCase()) {
      return res.status(400).json({ message: "Fine category does not match." });
    }

    const amount = fine.categoryId.amount;

    // Extract last 4 digits of card if provided
    const cardLastFour = cardNumber
      ? String(cardNumber).replace(/\s/g, "").slice(-4)
      : undefined;

    // Create payment record
    const payment = await Payment.create({
      fineId: fine._id,
      amount,
      paymentMethod,
      cardLastFour,
      paymentChannel,
      status: "SUCCESS",
    });

    // Mark fine as paid
    fine.isPaid = true;
    await fine.save();

    // Send SMS to officer
    let smsSent = false;
    if (fine.officerId && fine.officerId.phone) {
      const smsResult = await notifyOfficerPayment(fine.officerId, fine, payment);
      smsSent = smsResult.success;

      // Update payment record with SMS status
      payment.smsNotificationSent = smsSent;
      await payment.save();
    }

    res.status(200).json({
      message: "Payment successful",
      payment: {
        transactionId: payment.transactionId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        status: payment.status,
      },
      fine: {
        referenceNumber: fine.referenceNumber,
        isPaid: fine.isPaid,
      },
      smsNotificationSent: smsSent,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments
 * Admin only - list all payments with filters
 */
exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, from, to, paymentChannel } = req.query;
    const query = {};

    if (paymentChannel) query.paymentChannel = paymentChannel;
    if (from || to) {
      query.paymentDate = {};
      if (from) query.paymentDate.$gte = new Date(from);
      if (to) query.paymentDate.$lte = new Date(to);
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate({
        path: "fineId",
        select: "referenceNumber district isPaid",
        populate: [
          { path: "categoryId", select: "name categoryCode" },
          { path: "officerId", select: "name badgeNumber district" },
          { path: "driverId", select: "name licenseNumber" },
        ],
      })
      .sort({ paymentDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), payments });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/:transactionId
 * Get payment by transaction ID
 */
exports.getPaymentByTxn = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
    }).populate({
      path: "fineId",
      populate: [
        { path: "categoryId", select: "name categoryCode amount" },
        { path: "driverId", select: "name licenseNumber" },
        { path: "officerId", select: "name badgeNumber district" },
      ],
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ payment });
  } catch (err) {
    next(err);
  }
};
