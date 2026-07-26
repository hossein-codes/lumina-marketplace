import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');

  const payment = await prisma.payment.findFirst({ where: { id, userId: payload.userId } });
  if (!payment) return fail('پرداخت یافت نشد', 404);

  const updated = await prisma.payment.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });

  if (updated.orderId) {
    await prisma.order.update({
      where: { id: updated.orderId },
      data: { status: 'CONFIRMED' },
    });
  }

  return ok(updated);
});
