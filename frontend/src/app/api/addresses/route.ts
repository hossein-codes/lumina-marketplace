import { z } from 'zod';
import { handler, ok, created, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const postSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  street: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const GET = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const list = await prisma.address.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  });
  return ok(list);
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: payload.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const addr = await prisma.address.create({
    data: { ...parsed.data, userId: payload.userId, country: parsed.data.country || 'Iran' },
  });
  return created(addr);
});

export const DELETE = handler(async (req: Request) => {
  const payload = await requireUser(req);
  await prisma.address.deleteMany({ where: { userId: payload.userId } });
  return ok({ message: 'همه آدرس‌ها حذف شدند' });
});
