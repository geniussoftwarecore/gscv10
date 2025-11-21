#!/usr/bin/env tsx
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function resetDatabase() {
  console.log("🔄 Resetting database...");

  try {
    // Drop all tables in correct order (considering foreign key constraints)
    const dropQueries = [
      'DROP TABLE IF EXISTS "crm_activities" CASCADE;',
      'DROP TABLE IF EXISTS "tasks" CASCADE;',
      'DROP TABLE IF EXISTS "support_tickets" CASCADE;',
      'DROP TABLE IF EXISTS "ticket_messages" CASCADE;',
      'DROP TABLE IF EXISTS "opportunities" CASCADE;',
      'DROP TABLE IF EXISTS "contacts" CASCADE;',
      'DROP TABLE IF EXISTS "accounts" CASCADE;',
      'DROP TABLE IF EXISTS "leads" CASCADE;',
      'DROP TABLE IF EXISTS "deal_stages" CASCADE;',
      'DROP TABLE IF EXISTS "ticket_status" CASCADE;',
      'DROP TABLE IF EXISTS "audit_logs" CASCADE;',
      'DROP TABLE IF EXISTS "saved_filters" CASCADE;',
      'DROP TABLE IF EXISTS "client_requests" CASCADE;',
      'DROP TABLE IF EXISTS "invoices" CASCADE;',
      'DROP TABLE IF EXISTS "notifications" CASCADE;',
      'DROP TABLE IF EXISTS "blog_posts" CASCADE;',
      'DROP TABLE IF EXISTS "projects" CASCADE;',
      'DROP TABLE IF EXISTS "service_requests" CASCADE;',
      'DROP TABLE IF EXISTS "user_subscriptions" CASCADE;',
      'DROP TABLE IF EXISTS "subscription_plans" CASCADE;',
      'DROP TABLE IF EXISTS "testimonials" CASCADE;',
      'DROP TABLE IF EXISTS "services" CASCADE;',
      'DROP TABLE IF EXISTS "portfolio_items" CASCADE;',
      'DROP TABLE IF EXISTS "contact_submissions" CASCADE;',
      'DROP TABLE IF EXISTS "users" CASCADE;',
      
      // Drop any remaining sequences or functions
      'DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;'
    ];

    for (const query of dropQueries) {
      try {
        await db.execute(sql.raw(query));
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        console.log(`⚠️  Warning: ${query} - ${error.message}`);
      }
    }

    console.log("✅ Database reset completed!");

  } catch (error) {
    console.error("❌ Reset failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

resetDatabase().catch((error) => {
  console.error("❌ Reset script failed:", error);
  process.exit(1);
});