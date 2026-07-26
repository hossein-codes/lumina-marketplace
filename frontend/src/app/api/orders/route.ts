import { z } from 'zod';
import { handler, ok, created, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const list = await prisma.order.findMany({
    where: { userId: payload.userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return ok(list);
});

const postSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    title: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    thumbnail: z.string(),
  })).min(1),
  shippingAddressId: z.string().optional(),
  billingAddressId: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'WALLET', 'CASH_ON_DELIVERY']),
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  const order = await prisma.$transaction(async (tx: any) => {
    const ord = await tx.order.create({
      data: {
        userId: payload.userId,
        status: 'PENDING',
        shippingAddressId: parsed.data.shippingAddressId || null,
        billingAddressId: parsed.data.billingAddressId || null,
        subtotal,
        tax,
        total,
        items: {
          create: parsed.data.items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
          })),
        },
      },
      include: { items: true },
    });

    await tx.payment.create({
      data: {
        userId: payload.userId,
        orderId: ord.id,
        method: parsed.data.paymentMethod,
        amount: total,
        status: 'PENDING',
      },
    });

    await tx.cartItem.deleteMany({ where: { cart: { userId: payload.userId }, productId: { in: parsed.data.items.map(i => i.productId) } } });
    return ord;
  });

  return created(order);
});
