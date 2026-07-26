import { handler, ok } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const list = await prisma.review.findMany({
    where: { userId: payload.userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
  return ok(list);
});
