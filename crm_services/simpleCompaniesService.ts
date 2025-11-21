import { db } from "../server/db";

// Simple companies service with working database queries
export interface CompanyDTO {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyCreateInput {
  name: string;
  domain?: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  status?: string;
  ownerId?: string;
}

class SimpleCompaniesService {
  async getAllCompanies(): Promise<CompanyDTO[]> {
    try {
      const result = await db.execute(`
        SELECT 
          id, name, domain, industry, website, 
          phone, email, status, owner_id,
          created_at, updated_at
        FROM crm_companies 
        ORDER BY updated_at DESC
        LIMIT 100
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        website: row.website,
        phone: row.phone,
        email: row.email,
        status: row.status,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }

  async getCompanyById(id: string): Promise<CompanyDTO | null> {
    try {
      const result = await db.execute(`
        SELECT 
          id, name, domain, industry, website, 
          phone, email, status, owner_id,
          created_at, updated_at
        FROM crm_companies 
        WHERE id = $1
      `, [id]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        website: row.website,
        phone: row.phone,
        email: row.email,
        status: row.status,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error fetching company:', error);
      return null;
    }
  }

  async createCompany(input: CompanyCreateInput): Promise<CompanyDTO | null> {
    try {
      const result = await db.execute(`
        INSERT INTO crm_companies (
          name, domain, industry, website, 
          phone, email, status, owner_id,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id, name, domain, industry, website, 
                  phone, email, status, owner_id,
                  created_at, updated_at
      `, [
        input.name,
        input.domain,
        input.industry,
        input.website,
        input.phone,
        input.email,
        input.status || 'active',
        input.ownerId
      ]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        website: row.website,
        phone: row.phone,
        email: row.email,
        status: row.status,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error creating company:', error);
      return null;
    }
  }

  async updateCompany(id: string, input: Partial<CompanyCreateInput>): Promise<CompanyDTO | null> {
    try {
      const setParts = [];
      const values = [];
      let valueIndex = 1;

      if (input.name !== undefined) {
        setParts.push(`name = $${valueIndex++}`);
        values.push(input.name);
      }
      if (input.domain !== undefined) {
        setParts.push(`domain = $${valueIndex++}`);
        values.push(input.domain);
      }
      if (input.industry !== undefined) {
        setParts.push(`industry = $${valueIndex++}`);
        values.push(input.industry);
      }
      if (input.website !== undefined) {
        setParts.push(`website = $${valueIndex++}`);
        values.push(input.website);
      }
      if (input.phone !== undefined) {
        setParts.push(`phone = $${valueIndex++}`);
        values.push(input.phone);
      }
      if (input.email !== undefined) {
        setParts.push(`email = $${valueIndex++}`);
        values.push(input.email);
      }
      if (input.status !== undefined) {
        setParts.push(`status = $${valueIndex++}`);
        values.push(input.status);
      }

      setParts.push(`updated_at = NOW()`);
      values.push(id);

      const result = await db.execute(`
        UPDATE crm_companies 
        SET ${setParts.join(', ')}
        WHERE id = $${valueIndex}
        RETURNING id, name, domain, industry, website, 
                  phone, email, status, owner_id,
                  created_at, updated_at
      `, values);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        website: row.website,
        phone: row.phone,
        email: row.email,
        status: row.status,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error updating company:', error);
      return null;
    }
  }

  async deleteCompany(id: string): Promise<boolean> {
    try {
      const result = await db.execute(`DELETE FROM crm_companies WHERE id = $1`, [id]);
      return (result as any).rowCount > 0;
    } catch (error) {
      console.error('Error deleting company:', error);
      return false;
    }
  }

  async searchCompanies(query: string): Promise<CompanyDTO[]> {
    try {
      const searchTerm = `%${query}%`;
      const result = await db.execute(`
        SELECT 
          id, name, domain, industry, website, 
          phone, email, status, owner_id,
          created_at, updated_at
        FROM crm_companies 
        WHERE name ILIKE $1 
           OR domain ILIKE $1 
           OR industry ILIKE $1
        ORDER BY updated_at DESC
        LIMIT 20
      `, [searchTerm]);

      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        website: row.website,
        phone: row.phone,
        email: row.email,
        status: row.status,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }
}

export const simpleCompaniesService = new SimpleCompaniesService();