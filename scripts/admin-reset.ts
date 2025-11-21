#!/usr/bin/env tsx

import { Pool } from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashPassword, validatePassword, PasswordValidationError } from '../server/security/password';

dotenv.config();

interface ResetAdminOptions {
  email?: string;
  password?: string;
  forceChange?: boolean;
}

function parseArgs(): ResetAdminOptions {
  const args = process.argv.slice(2);
  const options: ResetAdminOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--email':
        options.email = args[++i];
        break;
      case '--password':
        options.password = args[++i];
        break;
      case '--forceChange':
        options.forceChange = true;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
    }
  }
  
  return options;
}

function printUsage() {
  console.log(chalk.bold.blue('\n🔄 GSC Admin Password Reset Tool\n'));
  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  npm run admin:reset [options]'));
  console.log(chalk.gray('  pnpm admin:reset [options]\n'));
  console.log(chalk.white('Options:'));
  console.log(chalk.gray('  --email <email>           Admin email address (required)'));
  console.log(chalk.gray('  --password <password>     New admin password (required)'));
  console.log(chalk.gray('  --forceChange             Force password change on next login'));
  console.log(chalk.gray('  --help, -h                Show this help message\n'));
  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  npm run admin:reset --email admin@company.com --password "N3w!StrongPass" --forceChange'));
  console.log(chalk.gray('  pnpm admin:reset --email admin@domain.com --password "S3cure!P@ss2024"'));
}

async function resetAdminPassword(): Promise<void> {
  const options = parseArgs();
  
  const adminEmail = options.email;
  const newPassword = options.password;
  const forceChange = options.forceChange || false;

  if (!adminEmail || !newPassword) {
    console.error(chalk.red('❌ Missing required parameters'));
    console.log(chalk.yellow('\nRequired: --email and --password'));
    printUsage();
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(adminEmail)) {
    console.error(chalk.red('❌ Invalid email format'));
    console.log(chalk.yellow('Please provide a valid email address (e.g., admin@yourdomain.com)'));
    process.exit(1);
  }

  // Validate password strength
  try {
    validatePassword(newPassword);
  } catch (error) {
    if (error instanceof PasswordValidationError) {
      console.error(chalk.red(`❌ ${error.message}`));
      console.log(chalk.yellow('\nPassword requirements:'));
      error.suggestions.forEach(suggestion => {
        console.log(chalk.gray(`  • ${suggestion}`));
      });
      process.exit(1);
    }
    throw error;
  }

  if (!process.env.DATABASE_URL) {
    console.error(chalk.red('❌ DATABASE_URL environment variable is required'));
    console.log(chalk.yellow('Please set DATABASE_URL in your .env file or environment'));
    process.exit(1);
  }

  console.log(chalk.bold.blue('\n🔄 Resetting Admin Password\n'));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let client;
  
  try {
    client = await pool.connect();
    
    // Test database connection
    try {
      await client.query('SELECT 1');
    } catch (dbError: any) {
      console.error(chalk.red('❌ Database connection failed'));
      console.log(chalk.yellow('Please ensure your database is running and DATABASE_URL is correct'));
      process.exit(1);
    }
    
    // Check if admin with this email exists
    const existingUser = await client.query(
      'SELECT id, email, role, name FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingUser.rows.length === 0) {
      console.error(chalk.red(`❌ No user found with email: ${adminEmail}`));
      console.log(chalk.yellow('Please verify the email address or create the admin user first'));
      process.exit(1);
    }

    const user = existingUser.rows[0];
    
    if (user.role !== 'admin') {
      console.log(chalk.yellow(`⚠️  User ${adminEmail} is not an admin (role: ${user.role})`));
      console.log(chalk.blue('🔄 Promoting user to admin role...'));
    }

    // Hash the password securely with Argon2
    console.log(chalk.blue('🔒 Hashing new password with Argon2...'));
    const hashedPassword = await hashPassword(newPassword);

    const now = new Date();

    // Update user's password and ensure admin role
    await client.query(`
      UPDATE users 
      SET password_hash = $1, role = 'admin', updated_at = $2, force_password_change = $3
      WHERE email = $4
    `, [hashedPassword, now, forceChange ? 'true' : 'false', adminEmail]);
    
    // Create password reset notification
    try {
      const notificationId = require('crypto').randomUUID();
      await client.query(`
        INSERT INTO notifications (id, user_id, title, message, type, category, created_at)
        VALUES ($1, $2, $3, $4, 'general', 'security', $5)
      `, [
        notificationId,
        user.id,
        'Password Reset Completed',
        forceChange 
          ? 'Your password has been reset. You must change it again on next login.'
          : 'Your password has been reset successfully. Please log in with your new password.',
        now
      ]);
    } catch (notifError) {
      // Notification creation is not critical, continue without failing
      console.log(chalk.yellow('⚠️  Could not create reset notification (non-critical)'));
    }

    // Print success message
    console.log(chalk.bold.green('\n🎉 PASSWORD RESET SUCCESSFUL!\n'));
    console.log(chalk.blue('Reset details:'));
    console.log(chalk.white(`  Email: ${adminEmail}`));
    console.log(chalk.white(`  Name: ${user.name || 'Not specified'}`));
    console.log(chalk.white(`  Role: admin`));
    console.log(chalk.white(`  Force Password Change: ${forceChange ? 'Yes' : 'No'}`));
    console.log(chalk.white(`  Reset Time: ${now.toISOString()}`));
    
    console.log(chalk.bold.yellow('\n⚡ IMPORTANT NEXT STEPS:\n'));
    console.log(chalk.yellow('1. Log in to the admin panel with the new password'));
    if (forceChange) {
      console.log(chalk.yellow('2. You will be required to change the password again on login'));
    } else {
      console.log(chalk.yellow('2. Consider changing the password again for enhanced security'));
    }
    console.log(chalk.yellow('3. Review recent login activity'));
    console.log(chalk.yellow('4. Verify all admin access permissions'));
    
    console.log(chalk.bold.red('\n🚨 SECURITY REMINDER:\n'));
    console.log(chalk.red('• Password is securely hashed with Argon2'));
    console.log(chalk.red('• Old password is immediately invalidated'));
    console.log(chalk.red('• Monitor admin account activity'));
    console.log(chalk.red('• Consider enabling two-factor authentication'));
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to reset password: ${error.message}`));
    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('Database connection refused. Please ensure PostgreSQL is running.'));
    }
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Handle CLI execution (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  resetAdminPassword().catch((error) => {
    console.error(chalk.red(`Password reset failed: ${error.message}`));
    process.exit(1);
  });
}

export { resetAdminPassword };