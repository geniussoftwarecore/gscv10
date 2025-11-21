import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, index, unique, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Deprecated - use password_hash
  password_hash: text("password_hash"), // Argon2 hashed password
  force_password_change: boolean("force_password_change").notNull().default(false),
  role: text("role").notNull().default("client"), // client, admin, manager, agent, viewer
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  department: text("department"),
  position: text("position"),
  avatar: text("avatar"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  roleIdx: index("users_role_idx").on(table.role),
  activeIdx: index("users_active_idx").on(table.isActive),
  emailIdx: index("users_email_idx").on(table.email),
}));

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service"),
  serviceApplication: text("service_application"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const graphicsDesignRequests = pgTable("graphics_design_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  company: text("company"),
  selectedPackage: text("selected_package").notNull(),
  selectedFeatures: jsonb("selected_features").$type<string[]>(),
  projectDescription: text("project_description").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  additionalRequirements: text("additional_requirements"),
  attachments: jsonb("attachments").$type<string[]>(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  assignedTo: varchar("assigned_to"),
  estimatedCost: text("estimated_cost"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  statusIdx: index("graphics_design_requests_status_idx").on(table.status),
  createdAtIdx: index("graphics_design_requests_created_at_idx").on(table.createdAt),
  customerEmailIdx: index("graphics_design_requests_customer_email_idx").on(table.customerEmail),
  assignedToIdx: index("graphics_design_requests_assigned_to_idx").on(table.assignedTo),
}));

export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  category: text("category").notNull(),
  industry: text("industry").notNull(),
  services: jsonb("services").$type<string[]>(),
  imageUrl: text("image_url").notNull(),
  coverImage: text("cover_image"),
  gallery: jsonb("gallery").$type<Array<{id: string, url: string, alt: string, type: 'image' | 'video'}>>(),
  projectUrl: text("project_url"),
  liveUrl: text("live_url"),
  technologies: jsonb("technologies").$type<string[]>(),
  featured: text("featured").default("false"),
  year: text("year").notNull(),
  duration: text("duration"),
  teamSize: text("team_size"),
  budget: text("budget"),
  client: jsonb("client").$type<{name: string, company: string, position: string, logo?: string}>(),
  kpis: jsonb("kpis").$type<Array<{label: string, value: string, description: string, icon?: string}>>(),
  testimonial: jsonb("testimonial").$type<{content: string, author: string, position: string, rating: number}>(),
  tags: jsonb("tags").$type<string[]>(),
  views: text("views").default("0"),
  likes: text("likes").default("0"),
  status: text("status").default("published"), // draft, published, archived
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  socialImage: text("social_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  featured: text("featured").default("false"),
  technologies: jsonb("technologies").$type<string[]>(),
  deliveryTime: text("delivery_time"),
  startingPrice: text("starting_price"),
  // Data protection fields
  isDeleted: boolean("is_deleted").notNull().default(false), // Soft delete protection
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: varchar("created_by"), // Track who created the service
  updatedBy: varchar("updated_by"), // Track who last updated the service
}, (table) => ({
  // Unique constraints to prevent duplication - only for active (non-deleted) services
  titleUniqueActive: uniqueIndex("services_title_unique_active").on(table.title).where(sql`${table.isDeleted} = false`),
  iconCategoryUniqueActive: uniqueIndex("services_icon_category_unique_active").on(table.icon, table.category).where(sql`${table.isDeleted} = false`),
  
  // Indexes for performance
  categoryIdx: index("services_category_idx").on(table.category),
  featuredIdx: index("services_featured_idx").on(table.featured),
  isDeletedIdx: index("services_is_deleted_idx").on(table.isDeleted),
  createdAtIdx: index("services_created_at_idx").on(table.createdAt),
  updatedAtIdx: index("services_updated_at_idx").on(table.updatedAt),
  createdByIdx: index("services_created_by_idx").on(table.createdBy),
  
  // Composite indexes for common queries
  categoryFeaturedIdx: index("services_category_featured_idx").on(table.category, table.featured),
  activeCategoryIdx: index("services_active_category_idx").on(table.isDeleted, table.category),
  deletedCreatedIdx: index("services_deleted_created_idx").on(table.isDeleted, table.createdAt),
}));

