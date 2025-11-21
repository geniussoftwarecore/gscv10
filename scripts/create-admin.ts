#!/usr/bin/env tsx

/**
 * GSC Admin User Provisioning Script
 * 
 * Creates or updates the primary admin user with secure password hashing.
 * Uses argon2 for password hashing with configurable security parameters.
 */

import { config } from 'dotenv';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

// Import database and schema
import { storage } from '../server/storage';
import { DatabaseStorage } from '../server/database-storage';
import { users } from '../shared/schema';

interface AdminConfig {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxRepeatingChars: number;
}

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxRepeatingChars: 3
};

const ARGON2_CONFIG = {
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536'),
  timeCost: parseInt(process.env.ARGON2_TIME_COST || '3'),
  parallelism: parseInt(process.env.ARGON2_PARALLELISM || '4'),
  hashLength: parseInt(process.env.ARGON2_HASH_LENGTH || '32'),
  type: argon2.argon2id
};

/**
 * Validates password against security policy
 */
function validatePassword(password: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): string[] {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for repeating characters
  if (policy.maxRepeatingChars > 0) {
    const repeatingRegex = new RegExp(`(.)\\1{${policy.maxRepeatingChars},}`);
    if (repeatingRegex.test(password)) {
      errors.push(`Password cannot have more than ${policy.maxRepeatingChars} repeating characters`);
    }
  }

  // Additional security checks
  const commonPasswords = ['password', '123456', 'admin', 'qwerty', 'abc123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password cannot contain common words or patterns');
  }

  return errors;
}

/**
 * Securely hashes password using argon2
 */
async function hashPassword(password: string): Promise<string> {
  try {
    console.log('🔐 Hashing password with argon2id...');
    const hash = await argon2.hash(password, ARGON2_CONFIG);
    console.log('✅ Password hashed successfully');
    return hash;
  } catch (error) {
    console.error('❌ Failed to hash password:', error);
    throw new Error('Password hashing failed');
  }
}

/**
 * Gets admin configuration from environment or prompts
 */
function getAdminConfig(): AdminConfig {
  const config: AdminConfig = {
    username: process.env.ADMIN_USERNAME || 'admin@geniussoftwarecore.com',
    password: process.env.ADMIN_PASSWORD || '',
    firstName: process.env.ADMIN_FIRST_NAME || 'Administrator',
    lastName: process.env.ADMIN_LAST_NAME || 'GSC',
    role: (process.env.ADMIN_ROLE as 'admin' | 'super_admin') || 'admin'
  };

  // Validate required fields
  if (!config.username || !config.password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables');
  }

  if (!config.username.includes('@')) {
    throw new Error('ADMIN_USERNAME must be a valid email address');
  }

  return config;
}

/**
 * Creates or updates admin user
 */
async function createAdminUser(): Promise<void> {
  try {
    console.log('🚀 Starting admin user provisioning...');
    
    // Get configuration
    const adminConfig = getAdminConfig();
    console.log(`📧 Admin email: ${adminConfig.username}`);
    
    // Validate password
    console.log('🔒 Validating password policy...');
    const passwordErrors = validatePassword(adminConfig.password);
    if (passwordErrors.length > 0) {
      console.error('❌ Password validation failed:');
      passwordErrors.forEach(error => console.error(`   • ${error}`));
      process.exit(1);
    }
    console.log('✅ Password meets security requirements');
    
    // Hash password
    const hashedPassword = await hashPassword(adminConfig.password);
    
    // Initialize database connection
    console.log('🔌 Connecting to database...');
    if (!(storage.instance instanceof DatabaseStorage)) {
      throw new Error('Database connection required. Please ensure DATABASE_URL is configured.');
    }
    
    const dbStorage = storage.instance as DatabaseStorage;
    
    // Check if admin user exists
    console.log('👤 Checking for existing admin user...');
    const existingUser = await dbStorage.getUserByUsername(adminConfig.username);
    
    const userData = {
      id: existingUser?.id || uuidv4(),
      username: adminConfig.username,
      password: hashedPassword,
      role: adminConfig.role,
      firstName: adminConfig.firstName,
      lastName: adminConfig.lastName,
      isActive: true,
      isEmailVerified: true,
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      emailVerificationToken: null,
      twoFactorSecret: null,
      isTwoFactorEnabled: false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    if (existingUser) {
      // Update existing admin user
      console.log('♻️  Updating existing admin user...');
      await dbStorage.db
        .update(users)
        .set({
          password: hashedPassword,
          role: adminConfig.role,
          firstName: adminConfig.firstName,
          lastName: adminConfig.lastName,
          updatedAt: new Date()
        })
        .where(eq(users.id, existingUser.id));
      
      console.log('✅ Admin user updated successfully');
    } else {
      // Create new admin user
      console.log('🆕 Creating new admin user...');
      await dbStorage.createUser(userData);
      console.log('✅ Admin user created successfully');
    }
    
    // Verify the user was created/updated
    const verifyUser = await dbStorage.getUserByUsername(adminConfig.username);
    if (!verifyUser) {
      throw new Error('Failed to create/update admin user');
    }
    
    console.log('🎉 Admin provisioning completed successfully!');
    console.log(`👤 Username: ${adminConfig.username}`);
    console.log(`🛡️  Role: ${adminConfig.role}`);
    console.log(`📅 Last Updated: ${verifyUser.updatedAt}`);
    
  } catch (error) {
    console.error('❌ Admin provisioning failed:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════');
  console.log('🏗️  GSC Admin User Provisioning');
  console.log('═══════════════════════════════════════');
  
  try {
    await createAdminUser();
    console.log('═══════════════════════════════════════');
    console.log('✅ Provisioning completed successfully');
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.error('❌ Provisioning failed');
    console.log('═══════════════════════════════════════');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { createAdminUser, validatePassword, hashPassword };