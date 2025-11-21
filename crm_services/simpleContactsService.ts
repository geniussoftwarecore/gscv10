import { db } from "../server/db";
import { eq, and, like, desc, asc, or, count } from "drizzle-orm";

// Simple CRM contacts service with working Drizzle syntax
export interface ContactDTO {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  companyId?: string;
  jobTitle?: string;
  leadScore: number;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactCreateInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId?: string;
  jobTitle?: string;
  leadScore?: number;
  ownerId?: string;
}

class SimpleContactsService {
  async getAllContacts(): Promise<ContactDTO[]> {
    try {
      const result = await db.execute(`
        SELECT 
          id, first_name, last_name, email, phone, 
          company_id, job_title, lead_score, owner_id,
          created_at, updated_at
        FROM crm_contacts 
        ORDER BY updated_at DESC
        LIMIT 100
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone,
        companyId: row.company_id,
        jobTitle: row.job_title,
        leadScore: row.lead_score || 0,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  async getContactById(id: string): Promise<ContactDTO | null> {
    try {
      const result = await db.execute(`
        SELECT 
          id, first_name, last_name, email, phone, 
          company_id, job_title, lead_score, owner_id,
          created_at, updated_at
        FROM crm_contacts 
        WHERE id = $1
      `, [id]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone,
        companyId: row.company_id,
        jobTitle: row.job_title,
        leadScore: row.lead_score || 0,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  }

  async createContact(input: ContactCreateInput): Promise<ContactDTO | null> {
    try {
      const result = await db.execute(`
        INSERT INTO crm_contacts (
          first_name, last_name, email, phone, 
          company_id, job_title, lead_score, owner_id,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id, first_name, last_name, email, phone, 
                  company_id, job_title, lead_score, owner_id,
                  created_at, updated_at
      `, [
        input.firstName,
        input.lastName,
        input.email,
        input.phone,
        input.companyId,
        input.jobTitle,
        input.leadScore || 0,
        input.ownerId
      ]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone,
        companyId: row.company_id,
        jobTitle: row.job_title,
        leadScore: row.lead_score || 0,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      return null;
    }
  }

  async updateContact(id: string, input: Partial<ContactCreateInput>): Promise<ContactDTO | null> {
    try {
      const setParts = [];
      const values = [];
      let valueIndex = 1;

      if (input.firstName !== undefined) {
        setParts.push(`first_name = $${valueIndex++}`);
        values.push(input.firstName);
      }
      if (input.lastName !== undefined) {
        setParts.push(`last_name = $${valueIndex++}`);
        values.push(input.lastName);
      }
      if (input.email !== undefined) {
        setParts.push(`email = $${valueIndex++}`);
        values.push(input.email);
      }
      if (input.phone !== undefined) {
        setParts.push(`phone = $${valueIndex++}`);
        values.push(input.phone);
      }
      if (input.jobTitle !== undefined) {
        setParts.push(`job_title = $${valueIndex++}`);
        values.push(input.jobTitle);
      }
      if (input.leadScore !== undefined) {
        setParts.push(`lead_score = $${valueIndex++}`);
        values.push(input.leadScore);
      }

      setParts.push(`updated_at = NOW()`);
      values.push(id);

      const result = await db.execute(`
        UPDATE crm_contacts 
        SET ${setParts.join(', ')}
        WHERE id = $${valueIndex}
        RETURNING id, first_name, last_name, email, phone, 
                  company_id, job_title, lead_score, owner_id,
                  created_at, updated_at
      `, values);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone,
        companyId: row.company_id,
        jobTitle: row.job_title,
        leadScore: row.lead_score || 0,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error updating contact:', error);
      return null;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      const result = await db.execute(`DELETE FROM crm_contacts WHERE id = $1`, [id]);
      return (result as any).rowCount > 0;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  }

  async searchContacts(query: string): Promise<ContactDTO[]> {
    try {
      const searchTerm = `%${query}%`;
      const result = await db.execute(`
        SELECT 
          id, first_name, last_name, email, phone, 
          company_id, job_title, lead_score, owner_id,
          created_at, updated_at
        FROM crm_contacts 
        WHERE first_name ILIKE $1 
           OR last_name ILIKE $1 
           OR email ILIKE $1 
           OR job_title ILIKE $1
        ORDER BY updated_at DESC
        LIMIT 20
      `, [searchTerm]);

      return result.rows.map((row: any) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone,
        companyId: row.company_id,
        jobTitle: row.job_title,
        leadScore: row.lead_score || 0,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }
}

export const simpleContactsService = new SimpleContactsService();