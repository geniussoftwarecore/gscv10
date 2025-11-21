import { Router, Request, Response } from 'express';
import { enterpriseTableService } from '../services/enterpriseTableService';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';

const router = Router();

// Middleware to parse table query parameters
const parseTableQuery = (req: Request) => {
  const {
    page = '1',
    pageSize = '25',
    sorts = '[]',
    filters = '[]',
    search = '',
    columns = ''
  } = req.query;

  return {
    page: parseInt(page as string, 10),
    pageSize: Math.min(parseInt(pageSize as string, 10), 1000), // Max 1000 per page
    sorts: JSON.parse(sorts as string),
    filters: JSON.parse(filters as string),
    search: search as string,
    columns: columns ? (columns as string).split(',') : []
  };
};

// GET /api/tables/:tableName - Fetch table data with server-side features
router.get('/:tableName', async (req: Request, res: Response) => {
  try {
    const { tableName } = req.params;
    const query = parseTableQuery(req);

    const result = await enterpriseTableService.fetchTableData(tableName, query);
    
    res.json(result);
  } catch (error) {
    console.error('Table fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch table data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tables/:tableName/export - Export table data
router.get('/:tableName/export', async (req: Request, res: Response) => {
  try {
    const { tableName } = req.params;
    const { format = 'csv' } = req.query;
    
    // Parse query without page/pageSize for export
    const queryParams = parseTableQuery(req);
    const { sorts, filters, search, columns } = queryParams;
    
    let filepath: string;
    let contentType: string;
    let fileExtension: string;

    if (format === 'pdf') {
      filepath = await enterpriseTableService.exportToPDF(tableName, {
        sorts,
        filters,
        search,
        columns
      });
      contentType = 'application/pdf';
      fileExtension = 'pdf';
    } else {
      filepath = await enterpriseTableService.exportToCSV(tableName, {
        sorts,
        filters,
        search,
        columns
      });
      contentType = 'text/csv';
      fileExtension = 'csv';
    }

    const filename = `${tableName}_export_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    
    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = createReadStream(filepath);
    fileStream.pipe(res);

    // Clean up the temporary file after streaming
    fileStream.on('end', async () => {
      try {
        await unlink(filepath);
      } catch (cleanupError) {
        console.error('Failed to cleanup export file:', cleanupError);
      }
    });

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream export file' });
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/saved-views/:tableName - Get saved views for table
router.get('/saved-views/:tableName', async (req: Request, res: Response) => {
  try {
    const { tableName } = req.params;
    // TODO: Get user ID from session/auth
    const userId = req.session?.user?.id || 'demo-user';
    
    const views = await enterpriseTableService.getSavedViews(userId, tableName);
    res.json(views);
  } catch (error) {
    console.error('Saved views fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch saved views',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/saved-views - Save a new view
router.post('/saved-views', async (req: Request, res: Response) => {
  try {
    const { tableName, name, config, isDefault } = req.body;
    // TODO: Get user ID from session/auth
    const userId = req.session?.user?.id || 'demo-user';
    
    if (!tableName || !name || !config) {
      return res.status(400).json({ error: 'Missing required fields: tableName, name, config' });
    }
    
    const savedView = await enterpriseTableService.saveView(userId, tableName, name, config, isDefault);
    res.json(savedView);
  } catch (error) {
    console.error('Save view error:', error);
    res.status(500).json({ 
      error: 'Failed to save view',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/saved-views/:viewId - Update a saved view
router.put('/saved-views/:viewId', async (req: Request, res: Response) => {
  try {
    const { viewId } = req.params;
    const updates = req.body;
    // TODO: Get user ID from session/auth
    const userId = req.session?.user?.id || 'demo-user';
    
    const updatedView = await enterpriseTableService.updateView(viewId, userId, updates);
    res.json(updatedView);
  } catch (error) {
    console.error('Update view error:', error);
    res.status(500).json({ 
      error: 'Failed to update view',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/saved-views/:viewId - Delete a saved view
router.delete('/saved-views/:viewId', async (req: Request, res: Response) => {
  try {
    const { viewId } = req.params;
    // TODO: Get user ID from session/auth
    const userId = req.session?.user?.id || 'demo-user';
    
    await enterpriseTableService.deleteView(viewId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete view error:', error);
    res.status(500).json({ 
      error: 'Failed to delete view',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;