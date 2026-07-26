import { UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export const JWT_SECRET = process.env.JWT_SECRET || 'lumina-secret-key-2026-very-secure';

export type TokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function currentUser(req?: Request): Promise<TokenPayload | null> {
  const authHeader = req?.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.userId, isActive: true },
  });
  if (!user) return null;
  return payload;
}

export async function requireUser(req?: Request, roles?: string[]): Promise<TokenPayload> {
  const payload = await currentUser(req);
  if (!payload) {
    throw new Error('Unauthorized');
  }
  if (roles && roles.length > 0 && !roles.includes(payload.role)) {
    throw new Error('Forbidden');
  }
  return payload;
}
