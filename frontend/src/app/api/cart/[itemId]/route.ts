import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const putSchema = z.object({
  quantity: z.number().min(1),
});

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const itemId = params.itemId;
  if (!itemId) return fail('شناسه نامعتبر');

  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId: payload.userId } } });
  if (!item) return fail('آیتم یافت نشد', 404);

  const updated = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: parsed.data.quantity } });
  return ok(updated);
});

export const DELETE = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const itemId = params.itemId;
  if (!itemId) return fail('شناسه نامعتبر');

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId: payload.userId } } });
  if (!item) return fail('آیتم یافت نشد', 404);

  await prisma.cartItem.delete({ where: { id: itemId } });
  return ok({ message: 'آیتم حذف شد' });
});
