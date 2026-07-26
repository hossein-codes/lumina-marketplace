import { handler, ok, fail } from '@/lib/server/response';
import { currentUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

export const GET = handler(async (req: Request) => {
  const payload = await currentUser(req);
  if (!payload) return fail('وارد نشده‌اید', 401);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId, isActive: true },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true },
  });
  if (!user) return fail('کاربر یافت نشد', 404);
  return ok(user);
});
