import { z } from 'zod';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return fail('کاربر یافت نشد', 404);
  return ok(user);
});

const putSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export const PUT = handler(async (req: Request, context?: { params?: Promise<Record<string, string>> | undefined }) => {
  await requireUser(req, ['ADMIN']);
  const params = await (context?.params || Promise.resolve({} as Record<string, string>));
  const id = params.id;
  if (!id) return fail('پارامتر نامعتبر');
  const body = await req.json().catch(() => ({}));
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');
  const user = await prisma.user.update({ where: { id }, data: parsed.data });
  return ok(user);
});
