#!/usr/bin/env tsx

import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

interface AdminData {
  email: string;
  password: string;
  name?: string;
}

async function createSecureAdmin(): Promise<void> {
  console.log(chalk.bold.blue('\n🔐 GSC Secure Admin Creation\n'));

  // Get admin details from environment or CLI args
  const adminEmail = process.env.ADMIN_EMAIL || process.argv[2];
  const adminPassword = process.env.ADMIN_PASSWORD || process.argv[3];
  const adminName = process.env.ADMIN_NAME || process.argv[4] || 'System Administrator';

  if (!adminEmail || !adminPassword) {
    console.error(chalk.red('❌ Missing required parameters'));
    console.log(chalk.yellow('Usage: tsx scripts/createAdmin.ts <email> <password> [name]'));
    console.log(chalk.yellow('Or set environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME'));
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(adminEmail)) {
    console.error(chalk.red('❌ Invalid email format'));
    process.exit(1);
  }

  // Validate password strength
  if (adminPassword.length < 8) {
    console.error(chalk.red('❌ Password must be at least 8 characters long'));
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error(chalk.red('❌ DATABASE_URL environment variable is required'));
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const client = await pool.connect();
    
    // Check if admin with this email already exists
    const existingAdmin = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      const existing = existingAdmin.rows[0];
      if (existing.role === 'admin') {
        console.log(chalk.yellow(`⚠️  Admin with email ${adminEmail} already exists`));
        console.log(chalk.blue('Do you want to update the password? (y/N)'));
        
        // For now, exit - in production you might want to add interactive prompt
        console.log(chalk.red('Exiting to prevent accidental overwrites'));
        process.exit(1);
      } else {
        console.log(chalk.yellow(`⚠️  User with email ${adminEmail} exists but is not admin (role: ${existing.role})`));
        console.log(chalk.blue('Updating role to admin...'));
      }
    }

    // Hash the password securely
    console.log(chalk.blue('🔒 Hashing password...'));
    const saltRounds = 12; // High security for admin accounts
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const adminId = randomUUID();
    const now = new Date();

    if (existingAdmin.rows.length > 0) {
      // Update existing user to admin
      await client.query(`
        UPDATE users 
        SET password = $1, role = 'admin', name = $2, updated_at = $3
        WHERE email = $4
      `, [hashedPassword, adminName, now, adminEmail]);
      
      console.log(chalk.green('✅ Existing user updated to admin successfully'));
    } else {
      // Create new admin user
      await client.query(`
        INSERT INTO users (id, username, email, password, role, name, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'admin', $5, 'true', $6, $7)
      `, [adminId, adminEmail, adminEmail, hashedPassword, adminName, now, now]);
      
      console.log(chalk.green('✅ Admin user created successfully'));
    }

    // Create initial admin notification
    const notificationId = randomUUID();
    await client.query(`
      INSERT INTO notifications (id, user_id, title, message, type, category, created_at)
      VALUES ($1, (SELECT id FROM users WHERE email = $2), $3, $4, 'general', 'system', $5)
    `, [
      notificationId,
      adminEmail,
      'Welcome to GSC Admin Panel',
      'Your admin account has been created. Please log in and change your password immediately.',
      now
    ]);

    client.release();
    await pool.end();

    // Print success message and next steps
    console.log(chalk.bold.green('\n🎉 SUCCESS!\n'));
    console.log(chalk.blue('Admin account details:'));
    console.log(chalk.white(`  Email: ${adminEmail}`));
    console.log(chalk.white(`  Name: ${adminName}`));
    console.log(chalk.white(`  Role: admin`));
    console.log(chalk.white(`  Created: ${now.toISOString()}`));
    
    console.log(chalk.bold.yellow('\n⚡ IMPORTANT NEXT STEPS:\n'));
    console.log(chalk.yellow('1. Log in to the admin panel immediately'));
    console.log(chalk.yellow('2. Change the password through the settings'));
    console.log(chalk.yellow('3. Enable two-factor authentication if available'));
    console.log(chalk.yellow('4. Review user permissions and access levels'));
    console.log(chalk.yellow('5. Set up monitoring and audit logging'));
    
    console.log(chalk.bold.red('\n🚨 SECURITY REMINDER:\n'));
    console.log(chalk.red('• Never store admin credentials in plaintext'));
    console.log(chalk.red('• Use strong, unique passwords for all admin accounts'));
    console.log(chalk.red('• Regularly rotate admin passwords'));
    console.log(chalk.red('• Monitor admin account activity'));
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to create admin: ${error.message}`));
    await pool.end();
    process.exit(1);
  }
}

// Handle CLI execution
if (require.main === module) {
  createSecureAdmin().catch((error) => {
    console.error(chalk.red(`Admin creation failed: ${error.message}`));
    process.exit(1);
  });
}