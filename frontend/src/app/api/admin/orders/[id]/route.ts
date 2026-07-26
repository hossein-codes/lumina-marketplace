import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const putSchema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']) });

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, user: true, shippingAddress: true, billingAddress: true } });
  if (!order) return fail('سفارش یافت نشد', 404);
  return ok(order);
});

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');
  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');
  const order = await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  return ok(order);
});
