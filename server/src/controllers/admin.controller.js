const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProducts = await prisma.product.count();

    const lowStockCount = await prisma.product.count({
      where: { stockKg: { lte: 5.0 } },
    });

    const paidOrders = await prisma.order.findMany({
      where: {
        payment: { status: 'PAID' },
      },
      select: { totalAmount: true, createdAt: true },
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Group sales by category
    const orderItems = await prisma.orderItem.findMany({
      include: { product: true },
    });

    const categorySalesMap = {};
    orderItems.forEach((item) => {
      const cat = item.product.category || 'Other';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.itemTotal;
    });

    const categorySales = Object.keys(categorySalesMap).map((key) => ({
      category: key,
      revenue: Math.round(categorySalesMap[key]),
    }));

    // Recent 5 orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: true,
        items: { include: { product: true } },
      },
    });

    const pendingReturnsCount = await prisma.returnRequest.count({
      where: { status: 'REQUESTED' },
    });

    res.json({
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockCount,
        pendingReturnsCount,
      },
      categorySales,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { shippingName: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: true } },
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'PLACED',
      'CONFIRMED',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'RETURNED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status specified.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        payment: true,
      },
    });

    // If marked delivered and COD was pending, update payment to PAID
    if (status === 'DELIVERED') {
      await prisma.payment.updateMany({
        where: { orderId: id, method: 'COD', status: 'PENDING' },
        data: { status: 'PAID', paidAt: new Date() },
      });
    }

    res.json({
      message: `Order status successfully updated to ${status}.`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReturns = async (req, res, next) => {
  try {
    const returns = await prisma.returnRequest.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        order: {
          include: {
            items: { include: { product: true } },
            payment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(returns);
  } catch (error) {
    next(error);
  }
};

const handleReturnRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // ReturnRequest ID
    const { status, adminNotes } = req.body; // APPROVED, REJECTED, REFUNDED

    const updated = await prisma.returnRequest.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || undefined,
      },
      include: { order: true },
    });

    if (status === 'REFUNDED') {
      await prisma.payment.updateMany({
        where: { orderId: updated.orderId },
        data: { status: 'REFUNDED' },
      });
      await prisma.order.update({
        where: { id: updated.orderId },
        data: { status: 'RETURNED' },
      });
    }

    res.json({
      message: `Return request marked as ${status}.`,
      returnRequest: updated,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerSummary = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      joinedAt: c.createdAt,
      totalOrders: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + o.totalAmount, 0),
    }));

    res.json(customerSummary);
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStock = await prisma.product.findMany({
      where: { stockKg: { lte: 5.0 } },
      orderBy: { stockKg: 'asc' },
    });

    res.json(lowStock);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllReturns,
  handleReturnRequest,
  getAllCustomers,
  getLowStockProducts,
};
