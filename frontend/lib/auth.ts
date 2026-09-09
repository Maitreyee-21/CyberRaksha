import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { findUserById, UserRecord } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'cyberraksha-secure-production-key-2026-auth';
export const AUTH_COOKIE_NAME = 'cyberraksha_token';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

/**
 * Hash a plain text password using bcrypt with salt rounds = 10.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a plain text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for the authenticated user.
 */
export function signAuthToken(user: UserRecord): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode an existing JWT token.
 */
export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extract the current authenticated user from request cookies.
 */
export async function getCurrentUser(): Promise<Omit<UserRecord, 'passwordHash'> | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyAuthToken(token);
    if (!payload?.userId) return null;

    const user = await findUserById(payload.userId);
    if (!user) return null;

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}
