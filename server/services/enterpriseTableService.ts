import { db } from "../db";
import { eq, and, or, like, ilike, gt, lt, gte, lte, inArray, isNull, isNotNull, desc, asc, SQL, sql } from "drizzle-orm";
import { 
  contacts, 
  accounts, 
  opportunities, 
  supportTickets
} from "@shared/schema";
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
  priority?: number;
}

export interface TableFilter {
  field: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: any;
}

export interface TableQuery {
  page: number;
  pageSize: number;
  sorts: TableSort[];
  filters: TableFilter[];
  search: string;
  columns: string[];
}

export interface TableResponse {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Table configurations - Based on actual database schema
const TABLE_CONFIGS = {
  contacts: {
    table: contacts,
    searchFields: ['name', 'email', 'job_title', 'department'],
    columns: {
      id: 'id',
      name: 'name',
      email: 'email',
      phone: 'phone',
      mobile: 'mobile',
      jobTitle: 'job_title',
      department: 'department',
      accountId: 'account_id',
      isPrimary: 'is_primary',
      isActive: 'is_active',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  accounts: {
    table: accounts,
    searchFields: ['name', 'industry', 'website', 'email'],
    columns: {
      id: 'id',
      name: 'name',
      type: 'type',
      industry: 'industry',
      website: 'website',
      phone: 'phone',
      email: 'email',
      annualRevenue: 'annual_revenue',
      numberOfEmployees: 'number_of_employees',
      assignedTo: 'assigned_to',
      isActive: 'is_active',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  opportunities: {
    table: opportunities,
    searchFields: ['name', 'stage', 'description'],
    columns: {
      id: 'id',
      name: 'name',
      accountId: 'account_id',
      contactId: 'contact_id',
      stageId: 'stage_id',
      stage: 'stage',
      amount: 'amount',
      probability: 'probability',
      expectedCloseDate: 'expected_close_date',
      actualCloseDate: 'actual_close_date',
      leadSource: 'lead_source',
      description: 'description',
      lossReason: 'loss_reason',
      nextStep: 'next_step',
      assignedTo: 'assigned_to',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  tickets: {
    table: supportTickets,
    searchFields: ['subject', 'category', 'status'],
    columns: {
      id: 'id',
      subject: 'subject',
      category: 'category',
      priority: 'priority',
      status: 'status',
      assignedTo: 'assigned_to',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
};

export class EnterpriseTableService {
  // Build search condition
  private buildSearchCondition(tableName: string, search: string): SQL | undefined {
    if (!search.trim()) return undefined;
    
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) return undefined;
    
    const searchTerm = `%${search.toLowerCase()}%`;
    const conditions = config.searchFields.map(field => 
      ilike(config.table[field as keyof typeof config.table], searchTerm)
    );
    
    return or(...conditions);
  }

  // Build filter condition
  private buildFilterCondition(tableName: string, filters: TableFilter[]): SQL | undefined {
    if (!filters.length) return undefined;
    
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) return undefined;
    
    const conditions = filters.map(filter => {
      const column = config.table[filter.field as keyof typeof config.table];
      if (!column) return undefined;
      
      switch (filter.operator) {
        case 'eq':
          return eq(column, filter.value);
        case 'contains':
          return ilike(column, `%${filter.value}%`);
        case 'gt':
          return gt(column, filter.value);
        case 'lt':
          return lt(column, filter.value);
        case 'gte':
          return gte(column, filter.value);
        case 'lte':
          return lte(column, filter.value);
        case 'in':
          return inArray(column, filter.value);
        case 'not_in':
          return sql`${column} NOT IN ${filter.value}`;
        case 'is_null':
          return isNull(column);
        case 'is_not_null':
          return isNotNull(column);
        default:
          return undefined;
      }
    }).filter(Boolean);
    
    return conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;
  }

  // Build sort conditions
  private buildSortConditions(tableName: string, sorts: TableSort[]) {
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) return [];
    
    return sorts
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .map(sort => {
        const column = config.table[sort.field as keyof typeof config.table];
        if (!column) return undefined;
        return sort.direction === 'desc' ? desc(column) : asc(column);
      })
      .filter(Boolean);
  }

  // Fetch table data with server-side features
  async fetchTableData(tableName: string, query: TableQuery): Promise<TableResponse> {
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) {
      throw new Error(`Unknown table: ${tableName}`);
    }

    const { page, pageSize, sorts, filters, search } = query;
    const offset = (page - 1) * pageSize;

    // Build conditions
    const searchCondition = this.buildSearchCondition(tableName, search);
    const filterCondition = this.buildFilterCondition(tableName, filters);
    const sortConditions = this.buildSortConditions(tableName, sorts);
    
    // Combine all where conditions
    const whereConditions = [searchCondition, filterCondition].filter(Boolean);
    const finalWhereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    try {
      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(config.table)
        .where(finalWhereCondition);
      
      const totalCount = countResult[0]?.count || 0;

      // Get paginated data
      let query_builder = db
        .select()
        .from(config.table)
        .where(finalWhereCondition)
        .limit(pageSize)
        .offset(offset);

      // Apply sorting
      if (sortConditions.length > 0) {
        query_builder = query_builder.orderBy(...sortConditions);
      } else {
        // Default sort by created_at desc
        query_builder = query_builder.orderBy(desc(config.table.createdAt));
      }

      const data = await query_builder;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        data,
        totalCount,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching table data:', error);
      throw new Error('Failed to fetch table data');
    }
  }

  // Export data to CSV
  async exportToCSV(tableName: string, query: Omit<TableQuery, 'page' | 'pageSize'>): Promise<string> {
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) {
      throw new Error(`Unknown table: ${tableName}`);
    }

    // Build conditions (without pagination)
    const searchCondition = this.buildSearchCondition(tableName, query.search);
    const filterCondition = this.buildFilterCondition(tableName, query.filters);
    const sortConditions = this.buildSortConditions(tableName, query.sorts);
    
    const whereConditions = [searchCondition, filterCondition].filter(Boolean);
    const finalWhereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    try {
      // Get all matching data
      let query_builder = db
        .select()
        .from(config.table)
        .where(finalWhereCondition);

      if (sortConditions.length > 0) {
        query_builder = query_builder.orderBy(...sortConditions);
      }

      const data = await query_builder;

      // Filter columns if specified
      const filteredData = query.columns.length > 0 
        ? data.map(row => {
            const filtered: any = {};
            query.columns.forEach(col => {
              if (row[col as keyof typeof row] !== undefined) {
                filtered[col] = row[col as keyof typeof row];
              }
            });
            return filtered;
          })
        : data;

      // Convert to CSV
      const parser = new Parser();
      const csv = parser.parse(filteredData);

      // Save to file
      const filename = `${tableName}_export_${Date.now()}.csv`;
      const filepath = join(process.cwd(), 'temp', filename);
      
      // Ensure temp directory exists
      await import('fs').then(fs => {
        if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'), { recursive: true });
        }
      });

      await new Promise((resolve, reject) => {
        const stream = createWriteStream(filepath);
        stream.write(csv);
        stream.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      return filepath;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export CSV');
    }
  }

  // Export data to PDF
  async exportToPDF(tableName: string, query: Omit<TableQuery, 'page' | 'pageSize'>): Promise<string> {
    const config = TABLE_CONFIGS[tableName as keyof typeof TABLE_CONFIGS];
    if (!config) {
      throw new Error(`Unknown table: ${tableName}`);
    }

    // Build conditions (without pagination)
    const searchCondition = this.buildSearchCondition(tableName, query.search);
    const filterCondition = this.buildFilterCondition(tableName, query.filters);
    const sortConditions = this.buildSortConditions(tableName, query.sorts);
    
    const whereConditions = [searchCondition, filterCondition].filter(Boolean);
    const finalWhereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    try {
      // Get all matching data
      let query_builder = db
        .select()
        .from(config.table)
        .where(finalWhereCondition)
        .limit(1000); // Limit for PDF to prevent massive files

      if (sortConditions.length > 0) {
        query_builder = query_builder.orderBy(...sortConditions);
      }

      const data = await query_builder;

      // Create PDF
      const doc = new PDFDocument({ margin: 50 });
      const filename = `${tableName}_export_${Date.now()}.pdf`;
      const filepath = join(process.cwd(), 'temp', filename);
      
      // Ensure temp directory exists
      await import('fs').then(fs => {
        if (!fs.existsSync(join(process.cwd(), 'temp'))) {
          fs.mkdirSync(join(process.cwd(), 'temp'), { recursive: true });
        }
      });

      doc.pipe(createWriteStream(filepath));

      // Add title
      doc.fontSize(16).text(`${tableName.toUpperCase()} Export`, { align: 'center' });
      doc.fontSize(10).text(`Generated on ${new Date().toISOString()}`, { align: 'center' });
      doc.moveDown();

      // Add data as simple text (basic implementation)
      const columns = query.columns.length > 0 ? query.columns : Object.keys(data[0] || {});
      
      // Add header row
      doc.fontSize(8).text(columns.join(' | '), { continued: false });
      doc.text('-'.repeat(columns.length * 15));

      // Add data rows
      data.slice(0, 100).forEach(row => { // Limit rows for readability
        const values = columns.map(col => String(row[col as keyof typeof row] || ''));
        doc.text(values.join(' | '), { continued: false });
      });

      if (data.length > 100) {
        doc.text(`... and ${data.length - 100} more rows`);
      }

      doc.end();

      // Wait for file to be written
      await new Promise((resolve, reject) => {
        doc.on('end', resolve);
        doc.on('error', reject);
      });

      return filepath;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export PDF');
    }
  }

  // Saved Views Management
  async getSavedViews(userId: string, tableName: string): Promise<CrmSavedView[]> {
    try {
      return await db
        .select()
        .from(crmSavedViews)
        .where(
          and(
            eq(crmSavedViews.userId, userId),
            eq(crmSavedViews.tableName, tableName)
          )
        )
        .orderBy(desc(crmSavedViews.isDefault), desc(crmSavedViews.createdAt));
    } catch (error) {
      console.error('Error fetching saved views:', error);
      throw new Error('Failed to fetch saved views');
    }
  }

  async saveView(userId: string, tableName: string, name: string, config: any, isDefault: boolean = false): Promise<CrmSavedView> {
    try {
      // If setting as default, unset other defaults
      if (isDefault) {
        await db
          .update(crmSavedViews)
          .set({ isDefault: false })
          .where(
            and(
              eq(crmSavedViews.userId, userId),
              eq(crmSavedViews.tableName, tableName),
              eq(crmSavedViews.isDefault, true)
            )
          );
      }

      const [savedView] = await db
        .insert(crmSavedViews)
        .values({
          userId,
          tableName,
          name,
          config,
          isDefault
        })
        .returning();

      return savedView;
    } catch (error) {
      console.error('Error saving view:', error);
      throw new Error('Failed to save view');
    }
  }

  async updateView(viewId: string, userId: string, updates: Partial<CrmSavedView>): Promise<CrmSavedView> {
    try {
      const [updatedView] = await db
        .update(crmSavedViews)
        .set(updates)
        .where(
          and(
            eq(crmSavedViews.id, viewId),
            eq(crmSavedViews.userId, userId)
          )
        )
        .returning();

      if (!updatedView) {
        throw new Error('View not found or access denied');
      }

      return updatedView;
    } catch (error) {
      console.error('Error updating view:', error);
      throw new Error('Failed to update view');
    }
  }

  async deleteView(viewId: string, userId: string): Promise<void> {
    try {
      const result = await db
        .delete(crmSavedViews)
        .where(
          and(
            eq(crmSavedViews.id, viewId),
            eq(crmSavedViews.userId, userId)
          )
        );

      if (!result.count) {
        throw new Error('View not found or access denied');
      }
    } catch (error) {
      console.error('Error deleting view:', error);
      throw new Error('Failed to delete view');
    }
  }
}

export const enterpriseTableService = new EnterpriseTableService();