export const serviceSubcategories = pgTable("service_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => services.id),
  subcategoryId: text("subcategory_id").notNull(), // unique identifier like 'ecommerce', 'website-corporate'
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDesc: text("short_desc"),
  keyFeatures: jsonb("key_features").$type<string[]>(),
  technicalFeatures: jsonb("technical_features").$type<string[]>(),
  benefits: jsonb("benefits").$type<string[]>(),
  technologies: jsonb("technologies").$type<string[]>(),
  integrations: jsonb("integrations").$type<string[]>(),
  timeline: jsonb("timeline").$type<Array<{phase: string, note: string}>>(),
  deliverables: jsonb("deliverables").$type<string[]>(),
  targetAudience: jsonb("target_audience").$type<string[]>(),
  pricingNote: text("pricing_note"),
  estimatedCost: text("estimated_cost"),
  faqs: jsonb("faqs").$type<Array<{q: string, a: string}>>(),
  tag: text("tag"), // "Enterprise", "MVP", "Standard", etc.
  category: text("category").notNull(), // 'mobile', 'web', 'desktop', 'design', 'marketing'
  featured: text("featured").default("false"),
  active: text("active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  serviceIdIdx: index("service_subcategories_service_id_idx").on(table.serviceId),
  categoryIdx: index("service_subcategories_category_idx").on(table.category),
  activeIdx: index("service_subcategories_active_idx").on(table.active),
  subcategoryIdUnique: unique("service_subcategories_subcategory_id_unique").on(table.subcategoryId),
}));

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  rating: text("rating").default("5"),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  serviceId: varchar("service_id").references(() => services.id),
  price: text("price").notNull(),
  duration: text("duration").notNull(), // monthly, yearly, one-time
  features: jsonb("features").$type<string[]>(),
  popular: text("popular").default("false"),
  active: text("active").default("true"),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  planId: varchar("plan_id").references(() => subscriptionPlans.id),
  status: text("status").notNull(), // active, cancelled, expired
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  autoRenew: text("auto_renew").default("true"),
  paymentMethod: text("payment_method"),
});

export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  serviceId: varchar("service_id").references(() => services.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<Record<string, any>>(),
  status: text("status").default("pending"), // pending, in-progress, completed, cancelled
  priority: text("priority").default("medium"), // low, medium, high, urgent
  estimatedCost: text("estimated_cost"),
  actualCost: text("actual_cost"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  serviceId: varchar("service_id").references(() => services.id),
  planId: varchar("plan_id").references(() => subscriptionPlans.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").default("planning"), // planning, in-progress, review, completed, cancelled
  progress: text("progress").default("0"), // 0-100 percentage
  milestones: jsonb("milestones").$type<Array<{id: string, title: string, completed: boolean, dueDate?: string}>>(),
  files: jsonb("files").$type<Array<{id: string, name: string, url: string, type: string}>>(),
  totalCost: text("total_cost"),
  paidAmount: text("paid_amount").default("0"),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id),
  statusId: varchar("status_id").references(() => ticketStatus.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in-progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  category: text("category").notNull().default("general"), // general, technical, billing, feature-request
  assignedTo: varchar("assigned_to").references(() => users.id),
  attachments: jsonb("attachments").$type<Array<{id: string, name: string, url: string}>>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  statusAssigneeIdx: index("tickets_status_assignee_idx").on(table.status, table.assignedTo),
  priorityIdx: index("tickets_priority_idx").on(table.priority),
  categoryIdx: index("tickets_category_idx").on(table.category),
  userIdx: index("tickets_user_idx").on(table.userId),
}));

export const ticketMessages = pgTable("ticket_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").references(() => supportTickets.id),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  isStaff: text("is_staff").default("false"),
  attachments: jsonb("attachments").$type<Array<{id: string, name: string, url: string}>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  category: text("category").default("general"),
  tags: jsonb("tags").$type<string[]>(),
  published: text("published").default("false"),
  authorId: varchar("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("new-request"), // new-request, reply, payment, general
  category: text("category").default("general"), // general, project, payment, system
  read: text("read").default("false"),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: text("amount").notNull(),
  currency: text("currency").default("YER"), // YER (Yemeni Rial), USD, SAR
  status: text("status").default("pending"), // pending, paid, overdue, cancelled
  description: text("description"),
  items: jsonb("items").$type<Array<{description: string, quantity: number, rate: string, amount: string}>>(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  paymentMethod: text("payment_method"), // credit_card, jaib, cash, jawali, floosak, onecash
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Core Tables - Deal Stages
export const dealStages = pgTable("deal_stages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  probability: text("probability").notNull().default("0"), // 0-100
  color: text("color").notNull().default("#3b82f6"),
  isClosed: text("is_closed").notNull().default("false"),
  isWon: text("is_won").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  positionIdx: index("deal_stages_position_idx").on(table.position),
  nameUnique: unique("deal_stages_name_unique").on(table.name),
}));

