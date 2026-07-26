import { handler, ok } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  await requireUser(req, ['ADMIN']);
  const [users, products, orders, revenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
  ]);
  const ordersByStatus = await prisma.$queryRaw`SELECT status, count(*) FROM "Order" GROUP BY status`;
  const topProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { reviewCount: 'desc' },
    take: 5,
    include: { brand: true },
  });
  return ok({ users, products, orders, revenue: revenueResult._sum.amount || 0, ordersByStatus, topProducts });
});
