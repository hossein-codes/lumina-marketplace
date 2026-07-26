import { z } from 'zod';
import { handler, ok, created, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '12');
  const category = url.searchParams.get('category') || undefined;
  const brand = url.searchParams.get('brand') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const sort = url.searchParams.get('sort') || 'newest';

  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = { isActive: true };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (brand) {
    const br = await prisma.brand.findUnique({ where: { slug: brand } });
    if (br) where.brandId = br.id;
  }
  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }

  const orderBy: Record<string, string> = {};
  if (sort === 'price_asc') orderBy.price = 'asc';
  else if (sort === 'price_desc') orderBy.price = 'desc';
  else if (sort === 'rating') orderBy.rating = 'desc';
  else orderBy.createdAt = 'desc';

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { category: true, brand: true },
    }),
    prisma.product.count({ where }),
  ]);

  return ok({ items, total, page, limit });
});

const postSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().min(0),
  sku: z.string().min(1),
  thumbnail: z.string().url('آدرس نامعتبر'),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isNew: z.boolean().optional(),
  isFlashSale: z.boolean().optional(),
});

export const POST = handler(async (req: Request) => {
  await requireUser(req, ['ADMIN', 'SELLER']);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return fail('این slug قبلاً استفاده شده');

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      price: parsed.data.price,
      discountPercentage: null,
      images: parsed.data.images || [parsed.data.thumbnail],
      tags: parsed.data.tags || [],
      rating: null,
      reviewCount: 0,
      isActive: true,
    },
    include: { category: true, brand: true },
  });
  return created(product);
});
