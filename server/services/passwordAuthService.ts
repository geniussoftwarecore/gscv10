import { Pool } from 'pg';
import { verifyPassword, hashPassword, validatePassword, PasswordValidationError } from '../security/password';
import { generateToken } from '../utils/jwt';
import { randomUUID } from 'crypto';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    force_password_change: boolean;
  };
  token?: string;
  forcePasswordChange?: boolean;
  error?: string;
}

export interface PasswordChangeResult {
  success: boolean;
  error?: string;
}

export class PasswordAuthService {
  constructor(private pool: Pool) {}

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const { email, password } = credentials;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    try {
      const client = await this.pool.connect();
      
      try {
        // Find user by email
        const userResult = await client.query(`
          SELECT id, email, name, role, password_hash, force_password_change, is_active
          FROM users 
          WHERE email = $1 AND is_active = true
        `, [email]);

        if (userResult.rows.length === 0) {
          return {
            success: false,
            error: 'Invalid email or password'
          };
        }

        const user = userResult.rows[0];

        // Check if user has a password_hash (new system)
        if (!user.password_hash) {
          return {
            success: false,
            error: 'Account requires password setup. Please contact administrator.'
          };
        }

        // Verify password using argon2
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
          return {
            success: false,
            error: 'Invalid email or password'
          };
        }

        // Update last login timestamp
        await client.query(`
          UPDATE users 
          SET last_login_at = NOW(), updated_at = NOW()
          WHERE id = $1
        `, [user.id]);

        const forcePasswordChange = user.force_password_change === true;

        // Generate JWT token with limited scope if password change required
        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }, forcePasswordChange);

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
            force_password_change: forcePasswordChange
          },
          token,
          forcePasswordChange
        };

      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication failed. Please try again.'
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<PasswordChangeResult> {
    try {
      // Validate new password
      validatePassword(newPassword);
    } catch (error) {
      if (error instanceof PasswordValidationError) {
        return {
          success: false,
          error: error.message
        };
      }
      throw error;
    }

    try {
      const client = await this.pool.connect();
      
      try {
        // Get current user data
        const userResult = await client.query(`
          SELECT id, password_hash
          FROM users 
          WHERE id = $1 AND is_active = true
        `, [userId]);

        if (userResult.rows.length === 0) {
          return {
            success: false,
            error: 'User not found'
          };
        }

        const user = userResult.rows[0];

        // Verify current password
        if (user.password_hash) {
          const isValidCurrentPassword = await verifyPassword(currentPassword, user.password_hash);
          if (!isValidCurrentPassword) {
            return {
              success: false,
              error: 'Current password is incorrect'
            };
          }
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update password and clear force_password_change flag
        await client.query(`
          UPDATE users 
          SET password_hash = $1, force_password_change = false, updated_at = NOW()
          WHERE id = $2
        `, [newPasswordHash, userId]);

        return {
          success: true
        };

      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Failed to change password. Please try again.'
      };
    }
  }

  /**
   * Reset password (admin function)
   */
  async resetPassword(email: string, newPassword: string, forceChange: boolean = true): Promise<PasswordChangeResult> {
    try {
      // Validate new password
      validatePassword(newPassword);
    } catch (error) {
      if (error instanceof PasswordValidationError) {
        return {
          success: false,
          error: error.message
        };
      }
      throw error;
    }

    try {
      const client = await this.pool.connect();
      
      try {
        // Check if user exists
        const userResult = await client.query(`
          SELECT id
          FROM users 
          WHERE email = $1
        `, [email]);

        if (userResult.rows.length === 0) {
          return {
            success: false,
            error: 'User not found'
          };
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update password and set force_password_change flag
        await client.query(`
          UPDATE users 
          SET password_hash = $1, force_password_change = $2, updated_at = NOW()
          WHERE email = $3
        `, [newPasswordHash, forceChange, email]);

        return {
          success: true
        };

      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'Failed to reset password. Please try again.'
      };
    }
  }

  /**
   * Get user by ID (for token validation)
   */
  async getUserById(userId: string) {
    try {
      const client = await this.pool.connect();
      
      try {
        const userResult = await client.query(`
          SELECT id, email, name, role, force_password_change, is_active
          FROM users 
          WHERE id = $1 AND is_active = true
        `, [userId]);

        if (userResult.rows.length === 0) {
          return null;
        }

        const user = userResult.rows[0];
        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role,
          force_password_change: user.force_password_change === true
        };

      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error('Get user error:', error);
      return null;
    }
  }
}