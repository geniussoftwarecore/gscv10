import { db } from "../server/db";
import { eq, and, desc, asc, sql, ilike, isNull, gte, lte, inArray } from "drizzle-orm";
import {
  crmUsers, crmTeams, crmAccounts, crmContacts, crmLeads, crmOpportunities,
  crmActivities, crmTickets, crmQuotes, crmInvoices, crmSubscriptions,
  crmTimeline, crmAuditLog, crmTags, crmEntityTags, crmFeatureFlags,
  type CrmUser, type CrmAccount, type CrmContact, type CrmLead, 
  type CrmOpportunity, type CrmActivity, type CrmTicket,
  type InsertCrmUser, type InsertCrmAccount, type InsertCrmContact,
  type InsertCrmLead, type InsertCrmOpportunity, type InsertCrmActivity,
  type InsertCrmTicket
} from "../shared/crm-schema";

export class CrmStorage {
  // Feature Flags
  async getFeatureFlag(name: string): Promise<boolean> {
    const flag = await db.query.crmFeatureFlags.findFirst({
      where: eq(crmFeatureFlags.name, name)
    });
    return flag?.enabled ?? false;
  }

  async setFeatureFlag(name: string, enabled: boolean): Promise<void> {
    await db.insert(crmFeatureFlags)
      .values({ name, enabled })
      .onConflictDoUpdate({
        target: crmFeatureFlags.name,
        set: { enabled, updatedAt: sql`NOW()` }
      });
  }

