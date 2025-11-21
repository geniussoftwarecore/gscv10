#!/usr/bin/env tsx

/**
 * GSC Demo Data Seeding Script
 * 
 * Seeds the database with demo data for development and testing purposes.
 * This is separate from admin user provisioning for security.
 */

import { config } from 'dotenv';
config();

import { storage } from '../server/storage';
import { DatabaseStorage } from '../server/database-storage';

/**
 * Seeds demo data for development
 */
async function seedDemoData(): Promise<void> {
  try {
    console.log('🌱 Starting demo data seeding...');
    
    if (!(storage.instance instanceof DatabaseStorage)) {
      console.log('⚠️  Using in-memory storage - demo data will be temporary');
      return;
    }
    
    const dbStorage = storage.instance as DatabaseStorage;
    console.log('🔌 Connected to database for seeding');
    
    // Seed demo contacts
    console.log('👥 Seeding demo contacts...');
    const demoContacts = [
      {
        firstName: 'أحمد',
        lastName: 'محمد',
        primaryEmail: 'ahmed.mohammed@example.com',
        phones: ['966501234567'],
        jobTitle: 'مطور تطبيقات',
        company: 'شركة التقنية المتقدمة',
        leadSource: 'website',
        leadStatus: 'qualified',
        description: 'مهتم بتطوير تطبيق جوال للتجارة الإلكترونية'
      },
      {
        firstName: 'فاطمة',
        lastName: 'أحمد',
        primaryEmail: 'fatima.ahmed@example.com',
        phones: ['966502345678'],
        jobTitle: 'مديرة التسويق',
        company: 'مؤسسة الإبداع الرقمي',
        leadSource: 'referral',
        leadStatus: 'new',
        description: 'تبحث عن حلول التسويق الرقمي والمواقع الإلكترونية'
      },
      {
        firstName: 'محمد',
        lastName: 'علي',
        primaryEmail: 'mohammed.ali@example.com',
        phones: ['966503456789'],
        jobTitle: 'مدير تقني',
        company: 'شركة الحلول التقنية',
        leadSource: 'social_media',
        leadStatus: 'contacted',
        description: 'يحتاج نظام إدارة علاقات العملاء مخصص'
      }
    ];
    
    for (const contact of demoContacts) {
      await dbStorage.createContact(contact);
    }
    console.log(`✅ Created ${demoContacts.length} demo contacts`);
    
    // Seed demo accounts
    console.log('🏢 Seeding demo accounts...');
    const demoAccounts = [
      {
        legalName: 'شركة التقنية المتقدمة',
        industry: 'تكنولوجيا المعلومات',
        website: 'https://advanced-tech.sa',
        description: 'شركة رائدة في مجال تطوير التطبيقات والحلول التقنية',
        employeeCount: '50-100',
        annualRevenue: '1000000-5000000',
        type: 'prospect'
      },
      {
        legalName: 'مؤسسة الإبداع الرقمي',
        industry: 'التسويق الرقمي',
        website: 'https://digital-creativity.sa',
        description: 'مؤسسة متخصصة في الخدمات التسويقية الرقمية',
        employeeCount: '10-50',
        annualRevenue: '500000-1000000',
        type: 'customer'
      },
      {
        legalName: 'شركة الحلول التقنية',
        industry: 'استشارات تقنية',
        website: 'https://tech-solutions.sa',
        description: 'تقدم الاستشارات التقنية والحلول المتكاملة للشركات',
        employeeCount: '100-500',
        annualRevenue: '5000000+',
        type: 'partner'
      }
    ];
    
    for (const account of demoAccounts) {
      await dbStorage.createAccount(account);
    }
    console.log(`✅ Created ${demoAccounts.length} demo accounts`);
    
    // Seed demo opportunities
    console.log('💰 Seeding demo opportunities...');
    const demoOpportunities = [
      {
        name: 'تطوير تطبيق التجارة الإلكترونية',
        stage: 'proposal',
        expectedValue: '150000',
        probability: 75,
        closeDate: new Date('2024-12-31'),
        description: 'تطوير تطبيق جوال متكامل للتجارة الإلكترونية مع نظام دفع آمن',
        nextStep: 'مراجعة العرض الفني والمالي'
      },
      {
        name: 'حملة التسويق الرقمي الشاملة',
        stage: 'negotiation',
        expectedValue: '75000',
        probability: 60,
        closeDate: new Date('2024-11-30'),
        description: 'حملة تسويقية رقمية شاملة تتضمن إدارة وسائل التواصل الاجتماعي',
        nextStep: 'تحديد الميزانية النهائية والجدول الزمني'
      },
      {
        name: 'نظام إدارة علاقات العملاء',
        stage: 'qualification',
        expectedValue: '200000',
        probability: 40,
        closeDate: new Date('2025-02-28'),
        description: 'تطوير نظام CRM مخصص مع تكامل كامل مع الأنظمة الحالية',
        nextStep: 'تحليل المتطلبات التفصيلية'
      }
    ];
    
    for (const opportunity of demoOpportunities) {
      await dbStorage.createOpportunity(opportunity);
    }
    console.log(`✅ Created ${demoOpportunities.length} demo opportunities`);
    
    // Seed demo support tickets
    console.log('🎫 Seeding demo support tickets...');
    const demoTickets = [
      {
        subject: 'مشكلة في تسجيل الدخول إلى النظام',
        description: 'المستخدم يواجه صعوبة في تسجيل الدخول إلى لوحة التحكم',
        priority: 'high',
        status: 'open',
        type: 'technical_issue',
        category: 'authentication'
      },
      {
        subject: 'طلب تدريب على استخدام النظام',
        description: 'العميل يحتاج جلسة تدريبية لفريق العمل على استخدام النظام الجديد',
        priority: 'medium',
        status: 'in_progress',
        type: 'training_request',
        category: 'support'
      },
      {
        subject: 'تحديث البيانات في قاعدة البيانات',
        description: 'طلب تحديث معلومات الشركة وإضافة فروع جديدة',
        priority: 'low',
        status: 'resolved',
        type: 'change_request',
        category: 'data_management'
      }
    ];
    
    for (const ticket of demoTickets) {
      await dbStorage.createSupportTicket(ticket);
    }
    console.log(`✅ Created ${demoTickets.length} demo support tickets`);
    
    console.log('🎉 Demo data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo data seeding failed:', error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════');
  console.log('🌱 GSC Demo Data Seeding');
  console.log('═══════════════════════════════════════');
  
  try {
    await seedDemoData();
    console.log('═══════════════════════════════════════');
    console.log('✅ Seeding completed successfully');
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.error('❌ Seeding failed');
    console.log('═══════════════════════════════════════');
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { seedDemoData };