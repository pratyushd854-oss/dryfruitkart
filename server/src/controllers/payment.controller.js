const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const simulatePayment = async (req, res, next) => {
  try {
    const { orderId, method, status } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required.' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const isSuccess = status === 'PAID' || status === 'SUCCESS';
    const finalStatus = isSuccess ? 'PAID' : 'FAILED';

    const updatedPayment = await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        status: finalStatus,
        method: method || 'UPI',
        transactionId: `TXN_${method || 'UPI'}_${Date.now()}`,
        paidAt: isSuccess ? new Date() : null,
      },
      create: {
        orderId: order.id,
        status: finalStatus,
        method: method || 'UPI',
        transactionId: `TXN_${method || 'UPI'}_${Date.now()}`,
        paidAt: isSuccess ? new Date() : null,
      },
    });

    if (isSuccess && order.status === 'PLACED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({
      message: isSuccess ? 'Payment confirmed successfully.' : 'Payment failed or cancelled.',
      payment: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  simulatePayment,
};
