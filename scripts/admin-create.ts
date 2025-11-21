#!/usr/bin/env tsx

import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashPassword, validatePassword, PasswordValidationError } from '../server/security/password';

dotenv.config();

interface CreateAdminOptions {
  email?: string;
  password?: string;
  forceChange?: boolean;
}

function parseArgs(): CreateAdminOptions {
  const args = process.argv.slice(2);
  const options: CreateAdminOptions = {};
  
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
  console.log(chalk.bold.blue('\n🔐 GSC Admin Creation Tool\n'));
  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  npm run admin:create [options]'));
  console.log(chalk.gray('  pnpm admin:create [options]\n'));
  console.log(chalk.white('Options:'));
  console.log(chalk.gray('  --email <email>           Admin email address'));
  console.log(chalk.gray('  --password <password>     Admin password'));
  console.log(chalk.gray('  --forceChange             Force password change on first login'));
  console.log(chalk.gray('  --help, -h                Show this help message\n'));
  console.log(chalk.white('Environment Variables:'));
  console.log(chalk.gray('  ADMIN_EMAIL              Default admin email'));
  console.log(chalk.gray('  ADMIN_PASSWORD           Default admin password'));
  console.log(chalk.gray('  ADMIN_FORCE_CHANGE       Default force change setting\n'));
  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  npm run admin:create --email admin@company.com --password "S7rong!Pass" --forceChange'));
  console.log(chalk.gray('  pnpm admin:create  # Uses environment variables'));
}

async function createAdmin(): Promise<void> {
  const options = parseArgs();
  
  // Get admin details from CLI args or environment
  const adminEmail = options.email || process.env.ADMIN_EMAIL;
  const adminPassword = options.password || process.env.ADMIN_PASSWORD;
  const forceChange = options.forceChange || process.env.ADMIN_FORCE_CHANGE === 'true';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  if (!adminEmail || !adminPassword) {
    console.error(chalk.red('❌ Missing required parameters'));
    console.log(chalk.yellow('\nRequired: --email and --password OR set ADMIN_EMAIL and ADMIN_PASSWORD environment variables'));
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
    validatePassword(adminPassword);
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

  console.log(chalk.bold.blue('\n🔐 Creating Admin User\n'));

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
    
    // Check if admin with this email already exists
    const existingAdmin = await client.query(
      'SELECT id, email, role, password_hash FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      const existing = existingAdmin.rows[0];
      if (existing.role === 'admin') {
        console.log(chalk.yellow(`⚠️  Admin with email ${adminEmail} already exists`));
        console.log(chalk.blue('✅ User already has admin role - no changes needed'));
        process.exit(0);
      } else {
        console.log(chalk.yellow(`⚠️  User with email ${adminEmail} exists but is not admin (role: ${existing.role})`));
        console.log(chalk.blue('🔄 Promoting user to admin role...'));
      }
    }

    // Hash the password securely with Argon2
    console.log(chalk.blue('🔒 Hashing password with Argon2...'));
    const hashedPassword = await hashPassword(adminPassword);

    const adminId = randomUUID();
    const now = new Date();

    if (existingAdmin.rows.length > 0) {
      // Update existing user to admin
      await client.query(`
        UPDATE users 
        SET password_hash = $1, role = 'admin', name = $2, updated_at = $3, force_password_change = $4
        WHERE email = $5
      `, [hashedPassword, adminName, now, forceChange ? 'true' : 'false', adminEmail]);
      
      console.log(chalk.green('✅ Existing user promoted to admin successfully'));
    } else {
      // Create new admin user
      await client.query(`
        INSERT INTO users (id, username, email, password, password_hash, role, name, is_active, force_password_change, created_at, updated_at)
        VALUES ($1, $2, $3, 'deprecated', $4, 'admin', $5, 'true', $6, $7, $8)
      `, [adminId, adminEmail, adminEmail, hashedPassword, adminName, forceChange ? 'true' : 'false', now, now]);
      
      console.log(chalk.green('✅ Admin user created successfully'));
    }

    // Create welcome notification
    try {
      const notificationId = randomUUID();
      await client.query(`
        INSERT INTO notifications (id, user_id, title, message, type, category, created_at)
        VALUES ($1, (SELECT id FROM users WHERE email = $2), $3, $4, 'general', 'system', $5)
      `, [
        notificationId,
        adminEmail,
        'Welcome to GSC Admin Panel',
        forceChange 
          ? 'Your admin account has been created. You must change your password on first login.'
          : 'Your admin account has been created. Please log in and review security settings.',
        now
      ]);
    } catch (notifError) {
      // Notification creation is not critical, continue without failing
      console.log(chalk.yellow('⚠️  Could not create welcome notification (non-critical)'));
    }

    // Print success message and next steps
    console.log(chalk.bold.green('\n🎉 SUCCESS!\n'));
    console.log(chalk.blue('Admin account details:'));
    console.log(chalk.white(`  Email: ${adminEmail}`));
    console.log(chalk.white(`  Name: ${adminName}`));
    console.log(chalk.white(`  Role: admin`));
    console.log(chalk.white(`  Force Password Change: ${forceChange ? 'Yes' : 'No'}`));
    console.log(chalk.white(`  Created: ${now.toISOString()}`));
    
    console.log(chalk.bold.yellow('\n⚡ IMPORTANT NEXT STEPS:\n'));
    console.log(chalk.yellow('1. Log in to the admin panel immediately'));
    if (forceChange) {
      console.log(chalk.yellow('2. You will be required to change the password on first login'));
    } else {
      console.log(chalk.yellow('2. Change the password through the settings'));
    }
    console.log(chalk.yellow('3. Enable two-factor authentication if available'));
    console.log(chalk.yellow('4. Review user permissions and access levels'));
    
    console.log(chalk.bold.red('\n🚨 SECURITY REMINDER:\n'));
    console.log(chalk.red('• Password is securely hashed with Argon2'));
    console.log(chalk.red('• Use strong, unique passwords for all admin accounts'));
    console.log(chalk.red('• Regularly rotate admin passwords'));
    console.log(chalk.red('• Monitor admin account activity'));
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to create admin: ${error.message}`));
    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('Database connection refused. Please ensure PostgreSQL is running.'));
    } else if (error.code === '23505') {
      console.log(chalk.yellow('Email address already exists with different username.'));
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
  createAdmin().catch((error) => {
    console.error(chalk.red(`Admin creation failed: ${error.message}`));
    process.exit(1);
  });
}

export { createAdmin };