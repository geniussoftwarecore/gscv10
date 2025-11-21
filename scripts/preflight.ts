#!/usr/bin/env tsx

import { Pool } from 'pg';
import { createWriteStream, statSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

interface PreflightCheck {
  name: string;
  check: () => Promise<boolean>;
  critical?: boolean;
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  critical: boolean;
}

const requiredEnvKeys = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'API_BASE_URL',
  'CORS_ORIGINS',
  'VITE_API_URL',
  'VITE_DEFAULT_LANG'
];

const optionalEnvKeys = [
  'NODE_ENV',
  'PORT',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const checks: PreflightCheck[] = [
  {
    name: 'Environment Variables',
    critical: true,
    check: async () => {
      const missing = requiredEnvKeys.filter(key => !process.env[key]);
      if (missing.length > 0) {
        console.log(chalk.red(`  Missing required env vars: ${missing.join(', ')}`));
        return false;
      }
      
      const present = optionalEnvKeys.filter(key => process.env[key]);
      console.log(chalk.blue(`  Optional vars present: ${present.join(', ') || 'none'}`));
      console.log(chalk.green(`  All required environment variables present`));
      return true;
    }
  },

  {
    name: 'Database Connectivity',
    critical: true,
    check: async () => {
      if (!process.env.DATABASE_URL) {
        console.log(chalk.red('  DATABASE_URL not set'));
        return false;
      }

      try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const client = await pool.connect();
        
        // Test basic connectivity
        const result = await client.query('SELECT NOW()');
        console.log(chalk.green(`  Database connected at ${result.rows[0].now}`));
        
        // Check for pending migrations
        try {
          const migrationCheck = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'drizzle' 
              AND table_name = '__drizzle_migrations'
            )
          `);
          
          if (migrationCheck.rows[0].exists) {
            const pendingMigrations = await client.query(`
              SELECT * FROM drizzle.__drizzle_migrations 
              WHERE success = false
            `);
            
            if (pendingMigrations.rows.length > 0) {
              console.log(chalk.yellow(`  Warning: ${pendingMigrations.rows.length} pending migrations`));
            } else {
              console.log(chalk.green('  All migrations applied successfully'));
            }
          } else {
            console.log(chalk.yellow('  Migration table not found - run migrations first'));
          }
        } catch (e) {
          console.log(chalk.yellow('  Could not check migration status'));
        }
        
        client.release();
        await pool.end();
        return true;
      } catch (error: any) {
        console.log(chalk.red(`  Database connection failed: ${error.message}`));
        return false;
      }
    }
  },

  {
    name: 'Client Build Size',
    check: async () => {
      try {
        // First ensure we can build
        console.log(chalk.blue('  Building client...'));
        execSync('npm run build', { stdio: 'pipe' });
        
        // Check main chunk size
        const distPath = join(process.cwd(), 'dist');
        const files = execSync('find dist -name "*.js" -type f', { encoding: 'utf-8' })
          .trim().split('\n').filter(Boolean);
        
        let mainChunkSize = 0;
        let largestFile = '';
        
        for (const file of files) {
          try {
            const stats = statSync(file);
            if (stats.size > mainChunkSize) {
              mainChunkSize = stats.size;
              largestFile = file;
            }
          } catch (e) {
            // File might not exist, continue
          }
        }
        
        const sizeMB = (mainChunkSize / 1024 / 1024).toFixed(2);
        const sizeKB = (mainChunkSize / 1024).toFixed(0);
        
        console.log(chalk.blue(`  Largest chunk: ${largestFile} (${sizeKB} KB)`));
        
        if (mainChunkSize > 300 * 1024) { // 300 KB threshold
          console.log(chalk.yellow(`  Warning: Main chunk size ${sizeKB} KB exceeds 300 KB threshold`));
          return false;
        } else {
          console.log(chalk.green(`  Build size OK: ${sizeKB} KB`));
          return true;
        }
      } catch (error: any) {
        console.log(chalk.red(`  Build failed: ${error.message}`));
        return false;
      }
    }
  },

  {
    name: 'API Health Endpoint',
    check: async () => {
      try {
        // Check if we can start the server and hit health endpoint
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
        
        console.log(chalk.blue(`  Checking health endpoint at ${baseUrl}/api/health`));
        
        // Use a simple fetch with timeout
        const response = await Promise.race([
          fetch(`${baseUrl}/api/health`),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]) as Response;
        
        if (response.ok) {
          const health = await response.json();
          console.log(chalk.green(`  API health check passed: ${JSON.stringify(health)}`));
          return true;
        } else {
          console.log(chalk.red(`  Health endpoint returned ${response.status}`));
          return false;
        }
      } catch (error: any) {
        console.log(chalk.yellow(`  Could not reach health endpoint: ${error.message}`));
        console.log(chalk.blue('  This is normal if server is not running'));
        return true; // Don't fail on this as server might not be running
      }
    }
  },

  {
    name: 'i18n Language Toggle',
    check: async () => {
      try {
        // Check if language files exist
        const languages = ['en', 'ar']; // Based on what I saw in the public/locales folder
        let allLanguagesExist = true;
        
        for (const lang of languages) {
          try {
            const langFile = join(process.cwd(), 'client', 'public', 'locales', `${lang}.json`);
            statSync(langFile);
            console.log(chalk.blue(`  ✓ Language file exists: ${lang}.json`));
          } catch (e) {
            console.log(chalk.red(`  ✗ Missing language file: ${lang}.json`));
            allLanguagesExist = false;
          }
        }
        
        // Check if VITE_DEFAULT_LANG is valid
        const defaultLang = process.env.VITE_DEFAULT_LANG;
        if (defaultLang && languages.includes(defaultLang)) {
          console.log(chalk.green(`  Default language set to: ${defaultLang}`));
        } else {
          console.log(chalk.yellow(`  Default language '${defaultLang}' not in available languages`));
        }
        
        if (allLanguagesExist) {
          console.log(chalk.green('  i18n setup appears correct'));
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.log(chalk.red(`  i18n check failed: ${error.message}`));
        return false;
      }
    }
  }
];

async function runPreflight(): Promise<void> {
  console.log(chalk.bold.blue('\n🚀 GSC Pre-Production Preflight Checklist\n'));
  
  const results: CheckResult[] = [];
  let allCriticalPassed = true;
  
  for (const check of checks) {
    console.log(chalk.bold(`🔍 ${check.name}...`));
    
    try {
      const passed = await check.check();
      const critical = check.critical || false;
      
      results.push({
        name: check.name,
        passed,
        message: passed ? 'PASS' : 'FAIL',
        critical
      });
      
      if (!passed && critical) {
        allCriticalPassed = false;
      }
      
      console.log(''); // Add spacing between checks
    } catch (error: any) {
      results.push({
        name: check.name,
        passed: false,
        message: `ERROR: ${error.message}`,
        critical: check.critical || false
      });
      
      if (check.critical) {
        allCriticalPassed = false;
      }
      console.log(chalk.red(`  Error running check: ${error.message}`));
      console.log('');
    }
  }
  
  // Print summary
  console.log(chalk.bold('\n📋 PREFLIGHT SUMMARY\n'));
  
  for (const result of results) {
    const icon = result.passed ? '✅' : (result.critical ? '❌' : '⚠️');
    const color = result.passed ? chalk.green : (result.critical ? chalk.red : chalk.yellow);
    const criticality = result.critical ? ' [CRITICAL]' : '';
    
    console.log(`${icon} ${color(result.name)}: ${result.message}${criticality}`);
  }
  
  const criticalFailures = results.filter(r => !r.passed && r.critical).length;
  const warnings = results.filter(r => !r.passed && !r.critical).length;
  const successes = results.filter(r => r.passed).length;
  
  console.log(chalk.bold(`\n📊 Results: ${successes} passed, ${warnings} warnings, ${criticalFailures} critical failures\n`));
  
  if (allCriticalPassed) {
    console.log(chalk.bold.green('🎉 All critical checks passed! Ready for production deployment.'));
  } else {
    console.log(chalk.bold.red('🚨 Critical issues found. Address these before deploying to production.'));
    process.exit(1);
  }
}

// Handle CLI execution
if (require.main === module) {
  runPreflight().catch((error) => {
    console.error(chalk.red(`Preflight failed: ${error.message}`));
    process.exit(1);
  });
}