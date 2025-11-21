import { Router } from 'express';
import { AuthService } from '../services/authService';
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';
import { MagicLinkRequest, MagicLinkVerification, TotpVerification } from '../../shared/types/auth';
import { PasswordAuthService } from '../services/passwordAuthService';
import { Pool } from 'pg';

const router = Router();
const authService = new AuthService();

// Initialize password auth service with database connection
const getPasswordAuthService = () => {
  // Using environment variable for database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return new PasswordAuthService(pool);
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Debug logging
    console.log('Registration request:', { name, email, phone, hasPassword: !!password });
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name is required and must be at least 2 characters' });
    }
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // For now, we'll create the user and send a magic link for verification
    // In a real system, you'd save the user to the database first
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password // In production, hash this password
    };
    
    // Send magic link for email verification
    await authService.sendMagicLink(userData.email, '/dashboard');
    
    res.json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      email: userData.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially hide email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /api/auth/login-magic
router.post('/login-magic', async (req, res) => {
  try {
    const { email, redirectUrl } = req.body as MagicLinkRequest;
    
    // Debug logging
    console.log('Magic link request body:', req.body);
    console.log('Extracted email:', email, 'Type:', typeof email);
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log('Email validation failed:', { email, type: typeof email, hasAt: email && typeof email === 'string' ? email.includes('@') : 'N/A' });
      return res.status(400).json({ message: 'Valid email is required' });
    }

    await authService.sendMagicLink(email, redirectUrl);
    
    res.json({ 
      message: 'Magic link sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially hide email
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ message: 'Failed to send magic link' });
  }
});

// POST /api/auth/login-magic/verify
router.post('/login-magic/verify', async (req, res) => {
  try {
    const { token } = req.body as MagicLinkVerification;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const loginResponse = await authService.verifyMagicLink(token);
    
    res.json(loginResponse);
  } catch (error) {
    console.error('Magic link verification error:', error);
    res.status(400).json({ message: 'Invalid or expired magic link' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if trial has expired and update user accordingly
    if (authService.isTrialExpired(req.user)) {
      const updatedUser = await authService.updateUser(req.user.id, {
        subscription: {
          ...req.user.subscription!,
          plan: 'free',
          status: 'canceled',
        }
      });
      return res.json({ user: updatedUser });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user information' });
  }
});

// POST /api/auth/totp/setup
router.post('/totp/setup', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const totpSetup = await authService.setupTotp(req.user.id);
    
    res.json(totpSetup);
  } catch (error) {
    console.error('TOTP setup error:', error);
    res.status(500).json({ message: 'Failed to setup TOTP' });
  }
});

// POST /api/auth/totp/verify
router.post('/totp/verify', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { code } = req.body as TotpVerification;
    
    if (!code) {
      return res.status(400).json({ message: 'TOTP code is required' });
    }

    const verified = await authService.verifyTotp(req.user.id, code);
    
    if (verified) {
      res.json({ message: 'TOTP verified successfully', verified: true });
    } else {
      res.status(400).json({ message: 'Invalid TOTP code', verified: false });
    }
  } catch (error) {
    console.error('TOTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify TOTP' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    const passwordAuthService = getPasswordAuthService();
    const result = await passwordAuthService.changePassword(req.user.id, currentPassword, newPassword);

    if (result.success) {
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: result.error || 'Failed to change password' });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // In a real app, you might want to blacklist the JWT token
    // For now, we'll just return success since JWTs are stateless
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
});

export default router;