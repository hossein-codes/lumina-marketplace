import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');

  const order = await prisma.order.findFirst({
    where: { id, userId: payload.userId },
    include: { items: true, shippingAddress: true, billingAddress: true },
  });
  if (!order) return fail('سفارش یافت نشد', 404);
  return ok(order);
});
