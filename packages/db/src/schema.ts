// Unified database schema combining main schema and CRM schema
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, index, unique, boolean, integer, decimal, pgSchema, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import and re-export main schema (avoiding CRM conflicts)
import * as mainSchema from "../../../shared/schema";
import * as crmSchema from "../../../shared/crm-schema";

// Re-export main schema without CRM conflicts
export const {
  crmActivities: mainCrmActivities,
  CrmActivity: MainCrmActivity,
  insertCrmActivitySchema: mainInsertCrmActivitySchema,
  ...restMainSchema
} = mainSchema;

// Re-export all from main schema except conflicting ones
export const users = mainSchema.users;
export const contactSubmissions = mainSchema.contactSubmissions;
export const portfolioItems = mainSchema.portfolioItems;
export const services = mainSchema.services;
export const testimonials = mainSchema.testimonials;
export const subscriptionPlans = mainSchema.subscriptionPlans;
export const userSubscriptions = mainSchema.userSubscriptions;
export const serviceRequests = mainSchema.serviceRequests;
export const projects = mainSchema.projects;
export const supportTickets = mainSchema.supportTickets;
export const ticketMessages = mainSchema.ticketMessages;
export const blogPosts = mainSchema.blogPosts;
export const notifications = mainSchema.notifications;
export const invoices = mainSchema.invoices;
export const dealStages = mainSchema.dealStages;
export const ticketStatus = mainSchema.ticketStatus;
export const leads = mainSchema.leads;
export const accounts = mainSchema.accounts;
export const contacts = mainSchema.contacts;
export const opportunities = mainSchema.opportunities;
export const tasks = mainSchema.tasks;
export const clientRequests = mainSchema.clientRequests;
export const savedFilters = mainSchema.savedFilters;

// Re-export all CRM schema
export * from "../../../shared/crm-schema";

// Re-export types and schemas
export type * from "../../../shared/schema";
export type * from "../../../shared/crm-schema";

// Placeholder for future unified schema additions
export const _placeholder = {};