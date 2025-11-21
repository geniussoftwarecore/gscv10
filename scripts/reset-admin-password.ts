#!/usr/bin/env tsx

/**
 * GSC Admin Password Reset Script
 * 
 * Securely resets the admin user password with proper validation.
 * Can be used for emergency password recovery.
 */

import { config } from 'dotenv';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import * as readline from 'readline';

// Load environment variables
config();

// Import database and utilities
import { storage } from '../server/storage';
import { DatabaseStorage } from '../server/database-storage';
import { users } from '../shared/schema';
import { validatePassword, hashPassword } from './create-admin';

/**
 * Prompts for secure password input
 */
function promptPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Hide password input
    const stdin = process.stdin;
    stdin.setRawMode && stdin.setRawMode(true);
    
    let password = '';
    
    rl.question(question, () => {
      resolve(password);
    });
    
    stdin.on('data', (char) => {
      char = char.toString();
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode && stdin.setRawMode(false);
          rl.close();
          console.log();
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

/**
 * Gets admin username from environment or prompts
 */
function getAdminUsername(): string {
  const username = process.env.ADMIN_USERNAME;
  if (!username) {
    throw new Error('ADMIN_USERNAME must be set in environment variables');
  }
  return username;
}

/**
 * Resets admin password
 */
async function resetAdminPassword(): Promise<void> {
  try {
    console.log('🔄 Starting admin password reset...');
    
    // Get admin username
    const username = getAdminUsername();
    console.log(`📧 Admin email: ${username}`);
    
    // Initialize database connection
    console.log('🔌 Connecting to database...');
    if (!(storage.instance instanceof DatabaseStorage)) {
      throw new Error('Database connection required. Please ensure DATABASE_URL is configured.');
    }
    
    const dbStorage = storage.instance as DatabaseStorage;
    
    // Check if admin user exists
    console.log('👤 Looking for admin user...');
    const existingUser = await dbStorage.getUserByUsername(username);
    if (!existingUser) {
      throw new Error(`Admin user not found: ${username}`);
    }
    
    console.log(`✅ Found admin user: ${existingUser.firstName} ${existingUser.lastName}`);
    
    // Prompt for new password
    console.log('\n🔐 Please enter a new secure password:');
    const newPassword = await promptPassword('New Password: ');
    
    if (!newPassword || newPassword.length === 0) {
      throw new Error('Password cannot be empty');
    }
    
    // Confirm password
    const confirmPassword = await promptPassword('Confirm Password: ');
    
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // Validate password
    console.log('\n🔒 Validating password policy...');
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      console.error('❌ Password validation failed:');
      passwordErrors.forEach(error => console.error(`   • ${error}`));
      process.exit(1);
    }
    console.log('✅ Password meets security requirements');
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password in database
    console.log('💾 Updating password in database...');
    await dbStorage.db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
        passwordResetToken: null,
        passwordResetExpires: null
      })
      .where(eq(users.id, existingUser.id));
    
    // Verify update
    const updatedUser = await dbStorage.getUserByUsername(username);
    if (!updatedUser) {
      throw new Error('Failed to verify password update');
    }
    
    console.log('✅ Password reset completed successfully!');
    console.log(`👤 User: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`📅 Updated: ${updatedUser.updatedAt}`);
    
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    process.exit(1);
  }
}

/**
 * Non-interactive password reset (for automation)
 */
async function resetAdminPasswordNonInteractive(newPassword: string): Promise<void> {
  try {
    console.log('🔄 Starting non-interactive password reset...');
    
    const username = getAdminUsername();
    
    if (!(storage.instance instanceof DatabaseStorage)) {
      throw new Error('Database connection required. Please ensure DATABASE_URL is configured.');
    }
    
    const dbStorage = storage.instance as DatabaseStorage;
    
    const existingUser = await dbStorage.getUserByUsername(username);
    if (!existingUser) {
      throw new Error(`Admin user not found: ${username}`);
    }
    
    // Validate password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      throw new Error(`Password validation failed: ${passwordErrors.join(', ')}`);
    }
    
    // Hash and update password
    const hashedPassword = await hashPassword(newPassword);
    
    await dbStorage.db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
        passwordResetToken: null,
        passwordResetExpires: null
      })
      .where(eq(users.id, existingUser.id));
    
    console.log('✅ Password reset completed successfully (non-interactive)');
    
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════');
  console.log('🔑 GSC Admin Password Reset');
  console.log('═══════════════════════════════════════');
  
  const args = process.argv.slice(2);
  const newPassword = args[0];
  
  try {
    if (newPassword) {
      // Non-interactive mode
      await resetAdminPasswordNonInteractive(newPassword);
    } else {
      // Interactive mode
      await resetAdminPassword();
    }
    
    console.log('═══════════════════════════════════════');
    console.log('✅ Password reset completed successfully');
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.error('❌ Password reset failed');
    console.log('═══════════════════════════════════════');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { resetAdminPassword, resetAdminPasswordNonInteractive };