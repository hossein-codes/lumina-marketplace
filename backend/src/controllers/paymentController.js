const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPayment = async (req, res, next) => {
  try {
    const { orderId, amount, method, transactionId } = req.body;
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: parseFloat(amount),
        method: method || 'BANK_TRANSFER',
        status: 'PENDING',
        transactionId,
      },
      include: { order: true },
    });
    res.status(201).json({ success: true, data: payment });
  } catch (err) { next(err); }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED', updatedAt: new Date() },
      include: { order: true },
    });
    // Update order status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CONFIRMED' },
    });
    res.json({ success: true, data: payment });
  } catch (err) { next(err); }
};

exports.getPaymentByOrder = async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({ where: { orderId: req.params.orderId } });
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};
