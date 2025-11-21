#!/usr/bin/env tsx
/**
 * Simple Database Seeding Script - Creates sample CRM data directly via SQL
 * Run with: tsx server/db-seed-simple.ts
 */

import { db } from "./db";

async function createTablesAndSeed() {
  console.log('🌱 Starting simplified CRM seeding...');
  
  try {
    // Create crm_core schema if not exists
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS crm_core`);
    
    // Create core tables with proper constraints
    console.log('📋 Creating CRM tables...');
    
    // Teams table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_teams (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        manager_id VARCHAR,
        region TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    // Users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'agent',
        team_id VARCHAR,
        is_active BOOLEAN NOT NULL DEFAULT true,
        avatar TEXT,
        phone TEXT,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    // Accounts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_accounts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        legal_name TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        industry TEXT,
        size_tier TEXT NOT NULL DEFAULT 'smb',
        region TEXT,
        owner_team_id VARCHAR NOT NULL,
        owner_id VARCHAR NOT NULL,
        tax_id TEXT,
        website TEXT,
        phone TEXT,
        email TEXT,
        billing_address JSONB,
        shipping_address JSONB,
        annual_revenue DECIMAL,
        number_of_employees INTEGER,
        parent_account_id VARCHAR,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    // Contacts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_contacts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        primary_email TEXT UNIQUE,
        mx_validated BOOLEAN NOT NULL DEFAULT false,
        phones JSONB,
        channels JSONB,
        opt_in_status TEXT NOT NULL DEFAULT 'pending',
        opt_in_source TEXT,
        utm JSONB,
        account_id VARCHAR NOT NULL,
        job_title TEXT,
        department TEXT,
        is_primary BOOLEAN NOT NULL DEFAULT false,
        social_profiles JSONB,
        preferences JSONB,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    // Opportunities table  
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_opportunities (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        account_id VARCHAR NOT NULL,
        contact_id VARCHAR,
        stage TEXT NOT NULL DEFAULT 'prospecting',
        expected_value DECIMAL,
        close_date TIMESTAMP,
        win_probability INTEGER NOT NULL DEFAULT 0,
        actual_close_date TIMESTAMP,
        lead_source TEXT,
        description TEXT,
        loss_reason TEXT,
        next_step TEXT,
        owner_id VARCHAR NOT NULL,
        team_id VARCHAR,
        competitor_id VARCHAR,
        forecast_category TEXT NOT NULL DEFAULT 'pipeline',
        stage_entered_at TIMESTAMP,
        stage_age INTEGER,
        is_won BOOLEAN NOT NULL DEFAULT false,
        is_closed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    // Tickets table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS crm_core.crm_tickets (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_number TEXT NOT NULL UNIQUE,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'medium',
        category TEXT NOT NULL DEFAULT 'general',
        status TEXT NOT NULL DEFAULT 'open',
        contact_id VARCHAR,
        account_id VARCHAR,
        owner_id VARCHAR,
        assigned_to VARCHAR NOT NULL,
        team_id VARCHAR,
        sla_target TIMESTAMP,
        sla_breached BOOLEAN NOT NULL DEFAULT false,
        first_response_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closed_at TIMESTAMP,
        escalated_at TIMESTAMP,
        satisfaction INTEGER,
        tags JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      )
    `);
    
    console.log('✅ CRM tables created');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_tickets CASCADE`);
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_opportunities CASCADE`);
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_contacts CASCADE`);
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_accounts CASCADE`);
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_users CASCADE`);
    await db.execute(sql`TRUNCATE TABLE crm_core.crm_teams CASCADE`);
    
    // Insert seed data
    console.log('🌱 Seeding data...');
    
    // Teams
    await db.execute(sql`
      INSERT INTO crm_core.crm_teams (id, name, description, region) VALUES
      ('team-001', 'فريق المبيعات الرئيسي', 'فريق المبيعات المسؤول عن العملاء الكبار', 'MENA'),
      ('team-002', 'فريق الدعم التقني', 'فريق الدعم الفني وخدمة العملاء', 'MENA'),
      ('team-003', 'فريق التسويق الرقمي', 'فريق التسويق والحملات الرقمية', 'MENA')
    `);
    
    // Users
    await db.execute(sql`
      INSERT INTO crm_core.crm_users (id, username, email, first_name, last_name, role, team_id, phone) VALUES
      ('user-001', 'ahmed.admin', 'ahmed@geniussoftware.com', 'أحمد', 'المدير', 'admin', 'team-001', '+966-50-1234567'),
      ('user-002', 'sara.manager', 'sara@geniussoftware.com', 'سارة', 'أحمد', 'manager', 'team-001', '+966-50-2345678'),
      ('user-003', 'mohammed.agent', 'mohammed@geniussoftware.com', 'محمد', 'علي', 'agent', 'team-001', '+966-50-3456789'),
      ('user-004', 'fatima.support', 'fatima@geniussoftware.com', 'فاطمة', 'السالم', 'agent', 'team-002', '+966-50-4567890'),
      ('user-005', 'khalid.viewer', 'khalid@geniussoftware.com', 'خالد', 'المتابع', 'viewer', 'team-003', '+966-50-5678901')
    `);
    
    // Update team managers
    await db.execute(sql`UPDATE crm_core.crm_teams SET manager_id = 'user-002' WHERE id = 'team-001'`);
    await db.execute(sql`UPDATE crm_core.crm_teams SET manager_id = 'user-004' WHERE id = 'team-002'`);
    
    // Accounts
    await db.execute(sql`
      INSERT INTO crm_core.crm_accounts (
        id, legal_name, normalized_name, industry, size_tier, region, 
        owner_team_id, owner_id, website, phone, email, 
        billing_address, annual_revenue, number_of_employees, description
      ) VALUES
      (
        'acc-001', 'شركة التقنية المتقدمة المحدودة', 'advanced-tech-ltd', 
        'technology', 'ent', 'MENA', 'team-001', 'user-002',
        'https://advancedtech.com.sa', '+966-11-1234567', 'info@advancedtech.com.sa',
        '{"street": "شارع الملك فهد، حي العليا", "city": "الرياض", "state": "منطقة الرياض", "country": "المملكة العربية السعودية", "postalCode": "12345"}',
        15000000, 250, 'شركة رائدة في مجال التكنولوجيا والحلول الرقمية'
      ),
      (
        'acc-002', 'مؤسسة الخدمات الطبية الشاملة', 'comprehensive-medical-services',
        'healthcare', 'smb', 'MENA', 'team-001', 'user-003',
        'https://medicalservices.com.sa', '+966-11-7654321', 'contact@medicalservices.com.sa',
        '{"street": "شارع العروبة، حي الملز", "city": "الرياض", "state": "منطقة الرياض", "country": "المملكة العربية السعودية", "postalCode": "54321"}',
        5000000, 85, 'مؤسسة متخصصة في الخدمات الطبية والرعاية الصحية'
      ),
      (
        'acc-003', 'شركة التجارة الإلكترونية الذكية', 'smart-ecommerce-co',
        'retail', 'smb', 'MENA', 'team-001', 'user-003',
        'https://smartecommerce.com.sa', '+966-12-9876543', 'info@smartecommerce.com.sa',
        '{"street": "شارع الأمير محمد بن عبدالعزيز", "city": "جدة", "state": "منطقة مكة المكرمة", "country": "المملكة العربية السعودية", "postalCode": "67890"}',
        3000000, 45, 'شركة رائدة في مجال التجارة الإلكترونية والحلول الذكية'
      )
    `);
    
    // Contacts
    await db.execute(sql`
      INSERT INTO crm_core.crm_contacts (
        id, first_name, last_name, primary_email, phones, account_id, 
        job_title, department, is_primary, opt_in_status
      ) VALUES
      ('contact-001', 'عبدالله', 'المهندس', 'abdullah@advancedtech.com.sa', '["${"+966-50-1111111"}"]', 'acc-001', 'مدير تقنية المعلومات', 'IT', true, 'opted_in'),
      ('contact-002', 'نورا', 'الشراري', 'nora@advancedtech.com.sa', '["${"+966-50-2222222"}"]', 'acc-001', 'مديرة المشاريع', 'PMO', false, 'opted_in'),
      ('contact-003', 'د. سالم', 'العتيبي', 'salem@medicalservices.com.sa', '["${"+966-50-3333333"}"]', 'acc-002', 'المدير الطبي', 'Medical', true, 'opted_in'),
      ('contact-004', 'ريم', 'التميمي', 'reem@smartecommerce.com.sa', '["${"+966-50-4444444"}"]', 'acc-003', 'مديرة التسويق الرقمي', 'Marketing', true, 'opted_in')
    `);
    
    // Opportunities
    await db.execute(sql`
      INSERT INTO crm_core.crm_opportunities (
        id, name, account_id, contact_id, stage, expected_value, 
        close_date, win_probability, description, next_step, owner_id, forecast_category
      ) VALUES
      (
        'opp-001', 'مشروع نظام إدارة المستشفيات', 'acc-002', 'contact-003',
        'proposal', 750000, NOW() + INTERVAL '60 days', 75,
        'تطوير نظام شامل لإدارة المستشفيات والعيادات', 'تقديم العرض الفني والمالي',
        'user-002', 'best_case'
      ),
      (
        'opp-002', 'تطبيق التجارة الإلكترونية الذكي', 'acc-003', 'contact-004',
        'negotiation', 400000, NOW() + INTERVAL '30 days', 85,
        'تطوير تطبيق جوال للتجارة الإلكترونية مع نظام إدارة المخزون', 'مراجعة التفاصيل الفنية والتوقيع',
        'user-002', 'committed'
      )
    `);
    
    // Support Tickets
    await db.execute(sql`
      INSERT INTO crm_core.crm_tickets (
        id, ticket_number, subject, description, priority, category, status,
        contact_id, account_id, assigned_to, team_id, sla_target, tags
      ) VALUES
      (
        'ticket-001', 'TKT-2024-001', 'مشكلة في تحديث النظام',
        'يواجه المستخدمون مشكلة في تحديث النظام إلى الإصدار الجديد',
        'high', 'technical', 'in_progress', 'contact-001', 'acc-001',
        'user-004', 'team-002', NOW() + INTERVAL '24 hours',
        '["system-update", "urgent"]'
      ),
      (
        'ticket-002', 'TKT-2024-002', 'طلب تدريب على النظام الجديد',
        'طلب تدريب للموظفين على استخدام النظام الجديد',
        'medium', 'general', 'open', 'contact-003', 'acc-002',
        'user-004', 'team-002', NOW() + INTERVAL '72 hours',
        '["training", "system-usage"]'
      )
    `);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Seeded Data Summary:
- 👥 Teams: 3
- 👤 Users: 5
- 🏢 Accounts: 3
- 👥 Contacts: 4
- 💰 Opportunities: 2
- 🎫 Tickets: 2

🎉 Your CRM is now ready with sample data for immediate UI demos!
    `);

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

// Import SQL helper
import { sql } from "drizzle-orm";

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTablesAndSeed().catch(console.error);
}

export { createTablesAndSeed };