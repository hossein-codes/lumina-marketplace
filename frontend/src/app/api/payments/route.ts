import { z } from 'zod';
import { handler, created, fail } from '@/lib/server/response';
import { requireUser } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const schema = z.object({
  orderId: z.string().optional(),
  amount: z.number().positive(),
  method: z.enum(['CARD', 'BANK_TRANSFER', 'WALLET', 'CASH_ON_DELIVERY']),
  reference: z.string().optional(),
});

export const POST = handler(async (req: Request) => {
  const payload = await requireUser(req);
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail('داده نامعتبر');

  const payment = await prisma.payment.create({
    data: {
      userId: payload.userId,
      orderId: parsed.data.orderId || null,
      amount: parsed.data.amount,
      method: parsed.data.method,
      status: 'PENDING',
      reference: parsed.data.reference || null,
    },
  });
  return created(payment);
});
