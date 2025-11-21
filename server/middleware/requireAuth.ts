import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../../shared/types/auth';
import { type Role } from '../../shared/security/roles';

// Extended user interface for CRM context
interface CRMUser extends User {
  username?: string;
  teamId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CRMUser;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No valid authorization header' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    // In a real app, you'd fetch the full user from the database
    // For now, we'll create a minimal user object from the JWT payload
    const user: CRMUser = {
      id: payload.userId,
      email: payload.email,
      role: payload.role as any,
      username: payload.username,
      teamId: payload.teamId,
    };
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      
      const user: CRMUser = {
        id: payload.userId,
        email: payload.email,
        role: payload.role as any,
        username: payload.username,
        teamId: payload.teamId,
      };
      
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
}