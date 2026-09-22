const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingPincode,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty.' });
    }

    if (!shippingName || !shippingAddress || !shippingCity || !shippingPincode) {
      return res.status(400).json({ message: 'Complete shipping details are required.' });
    }

    // Calculate item totals & verify products exist
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ message: `Product not found for ID: ${item.productId}` });
      }

      // Quantity weight (e.g. 0.25kg, 0.5kg, 1kg) * item.quantity
      const variantWeight = parseFloat(item.weightKg) || 1.0;
      const quantityUnits = parseInt(item.quantity) || 1;
      const totalWeightKg = variantWeight * quantityUnits;

      const unitPrice = (product.pricePerKg * variantWeight);
      const itemTotal = unitPrice * quantityUnits;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        variantLabel: item.variantLabel || `${variantWeight * 1000}g`,
        quantityKg: totalWeightKg,
        price: unitPrice,
        itemTotal: itemTotal,
      });

      // Decrement product stock
      const updatedStock = Math.max(0, product.stockKg - totalWeightKg);
      await prisma.product.update({
        where: { id: product.id },
        data: { stockKg: updatedStock },
      });
    }

    // Coupon discount logic
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && new Date(coupon.validUntil) > new Date()) {
        if (subtotal >= coupon.minOrderValue) {
          const rawDiscount = (subtotal * coupon.discountPercent) / 100;
          discountAmount = Math.min(rawDiscount, coupon.maxDiscount);
        }
      }
    }

    const deliveryFee = subtotal > 999 ? 0 : 70;
    const totalAmount = Math.round(subtotal - discountAmount + deliveryFee);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        discountAmount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        status: 'PLACED',
        shippingName,
        shippingPhone: shippingPhone || req.user.phone || '',
        shippingAddress,
        shippingCity,
        shippingPincode,
        items: {
          create: orderItemsData,
        },
        payment: {
          create: {
            method: paymentMethod || 'COD',
            status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
            transactionId:
              paymentMethod === 'COD'
                ? `COD_${Date.now()}`
                : `TXN_${paymentMethod}_${Date.now()}`,
            paidAt: paymentMethod === 'COD' ? null : new Date(),
          },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
        returnRequest: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
        returnRequest: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Customer can only view their own order unless admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to view this order.' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
