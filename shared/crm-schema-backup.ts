import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, uuid, boolean, integer, decimal, pgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// CRM isolated schema
export const crmCore = pgSchema("crm_core");

// Feature flags
export const crmFeatureFlags = crmCore.table("crm_feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  enabled: boolean("enabled").default(false),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Users and Teams
export const crmUsers = crmCore.table("crm_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("rep"), // admin, manager, rep, support, marketing
  teamId: varchar("team_id"),
  isActive: boolean("is_active").default(true),
  avatar: text("avatar"),
  phone: text("phone"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmTeams = crmCore.table("crm_teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  managerId: varchar("manager_id").references(() => crmUsers.id),
  region: text("region"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Core CRM Entities
export const crmAccounts = crmCore.table("crm_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  legalName: text("legal_name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  industry: text("industry"), // enum: technology, healthcare, finance, education, etc.
  sizeTier: text("size_tier").default("smb"), // enum: micro, smb, ent
  region: text("region"),
  ownerTeamId: varchar("owner_team_id").references(() => crmTeams.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
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
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmContacts = crmCore.table("crm_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  primaryEmail: text("primary_email").unique(),
  mxValidated: boolean("mx_validated").default(false),
  phones: jsonb("phones").$type<string[]>(), // E.164 format
  channels: jsonb("channels").$type<{
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    sms: boolean;
  }>(),
  optInStatus: text("opt_in_status").default("pending"), // enum: opted_in, opted_out, pending
  optInSource: text("opt_in_source"), // website, import, manual, api
  utm: jsonb("utm").$type<{
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  }>(),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  jobTitle: text("job_title"),
  department: text("department"),
  isPrimary: boolean("is_primary").default(false),
  socialProfiles: jsonb("social_profiles").$type<Record<string, string>>(),
  preferences: jsonb("preferences").$type<Record<string, any>>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

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
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmLeads = crmCore.table("crm_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  leadSource: text("lead_source").default("website"), // website, referral, advertising, cold-call, social-media, webinar, event
  leadStatus: text("lead_status").default("new"), // new, contacted, qualified, unqualified, nurture, converted
  leadRating: text("lead_rating").default("cold"), // hot, warm, cold
  leadScore: integer("lead_score").default(0), // 0-100
  fitScore: integer("fit_score").default(0), // industry/size/region match
  engagementScore: integer("engagement_score").default(0), // opens/clicks/visits
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmOpportunities = crmCore.table("crm_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  contactId: varchar("contact_id").references(() => crmContacts.id),
  stage: text("stage").default("prospecting"), // prospecting, qualification, proposal, negotiation, closed-won, closed-lost
  expectedValue: decimal("expected_value"),
  closeDate: timestamp("close_date"),
  winProbability: integer("win_probability").default(0), // 0-100
  actualCloseDate: timestamp("actual_close_date"),
  leadSource: text("lead_source"),
  description: text("description"),
  lossReason: text("loss_reason"),
  nextStep: text("next_step"),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  teamId: varchar("team_id").references(() => crmTeams.id),
  competitorId: varchar("competitor_id"),
  forecastCategory: text("forecast_category").default("pipeline"), // committed, best_case, pipeline, omitted
  stageEnteredAt: timestamp("stage_entered_at"),
  stageAge: integer("stage_age"), // days in current stage
  isWon: boolean("is_won").default(false),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmProducts = crmCore.table("crm_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sku: text("sku").unique(),
  description: text("description"),
  category: text("category"),
  productFamily: text("product_family"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmPricebook = crmCore.table("crm_pricebook", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  productId: varchar("product_id").references(() => crmProducts.id),
  currency: text("currency").default("USD"),
  listPrice: decimal("list_price"),
  costPrice: decimal("cost_price"),
  pricingType: text("pricing_type").default("fixed"), // fixed, tiered, usage
  pricingRules: jsonb("pricing_rules").$type<Record<string, any>>(),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmActivities = crmCore.table("crm_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // call, meeting, task, message, note, attachment
  title: text("title").notNull(),
  subject: text("subject"),
  description: text("description"),
  actorId: varchar("actor_id").references(() => crmUsers.id),
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
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmTickets = crmCore.table("crm_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: text("ticket_number").notNull().unique(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  category: text("category").default("general"), // general, technical, billing, feature_request, bug
  status: text("status").default("open"), // open, in_progress, pending, resolved, closed
  contactId: varchar("contact_id").references(() => crmContacts.id),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  assignedTo: varchar("assigned_to").references(() => crmUsers.id),
  teamId: varchar("team_id").references(() => crmTeams.id),
  slaTarget: timestamp("sla_target"),
  slaBreached: boolean("sla_breached").default(false),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  escalatedAt: timestamp("escalated_at"),
  satisfaction: integer("satisfaction"), // 1-5 rating
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmQuotes = crmCore.table("crm_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: text("quote_number").notNull().unique(),
  name: text("name").notNull(),
  opportunityId: varchar("opportunity_id").references(() => crmOpportunities.id),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  contactId: varchar("contact_id").references(() => crmContacts.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  status: text("status").default("draft"), // draft, sent, accepted, declined, expired
  subtotal: decimal("subtotal"),
  discount: decimal("discount"),
  tax: decimal("tax"),
  total: decimal("total"),
  currency: text("currency").default("USD"),
  validUntil: timestamp("valid_until"),
  terms: text("terms"),
  notes: text("notes"),
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by").references(() => crmUsers.id),
  approvedAt: timestamp("approved_at"),
  sentAt: timestamp("sent_at"),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmInvoices = crmCore.table("crm_invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  quoteId: varchar("quote_id").references(() => crmQuotes.id),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  contactId: varchar("contact_id").references(() => crmContacts.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  status: text("status").default("draft"), // draft, sent, paid, overdue, cancelled
  subtotal: decimal("subtotal"),
  discount: decimal("discount"),
  tax: decimal("tax"),
  total: decimal("total"),
  currency: text("currency").default("USD"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  paidAmount: decimal("paid_amount").default(sql`0`),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),
  terms: text("terms"),
  notes: text("notes"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const crmSubscriptions = crmCore.table("crm_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountId: varchar("account_id").references(() => crmAccounts.id),
  contactId: varchar("contact_id").references(() => crmContacts.id),
  productId: varchar("product_id").references(() => crmProducts.id),
  ownerId: varchar("owner_id").references(() => crmUsers.id),
  status: text("status").default("active"), // active, suspended, cancelled, expired
  billingFrequency: text("billing_frequency").default("monthly"), // monthly, quarterly, annually
  amount: decimal("amount"),
  currency: text("currency").default("USD"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  renewalDate: timestamp("renewal_date"),
  autoRenew: boolean("auto_renew").default(true),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Timeline & Audit
export const crmTimeline = crmCore.table("crm_timeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data").$type<Record<string, any>>(),
  actorId: varchar("actor_id").references(() => crmUsers.id),
  actorType: text("actor_type").default("user"), // user, system, api
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmAuditLog = crmCore.table("crm_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableName: text("table_name").notNull(),
  recordId: varchar("record_id").notNull(),
  operation: text("operation").notNull(), // INSERT, UPDATE, DELETE
  oldValues: jsonb("old_values").$type<Record<string, any>>(),
  newValues: jsonb("new_values").$type<Record<string, any>>(),
  changedFields: jsonb("changed_fields").$type<string[]>(),
  actorId: varchar("actor_id").references(() => crmUsers.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tags & Custom Fields
export const crmTags = crmCore.table("crm_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  color: text("color").default("#3B82F6"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmEntityTags = crmCore.table("crm_entity_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tagId: varchar("tag_id").references(() => crmTags.id),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  createdBy: varchar("created_by").references(() => crmUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmCustomFields = crmCore.table("crm_custom_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  fieldName: text("field_name").notNull(),
  fieldLabel: text("field_label").notNull(),
  fieldType: text("field_type").notNull(), // text, number, date, boolean, select, multi_select
  fieldOptions: jsonb("field_options").$type<string[]>(),
  isRequired: boolean("is_required").default(false),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmCustomValues = crmCore.table("crm_custom_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").references(() => crmCustomFields.id),
  entityId: varchar("entity_id").notNull(),
  textValue: text("text_value"),
  numberValue: decimal("number_value"),
  dateValue: timestamp("date_value"),
  booleanValue: boolean("boolean_value"),
  jsonValue: jsonb("json_value").$type<any>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Data Quality
export const crmDedupeJobs = crmCore.table("crm_dedupe_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  status: text("status").default("pending"), // pending, running, completed, failed
  totalRecords: integer("total_records"),
  processedRecords: integer("processed_records").default(0),
  duplicatesFound: integer("duplicates_found").default(0),
  duplicatesFixed: integer("duplicates_fixed").default(0),
  criteria: jsonb("criteria").$type<Record<string, any>>(),
  results: jsonb("results").$type<Record<string, any>>(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdBy: varchar("created_by").references(() => crmUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmMergeCandidates = crmCore.table("crm_merge_candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  masterRecordId: varchar("master_record_id").notNull(),
  duplicateRecordId: varchar("duplicate_record_id").notNull(),
  matchScore: decimal("match_score"), // 0-1 confidence score
  matchCriteria: jsonb("match_criteria").$type<Record<string, any>>(),
  status: text("status").default("pending"), // pending, approved, rejected, merged
  reviewedBy: varchar("reviewed_by").references(() => crmUsers.id),
  reviewedAt: timestamp("reviewed_at"),
  mergedAt: timestamp("merged_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workflow & Automation
export const crmWorkflows = crmCore.table("crm_workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  triggerType: text("trigger_type").notNull(), // record_created, record_updated, field_changed, time_based
  triggerConditions: jsonb("trigger_conditions").$type<Record<string, any>>(),
  actions: jsonb("actions").$type<Array<{
    type: string;
    config: Record<string, any>;
    order: number;
  }>>(),
  isActive: boolean("is_active").default(false),
  executionCount: integer("execution_count").default(0),
  lastExecutedAt: timestamp("last_executed_at"),
  createdBy: varchar("created_by").references(() => crmUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// Insert Schemas
export const insertCrmUserSchema = createInsertSchema(crmUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmAccountSchema = createInsertSchema(crmAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmLeadSchema = createInsertSchema(crmLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmOpportunitySchema = createInsertSchema(crmOpportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmActivitySchema = createInsertSchema(crmActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const insertCrmTicketSchema = createInsertSchema(crmTickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

// Types
export type CrmUser = typeof crmUsers.$inferSelect;
export type CrmAccount = typeof crmAccounts.$inferSelect;
export type CrmContact = typeof crmContacts.$inferSelect;
export type CrmLead = typeof crmLeads.$inferSelect;
export type CrmOpportunity = typeof crmOpportunities.$inferSelect;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type CrmTicket = typeof crmTickets.$inferSelect;
export type CrmQuote = typeof crmQuotes.$inferSelect;
export type CrmInvoice = typeof crmInvoices.$inferSelect;
export type CrmSubscription = typeof crmSubscriptions.$inferSelect;

export type InsertCrmUser = z.infer<typeof insertCrmUserSchema>;
export type InsertCrmAccount = z.infer<typeof insertCrmAccountSchema>;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type InsertCrmLead = z.infer<typeof insertCrmLeadSchema>;
export type InsertCrmOpportunity = z.infer<typeof insertCrmOpportunitySchema>;
export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;
export type InsertCrmTicket = z.infer<typeof insertCrmTicketSchema>;