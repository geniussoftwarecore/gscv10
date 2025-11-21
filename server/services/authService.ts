import { Resend } from 'resend';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { generateMagicLinkToken, verifyMagicLinkToken, generateToken } from '../utils/jwt';
import { User, TotpSetup, LoginResponse } from '../../shared/types/auth';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.APP_URL || 'http://localhost:5000';
const MAIL_FROM = process.env.MAIL_FROM || 'noreply@gsc.com';

// In-memory user storage for development
// In production, this would be a database
const users: Map<string, User> = new Map();
const userSecrets: Map<string, string> = new Map();

export class AuthService {
  async sendMagicLink(email: string, redirectUrl?: string): Promise<void> {
    const token = generateMagicLinkToken(email);
    const magicLink = `${APP_URL}/auth/verify?token=${token}&redirect=${encodeURIComponent(redirectUrl || '/')}`;

    if (process.env.NODE_ENV === 'development' || !resend) {
      console.log(`Magic link for ${email}: ${magicLink}`);
      // In development or without Resend API key, we'll just log the magic link
      return;
    }

    // Send email via Resend
    await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: 'Sign in to Genius Software Core',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to your account</h2>
          <p>Click the button below to sign in to your Genius Software Core account:</p>
          <a href="${magicLink}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Sign In
          </a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  async verifyMagicLink(token: string): Promise<LoginResponse> {
    const { email } = verifyMagicLinkToken(token);
    
    let user = Array.from(users.values()).find(u => u.email === email);
    
    if (!user) {
      // Create new user with 14-day trial
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);
      
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        role: 'member',
        subscription: {
          plan: 'pro', // Start with pro trial
          status: 'trialing',
          trialEndsAt: trialEndsAt.toISOString(),
        },
        createdAt: new Date().toISOString(),
      };
      
      users.set(user.id, user);
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    users.set(user.id, user);

    const accessToken = generateToken(user);

    return {
      user,
      tokens: {
        accessToken,
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      },
    };
  }

  async setupTotp(userId: string): Promise<TotpSetup> {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `Genius Software Core (${user.email})`,
      issuer: 'Genius Software Core',
    });

    userSecrets.set(userId, secret.base32);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );

    return {
      secret: secret.base32,
      qrCode,
      backupCodes,
    };
  }

  async verifyTotp(userId: string, code: string): Promise<boolean> {
    const secret = userSecrets.get(userId);
    if (!secret) {
      throw new Error('TOTP not set up for this user');
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow 2 time steps of tolerance
    });

    if (verified) {
      const user = users.get(userId);
      if (user) {
        user.hasTotp = true;
        users.set(userId, user);
      }
    }

    return verified;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return users.get(userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(users.values()).find(u => u.email === email);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = { ...user, ...updates };
    users.set(userId, updatedUser);
    return updatedUser;
  }

  // Helper method to check if trial has expired
  isTrialExpired(user: User): boolean {
    if (!user.subscription || user.subscription.status !== 'trialing') {
      return false;
    }
    
    const trialEndsAt = user.subscription.trialEndsAt;
    return trialEndsAt ? new Date(trialEndsAt) < new Date() : false;
  }
}