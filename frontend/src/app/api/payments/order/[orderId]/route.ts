import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const orderId = params.orderId;
  if (!orderId) return fail('پارامتر نامعتبر');

  const payments = await prisma.payment.findMany({
    where: { orderId, userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  });
  return ok(payments);
});
