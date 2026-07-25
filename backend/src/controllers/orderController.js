const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddressId, billingAddressId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Fetch cart or items
    const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice || 0, totalPrice: (i.unitPrice || 0) * i.quantity }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.09; // 9% VAT
    const shippingCost = 0;
    const totalAmount = subtotal + taxAmount + shippingCost;

    const orderNumber = `ORD-${Date.now()}-${userId.slice(0, 8)}`;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        status: 'PENDING',
        subtotal,
        taxAmount,
        totalAmount,
        currency: 'IRR',
        shippingAddressId,
        billingAddressId,
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({ where: { userId: req.user.id }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { items: { include: { product: true } } } });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
