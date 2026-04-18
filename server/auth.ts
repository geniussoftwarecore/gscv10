import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IStorage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// All valid business roles
export type AppRole = 'admin' | 'manager' | 'sales' | 'support' | 'customer' | 'finance';

export const VALID_ROLES: AppRole[] = ['admin', 'manager', 'sales', 'support', 'customer', 'finance'];

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: AppRole;
  };
}

export function generateToken(user: { id: string; username: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string; username: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = {
    id: decoded.userId,
    username: decoded.username,
    role: decoded.role as AppRole
  };

  next();
}

/**
 * Middleware factory that restricts access to users whose role is in the
 * allowed list.  Accepts either a spread of role strings or a single array:
 *
 *   requireRole('admin', 'manager')
 *   requireRole(['admin', 'manager'])
 */
export function requireRole(roles: AppRole | AppRole[], ...rest: AppRole[]) {
  // Normalise: handle both requireRole('admin', 'sales') and requireRole(['admin', 'sales'])
  const allowedRoles: AppRole[] = Array.isArray(roles)
    ? roles
    : [roles, ...rest];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
}

export async function loginUser(
  username: string,
  password: string,
  storage: IStorage
): Promise<{ user: any; token: string } | null> {
  const user = await storage.getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isPasswordValid = await storage.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role || 'customer'
  });

  // Update last login time
  await storage.updateUser(user.id, { lastLoginAt: new Date() });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
}
