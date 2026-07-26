import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/server/prisma';
import { signToken } from '@/lib/server/auth';
import { handler, ok, fail } from '@/lib/server/response';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email('ایمیل نامعتبر'),
  password: z.string().min(1, 'رمز الزامی است'),
});

export const POST = handler(async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.errors[0].message);
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email, isActive: true } });
  if (!user) return fail('ایمیل یا رمز اشتباه است');

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return fail('ایمیل یا رمز اشتباه است');

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return ok({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
});
