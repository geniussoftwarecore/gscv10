import { db } from "../server/db";
import { eq, and, like, desc, asc, or, gte, lte, isNotNull, count } from "drizzle-orm";
import { contacts, accounts, users, type Contact } from "../shared/schema";
import { AuditService } from "./auditService";
import { filterEntityFields, type Role } from "../shared/security/roles";

// DTOs for API responses
export interface ContactDTO {
  id: string;
  accountId?: string;
  accountName?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  socialProfiles?: Record<string, string>;
  preferences?: Record<string, any>;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactListResponse {
  contacts: ContactDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactFilters {
  search?: string;
  accountId?: string;
  jobTitle?: string;
  department?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  tags?: string[];
  hasEmail?: boolean;
  hasPhone?: boolean;
}

export interface ContactCreateInput {
  accountId?: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  socialProfiles?: Record<string, string>;
  preferences?: Record<string, any>;
  tags?: string[];
  notes?: string;
}

export interface ContactUpdateInput extends Partial<ContactCreateInput> {}

class ContactsService {
  /**
   * Get contacts with role-based field filtering
   */
  async getContacts(
    userRole: Role,
    filters: ContactFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ContactListResponse> {
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const conditions = [];
    
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(contacts.name, searchTerm),
          like(contacts.email, searchTerm),
          like(contacts.jobTitle, searchTerm)
        )
      );
    }
    
    if (filters.accountId) {
      conditions.push(eq(contacts.accountId, filters.accountId));
    }
    
    if (filters.jobTitle) {
      conditions.push(like(contacts.jobTitle, `%${filters.jobTitle}%`));
    }
    
    if (filters.department) {
      conditions.push(like(contacts.department, `%${filters.department}%`));
    }
    
    if (filters.isPrimary !== undefined) {
      conditions.push(eq(contacts.isPrimary, filters.isPrimary ? "true" : "false"));
    }
    
    if (filters.isActive !== undefined) {
      conditions.push(eq(contacts.isActive, filters.isActive ? "true" : "false"));
    }
    
    if (filters.hasEmail) {
      conditions.push(isNotNull(contacts.email));
    }
    
    if (filters.hasPhone) {
      conditions.push(
        or(
          isNotNull(contacts.phone),
          isNotNull(contacts.mobile)
        )
      );
    }

    const whereClause = conditions.length > 0 
      ? (conditions.length > 1 ? and(...conditions) : conditions[0])
      : undefined;

    // Execute query with joins
    const sortColumn = sortBy === 'name' ? contacts.name : 
                      sortBy === 'email' ? contacts.email :
                      sortBy === 'created_at' ? contacts.createdAt :
                      contacts.updatedAt;
    
    const [contactRows, [{ count: totalCount }]] = await Promise.all([
      db
        .select({
          contact: contacts,
          accountName: accounts.name
        })
        .from(contacts)
        .leftJoin(accounts, eq(contacts.accountId, accounts.id))
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn))
        .limit(limit)
        .offset(offset),
      
      db
        .select({ count: count() })
        .from(contacts)
        .where(whereClause)
    ]);

    // Transform to DTOs with role-based field filtering
    const contactDTOs: ContactDTO[] = contactRows.map(row => {
      const [firstName, ...lastNameParts] = (row.contact.name || '').split(' ');
      const lastName = lastNameParts.join(' ');
      
      const contactData = {
        id: row.contact.id,
        accountId: row.contact.accountId,
        accountName: row.accountName,
        firstName,
        lastName,
        fullName: row.contact.name || '',
        email: row.contact.email,
        phone: row.contact.phone,
        mobile: row.contact.mobile,
        jobTitle: row.contact.jobTitle,
        department: row.contact.department,
        isPrimary: row.contact.isPrimary === "true",
        isActive: row.contact.isActive === "true",
        socialProfiles: row.contact.socialProfiles || {},
        preferences: row.contact.preferences || {},
        tags: row.contact.tags || [],
        notes: row.contact.notes,
        createdAt: row.contact.createdAt,
        updatedAt: row.contact.updatedAt
      };

      // Filter fields based on user role
      return filterEntityFields(contactData, userRole, 'contacts') as ContactDTO;
    });

    return {
      contacts: contactDTOs,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  async getContactById(id: string, userRole: Role): Promise<ContactDTO | null> {
    const result = await db
      .select({
        contact: contacts,
        accountName: accounts.name
      })
      .from(contacts)
      .leftJoin(accounts, eq(contacts.accountId, accounts.id))
      .where(eq(contacts.id, id))
      .limit(1);

    if (!result.length) return null;

    const row = result[0];
    const [firstName, ...lastNameParts] = (row.contact.name || '').split(' ');
    const lastName = lastNameParts.join(' ');
    
    const contactData = {
      id: row.contact.id,
      accountId: row.contact.accountId,
      accountName: row.accountName,
      firstName,
      lastName,
      fullName: row.contact.name || '',
      email: row.contact.email,
      phone: row.contact.phone,
      mobile: row.contact.mobile,
      jobTitle: row.contact.jobTitle,
      department: row.contact.department,
      isPrimary: row.contact.isPrimary === "true",
      isActive: row.contact.isActive === "true",
      socialProfiles: row.contact.socialProfiles || {},
      preferences: row.contact.preferences || {},
      tags: row.contact.tags || [],
      notes: row.contact.notes,
      createdAt: row.contact.createdAt,
      updatedAt: row.contact.updatedAt
    };

    // Filter fields based on user role
    return filterEntityFields(contactData, userRole, 'contacts') as ContactDTO;
  }

  async createContact(
    input: ContactCreateInput, 
    actorId: string, 
    userRole: Role,
    req?: any
  ): Promise<ContactDTO> {
    const [created] = await db.insert(contacts).values({
      accountId: input.accountId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      mobile: input.mobile,
      jobTitle: input.jobTitle,
      department: input.department,
      isPrimary: input.isPrimary ? "true" : "false",
      isActive: input.isActive !== false ? "true" : "false",
      socialProfiles: input.socialProfiles || {},
      preferences: input.preferences || {},
      tags: input.tags || [],
      notes: input.notes,
      updatedAt: new Date()
    }).returning();

    // Log audit trail
    await AuditService.logFromRequest(
      req || { user: { id: actorId } },
      'create',
      'contacts',
      created.id,
      {
        entityName: created.name,
        after: created
      }
    );

    const result = await this.getContactById(created.id, userRole);
    if (!result) {
      throw new Error('Failed to retrieve created contact');
    }
    return result;
  }

  async updateContact(
    id: string, 
    input: ContactUpdateInput, 
    actorId: string, 
    userRole: Role,
    req?: any
  ): Promise<ContactDTO | null> {
    // Get current data for audit log
    const currentContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (!currentContact.length) return null;

    const beforeData = currentContact[0];

    const [updated] = await db.update(contacts)
      .set({
        accountId: input.accountId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        mobile: input.mobile,
        jobTitle: input.jobTitle,
        department: input.department,
        isPrimary: input.isPrimary !== undefined ? (input.isPrimary ? "true" : "false") : undefined,
        isActive: input.isActive !== undefined ? (input.isActive ? "true" : "false") : undefined,
        socialProfiles: input.socialProfiles,
        preferences: input.preferences,
        tags: input.tags,
        notes: input.notes,
        updatedAt: new Date()
      })
      .where(eq(contacts.id, id))
      .returning();

    if (!updated) return null;

    // Log audit trail
    await AuditService.logFromRequest(
      req || { user: { id: actorId } },
      'update',
      'contacts',
      id,
      {
        entityName: updated.name,
        before: beforeData,
        after: updated
      }
    );

    return this.getContactById(id, userRole);
  }

  async deleteContact(
    id: string, 
    actorId: string, 
    userRole: Role,
    req?: any
  ): Promise<boolean> {
    // Get current data for audit log
    const currentContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (!currentContact.length) return false;

    const result = await db.delete(contacts).where(eq(contacts.id, id));
    
    if (result.rowCount && result.rowCount > 0) {
      // Log audit trail
      await AuditService.logFromRequest(
        req || { user: { id: actorId } },
        'delete',
        'contacts',
        id,
        {
          entityName: currentContact[0].name,
          before: currentContact[0]
        }
      );
      return true;
    }
    
    return false;
  }

  async getContactsByAccount(accountId: string, userRole: Role): Promise<ContactDTO[]> {
    const result = await this.getContacts(userRole, { accountId }, 1, 100);
    return result.contacts;
  }

  async searchContacts(query: string, userRole: Role, limit: number = 10): Promise<ContactDTO[]> {
    const result = await this.getContacts(userRole, { search: query }, 1, limit);
    return result.contacts;
  }

  /**
   * Get audit history for a contact
   */
  async getContactHistory(contactId: string, page: number = 1, limit: number = 20) {
    return AuditService.getEntityHistory('contacts', contactId, page, limit);
  }
}

export const contactsService = new ContactsService();