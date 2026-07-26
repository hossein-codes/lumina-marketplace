import { handler, ok, fail } from '@/lib/server/response';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const slug = params.slug;
  if (!slug) return fail('پارامتر نامعتبر');

  const cat = await prisma.category.findUnique({
    where: { slug },
    include: { children: true, products: { include: { brand: true } } },
  });
  if (!cat || !cat.isActive) return fail('دسته‌بندی یافت نشد', 404);
  return ok(cat);
});
