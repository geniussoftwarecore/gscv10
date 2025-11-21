import { Router } from 'express';
import { db } from '../db';
import { savedFilters, users } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { Request, Response } from 'express';

const router = Router();

interface SavedViewData {
  name: string;
  entities: string[];
  filters: Record<string, any>;
  columns?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
  isDefault?: boolean;
}

// Get all saved views for current user
router.get('/views', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    // In a real app, you'd get userId from authentication middleware
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const views = await db
      .select()
      .from(savedFilters)
      .where(eq(savedFilters.userId, userId))
      .orderBy(savedFilters.createdAt);

    res.json(views);
  } catch (error: any) {
    console.error('Get saved views error:', error);
    res.status(500).json({ error: 'Failed to fetch saved views' });
  }
});

// Get saved views for specific entity
router.get('/views/:entity', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { entity } = req.params;
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const views = await db
      .select()
      .from(savedFilters)
      .where(
        and(
          eq(savedFilters.userId, userId),
          // Check if entity is in the entities array
        )
      )
      .orderBy(savedFilters.createdAt);

    // Filter views that include this entity
    const relevantViews = views.filter((view: any) => {
      const entities = view.entities as string[] || [];
      return entities.includes(entity);
    });

    res.json(relevantViews);
  } catch (error: any) {
    console.error('Get entity saved views error:', error);
    res.status(500).json({ error: 'Failed to fetch saved views' });
  }
});

// Create new saved view
router.post('/views', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const viewData: SavedViewData = req.body;

    // Validate required fields
    if (!viewData.name || !viewData.entities || !Array.isArray(viewData.entities)) {
      return res.status(400).json({ error: 'Name and entities are required' });
    }

    // Check if user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If this is being set as default, unset other defaults for this user and entities
    if (viewData.isDefault) {
      await db
        .update(savedFilters)
        .set({ isDefault: 'false', updatedAt: new Date() })
        .where(eq(savedFilters.userId, userId));
    }

    // Create the saved view
    const newView = await db
      .insert(savedFilters)
      .values({
        userId: userId,
        name: viewData.name,
        entities: viewData.entities,
        filters: {
          ...viewData.filters,
          columns: viewData.columns || [],
          sortBy: viewData.sortBy,
          sortOrder: viewData.sortOrder || 'desc',
          pageSize: viewData.pageSize || 25
        },
        isDefault: viewData.isDefault ? 'true' : 'false'
      })
      .returning();

    res.status(201).json(newView[0]);
  } catch (error: any) {
    console.error('Create saved view error:', error);
    res.status(500).json({ error: 'Failed to create saved view' });
  }
});

// Update saved view
router.put('/views/:viewId', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { viewId } = req.params;
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const viewData: Partial<SavedViewData> = req.body;

    // Check if view exists and belongs to user
    const existingView = await db
      .select()
      .from(savedFilters)
      .where(
        and(
          eq(savedFilters.id, viewId),
          eq(savedFilters.userId, userId)
        )
      )
      .limit(1);

    if (existingView.length === 0) {
      return res.status(404).json({ error: 'Saved view not found' });
    }

    // If this is being set as default, unset other defaults for this user
    if (viewData.isDefault) {
      await db
        .update(savedFilters)
        .set({ isDefault: 'false', updatedAt: new Date() })
        .where(
          and(
            eq(savedFilters.userId, userId),
            // Don't unset the current view we're updating
          )
        );
    }

    // Update the view
    const updateData: any = {
      updatedAt: new Date()
    };

    if (viewData.name) updateData.name = viewData.name;
    if (viewData.entities) updateData.entities = viewData.entities;
    if (viewData.filters) {
      updateData.filters = {
        ...viewData.filters,
        columns: viewData.columns || [],
        sortBy: viewData.sortBy,
        sortOrder: viewData.sortOrder || 'desc',
        pageSize: viewData.pageSize || 25
      };
    }
    if (viewData.isDefault !== undefined) {
      updateData.isDefault = viewData.isDefault ? 'true' : 'false';
    }

    const updatedView = await db
      .update(savedFilters)
      .set(updateData)
      .where(eq(savedFilters.id, viewId))
      .returning();

    res.json(updatedView[0]);
  } catch (error: any) {
    console.error('Update saved view error:', error);
    res.status(500).json({ error: 'Failed to update saved view' });
  }
});

// Delete saved view
router.delete('/views/:viewId', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { viewId } = req.params;
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Check if view exists and belongs to user
    const existingView = await db
      .select()
      .from(savedFilters)
      .where(
        and(
          eq(savedFilters.id, viewId),
          eq(savedFilters.userId, userId)
        )
      )
      .limit(1);

    if (existingView.length === 0) {
      return res.status(404).json({ error: 'Saved view not found' });
    }

    await db
      .delete(savedFilters)
      .where(eq(savedFilters.id, viewId));

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete saved view error:', error);
    res.status(500).json({ error: 'Failed to delete saved view' });
  }
});

// Get default view for entity
router.get('/views/:entity/default', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const { entity } = req.params;
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const defaultView = await db
      .select()
      .from(savedFilters)
      .where(
        and(
          eq(savedFilters.userId, userId),
          eq(savedFilters.isDefault, 'true')
        )
      )
      .limit(1);

    // Filter for views that include this entity
    const relevantDefault = defaultView.find((view: any) => {
      const entities = view.entities as string[] || [];
      return entities.includes(entity);
    });

    if (relevantDefault) {
      res.json(relevantDefault);
    } else {
      res.status(404).json({ error: 'No default view found' });
    }
  } catch (error: any) {
    console.error('Get default view error:', error);
    res.status(500).json({ error: 'Failed to fetch default view' });
  }
});

export default router;