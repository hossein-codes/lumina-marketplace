import { z } from 'zod';
import { handler, created, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const schema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const existing = await prisma.review.findFirst({
    where: { userId: payload.userId, productId: parsed.data.productId },
  });
  if (existing) return fail('شما قبلاً برای این محصول نظر ثبت کرده‌اید');

  const review = await prisma.review.create({
    data: {
      userId: payload.userId,
      productId: parsed.data.productId,
      rating: parsed.data.rating,
      comment: parsed.data.comment || '',
    },
    include: { user: true },
  });

  // Update product rating
  const reviews = await prisma.review.findMany({ where: { productId: parsed.data.productId } });
  const avg = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;
  await prisma.product.update({
    where: { id: parsed.data.productId },
    data: { rating: avg, reviewCount: reviews.length },
  });

  return created(review);
});
