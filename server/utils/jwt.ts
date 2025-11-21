import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../../shared/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  mustChangePassword?: boolean;
  iat: number;
  exp: number;
}

export function generateToken(user: { id: string; email: string; role: string; name?: string }, mustChangePassword?: boolean): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    ...(mustChangePassword && { mustChangePassword: true })
  };
  
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function generateMagicLinkToken(email: string): string {
  return jwt.sign({ email, type: 'magic-link' }, JWT_SECRET, { expiresIn: '15m' });
}

export function verifyMagicLinkToken(token: string): { email: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.type !== 'magic-link') {
      throw new Error('Invalid token type');
    }
    return { email: payload.email };
  } catch (error) {
    throw new Error('Invalid or expired magic link token');
  }
}