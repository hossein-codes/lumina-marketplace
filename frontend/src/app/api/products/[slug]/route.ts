import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const slug = params.slug;
  if (!slug) return fail('پارامتر نامعتبر');

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });
  if (!product || !product.isActive) return fail('محصول یافت نشد', 404);
  return ok(product);
});

const putSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  stock: z.number().min(0).optional(),
  sku: z.string().min(1).optional(),
  thumbnail: z.string().url('آدرس نامعتبر').optional(),
  categoryId: z.string().min(1).optional(),
  brandId: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isNew: z.boolean().optional(),
  isFlashSale: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN', 'SELLER']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const slug = params.slug;
  if (!slug) return fail('پارامتر نامعتبر');

  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  if (parsed.data.slug) {
    const conflict = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
    if (conflict && conflict.slug !== slug) return fail('slug تکراری');
  }

  const product = await prisma.product.update({
    where: { slug },
    data: parsed.data,
    include: { category: true, brand: true },
  });
  return ok(product);
});

export const DELETE = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN', 'SELLER']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const slug = params.slug;
  if (!slug) return fail('پارامتر نامعتبر');

  await prisma.product.delete({ where: { slug } });
  return ok({ message: 'محصول حذف شد' });
});
