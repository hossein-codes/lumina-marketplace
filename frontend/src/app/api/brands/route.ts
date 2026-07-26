import { handler, ok } from '@/lib/server/response';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async () => {
  const list = await prisma.brand.findMany({ where: { isActive: true } });
  return ok(list);
});
