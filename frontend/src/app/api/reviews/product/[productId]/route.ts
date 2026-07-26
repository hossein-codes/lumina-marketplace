import { handler, ok, fail } from '@/lib/server/response';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const productId = params.productId;
  if (!productId) return fail('پارامتر نامعتبر');

  const list = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return ok(list);
});
