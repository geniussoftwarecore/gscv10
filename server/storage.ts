import { 
  type User, 
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Service,
  type InsertService,
  type ServiceSubcategory,
  type InsertServiceSubcategory,
  type Testimonial,
  type InsertTestimonial,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type UserSubscription,
  type InsertUserSubscription,
  type ServiceRequest,
  type InsertServiceRequest,
  type Lead,
  type InsertLead,
  type Contact,
  type InsertContact,
  type Account,
  type InsertAccount,
  type Opportunity,
  type InsertOpportunity,
  type Task,
  type InsertTask,
  type CrmActivity,
  type InsertCrmActivity,
  type SavedFilter,
  type InsertSavedFilter,
  type SupportTicket,
  type DealStage,
  type InsertDealStage,
  type TicketStatus,
  type InsertTicketStatus,
  type ServiceAuditLog,
  type InsertServiceAuditLog,
  type MobileAppOrder,
  type InsertMobileAppOrder,
  type WebProjectOrder,
  type InsertWebProjectOrder,
  type WebOrder,
  type InsertWebOrder,
  type DesktopOrder,
  type InsertDesktopOrder,
  type GraphicsDesignRequest,
  type InsertGraphicsDesignRequest,
  supportTickets,
  dealStages,
  ticketStatus
} from "@shared/schema";
import { randomUUID } from "crypto";
import { DatabaseStorage } from "./database-storage";
import { db } from "./db";

export interface IStorage {
  // User Management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Mobile App Orders
  createMobileAppOrder(order: InsertMobileAppOrder): Promise<MobileAppOrder>;
  getAllMobileAppOrders(): Promise<MobileAppOrder[]>;
  
  // Web Project Orders
  createWebProjectOrder(order: InsertWebProjectOrder): Promise<WebProjectOrder>;
  getAllWebProjectOrders(): Promise<WebProjectOrder[]>;
  
  // Web Orders (for Web & Platforms Development Service Wizard)
  createWebOrder(order: InsertWebOrder): Promise<WebOrder>;
  getAllWebOrders(): Promise<WebOrder[]>;
  
  // Desktop Orders  
  createDesktopOrder(order: InsertDesktopOrder): Promise<DesktopOrder>;
  getAllDesktopOrders(): Promise<DesktopOrder[]>;
  
  // Graphics Design Requests
  createGraphicsDesignRequest(request: InsertGraphicsDesignRequest): Promise<GraphicsDesignRequest>;
  getGraphicsDesignRequests(): Promise<GraphicsDesignRequest[]>;
  
  // Portfolio Management
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  
  // Services Management with Audit Support
  getAllServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | undefined>;
  createService(
    service: InsertService, 
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service>;
  updateService(
    id: string, 
    updates: Partial<Service>,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service>;
  deleteService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<boolean>;
  restoreService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service>;
  
  // Service Subcategories Management
  getAllServiceSubcategories(): Promise<ServiceSubcategory[]>;
  getServiceSubcategoriesByService(serviceId: string): Promise<ServiceSubcategory[]>;
  getServiceSubcategoriesByCategory(category: string): Promise<ServiceSubcategory[]>;
  getServiceSubcategoryById(id: string): Promise<ServiceSubcategory | undefined>;
  createServiceSubcategory(subcategory: InsertServiceSubcategory): Promise<ServiceSubcategory>;
  
  // Portfolio Management  
  getAllPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]>;
  
  // Subscription Plans
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlansByService(serviceId: string): Promise<SubscriptionPlan[]>;
  
  // User Subscriptions
  getUserSubscriptions(userId: string): Promise<UserSubscription[]>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  
  // Service Requests
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequests(): Promise<ServiceRequest[]>;
  
  // User Management Extensions
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Subscription Plans
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlansByService(serviceId: string): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // User Subscriptions
  getUserSubscriptions(userId: string): Promise<UserSubscription[]>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  
  // Service Requests
  getServiceRequests(userId?: string): Promise<ServiceRequest[]>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  
  // CRM - Leads Management
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;
  getLeadsByAssignee(userId: string): Promise<Lead[]>;
  convertLeadToContact(leadId: string, accountId?: string): Promise<Contact>;
  
  // CRM - Contacts Management
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, updates: Partial<Contact>): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
  getContactsByAccount(accountId: string): Promise<Contact[]>;
  
  // CRM - Accounts Management
  getAllAccounts(): Promise<Account[]>;
  getAccountById(id: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, updates: Partial<Account>): Promise<Account>;
  deleteAccount(id: string): Promise<boolean>;
  getAccountsByAssignee(userId: string): Promise<Account[]>;
  
  // CRM - Opportunities Management
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity>;
  deleteOpportunity(id: string): Promise<boolean>;
  getOpportunitiesByAccount(accountId: string): Promise<Opportunity[]>;
  getOpportunitiesByAssignee(userId: string): Promise<Opportunity[]>;
  
  // CRM - Tasks Management
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  getTasksByAssignee(userId: string): Promise<Task[]>;
  getTasksByRelatedEntity(relatedTo: string, relatedId: string): Promise<Task[]>;
  
  // CRM - Activities
  getAllActivities(): Promise<CrmActivity[]>;
  getActivityById(id: string): Promise<CrmActivity | undefined>;
  createActivity(activity: InsertCrmActivity): Promise<CrmActivity>;
  getActivitiesByRelatedEntity(relatedTo: string, relatedId: string): Promise<CrmActivity[]>;
  getActivitiesByUser(userId: string): Promise<CrmActivity[]>;
  
  // Saved Filters
  getSavedFilters(userId: string): Promise<SavedFilter[]>;
  createSavedFilter(filter: InsertSavedFilter): Promise<SavedFilter>;
  updateSavedFilter(id: string, updates: Partial<SavedFilter>): Promise<SavedFilter>;
  deleteSavedFilter(id: string): Promise<boolean>;
  
  // Deal Stages Management
  getAllDealStages(): Promise<DealStage[]>;
  createDealStage(stage: InsertDealStage): Promise<DealStage>;
  updateDealStage(id: string, updates: Partial<DealStage>): Promise<DealStage>;
  deleteDealStage(id: string): Promise<boolean>;
  
  // Ticket Status Management
  getAllTicketStatus(): Promise<TicketStatus[]>;
  createTicketStatus(status: InsertTicketStatus): Promise<TicketStatus>;
  updateTicketStatus(id: string, updates: Partial<TicketStatus>): Promise<TicketStatus>;
  deleteTicketStatus(id: string): Promise<boolean>;
  
  // Search
  searchEntities(query: string, entities: string[]): Promise<any[]>;
  
  // Enhanced Table Operations
  getTableData(tableName: string, options: {
    offset?: number;
    limit?: number;
    search?: string;
    sorts?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    filters?: Array<{ field: string; operator: string; value: any }>;
    columns?: string[];
    export?: boolean;
  }): Promise<{ data: any[]; total: number }>;
  
  // Saved Views
  getSavedViews(userId: string, endpoint: string): Promise<any[]>;
  createSavedView(view: any): Promise<any>;
  deleteSavedView(id: string, userId: string): Promise<boolean>;
}

// Initialize storage based on database availability - Enhanced with production safety
function createStorage(): IStorage {
  const isProduction = process.env.NODE_ENV === 'production' || 
                      process.env.REPLIT_DEPLOYMENT === 'true' ||
                      process.env.NODE_ENV === 'staging';

  if (db) {
    console.log("Creating PostgreSQL database storage");
    return new DatabaseStorage();
  } else {
    if (isProduction) {
      // منع فقدان البيانات - Critical Production Protection
      throw new Error("CRITICAL: Database storage required in production. In-memory storage BLOCKED to prevent data loss.");
    }
    console.log("Creating in-memory storage (development only)");
    return new MemStorage();
  }
}

let storageInstance: IStorage | null = null;

export function initializeStorage(): IStorage {
  if (!storageInstance) {
    storageInstance = createStorage();
  }
  return storageInstance;
}

export const storage = {
  get instance(): IStorage {
    if (!storageInstance) {
      throw new Error("Storage not initialized. Call initializeStorage() first.");
    }
    return storageInstance;
  }
};

