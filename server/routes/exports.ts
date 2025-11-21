import { Router } from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { db } from '../db';
import { contacts, accounts, opportunities, supportTickets } from '@shared/schema';
import { eq, and, like, gte, lte, desc, asc } from 'drizzle-orm';
import type { Request, Response } from 'express';

const router = Router();

interface ExportQuery {
  format: 'csv' | 'pdf';
  entity: 'contacts' | 'accounts' | 'deals' | 'tickets';
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  columns?: string[];
}

// Helper function to build Drizzle query with filters
function buildQuery(entity: string, filters: Record<string, any> = {}, sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
  let table;
  let query;

  switch (entity) {
    case 'contacts':
      table = contacts;
      query = db.select().from(contacts);
      break;
    case 'accounts':
      table = accounts;
      query = db.select().from(accounts);
      break;
    case 'deals':
      table = opportunities;
      query = db.select().from(opportunities);
      break;
    case 'tickets':
      table = supportTickets;
      query = db.select().from(supportTickets);
      break;
    default:
      throw new Error(`Unknown entity: ${entity}`);
  }

  // Apply filters
  const conditions = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== '') {
      if (key === 'search') {
        // Search across name/title fields
        if (entity === 'contacts') {
          conditions.push(like(contacts.name, `%${value}%`));
        } else if (entity === 'accounts') {
          conditions.push(like(accounts.name, `%${value}%`));
        } else if (entity === 'deals') {
          conditions.push(like(opportunities.name, `%${value}%`));
        } else if (entity === 'tickets') {
          conditions.push(like(supportTickets.subject, `%${value}%`));
        }
      } else if (key === 'dateFrom') {
        if (entity === 'contacts') {
          conditions.push(gte(contacts.createdAt, new Date(value)));
        } else if (entity === 'accounts') {
          conditions.push(gte(accounts.createdAt, new Date(value)));
        } else if (entity === 'deals') {
          conditions.push(gte(opportunities.createdAt, new Date(value)));
        } else if (entity === 'tickets') {
          conditions.push(gte(supportTickets.createdAt, new Date(value)));
        }
      } else if (key === 'dateTo') {
        if (entity === 'contacts') {
          conditions.push(lte(contacts.createdAt, new Date(value)));
        } else if (entity === 'accounts') {
          conditions.push(lte(accounts.createdAt, new Date(value)));
        } else if (entity === 'deals') {
          conditions.push(lte(opportunities.createdAt, new Date(value)));
        } else if (entity === 'tickets') {
          conditions.push(lte(supportTickets.createdAt, new Date(value)));
        }
      } else if (key === 'status') {
        if (entity === 'deals') {
          conditions.push(eq(opportunities.stage, value));
        } else if (entity === 'tickets') {
          conditions.push(eq(supportTickets.status, value));
        }
      } else if (key === 'assignedTo') {
        if (entity === 'accounts') {
          conditions.push(eq(accounts.assignedTo, value));
        } else if (entity === 'deals') {
          conditions.push(eq(opportunities.assignedTo, value));
        } else if (entity === 'tickets') {
          conditions.push(eq(supportTickets.assignedTo, value));
        }
      } else if (key === 'priority' && entity === 'tickets') {
        conditions.push(eq(supportTickets.priority, value));
      } else if (key === 'type' && entity === 'accounts') {
        conditions.push(eq(accounts.type, value));
      }
    }
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  // Apply sorting
  if (sortBy) {
    if (entity === 'contacts' && sortBy in contacts) {
      const field = contacts[sortBy as keyof typeof contacts];
      query = query.orderBy(sortOrder === 'asc' ? asc(field) : desc(field));
    } else if (entity === 'accounts' && sortBy in accounts) {
      const field = accounts[sortBy as keyof typeof accounts];
      query = query.orderBy(sortOrder === 'asc' ? asc(field) : desc(field));
    } else if (entity === 'deals' && sortBy in opportunities) {
      const field = opportunities[sortBy as keyof typeof opportunities];
      query = query.orderBy(sortOrder === 'asc' ? asc(field) : desc(field));
    } else if (entity === 'tickets' && sortBy in supportTickets) {
      const field = supportTickets[sortBy as keyof typeof supportTickets];
      query = query.orderBy(sortOrder === 'asc' ? asc(field) : desc(field));
    }
  } else {
    if (entity === 'contacts') {
      query = query.orderBy(desc(contacts.createdAt));
    } else if (entity === 'accounts') {
      query = query.orderBy(desc(accounts.createdAt));
    } else if (entity === 'deals') {
      query = query.orderBy(desc(opportunities.createdAt));
    } else if (entity === 'tickets') {
      query = query.orderBy(desc(supportTickets.createdAt));
    }
  }

  return query;
}

// CSV Export
async function exportToCSV(entity: string, filters: Record<string, any>, sortBy?: string, sortOrder?: 'asc' | 'desc', columns?: string[]): Promise<string> {
  const query = buildQuery(entity, filters, sortBy, sortOrder);
  const data = await query.execute();

  if (data.length === 0) {
    return '';
  }

  // Define default fields for each entity
  const defaultFields: Record<string, string[]> = {
    contacts: ['id', 'name', 'email', 'phone', 'jobTitle', 'accountId', 'isActive', 'createdAt'],
    accounts: ['id', 'name', 'type', 'industry', 'email', 'phone', 'assignedTo', 'isActive', 'createdAt'],
    deals: ['id', 'name', 'stage', 'amount', 'probability', 'accountId', 'contactId', 'assignedTo', 'createdAt'],
    tickets: ['id', 'subject', 'status', 'priority', 'category', 'assignedTo', 'userId', 'createdAt']
  };

  const fields = columns && columns.length > 0 ? columns : defaultFields[entity];
  const parser = new Parser({ fields });
  
  return parser.parse(data);
}

