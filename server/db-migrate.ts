#!/usr/bin/env tsx
/**
 * Database Migration Script
 * Run with: tsx server/db-migrate.ts
 * Or: node --loader=tsx server/db-migrate.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  console.log('🔄 Starting database migrations...');
  
  try {
    // Generate migration files from schema
    console.log('📋 Generating migration files...');
    const { stdout: generateOutput, stderr: generateError } = await execAsync('npx drizzle-kit generate');
    
    if (generateError && !generateError.includes('warning')) {
      console.error('❌ Error generating migrations:', generateError);
      process.exit(1);
    }
    
    console.log('✅ Migration files generated');
    if (generateOutput) console.log(generateOutput);

    // Apply migrations to database
    console.log('🚀 Applying migrations to database...');
    const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx drizzle-kit migrate');
    
    if (migrateError && !migrateError.includes('warning')) {
      console.error('❌ Error applying migrations:', migrateError);
      process.exit(1);
    }
    
    console.log('✅ Migrations applied successfully');
    if (migrateOutput) console.log(migrateOutput);
    
    // Push schema changes if needed
    console.log('📤 Pushing final schema changes...');
    const { stdout: pushOutput, stderr: pushError } = await execAsync('npx drizzle-kit push');
    
    if (pushError && !pushError.includes('warning') && !pushError.includes('No changes')) {
      console.error('❌ Error pushing schema:', pushError);
      process.exit(1);
    }
    
    console.log('✅ Schema synchronized');
    if (pushOutput) console.log(pushOutput);
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}

export { runMigrations };