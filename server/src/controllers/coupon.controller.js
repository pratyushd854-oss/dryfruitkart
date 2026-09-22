const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code.' });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ message: 'Coupon code has expired.' });
    }

    const currentTotal = parseFloat(cartTotal) || 0;
    if (currentTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}. Add items worth ₹${(
          coupon.minOrderValue - currentTotal
        ).toFixed(0)} more!`,
      });
    }

    const discountAmount = Math.min(
      (currentTotal * coupon.discountPercent) / 100,
      coupon.maxDiscount
    );

    res.json({
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: Math.round(discountAmount),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true },
    });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
};
