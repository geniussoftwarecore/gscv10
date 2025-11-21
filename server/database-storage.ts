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
  users,
  contactSubmissions,
  portfolioItems,
  services,
  serviceSubcategories,
  testimonials,
  subscriptionPlans,
  userSubscriptions,
  serviceRequests,
  leads,
  contacts,
  accounts,
  opportunities,
  tasks,
  crmActivities,
  savedFilters,
  supportTickets,
  dealStages,
  ticketStatus,
  serviceAuditLog,
  mobileAppOrders,
  webProjectOrders,
  webOrders,
  desktopOrders,
  graphicsDesignRequests
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Audit logging helper method - Enhanced for Transaction Support
  private async createAuditLog(
    serviceId: string | null,
    operation: 'create' | 'update' | 'delete' | 'restore',
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    userId?: string,
    userName?: string,
    userRole?: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string,
    // إضافة معامل المعاملة - Add transaction parameter
    tx?: typeof db
  ): Promise<void> {
    const dbInstance = tx || db;
    if (!dbInstance) return;
    
    try {
      // Calculate changed fields for update operations
      let changedFields: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      if (operation === 'update' && oldValues && newValues) {
        changedFields = Object.keys(newValues).filter(key => 
          JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])
        );
        
        // Determine risk level based on changed fields
        const criticalFields = ['id', 'title', 'category'];
        const highRiskFields = ['description', 'featured', 'isDeleted'];
        
        if (changedFields.some(field => criticalFields.includes(field))) {
          riskLevel = 'critical';
        } else if (changedFields.some(field => highRiskFields.includes(field))) {
          riskLevel = 'high';
        } else if (changedFields.length > 3) {
          riskLevel = 'medium';
        }
      } else if (operation === 'delete') {
        riskLevel = 'high';
      } else if (operation === 'create') {
        riskLevel = 'low';
      }

      await dbInstance.insert(serviceAuditLog).values({
        serviceId,
        operation,
        tableName: 'services',
        oldValues,
        newValues,
        changedFields,
        userId,
        userName,
        userRole,
        ipAddress,
        userAgent,
        reason,
        riskLevel
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw here as audit logging should not break main operations
    }
  }

  // User Management
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
    const hashedPassword = await this.hashPassword(user.password);
    const result = await db.insert(users).values({
      ...user,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!db) throw new Error("Database not available");
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(users);
  }

  // Contact Submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Mobile App Orders
  async createMobileAppOrder(order: InsertMobileAppOrder): Promise<MobileAppOrder> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(mobileAppOrders).values(order).returning();
    return result[0];
  }

  async getAllMobileAppOrders(): Promise<MobileAppOrder[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(mobileAppOrders).orderBy(desc(mobileAppOrders.createdAt));
  }

  // Web Project Orders
  async createWebProjectOrder(order: InsertWebProjectOrder): Promise<WebProjectOrder> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(webProjectOrders).values(order).returning();
    return result[0];
  }

  async getAllWebProjectOrders(): Promise<WebProjectOrder[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(webProjectOrders).orderBy(desc(webProjectOrders.createdAt));
  }

  // Portfolio Management
  async getAllPortfolioItems(): Promise<PortfolioItem[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
  }

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(portfolioItems)
      .where(eq(portfolioItems.category, category))
      .orderBy(desc(portfolioItems.createdAt));
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(portfolioItems).values(item).returning();
    return result[0];
  }

  // Services Management with Transaction Support and Audit Logging
  async getAllServices(): Promise<Service[]> {
    if (!db) throw new Error("Database not available");
    // Only return active (non-deleted) services by default
    return await db.select().from(services)
      .where(eq(services.isDeleted, false))
      .orderBy(desc(services.createdAt));
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(services)
      .where(and(eq(services.id, id), eq(services.isDeleted, false)))
      .limit(1);
    return result[0];
  }

  async createService(
    service: InsertService, 
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    if (!db) throw new Error("Database not available");
    
    // Use transaction to ensure atomicity
    return await db.transaction(async (tx) => {
      try {
        // Add audit fields to service data
        const serviceWithAudit = {
          ...service,
          createdBy: auditInfo?.userId || null,
          updatedBy: auditInfo?.userId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false
        };

        const result = await tx.insert(services).values(serviceWithAudit).returning();
        const createdService = result[0];
        
        // Create audit log entry within transaction
        await this.createAuditLog(
          createdService.id,
          'create',
          null,
          createdService,
          auditInfo?.userId,
          auditInfo?.userName,
          auditInfo?.userRole,
          auditInfo?.reason || 'Service created',
          auditInfo?.ipAddress,
          auditInfo?.userAgent,
          tx
        );
        
        return createdService;
      } catch (error) {
        console.error('Service creation failed:', error);
        throw new Error(`Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async updateService(
    id: string, 
    updates: Partial<Service>,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    if (!db) throw new Error("Database not available");
    
    return await db.transaction(async (tx) => {
      try {
        // Get current service data for audit log
        const currentService = await tx.select().from(services)
          .where(and(eq(services.id, id), eq(services.isDeleted, false)))
          .limit(1);
        
        if (!currentService[0]) {
          throw new Error("Service not found or has been deleted");
        }

        // Add audit fields to updates
        const updatesWithAudit = {
          ...updates,
          updatedBy: auditInfo?.userId || null,
          updatedAt: new Date()
        };

        const result = await tx.update(services)
          .set(updatesWithAudit)
          .where(eq(services.id, id))
          .returning();
        
        const updatedService = result[0];
        
        // Create audit log entry within transaction
        await this.createAuditLog(
          id,
          'update',
          currentService[0],
          updatedService,
          auditInfo?.userId,
          auditInfo?.userName,
          auditInfo?.userRole,
          auditInfo?.reason || 'Service updated',
          auditInfo?.ipAddress,
          auditInfo?.userAgent,
          tx
        );
        
        return updatedService;
      } catch (error) {
        console.error('Service update failed:', error);
        throw new Error(`Failed to update service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async deleteService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    
    return await db.transaction(async (tx) => {
      try {
        // Get current service data for audit log
        const currentService = await tx.select().from(services)
          .where(and(eq(services.id, id), eq(services.isDeleted, false)))
          .limit(1);
        
        if (!currentService[0]) {
          throw new Error("Service not found or already deleted");
        }

        // Soft delete - set isDeleted to true instead of actual deletion
        const result = await tx.update(services)
          .set({ 
            isDeleted: true, 
            updatedBy: auditInfo?.userId || null,
            updatedAt: new Date()
          })
          .where(eq(services.id, id))
          .returning();
        
        // Create audit log entry within transaction
        await this.createAuditLog(
          id,
          'delete',
          currentService[0],
          result[0],
          auditInfo?.userId,
          auditInfo?.userName,
          auditInfo?.userRole,
          auditInfo?.reason || 'Service deleted (soft delete)',
          auditInfo?.ipAddress,
          auditInfo?.userAgent,
          tx
        );
        
        return result.length > 0;
      } catch (error) {
        console.error('Service deletion failed:', error);
        throw new Error(`Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async restoreService(
    id: string,
    auditInfo?: { userId?: string; userName?: string; userRole?: string; ipAddress?: string; userAgent?: string; reason?: string }
  ): Promise<Service> {
    if (!db) throw new Error("Database not available");
    
    return await db.transaction(async (tx) => {
      try {
        // Get current service data for audit log
        const currentService = await tx.select().from(services)
          .where(and(eq(services.id, id), eq(services.isDeleted, true)))
          .limit(1);
        
        if (!currentService[0]) {
          throw new Error("Service not found or not deleted");
        }

        // Restore service - set isDeleted to false
        const result = await tx.update(services)
          .set({ 
            isDeleted: false,
            updatedBy: auditInfo?.userId || null,
            updatedAt: new Date()
          })
          .where(eq(services.id, id))
          .returning();
        
        const restoredService = result[0];
        
        // Create audit log entry within transaction
        await this.createAuditLog(
          id,
          'restore',
          currentService[0],
          restoredService,
          auditInfo?.userId,
          auditInfo?.userName,
          auditInfo?.userRole,
          auditInfo?.reason || 'Service restored',
          auditInfo?.ipAddress,
          auditInfo?.userAgent,
          tx
        );
        
        return restoredService;
      } catch (error) {
        console.error('Service restoration failed:', error);
        throw new Error(`Failed to restore service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  // Service Subcategories Management
  async getAllServiceSubcategories(): Promise<ServiceSubcategory[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(serviceSubcategories);
  }

  async getServiceSubcategoriesByService(serviceId: string): Promise<ServiceSubcategory[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(serviceSubcategories).where(eq(serviceSubcategories.serviceId, serviceId));
  }

  async getServiceSubcategoriesByCategory(category: string): Promise<ServiceSubcategory[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(serviceSubcategories).where(eq(serviceSubcategories.category, category));
  }

  async getServiceSubcategoryById(id: string): Promise<ServiceSubcategory | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(serviceSubcategories).where(eq(serviceSubcategories.id, id)).limit(1);
    return result[0];
  }

  async createServiceSubcategory(subcategory: InsertServiceSubcategory): Promise<ServiceSubcategory> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(serviceSubcategories).values(subcategory).returning();
    return result[0];
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(subscriptionPlans);
  }

  async getSubscriptionPlansByService(serviceId: string): Promise<SubscriptionPlan[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(subscriptionPlans)
      .where(eq(subscriptionPlans.serviceId, serviceId));
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(subscriptionPlans).values(plan).returning();
    return result[0];
  }

  // User Subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(userSubscriptions).values(subscription).returning();
    return result[0];
  }

  // Service Requests
  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    if (!db) throw new Error("Database not available");
    if (userId) {
      return await db.select().from(serviceRequests)
        .where(eq(serviceRequests.userId, userId))
        .orderBy(desc(serviceRequests.createdAt));
    }
    return await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(serviceRequests).values(request).returning();
    return result[0];
  }

  // CRM - Leads Management
  async getAllLeads(): Promise<Lead[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return result[0];
  }

  async deleteLead(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(leads)
      .where(eq(leads.assignedTo, userId))
      .orderBy(desc(leads.createdAt));
  }

  async convertLeadToContact(leadId: string, accountId?: string): Promise<Contact> {
    if (!db) throw new Error("Database not available");
    const lead = await this.getLeadById(leadId);
    if (!lead) throw new Error("Lead not found");

    const contact = await db.insert(contacts).values({
      name: `${lead.name}`,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      accountId: accountId || null,
      leadId: leadId
    }).returning();

    // Mark lead as converted  
    await this.updateLead(leadId, { 
      status: 'converted'
    });

    return contact[0];
  }

  // CRM - Contacts Management
  async getAllContacts(): Promise<Contact[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(contacts).set(updates).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getContactsByAccount(accountId: string): Promise<Contact[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(contacts)
      .where(eq(contacts.accountId, accountId))
      .orderBy(desc(contacts.createdAt));
  }

  // CRM - Accounts Management
  async getAllAccounts(): Promise<Account[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(accounts).orderBy(desc(accounts.createdAt));
  }

  async getAccountById(id: string): Promise<Account | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
    return result[0];
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(accounts).values(account).returning();
    return result[0];
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(accounts).set(updates).where(eq(accounts.id, id)).returning();
    return result[0];
  }

  async deleteAccount(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(accounts).where(eq(accounts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAccountsByAssignee(userId: string): Promise<Account[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(accounts)
      .where(eq(accounts.assignedTo, userId))
      .orderBy(desc(accounts.createdAt));
  }

  // CRM - Opportunities Management
  async getAllOpportunities(): Promise<Opportunity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunityById(id: string): Promise<Opportunity | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(opportunities).where(eq(opportunities.id, id)).limit(1);
    return result[0];
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(opportunities).values(opportunity).returning();
    return result[0];
  }

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(opportunities).set(updates).where(eq(opportunities.id, id)).returning();
    return result[0];
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(opportunities).where(eq(opportunities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getOpportunitiesByAccount(accountId: string): Promise<Opportunity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(opportunities)
      .where(eq(opportunities.accountId, accountId))
      .orderBy(desc(opportunities.createdAt));
  }

  async getOpportunitiesByAssignee(userId: string): Promise<Opportunity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(opportunities)
      .where(eq(opportunities.assignedTo, userId))
      .orderBy(desc(opportunities.createdAt));
  }

  // CRM - Tasks Management
  async getAllTasks(): Promise<Task[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(tasks)
      .where(eq(tasks.assignedTo, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByRelatedEntity(relatedTo: string, relatedId: string): Promise<Task[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(tasks)
      .where(and(eq(tasks.relatedTo, relatedTo), eq(tasks.relatedId, relatedId)))
      .orderBy(desc(tasks.createdAt));
  }

  // CRM - Activities
  async getAllActivities(): Promise<CrmActivity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(crmActivities).orderBy(desc(crmActivities.createdAt));
  }

  async getActivityById(id: string): Promise<CrmActivity | undefined> {
    if (!db) throw new Error("Database not available");
    const result = await db.select().from(crmActivities).where(eq(crmActivities.id, id)).limit(1);
    return result[0];
  }

  async createActivity(activity: InsertCrmActivity): Promise<CrmActivity> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(crmActivities).values(activity).returning();
    return result[0];
  }

  async getActivitiesByRelatedEntity(relatedTo: string, relatedId: string): Promise<CrmActivity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(crmActivities)
      .where(and(eq(crmActivities.relatedTo, relatedTo), eq(crmActivities.relatedId, relatedId)))
      .orderBy(desc(crmActivities.createdAt));
  }

  async getActivitiesByUser(userId: string): Promise<CrmActivity[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(crmActivities)
      .where(eq(crmActivities.userId, userId))
      .orderBy(desc(crmActivities.createdAt));
  }

  // Saved Filters Implementation
  async getSavedFilters(userId: string): Promise<SavedFilter[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(savedFilters)
      .where(eq(savedFilters.userId, userId))
      .orderBy(desc(savedFilters.createdAt));
  }

  async createSavedFilter(filter: InsertSavedFilter): Promise<SavedFilter> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(savedFilters).values(filter).returning();
    return result[0];
  }

  async updateSavedFilter(id: string, updates: Partial<SavedFilter>): Promise<SavedFilter> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(savedFilters).set(updates).where(eq(savedFilters.id, id)).returning();
    return result[0];
  }

  async deleteSavedFilter(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(savedFilters).where(eq(savedFilters.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Search Implementation
  async searchEntities(query: string, entities: string[]): Promise<any[]> {
    if (!db) throw new Error("Database not available");
    const searchTerm = `%${query.toLowerCase()}%`;
    const results: any[] = [];

    try {
      if (entities.includes('contacts')) {
        const contactResults = await db.select().from(contacts)
          .where(
            sql`lower(${contacts.name}) LIKE ${searchTerm} OR 
                lower(${contacts.email}) LIKE ${searchTerm} OR 
                lower(${contacts.phone}) LIKE ${searchTerm} OR 
                lower(${contacts.jobTitle}) LIKE ${searchTerm}`
          )
          .limit(50);
        results.push(...contactResults.map((contact: any) => ({ ...contact, entity: 'contacts' })));
      }

      if (entities.includes('accounts') || entities.includes('companies')) {
        const accountResults = await db.select().from(accounts)
          .where(
            sql`lower(${accounts.name}) LIKE ${searchTerm} OR 
                lower(${accounts.email}) LIKE ${searchTerm} OR 
                lower(${accounts.phone}) LIKE ${searchTerm} OR 
                lower(${accounts.industry}) LIKE ${searchTerm} OR 
                lower(${accounts.type}) LIKE ${searchTerm}`
          )
          .limit(50);
        results.push(...accountResults.map((account: any) => ({ ...account, entity: 'accounts' })));
      }

      if (entities.includes('opportunities') || entities.includes('deals')) {
        const opportunityResults = await db.select().from(opportunities)
          .where(
            sql`lower(${opportunities.name}) LIKE ${searchTerm} OR 
                lower(${opportunities.description}) LIKE ${searchTerm} OR 
                lower(${opportunities.stage}) LIKE ${searchTerm}`
          )
          .limit(50);
        results.push(...opportunityResults.map((opportunity: any) => ({ ...opportunity, entity: 'opportunities' })));
      }

      if (entities.includes('tickets')) {
        const ticketResults = await db.select().from(supportTickets)
          .where(
            sql`lower(${supportTickets.subject}) LIKE ${searchTerm} OR 
                lower(${supportTickets.description}) LIKE ${searchTerm} OR 
                lower(${supportTickets.category}) LIKE ${searchTerm} OR 
                lower(${supportTickets.status}) LIKE ${searchTerm}`
          )
          .limit(50);
        results.push(...ticketResults.map((ticket: any) => ({ ...ticket, entity: 'tickets' })));
      }

      if (entities.includes('leads')) {
        const leadResults = await db.select().from(leads)
          .where(
            sql`lower(${leads.name}) LIKE ${searchTerm} OR 
                lower(${leads.email}) LIKE ${searchTerm} OR 
                lower(${leads.phone}) LIKE ${searchTerm} OR 
                lower(${leads.company}) LIKE ${searchTerm} OR 
                lower(${leads.jobTitle}) LIKE ${searchTerm}`
          )
          .limit(50);
        results.push(...leadResults.map((lead: any) => ({ ...lead, entity: 'leads' })));
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
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
    if (!db) throw new Error("Database not available");

    const { offset = 0, limit = 25, search = '', sorts = [], filters = [], columns, export: isExport = false } = options;

    // Map table names to actual tables
    const tableMap: any = {
      'contacts': contacts,
      'accounts': accounts,
      'opportunities': opportunities,
      'supportTickets': supportTickets
    };

    const table = tableMap[tableName];
    if (!table) throw new Error(`Unknown table: ${tableName}`);

    try {
      let query = db.select().from(table);
      let countQuery = db.select({ count: sql`count(*)` }).from(table);

      // Apply search if provided
      if (search) {
        const searchTerm = `%${search.toLowerCase()}%`;
        let searchConditions: any[] = [];

        // Define searchable fields per table
        const searchFields: any = {
          'contacts': [table.name, table.email, table.phone, table.jobTitle],
          'accounts': [table.name, table.industry, table.description],
          'opportunities': [table.name, table.description, table.stage],
          'supportTickets': [table.subject, table.description, table.category]
        };

        const fields = searchFields[tableName] || [];
        fields.forEach((field: any) => {
          searchConditions.push(sql`lower(${field}) LIKE ${searchTerm}`);
        });

        if (searchConditions.length > 0) {
          const searchWhere = searchConditions.reduce((acc, condition) => 
            acc ? sql`${acc} OR ${condition}` : condition
          );
          query = query.where(searchWhere);
          countQuery = countQuery.where(searchWhere);
        }
      }

      // Apply filters
      filters.forEach(filter => {
        const { field, operator, value } = filter;
        const column = (table as any)[field];
        if (!column) return;

        switch (operator) {
          case 'eq':
            query = query.where(eq(column, value));
            countQuery = countQuery.where(eq(column, value));
            break;
          case 'contains':
            query = query.where(sql`lower(${column}) LIKE ${`%${value.toLowerCase()}%`}`);
            countQuery = countQuery.where(sql`lower(${column}) LIKE ${`%${value.toLowerCase()}%`}`);
            break;
          case 'gt':
            query = query.where(sql`${column} > ${value}`);
            countQuery = countQuery.where(sql`${column} > ${value}`);
            break;
          case 'lt':
            query = query.where(sql`${column} < ${value}`);
            countQuery = countQuery.where(sql`${column} < ${value}`);
            break;
        }
      });

      // Apply sorts
      if (sorts.length > 0) {
        const orderClauses = sorts.map(sort => {
          const column = (table as any)[sort.field];
          return sort.direction === 'desc' ? desc(column) : column;
        });
        query = query.orderBy(...orderClauses);
      } else {
        // Default sort by created date
        const createdColumn = (table as any).createdAt;
        if (createdColumn) {
          query = query.orderBy(desc(createdColumn));
        }
      }

      // Get total count
      const countResult = await countQuery;
      const total = parseInt(countResult[0]?.count || '0');

      // Apply pagination (skip for exports)
      if (!isExport) {
        query = query.offset(offset).limit(limit);
      }

      // Execute query
      const data = await query;

      return { data, total };
    } catch (error) {
      console.error(`Table query error for ${tableName}:`, error);
      throw error;
    }
  }

  // Saved Views Management
  private savedViews: Map<string, any> = new Map();

  async getSavedViews(userId: string, endpoint: string): Promise<any[]> {
    // For now, use in-memory storage for saved views
    const views = Array.from(this.savedViews.values()).filter(
      view => view.userId === userId && view.endpoint === endpoint
    );
    return views;
  }

  async createSavedView(view: any): Promise<any> {
    // For now, use in-memory storage for saved views
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

  // Deal Stages Management
  async getAllDealStages(): Promise<DealStage[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(dealStages).orderBy(dealStages.position);
  }

  async createDealStage(stage: InsertDealStage): Promise<DealStage> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(dealStages).values(stage).returning();
    return result[0];
  }

  async updateDealStage(id: string, updates: Partial<DealStage>): Promise<DealStage> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(dealStages).set(updates).where(eq(dealStages.id, id)).returning();
    return result[0];
  }

  async deleteDealStage(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(dealStages).where(eq(dealStages.id, id));
    return result.rowCount > 0;
  }

  // Ticket Status Management
  async getAllTicketStatus(): Promise<TicketStatus[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(ticketStatus);
  }

  async createTicketStatus(status: InsertTicketStatus): Promise<TicketStatus> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(ticketStatus).values(status).returning();
    return result[0];
  }

  async updateTicketStatus(id: string, updates: Partial<TicketStatus>): Promise<TicketStatus> {
    if (!db) throw new Error("Database not available");
    const result = await db.update(ticketStatus).set(updates).where(eq(ticketStatus.id, id)).returning();
    return result[0];
  }

  async deleteTicketStatus(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(ticketStatus).where(eq(ticketStatus.id, id));
    return result.rowCount > 0;
  }

  // Web Orders (for Web & Platforms Development Service Wizard)
  async createWebOrder(order: InsertWebOrder): Promise<WebOrder> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(webOrders).values(order).returning();
    return result[0];
  }

  async getAllWebOrders(): Promise<WebOrder[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(webOrders).orderBy(desc(webOrders.createdAt));
  }

  // Desktop Orders
  async createDesktopOrder(order: InsertDesktopOrder): Promise<DesktopOrder> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(desktopOrders).values(order).returning();
    return result[0];
  }

  async getAllDesktopOrders(): Promise<DesktopOrder[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(desktopOrders).orderBy(desc(desktopOrders.createdAt));
  }

  // Graphics Design Requests
  async createGraphicsDesignRequest(request: InsertGraphicsDesignRequest): Promise<GraphicsDesignRequest> {
    if (!db) throw new Error("Database not available");
    const result = await db.insert(graphicsDesignRequests).values(request).returning();
    return result[0];
  }

  async getGraphicsDesignRequests(): Promise<GraphicsDesignRequest[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(graphicsDesignRequests).orderBy(desc(graphicsDesignRequests.createdAt));
  }
}