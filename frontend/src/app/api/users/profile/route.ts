import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser, currentUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const putSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export const GET = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true },
  });
  if (!user) return fail('کاربر یافت نشد', 404);
  return ok(user);
});

export const PUT = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: parsed.data,
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
  });
  return ok(user);
});
