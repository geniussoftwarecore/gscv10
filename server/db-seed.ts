#!/usr/bin/env tsx
/**
 * Database Seeding Script
 * Run with: tsx server/db-seed.ts
 * Or: node --loader=tsx server/db-seed.ts
 */

import { db } from "./db";
import { 
  crmUsers, 
  crmTeams, 
  crmAccounts, 
  crmContacts, 
  crmLeads, 
  crmOpportunities, 
  crmProducts,
  crmActivities,
  crmTickets,
  crmAuditLogs
} from "@shared/crm-schema";
import { runMigrations } from "./db-migrate";

async function seedDatabase() {
  console.log('🌱 Starting CRM database seeding...');
  
  try {
    // Run migrations first to ensure schema is up to date
    await runMigrations();
    
    // Clear existing data (be careful in production!)
    console.log('🧹 Clearing existing data...');
    await db.delete(crmAuditLogs);
    await db.delete(crmTickets);
    await db.delete(crmActivities);
    await db.delete(crmOpportunities);
    await db.delete(crmLeads);
    await db.delete(crmContacts);
    await db.delete(crmAccounts);
    await db.delete(crmProducts);
    await db.delete(crmUsers);
    await db.delete(crmTeams);
    
    // 1. Create Teams
    console.log('👥 Creating teams...');
    const teams = await db.insert(crmTeams).values([
      {
        id: "team-001",
        name: "فريق المبيعات الرئيسي",
        description: "فريق المبيعات المسؤول عن العملاء الكبار",
        region: "MENA",
        isActive: true
      },
      {
        id: "team-002", 
        name: "فريق الدعم التقني",
        description: "فريق الدعم الفني وخدمة العملاء",
        region: "MENA",
        isActive: true
      },
      {
        id: "team-003",
        name: "فريق التسويق الرقمي",
        description: "فريق التسويق والحملات الرقمية",
        region: "MENA", 
        isActive: true
      }
    ]).returning();
    
    // 2. Create Users with different roles
    console.log('👤 Creating users...');
    const users = await db.insert(crmUsers).values([
      {
        id: "user-001",
        username: "ahmed.admin",
        email: "ahmed@geniussoftware.com",
        firstName: "أحمد",
        lastName: "المدير",
        role: "admin",
        teamId: "team-001",
        isActive: true,
        phone: "+966-50-1234567"
      },
      {
        id: "user-002",
        username: "sara.manager",
        email: "sara@geniussoftware.com", 
        firstName: "سارة",
        lastName: "أحمد",
        role: "manager",
        teamId: "team-001",
        isActive: true,
        phone: "+966-50-2345678"
      },
      {
        id: "user-003",
        username: "mohammed.agent",
        email: "mohammed@geniussoftware.com",
        firstName: "محمد",
        lastName: "علي",
        role: "agent",
        teamId: "team-001", 
        isActive: true,
        phone: "+966-50-3456789"
      },
      {
        id: "user-004",
        username: "fatima.support",
        email: "fatima@geniussoftware.com",
        firstName: "فاطمة",
        lastName: "السالم",
        role: "agent",
        teamId: "team-002",
        isActive: true,
        phone: "+966-50-4567890"
      },
      {
        id: "user-005",
        username: "khalid.viewer",
        email: "khalid@geniussoftware.com",
        firstName: "خالد",
        lastName: "المتابع",
        role: "viewer",
        teamId: "team-003",
        isActive: true,
        phone: "+966-50-5678901"
      }
    ]).returning();

    // Update teams with managers
    await db.update(crmTeams)
      .set({ managerId: "user-002" })
      .where(eq(crmTeams.id, "team-001"));
      
    await db.update(crmTeams)
      .set({ managerId: "user-004" })
      .where(eq(crmTeams.id, "team-002"));

    // 3. Create Products
    console.log('📦 Creating products...');
    const products = await db.insert(crmProducts).values([
      {
        id: "prod-001",
        name: "تطوير تطبيقات الجوال",
        sku: "MOB-DEV-001",
        description: "خدمة تطوير تطبيقات الجوال لنظامي iOS و Android",
        category: "development",
        productFamily: "mobile-apps",
        isActive: true
      },
      {
        id: "prod-002", 
        name: "تصميم مواقع الويب",
        sku: "WEB-DES-001",
        description: "تصميم وتطوير مواقع الويب المتجاوبة",
        category: "development",
        productFamily: "web-development",
        isActive: true
      },
      {
        id: "prod-003",
        name: "نظام إدارة موارد المؤسسة",
        sku: "ERP-SYS-001", 
        description: "نظام ERPNext المخصص لإدارة العمليات التجارية",
        category: "systems",
        productFamily: "erp-solutions",
        isActive: true
      },
      {
        id: "prod-004",
        name: "استشارات تقنية",
        sku: "TECH-CON-001",
        description: "خدمات الاستشارات التقنية والحلول الذكية",
        category: "consulting",
        productFamily: "advisory",
        isActive: true
      }
    ]).returning();

    // 4. Create Accounts (Companies)
    console.log('🏢 Creating accounts...');
    const accounts = await db.insert(crmAccounts).values([
      {
        id: "acc-001",
        legalName: "شركة التقنية المتقدمة المحدودة",
        normalizedName: "advanced-tech-ltd",
        industry: "technology",
        sizeTier: "ent",
        region: "MENA",
        ownerTeamId: "team-001",
        ownerId: "user-002",
        website: "https://advancedtech.com.sa",
        phone: "+966-11-1234567",
        email: "info@advancedtech.com.sa",
        billingAddress: {
          street: "شارع الملك فهد، حي العليا",
          city: "الرياض",
          state: "منطقة الرياض",
          country: "المملكة العربية السعودية",
          postalCode: "12345"
        },
        annualRevenue: "15000000",
        numberOfEmployees: 250,
        description: "شركة رائدة في مجال التكنولوجيا والحلول الرقمية",
        isActive: true
      },
      {
        id: "acc-002",
        legalName: "مؤسسة الخدمات الطبية الشاملة",
        normalizedName: "comprehensive-medical-services",
        industry: "healthcare", 
        sizeTier: "smb",
        region: "MENA",
        ownerTeamId: "team-001",
        ownerId: "user-003",
        website: "https://medicalservices.com.sa",
        phone: "+966-11-7654321",
        email: "contact@medicalservices.com.sa",
        billingAddress: {
          street: "شارع العروبة، حي الملز",
          city: "الرياض",
          state: "منطقة الرياض",
          country: "المملكة العربية السعودية",
          postalCode: "54321"
        },
        annualRevenue: "5000000",
        numberOfEmployees: 85,
        description: "مؤسسة متخصصة في الخدمات الطبية والرعاية الصحية",
        isActive: true
      },
      {
        id: "acc-003",
        legalName: "شركة التجارة الإلكترونية الذكية",
        normalizedName: "smart-ecommerce-co",
        industry: "retail",
        sizeTier: "smb", 
        region: "MENA",
        ownerTeamId: "team-001",
        ownerId: "user-003",
        website: "https://smartecommerce.com.sa",
        phone: "+966-12-9876543",
        email: "info@smartecommerce.com.sa",
        billingAddress: {
          street: "شارع الأمير محمد بن عبدالعزيز",
          city: "جدة",
          state: "منطقة مكة المكرمة",
          country: "المملكة العربية السعودية",
          postalCode: "67890"
        },
        annualRevenue: "3000000",
        numberOfEmployees: 45,
        description: "شركة رائدة في مجال التجارة الإلكترونية والحلول الذكية",
        isActive: true
      }
    ]).returning();

    // 5. Create Contacts
    console.log('👥 Creating contacts...');
    const contacts = await db.insert(crmContacts).values([
      {
        id: "contact-001",
        firstName: "عبدالله",
        lastName: "المهندس",
        primaryEmail: "abdullah@advancedtech.com.sa",
        phones: ["+966-50-1111111"],
        accountId: "acc-001",
        jobTitle: "مدير تقنية المعلومات",
        department: "IT",
        isPrimary: true,
        optInStatus: "opted_in",
        isActive: true
      },
      {
        id: "contact-002", 
        firstName: "نورا",
        lastName: "الشراري",
        primaryEmail: "nora@advancedtech.com.sa",
        phones: ["+966-50-2222222"],
        accountId: "acc-001",
        jobTitle: "مديرة المشاريع",
        department: "PMO",
        isPrimary: false,
        optInStatus: "opted_in",
        isActive: true
      },
      {
        id: "contact-003",
        firstName: "د. سالم",
        lastName: "العتيبي",
        primaryEmail: "salem@medicalservices.com.sa",
        phones: ["+966-50-3333333"],
        accountId: "acc-002",
        jobTitle: "المدير الطبي",
        department: "Medical",
        isPrimary: true,
        optInStatus: "opted_in",
        isActive: true
      },
      {
        id: "contact-004",
        firstName: "ريم",
        lastName: "التميمي",
        primaryEmail: "reem@smartecommerce.com.sa", 
        phones: ["+966-50-4444444"],
        accountId: "acc-003",
        jobTitle: "مديرة التسويق الرقمي",
        department: "Marketing",
        isPrimary: true,
        optInStatus: "opted_in",
        isActive: true
      }
    ]).returning();

    // 6. Create Leads
    console.log('🎯 Creating leads...');
    const leads = await db.insert(crmLeads).values([
      {
        id: "lead-001",
        firstName: "أسامة",
        lastName: "القحطاني",
        email: "osama@newtech.com.sa",
        phone: "+966-50-5555555",
        company: "شركة التقنيات الحديثة",
        jobTitle: "الرئيس التنفيذي",
        leadSource: "website",
        leadStatus: "qualified",
        leadRating: "hot",
        leadScore: 85,
        estimatedValue: "500000",
        assignedTo: "user-003",
        teamId: "team-001",
        description: "مهتم بتطوير نظام ERP مخصص"
      },
      {
        id: "lead-002",
        firstName: "هند",
        lastName: "الدوسري", 
        email: "hind@education.com.sa",
        phone: "+966-50-6666666",
        company: "مؤسسة التعليم المتطور",
        jobTitle: "مديرة التقنية",
        leadSource: "referral",
        leadStatus: "contacted",
        leadRating: "warm",
        leadScore: 65,
        estimatedValue: "200000",
        assignedTo: "user-003",
        teamId: "team-001",
        description: "تحتاج لحلول التعلم الإلكتروني"
      }
    ]).returning();

    // 7. Create Opportunities (Deals)
    console.log('💰 Creating opportunities...');
    const opportunities = await db.insert(crmOpportunities).values([
      {
        id: "opp-001",
        name: "مشروع نظام إدارة المستشفيات",
        accountId: "acc-002",
        contactId: "contact-003",
        stage: "proposal",
        expectedValue: "750000",
        closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        winProbability: 75,
        leadSource: "referral",
        description: "تطوير نظام شامل لإدارة المستشفيات والعيادات",
        nextStep: "تقديم العرض الفني والمالي",
        ownerId: "user-002",
        forecastCategory: "best_case",
        stageEnteredAt: new Date(),
        stageAge: 15
      },
      {
        id: "opp-002",
        name: "تطبيق التجارة الإلكترونية الذكي",
        accountId: "acc-003", 
        contactId: "contact-004",
        stage: "negotiation",
        expectedValue: "400000",
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        winProbability: 85,
        leadSource: "website",
        description: "تطوير تطبيق جوال للتجارة الإلكترونية مع نظام إدارة المخزون",
        nextStep: "مراجعة التفاصيل الفنية والتوقيع",
        ownerId: "user-002",
        forecastCategory: "committed",
        stageEnteredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        stageAge: 7
      }
    ]).returning();

    // 8. Create Support Tickets
    console.log('🎫 Creating support tickets...');
    const tickets = await db.insert(crmTickets).values([
      {
        id: "ticket-001",
        ticketNumber: "TKT-2024-001",
        subject: "مشكلة في تحديث النظام",
        description: "يواجه المستخدمون مشكلة في تحديث النظام إلى الإصدار الجديد",
        priority: "high",
        category: "technical", 
        status: "in_progress",
        contactId: "contact-001",
        accountId: "acc-001",
        assignedTo: "user-004",
        teamId: "team-002",
        slaTarget: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        tags: ["system-update", "urgent"]
      },
      {
        id: "ticket-002",
        ticketNumber: "TKT-2024-002",
        subject: "طلب تدريب على النظام الجديد",
        description: "طلب تدريب للموظفين على استخدام النظام الجديد",
        priority: "medium",
        category: "general",
        status: "open",
        contactId: "contact-003",
        accountId: "acc-002", 
        assignedTo: "user-004",
        teamId: "team-002",
        slaTarget: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
        tags: ["training", "system-usage"]
      }
    ]).returning();

    // 9. Create Activities
    console.log('📋 Creating activities...');
    const activities = await db.insert(crmActivities).values([
      {
        id: "activity-001",
        type: "call",
        title: "مكالمة متابعة العرض",
        description: "مكالمة لمتابعة العرض المقدم ومناقشة التفاصيل الفنية",
        actorId: "user-002",
        againstType: "opportunity",
        againstId: "opp-001",
        outcome: "تم الاتفاق على موعد الاجتماع القادم",
        durationSec: 1800, // 30 minutes
        completedAt: new Date(),
        isCompleted: true
      },
      {
        id: "activity-002",
        type: "meeting",
        title: "اجتماع مراجعة المتطلبات",
        description: "اجتماع مع العميل لمراجعة متطلبات المشروع",
        actorId: "user-003",
        againstType: "account", 
        againstId: "acc-003",
        dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        isCompleted: false
      }
    ]).returning();

    // 10. Create sample audit logs
    console.log('📊 Creating audit logs...');
    await db.insert(crmAuditLogs).values([
      {
        actorId: "user-002",
        action: "create",
        entityType: "opportunities",
        entityId: "opp-001",
        entityName: "مشروع نظام إدارة المستشفيات",
        metadata: {
          source: "web",
          ipAddress: "192.168.1.100"
        }
      },
      {
        actorId: "user-003",
        action: "update",
        entityType: "opportunities", 
        entityId: "opp-002",
        entityName: "تطبيق التجارة الإلكترونية الذكي",
        diff: {
          before: { stage: "proposal" },
          after: { stage: "negotiation" },
          changed: ["stage"]
        },
        metadata: {
          source: "web",
          ipAddress: "192.168.1.101"
        }
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Seeded Data Summary:
- 👥 Teams: ${teams.length}
- 👤 Users: ${users.length}  
- 📦 Products: ${products.length}
- 🏢 Accounts: ${accounts.length}
- 👥 Contacts: ${contacts.length}
- 🎯 Leads: ${leads.length}
- 💰 Opportunities: ${opportunities.length}
- 🎫 Tickets: ${tickets.length}
- 📋 Activities: ${activities.length}
- 📊 Audit Logs: 2

🎉 Your CRM is now ready with sample data for immediate UI demos!
    `);

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

// Import required functions for database operations
import { eq } from "drizzle-orm";

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };