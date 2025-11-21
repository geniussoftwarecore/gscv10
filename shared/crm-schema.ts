import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, uuid, boolean, integer, decimal, pgSchema, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// CRM isolated schema with comprehensive constraints and indexes
export const crmCore = pgSchema("crm_core");

// Feature flags
export const crmFeatureFlags = crmCore.table("crm_feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  enabled: boolean("enabled").notNull().default(false),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// CRM Users and Teams - Core entities for RBAC
export const crmUsers = crmCore.table("crm_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("agent"), // admin, manager, agent, viewer
  teamId: varchar("team_id").references(() => crmTeams.id),
  isActive: boolean("is_active").notNull().default(true),
  avatar: text("avatar"),
  phone: text("phone"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  roleActiveIdx: index("crm_users_role_active_idx").on(table.role, table.isActive),
  teamActiveIdx: index("crm_users_team_active_idx").on(table.teamId, table.isActive),
  emailIdx: uniqueIndex("crm_users_email_idx").on(table.email),
}));

export const crmTeams = crmCore.table("crm_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  managerId: varchar("manager_id").references(() => crmUsers.id),
  region: text("region"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  regionActiveIdx: index("crm_teams_region_active_idx").on(table.region, table.isActive),
  managerIdx: index("crm_teams_manager_idx").on(table.managerId),
}));

// Core CRM Entities - Accounts (Companies)
export const crmAccounts = crmCore.table("crm_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  legalName: text("legal_name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  industry: text("industry"), // enum: technology, healthcare, finance, education, etc.
  sizeTier: text("size_tier").notNull().default("smb"), // enum: micro, smb, ent
  region: text("region"),
  ownerTeamId: varchar("owner_team_id").notNull().references(() => crmTeams.id),
  ownerId: varchar("owner_id").notNull().references(() => crmUsers.id),
  taxId: text("tax_id"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  billingAddress: jsonb("billing_address").$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }>(),
  shippingAddress: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }>(),
  annualRevenue: decimal("annual_revenue"),
  numberOfEmployees: integer("number_of_employees"),
  parentAccountId: varchar("parent_account_id"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  ownerActiveIdx: index("crm_accounts_owner_active_idx").on(table.ownerId, table.isActive),
  teamActiveIdx: index("crm_accounts_team_active_idx").on(table.ownerTeamId, table.isActive),
  industryActiveIdx: index("crm_accounts_industry_active_idx").on(table.industry, table.isActive),
  normalizedNameIdx: uniqueIndex("crm_accounts_normalized_name_idx").on(table.normalizedName),
  sizeTierIdx: index("crm_accounts_size_tier_idx").on(table.sizeTier),
}));

// Contacts - Individuals within accounts
export const crmContacts = crmCore.table("crm_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  primaryEmail: text("primary_email").unique(),
  mxValidated: boolean("mx_validated").notNull().default(false),
  phones: jsonb("phones").$type<string[]>(), // E.164 format
  channels: jsonb("channels").$type<{
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    sms: boolean;
  }>(),
  optInStatus: text("opt_in_status").notNull().default("pending"), // enum: opted_in, opted_out, pending
  optInSource: text("opt_in_source"), // website, import, manual, api
  utm: jsonb("utm").$type<{
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }>(),
  accountId: varchar("account_id").notNull().references(() => crmAccounts.id),
  jobTitle: text("job_title"),
  department: text("department"),
  isPrimary: boolean("is_primary").notNull().default(false),
  socialProfiles: jsonb("social_profiles").$type<Record<string, string>>(),
  preferences: jsonb("preferences").$type<Record<string, any>>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  accountActiveIdx: index("crm_contacts_account_active_idx").on(table.accountId, table.isActive),
  emailActiveIdx: index("crm_contacts_email_active_idx").on(table.primaryEmail, table.isActive),
  optInStatusIdx: index("crm_contacts_opt_in_status_idx").on(table.optInStatus),
  primaryContactIdx: index("crm_contacts_primary_idx").on(table.accountId, table.isPrimary),
}));

// Audit Logs Table - Tracks all CRM actions
export const crmAuditLogs = crmCore.table("crm_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id").notNull().references(() => crmUsers.id),
  action: text("action").notNull(), // create, update, delete, export, view, assign, etc.
  entityType: text("entity_type").notNull(), // accounts, contacts, deals, tickets, users
  entityId: varchar("entity_id").notNull(),
  entityName: text("entity_name"), // Human readable name of the entity
  diff: jsonb("diff").$type<{
    before?: Record<string, any>;
    after?: Record<string, any>;
    changed?: string[];
  }>(),
  metadata: jsonb("metadata").$type<{
    userAgent?: string;
    ipAddress?: string;
    source?: string; // web, api, mobile, etc.
    requestId?: string;
    sessionId?: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  entityTypeIdIdx: index("crm_audit_logs_entity_type_id_idx").on(table.entityType, table.entityId),
  actorActionIdx: index("crm_audit_logs_actor_action_idx").on(table.actorId, table.action),
  createdAtIdx: index("crm_audit_logs_created_at_idx").on(table.createdAt),
}));

// Leads - Prospective customers
export const crmLeads = crmCore.table("crm_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  leadSource: text("lead_source").notNull().default("website"), // website, referral, advertising, cold-call, social-media, webinar, event
  leadStatus: text("lead_status").notNull().default("new"), // new, contacted, qualified, unqualified, nurture, converted
  leadRating: text("lead_rating").notNull().default("cold"), // hot, warm, cold
  leadScore: integer("lead_score").notNull().default(0), // 0-100
  fitScore: integer("fit_score").notNull().default(0), // industry/size/region match
  engagementScore: integer("engagement_score").notNull().default(0), // opens/clicks/visits
  estimatedValue: decimal("estimated_value"),
  expectedCloseDate: timestamp("expected_close_date"),
  assignedTo: varchar("assigned_to").references(() => crmUsers.id),
  teamId: varchar("team_id").references(() => crmTeams.id),
  utm: jsonb("utm").$type<{
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }>(),
  description: text("description"),
  unqualifiedReason: text("unqualified_reason"),
  convertedAt: timestamp("converted_at"),
  convertedContactId: varchar("converted_contact_id"),
  convertedAccountId: varchar("converted_account_id"),
  convertedOpportunityId: varchar("converted_opportunity_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  statusAssigneeIdx: index("crm_leads_status_assignee_idx").on(table.leadStatus, table.assignedTo),
  sourceStatusIdx: index("crm_leads_source_status_idx").on(table.leadSource, table.leadStatus),
  scoreIdx: index("crm_leads_score_idx").on(table.leadScore),
  teamAssigneeIdx: index("crm_leads_team_assignee_idx").on(table.teamId, table.assignedTo),
}));

// Opportunities (Deals) - Sales opportunities
export const crmOpportunities = crmCore.table("crm_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountId: varchar("account_id").notNull().references(() => crmAccounts.id),
  contactId: varchar("contact_id").references(() => crmContacts.id),
  stage: text("stage").notNull().default("prospecting"), // prospecting, qualification, proposal, negotiation, closed-won, closed-lost
  expectedValue: decimal("expected_value"),
  closeDate: timestamp("close_date"),
  winProbability: integer("win_probability").notNull().default(0), // 0-100
  actualCloseDate: timestamp("actual_close_date"),
  leadSource: text("lead_source"),
  description: text("description"),
  lossReason: text("loss_reason"),
  nextStep: text("next_step"),
  ownerId: varchar("owner_id").notNull().references(() => crmUsers.id),
  teamId: varchar("team_id").references(() => crmTeams.id),
  competitorId: varchar("competitor_id"),
  forecastCategory: text("forecast_category").notNull().default("pipeline"), // committed, best_case, pipeline, omitted
  stageEnteredAt: timestamp("stage_entered_at"),
  stageAge: integer("stage_age"), // days in current stage
  isWon: boolean("is_won").notNull().default(false),
  isClosed: boolean("is_closed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  stageOwnerIdx: index("crm_opportunities_stage_owner_idx").on(table.stage, table.ownerId),
  accountOwnerIdx: index("crm_opportunities_account_owner_idx").on(table.accountId, table.ownerId),
  closeDateIdx: index("crm_opportunities_close_date_idx").on(table.closeDate),
  valueIdx: index("crm_opportunities_value_idx").on(table.expectedValue),
  forecastStageIdx: index("crm_opportunities_forecast_stage_idx").on(table.forecastCategory, table.stage),
}));

// Products - Service/product catalog
export const crmProducts = crmCore.table("crm_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sku: text("sku").unique(),
  description: text("description"),
  category: text("category"),
  productFamily: text("product_family"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  categoryActiveIdx: index("crm_products_category_active_idx").on(table.category, table.isActive),
  skuIdx: uniqueIndex("crm_products_sku_idx").on(table.sku),
}));

