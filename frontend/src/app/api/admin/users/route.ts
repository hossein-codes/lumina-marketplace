import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  await requireUser(req, ['ADMIN']);
  const list = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return ok(list);
});