// PDF Export with GSC branding
async function exportToPDF(entity: string, filters: Record<string, any>, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<Buffer> {
  const query = buildQuery(entity, filters, sortBy, sortOrder);
  const data = await query.execute();

  const doc = new PDFDocument({ margin: 40 });
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));

  // Header with GSC branding
  doc.fillColor('#1f2937')
     .fontSize(24)
     .text('Genius Software Core', 40, 40);

  doc.fillColor('#6b7280')
     .fontSize(14)
     .text(`${entity.charAt(0).toUpperCase() + entity.slice(1)} Export Report`, 40, 70);

  doc.fillColor('#9ca3af')
     .fontSize(10)
     .text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 90)
     .text(`Total Records: ${data.length}`, 40, 105);

  // Add filters info if any
  if (Object.keys(filters).length > 0) {
    doc.text('Applied Filters:', 40, 125);
    let yPos = 140;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        doc.text(`${key}: ${value}`, 50, yPos);
        yPos += 15;
      }
    });
  }

  // Table headers
  let yPos = Object.keys(filters).length > 0 ? 180 : 140;
  doc.fillColor('#374151')
     .fontSize(12)
     .text('Data:', 40, yPos);

  yPos += 25;

  // Define columns for each entity
  const columnConfig: Record<string, {field: string, label: string, width: number}[]> = {
    contacts: [
      {field: 'name', label: 'Name', width: 120},
      {field: 'email', label: 'Email', width: 150},
      {field: 'phone', label: 'Phone', width: 100},
      {field: 'jobTitle', label: 'Job Title', width: 100},
      {field: 'createdAt', label: 'Created', width: 80}
    ],
    accounts: [
      {field: 'name', label: 'Account Name', width: 140},
      {field: 'type', label: 'Type', width: 80},
      {field: 'industry', label: 'Industry', width: 100},
      {field: 'email', label: 'Email', width: 120},
      {field: 'createdAt', label: 'Created', width: 80}
    ],
    deals: [
      {field: 'name', label: 'Deal Name', width: 140},
      {field: 'stage', label: 'Stage', width: 100},
      {field: 'amount', label: 'Amount', width: 80},
      {field: 'probability', label: 'Probability', width: 70},
      {field: 'createdAt', label: 'Created', width: 80}
    ],
    tickets: [
      {field: 'subject', label: 'Subject', width: 160},
      {field: 'status', label: 'Status', width: 80},
      {field: 'priority', label: 'Priority', width: 80},
      {field: 'category', label: 'Category', width: 100},
      {field: 'createdAt', label: 'Created', width: 80}
    ]
  };

  const columns = columnConfig[entity];

  // Draw table headers
  let xPos = 40;
  columns.forEach(col => {
    doc.fillColor('#6b7280')
       .fontSize(10)
       .text(col.label, xPos, yPos, { width: col.width, align: 'left' });
    xPos += col.width;
  });

  yPos += 20;

  // Draw horizontal line
  doc.moveTo(40, yPos)
     .lineTo(550, yPos)
     .strokeColor('#e5e7eb')
     .stroke();

  yPos += 10;

  // Draw data rows
  data.slice(0, 50).forEach((row: any, index: number) => { // Limit to 50 rows for PDF
    if (yPos > 700) { // Start new page
      doc.addPage();
      yPos = 50;
    }

    xPos = 40;
    doc.fillColor(index % 2 === 0 ? '#f9fafb' : '#ffffff')
       .rect(35, yPos - 5, 520, 18)
       .fill();

    columns.forEach(col => {
      let value = row[col.field];
      if (col.field === 'createdAt' && value) {
        value = new Date(value).toLocaleDateString();
      }
      
      doc.fillColor('#374151')
         .fontSize(9)
         .text(String(value || ''), xPos, yPos, { 
           width: col.width - 5, 
           align: 'left',
           ellipsis: true 
         });
      xPos += col.width;
    });

    yPos += 18;
  });

  if (data.length > 50) {
    yPos += 20;
    doc.fillColor('#6b7280')
       .fontSize(10)
       .text(`Note: Showing first 50 of ${data.length} records. Use CSV export for complete data.`, 40, yPos);
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
}

// Export endpoints
router.get('/export/:entity', async (req: Request, res: Response) => {
  try {
    const { entity } = req.params;
    const { format = 'csv', ...filters } = req.query as any;
    const { sortBy, sortOrder = 'desc', columns } = req.query as any;

    if (!['contacts', 'accounts', 'deals', 'tickets'].includes(entity)) {
      return res.status(400).json({ error: 'Invalid entity type' });
    }

    if (!['csv', 'pdf'].includes(format)) {
      return res.status(400).json({ error: 'Invalid export format' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    if (format === 'csv') {
      const csvData = await exportToCSV(entity, filters, sortBy, sortOrder, columns?.split(','));
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${entity}-export-${Date.now()}.csv"`);
      res.send(csvData);
    } else {
      const pdfBuffer = await exportToPDF(entity, filters, sortBy, sortOrder);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${entity}-export-${Date.now()}.pdf"`);
      res.send(pdfBuffer);
    }
  } catch (error: any) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed', details: error.message });
  }
});

export default router;