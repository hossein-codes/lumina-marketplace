import { z } from 'zod';
import { handler, ok, created, fail } from '@/lib/server/response';
import { requireUser, currentUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const postSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1).optional(),
});

export const GET = handler(async (req: Request) => {
  const payload = await currentUser(req);
  if (!payload) {
    return ok({ items: [], count: 0, subtotal: 0 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: payload.userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) return ok({ items: [], count: 0, subtotal: 0 });
  return ok(cart);
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  let cart = await prisma.cart.findUnique({ where: { userId: payload.userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: payload.userId } });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: parsed.data.productId },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (parsed.data.quantity || 1) },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: parsed.data.productId, quantity: parsed.data.quantity || 1 },
    });
  }

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
  return created(updated);
});

export const DELETE = handler(async (req: Request) => {
  const payload = await requireUser(req);
  await prisma.cartItem.deleteMany({ where: { cart: { userId: payload.userId } } });
  return ok({ message: 'سبد خرید خالی شد' });
});
