import { db } from "../server/db";
import { eq, and, like, desc, asc, gte, lte } from "drizzle-orm";

// DTOs for API responses
export interface CompanyDTO {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  sizeRange?: string;
  annualRevenue?: number;
  website?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  description?: string;
  logoUrl?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  status: string;
  ownerId?: string;
  ownerName?: string;
  contactsCount: number;
  dealsCount: number;
  totalDealsValue: number;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyListResponse {
  companies: CompanyDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyFilters {
  search?: string;
  industry?: string;
  sizeRange?: string;
  status?: string;
  ownerId?: string;
  revenueMin?: number;
  revenueMax?: number;
  hasWebsite?: boolean;
  hasContacts?: boolean;
  hasDeals?: boolean;
}

export interface CompanyCreateInput {
  name: string;
  domain?: string;
  industry?: string;
  sizeRange?: string;
  annualRevenue?: number;
  website?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  description?: string;
  logoUrl?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
  status?: string;
  ownerId?: string;
}

export interface CompanyUpdateInput extends Partial<CompanyCreateInput> {}

class CompaniesService {
  async getCompanies(
    filters: CompanyFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<CompanyListResponse> {
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const conditions = [];
    
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        db.or(
          like('crm_companies.name', searchTerm),
          like('crm_companies.domain', searchTerm),
          like('crm_companies.description', searchTerm)
        )
      );
    }
    
    if (filters.industry) {
      conditions.push(eq('crm_companies.industry', filters.industry));
    }
    
    if (filters.sizeRange) {
      conditions.push(eq('crm_companies.size_range', filters.sizeRange));
    }
    
    if (filters.status) {
      conditions.push(eq('crm_companies.status', filters.status));
    }
    
    if (filters.ownerId) {
      conditions.push(eq('crm_companies.owner_id', filters.ownerId));
    }
    
    if (filters.revenueMin !== undefined) {
      conditions.push(gte('crm_companies.annual_revenue', filters.revenueMin));
    }
    
    if (filters.revenueMax !== undefined) {
      conditions.push(lte('crm_companies.annual_revenue', filters.revenueMax));
    }

    // Execute query with aggregated data
    const query = db
      .select({
        company: 'crm_companies.*',
        ownerName: 'users.name',
        contactsCount: db.count('crm_contacts.id').as('contacts_count'),
        dealsCount: db.count('crm_deals.id').as('deals_count'),
        totalDealsValue: db.sum('crm_deals.value').as('total_deals_value')
      })
      .from('crm_companies')
      .leftJoin('users', eq('crm_companies.owner_id', 'users.id'))
      .leftJoin('crm_contacts', eq('crm_companies.id', 'crm_contacts.company_id'))
      .leftJoin('crm_deals', eq('crm_companies.id', 'crm_deals.company_id'))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy('crm_companies.id', 'users.name')
      .orderBy(sortOrder === 'desc' ? desc(sortBy) : asc(sortBy))
      .limit(limit)
      .offset(offset);

    const [companies, [{ count }]] = await Promise.all([
      query,
      db.select({ count: db.count() }).from('crm_companies').where(conditions.length > 0 ? and(...conditions) : undefined)
    ]);

    // Transform to DTOs
    const companyDTOs: CompanyDTO[] = companies.map(row => ({
      id: row.company.id,
      name: row.company.name,
      domain: row.company.domain,
      industry: row.company.industry,
      sizeRange: row.company.size_range,
      annualRevenue: row.company.annual_revenue,
      website: row.company.website,
      phone: row.company.phone,
      email: row.company.email,
      address: row.company.address,
      description: row.company.description,
      logoUrl: row.company.logo_url,
      linkedinUrl: row.company.linkedin_url,
      twitterHandle: row.company.twitter_handle,
      status: row.company.status,
      ownerId: row.company.owner_id,
      ownerName: row.ownerName,
      contactsCount: row.contactsCount || 0,
      dealsCount: row.dealsCount || 0,
      totalDealsValue: row.totalDealsValue || 0,
      createdAt: row.company.created_at,
      updatedAt: row.company.updated_at
    }));

    return {
      companies: companyDTOs,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getCompanyById(id: string): Promise<CompanyDTO | null> {
    const result = await db
      .select({
        company: 'crm_companies.*',
        ownerName: 'users.name',
        contactsCount: db.count('crm_contacts.id').as('contacts_count'),
        dealsCount: db.count('crm_deals.id').as('deals_count'),
        totalDealsValue: db.sum('crm_deals.value').as('total_deals_value')
      })
      .from('crm_companies')
      .leftJoin('users', eq('crm_companies.owner_id', 'users.id'))
      .leftJoin('crm_contacts', eq('crm_companies.id', 'crm_contacts.company_id'))
      .leftJoin('crm_deals', eq('crm_companies.id', 'crm_deals.company_id'))
      .where(eq('crm_companies.id', id))
      .groupBy('crm_companies.id', 'users.name')
      .limit(1);

    if (!result.length) return null;

    const row = result[0];
    return {
      id: row.company.id,
      name: row.company.name,
      domain: row.company.domain,
      industry: row.company.industry,
      sizeRange: row.company.size_range,
      annualRevenue: row.company.annual_revenue,
      website: row.company.website,
      phone: row.company.phone,
      email: row.company.email,
      address: row.company.address,
      description: row.company.description,
      logoUrl: row.company.logo_url,
      linkedinUrl: row.company.linkedin_url,
      twitterHandle: row.company.twitter_handle,
      status: row.company.status,
      ownerId: row.company.owner_id,
      ownerName: row.ownerName,
      contactsCount: row.contactsCount || 0,
      dealsCount: row.dealsCount || 0,
      totalDealsValue: row.totalDealsValue || 0,
      createdAt: row.company.created_at,
      updatedAt: row.company.updated_at
    };
  }

  async createCompany(input: CompanyCreateInput): Promise<CompanyDTO> {
    const [created] = await db.insert('crm_companies').values({
      name: input.name,
      domain: input.domain,
      industry: input.industry,
      size_range: input.sizeRange,
      annual_revenue: input.annualRevenue,
      website: input.website,
      phone: input.phone,
      email: input.email,
      address: input.address,
      description: input.description,
      logo_url: input.logoUrl,
      linkedin_url: input.linkedinUrl,
      twitter_handle: input.twitterHandle,
      status: input.status || 'active',
      owner_id: input.ownerId,
      updated_at: new Date()
    }).returning();

    return this.getCompanyById(created.id)!;
  }

  async updateCompany(id: string, input: CompanyUpdateInput): Promise<CompanyDTO | null> {
    const [updated] = await db.update('crm_companies')
      .set({
        name: input.name,
        domain: input.domain,
        industry: input.industry,
        size_range: input.sizeRange,
        annual_revenue: input.annualRevenue,
        website: input.website,
        phone: input.phone,
        email: input.email,
        address: input.address,
        description: input.description,
        logo_url: input.logoUrl,
        linkedin_url: input.linkedinUrl,
        twitter_handle: input.twitterHandle,
        status: input.status,
        owner_id: input.ownerId,
        updated_at: new Date()
      })
      .where(eq('id', id))
      .returning();

    if (!updated) return null;
    return this.getCompanyById(id);
  }

  async deleteCompany(id: string): Promise<boolean> {
    const result = await db.delete('crm_companies').where(eq('id', id));
    return result.rowCount > 0;
  }

  async searchCompanies(query: string, limit: number = 10): Promise<CompanyDTO[]> {
    const result = await this.getCompanies({ search: query }, 1, limit);
    return result.companies;
  }

  async getCompanyStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byIndustry: Record<string, number>;
    bySizeRange: Record<string, number>;
    totalRevenue: number;
  }> {
    const [statusStats, industryStats, sizeStats, revenueStats] = await Promise.all([
      db.select({
        status: 'crm_companies.status',
        count: db.count()
      }).from('crm_companies').groupBy('status'),
      
      db.select({
        industry: 'crm_companies.industry',
        count: db.count()
      }).from('crm_companies').groupBy('industry'),
      
      db.select({
        sizeRange: 'crm_companies.size_range',
        count: db.count()
      }).from('crm_companies').groupBy('size_range'),
      
      db.select({
        total: db.count(),
        totalRevenue: db.sum('annual_revenue')
      }).from('crm_companies')
    ]);

    return {
      total: revenueStats[0]?.total || 0,
      byStatus: statusStats.reduce((acc, item) => ({ ...acc, [item.status]: item.count }), {}),
      byIndustry: industryStats.reduce((acc, item) => ({ ...acc, [item.industry || 'Unknown']: item.count }), {}),
      bySizeRange: sizeStats.reduce((acc, item) => ({ ...acc, [item.sizeRange || 'Unknown']: item.count }), {}),
      totalRevenue: revenueStats[0]?.totalRevenue || 0
    };
  }
}

export const companiesService = new CompaniesService();