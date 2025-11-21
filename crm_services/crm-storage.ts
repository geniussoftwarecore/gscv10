import { db } from "../server/db";
import { sql } from "drizzle-orm";

// CRM Storage Service using direct SQL queries
export class CrmStorage {
  // Feature Flags
  async getFeatureFlag(name: string): Promise<boolean> {
    const result = await db.execute(sql`
      SELECT enabled FROM crm_core.crm_feature_flags 
      WHERE name = ${name}
    `);
    return result.rows[0]?.enabled ?? false;
  }

  async setFeatureFlag(name: string, enabled: boolean): Promise<void> {
    await db.execute(sql`
      INSERT INTO crm_core.crm_feature_flags (name, enabled) 
      VALUES (${name}, ${enabled})
      ON CONFLICT (name) DO UPDATE SET 
        enabled = ${enabled}, 
        updated_at = NOW()
    `);
  }

  // Users & Teams
  async getCrmUsers(filters?: {
    teamId?: string;
    role?: string;
    isActive?: boolean;
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_users 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.teamId) {
      conditions.push(sql`team_id = ${filters.teamId}`);
    }
    if (filters?.role) {
      conditions.push(sql`role = ${filters.role}`);
    }
    if (filters?.isActive !== undefined) {
      conditions.push(sql`is_active = ${filters.isActive}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY first_name, last_name`;
    
    const result = await db.execute(query);
    return result.rows;
  }

  async createCrmUser(data: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    teamId?: string;
    phone?: string;
  }) {
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_users (
        username, email, first_name, last_name, role, team_id, phone
      ) VALUES (
        ${data.username}, ${data.email}, ${data.firstName}, 
        ${data.lastName}, ${data.role || 'rep'}, ${data.teamId}, ${data.phone}
      )
      RETURNING *
    `);
    
    const user = result.rows[0];
    await this.logTimeline('user', user.id, 'created', { user: data });
    return user;
  }

  async getCrmUserById(id: string) {
    const result = await db.execute(sql`
      SELECT * FROM crm_core.crm_users 
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    return result.rows[0];
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
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_accounts 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.ownerId) {
      conditions.push(sql`owner_id = ${filters.ownerId}`);
    }
    if (filters?.industry) {
      conditions.push(sql`industry = ${filters.industry}`);
    }
    if (filters?.sizeTier) {
      conditions.push(sql`size_tier = ${filters.sizeTier}`);
    }
    if (filters?.isActive !== undefined) {
      conditions.push(sql`is_active = ${filters.isActive}`);
    }
    if (filters?.search) {
      conditions.push(sql`legal_name ILIKE ${`%${filters.search}%`}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY updated_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [accounts, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_accounts 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      accounts: accounts.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createAccount(data: {
    legalName: string;
    industry?: string;
    sizeTier?: string;
    region?: string;
    ownerId?: string;
    ownerTeamId?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
  }) {
    // Generate normalized name for deduplication
    const normalizedName = data.legalName.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_accounts (
        legal_name, normalized_name, industry, size_tier, region,
        owner_id, owner_team_id, website, phone, email, description
      ) VALUES (
        ${data.legalName}, ${normalizedName}, ${data.industry}, 
        ${data.sizeTier || 'smb'}, ${data.region}, ${data.ownerId},
        ${data.ownerTeamId}, ${data.website}, ${data.phone}, 
        ${data.email}, ${data.description}
      )
      RETURNING *
    `);
    
    const account = result.rows[0];
    await this.logTimeline('account', account.id, 'created', { account: data });
    return account;
  }

  async getAccountById(id: string) {
    const result = await db.execute(sql`
      SELECT * FROM crm_core.crm_accounts 
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    return result.rows[0];
  }

  async updateAccount(id: string, data: any) {
    const setPairs = [];
    const values = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        setPairs.push(`${key} = $${values.length + 2}`); // +2 because id is $1
        values.push(value);
      }
    }
    
    if (setPairs.length === 0) return null;
    
    const query = `
      UPDATE crm_core.crm_accounts 
      SET ${setPairs.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    
    const result = await db.execute(sql.raw(query, [id, ...values]));
    const account = result.rows[0];
    
    if (account) {
      await this.logTimeline('account', account.id, 'updated', { changes: data });
    }
    return account;
  }

  // Contacts
  async getContacts(filters?: {
    accountId?: string;
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_contacts 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.accountId) {
      conditions.push(sql`account_id = ${filters.accountId}`);
    }
    if (filters?.isActive !== undefined) {
      conditions.push(sql`is_active = ${filters.isActive}`);
    }
    if (filters?.search) {
      conditions.push(sql`
        CONCAT(first_name, ' ', last_name) ILIKE ${`%${filters.search}%`}
      `);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY updated_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [contacts, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_contacts 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      contacts: contacts.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createContact(data: {
    firstName: string;
    lastName: string;
    primaryEmail?: string;
    phones?: string[];
    accountId?: string;
    jobTitle?: string;
    department?: string;
    isPrimary?: boolean;
    utm?: any;
    optInStatus?: string;
    optInSource?: string;
  }) {
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_contacts (
        first_name, last_name, primary_email, phones, account_id,
        job_title, department, is_primary, utm, opt_in_status, opt_in_source
      ) VALUES (
        ${data.firstName}, ${data.lastName}, ${data.primaryEmail}, 
        ${JSON.stringify(data.phones || [])}, ${data.accountId},
        ${data.jobTitle}, ${data.department}, ${data.isPrimary || false},
        ${JSON.stringify(data.utm || {})}, ${data.optInStatus || 'pending'},
        ${data.optInSource || 'manual'}
      )
      RETURNING *
    `);
    
    const contact = result.rows[0];
    await this.logTimeline('contact', contact.id, 'created', { contact: data });
    return contact;
  }

  async getContactById(id: string) {
    const result = await db.execute(sql`
      SELECT * FROM crm_core.crm_contacts 
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    return result.rows[0];
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
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_leads 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.assignedTo) {
      conditions.push(sql`assigned_to = ${filters.assignedTo}`);
    }
    if (filters?.status) {
      conditions.push(sql`lead_status = ${filters.status}`);
    }
    if (filters?.rating) {
      conditions.push(sql`lead_rating = ${filters.rating}`);
    }
    if (filters?.source) {
      conditions.push(sql`lead_source = ${filters.source}`);
    }
    if (filters?.search) {
      conditions.push(sql`
        CONCAT(first_name, ' ', last_name) ILIKE ${`%${filters.search}%`}
      `);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY lead_score DESC, updated_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [leads, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_leads 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      leads: leads.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createLead(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    leadSource?: string;
    leadRating?: string;
    estimatedValue?: string;
    assignedTo?: string;
    teamId?: string;
    utm?: any;
    description?: string;
  }) {
    // Calculate lead score
    const leadScore = this.calculateLeadScore(data);
    
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_leads (
        first_name, last_name, email, phone, company, job_title,
        lead_source, lead_rating, lead_score, estimated_value,
        assigned_to, team_id, utm, description
      ) VALUES (
        ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
        ${data.company}, ${data.jobTitle}, ${data.leadSource || 'website'},
        ${data.leadRating || 'cold'}, ${leadScore}, ${data.estimatedValue},
        ${data.assignedTo}, ${data.teamId}, ${JSON.stringify(data.utm || {})},
        ${data.description}
      )
      RETURNING *
    `);
    
    const lead = result.rows[0];
    await this.logTimeline('lead', lead.id, 'created', { lead: data });
    return lead;
  }

  async getLeadById(id: string) {
    const result = await db.execute(sql`
      SELECT * FROM crm_core.crm_leads 
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    return result.rows[0];
  }

  async updateLead(id: string, data: any) {
    const setPairs = [];
    const values = [];
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        setPairs.push(`${key} = $${values.length + 2}`);
        values.push(value);
      }
    }
    
    if (setPairs.length === 0) return null;
    
    const query = `
      UPDATE crm_core.crm_leads 
      SET ${setPairs.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    
    const result = await db.execute(sql.raw(query, [id, ...values]));
    const lead = result.rows[0];
    
    if (lead) {
      await this.logTimeline('lead', lead.id, 'updated', { changes: data });
    }
    return lead;
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
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_opportunities 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.ownerId) {
      conditions.push(sql`owner_id = ${filters.ownerId}`);
    }
    if (filters?.accountId) {
      conditions.push(sql`account_id = ${filters.accountId}`);
    }
    if (filters?.stage) {
      conditions.push(sql`stage = ${filters.stage}`);
    }
    if (filters?.isClosed !== undefined) {
      conditions.push(sql`is_closed = ${filters.isClosed}`);
    }
    if (filters?.search) {
      conditions.push(sql`name ILIKE ${`%${filters.search}%`}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY expected_value DESC, updated_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [opportunities, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_opportunities 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      opportunities: opportunities.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createOpportunity(data: {
    name: string;
    accountId?: string;
    contactId?: string;
    stage?: string;
    expectedValue?: string;
    closeDate?: string;
    winProbability?: number;
    leadSource?: string;
    description?: string;
    ownerId?: string;
    teamId?: string;
  }) {
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_opportunities (
        name, account_id, contact_id, stage, expected_value, close_date,
        win_probability, lead_source, description, owner_id, team_id,
        stage_entered_at
      ) VALUES (
        ${data.name}, ${data.accountId}, ${data.contactId}, 
        ${data.stage || 'prospecting'}, ${data.expectedValue}, ${data.closeDate},
        ${data.winProbability || 0}, ${data.leadSource}, ${data.description},
        ${data.ownerId}, ${data.teamId}, NOW()
      )
      RETURNING *
    `);
    
    const opportunity = result.rows[0];
    await this.logTimeline('opportunity', opportunity.id, 'created', { opportunity: data });
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
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_activities 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.actorId) {
      conditions.push(sql`actor_id = ${filters.actorId}`);
    }
    if (filters?.againstType) {
      conditions.push(sql`against_type = ${filters.againstType}`);
    }
    if (filters?.againstId) {
      conditions.push(sql`against_id = ${filters.againstId}`);
    }
    if (filters?.type) {
      conditions.push(sql`type = ${filters.type}`);
    }
    if (filters?.isCompleted !== undefined) {
      conditions.push(sql`is_completed = ${filters.isCompleted}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY created_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [activities, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_activities 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      activities: activities.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createActivity(data: {
    type: string;
    title: string;
    subject?: string;
    description?: string;
    actorId?: string;
    againstType: string;
    againstId: string;
    outcome?: string;
    durationSec?: number;
    attachments?: any[];
    dueAt?: string;
    reminderAt?: string;
  }) {
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_activities (
        type, title, subject, description, actor_id, against_type, against_id,
        outcome, duration_sec, attachments, due_at, reminder_at
      ) VALUES (
        ${data.type}, ${data.title}, ${data.subject}, ${data.description},
        ${data.actorId}, ${data.againstType}, ${data.againstId}, ${data.outcome},
        ${data.durationSec}, ${JSON.stringify(data.attachments || [])},
        ${data.dueAt}, ${data.reminderAt}
      )
      RETURNING *
    `);
    
    const activity = result.rows[0];
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
  }) {
    let query = sql`
      SELECT * FROM crm_core.crm_tickets 
      WHERE deleted_at IS NULL
    `;
    
    const conditions = [];
    if (filters?.assignedTo) {
      conditions.push(sql`assigned_to = ${filters.assignedTo}`);
    }
    if (filters?.status) {
      conditions.push(sql`status = ${filters.status}`);
    }
    if (filters?.priority) {
      conditions.push(sql`priority = ${filters.priority}`);
    }
    if (filters?.contactId) {
      conditions.push(sql`contact_id = ${filters.contactId}`);
    }
    if (filters?.accountId) {
      conditions.push(sql`account_id = ${filters.accountId}`);
    }
    
    if (conditions.length > 0) {
      query = sql`${query} AND ${sql.join(conditions, sql` AND `)}`;
    }
    
    query = sql`${query} ORDER BY created_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const [tickets, totalResult] = await Promise.all([
      db.execute(query),
      db.execute(sql`
        SELECT COUNT(*) as count FROM crm_core.crm_tickets 
        WHERE deleted_at IS NULL
      `)
    ]);

    return {
      tickets: tickets.rows,
      total: parseInt(totalResult.rows[0]?.count || '0')
    };
  }

  async createTicket(data: {
    subject: string;
    description: string;
    priority?: string;
    category?: string;
    contactId?: string;
    accountId?: string;
    assignedTo?: string;
    ownerId?: string;
    teamId?: string;
    tags?: string[];
  }) {
    // Generate ticket number
    const ticketNumber = await this.generateTicketNumber();
    
    const result = await db.execute(sql`
      INSERT INTO crm_core.crm_tickets (
        ticket_number, subject, description, priority, category,
        contact_id, account_id, assigned_to, owner_id, team_id, tags
      ) VALUES (
        ${ticketNumber}, ${data.subject}, ${data.description},
        ${data.priority || 'medium'}, ${data.category || 'general'},
        ${data.contactId}, ${data.accountId}, ${data.assignedTo},
        ${data.ownerId}, ${data.teamId}, ${JSON.stringify(data.tags || [])}
      )
      RETURNING *
    `);
    
    const ticket = result.rows[0];
    await this.logTimeline('ticket', ticket.id, 'created', { ticket: data });
    return ticket;
  }

  // Timeline & Audit
  async logTimeline(entityType: string, entityId: string, eventType: string, eventData: any, actorId?: string) {
    await db.execute(sql`
      INSERT INTO crm_core.crm_timeline (
        entity_type, entity_id, event_type, event_data, actor_id, actor_type
      ) VALUES (
        ${entityType}, ${entityId}, ${eventType}, ${JSON.stringify(eventData)},
        ${actorId}, ${actorId ? 'user' : 'system'}
      )
    `);
  }

  async getTimeline(entityType: string, entityId: string, limit = 50) {
    const result = await db.execute(sql`
      SELECT * FROM crm_core.crm_timeline 
      WHERE entity_type = ${entityType} AND entity_id = ${entityId}
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `);
    return result.rows;
  }

  // Utility methods
  private calculateLeadScore(lead: any): number {
    let score = 0;
    
    // Fit score (industry, company, title)
    if (lead.company) score += 20;
    if (lead.jobTitle?.toLowerCase().includes('manager') || 
        lead.jobTitle?.toLowerCase().includes('director') || 
        lead.jobTitle?.toLowerCase().includes('ceo')) score += 15;
    if (lead.estimatedValue && parseFloat(lead.estimatedValue) > 10000) score += 25;
    
    // Engagement score (will be updated based on interactions)
    if (lead.leadSource === 'referral') score += 20;
    if (lead.leadSource === 'website') score += 10;
    
    return Math.min(score, 100);
  }

  private async generateTicketNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const result = await db.execute(sql`
      SELECT COUNT(*) as count FROM crm_core.crm_tickets
      WHERE date_part('year', created_at) = ${year} 
        AND date_part('month', created_at) = ${now.getMonth() + 1}
    `);
    
    const sequence = (parseInt(result.rows[0]?.count || '0') + 1).toString().padStart(4, '0');
    return `TKT-${year}${month}-${sequence}`;
  }

  // Soft delete methods
  async softDeleteAccount(id: string): Promise<boolean> {
    const result = await db.execute(sql`
      UPDATE crm_core.crm_accounts 
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `);
    
    if (result.rows.length > 0) {
      await this.logTimeline('account', id, 'deleted', {});
      return true;
    }
    return false;
  }

  async softDeleteContact(id: string): Promise<boolean> {
    const result = await db.execute(sql`
      UPDATE crm_core.crm_contacts 
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `);
    
    if (result.rows.length > 0) {
      await this.logTimeline('contact', id, 'deleted', {});
      return true;
    }
    return false;
  }

  async softDeleteLead(id: string): Promise<boolean> {
    const result = await db.execute(sql`
      UPDATE crm_core.crm_leads 
      SET deleted_at = NOW()
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id
    `);
    
    if (result.rows.length > 0) {
      await this.logTimeline('lead', id, 'deleted', {});
      return true;
    }
    return false;
  }
}

export const crmStorage = new CrmStorage();