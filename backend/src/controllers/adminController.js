const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.stats = async (req, res, next) => {
  try {
    const [users, products, orders, revenueAgg] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      }),
    ]);
    const revenue = revenueAgg._sum.totalAmount ? Number(revenueAgg._sum.totalAmount) : 0;

    const ordersByStatus = await prisma.order.groupBy({ by: ['status'], _count: { _all: true } });
    const topProducts = await prisma.product.findMany({
      orderBy: { reviewCount: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, thumbnail: true, price: true, rating: true, stock: true },
    });

    res.json({
      success: true,
      data: { users, products, orders, revenue, ordersByStatus, topProducts },
    });
  } catch (err) { next(err); }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ success: true, data: users, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(role && { role }), ...(typeof isActive === 'boolean' && { isActive }) },
      select: { id: true, email: true, role: true, isActive: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.listOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { email: true, firstName: true, lastName: true } }, items: true },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ success: true, data: orders, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingCode } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { ...(status && { status }), ...(trackingCode !== undefined && { trackingCode }) },
    });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