// Ticket Status Table
export const ticketStatus = pgTable("ticket_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  color: text("color").notNull().default("#3b82f6"),
  isClosed: text("is_closed").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  positionIdx: index("ticket_status_position_idx").on(table.position),
  nameUnique: unique("ticket_status_name_unique").on(table.name),
}));

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  leadSource: text("lead_source").default("website"), // website, referral, advertising, cold-call, social-media
  status: text("status").default("new"), // new, contacted, qualified, proposal, negotiation, won, lost
  rating: text("rating").default("cold"), // hot, warm, cold
  estimatedValue: text("estimated_value"),
  expectedCloseDate: timestamp("expected_close_date"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  notes: text("notes"),
  tags: jsonb("tags").$type<string[]>(),
  customFields: jsonb("custom_fields").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull().default("prospect"), // prospect, customer, partner, vendor
  industry: text("industry"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  billingAddress: jsonb("billing_address").$type<{street: string, city: string, state: string, country: string, postalCode: string}>(),
  shippingAddress: jsonb("shipping_address").$type<{street: string, city: string, state: string, country: string, postalCode: string}>(),
  annualRevenue: text("annual_revenue"),
  numberOfEmployees: text("number_of_employees"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  parentAccountId: varchar("parent_account_id"),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  customFields: jsonb("custom_fields").$type<Record<string, any>>().default({}),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  typeAssignedIdx: index("accounts_type_assigned_idx").on(table.type, table.assignedTo),
  activeIdx: index("accounts_active_idx").on(table.isActive),
  industryIdx: index("accounts_industry_idx").on(table.industry),
  nameIdx: index("accounts_name_idx").on(table.name),
}));

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  accountId: varchar("account_id").references(() => accounts.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  mobile: text("mobile"),
  jobTitle: text("job_title"),
  department: text("department"),
  isPrimary: text("is_primary").notNull().default("false"),
  isActive: text("is_active").notNull().default("true"),
  dateOfBirth: timestamp("date_of_birth"),
  socialProfiles: jsonb("social_profiles").$type<Record<string, string>>().default({}),
  preferences: jsonb("preferences").$type<Record<string, any>>().default({}),
  tags: jsonb("tags").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  accountIdx: index("contacts_account_idx").on(table.accountId),
  activeIdx: index("contacts_active_idx").on(table.isActive),
  emailIdx: index("contacts_email_idx").on(table.email),
  primaryAccountIdx: index("contacts_primary_account_idx").on(table.isPrimary, table.accountId),
}));

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountId: varchar("account_id").references(() => accounts.id),
  contactId: varchar("contact_id").references(() => contacts.id),
  stageId: varchar("stage_id").references(() => dealStages.id),
  stage: text("stage").notNull().default("prospecting"), // prospecting, qualification, proposal, negotiation, closed-won, closed-lost
  amount: text("amount"),
  probability: text("probability").notNull().default("0"), // 0-100 percentage
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  leadSource: text("lead_source"),
  description: text("description"),
  lossReason: text("loss_reason"),
  nextStep: text("next_step"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  competitorId: varchar("competitor_id"),
  tags: jsonb("tags").$type<string[]>().default([]),
  customFields: jsonb("custom_fields").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  stageOwnerIdx: index("opportunities_stage_owner_idx").on(table.stage, table.assignedTo),
  accountIdx: index("opportunities_account_idx").on(table.accountId),
  closeDataIdx: index("opportunities_close_date_idx").on(table.expectedCloseDate),
  stageIdx: index("opportunities_stage_idx").on(table.stage),
}));

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").default("call"), // call, email, meeting, follow-up, demo, other
  status: text("status").default("pending"), // pending, in-progress, completed, cancelled
  priority: text("priority").default("medium"), // low, medium, high, urgent
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdBy: varchar("created_by").references(() => users.id),
  relatedTo: text("related_to"), // lead, contact, account, opportunity
  relatedId: varchar("related_id"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  reminderDate: timestamp("reminder_date"),
  estimatedDuration: text("estimated_duration"), // in minutes
  actualDuration: text("actual_duration"), // in minutes
  tags: jsonb("tags").$type<string[]>(),
  attachments: jsonb("attachments").$type<Array<{id: string, name: string, url: string}>>(),
  customFields: jsonb("custom_fields").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmActivities = pgTable("crm_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // call, email, meeting, note, task, deal-update, etc.
  title: text("title").notNull(),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  relatedTo: text("related_to"), // lead, contact, account, opportunity, task
  relatedId: varchar("related_id"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  duration: text("duration"), // in minutes for calls/meetings
  outcome: text("outcome"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client Requests table for enhanced request management (now linked to leads)
export const clientRequests = pgTable("client_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  userId: varchar("user_id").references(() => users.id),
  serviceId: varchar("service_id").references(() => services.id),
  type: text("type").notNull(), // request, suggestion, comment
  title: text("title").notNull(),
  description: text("description").notNull(),
  attachments: jsonb("attachments").$type<string[]>(), // file URLs
  status: text("status").default("new"), // new, in-progress, answered
  budget: text("budget"),
  timeline: text("timeline"),
  serviceType: text("service_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved Filters for search functionality
export const savedFilters = pgTable("saved_filters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  entities: jsonb("entities").$type<string[]>(), // ['contacts', 'accounts', 'deals', 'tickets']
  filters: jsonb("filters").$type<Record<string, any>>(), // filter criteria
  isDefault: text("is_default").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Log for Services Operations
export const serviceAuditLog = pgTable("service_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => services.id),
  operation: text("operation").notNull(), // 'create', 'update', 'delete', 'restore'
  tableName: text("table_name").notNull().default("services"),
  oldValues: jsonb("old_values").$type<Record<string, any>>(), // Previous state before change
  newValues: jsonb("new_values").$type<Record<string, any>>(), // New state after change
  changedFields: jsonb("changed_fields").$type<string[]>(), // List of changed field names
  userId: varchar("user_id").references(() => users.id), // Who performed the operation
  userName: text("user_name"), // User name for easy reference
  userRole: text("user_role"), // User role at time of operation
  ipAddress: text("ip_address"), // Client IP address
  userAgent: text("user_agent"), // Browser/client info
  reason: text("reason"), // Optional reason for the change
  riskLevel: text("risk_level").default("low"), // 'low', 'medium', 'high', 'critical'
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  serviceIdIdx: index("service_audit_service_id_idx").on(table.serviceId),
  operationIdx: index("service_audit_operation_idx").on(table.operation),
  userIdIdx: index("service_audit_user_id_idx").on(table.userId),
  createdAtIdx: index("service_audit_created_at_idx").on(table.createdAt),
  riskLevelIdx: index("service_audit_risk_level_idx").on(table.riskLevel),
  
  // Composite indexes for common audit queries
  serviceOperationIdx: index("service_audit_service_operation_idx").on(table.serviceId, table.operation),
  userDateIdx: index("service_audit_user_date_idx").on(table.userId, table.createdAt),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertGraphicsDesignRequestSchema = createInsertSchema(graphicsDesignRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertServiceSubcategorySchema = createInsertSchema(serviceSubcategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTicketMessageSchema = createInsertSchema(ticketMessages).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrmActivitySchema = createInsertSchema(crmActivities).omit({
  id: true,
  createdAt: true,
});

export const insertSavedFilterSchema = createInsertSchema(savedFilters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Service Audit Log Schema
export const insertServiceAuditLogSchema = createInsertSchema(serviceAuditLog).omit({
  id: true,
  createdAt: true,
});

// Export types for audit log
export type ServiceAuditLog = typeof serviceAuditLog.$inferSelect;
export type InsertServiceAuditLog = z.infer<typeof insertServiceAuditLogSchema>;

export const insertClientRequestSchema = createInsertSchema(clientRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealStageSchema = createInsertSchema(dealStages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTicketStatusSchema = createInsertSchema(ticketStatus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Audit Logs Table for tracking all CRM actions
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // create, update, delete, export, assign, approve, escalate
  entityType: text("entity_type").notNull(), // contacts, companies, deals, tickets, users
  entityId: varchar("entity_id").notNull(),
  diff: jsonb("diff").$type<{
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: Array<{field: string, oldValue: any, newValue: any}>;
  }>(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertGraphicsDesignRequest = z.infer<typeof insertGraphicsDesignRequestSchema>;
export type GraphicsDesignRequest = typeof graphicsDesignRequests.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertServiceSubcategory = z.infer<typeof insertServiceSubcategorySchema>;
export type ServiceSubcategory = typeof serviceSubcategories.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;

// Project Request Wizard Schema (for frontend form)
export const projectRequestSchema = z.object({
  category: z.enum(["commercial", "educational", "other"]),
  categoryOtherNote: z.string().optional(),
  buildKind: z.enum(["website", "ecommerce", "platform"]),
  features: z.array(z.string()).min(1, "يرجى اختيار ميزة واحدة على الأقل"),
  ideaSummary: z.string().min(20, "يرجى كتابة وصف أكثر تفصيلاً (20 حرف على الأقل)"),
  targetAudience: z.string().optional(),
  domain: z.string().optional(),
  hasHosting: z.boolean().optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    size: z.number(),
    mime: z.string(),
    tempUrl: z.string().optional()
  })).default([])
});

export type ProjectRequestFormData = z.infer<typeof projectRequestSchema>;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertTicketMessage = z.infer<typeof insertTicketMessageSchema>;
export type TicketMessage = typeof ticketMessages.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;
export type CrmActivity = typeof crmActivities.$inferSelect;

export type InsertSavedFilter = z.infer<typeof insertSavedFilterSchema>;
export type SavedFilter = typeof savedFilters.$inferSelect;

export type InsertClientRequest = z.infer<typeof insertClientRequestSchema>;
export type ClientRequest = typeof clientRequests.$inferSelect;

export type InsertDealStage = z.infer<typeof insertDealStageSchema>;
export type DealStage = typeof dealStages.$inferSelect;

export type InsertTicketStatus = z.infer<typeof insertTicketStatusSchema>;
export type TicketStatus = typeof ticketStatus.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Mobile App Orders Table
export const mobileAppOrders = pgTable("mobile_app_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Customer Information
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerCompany: text("customer_company"),
  
  // App Details
  appType: text("app_type").notNull(), // ecommerce, education, health, etc.
  appName: text("app_name"),
  appDescription: text("app_description"),
  
  // Selected Features (JSON array of feature IDs)
  selectedFeatures: jsonb("selected_features").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Additional Requirements
  additionalRequirements: text("additional_requirements"),
  
  // File Attachments
  attachedFiles: jsonb("attached_files").$type<Array<{
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }>>().default(sql`'[]'::jsonb`),
  
  // Budget and Timeline
  estimatedBudget: text("estimated_budget"),
  preferredTimeline: text("preferred_timeline"),
  
  // Order Status
  status: text("status").notNull().default("pending"), // pending, reviewed, in_progress, completed, cancelled
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Assignment
  assignedTo: varchar("assigned_to").references(() => users.id),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index("mobile_orders_status_idx").on(table.status),
  appTypeIdx: index("mobile_orders_app_type_idx").on(table.appType),
  customerEmailIdx: index("mobile_orders_customer_email_idx").on(table.customerEmail),
  createdAtIdx: index("mobile_orders_created_at_idx").on(table.createdAt),
  assignedToIdx: index("mobile_orders_assigned_to_idx").on(table.assignedTo),
  
  // Composite indexes for common queries
  statusCreatedIdx: index("mobile_orders_status_created_idx").on(table.status, table.createdAt),
  appTypeStatusIdx: index("mobile_orders_app_type_status_idx").on(table.appType, table.status),
}));

// Insert Schema for Mobile App Orders
export const insertMobileAppOrderSchema = createInsertSchema(mobileAppOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMobileAppOrder = z.infer<typeof insertMobileAppOrderSchema>;
export type MobileAppOrder = typeof mobileAppOrders.$inferSelect;

// Web Project Orders Table
export const webProjectOrders = pgTable("web_project_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Customer Information
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerCompany: text("customer_company"),
  
  // Project Details
  projectType: text("project_type").notNull(), // corporate, ecommerce, platform, portal, webapp, landing
  projectName: text("project_name"),
  projectDescription: text("project_description"),
  targetAudience: text("target_audience"),
  
  // Selected Features (JSON array of feature IDs)
  selectedFeatures: jsonb("selected_features").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Additional Requirements
  additionalRequirements: text("additional_requirements"),
  
  // File Attachments
  attachedFiles: jsonb("attached_files").$type<Array<{
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }>>().default(sql`'[]'::jsonb`),
  
  // Budget and Timeline
  estimatedBudget: text("estimated_budget"),
  preferredTimeline: text("preferred_timeline"),
  
  // Order Status
  status: text("status").notNull().default("pending"), // pending, reviewed, in_progress, completed, cancelled
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Assignment
  assignedTo: varchar("assigned_to").references(() => users.id),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index("web_orders_status_idx").on(table.status),
  projectTypeIdx: index("web_orders_project_type_idx").on(table.projectType),
  customerEmailIdx: index("web_orders_customer_email_idx").on(table.customerEmail),
  createdAtIdx: index("web_orders_created_at_idx").on(table.createdAt),
  assignedToIdx: index("web_orders_assigned_to_idx").on(table.assignedTo),
  
  // Composite indexes for common queries
  statusCreatedIdx: index("web_orders_status_created_idx").on(table.status, table.createdAt),
  projectTypeStatusIdx: index("web_orders_project_type_status_idx").on(table.projectType, table.status),
}));

// Insert Schema for Web Project Orders
export const insertWebProjectOrderSchema = createInsertSchema(webProjectOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebProjectOrder = z.infer<typeof insertWebProjectOrderSchema>;
export type WebProjectOrder = typeof webProjectOrders.$inferSelect;

// Web Orders Table (for Web & Platforms Development Service Wizard)
export const webOrders = pgTable("web_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Customer Information
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  
  // Site Details
  siteType: text("site_type").notNull(), // company_profile, blog_magazine, ecommerce, elearning, booking, custom_platform
  
  // Selected Features (JSON array of feature IDs)
  selectedFeatures: jsonb("selected_features").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Project Requirements
  contentScope: text("content_scope"), // sections/pages/content description
  domainHosting: text("domain_hosting"), // domain and hosting details
  languages: jsonb("languages").$type<string[]>().default(sql`'["ar"]'::jsonb`), // required languages
  integrations: jsonb("integrations").$type<string[]>().default(sql`'[]'::jsonb`), // required integrations
  
  // File Attachments
  attachments: jsonb("attachments").$type<Array<{
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }>>().default(sql`'[]'::jsonb`),
  
  // Additional Information
  notes: text("notes"), // additional notes and requirements
  
  // Order Status and Assignment
  status: text("status").notNull().default("new"), // new, reviewed, in_progress, completed, cancelled
  assignee: varchar("assignee").references(() => users.id), // assigned team member
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index("web_orders_status_idx").on(table.status),
  siteTypeIdx: index("web_orders_site_type_idx").on(table.siteType),
  customerEmailIdx: index("web_orders_customer_email_idx").on(table.customerEmail),
  createdAtIdx: index("web_orders_created_at_idx").on(table.createdAt),
  assigneeIdx: index("web_orders_assignee_idx").on(table.assignee),
  
  // Composite indexes for common queries
  statusCreatedIdx: index("web_orders_status_created_idx").on(table.status, table.createdAt),
  siteTypeStatusIdx: index("web_orders_site_type_status_idx").on(table.siteType, table.status),
}));

// Insert Schema for Web Orders
export const insertWebOrderSchema = createInsertSchema(webOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebOrder = z.infer<typeof insertWebOrderSchema>;
export type WebOrder = typeof webOrders.$inferSelect;

// Desktop App Orders Table
export const desktopOrders = pgTable("desktop_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Customer Information
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerCompany: text("customer_company"),
  
  // App Details
  appType: text("app_type").notNull(), // business, financial, education, design, productivity, media, games, analytics
  projectName: text("project_name"), // Renamed from appName to match the frontend form
  contentScope: text("content_scope"), // Renamed from appDescription to match the frontend form
  targetAudience: text("target_audience"),
  
  // Selected Features (JSON array of feature IDs)
  selectedFeatures: jsonb("selected_features").$type<string[]>().default(sql`'[]'::jsonb`),
  
  // Budget and Timeline
  budget: text("budget"),
  timeline: text("timeline"),
  
  // Additional Information
  notes: text("notes"), // additional notes and requirements
  
  // File Attachments
  attachments: jsonb("attachments").$type<Array<{
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }>>().default(sql`'[]'::jsonb`),
  
  // Order Status and Assignment
  status: text("status").notNull().default("new"), // new, reviewed, in_progress, completed, cancelled
  assignee: varchar("assignee").references(() => users.id), // assigned team member
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index("desktop_orders_status_idx").on(table.status),
  appTypeIdx: index("desktop_orders_app_type_idx").on(table.appType),
  customerEmailIdx: index("desktop_orders_customer_email_idx").on(table.customerEmail),
  createdAtIdx: index("desktop_orders_created_at_idx").on(table.createdAt),
  assigneeIdx: index("desktop_orders_assignee_idx").on(table.assignee),
  
  // Composite indexes for common queries
  statusCreatedIdx: index("desktop_orders_status_created_idx").on(table.status, table.createdAt),
  appTypeStatusIdx: index("desktop_orders_app_type_status_idx").on(table.appType, table.status),
}));

// Insert Schema for Desktop Orders
export const insertDesktopOrderSchema = createInsertSchema(desktopOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDesktopOrder = z.infer<typeof insertDesktopOrderSchema>;
export type DesktopOrder = typeof desktopOrders.$inferSelect;
