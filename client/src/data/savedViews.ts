// Saved Views for CRM Inbox
export interface SavedView {
  id: string;
  name: string;
  isDefault: boolean;
  filters: {
    status?: string[];
    priority?: string[];
    assigneeId?: string[];
    tags?: string[];
    service?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    search?: string;
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  columns?: string[]; // Optional: which columns to show
}

const defaultViews: SavedView[] = [
  {
    id: 'my-open',
    name: 'المسندة لي - مفتوحة',
    isDefault: true,
    filters: {
      status: ['new', 'open', 'pending-customer']
    },
    sort: {
      field: 'updatedAt',
      direction: 'desc'
    }
  },
  {
    id: 'unassigned',
    name: 'غير مسندة',
    isDefault: true,
    filters: {
      assigneeId: ['']
    },
    sort: {
      field: 'createdAt',
      direction: 'desc'
    }
  },
  {
    id: 'sla-at-risk',
    name: 'SLA في خطر',
    isDefault: true,
    filters: {},
    sort: {
      field: 'sla.dueAt',
      direction: 'asc'
    }
  },
  {
    id: 'high-priority',
    name: 'أولوية عالية',
    isDefault: true,
    filters: {
      priority: ['high', 'urgent']
    },
    sort: {
      field: 'priority',
      direction: 'desc'
    }
  },
  {
    id: 'all',
    name: 'جميع التذاكر',
    isDefault: true,
    filters: {},
    sort: {
      field: 'updatedAt',
      direction: 'desc'
    }
  }
];

// Load saved views from localStorage
const loadViewsFromStorage = (): SavedView[] => {
  try {
    const stored = localStorage.getItem("gsc_crm_views");
    if (stored) {
      const parsedViews = JSON.parse(stored);
      // Ensure default views are always present
      const defaultIds = defaultViews.map(v => v.id);
      const customViews = parsedViews.filter((v: SavedView) => !defaultIds.includes(v.id));
      return [...defaultViews, ...customViews];
    }
  } catch (error) {
    console.error("Error loading saved views:", error);
  }
  return defaultViews;
};

// Save views to localStorage
const saveViewsToStorage = (views: SavedView[]): void => {
  try {
    localStorage.setItem("gsc_crm_views", JSON.stringify(views));
  } catch (error) {
    console.error("Error saving views:", error);
  }
};

let savedViews: SavedView[] = loadViewsFromStorage();

// Get all saved views
export const getSavedViews = (): SavedView[] => {
  return [...savedViews];
};

// Get view by ID
export const getSavedView = (id: string): SavedView | null => {
  return savedViews.find(view => view.id === id) || null;
};

// Add new saved view
export const addSavedView = (view: Omit<SavedView, 'id'>): SavedView => {
  const newView: SavedView = {
    ...view,
    id: `view-${Date.now()}`,
    isDefault: false
  };
  
  savedViews.push(newView);
  saveViewsToStorage(savedViews);
  return newView;
};

// Update saved view
export const updateSavedView = (id: string, updates: Partial<Omit<SavedView, 'id' | 'isDefault'>>): SavedView | null => {
  const index = savedViews.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  // Don't allow updating default views
  if (savedViews[index].isDefault) return null;
  
  savedViews[index] = { ...savedViews[index], ...updates };
  saveViewsToStorage(savedViews);
  return savedViews[index];
};

// Delete saved view
export const deleteSavedView = (id: string): boolean => {
  const index = savedViews.findIndex(v => v.id === id);
  if (index === -1) return false;
  
  // Don't allow deleting default views
  if (savedViews[index].isDefault) return false;
  
  savedViews.splice(index, 1);
  saveViewsToStorage(savedViews);
  return true;
};

// Apply filters to request list
export const applyViewFilters = (requests: any[], filters: SavedView['filters']): any[] => {
  let filtered = [...requests];
  
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(req => filters.status!.includes(req.status));
  }
  
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter(req => filters.priority!.includes(req.priority));
  }
  
  if (filters.assigneeId && filters.assigneeId.length > 0) {
    filtered = filtered.filter(req => {
      const assigneeId = req.assigneeId || '';
      return filters.assigneeId!.includes(assigneeId);
    });
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(req => {
      const requestTags = req.tags || [];
      return filters.tags!.some(tag => requestTags.includes(tag));
    });
  }
  
  if (filters.service && filters.service.length > 0) {
    filtered = filtered.filter(req => filters.service!.includes(req.service));
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(req =>
      req.title?.toLowerCase().includes(searchLower) ||
      req.description?.toLowerCase().includes(searchLower) ||
      req.requesterName?.toLowerCase().includes(searchLower) ||
      req.requesterEmail?.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    filtered = filtered.filter(req => {
      const createdAt = new Date(req.createdAt);
      return createdAt >= start && createdAt <= end;
    });
  }
  
  return filtered;
};

// Apply sorting to request list
export const applySorting = (requests: any[], sort: SavedView['sort']): any[] => {
  const sorted = [...requests];
  
  sorted.sort((a, b) => {
    let aValue = a[sort.field];
    let bValue = b[sort.field];
    
    // Handle nested fields like sla.dueAt
    if (sort.field.includes('.')) {
      const fields = sort.field.split('.');
      aValue = fields.reduce((obj, field) => obj?.[field], a);
      bValue = fields.reduce((obj, field) => obj?.[field], b);
    }
    
    // Handle date fields
    if (sort.field.includes('At') || sort.field.includes('Date')) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Handle priority sorting
    if (sort.field === 'priority') {
      const priorityOrder = { 'urgent': 4, 'high': 3, 'normal': 2, 'low': 1 };
      aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
      bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
    }
    
    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};