import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/server/prisma';
import { signToken } from '@/lib/server/auth';
import { handler, created, fail } from '@/lib/server/response';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email('ایمیل نامعتبر'),
  firstName: z.string().min(2, 'نام کوتاه است'),
  lastName: z.string().min(2, 'نام خانوادگی کوتاه است'),
  phone: z.string().optional(),
  password: z.string().min(6, 'رمز باید حداقل ۶ کاراکتر باشد'),
});

export const POST = handler(async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.errors[0].message);
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return fail('این ایمیل قبلاً ثبت شده است');

  const user = await prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      password: bcrypt.hashSync(data.password, 12),
      role: 'CUSTOMER',
    },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return created({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
});
