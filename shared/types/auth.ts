import { Subscription } from './billing';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  hasTotp?: boolean;
  webauthnRegistered?: boolean;
  subscription?: Subscription;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

export interface MagicLinkVerification {
  token: string;
}

export interface TotpSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TotpVerification {
  code: string;
}

export interface RegisterRequest {
  email: string;
  name?: string;
  password?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requiresTwoFactor?: boolean;
}

export interface WebAuthnCredential {
  id: string;
  publicKey: string;
  counter: number;
  name?: string;
}