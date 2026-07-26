import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { handler, ok, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'رمز جدید باید حداقل ۶ کاراکتر باشد'),
});

export const PUT = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.errors[0].message);

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return fail('کاربر یافت نشد', 404);

  const valid = bcrypt.compareSync(parsed.data.currentPassword, user.password);
  if (!valid) return fail('رمز فعلی اشتباه است');

  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: bcrypt.hashSync(parsed.data.newPassword, 12) },
  });

  return ok({ message: 'رمز با موفقیت تغییر کرد' });
});