  // Users & Teams
  async getCrmUsers(filters?: {
    teamId?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<CrmUser[]> {
    let query = db.select().from(crmUsers).where(isNull(crmUsers.deletedAt));
    
    if (filters?.teamId) {
      query = query.where(eq(crmUsers.teamId, filters.teamId));
    }
    if (filters?.role) {
      query = query.where(eq(crmUsers.role, filters.role));
    }
    if (filters?.isActive !== undefined) {
      query = query.where(eq(crmUsers.isActive, filters.isActive));
    }
    
    return await query.orderBy(crmUsers.firstName, crmUsers.lastName);
  }

  async createCrmUser(data: InsertCrmUser): Promise<CrmUser> {
    const [user] = await db.insert(crmUsers).values(data).returning();
    await this.logTimeline('user', user.id, 'created', { user: data });
    return user;
  }

  async getCrmUserById(id: string): Promise<CrmUser | undefined> {
    return await db.query.crmUsers.findFirst({
      where: and(eq(crmUsers.id, id), isNull(crmUsers.deletedAt))
    });
  }

  // Accounts
  async getAccounts(filters?: {
    ownerId?: string;
    industry?: string;
    sizeTier?: string;
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ accounts: CrmAccount[], total: number }> {
    const conditions = [isNull(crmAccounts.deletedAt)];
    
    if (filters?.ownerId) {
      conditions.push(eq(crmAccounts.ownerId, filters.ownerId));
    }
    if (filters?.industry) {
      conditions.push(eq(crmAccounts.industry, filters.industry));
    }
    if (filters?.sizeTier) {
      conditions.push(eq(crmAccounts.sizeTier, filters.sizeTier));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(crmAccounts.isActive, filters.isActive));
    }
    if (filters?.search) {
      conditions.push(ilike(crmAccounts.legalName, `%${filters.search}%`));
    }

    const [accounts, [{ count }]] = await Promise.all([
      db.select().from(crmAccounts)
        .where(and(...conditions))
        .orderBy(desc(crmAccounts.updatedAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmAccounts)
        .where(and(...conditions))
    ]);

    return { accounts, total: count };
  }

  async createAccount(data: InsertCrmAccount): Promise<CrmAccount> {
    // Generate normalized name for deduplication
    const normalizedName = data.legalName.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const accountData = { 
      ...data, 
      normalizedName,
      updatedAt: sql`NOW()`
    };
    
    const [account] = await db.insert(crmAccounts).values(accountData).returning();
    await this.logTimeline('account', account.id, 'created', { account: accountData });
    return account;
  }

  async getAccountById(id: string): Promise<CrmAccount | undefined> {
    return await db.query.crmAccounts.findFirst({
      where: and(eq(crmAccounts.id, id), isNull(crmAccounts.deletedAt))
    });
  }

  async updateAccount(id: string, data: Partial<InsertCrmAccount>): Promise<CrmAccount | undefined> {
    const updateData = { ...data, updatedAt: sql`NOW()` };
    const [account] = await db.update(crmAccounts)
      .set(updateData)
      .where(and(eq(crmAccounts.id, id), isNull(crmAccounts.deletedAt)))
      .returning();
    
    if (account) {
      await this.logTimeline('account', account.id, 'updated', { changes: data });
    }
    return account;
  }

  // Contacts
  async getContacts(filters?: {
    accountId?: string;
    ownerId?: string;
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ contacts: CrmContact[], total: number }> {
    const conditions = [isNull(crmContacts.deletedAt)];
    
    if (filters?.accountId) {
      conditions.push(eq(crmContacts.accountId, filters.accountId));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(crmContacts.isActive, filters.isActive));
    }
    if (filters?.search) {
      conditions.push(
        sql`CONCAT(${crmContacts.firstName}, ' ', ${crmContacts.lastName}) ILIKE ${`%${filters.search}%`}`
      );
    }

    const [contacts, [{ count }]] = await Promise.all([
      db.select().from(crmContacts)
        .where(and(...conditions))
        .orderBy(desc(crmContacts.updatedAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmContacts)
        .where(and(...conditions))
    ]);

    return { contacts, total: count };
  }

  async createContact(data: InsertCrmContact): Promise<CrmContact> {
    const contactData = { ...data, updatedAt: sql`NOW()` };
    const [contact] = await db.insert(crmContacts).values(contactData).returning();
    await this.logTimeline('contact', contact.id, 'created', { contact: contactData });
    return contact;
  }

  async getContactById(id: string): Promise<CrmContact | undefined> {
    return await db.query.crmContacts.findFirst({
      where: and(eq(crmContacts.id, id), isNull(crmContacts.deletedAt))
    });
  }

  // Leads
  async getLeads(filters?: {
    assignedTo?: string;
    status?: string;
    rating?: string;
    source?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ leads: CrmLead[], total: number }> {
    const conditions = [isNull(crmLeads.deletedAt)];
    
    if (filters?.assignedTo) {
      conditions.push(eq(crmLeads.assignedTo, filters.assignedTo));
    }
    if (filters?.status) {
      conditions.push(eq(crmLeads.leadStatus, filters.status));
    }
    if (filters?.rating) {
      conditions.push(eq(crmLeads.leadRating, filters.rating));
    }
    if (filters?.source) {
      conditions.push(eq(crmLeads.leadSource, filters.source));
    }
    if (filters?.search) {
      conditions.push(
        sql`CONCAT(${crmLeads.firstName}, ' ', ${crmLeads.lastName}) ILIKE ${`%${filters.search}%`}`
      );
    }

    const [leads, [{ count }]] = await Promise.all([
      db.select().from(crmLeads)
        .where(and(...conditions))
        .orderBy(desc(crmLeads.leadScore), desc(crmLeads.updatedAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmLeads)
        .where(and(...conditions))
    ]);

    return { leads, total: count };
  }

  async createLead(data: InsertCrmLead): Promise<CrmLead> {
    // Calculate lead score
    const leadScore = this.calculateLeadScore(data);
    const leadData = { ...data, leadScore, updatedAt: sql`NOW()` };
    
    const [lead] = await db.insert(crmLeads).values(leadData).returning();
    await this.logTimeline('lead', lead.id, 'created', { lead: leadData });
    return lead;
  }

  async getLeadById(id: string): Promise<CrmLead | undefined> {
    return await db.query.crmLeads.findFirst({
      where: and(eq(crmLeads.id, id), isNull(crmLeads.deletedAt))
    });
  }

  async updateLead(id: string, data: Partial<InsertCrmLead>): Promise<CrmLead | undefined> {
    const updateData = { ...data, updatedAt: sql`NOW()` };
    const [lead] = await db.update(crmLeads)
      .set(updateData)
      .where(and(eq(crmLeads.id, id), isNull(crmLeads.deletedAt)))
      .returning();
    
    if (lead) {
      await this.logTimeline('lead', lead.id, 'updated', { changes: data });
    }
    return lead;
  }

  async convertLead(leadId: string, options: {
    createContact: boolean;
    createAccount: boolean;
    createOpportunity: boolean;
    accountData?: InsertCrmAccount;
    opportunityData?: InsertCrmOpportunity;
  }): Promise<{
    contact?: CrmContact;
    account?: CrmAccount;
    opportunity?: CrmOpportunity;
  }> {
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error('Lead not found');

    let contact: CrmContact | undefined;
    let account: CrmAccount | undefined;
    let opportunity: CrmOpportunity | undefined;

    // Create account if requested
    if (options.createAccount && options.accountData) {
      account = await this.createAccount(options.accountData);
    }

    // Create contact
    if (options.createContact) {
      contact = await this.createContact({
        firstName: lead.firstName,
        lastName: lead.lastName,
        primaryEmail: lead.email || undefined,
        phones: lead.phone ? [lead.phone] : undefined,
        accountId: account?.id,
        jobTitle: lead.jobTitle || undefined,
        utm: lead.utm,
        optInStatus: 'opted_in',
        optInSource: 'lead_conversion'
      });
    }

    // Create opportunity if requested
    if (options.createOpportunity && options.opportunityData) {
      opportunity = await this.createOpportunity({
        ...options.opportunityData,
        accountId: account?.id,
        contactId: contact?.id,
        leadSource: lead.leadSource,
      });
    }

    // Update lead as converted
    await this.updateLead(leadId, {
      leadStatus: 'converted',
      convertedAt: sql`NOW()`,
      convertedContactId: contact?.id,
      convertedAccountId: account?.id,
      convertedOpportunityId: opportunity?.id,
    });

    return { contact, account, opportunity };
  }

  // Opportunities
  async getOpportunities(filters?: {
    ownerId?: string;
    accountId?: string;
    stage?: string;
    isClosed?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ opportunities: CrmOpportunity[], total: number }> {
    const conditions = [isNull(crmOpportunities.deletedAt)];
    
    if (filters?.ownerId) {
      conditions.push(eq(crmOpportunities.ownerId, filters.ownerId));
    }
    if (filters?.accountId) {
      conditions.push(eq(crmOpportunities.accountId, filters.accountId));
    }
    if (filters?.stage) {
      conditions.push(eq(crmOpportunities.stage, filters.stage));
    }
    if (filters?.isClosed !== undefined) {
      conditions.push(eq(crmOpportunities.isClosed, filters.isClosed));
    }
    if (filters?.search) {
      conditions.push(ilike(crmOpportunities.name, `%${filters.search}%`));
    }

    const [opportunities, [{ count }]] = await Promise.all([
      db.select().from(crmOpportunities)
        .where(and(...conditions))
        .orderBy(desc(crmOpportunities.expectedValue), desc(crmOpportunities.updatedAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmOpportunities)
        .where(and(...conditions))
    ]);

    return { opportunities, total: count };
  }

  async createOpportunity(data: InsertCrmOpportunity): Promise<CrmOpportunity> {
    const opportunityData = { 
      ...data, 
      stageEnteredAt: sql`NOW()`,
      updatedAt: sql`NOW()` 
    };
    
    const [opportunity] = await db.insert(crmOpportunities).values(opportunityData).returning();
    await this.logTimeline('opportunity', opportunity.id, 'created', { opportunity: opportunityData });
    return opportunity;
  }

  // Activities
  async getActivities(filters?: {
    actorId?: string;
    againstType?: string;
    againstId?: string;
    type?: string;
    isCompleted?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ activities: CrmActivity[], total: number }> {
    const conditions = [isNull(crmActivities.deletedAt)];
    
    if (filters?.actorId) {
      conditions.push(eq(crmActivities.actorId, filters.actorId));
    }
    if (filters?.againstType) {
      conditions.push(eq(crmActivities.againstType, filters.againstType));
    }
    if (filters?.againstId) {
      conditions.push(eq(crmActivities.againstId, filters.againstId));
    }
    if (filters?.type) {
      conditions.push(eq(crmActivities.type, filters.type));
    }
    if (filters?.isCompleted !== undefined) {
      conditions.push(eq(crmActivities.isCompleted, filters.isCompleted));
    }

    const [activities, [{ count }]] = await Promise.all([
      db.select().from(crmActivities)
        .where(and(...conditions))
        .orderBy(desc(crmActivities.createdAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmActivities)
        .where(and(...conditions))
    ]);

    return { activities, total: count };
  }

  async createActivity(data: InsertCrmActivity): Promise<CrmActivity> {
    const [activity] = await db.insert(crmActivities).values(data).returning();
    await this.logTimeline('activity', activity.id, 'created', { activity: data });
    return activity;
  }

  // Tickets  
  async getTickets(filters?: {
    assignedTo?: string;
    status?: string;
    priority?: string;
    contactId?: string;
    accountId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ tickets: CrmTicket[], total: number }> {
    const conditions = [isNull(crmTickets.deletedAt)];
    
    if (filters?.assignedTo) {
      conditions.push(eq(crmTickets.assignedTo, filters.assignedTo));
    }
    if (filters?.status) {
      conditions.push(eq(crmTickets.status, filters.status));
    }
    if (filters?.priority) {
      conditions.push(eq(crmTickets.priority, filters.priority));
    }
    if (filters?.contactId) {
      conditions.push(eq(crmTickets.contactId, filters.contactId));
    }
    if (filters?.accountId) {
      conditions.push(eq(crmTickets.accountId, filters.accountId));
    }

    const [tickets, [{ count }]] = await Promise.all([
      db.select().from(crmTickets)
        .where(and(...conditions))
        .orderBy(desc(crmTickets.createdAt))
        .limit(filters?.limit ?? 50)
        .offset(filters?.offset ?? 0),
      db.select({ count: sql<number>`COUNT(*)` }).from(crmTickets)
        .where(and(...conditions))
    ]);

    return { tickets, total: count };
  }

  async createTicket(data: InsertCrmTicket): Promise<CrmTicket> {
    // Generate ticket number
    const ticketNumber = await this.generateTicketNumber();
    const ticketData = { ...data, ticketNumber };
    
    const [ticket] = await db.insert(crmTickets).values(ticketData).returning();
    await this.logTimeline('ticket', ticket.id, 'created', { ticket: ticketData });
    return ticket;
  }

  // Timeline & Audit
  async logTimeline(entityType: string, entityId: string, eventType: string, eventData: any, actorId?: string): Promise<void> {
    await db.insert(crmTimeline).values({
      entityType,
      entityId,
      eventType,
      eventData,
      actorId,
      actorType: actorId ? 'user' : 'system',
    });
  }

  async getTimeline(entityType: string, entityId: string, limit = 50): Promise<any[]> {
    return await db.select().from(crmTimeline)
      .where(and(eq(crmTimeline.entityType, entityType), eq(crmTimeline.entityId, entityId)))
      .orderBy(desc(crmTimeline.createdAt))
      .limit(limit);
  }

  // Utility methods
  private calculateLeadScore(lead: InsertCrmLead): number {
    let score = 0;
    
    // Fit score (industry, company, title)
    if (lead.company) score += 20;
    if (lead.jobTitle?.toLowerCase().includes('manager') || 
        lead.jobTitle?.toLowerCase().includes('director') || 
        lead.jobTitle?.toLowerCase().includes('ceo')) score += 15;
    if (lead.estimatedValue && parseFloat(lead.estimatedValue.toString()) > 10000) score += 25;
    
    // Engagement score (will be updated based on interactions)
    if (lead.leadSource === 'referral') score += 20;
    if (lead.leadSource === 'website') score += 10;
    
    return Math.min(score, 100);
  }

  private async generateTicketNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const [result] = await db.select({ 
      count: sql<number>`COUNT(*)` 
    }).from(crmTickets)
    .where(sql`date_part('year', created_at) = ${year} AND date_part('month', created_at) = ${now.getMonth() + 1}`);
    
    const sequence = (result.count + 1).toString().padStart(4, '0');
    return `TKT-${year}${month}-${sequence}`;
  }

  // Soft delete methods
  async softDeleteAccount(id: string): Promise<boolean> {
    const [account] = await db.update(crmAccounts)
      .set({ deletedAt: sql`NOW()` })
      .where(and(eq(crmAccounts.id, id), isNull(crmAccounts.deletedAt)))
      .returning();
    
    if (account) {
      await this.logTimeline('account', account.id, 'deleted', {});
      return true;
    }
    return false;
  }

  async softDeleteContact(id: string): Promise<boolean> {
    const [contact] = await db.update(crmContacts)
      .set({ deletedAt: sql`NOW()` })
      .where(and(eq(crmContacts.id, id), isNull(crmContacts.deletedAt)))
      .returning();
    
    if (contact) {
      await this.logTimeline('contact', contact.id, 'deleted', {});
      return true;
    }
    return false;
  }

  async softDeleteLead(id: string): Promise<boolean> {
    const [lead] = await db.update(crmLeads)
      .set({ deletedAt: sql`NOW()` })
      .where(and(eq(crmLeads.id, id), isNull(crmLeads.deletedAt)))
      .returning();
    
    if (lead) {
      await this.logTimeline('lead', lead.id, 'deleted', {});
      return true;
    }
    return false;
  }
}

export const crmStorage = new CrmStorage();