// Activities - Tasks, calls, meetings, notes
export const crmActivities = crmCore.table("crm_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // call, meeting, task, message, note, attachment
  title: text("title").notNull(),
  subject: text("subject"),
  description: text("description"),
  actorId: varchar("actor_id").notNull().references(() => crmUsers.id),
  againstType: text("against_type").notNull(), // contact, account, deal, lead
  againstId: varchar("against_id").notNull(),
  outcome: text("outcome"),
  durationSec: integer("duration_sec"),
  attachments: jsonb("attachments").$type<Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>>(),
  dueAt: timestamp("due_at"),
  reminderAt: timestamp("reminder_at"),
  completedAt: timestamp("completed_at"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  againstTypeIdIdx: index("crm_activities_against_type_id_idx").on(table.againstType, table.againstId),
  actorCompletedIdx: index("crm_activities_actor_completed_idx").on(table.actorId, table.isCompleted),
  dueAtIdx: index("crm_activities_due_at_idx").on(table.dueAt),
  typeCompletedIdx: index("crm_activities_type_completed_idx").on(table.type, table.isCompleted),
}));

// Tickets - Support/service tickets
export const crmTickets = crmCore.table("crm_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: text("ticket_number").notNull().unique(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  category: text("category").notNull().default("general"), // general, technical, billing, feature_request, bug
  status: text("status").notNull().default("open"), // open, in_progress, pending, resolved, closed
  contactId: varchar("contact_id").references(() => crmContacts.id),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  assignedTo: varchar("assigned_to").notNull().references(() => crmUsers.id),
  teamId: varchar("team_id").references(() => crmTeams.id),
  slaTarget: timestamp("sla_target"),
  slaBreached: boolean("sla_breached").notNull().default(false),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  escalatedAt: timestamp("escalated_at"),
  satisfaction: integer("satisfaction"), // 1-5 rating
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  statusAssigneeIdx: index("crm_tickets_status_assignee_idx").on(table.status, table.assignedTo),
  priorityStatusIdx: index("crm_tickets_priority_status_idx").on(table.priority, table.status),
  categoryStatusIdx: index("crm_tickets_category_status_idx").on(table.category, table.status),
  slaBreachedIdx: index("crm_tickets_sla_breached_idx").on(table.slaBreached),
  ticketNumberIdx: uniqueIndex("crm_tickets_number_idx").on(table.ticketNumber),
}));

// Saved Views - User-specific table configurations
export const crmSavedViews = crmCore.table("crm_saved_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => crmUsers.id),
  tableName: text("table_name").notNull(), // contacts, accounts, opportunities, tickets
  name: text("name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  config: jsonb("config").notNull().$type<{
    columns: string[];
    sorts: Array<{ field: string; direction: 'asc' | 'desc' }>;
    filters: Array<{ field: string; operator: string; value: any }>;
    pageSize: number;
    search?: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userTableIdx: index("crm_saved_views_user_table_idx").on(table.userId, table.tableName),
  userDefaultIdx: index("crm_saved_views_user_default_idx").on(table.userId, table.isDefault),
  publicTableIdx: index("crm_saved_views_public_table_idx").on(table.isPublic, table.tableName),
}));

// Insert schemas for validation
export const insertCrmUserSchema = createInsertSchema(crmUsers);
export const insertCrmTeamSchema = createInsertSchema(crmTeams);
export const insertCrmAccountSchema = createInsertSchema(crmAccounts);
export const insertCrmContactSchema = createInsertSchema(crmContacts);
export const insertCrmLeadSchema = createInsertSchema(crmLeads);
export const insertCrmOpportunitySchema = createInsertSchema(crmOpportunities);
export const insertCrmProductSchema = createInsertSchema(crmProducts);
export const insertCrmActivitySchema = createInsertSchema(crmActivities);
export const insertCrmTicketSchema = createInsertSchema(crmTickets);
export const insertCrmAuditLogSchema = createInsertSchema(crmAuditLogs);
export const insertCrmSavedViewSchema = createInsertSchema(crmSavedViews);

// Select types
export type CrmUser = typeof crmUsers.$inferSelect;
export type CrmTeam = typeof crmTeams.$inferSelect;
export type CrmAccount = typeof crmAccounts.$inferSelect;
export type CrmContact = typeof crmContacts.$inferSelect;
export type CrmLead = typeof crmLeads.$inferSelect;
export type CrmOpportunity = typeof crmOpportunities.$inferSelect;
export type CrmProduct = typeof crmProducts.$inferSelect;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type CrmTicket = typeof crmTickets.$inferSelect;
export type CrmAuditLog = typeof crmAuditLogs.$inferSelect;
export type CrmSavedView = typeof crmSavedViews.$inferSelect;