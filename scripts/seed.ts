#!/usr/bin/env tsx
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  users, 
  accounts, 
  contacts, 
  opportunities, 
  dealStages, 
  ticketStatus, 
  supportTickets,
  tasks,
  crmActivities
} from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Users with different roles
    console.log("👥 Creating users...");
    const usersData = await db.insert(users).values([
      {
        username: "admin@crm.com",
        password: "admin123", // In production, hash this
        role: "admin",
        name: "System Administrator",
        email: "admin@crm.com",
        phone: "+967-777-123456",
        department: "IT",
        position: "System Admin",
        isActive: "true"
      },
      {
        username: "manager@crm.com", 
        password: "manager123",
        role: "manager",
        name: "Sales Manager",
        email: "manager@crm.com",
        phone: "+967-777-234567",
        department: "Sales",
        position: "Sales Manager",
        isActive: "true"
      },
      {
        username: "agent@crm.com",
        password: "agent123", 
        role: "agent",
        name: "Sales Agent",
        email: "agent@crm.com",
        phone: "+967-777-345678",
        department: "Sales",
        position: "Sales Representative",
        isActive: "true"
      },
      {
        username: "viewer@crm.com",
        password: "viewer123",
        role: "viewer", 
        name: "Report Viewer",
        email: "viewer@crm.com",
        phone: "+967-777-456789",
        department: "Management",
        position: "Business Analyst",
        isActive: "true"
      }
    ]).returning();

    const [adminUser, managerUser, agentUser, viewerUser] = usersData;

    // 2. Create Deal Stages
    console.log("🎯 Creating deal stages...");
    const stagesData = await db.insert(dealStages).values([
      {
        name: "Prospecting",
        position: "1",
        probability: "10",
        color: "#ef4444",
        isClosed: "false",
        isWon: "false"
      },
      {
        name: "Qualification", 
        position: "2",
        probability: "25",
        color: "#f97316",
        isClosed: "false",
        isWon: "false"
      },
      {
        name: "Proposal",
        position: "3", 
        probability: "50",
        color: "#eab308",
        isClosed: "false",
        isWon: "false"
      },
      {
        name: "Negotiation",
        position: "4",
        probability: "75",
        color: "#3b82f6",
        isClosed: "false", 
        isWon: "false"
      },
      {
        name: "Closed Won",
        position: "5",
        probability: "100",
        color: "#10b981",
        isClosed: "true",
        isWon: "true"
      },
      {
        name: "Closed Lost",
        position: "6", 
        probability: "0",
        color: "#6b7280",
        isClosed: "true",
        isWon: "false"
      }
    ]).returning();

    // 3. Create Ticket Statuses
    console.log("🎫 Creating ticket statuses...");
    const statusData = await db.insert(ticketStatus).values([
      {
        name: "Open",
        position: "1",
        color: "#ef4444",
        isClosed: "false"
      },
      {
        name: "In Progress",
        position: "2", 
        color: "#3b82f6",
        isClosed: "false"
      },
      {
        name: "Waiting Response",
        position: "3",
        color: "#eab308", 
        isClosed: "false"
      },
      {
        name: "Resolved",
        position: "4",
        color: "#10b981",
        isClosed: "true"
      },
      {
        name: "Closed",
        position: "5",
        color: "#6b7280",
        isClosed: "true"
      }
    ]).returning();

    // 4. Create Companies (Accounts)
    console.log("🏢 Creating companies...");
    const companiesData = await db.insert(accounts).values([
      {
        name: "Tech Solutions Yemen",
        type: "customer",
        industry: "Technology",
        website: "https://techsolutions.ye",
        phone: "+967-1-234567",
        email: "contact@techsolutions.ye",
        billingAddress: {
          street: "Al-Zubairy Street",
          city: "Sana'a",
          state: "Amanat Al Asimah",
          country: "Yemen",
          postalCode: "12345"
        },
        annualRevenue: "500000",
        numberOfEmployees: "50-100",
        assignedTo: managerUser.id,
        description: "Leading technology solutions provider in Yemen",
        tags: ["technology", "software", "enterprise"],
        isActive: "true"
      },
      {
        name: "Yemen Trading Co.",
        type: "prospect", 
        industry: "Trading",
        website: "https://yementrading.com",
        phone: "+967-1-345678",
        email: "info@yementrading.com",
        billingAddress: {
          street: "Haddah Street",
          city: "Sana'a", 
          state: "Amanat Al Asimah",
          country: "Yemen",
          postalCode: "54321"
        },
        annualRevenue: "1000000",
        numberOfEmployees: "100-500",
        assignedTo: agentUser.id,
        description: "Major trading company specializing in import/export",
        tags: ["trading", "import", "export"],
        isActive: "true"
      },
      {
        name: "Digital Marketing Hub",
        type: "customer",
        industry: "Marketing",
        website: "https://digitalmarketinghub.ye", 
        phone: "+967-1-456789",
        email: "hello@digitalmarketinghub.ye",
        billingAddress: {
          street: "Ring Road",
          city: "Aden",
          state: "Aden",
          country: "Yemen", 
          postalCode: "67890"
        },
        annualRevenue: "250000",
        numberOfEmployees: "10-50",
        assignedTo: agentUser.id,
        description: "Full-service digital marketing agency",
        tags: ["marketing", "digital", "advertising"],
        isActive: "true"
      },
      {
        name: "Healthcare Solutions",
        type: "prospect",
        industry: "Healthcare",
        website: "https://healthcaresolutions.ye",
        phone: "+967-1-567890", 
        email: "contact@healthcaresolutions.ye",
        billingAddress: {
          street: "University Street",
          city: "Taiz",
          state: "Taiz",
          country: "Yemen",
          postalCode: "98765"
        },
        annualRevenue: "750000",
        numberOfEmployees: "50-100",
        assignedTo: managerUser.id,
        description: "Healthcare technology and services provider",
        tags: ["healthcare", "medical", "technology"],
        isActive: "true"
      }
    ]).returning();

    // 5. Create Contacts
    console.log("👤 Creating contacts...");
    const contactsData = await db.insert(contacts).values([
      {
        accountId: companiesData[0].id,
        name: "Ahmed Al-Rashid",
        email: "ahmed.rashid@techsolutions.ye",
        phone: "+967-777-111222",
        mobile: "+967-733-111222",
        jobTitle: "Chief Technology Officer",
        department: "Technology",
        isPrimary: "true",
        isActive: "true",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/ahmed-rashid",
          twitter: "@ahmed_rashid"
        },
        tags: ["decision-maker", "technical"],
        notes: "Very interested in cloud solutions and digital transformation"
      },
      {
        accountId: companiesData[0].id,
        name: "Fatima Al-Zahra",
        email: "fatima.zahra@techsolutions.ye",
        phone: "+967-777-222333",
        mobile: "+967-733-222333", 
        jobTitle: "Procurement Manager",
        department: "Procurement",
        isPrimary: "false",
        isActive: "true",
        socialProfiles: {},
        tags: ["procurement", "budget-authority"],
        notes: "Handles all technology procurement decisions"
      },
      {
        accountId: companiesData[1].id,
        name: "Omar Al-Hakim",
        email: "omar.hakim@yementrading.com",
        phone: "+967-777-333444",
        mobile: "+967-733-333444",
        jobTitle: "General Manager", 
        department: "Management",
        isPrimary: "true",
        isActive: "true",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/omar-hakim"
        },
        tags: ["decision-maker", "c-level"],
        notes: "Looking to modernize trading operations with digital solutions"
      },
      {
        accountId: companiesData[2].id,
        name: "Sara Al-Mansouri",
        email: "sara.mansouri@digitalmarketinghub.ye", 
        phone: "+967-777-444555",
        mobile: "+967-733-444555",
        jobTitle: "Marketing Director",
        department: "Marketing",
        isPrimary: "true",
        isActive: "true",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/sara-mansouri",
          twitter: "@sara_marketing"
        },
        tags: ["creative", "decision-maker"],
        notes: "Specializes in digital transformation for marketing agencies"
      },
      {
        accountId: companiesData[3].id,
        name: "Dr. Khalid Al-Sabri",
        email: "khalid.sabri@healthcaresolutions.ye",
        phone: "+967-777-555666",
        mobile: "+967-733-555666",
        jobTitle: "Medical Director",
        department: "Medical", 
        isPrimary: "true",
        isActive: "true",
        socialProfiles: {
          linkedin: "https://linkedin.com/in/dr-khalid-sabri"
        },
        tags: ["medical", "decision-maker"],
        notes: "Interested in healthcare IT solutions and patient management systems"
      }
    ]).returning();

    // 6. Create Opportunities 
    console.log("💰 Creating opportunities...");
    const opportunitiesData = await db.insert(opportunities).values([
      {
        name: "Cloud Infrastructure Upgrade",
        accountId: companiesData[0].id,
        contactId: contactsData[0].id,
        stageId: stagesData[2].id, // Proposal
        stage: "proposal",
        amount: "150000",
        probability: "50",
        expectedCloseDate: new Date("2025-03-15"),
        leadSource: "referral",
        description: "Complete cloud infrastructure modernization including migration and training",
        nextStep: "Schedule technical demonstration",
        assignedTo: managerUser.id,
        tags: ["cloud", "infrastructure", "high-value"],
        customFields: {
          competitor: "Local IT Company",
          estimatedImplementation: "6 months"
        }
      },
      {
        name: "ERP System Implementation", 
        accountId: companiesData[1].id,
        contactId: contactsData[2].id,
        stageId: stagesData[1].id, // Qualification
        stage: "qualification",
        amount: "300000",
        probability: "25",
        expectedCloseDate: new Date("2025-05-01"),
        leadSource: "website",
        description: "Full ERP system for trading operations management",
        nextStep: "Requirements gathering meeting",
        assignedTo: agentUser.id,
        tags: ["erp", "trading", "enterprise"],
        customFields: {
          modules: ["Inventory", "Accounting", "Sales", "Purchasing"],
          users: "150"
        }
      },
      {
        name: "Digital Marketing Platform",
        accountId: companiesData[2].id,
        contactId: contactsData[3].id,
        stageId: stagesData[3].id, // Negotiation
        stage: "negotiation",
        amount: "75000",
        probability: "75", 
        expectedCloseDate: new Date("2025-02-28"),
        leadSource: "social-media",
        description: "Custom digital marketing automation platform",
        nextStep: "Contract negotiation",
        assignedTo: agentUser.id,
        tags: ["marketing", "automation", "custom"],
        customFields: {
          integrations: ["Facebook Ads", "Google Ads", "Email Marketing"],
          timeline: "3 months"
        }
      },
      {
        name: "Healthcare Management System",
        accountId: companiesData[3].id,
        contactId: contactsData[4].id,
        stageId: stagesData[0].id, // Prospecting
        stage: "prospecting",
        amount: "200000",
        probability: "10",
        expectedCloseDate: new Date("2025-07-01"),
        leadSource: "cold-call",
        description: "Comprehensive healthcare management and patient tracking system",
        nextStep: "Initial discovery call",
        assignedTo: managerUser.id,
        tags: ["healthcare", "patient-management", "compliance"],
        customFields: {
          compliance: ["HIPAA equivalent", "Local regulations"],
          users: "200+"
        }
      }
    ]).returning();

    // 7. Create Support Tickets
    console.log("🎫 Creating support tickets...");
    await db.insert(supportTickets).values([
      {
        userId: contactsData[0].accountId,
        subject: "Login Issues with CRM System",
        description: "Users unable to login to the CRM system since this morning",
        status: "open",
        priority: "high",
        category: "technical",
        assignedTo: agentUser.id,
        statusId: statusData[0].id,
        attachments: []
      },
      {
        userId: contactsData[1].accountId,
        subject: "Feature Request: Custom Reports",
        description: "Need ability to generate custom reports for quarterly reviews",
        status: "in-progress", 
        priority: "medium",
        category: "feature-request",
        assignedTo: managerUser.id,
        statusId: statusData[1].id,
        attachments: []
      },
      {
        userId: contactsData[2].accountId,
        subject: "Training Request",
        description: "Need training session for new team members on system usage",
        status: "resolved",
        priority: "low",
        category: "general",
        assignedTo: agentUser.id,
        statusId: statusData[3].id,
        attachments: []
      }
    ]);

    // 8. Create Tasks
    console.log("📋 Creating tasks...");
    await db.insert(tasks).values([
      {
        title: "Follow up on Cloud Infrastructure proposal",
        description: "Call Ahmed to discuss technical requirements and timeline",
        type: "call",
        status: "pending",
        priority: "high",
        assignedTo: managerUser.id,
        createdBy: managerUser.id,
        relatedTo: "opportunity",
        relatedId: opportunitiesData[0].id,
        dueDate: new Date("2025-01-30"),
        estimatedDuration: "30",
        tags: ["follow-up", "proposal"],
        customFields: {
          callScript: "Focus on security and compliance requirements"
        }
      },
      {
        title: "Prepare ERP demonstration",
        description: "Set up demo environment for Yemen Trading Co. presentation",
        type: "demo",
        status: "in-progress",
        priority: "medium",
        assignedTo: agentUser.id,
        createdBy: managerUser.id,
        relatedTo: "opportunity", 
        relatedId: opportunitiesData[1].id,
        dueDate: new Date("2025-02-05"),
        estimatedDuration: "120",
        tags: ["demo", "preparation"],
        customFields: {
          modules: ["Trading", "Inventory", "Reports"]
        }
      },
      {
        title: "Contract review for Digital Marketing Platform",
        description: "Review contract terms and prepare for negotiation",
        type: "meeting",
        status: "pending",
        priority: "high",
        assignedTo: managerUser.id,
        createdBy: agentUser.id,
        relatedTo: "opportunity",
        relatedId: opportunitiesData[2].id,
        dueDate: new Date("2025-01-28"),
        estimatedDuration: "60",
        tags: ["contract", "negotiation"],
        customFields: {
          stakeholders: ["Legal", "Sales", "Customer"]
        }
      }
    ]);

    // 9. Create Activities
    console.log("📈 Creating activities...");
    await db.insert(crmActivities).values([
      {
        type: "call",
        title: "Discovery call with Tech Solutions",
        description: "Initial discovery call to understand cloud infrastructure needs",
        userId: managerUser.id,
        relatedTo: "opportunity",
        relatedId: opportunitiesData[0].id,
        metadata: {
          duration: 45,
          outcome: "positive",
          nextSteps: ["Technical requirements gathering", "Proposal preparation"]
        },
        duration: "45",
        outcome: "Positive - customer very interested in cloud migration",
        completedAt: new Date("2025-01-20T10:30:00Z")
      },
      {
        type: "email",
        title: "ERP proposal sent to Yemen Trading",
        description: "Sent detailed ERP proposal with pricing and implementation timeline",
        userId: agentUser.id,
        relatedTo: "opportunity",
        relatedId: opportunitiesData[1].id,
        metadata: {
          emailType: "proposal",
          attachments: ["ERP_Proposal_YTC.pdf", "Implementation_Timeline.xlsx"]
        },
        outcome: "Proposal delivered successfully",
        completedAt: new Date("2025-01-22T14:15:00Z")
      },
      {
        type: "meeting",
        title: "Requirements gathering with Digital Marketing Hub",
        description: "On-site meeting to gather detailed requirements for marketing platform",
        userId: agentUser.id,
        relatedTo: "opportunity", 
        relatedId: opportunitiesData[2].id,
        metadata: {
          location: "Customer office",
          attendees: ["Sara Al-Mansouri", "Technical Team", "Sales Rep"],
          documentsShared: ["Technical Specifications", "Integration Guide"]
        },
        duration: "120",
        outcome: "Clear requirements gathered, ready for proposal",
        completedAt: new Date("2025-01-25T09:00:00Z")
      }
    ]);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${usersData.length}`);
    console.log(`   🎯 Deal Stages: ${stagesData.length}`);
    console.log(`   🎫 Ticket Statuses: ${statusData.length}`);
    console.log(`   🏢 Companies: ${companiesData.length}`);
    console.log(`   👤 Contacts: ${contactsData.length}`);
    console.log(`   💰 Opportunities: ${opportunitiesData.length}`);
    console.log(`   🎫 Support Tickets: 3`);
    console.log(`   📋 Tasks: 3`);
    console.log(`   📈 Activities: 3`);
    
    console.log("\n🔐 Demo Users:");
    console.log("   Admin: admin@crm.com / admin123");
    console.log("   Manager: manager@crm.com / manager123");
    console.log("   Agent: agent@crm.com / agent123");
    console.log("   Viewer: viewer@crm.com / viewer123");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedDatabase().catch((error) => {
  console.error("❌ Seed script failed:", error);
  process.exit(1);
});