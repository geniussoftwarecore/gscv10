import { Router } from "express";
import { contactsService } from "../crm_services/contactsService";
import { companiesService } from "../crm_services/companiesService";
import { AuditService } from "../crm_services/auditService";
import { CRM_PERMISSIONS } from "../server/middleware/requirePermission";
import { requireAuth } from "../server/middleware/requireAuth";

const router = Router();

// Apply authentication to all CRM routes
router.use(requireAuth);

// CONTACTS ROUTES
// Get contacts with pagination, filtering, and sorting
router.get('/contacts', CRM_PERMISSIONS.contacts.read, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'updated_at',
      sortOrder = 'desc',
      search,
      accountId,
      jobTitle,
      department,
      isPrimary,
      isActive,
      tags,
      hasEmail,
      hasPhone
    } = req.query;

    const filters = {
      search: search as string,
      accountId: accountId as string,
      jobTitle: jobTitle as string,
      department: department as string,
      isPrimary: isPrimary === 'true',
      isActive: isActive !== 'false',
      tags: tags ? (tags as string).split(',') : undefined,
      hasEmail: hasEmail === 'true',
      hasPhone: hasPhone === 'true'
    };

    const result = await contactsService.getContacts(
      req.user!.role,
      filters,
      parseInt(page as string),
      parseInt(limit as string),
      sortBy as string,
      sortOrder as 'asc' | 'desc'
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get contact by ID
router.get('/contacts/:id', CRM_PERMISSIONS.contacts.read, async (req, res) => {
  try {
    const contact = await contactsService.getContactById(req.params.id, req.user!.role);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create contact
router.post('/contacts', CRM_PERMISSIONS.contacts.create, async (req, res) => {
  try {
    const contact = await contactsService.createContact(
      req.body,
      req.user!.id,
      req.user!.role,
      req
    );

    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/contacts/:id', CRM_PERMISSIONS.contacts.update, async (req, res) => {
  try {
    const contact = await contactsService.updateContact(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.role,
      req
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
router.delete('/contacts/:id', CRM_PERMISSIONS.contacts.delete, async (req, res) => {
  try {
    const success = await contactsService.deleteContact(
      req.params.id,
      req.user!.id,
      req.user!.role,
      req
    );

    if (!success) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Get contact history/audit logs
router.get('/contacts/:id/history', CRM_PERMISSIONS.auditLogs.read, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await contactsService.getContactHistory(
      req.params.id,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching contact history:', error);
    res.status(500).json({ error: 'Failed to fetch contact history' });
  }
});

// COMPANIES ROUTES
// Get companies with pagination, filtering, and sorting
router.get('/companies', CRM_PERMISSIONS.accounts.read, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'updated_at',
      sortOrder = 'desc',
      search,
      type,
      industry,
      assignedTo,
      isActive,
      tags
    } = req.query;

    const filters = {
      search: search as string,
      type: type as string,
      industry: industry as string,
      assignedTo: assignedTo as string,
      isActive: isActive !== 'false',
      tags: tags ? (tags as string).split(',') : undefined
    };

    const result = await companiesService.getCompanies(
      req.user!.role,
      filters,
      parseInt(page as string),
      parseInt(limit as string),
      sortBy as string,
      sortOrder as 'asc' | 'desc'
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/companies/:id', CRM_PERMISSIONS.accounts.read, async (req, res) => {
  try {
    const company = await companiesService.getCompanyById(req.params.id, req.user!.role);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company
router.post('/companies', CRM_PERMISSIONS.accounts.create, async (req, res) => {
  try {
    const company = await companiesService.createCompany(
      req.body,
      req.user!.id,
      req.user!.role,
      req
    );

    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/companies/:id', CRM_PERMISSIONS.accounts.update, async (req, res) => {
  try {
    const company = await companiesService.updateCompany(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.role,
      req
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/companies/:id', CRM_PERMISSIONS.accounts.delete, async (req, res) => {
  try {
    const success = await companiesService.deleteCompany(
      req.params.id,
      req.user!.id,
      req.user!.role,
      req
    );

    if (!success) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Get company history/audit logs
router.get('/companies/:id/history', CRM_PERMISSIONS.auditLogs.read, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await companiesService.getCompanyHistory(
      req.params.id,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching company history:', error);
    res.status(500).json({ error: 'Failed to fetch company history' });
  }
});

// AUDIT LOGS ROUTES
// Get all audit logs (admin/manager only)
router.get('/audit-logs', CRM_PERMISSIONS.auditLogs.read, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      entityType,
      entityId,
      actorId,
      action,
      startDate,
      endDate
    } = req.query;

    const filters = {
      entityType: entityType as string,
      entityId: entityId as string,
      actorId: actorId as string,
      action: action as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };

    const result = await AuditService.getLogs(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get audit statistics
router.get('/audit-logs/stats', CRM_PERMISSIONS.auditLogs.read, async (req, res) => {
  try {
    const { entityType, days = 30 } = req.query;
    
    const stats = await AuditService.getAuditStats(
      entityType as string,
      parseInt(days as string)
    );

    res.json(stats);
  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch audit statistics' });
  }
});

// Export audit logs (admin/manager only)
router.get('/audit-logs/export', CRM_PERMISSIONS.accounts.export, async (req, res) => {
  try {
    const {
      format = 'csv',
      entityType,
      startDate,
      endDate,
      actorId
    } = req.query;

    const filters = {
      entityType: entityType as string,
      actorId: actorId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: 1,
      limit: 10000 // Export limit
    };

    const logs = await AuditService.getLogs(filters);

    // Log the export action
    await AuditService.logFromRequest(
      req,
      'export',
      'audit_logs',
      'bulk',
      {
        entityName: `Audit logs export (${format})`,
        after: {
          recordCount: logs.logs.length,
          format,
          filters
        }
      }
    );

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.json"');
      res.json(logs);
    } else {
      // CSV format
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"');
      
      // Create CSV header
      const csvHeader = 'ID,Actor ID,Action,Entity Type,Entity ID,IP,User Agent,Created At\n';
      
      // Create CSV rows
      const csvRows = logs.logs.map(log => 
        `"${log.id}","${log.actorId}","${log.action}","${log.entityType}","${log.entityId}","${log.metadata?.ipAddress || ''}","${log.metadata?.userAgent || ''}","${log.createdAt}"`
      ).join('\n');
      
      res.send(csvHeader + csvRows);
    }
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

export default router;