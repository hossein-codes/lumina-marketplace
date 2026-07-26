import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const DELETE = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const productId = params.productId;
  if (!productId) return fail('پارامتر نامعتبر');

  const item = await prisma.wishlistItem.findFirst({
    where: { userId: payload.userId, productId },
  });
  if (!item) return fail('آیتم یافت نشد', 404);

  await prisma.wishlistItem.delete({ where: { id: item.id } });
  return ok({ message: 'از علاقه‌مندی‌ها حذف شد' });
});
