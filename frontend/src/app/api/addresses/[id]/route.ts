import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const putSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2).optional(),
  street: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('شناسه نامعتبر');

  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const existing = await prisma.address.findFirst({ where: { id, userId: payload.userId } });
  if (!existing) return fail('آدرس یافت نشد', 404);

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: payload.userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: parsed.data,
  });
  return ok(updated);
});

export const DELETE = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  const payload = await requireUser(req);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('شناسه نامعتبر');

  const existing = await prisma.address.findFirst({ where: { id, userId: payload.userId } });
  if (!existing) return fail('آدرس یافت نشد', 404);

  await prisma.address.delete({ where: { id } });
  return ok({ message: 'آدرس حذف شد' });
});
