import { handler, ok } from '@/lib/server/response';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async () => {
  const list = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: { children: true },
  });
  return ok(list);
});
