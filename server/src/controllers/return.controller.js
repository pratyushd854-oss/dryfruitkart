const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReturnRequest = async (req, res, next) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ message: 'OrderId and reason are required.' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { returnRequest: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only request returns for your own orders.' });
    }

    if (order.returnRequest) {
      return res.status(400).json({ message: 'A return request already exists for this order.' });
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        userId: req.user.id,
        reason,
        status: 'REQUESTED',
      },
    });

    res.status(201).json({
      message: 'Return request submitted successfully. Our team will review it shortly.',
      returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReturns = async (req, res, next) => {
  try {
    const returnRequests = await prisma.returnRequest.findMany({
      where: { userId: req.user.id },
      include: {
        order: {
          include: { items: { include: { product: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(returnRequests);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReturnRequest,
  getMyReturns,
};
