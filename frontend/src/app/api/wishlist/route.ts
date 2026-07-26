import { z } from 'zod';
import { handler, ok, created, fail } from '@/lib/server/response';
import { requireUser, currentUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const postSchema = z.object({
  productId: z.string().min(1),
});

export const GET = handler(async (req: Request) => {
  const payload = await currentUser(req);
  if (!payload) return ok([]);

  const list = await prisma.wishlistItem.findMany({
    where: { userId: payload.userId },
    include: { product: true },
  });
  return ok(list);
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const existing = await prisma.wishlistItem.findFirst({
    where: { userId: payload.userId, productId: parsed.data.productId },
  });
  if (existing) return fail('این محصول قبلاً در علاقه‌مندی‌ها اضافه شده');

  const item = await prisma.wishlistItem.create({
    data: { userId: payload.userId, productId: parsed.data.productId },
    include: { product: true },
  });
  return created(item);
});