// Export a singleton instance for backwards compatibility
let memStorageInstance: MemStorage | null = null;

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private portfolioItems: Map<string, PortfolioItem>;
  private services: Map<string, Service>;
  private serviceSubcategories: Map<string, ServiceSubcategory>;
  private testimonials: Map<string, Testimonial>;
  private subscriptionPlans: Map<string, SubscriptionPlan>;
  private userSubscriptions: Map<string, UserSubscription>;
  private serviceRequests: Map<string, ServiceRequest>;
  private leads: Map<string, Lead>;
  private contacts: Map<string, Contact>;
  private accounts: Map<string, Account>;
  private opportunities: Map<string, Opportunity>;
  private tasks: Map<string, Task>;
  private activities: Map<string, CrmActivity>;
  private savedFilters: Map<string, SavedFilter>;
  private supportTickets: Map<string, SupportTicket>;
  private dealStages: Map<string, DealStage>;
  private ticketStatuses: Map<string, TicketStatus>;
  private mobileAppOrders: Map<string, MobileAppOrder>;
  private webProjectOrders: Map<string, WebProjectOrder>;
  private webOrders: Map<string, WebOrder>;
  private desktopOrders: Map<string, DesktopOrder>;
  private graphicsDesignRequests: Map<string, GraphicsDesignRequest>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.portfolioItems = new Map();
    this.services = new Map();
    this.serviceSubcategories = new Map();
    this.testimonials = new Map();
    this.subscriptionPlans = new Map();
    this.userSubscriptions = new Map();
    this.serviceRequests = new Map();
    this.leads = new Map();
    this.contacts = new Map();
    this.accounts = new Map();
    this.opportunities = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.savedFilters = new Map();
    this.supportTickets = new Map();
    this.dealStages = new Map();
    this.ticketStatuses = new Map();
    this.mobileAppOrders = new Map();
    this.webProjectOrders = new Map();
    this.webOrders = new Map();
    this.desktopOrders = new Map();
    this.graphicsDesignRequests = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminUser: User = {
      id: "admin-001",
      username: "admin@geniussoftwarecore.com",
      password: "123", // In production, this should be hashed
      password_hash: null,
      force_password_change: false,
      role: "admin",
      name: "مدير النظام",
      email: "admin@geniussoftwarecore.com",
      phone: null,
      department: "الإدارة",
      position: "مدير عام",
      avatar: null,
      isActive: "true",
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    // Create additional sample users for CRM demo
    const salesUser: User = {
      id: "sales-001",
      username: "sales@geniussoftwarecore.com",
      password: "123",
      password_hash: null,
      force_password_change: false,
      role: "sales",
      name: "أحمد محمد",
      email: "sales@geniussoftwarecore.com",
      phone: "+966501234567",
      department: "المبيعات",
      position: "مدير مبيعات",
      avatar: null,
      isActive: "true",
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const supportUser: User = {
      id: "support-001",
      username: "support@geniussoftwarecore.com", 
      password: "123",
      password_hash: null,
      force_password_change: false,
      role: "support",
      name: "فاطمة علي",
      email: "support@geniussoftwarecore.com",
      phone: "+966507654321",
      department: "الدعم الفني",
      position: "أخصائي دعم فني",
      avatar: null,
      isActive: "true",
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(salesUser.id, salesUser);
    this.users.set(supportUser.id, supportUser);

    // Initialize Deal Stages
    const defaultDealStages: DealStage[] = [
      {
        id: "stage-1",
        name: "التأهيل",
        position: "1",
        probability: "10",
        color: "#3b82f6",
        isClosed: "false",
        isWon: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "stage-2", 
        name: "الاقتراح",
        position: "2",
        probability: "25",
        color: "#f59e0b",
        isClosed: "false",
        isWon: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "stage-3",
        name: "التفاوض",
        position: "3", 
        probability: "60",
        color: "#10b981",
        isClosed: "false",
        isWon: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "stage-4",
        name: "مربحة",
        position: "4",
        probability: "100",
        color: "#059669",
        isClosed: "true",
        isWon: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "stage-5",
        name: "خاسرة",
        position: "5",
        probability: "0",
        color: "#dc2626",
        isClosed: "true",
        isWon: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultDealStages.forEach(stage => this.dealStages.set(stage.id, stage));

    // Initialize Ticket Statuses
    const defaultTicketStatuses: TicketStatus[] = [
      {
        id: "status-1",
        name: "جديد",
        position: "1",
        color: "#3b82f6",
        isClosed: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "status-2",
        name: "قيد المعالجة",
        position: "2",
        color: "#f59e0b",
        isClosed: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "status-3",
        name: "في الانتظار",
        position: "3",
        color: "#8b5cf6",
        isClosed: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "status-4",
        name: "محلول",
        position: "4",
        color: "#10b981",
        isClosed: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "status-5",
        name: "مغلق",
        position: "5",
        color: "#6b7280",
        isClosed: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultTicketStatuses.forEach(status => this.ticketStatuses.set(status.id, status));

    // Sample services - إصلاح البيانات لضمان الثبات والحماية
    const sampleServices: Service[] = [
      {
        id: "66b131cc-ccec-49a7-b832-972f4ba29a7b",
        title: "تطوير تطبيقات الموبايل",
        description: "نطور تطبيقات احترافية وسريعة الاستجابة لأنظمة iOS و Android بأحدث التقنيات والمعايير العالمية مع واجهات مستخدم حديثة وتجربة استخدام مميزة",
        icon: "smartphone",
        category: "mobile",
        featured: "false",
        technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
        deliveryTime: "4-8 أسابيع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "562fce34-abbd-4ba9-abc5-bc6b4afe61c7",
        title: "تطوير المواقع والمنصات",
        description: "إنشاء مواقع ومنصات إلكترونية متطورة وسريعة الاستجابة بتصميم جذاب وأداء عالي مع أنظمة إدارة محتوى سهلة الاستخدام",
        icon: "code",
        category: "web",
        featured: "true",
        technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
        deliveryTime: "3-6 أسابيع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "d7e8f9g0-h1i2-j3k4-l5m6-n7o8p9q0r1s2",
        title: "تطوير تطبيقات سطح المكتب",
        description: "تطوير تطبيقات سطح المكتب الاحترافية والقوية لأنظمة Windows و macOS و Linux باستخدام أحدث التقنيات والأدوات المتطورة. نقدم حلولاً شاملة من البرمجيات البسيطة إلى الأنظمة المؤسسية المعقدة مع واجهات مستخدم عصرية وأداء استثنائي وتكامل مثالي مع أنظمة التشغيل",
        icon: "monitor",
        category: "desktop",
        featured: "true",
        technologies: ["Electron", ".NET Core", "Qt Framework", "JavaFX", "C# WPF", "Python PyQt", "C++ MFC", "Cross-Platform"],
        deliveryTime: "6-12 أسبوع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "m9n8b7v6-c5x4-z3a2-s1d0-f9g8h7j6k5l4",
        title: "الحلول الذكية والبرمجية للهواتف الذكية",
        description: "تطوير حلول برمجية ذكية ومبتكرة للهواتف الذكية مع تقنيات الذكاء الاصطناعي والتعلم الآلي. نقدم تطبيقات ذكية تتعلم من سلوك المستخدمين وتقدم تجارب مخصصة، بما في ذلك معالجة الصور والنصوص، التعرف على الأنماط، الدردشة الذكية، والتحليلات المتقدمة. حلول متطورة تدمج قوة الذكاء الاصطناعي في راحة يدك",
        icon: "brain-circuit",
        category: "smart-mobile",
        featured: "true",
        technologies: ["AI/ML Integration", "TensorFlow Mobile", "Core ML", "OpenAI API", "Computer Vision", "NLP", "React Native AI", "Smart Analytics", "Predictive Models"],
        deliveryTime: "8-16 أسبوع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "9a6c839d-2a5c-4418-832a-2a5bd14dcf7e",
        title: "تصميم الجرافيكس والهوية البصرية",
        description: "تصميم الشعارات والهوية البصرية والمواد التسويقية الإبداعية التي تعكس قيم علامتك التجارية وتجذب العملاء",
        icon: "palette",
        category: "design",
        featured: "false",
        technologies: ["Adobe Creative Suite", "Figma", "Sketch", "Illustrator", "Photoshop"],
        deliveryTime: "1-3 أسابيع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "e4f7b3d1-8c9a-4b5d-9e2f-1a3c5d7e9f1b",
        title: "التسويق الرقمي والإعلانات",
        description: "استراتيجيات تسويق رقمية شاملة وحملات إعلانية مدروسة على منصات التواصل الاجتماعي ومحركات البحث لزيادة المبيعات والوصول",
        icon: "megaphone",
        category: "marketing",
        featured: "false",
        technologies: ["Google Ads", "Facebook Ads", "Instagram", "LinkedIn", "Analytics"],
        deliveryTime: "مستمر",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "f5a8c2b4-7d6e-4c9f-8a1b-3e5g7h9i2j4k",
        title: "الحلول الذكية والذكاء الاصطناعي",
        description: "تطوير حلول برمجية ذكية ومتقدمة باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي لأتمتة العمليات وتحسين الكفاءة",
        icon: "brain",
        category: "smart",
        featured: "false",
        technologies: ["Python", "TensorFlow", "OpenAI API", "Machine Learning", "Computer Vision"],
        deliveryTime: "6-12 أسبوع",
        startingPrice: null,
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      },
      {
        id: "be5527f7-3381-48f8-9ff2-21132038ae59",
        title: "أنظمة إدارة موارد المؤسسات - ERPNext v15",
        description: "أحدث إصدار من ERPNext مع تحسينات جذرية، أداء محسّن بنسبة 40%، أمان عالي المستوى، وباقات شاملة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبيرة",
        icon: "settings",
        category: "erp",
        featured: "true",
        technologies: ["ERPNext v15", "Python", "Frappe Framework", "MariaDB", "Redis", "Espresso UI"],
        deliveryTime: "8-16 أسبوع",
        startingPrice: "2500", // تصحيح نوع البيانات - string بدلاً من number
        // حقول الحماية والتدقيق
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        createdBy: "admin-001",
        updatedBy: "admin-001"
      }
    ];

    sampleServices.forEach(service => this.services.set(service.id, service));

    // Sample portfolio items with comprehensive details
    const samplePortfolio: PortfolioItem[] = [
      {
        id: randomUUID(),
        slug: "ecommerce-mobile-app",
        title: "تطبيق سوق الذهب - منصة التجارة الإلكترونية",
        description: "تطبيق شامل للتسوق الإلكتروني مع واجهة حديثة ونظام دفع متقدم",
        fullDescription: "منصة تجارة إلكترونية متكاملة تخدم أكثر من 50,000 مستخدم يومياً. تتضمن نظام إدارة المنتجات، عربة التسوق الذكية، نظام دفع آمن، وتتبع الطلبات في الوقت الفعلي. تم تطويرها بأحدث تقنيات React Native مع واجهة مستخدم سلسة ومتجاوبة.",
        category: "mobile",
        industry: "E-commerce",
        services: ["تطوير التطبيقات", "تصميم UX/UI", "نظم الدفع"],
        imageUrl: "shopping-cart",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "الشاشة الرئيسية", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "صفحة المنتج", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "عربة التسوق", type: "image" },
          { id: "4", url: "/api/placeholder/400/300", alt: "نظام الدفع", type: "image" }
        ],
        projectUrl: "https://github.com/geniussoftware/gold-market",
        liveUrl: "https://goldmarket.sa",
        technologies: ["React Native", "Node.js", "MongoDB", "Stripe API", "Firebase"],
        featured: "true",
        year: "2024",
        duration: "6 أشهر",
        teamSize: "8 مطورين",
        budget: "150,000 ريال",
        client: {
          name: "أحمد المالكي",
          company: "مجوهرات الذهب السعودي",
          position: "المدير التنفيذي",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "زيادة المبيعات", value: "+250%", description: "نمو المبيعات خلال 6 أشهر", icon: "trending-up" },
          { label: "المستخدمين النشطين", value: "50k+", description: "مستخدم يومي", icon: "users" },
          { label: "معدل التحويل", value: "18%", description: "من الزيارة للشراء", icon: "target" },
          { label: "تقييم المستخدمين", value: "4.8/5", description: "في متاجر التطبيقات", icon: "star" }
        ],
        testimonial: {
          content: "تطبيق رائع غير مجرى أعمالنا تماماً. زادت مبيعاتنا بنسبة 250% وحصلنا على عملاء من جميع أنحاء المملكة.",
          author: "أحمد المالكي",
          position: "المدير التنفيذي - مجوهرات الذهب السعودي",
          rating: 5
        },
        tags: ["تجارة إلكترونية", "تطبيق محمول", "نظام دفع", "React Native"],
        views: "1250",
        likes: "85",
        status: "published",
        seoTitle: "تطبيق سوق الذهب - دراسة حالة تطوير تطبيق التجارة الإلكترونية",
        seoDescription: "تعرف على كيفية تطوير تطبيق تجارة إلكترونية ناجح حقق نمو 250% في المبيعات",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-20')
      },
      {
        id: randomUUID(),
        slug: "government-portal",
        title: "البوابة الحكومية الموحدة",
        description: "منصة رقمية شاملة لتقديم الخدمات الحكومية للمواطنين",
        fullDescription: "بوابة إلكترونية موحدة تجمع أكثر من 200 خدمة حكومية في منصة واحدة. تتضمن نظام هوية رقمية، دفع إلكتروني، وتتبع معاملات. خدمت أكثر من مليون مواطن وقللت وقت إنجاز المعاملات بنسبة 80%.",
        category: "web",
        industry: "Government",
        services: ["تطوير المواقع", "الأمن السيبراني", "تكامل الأنظمة"],
        imageUrl: "building",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "الصفحة الرئيسية", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "لوحة المواطن", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "الخدمات الحكومية", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://gov.portal.sa",
        technologies: ["React", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        featured: "true",
        year: "2023",
        duration: "12 شهر",
        teamSize: "15 مطور",
        budget: "2,500,000 ريال",
        client: {
          name: "د. محمد العتيبي",
          company: "وزارة التحول الرقمي",
          position: "وكيل الوزارة",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "المستخدمين المسجلين", value: "1M+", description: "مواطن مسجل", icon: "users" },
          { label: "المعاملات المنجزة", value: "5M+", description: "معاملة شهرياً", icon: "file-check" },
          { label: "توفير الوقت", value: "80%", description: "تقليل وقت المعاملات", icon: "clock" },
          { label: "رضا المستخدمين", value: "92%", description: "معدل الرضا", icon: "heart" }
        ],
        testimonial: {
          content: "مشروع استثنائي حقق التحول الرقمي الحقيقي. وفرنا ملايين الساعات من أوقات المواطنين وحققنا هدف الرؤية 2030.",
          author: "د. محمد العتيبي",
          position: "وكيل وزارة التحول الرقمي",
          rating: 5
        },
        tags: ["حكومي", "تحول رقمي", "خدمات إلكترونية", "React"],
        views: "2800",
        likes: "156",
        status: "published",
        seoTitle: "البوابة الحكومية الموحدة - مشروع التحول الرقمي الحكومي",
        seoDescription: "دراسة حالة تطوير البوابة الحكومية التي خدمت مليون مواطن ووفرت 80% من الوقت",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: randomUUID(),
        slug: "healthcare-management-system",
        title: "نظام إدارة المستشفيات الذكي",
        description: "نظام شامل لإدارة المرضى والمواعيد والملفات الطبية",
        fullDescription: "نظام إدارة مستشفيات متكامل يخدم أكثر من 10 مستشفيات بـ 500 سرير. يشمل إدارة المرضى، الملفات الطبية الإلكترونية، نظام المواعيد، إدارة الصيدلية، والتقارير الطبية. حقق تحسن 60% في كفاءة العمليات الطبية.",
        category: "web",
        industry: "Healthcare",
        services: ["تطوير الأنظمة", "قواعد البيانات", "الأمن الطبي"],
        imageUrl: "heart-pulse",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "لوحة الطبيب", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "سجل المريض", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "نظام المواعيد", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://hospital.health.sa",
        technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "WebRTC"],
        featured: "true",
        year: "2023",
        duration: "10 أشهر",
        teamSize: "12 مطور",
        budget: "800,000 ريال",
        client: {
          name: "د. سارة الأحمدي",
          company: "مجمع الملك فهد الطبي",
          position: "مديرة تقنية المعلومات",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "تحسين الكفاءة", value: "+60%", description: "في العمليات الطبية", icon: "trending-up" },
          { label: "المرضى المخدومين", value: "100k+", description: "مريض سنوياً", icon: "users" },
          { label: "توفير الأوراق", value: "90%", description: "تقليل الاستهلاك", icon: "leaf" },
          { label: "دقة التشخيص", value: "+40%", description: "تحسين دقة البيانات", icon: "target" }
        ],
        testimonial: {
          content: "النظام أحدث نقلة نوعية في عملنا. وفرنا الكثير من الوقت وحسنا جودة الخدمة الطبية للمرضى بشكل كبير.",
          author: "د. سارة الأحمدي",
          position: "مديرة تقنية المعلومات - مجمع الملك فهد الطبي",
          rating: 5
        },
        tags: ["صحي", "إدارة مستشفيات", "نظام طبي", "Vue.js"],
        views: "1890",
        likes: "127",
        status: "published",
        seoTitle: "نظام إدارة المستشفيات الذكي - حلول الرعاية الصحية الرقمية",
        seoDescription: "تعرف على نظام إدارة المستشفيات الذي حسن كفاءة العمليات الطبية بنسبة 60%",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2023-08-20'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: randomUUID(),
        slug: "education-platform",
        title: "منصة التعليم الإلكتروني المتقدمة",
        description: "منصة شاملة للتعلم عن بُعد مع فصول افتراضية وذكاء اصطناعي",
        fullDescription: "منصة تعليمية متطورة تخدم أكثر من 50,000 طالب و 2,000 معلم. تتضمن فصول افتراضية تفاعلية، نظام إدارة التعلم، اختبارات ذكية، وتحليلات أداء مدعومة بالذكاء الاصطناعي. استخدمت خلال جائحة كوفيد-19 لضمان استمرارية التعليم.",
        category: "web",
        industry: "Education",
        services: ["تطوير المنصات", "الذكاء الاصطناعي", "البث المباشر"],
        imageUrl: "graduation-cap",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "الفصل الافتراضي", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "لوحة الطالب", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "نظام الاختبارات", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://edu.platform.sa",
        technologies: ["React", "Node.js", "WebRTC", "Socket.io", "AI/ML"],
        featured: "true",
        year: "2022",
        duration: "8 أشهر",
        teamSize: "10 مطورين",
        budget: "600,000 ريال",
        client: {
          name: "د. عبدالله الرشيد",
          company: "وزارة التعليم",
          position: "مدير التحول الرقمي",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "الطلاب المسجلين", value: "50k+", description: "طالب نشط", icon: "users" },
          { label: "ساعات التعلم", value: "2M+", description: "ساعة تعليمية", icon: "clock" },
          { label: "معدل الإنجاز", value: "85%", description: "إكمال الكورسات", icon: "check-circle" },
          { label: "رضا المعلمين", value: "94%", description: "تقييم المنصة", icon: "heart" }
        ],
        testimonial: {
          content: "منصة استثنائية ساعدتنا في الحفاظ على جودة التعليم خلال الجائحة. الطلاب أحبوا التفاعل والمعلمون تكيفوا بسرعة.",
          author: "د. عبدالله الرشيد",
          position: "مدير التحول الرقمي - وزارة التعليم",
          rating: 5
        },
        tags: ["تعليم", "منصة تعليمية", "فصول افتراضية", "ذكاء اصطناعي"],
        views: "2200",
        likes: "198",
        status: "published",
        seoTitle: "منصة التعليم الإلكتروني - حلول التعليم عن بُعد المتقدمة",
        seoDescription: "دراسة حالة منصة تعليمية تخدم 50 ألف طالب مع فصول افتراضية وذكاء اصطناعي",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2022-09-15'),
        updatedAt: new Date('2023-12-05')
      },
      {
        id: randomUUID(),
        slug: "logistics-management-system",
        title: "نظام إدارة اللوجستيات والشحن",
        description: "منصة شاملة لإدارة الشحنات وتتبع المركبات في الوقت الفعلي",
        fullDescription: "نظام لوجستيات متطور يدير أكثر من 1000 مركبة و 50,000 شحنة شهرياً. يتضمن تتبع GPS في الوقت الفعلي، تحسين المسارات بالذكاء الاصطناعي، إدارة السائقين، ونظام فوترة متكامل. قلل تكاليف الوقود بنسبة 30% وحسن كفاءة التسليم.",
        category: "web",
        industry: "Logistics",
        services: ["تطوير الأنظمة", "تتبع GPS", "ذكاء اصطناعي"],
        imageUrl: "zap",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "خريطة التتبع", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "لوحة السائق", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "تقارير الأداء", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://logistics.fast.sa",
        technologies: ["Angular", "Spring Boot", "PostgreSQL", "Redis", "GPS API"],
        featured: "false",
        year: "2023",
        duration: "7 أشهر",
        teamSize: "9 مطورين",
        budget: "450,000 ريال",
        client: {
          name: "خالد العنزي",
          company: "شركة الشحن السريع",
          position: "المدير العام",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "تقليل التكاليف", value: "-30%", description: "في استهلاك الوقود", icon: "trending-down" },
          { label: "الشحنات الشهرية", value: "50k+", description: "شحنة مُدارة", icon: "package" },
          { label: "دقة التسليم", value: "95%", description: "في الوقت المحدد", icon: "clock" },
          { label: "رضا العملاء", value: "88%", description: "تقييم الخدمة", icon: "heart" }
        ],
        testimonial: {
          content: "النظام أحدث ثورة في عملياتنا. وفرنا آلاف الريالات شهرياً وأصبح عملاؤنا أكثر رضا عن خدمة التوصيل.",
          author: "خالد العنزي",
          position: "المدير العام - شركة الشحن السريع",
          rating: 4
        },
        tags: ["لوجستيات", "تتبع", "شحن", "GPS"],
        views: "980",
        likes: "67",
        status: "published",
        seoTitle: "نظام إدارة اللوجستيات والشحن - حلول الشحن الذكية",
        seoDescription: "تعرف على نظام اللوجستيات الذي قلل تكاليف الوقود 30% وحسن دقة التسليم إلى 95%",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2023-04-12'),
        updatedAt: new Date('2023-11-28')
      },
      {
        id: randomUUID(),
        slug: "fintech-banking-app",
        title: "تطبيق البنك الرقمي الشامل",
        description: "تطبيق مصرفي متكامل مع محفظة رقمية وخدمات مالية متقدمة",
        fullDescription: "تطبيق مصرفي رقمي متطور يخدم أكثر من 200,000 عميل. يتضمن إدارة الحسابات، التحويلات الفورية، محفظة رقمية، خدمات الاستثمار، وقروض فورية. مبني بأعلى معايير الأمان السيبراني والامتثال المصرفي.",
        category: "mobile",
        industry: "Finance",
        services: ["تطوير التطبيقات", "الأمن السيبراني", "خدمات مالية"],
        imageUrl: "smartphone",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "الصفحة الرئيسية", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "التحويلات", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "الاستثمار", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://app.digitalbank.sa",
        technologies: ["Flutter", "Dart", "Firebase", "Blockchain", "AI/ML"],
        featured: "true",
        year: "2024",
        duration: "9 أشهر",
        teamSize: "14 مطور",
        budget: "1,200,000 ريال",
        client: {
          name: "د. منى الحربي",
          company: "البنك الرقمي السعودي",
          position: "رئيسة التقنية",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "العملاء النشطين", value: "200k+", description: "عميل مسجل", icon: "users" },
          { label: "المعاملات اليومية", value: "1M+", description: "معاملة مالية", icon: "credit-card" },
          { label: "معدل الأمان", value: "99.9%", description: "حماية البيانات", icon: "shield" },
          { label: "تقييم المتاجر", value: "4.7/5", description: "في متاجر التطبيقات", icon: "star" }
        ],
        testimonial: {
          content: "تطبيق ثوري في عالم الخدمات المصرفية الرقمية. سهولة الاستخدام والأمان العالي جعل عملاءنا يثقون بنا أكثر.",
          author: "د. منى الحربي",
          position: "رئيسة التقنية - البنك الرقمي السعودي",
          rating: 5
        },
        tags: ["مالي", "بنك رقمي", "محفظة", "أمان"],
        views: "3200",
        likes: "245",
        status: "published",
        seoTitle: "تطبيق البنك الرقمي - حلول الخدمات المصرفية المتطورة",
        seoDescription: "دراسة حالة تطبيق مصرفي رقمي يخدم 200 ألف عميل بمليون معاملة يومية",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-04-15')
      },
      {
        id: randomUUID(),
        slug: "industrial-iot-system",
        title: "نظام إنترنت الأشياء الصناعي",
        description: "منصة مراقبة وتحكم ذكية للمصانع والمنشآت الصناعية",
        fullDescription: "نظام IoT صناعي متطور يراقب أكثر من 5,000 جهاز في 15 مصنع. يتضمن مراقبة الآلات في الوقت الفعلي، صيانة تنبؤية، تحليل البيانات الضخمة، وأتمتة العمليات الصناعية. قلل أوقات التوقف بنسبة 45% وزاد الإنتاجية 35%.",
        category: "web",
        industry: "Industrial",
        services: ["إنترنت الأشياء", "تحليل البيانات", "أتمتة صناعية"],
        imageUrl: "settings",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "لوحة المراقبة", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "مؤشرات الآلات", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "تقارير الإنتاج", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://iot.industry.sa",
        technologies: ["React", "Python", "InfluxDB", "MQTT", "TensorFlow"],
        featured: "false",
        year: "2023",
        duration: "11 شهر",
        teamSize: "16 مطور",
        budget: "950,000 ريال",
        client: {
          name: "م. سعد الدوسري",
          company: "مصانع المستقبل الصناعية",
          position: "مدير التقنية",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "تقليل التوقف", value: "-45%", description: "أوقات الصيانة", icon: "trending-down" },
          { label: "زيادة الإنتاج", value: "+35%", description: "كفاءة الإنتاج", icon: "trending-up" },
          { label: "الأجهزة المراقبة", value: "5k+", description: "جهاز IoT", icon: "cpu" },
          { label: "توفير التكاليف", value: "2M ريال", description: "سنوياً", icon: "dollar-sign" }
        ],
        testimonial: {
          content: "النظام غير مفهومنا للصناعة الذكية. الآن نتوقع الأعطال قبل حدوثها ونحسن الإنتاج باستمرار.",
          author: "م. سعد الدوسري",
          position: "مدير التقنية - مصانع المستقبل الصناعية",
          rating: 5
        },
        tags: ["صناعي", "إنترنت الأشياء", "ذكاء اصطناعي", "أتمتة"],
        views: "1450",
        likes: "89",
        status: "published",
        seoTitle: "نظام إنترنت الأشياء الصناعي - حلول الصناعة الذكية",
        seoDescription: "تعرف على نظام IoT الصناعي الذي قلل أوقات التوقف 45% وزاد الإنتاجية 35%",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2023-02-08'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: randomUUID(),
        slug: "media-streaming-platform",
        title: "منصة البث المرئي والصوتي",
        description: "منصة بث محتوى متطورة مع ذكاء اصطناعي لتخصيص المحتوى",
        fullDescription: "منصة بث محتوى متقدمة تخدم أكثر من 500,000 مشترك. تتضمن بث فيديو عالي الجودة، توصيات ذكية بالذكاء الاصطناعي، نظام اشتراكات متدرج، وتحليلات مشاهدة متطورة. تدعم البث المباشر والمحتوى المسجل مع جودة 4K.",
        category: "web",
        industry: "Media",
        services: ["تطوير المنصات", "بث الفيديو", "ذكاء اصطناعي"],
        imageUrl: "monitor",
        coverImage: "/api/placeholder/800/600",
        gallery: [
          { id: "1", url: "/api/placeholder/400/300", alt: "واجهة المشاهدة", type: "image" },
          { id: "2", url: "/api/placeholder/400/300", alt: "التوصيات الذكية", type: "image" },
          { id: "3", url: "/api/placeholder/400/300", alt: "لوحة المحتوى", type: "image" }
        ],
        projectUrl: "",
        liveUrl: "https://stream.media.sa",
        technologies: ["Vue.js", "Node.js", "FFmpeg", "CDN", "AI/ML"],
        featured: "false",
        year: "2023",
        duration: "8 أشهر",
        teamSize: "11 مطور",
        budget: "700,000 ريال",
        client: {
          name: "أحمد الشهري",
          company: "شبكة الإعلام الرقمي",
          position: "المدير التقني",
          logo: "/api/placeholder/100/100"
        },
        kpis: [
          { label: "المشتركين النشطين", value: "500k+", description: "مشترك فعال", icon: "users" },
          { label: "ساعات المشاهدة", value: "10M+", description: "ساعة شهرياً", icon: "play" },
          { label: "معدل الاستبقاء", value: "78%", description: "بقاء المشتركين", icon: "heart" },
          { label: "جودة البث", value: "99.5%", description: "وقت التشغيل", icon: "signal" }
        ],
        testimonial: {
          content: "منصة رائعة منافسة للعالمية. جودة البث ممتازة والتوصيات الذكية زادت مشاهدات المحتوى بشكل كبير.",
          author: "أحمد الشهري",
          position: "المدير التقني - شبكة الإعلام الرقمي",
          rating: 4
        },
        tags: ["إعلام", "بث فيديو", "ذكاء اصطناعي", "منصة"],
        views: "1680",
        likes: "134",
        status: "published",
        seoTitle: "منصة البث المرئي والصوتي - حلول الإعلام الرقمي المتطورة",
        seoDescription: "دراسة حالة منصة بث رقمية تخدم 500 ألف مشترك مع 10 مليون ساعة مشاهدة شهرياً",
        socialImage: "/api/placeholder/1200/630",
        createdAt: new Date('2023-05-18'),
        updatedAt: new Date('2024-03-10')
      }
    ];

    samplePortfolio.forEach(item => this.portfolioItems.set(item.id, item));

    // Sample testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: randomUUID(),
        name: "أحمد محمد",
        position: "مدير عام",
        company: "شركة التجارة الذكية",
        content: "تجربة ممتازة مع فريق Genius Software Core. أنجزوا تطبيق متجرنا الإلكتروني بجودة عالية وفي الوقت المحدد.",
        rating: "5"
      },
      {
        id: randomUUID(),
        name: "سارة أحمد",
        position: "مديرة التسويق",
        company: "مجموعة الإبداع",
        content: "فريق محترف ومبدع. ساعدونا في تطوير موقعنا الإلكتروني وتحسين حضورنا الرقمي بشكل ملحوظ.",
        rating: "5"
      },
      {
        id: randomUUID(),
        name: "محمد علي",
        position: "المدير التنفيذي",
        company: "مصنع الرواد",
        content: "نظام ERP الذي طوروه لنا غير طريقة عملنا تماماً. الآن نحن أكثر تنظيماً وكفاءة.",
        rating: "5"
      }
    ];

    sampleTestimonials.forEach(testimonial => this.testimonials.set(testimonial.id, testimonial));

    // Initialize subscription plans after services are created
    this.initializeSubscriptionPlans();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "client",
      name: insertUser.name || null,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      department: insertUser.department || null,
      position: insertUser.position || null,
      avatar: insertUser.avatar || null,
      password_hash: insertUser.password_hash || null,
      force_password_change: insertUser.force_password_change ?? false,
      isActive: insertUser.isActive ?? true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = { 
      ...submission, 
      id, 
      phone: submission.phone || null,
      service: submission.service || null,
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(
      item => item.category === category
    );
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = randomUUID();
    const portfolioItem: PortfolioItem = { 
      ...item, 
      id,
      projectUrl: item.projectUrl || null,
      technologies: item.technologies || null,
      featured: item.featured || null
    };
    this.portfolioItems.set(id, portfolioItem);
    return portfolioItem;
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  // Portfolio Management
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(item => item.category === category);
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }

  async getSubscriptionPlansByService(serviceId: string): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values()).filter(plan => plan.serviceId === serviceId);
  }

  // User Subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return Array.from(this.userSubscriptions.values()).filter(sub => sub.userId === userId);
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const newSubscription: UserSubscription = {
      id: randomUUID(),
      ...subscription,
      startDate: subscription.startDate || new Date(),
      status: subscription.status || "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userSubscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }

  // Service Requests
  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const newRequest: ServiceRequest = {
      id: randomUUID(),
      ...request,
      status: request.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.serviceRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  async getServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values());
  }

  // User Management Extensions
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createService(
    service: InsertService, 
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    const id = randomUUID();
    const newService: Service = { 
      ...service, 
      id,
      featured: service.featured || null,
      technologies: service.technologies || null,
      deliveryTime: service.deliveryTime || null,
      startingPrice: service.startingPrice || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: auditInfo?.userId || null,
      updatedBy: auditInfo?.userId || null,
      isDeleted: false
    };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(
    id: string, 
    updates: Partial<Service>,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    const existingService = this.services.get(id);
    if (!existingService || existingService.isDeleted) {
      throw new Error("Service not found or has been deleted");
    }

    const updatedService: Service = {
      ...existingService,
      ...updates,
      updatedAt: new Date(),
      updatedBy: auditInfo?.userId || null
    };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<boolean> {
    const service = this.services.get(id);
    if (!service || service.isDeleted) {
      return false;
    }

    // Soft delete - set isDeleted to true
    const deletedService: Service = {
      ...service,
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: auditInfo?.userId || null
    };
    this.services.set(id, deletedService);
    return true;
  }

  async restoreService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    const service = this.services.get(id);
    if (!service || !service.isDeleted) {
      throw new Error("Service not found or not deleted");
    }

    const restoredService: Service = {
      ...service,
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: auditInfo?.userId || null
    };
    this.services.set(id, restoredService);
    return restoredService;
  }

  // Service Subcategories Management
  async getAllServiceSubcategories(): Promise<ServiceSubcategory[]> {
    return Array.from(this.serviceSubcategories.values());
  }

  async getServiceSubcategoriesByService(serviceId: string): Promise<ServiceSubcategory[]> {
    return Array.from(this.serviceSubcategories.values()).filter(sub => sub.serviceId === serviceId);
  }

  async getServiceSubcategoriesByCategory(category: string): Promise<ServiceSubcategory[]> {
    return Array.from(this.serviceSubcategories.values()).filter(sub => sub.category === category);
  }

  async getServiceSubcategoryById(id: string): Promise<ServiceSubcategory | undefined> {
    return this.serviceSubcategories.get(id);
  }

  async createServiceSubcategory(subcategory: InsertServiceSubcategory): Promise<ServiceSubcategory> {
    const id = randomUUID();
    const newSubcategory: ServiceSubcategory = {
      ...subcategory,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.serviceSubcategories.set(id, newSubcategory);
    return newSubcategory;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const newTestimonial: Testimonial = { 
      ...testimonial, 
      id,
      rating: testimonial.rating || null
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }

  async getSubscriptionPlansByService(serviceId: string): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values()).filter(
      plan => plan.serviceId === serviceId
    );
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = randomUUID();
    const newPlan: SubscriptionPlan = { 
      ...plan, 
      id,
      serviceId: plan.serviceId || null,
      features: plan.features || null,
      popular: plan.popular || null,
      active: plan.active || null
    };
    this.subscriptionPlans.set(id, newPlan);
    return newPlan;
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return Array.from(this.userSubscriptions.values()).filter(
      subscription => subscription.userId === userId
    );
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const id = randomUUID();
    const newSubscription: UserSubscription = { 
      ...subscription, 
      id,
      userId: subscription.userId || null,
      planId: subscription.planId || null,
      startDate: subscription.startDate || null,
      endDate: subscription.endDate || null,
      autoRenew: subscription.autoRenew || null,
      paymentMethod: subscription.paymentMethod || null
    };
    this.userSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    if (userId) {
      return Array.from(this.serviceRequests.values()).filter(
        request => request.userId === userId
      );
    }
    return Array.from(this.serviceRequests.values());
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const id = randomUUID();
    const newRequest: ServiceRequest = { 
      ...request, 
      id,
      userId: request.userId || null,
      serviceId: request.serviceId || null,
      requirements: request.requirements || null,
      status: request.status || null,
      priority: request.priority || null,
      estimatedCost: request.estimatedCost || null,
      actualCost: request.actualCost || null,
      startDate: request.startDate || null,
      endDate: request.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.serviceRequests.set(id, newRequest);
    return newRequest;
  }

  // User Management Methods
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // CRM - Leads Management
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const newLead: Lead = {
      ...lead,
      id,
      email: lead.email || null,
      phone: lead.phone || null,
      company: lead.company || null,
      jobTitle: lead.jobTitle || null,
      leadSource: lead.leadSource || "website",
      status: lead.status || "new",
      rating: lead.rating || "cold",
      estimatedValue: lead.estimatedValue || null,
      expectedCloseDate: lead.expectedCloseDate || null,
      assignedTo: lead.assignedTo || null,
      notes: lead.notes || null,
      tags: lead.tags || null,
      customFields: lead.customFields || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { ...lead, ...updates, updatedAt: new Date() };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteLead(id: string): Promise<boolean> {
    return this.leads.delete(id);
  }

  async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.assignedTo === userId);
  }

  async convertLeadToContact(leadId: string, accountId?: string): Promise<Contact> {
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error("Lead not found");

    const contact: InsertContact = {
      leadId: leadId,
      accountId: accountId || null,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      mobile: null,
      jobTitle: lead.jobTitle,
      department: null,
      isPrimary: "false",
      isActive: "true",
      dateOfBirth: null,
      socialProfiles: null,
      preferences: null,
      tags: lead.tags,
      notes: lead.notes
    };

    return this.createContact(contact);
  }

  // CRM - Contacts Management
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const newContact: Contact = {
      ...contact,
      id,
      leadId: contact.leadId || null,
      accountId: contact.accountId || null,
      email: contact.email || null,
      phone: contact.phone || null,
      mobile: contact.mobile || null,
      jobTitle: contact.jobTitle || null,
      department: contact.department || null,
      isPrimary: contact.isPrimary || "false",
      isActive: contact.isActive || "true",
      dateOfBirth: contact.dateOfBirth || null,
      socialProfiles: contact.socialProfiles || null,
      preferences: contact.preferences || null,
      tags: contact.tags || null,
      notes: contact.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const contact = this.contacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { ...contact, ...updates, updatedAt: new Date() };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  async getContactsByAccount(accountId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.accountId === accountId);
  }

  // CRM - Accounts Management
  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getAccountById(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const id = randomUUID();
    const newAccount: Account = {
      ...account,
      id,
      type: account.type || "prospect",
      industry: account.industry || null,
      website: account.website || null,
      phone: account.phone || null,
      email: account.email || null,
      billingAddress: account.billingAddress || null,
      shippingAddress: account.shippingAddress || null,
      annualRevenue: account.annualRevenue || null,
      numberOfEmployees: account.numberOfEmployees || null,
      assignedTo: account.assignedTo || null,
      parentAccountId: account.parentAccountId || null,
      description: account.description || null,
      tags: account.tags || null,
      customFields: account.customFields || null,
      isActive: account.isActive || "true",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.accounts.set(id, newAccount);
    return newAccount;
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const account = this.accounts.get(id);
    if (!account) throw new Error("Account not found");
    
    const updatedAccount = { ...account, ...updates, updatedAt: new Date() };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteAccount(id: string): Promise<boolean> {
    return this.accounts.delete(id);
  }

  async getAccountsByAssignee(userId: string): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(account => account.assignedTo === userId);
  }

  // CRM - Opportunities Management
  async getAllOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values());
  }

  async getOpportunityById(id: string): Promise<Opportunity | undefined> {
    return this.opportunities.get(id);
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const id = randomUUID();
    const newOpportunity: Opportunity = {
      ...opportunity,
      id,
      accountId: opportunity.accountId || null,
      contactId: opportunity.contactId || null,
      stage: opportunity.stage || "prospecting",
      amount: opportunity.amount || null,
      probability: opportunity.probability || "0",
      expectedCloseDate: opportunity.expectedCloseDate || null,
      actualCloseDate: opportunity.actualCloseDate || null,
      leadSource: opportunity.leadSource || null,
      description: opportunity.description || null,
      lossReason: opportunity.lossReason || null,
      nextStep: opportunity.nextStep || null,
      assignedTo: opportunity.assignedTo || null,
      competitorId: opportunity.competitorId || null,
      tags: opportunity.tags || null,
      customFields: opportunity.customFields || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opportunities.set(id, newOpportunity);
    return newOpportunity;
  }

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    const opportunity = this.opportunities.get(id);
    if (!opportunity) throw new Error("Opportunity not found");
    
    const updatedOpportunity = { ...opportunity, ...updates, updatedAt: new Date() };
    this.opportunities.set(id, updatedOpportunity);
    return updatedOpportunity;
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    return this.opportunities.delete(id);
  }

  async getOpportunitiesByAccount(accountId: string): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(opp => opp.accountId === accountId);
  }

  async getOpportunitiesByAssignee(userId: string): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(opp => opp.assignedTo === userId);
  }

  // CRM - Tasks Management
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const newTask: Task = {
      ...task,
      id,
      description: task.description || null,
      type: task.type || "call",
      status: task.status || "pending",
      priority: task.priority || "medium",
      assignedTo: task.assignedTo || null,
      createdBy: task.createdBy || null,
      relatedTo: task.relatedTo || null,
      relatedId: task.relatedId || null,
      dueDate: task.dueDate || null,
      completedDate: task.completedDate || null,
      reminderDate: task.reminderDate || null,
      estimatedDuration: task.estimatedDuration || null,
      actualDuration: task.actualDuration || null,
      tags: task.tags || null,
      attachments: task.attachments || null,
      customFields: task.customFields || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    
    const updatedTask = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedTo === userId);
  }

  async getTasksByRelatedEntity(relatedTo: string, relatedId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => 
      task.relatedTo === relatedTo && task.relatedId === relatedId
    );
  }

  // CRM - Activities
  async getAllActivities(): Promise<CrmActivity[]> {
    return Array.from(this.activities.values());
  }

  async getActivityById(id: string): Promise<CrmActivity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(activity: InsertCrmActivity): Promise<CrmActivity> {
    const id = randomUUID();
    const newActivity: CrmActivity = {
      ...activity,
      id,
      description: activity.description || null,
      userId: activity.userId || null,
      relatedTo: activity.relatedTo || null,
      relatedId: activity.relatedId || null,
      metadata: activity.metadata || null,
      duration: activity.duration || null,
      outcome: activity.outcome || null,
      scheduledAt: activity.scheduledAt || null,
      completedAt: activity.completedAt || null,
      createdAt: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getActivitiesByRelatedEntity(relatedTo: string, relatedId: string): Promise<CrmActivity[]> {
    return Array.from(this.activities.values()).filter(activity => 
      activity.relatedTo === relatedTo && activity.relatedId === relatedId
    );
  }

  async getActivitiesByUser(userId: string): Promise<CrmActivity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.userId === userId);
  }

  // Saved Filters Implementation
  async getSavedFilters(userId: string): Promise<SavedFilter[]> {
    return Array.from(this.savedFilters.values()).filter(filter => filter.userId === userId);
  }

  async createSavedFilter(filter: InsertSavedFilter): Promise<SavedFilter> {
    const savedFilter: SavedFilter = {
      id: randomUUID(),
      ...filter,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.savedFilters.set(savedFilter.id, savedFilter);
    return savedFilter;
  }

  async updateSavedFilter(id: string, updates: Partial<SavedFilter>): Promise<SavedFilter> {
    const filter = this.savedFilters.get(id);
    if (!filter) throw new Error("Saved filter not found");
    const updatedFilter = { ...filter, ...updates, updatedAt: new Date() };
    this.savedFilters.set(id, updatedFilter);
    return updatedFilter;
  }

  async deleteSavedFilter(id: string): Promise<boolean> {
    return this.savedFilters.delete(id);
  }

  // Deal Stages Management
  async getAllDealStages(): Promise<DealStage[]> {
    return Array.from(this.dealStages.values());
  }

  async createDealStage(stage: InsertDealStage): Promise<DealStage> {
    const newStage: DealStage = {
      id: randomUUID(),
      ...stage,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dealStages.set(newStage.id, newStage);
    return newStage;
  }

  async updateDealStage(id: string, updates: Partial<DealStage>): Promise<DealStage> {
    const existing = this.dealStages.get(id);
    if (!existing) {
      throw new Error(`Deal stage with id ${id} not found`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.dealStages.set(id, updated);
    return updated;
  }

  async deleteDealStage(id: string): Promise<boolean> {
    return this.dealStages.delete(id);
  }

  // Ticket Status Management
  async getAllTicketStatus(): Promise<TicketStatus[]> {
    return Array.from(this.ticketStatuses.values());
  }

  async createTicketStatus(status: InsertTicketStatus): Promise<TicketStatus> {
    const newStatus: TicketStatus = {
      id: randomUUID(),
      ...status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ticketStatuses.set(newStatus.id, newStatus);
    return newStatus;
  }

  async updateTicketStatus(id: string, updates: Partial<TicketStatus>): Promise<TicketStatus> {
    const existing = this.ticketStatuses.get(id);
    if (!existing) {
      throw new Error(`Ticket status with id ${id} not found`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.ticketStatuses.set(id, updated);
    return updated;
  }

  async deleteTicketStatus(id: string): Promise<boolean> {
    return this.ticketStatuses.delete(id);
  }

  // Search Implementation
  async searchEntities(query: string, entities: string[]): Promise<any[]> {
    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    if (entities.includes('contacts')) {
      const contactResults = Array.from(this.contacts.values()).filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm) ||
        contact.phone?.toLowerCase().includes(searchTerm) ||
        contact.jobTitle?.toLowerCase().includes(searchTerm)
      ).map(contact => ({ ...contact, entity: 'contacts' }));
      results.push(...contactResults);
    }

    if (entities.includes('accounts') || entities.includes('companies')) {
      const accountResults = Array.from(this.accounts.values()).filter(account =>
        account.name?.toLowerCase().includes(searchTerm) ||
        account.email?.toLowerCase().includes(searchTerm) ||
        account.phone?.toLowerCase().includes(searchTerm) ||
        account.industry?.toLowerCase().includes(searchTerm) ||
        account.type?.toLowerCase().includes(searchTerm)
      ).map(account => ({ ...account, entity: 'accounts' }));
      results.push(...accountResults);
    }

    if (entities.includes('opportunities') || entities.includes('deals')) {
      const opportunityResults = Array.from(this.opportunities.values()).filter(opportunity =>
        opportunity.name?.toLowerCase().includes(searchTerm) ||
        opportunity.description?.toLowerCase().includes(searchTerm) ||
        opportunity.stage?.toLowerCase().includes(searchTerm)
      ).map(opportunity => ({ ...opportunity, entity: 'opportunities' }));
      results.push(...opportunityResults);
    }

    if (entities.includes('tickets')) {
      const ticketResults = Array.from(this.supportTickets.values()).filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchTerm) ||
        ticket.description?.toLowerCase().includes(searchTerm) ||
        ticket.category?.toLowerCase().includes(searchTerm) ||
        ticket.status?.toLowerCase().includes(searchTerm)
      ).map(ticket => ({ ...ticket, entity: 'tickets' }));
      results.push(...ticketResults);
    }

    if (entities.includes('leads')) {
      const leadResults = Array.from(this.leads.values()).filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm) ||
        lead.phone?.toLowerCase().includes(searchTerm) ||
        lead.company?.toLowerCase().includes(searchTerm) ||
        lead.jobTitle?.toLowerCase().includes(searchTerm)
      ).map(lead => ({ ...lead, entity: 'leads' }));
      results.push(...leadResults);
    }

    return results;
  }

  // Enhanced Table Operations
  async getTableData(tableName: string, options: {
    offset?: number;
    limit?: number;
    search?: string;
    sorts?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    filters?: Array<{ field: string; operator: string; value: any }>;
    columns?: string[];
    export?: boolean;
  }): Promise<{ data: any[]; total: number }> {
    const { offset = 0, limit = 25, search = '', sorts = [], filters = [], export: isExport = false } = options;

    // Map table names to data stores
    const dataMap: any = {
      'contacts': this.contacts,
      'accounts': this.accounts,
      'opportunities': this.opportunities,
      'supportTickets': this.supportTickets
    };

    const dataStore = dataMap[tableName];
    if (!dataStore) throw new Error(`Unknown table: ${tableName}`);

    let data = Array.from(dataStore.values());

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      data = data.filter((item: any) => {
        const searchableFields = this.getSearchableFields(tableName);
        return searchableFields.some(field => 
          item[field]?.toString().toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply filters
    filters.forEach(filter => {
      const { field, operator, value } = filter;
      data = data.filter((item: any) => {
        switch (operator) {
          case 'eq':
            return item[field] === value;
          case 'contains':
            return item[field]?.toString().toLowerCase().includes(value.toLowerCase());
          case 'gt':
            return parseFloat(item[field]) > parseFloat(value);
          case 'lt':
            return parseFloat(item[field]) < parseFloat(value);
          default:
            return true;
        }
      });
    });

    const total = data.length;

    // Apply sorting
    if (sorts.length > 0) {
      data.sort((a: any, b: any) => {
        for (const sort of sorts) {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          if (comparison !== 0) {
            return sort.direction === 'desc' ? -comparison : comparison;
          }
        }
        return 0;
      });
    }

    // Apply pagination (skip for exports)
    if (!isExport) {
      data = data.slice(offset, offset + limit);
    }

    return { data, total };
  }

  private getSearchableFields(tableName: string): string[] {
    const fieldMap: any = {
      'contacts': ['name', 'email', 'phone', 'jobTitle'],
      'accounts': ['name', 'industry', 'description', 'email'],
      'opportunities': ['name', 'description', 'stage'],
      'supportTickets': ['subject', 'description', 'category', 'status']
    };
    return fieldMap[tableName] || [];
  }

  // Saved Views Management
  private savedViews: Map<string, any> = new Map();

  async getSavedViews(userId: string, endpoint: string): Promise<any[]> {
    const views = Array.from(this.savedViews.values()).filter(
      view => view.userId === userId && view.endpoint === endpoint
    );
    return views;
  }

  async createSavedView(view: any): Promise<any> {
    this.savedViews.set(view.id, view);
    return view;
  }

  async deleteSavedView(id: string, userId: string): Promise<boolean> {
    const view = this.savedViews.get(id);
    if (view && view.userId === userId) {
      this.savedViews.delete(id);
      return true;
    }
    return false;
  }

  private initializeSubscriptionPlans() {
    const servicesArray = Array.from(this.services.values());
    const mobileService = servicesArray.find(s => s.category === "mobile");
    const webService = servicesArray.find(s => s.category === "web");
    const desktopService = servicesArray.find(s => s.category === "desktop");
    const designService = servicesArray.find(s => s.category === "design");
    const marketingService = servicesArray.find(s => s.category === "marketing");

    const samplePlans: SubscriptionPlan[] = [
      // Mobile App Development Plans
      {
        id: randomUUID(),
        name: "تطبيق بسيط",
        description: "تطبيق موبايل بسيط بوظائف أساسية",
        serviceId: mobileService?.id || "",
        price: "15000",
        duration: "one-time",
        features: ["تصميم واجهة مستخدم بسيطة", "3 شاشات رئيسية", "قاعدة بيانات محلية", "دعم فني لمدة 3 أشهر"],
        popular: "false",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "تطبيق متقدم",
        description: "تطبيق موبايل متقدم بوظائف شاملة",
        serviceId: mobileService?.id || "",
        price: "35000",
        duration: "one-time",
        features: ["تصميم واجهة مستخدم متقدمة", "10+ شاشات", "API متكامل", "نظام دفع", "إشعارات فورية", "دعم فني لمدة سنة"],
        popular: "true",
        active: "true"
      },
      // Web Development Plans
      {
        id: randomUUID(),
        name: "موقع تعريفي",
        description: "موقع إلكتروني تعريفي احترافي",
        serviceId: webService?.id || "",
        price: "8000",
        duration: "one-time",
        features: ["تصميم متجاوب", "5 صفحات", "نموذج تواصل", "تحسين SEO أساسي", "استضافة سنة مجانية"],
        popular: "false",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "منصة إلكترونية",
        description: "منصة إلكترونية متكاملة",
        serviceId: webService?.id || "",
        price: "25000",
        duration: "one-time",
        features: ["تصميم مخصص", "لوحة تحكم", "نظام إدارة المحتوى", "تكامل مع وسائل الدفع", "تحليلات متقدمة", "دعم فني سنة"],
        popular: "true",
        active: "true"
      },
      // Desktop Development Plans
      {
        id: randomUUID(),
        name: "تطبيق سطح مكتب بسيط",
        description: "تطبيق سطح مكتب بوظائف أساسية",
        serviceId: desktopService?.id || "",
        price: "20000",
        duration: "one-time",
        features: ["واجهة مستخدم بسيطة", "قاعدة بيانات محلية", "تقارير أساسية", "دعم Windows وmacOS", "دعم فني 6 أشهر"],
        popular: "false",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "نظام إدارة متكامل",
        description: "نظام إدارة سطح مكتب شامل",
        serviceId: desktopService?.id || "",
        price: "50000",
        duration: "one-time",
        features: ["واجهة متقدمة", "قاعدة بيانات سحابية", "تقارير متقدمة", "نظام صلاحيات", "تكامل مع APIs", "دعم جميع الأنظمة", "دعم فني سنة"],
        popular: "true",
        active: "true"
      },
      // Design Plans
      {
        id: randomUUID(),
        name: "هوية بصرية أساسية",
        description: "تصميم هوية بصرية بسيطة",
        serviceId: designService?.id || "",
        price: "5000",
        duration: "one-time",
        features: ["تصميم شعار", "بطاقة أعمال", "ورقة رسمية", "3 مراجعات مجانية"],
        popular: "false",
        active: "true"
      },
      {
        id: randomUUID(),
        name: "هوية بصرية شاملة",
        description: "تصميم هوية بصرية متكاملة",
        serviceId: designService?.id || "",
        price: "12000",
        duration: "one-time",
        features: ["تصميم شعار متقدم", "دليل الهوية البصرية", "قوالب تسويقية", "تصميم لافتات", "مراجعات غير محدودة"],
        popular: "true",
        active: "true"
      },
      // Marketing Plans
      {
        id: randomUUID(),
        name: "حملة تسويقية شهرية",
        description: "إدارة حملات التسويق الرقمي",
        serviceId: marketingService?.id || "",
        price: "3000",
        duration: "monthly",
        features: ["إدارة وسائل التواصل", "إعلانات مدفوعة", "تقارير أسبوعية", "استشارات تسويقية"],
        popular: "true",
        active: "true"
      }
    ];

    samplePlans.forEach(plan => this.subscriptionPlans.set(plan.id, plan));

    // Initialize CRM sample data
    this.initializeCRMData();
  }

  private initializeCRMData() {
    // Sample Accounts
    const account1: Account = {
      id: "account-001",
      name: "شركة التقنية المتقدمة",
      type: "prospect",
      industry: "تكنولوجيا المعلومات",
      website: "https://techadvanced.sa",
      phone: "+966112345678",
      email: "info@techadvanced.sa",
      billingAddress: {
        street: "شارع الملك فهد",
        city: "الرياض",
        state: "الرياض",
        country: "المملكة العربية السعودية",
        postalCode: "12345"
      },
      shippingAddress: null,
      annualRevenue: "5000000",
      numberOfEmployees: "50-100",
      assignedTo: "sales-001",
      parentAccountId: null,
      description: "شركة متخصصة في حلول تكنولوجيا المعلومات",
      tags: ["تقنية", "برمجيات", "مؤسسة"],
      customFields: null,
      isActive: "true",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const account2: Account = {
      id: "account-002", 
      name: "مجموعة الخليج التجارية",
      type: "customer",
      industry: "تجارة",
      website: "https://gulfgroup.com",
      phone: "+966133456789",
      email: "contact@gulfgroup.com",
      billingAddress: {
        street: "طريق الأمير محمد بن فهد",
        city: "الدمام",
        state: "المنطقة الشرقية",
        country: "المملكة العربية السعودية",
        postalCode: "34567"
      },
      shippingAddress: null,
      annualRevenue: "12000000",
      numberOfEmployees: "100-500", 
      assignedTo: "sales-001",
      parentAccountId: null,
      description: "مجموعة تجارية رائدة في المنطقة",
      tags: ["تجارة", "عميل", "كبيرة"],
      customFields: null,
      isActive: "true",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accounts.set(account1.id, account1);
    this.accounts.set(account2.id, account2);

    // Sample Leads
    const lead1: Lead = {
      id: "lead-001",
      name: "محمد أحمد السالم",
      email: "m.salem@startup.sa",
      phone: "+966501112233",
      company: "شركة الابتكار الناشئة",
      jobTitle: "المدير التنفيذي",
      leadSource: "website",
      status: "new",
      rating: "hot",
      estimatedValue: "75000",
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedTo: "sales-001",
      notes: "مهتم بتطوير تطبيق موبايل لشركته الناشئة",
      tags: ["تطبيق", "ناشئة", "مهم"],
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const lead2: Lead = {
      id: "lead-002",
      name: "سارة محمد العتيبي",
      email: "s.otaibi@design.co",
      phone: "+966507654321",
      company: "استوديو التصميم الإبداعي",
      jobTitle: "مديرة التسويق",
      leadSource: "social-media",
      status: "contacted",
      rating: "warm", 
      estimatedValue: "25000",
      expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      assignedTo: "sales-001",
      notes: "تحتاج هوية بصرية جديدة وموقع إلكتروني",
      tags: ["تصميم", "هوية", "موقع"],
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leads.set(lead1.id, lead1);
    this.leads.set(lead2.id, lead2);

    // Sample Contacts
    const contact1: Contact = {
      id: "contact-001",
      leadId: null,
      accountId: "account-001",
      name: "خالد عبدالله المنصور",
      email: "k.mansour@techadvanced.sa",
      phone: "+966112345678",
      mobile: "+966501234567",
      jobTitle: "مدير تقنية المعلومات",
      department: "التقنية",
      isPrimary: "true",
      isActive: "true",
      dateOfBirth: null,
      socialProfiles: {
        "linkedin": "khalid-mansour",
        "twitter": "@kmansour"
      },
      preferences: null,
      tags: ["صانع قرار", "تقني"],
      notes: "الشخص الرئيسي لاتخاذ القرارات التقنية",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const contact2: Contact = {
      id: "contact-002",
      leadId: null,
      accountId: "account-002",
      name: "نورا سعد الغامدي",
      email: "n.ghamdi@gulfgroup.com",
      phone: "+966133456789",
      mobile: "+966507891234",
      jobTitle: "مديرة المشاريع",
      department: "إدارة المشاريع",
      isPrimary: "true",
      isActive: "true",
      dateOfBirth: null,
      socialProfiles: null,
      preferences: null,
      tags: ["مشاريع", "إدارة"],
      notes: "مسؤولة عن متابعة المشاريع التقنية",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.contacts.set(contact1.id, contact1);
    this.contacts.set(contact2.id, contact2);

    // Sample Opportunities
    const opportunity1: Opportunity = {
      id: "opportunity-001",
      name: "تطبيق إدارة المخزون",
      accountId: "account-001",
      contactId: "contact-001",
      stageId: "stage-2",
      stage: "proposal",
      amount: "150000",
      probability: "70",
      expectedCloseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      actualCloseDate: null,
      leadSource: "website",
      description: "تطوير تطبيق شامل لإدارة المخزون والمبيعات",
      lossReason: null,
      nextStep: "عرض نهائي للمشروع",
      assignedTo: "sales-001",
      competitorId: null,
      tags: ["تطبيق", "مخزون", "كبير"],
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const opportunity2: Opportunity = {
      id: "opportunity-002",
      name: "موقع التجارة الإلكترونية",
      accountId: "account-002",
      contactId: "contact-002",
      stageId: "stage-3",
      stage: "negotiation",
      amount: "200000",
      probability: "85",
      expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      actualCloseDate: null,
      leadSource: "referral",
      description: "منصة تجارة إلكترونية متكاملة مع نظام إدارة",
      lossReason: null,
      nextStep: "توقيع العقد",
      assignedTo: "sales-001",
      competitorId: null,
      tags: ["متجر", "تجارة", "منصة"],
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.opportunities.set(opportunity1.id, opportunity1);
    this.opportunities.set(opportunity2.id, opportunity2);

    // Sample Tasks
    const task1: Task = {
      id: "task-001",
      title: "متابعة عرض تطبيق المخزون",
      description: "التواصل مع العميل لمتابعة العرض المقدم",
      type: "call",
      status: "pending",
      priority: "high",
      assignedTo: "sales-001",
      createdBy: "admin-001",
      relatedTo: "opportunity",
      relatedId: "opportunity-001",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completedDate: null,
      reminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedDuration: "30",
      actualDuration: null,
      tags: ["مبيعات", "متابعة"],
      attachments: null,
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const task2: Task = {
      id: "task-002",
      title: "إعداد عرض فني للتجارة الإلكترونية",
      description: "تحضير العرض الفني التفصيلي للمشروع",
      type: "other",
      status: "in-progress",
      priority: "high",
      assignedTo: "admin-001",
      createdBy: "sales-001",
      relatedTo: "opportunity",
      relatedId: "opportunity-002",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      completedDate: null,
      reminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedDuration: "120",
      actualDuration: null,
      tags: ["عرض", "فني"],
      attachments: null,
      customFields: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(task1.id, task1);
    this.tasks.set(task2.id, task2);

    // Sample Activities
    const activity1: CrmActivity = {
      id: "activity-001",
      type: "call",
      title: "مكالمة مع شركة التقنية المتقدمة",
      description: "مناقشة متطلبات تطبيق إدارة المخزون",
      userId: "sales-001",
      relatedTo: "opportunity",
      relatedId: "opportunity-001",
      metadata: {
        callDuration: "45 دقيقة",
        outcome: "إيجابي",
        nextSteps: "إرسال عرض مفصل"
      },
      duration: "45",
      outcome: "تم الاتفاق على المتطلبات الأساسية",
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };

    const activity2: CrmActivity = {
      id: "activity-002",
      type: "email",
      title: "إرسال عرض التجارة الإلكترونية",
      description: "إرسال العرض الأولي لمنصة التجارة الإلكترونية",
      userId: "sales-001",
      relatedTo: "opportunity",
      relatedId: "opportunity-002",
      metadata: {
        emailSubject: "عرض منصة التجارة الإلكترونية",
        attachments: ["عرض_التجارة_الإلكترونية.pdf"]
      },
      duration: null,
      outcome: "تم الإرسال بنجاح",
      scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };

    this.activities.set(activity1.id, activity1);
    this.activities.set(activity2.id, activity2);
  }

  // Mobile App Orders
  async createMobileAppOrder(order: InsertMobileAppOrder): Promise<MobileAppOrder> {
    const id = randomUUID();
    const newOrder: MobileAppOrder = {
      ...order,
      id,
      customerPhone: order.customerPhone || null,
      customerCompany: order.customerCompany || null,
      appName: order.appName || null,
      appDescription: order.appDescription || null,
      additionalRequirements: order.additionalRequirements || null,
      attachedFiles: order.attachedFiles || [],
      estimatedBudget: order.estimatedBudget || null,
      preferredTimeline: order.preferredTimeline || null,
      priority: order.priority || "normal",
      assignedTo: order.assignedTo || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mobileAppOrders.set(id, newOrder);
    return newOrder;
  }

  async getAllMobileAppOrders(): Promise<MobileAppOrder[]> {
    return Array.from(this.mobileAppOrders.values());
  }

  // Web Project Orders
  async createWebProjectOrder(order: InsertWebProjectOrder): Promise<WebProjectOrder> {
    const id = randomUUID();
    const newOrder: WebProjectOrder = {
      ...order,
      id,
      customerPhone: order.customerPhone || null,
      customerCompany: order.customerCompany || null,
      projectName: order.projectName || null,
      projectDescription: order.projectDescription || null,
      targetAudience: order.targetAudience || null,
      additionalRequirements: order.additionalRequirements || null,
      attachedFiles: order.attachedFiles || [],
      estimatedBudget: order.estimatedBudget || null,
      preferredTimeline: order.preferredTimeline || null,
      priority: order.priority || "normal",
      assignedTo: order.assignedTo || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.webProjectOrders.set(id, newOrder);
    return newOrder;
  }

  async getAllWebProjectOrders(): Promise<WebProjectOrder[]> {
    return Array.from(this.webProjectOrders.values());
  }

  // Web Orders (for Web & Platforms Development Service Wizard)
  async createWebOrder(order: InsertWebOrder): Promise<WebOrder> {
    const id = randomUUID();
    const newOrder: WebOrder = {
      ...order,
      id,
      contentScope: order.contentScope || null,
      domainHosting: order.domainHosting || null,
      languages: order.languages || ["ar"],
      integrations: order.integrations || [],
      attachments: order.attachments || [],
      notes: order.notes || null,
      assignee: order.assignee || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.webOrders.set(id, newOrder);
    return newOrder;
  }

  async getAllWebOrders(): Promise<WebOrder[]> {
    return Array.from(this.webOrders.values());
  }

  async createDesktopOrder(order: InsertDesktopOrder): Promise<DesktopOrder> {
    const id = randomUUID();
    const newOrder: DesktopOrder = {
      ...order,
      id,
      projectName: order.projectName || null,
      contentScope: order.contentScope || null,
      targetAudience: order.targetAudience || null,
      selectedFeatures: order.selectedFeatures || [],
      budget: order.budget || null,
      timeline: order.timeline || null,
      notes: order.notes || null,
      attachments: order.attachments || [],
      assignee: order.assignee || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.desktopOrders.set(id, newOrder);
    return newOrder;
  }

  async getAllDesktopOrders(): Promise<DesktopOrder[]> {
    return Array.from(this.desktopOrders.values());
  }

  async createGraphicsDesignRequest(request: InsertGraphicsDesignRequest): Promise<GraphicsDesignRequest> {
    const id = randomUUID();
    const newRequest: GraphicsDesignRequest = {
      ...request,
      id,
      attachments: request.attachments || [],
      notes: request.notes || null,
      assignee: request.assignee || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.graphicsDesignRequests.set(id, newRequest);
    return newRequest;
  }

  async getGraphicsDesignRequests(): Promise<GraphicsDesignRequest[]> {
    return Array.from(this.graphicsDesignRequests.values());
  }
}
