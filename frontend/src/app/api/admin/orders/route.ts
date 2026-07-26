import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  await requireUser(req, ['ADMIN']);
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || undefined;
  const where = status ? { status: status as any } : {};
  const list = await prisma.order.findMany({
    where,
    include: { items: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return ok(list);
});
