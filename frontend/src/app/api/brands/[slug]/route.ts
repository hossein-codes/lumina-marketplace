import { handler, ok, fail } from '@/lib/server/response';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const slug = params.slug;
  if (!slug) return fail('پارامتر نامعتبر');
  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: { products: { where: { isActive: true }, take: 20 } },
  });
  if (!brand || !brand.isActive) return fail('برند یافت نشد', 404);
  return ok(brand);
});
