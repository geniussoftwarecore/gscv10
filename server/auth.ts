import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DatabaseStorage } from './database-storage';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
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
    role: decoded.role
  };
  
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

export async function loginUser(username: string, password: string, storage: DatabaseStorage): Promise<{ user: any; token: string } | null> {
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
    role: user.role || 'client'
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