import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as crmSchema from "@shared/crm-schema";

// Use PostgreSQL with connection string if available
let pool: Pool | null = null;
let db: any = null;

// تعزيز الحماية من فقدان البيانات - Enhanced Data Loss Prevention
export async function initializeDatabase() {
  // فحص متعدد المستويات لبيئة الإنتاج - Multi-level production environment check
  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.REPLIT_DEPLOYMENT === 'true' ||
                      process.env.NODE_ENV === 'staging';
  
  if (!process.env.DATABASE_URL) {
    if (isProduction) {
      // In production, database connection is mandatory - no fallback allowed
      throw new Error("CRITICAL ERROR: DATABASE_URL is required in production. No fallback to in-memory storage allowed to prevent data loss.");
    } else {
      console.log("DATABASE_URL not found, using in-memory storage (development only)");
      return;
    }
  }

  try {
    console.log("DATABASE_URL found, attempting PostgreSQL connection...");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Add connection pool settings for better reliability
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    const tempDb = drizzle({ client: pool, schema: { ...schema, ...crmSchema } });
    
    // Test if tables exist by attempting a simple query
    try {
      await tempDb.select().from(schema.users).limit(1);
      db = tempDb;
      console.log("PostgreSQL database connection established and tables verified");
    } catch (tableError: any) {
      console.error("Database tables not found or not accessible:", tableError.message);
      
      if (isProduction) {
        // In production, table access failure is critical - no fallback
        if (pool) {
          await pool.end();
        }
        throw new Error(`CRITICAL ERROR: Database tables not accessible in production. Error: ${tableError.message}. No fallback allowed to prevent data loss.`);
      } else {
        console.log("Falling back to in-memory storage (development only)");
        if (pool) {
          await pool.end();
        }
        pool = null;
        db = null;
      }
    }
  } catch (error) {
    if (isProduction) {
      // In production, any database connection failure is critical
      throw new Error(`CRITICAL ERROR: Failed to connect to PostgreSQL in production. Error: ${error}. No fallback allowed to prevent data loss.`);
    } else {
      console.log("Failed to connect to PostgreSQL, falling back to in-memory storage (development only):", error);
      pool = null;
      db = null;
    }
  }
}

export { pool, db };
