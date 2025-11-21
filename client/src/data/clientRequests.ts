import { ClientRequest, InsertClientRequest, Notification } from "@shared/schema";
import { addAuditEntry } from "./auditLog";
import { addNotification } from "./notifications";

// Enhanced types for CRM
export interface Attachment {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
}

export interface SLA {
  targetMinutes: number;
  createdAt: string;
  dueAt: string;
  breached?: boolean;
  paused?: boolean;
}

export interface Escalation {
  tier: 1 | 2 | 3;
  escalatedAt?: string;
  reason?: string;
}

export interface TimelineEntry {
  id: string;
  kind: 'reply' | 'note' | 'event';
  authorId: string;
  authorName: string;
  createdAt: string;
  body: string;
  attachments?: Attachment[];
  internal?: boolean; // For internal notes
}

// Enhanced client request interface for CRM
export interface CRMClientRequest extends Omit<ClientRequest, 'status' | 'timeline'> {
  status: 'new' | 'open' | 'pending-customer' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigneeId?: string;
  assigneeName?: string;
  tags?: string[];
  sla: SLA;
  escalation: Escalation | null;
  timeline?: TimelineEntry[];
  requesterName?: string;
  requesterEmail?: string;
  serviceTitle?: string;
}

// Legacy interface for backward compatibility
export interface AdminResponse {
  id: string;
  requestId: string;
  adminId: string;
  adminName: string;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

// Helper interface for client requests
export interface ClientRequestWithService extends ClientRequest {
  serviceTitle?: string;
  userName?: string;
  responses?: AdminResponse[];
}

// In-memory storage for admin responses
let adminResponses: AdminResponse[] = [];

// Load client requests from localStorage
const loadRequestsFromStorage = (): ClientRequest[] => {
  try {
    const stored = localStorage.getItem("gsc_client_requests");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt)
      }));
    }
  } catch (error) {
    console.error("Error loading requests from storage:", error);
  }
  return defaultRequests;
};

// Save client requests to localStorage
const saveRequestsToStorage = (requests: ClientRequest[]): void => {
  try {
    localStorage.setItem("gsc_client_requests", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving requests to storage:", error);
  }
};

// Load admin responses from localStorage
const loadResponsesFromStorage = (): AdminResponse[] => {
  try {
    const stored = localStorage.getItem("gsc_admin_responses");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((res: any) => ({
        ...res,
        createdAt: new Date(res.createdAt)
      }));
    }
  } catch (error) {
    console.error("Error loading responses from storage:", error);
  }
  return [];
};

// Save admin responses to localStorage
const saveResponsesToStorage = (responses: AdminResponse[]): void => {
  try {
    localStorage.setItem("gsc_admin_responses", JSON.stringify(responses));
  } catch (error) {
    console.error("Error saving responses to storage:", error);
  }
};

// Default client requests data
const defaultRequests: ClientRequest[] = [
  {
    id: "req-1",
    userId: "user-1",
    serviceId: "service-1",
    type: "request",
    title: "تطوير تطبيق جوال للتجارة الإلكترونية",
    description: "نحتاج إلى تطوير تطبيق جوال شامل للتجارة الإلكترونية يدعم الدفع الإلكتروني والإشعارات",
    attachments: [],
    status: "new",
    budget: "50000",
    timeline: "3 أشهر",
    serviceType: "mobile_app",
    createdAt: new Date("2024-08-10T10:00:00Z"),
    updatedAt: new Date("2024-08-10T10:00:00Z"),
  },
  {
    id: "req-2",
    userId: "user-2",
    serviceId: "service-2",
    type: "suggestion",
    title: "اقتراح تحسين واجهة المستخدم",
    description: "أقترح إضافة ميزة البحث المتقدم وتحسين تجربة المستخدم في الصفحة الرئيسية",
    attachments: [],
    status: "in-progress",
    budget: "15000",
    timeline: "شهر واحد",
    serviceType: "ui_ux",
    createdAt: new Date("2024-08-12T14:30:00Z"),
    updatedAt: new Date("2024-08-13T09:15:00Z"),
  }
];

// Initialize data from storage
export let clientRequests = loadRequestsFromStorage();
adminResponses = loadResponsesFromStorage();

// Helper functions for managing client requests
export const addClientRequest = (request: InsertClientRequest): ClientRequest => {
  const newRequest: ClientRequest = {
    id: `req-${Date.now()}`,
    userId: request.userId || null,
    serviceId: request.serviceId || null,
    type: request.type,
    title: request.title,
    description: request.description,
    attachments: request.attachments || null,
    status: request.status || "new",
    budget: request.budget || null,
    timeline: request.timeline || null,
    serviceType: request.serviceType || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  clientRequests.push(newRequest);
  saveRequestsToStorage(clientRequests);
  return newRequest;
};

export const updateRequestStatus = (
  requestId: string, 
  status: "new" | "in-progress" | "answered"
): ClientRequest | null => {
  const requestIndex = clientRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    return null;
  }
  
  clientRequests[requestIndex] = {
    ...clientRequests[requestIndex],
    status,
    updatedAt: new Date(),
  };
  
  saveRequestsToStorage(clientRequests);
  return clientRequests[requestIndex];
};

export const getRequestsByUserId = (userId: string): ClientRequest[] => {
  return clientRequests.filter(req => req.userId === userId);
};

export const getRequestsByStatus = (status: string): ClientRequest[] => {
  return clientRequests.filter(req => req.status === status);
};

export const getAllRequests = (): ClientRequest[] => {
  return [...clientRequests];
};

export const getRequestById = (requestId: string): ClientRequest | null => {
  return clientRequests.find(req => req.id === requestId) || null;
};

export const deleteRequest = (requestId: string): boolean => {
  const initialLength = clientRequests.length;
  clientRequests = clientRequests.filter(req => req.id !== requestId);
  saveRequestsToStorage(clientRequests);
  return clientRequests.length < initialLength;
};

// Admin response functions
export const addResponseToRequest = (
  requestId: string, 
  adminId: string, 
  adminName: string, 
  message: string, 
  attachments?: string[]
): AdminResponse => {
  const newResponse: AdminResponse = {
    id: `resp-${Date.now()}`,
    requestId,
    adminId,
    adminName,
    message,
    attachments: attachments || [],
    createdAt: new Date()
  };
  
  adminResponses.push(newResponse);
  saveResponsesToStorage(adminResponses);
  
  // Update request status to answered
  updateRequestStatus(requestId, "answered");
  
  return newResponse;
};

export const getResponsesForRequest = (requestId: string): AdminResponse[] => {
  return adminResponses.filter(response => response.requestId === requestId);
};

export const getAllResponses = (): AdminResponse[] => {
  return [...adminResponses];
};

// Get requests with their responses
export const getRequestsWithResponses = (): ClientRequestWithService[] => {
  return clientRequests.map(request => ({
    ...request,
    responses: getResponsesForRequest(request.id)
  }));
};

// Analytics functions
export const getAnalytics = () => {
  const totalRequests = clientRequests.length;
  const newRequests = clientRequests.filter(req => req.status === "new").length;
  const inProgressRequests = clientRequests.filter(req => req.status === "in-progress").length;
  const answeredRequests = clientRequests.filter(req => req.status === "answered").length;
  
  const requestsByType = {
    request: clientRequests.filter(req => req.type === "request").length,
    suggestion: clientRequests.filter(req => req.type === "suggestion").length,
    comment: clientRequests.filter(req => req.type === "comment").length
  };
  
  const totalResponses = adminResponses.length;
  const averageResponseTime = totalResponses > 0 ? 
    Math.round(adminResponses.reduce((sum, response) => {
      const request = clientRequests.find(req => req.id === response.requestId);
      if (request && request.createdAt) {
        const responseTime = response.createdAt.getTime() - request.createdAt.getTime();
        return sum + responseTime;
      }
      return sum;
    }, 0) / totalResponses / (1000 * 60 * 60)) : 0; // Convert to hours
  
  return {
    totalRequests,
    newRequests,
    inProgressRequests,
    answeredRequests,
    requestsByType,
    totalResponses,
    averageResponseTime
  };
};

// Statistics helpers
export const getRequestStats = () => {
  const total = clientRequests.length;
  const newRequests = clientRequests.filter(req => req.status === "new").length;
  const inProgress = clientRequests.filter(req => req.status === "in-progress").length;
  const answered = clientRequests.filter(req => req.status === "answered").length;
  
  return {
    total,
    new: newRequests,
    inProgress,
    answered,
  };
};

// Get requests by type
export const getRequestsByType = (type: "request" | "suggestion" | "comment"): ClientRequest[] => {
  return clientRequests.filter(req => req.type === type);
};

// ===== CRM ENHANCED FUNCTIONS =====

// Load CRM requests from localStorage with enhanced features
const loadCRMRequestsFromStorage = (): CRMClientRequest[] => {
  try {
    const stored = localStorage.getItem("gsc_crm_requests");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt)
      }));
    }
  } catch (error) {
    console.error("Error loading CRM requests:", error);
  }
  return transformLegacyToCRM(clientRequests);
};

// Save CRM requests to localStorage
const saveCRMRequestsToStorage = (requests: CRMClientRequest[]): void => {
  try {
    localStorage.setItem("gsc_crm_requests", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving CRM requests:", error);
  }
};

// Transform legacy requests to CRM format
const transformLegacyToCRM = (legacyRequests: ClientRequest[]): CRMClientRequest[] => {
  return legacyRequests.map(req => ({
    ...req,
    status: req.status === 'answered' ? 'resolved' : 
            req.status === 'in-progress' ? 'open' : 'new' as CRMClientRequest['status'],
    priority: 'normal' as const,
    sla: calculateSLA(req.createdAt || new Date(), 240), // 4 hours default
    escalation: null,
    timeline: [],
    tags: [],
    assigneeId: undefined,
    assigneeName: undefined,
    requesterName: `مستخدم ${req.userId}`,
    requesterEmail: `user${req.userId}@example.com`,
    serviceTitle: `خدمة ${req.serviceId}`
  }));
};

// Calculate SLA
const calculateSLA = (createdAt: Date, targetMinutes: number): SLA => {
  const createdAtStr = createdAt.toISOString();
  const dueAt = new Date(createdAt.getTime() + targetMinutes * 60000);
  const now = new Date();
  
  return {
    targetMinutes,
    createdAt: createdAtStr,
    dueAt: dueAt.toISOString(),
    breached: now > dueAt,
    paused: false
  };
};

// Initialize CRM requests
let crmRequests: CRMClientRequest[] = loadCRMRequestsFromStorage();

// CRM helper functions
export const getCRMRequests = (): CRMClientRequest[] => {
  return [...crmRequests];
};

export const getCRMRequestById = (id: string): CRMClientRequest | null => {
  return crmRequests.find(req => req.id === id) || null;
};

export const setAssignee = (id: string, userId: string, userName: string, actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  const oldAssignee = request.assigneeName || 'غير مسند';
  request.assigneeId = userId;
  request.assigneeName = userName;
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم تغيير المسند إليه من "${oldAssignee}" إلى "${userName}"`,
    attachments: []
  });
  
  // Add audit entry
  addAuditEntry(actorId, actorName, 'assign', id, {
    oldAssignee: oldAssignee,
    newAssignee: userName,
    newAssigneeId: userId
  });
  
  // Add notification
  addNotification(
    'assignment',
    'تذكرة جديدة مسندة',
    `تم إسناد التذكرة "${request.title}" إليك`,
    id,
    userId
  );
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const setStatus = (id: string, status: CRMClientRequest['status'], actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  const oldStatus = request.status;
  request.status = status;
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم تغيير حالة التذكرة من "${getStatusLabel(oldStatus)}" إلى "${getStatusLabel(status)}"`,
    attachments: []
  });
  
  // Add audit entry
  addAuditEntry(actorId, actorName, 'status-change', id, {
    oldStatus,
    newStatus: status
  });
  
  // Add notification for status changes
  if (status === 'resolved' || status === 'closed') {
    addNotification(
      'status-change',
      'تم حل التذكرة',
      `تم تحديث حالة التذكرة "${request.title}" إلى "${getStatusLabel(status)}"`,
      id,
      request.userId || undefined
    );
  }
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const setPriority = (id: string, priority: CRMClientRequest['priority'], actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  const oldPriority = request.priority;
  request.priority = priority;
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم تغيير الأولوية من "${getPriorityLabel(oldPriority)}" إلى "${getPriorityLabel(priority)}"`,
    attachments: []
  });
  
  // Add audit entry
  addAuditEntry(actorId, actorName, 'priority-change', id, {
    oldPriority,
    newPriority: priority
  });
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const addTags = (id: string, tags: string[], actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  const currentTags = request.tags || [];
  const newTags = tags.filter(tag => !currentTags.includes(tag));
  
  if (newTags.length === 0) return true;
  
  request.tags = [...currentTags, ...newTags];
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم إضافة العلامات: ${newTags.join(', ')}`,
    attachments: []
  });
  
  // Add audit entries
  newTags.forEach(tag => {
    addAuditEntry(actorId, actorName, 'tag-add', id, { tag });
  });
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const removeTag = (id: string, tag: string, actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request || !request.tags) return false;
  
  const tagIndex = request.tags.indexOf(tag);
  if (tagIndex === -1) return false;
  
  request.tags.splice(tagIndex, 1);
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم إزالة العلامة: ${tag}`,
    attachments: []
  });
  
  // Add audit entry
  addAuditEntry(actorId, actorName, 'tag-remove', id, { tag });
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const ensureSLA = (id: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  if (!request.sla) {
    request.sla = calculateSLA(request.createdAt || new Date(), 240); // Default 4 hours
    saveCRMRequestsToStorage(crmRequests);
  }
  
  return true;
};

export const checkAndMarkSLABreaches = (): void => {
  const now = new Date();
  let hasChanges = false;
  
  crmRequests.forEach(request => {
    if (request.sla && !request.sla.breached && !request.sla.paused) {
      const dueAt = new Date(request.sla.dueAt);
      if (now > dueAt) {
        request.sla.breached = true;
        hasChanges = true;
        
        // Add notification for SLA breach
        addNotification(
          'sla-breach',
          'انتهاك SLA',
          `التذكرة "${request.title}" تجاوزت الوقت المحدد`,
          request.id
        );
      }
    }
  });
  
  if (hasChanges) {
    saveCRMRequestsToStorage(crmRequests);
  }
};

export const escalate = (id: string, nextTier: 1 | 2 | 3, reason: string, actorId: string, actorName: string): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  const oldTier = request.escalation?.tier || 0;
  request.escalation = {
    tier: nextTier,
    escalatedAt: new Date().toISOString(),
    reason
  };
  request.updatedAt = new Date();
  
  // Add timeline entry
  addTimelineEntry(id, {
    kind: 'event',
    authorId: actorId,
    authorName: actorName,
    body: `تم تصعيد التذكرة من المستوى ${oldTier} إلى المستوى ${nextTier}. السبب: ${reason}`,
    attachments: []
  });
  
  // Add audit entry
  addAuditEntry(actorId, actorName, 'escalate', id, {
    oldTier,
    newTier: nextTier,
    reason
  });
  
  // Add notification
  addNotification(
    'escalation',
    'تصعيد تذكرة',
    `تم تصعيد التذكرة "${request.title}" إلى المستوى ${nextTier}`,
    id
  );
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const addTimelineEntry = (id: string, entry: Omit<TimelineEntry, 'id' | 'createdAt'>): boolean => {
  const request = crmRequests.find(req => req.id === id);
  if (!request) return false;
  
  if (!request.timeline) {
    request.timeline = [];
  }
  
  const timelineEntry: TimelineEntry = {
    ...entry,
    id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  request.timeline.unshift(timelineEntry); // Add to beginning for latest first
  request.updatedAt = new Date();
  
  saveCRMRequestsToStorage(crmRequests);
  return true;
};

export const addReply = (id: string, authorId: string, authorName: string, body: string, attachments: Attachment[] = []): boolean => {
  const success = addTimelineEntry(id, {
    kind: 'reply',
    authorId,
    authorName,
    body,
    attachments,
    internal: false
  });
  
  if (success) {
    // Add audit entry
    addAuditEntry(authorId, authorName, 'reply', id, {
      messageLength: body.length,
      attachmentCount: attachments.length
    });
    
    // Add notification
    const request = getCRMRequestById(id);
    if (request) {
      addNotification(
        'new-reply',
        'رد جديد على التذكرة',
        `تم إضافة رد جديد على التذكرة "${request.title}"`,
        id,
        request.userId || undefined
      );
    }
  }
  
  return success;
};

export const addInternalNote = (id: string, authorId: string, authorName: string, body: string, attachments: Attachment[] = []): boolean => {
  const success = addTimelineEntry(id, {
    kind: 'note',
    authorId,
    authorName,
    body,
    attachments,
    internal: true
  });
  
  if (success) {
    // Add audit entry
    addAuditEntry(authorId, authorName, 'note', id, {
      messageLength: body.length,
      attachmentCount: attachments.length
    });
  }
  
  return success;
};

// Helper functions for labels
const getStatusLabel = (status: CRMClientRequest['status']): string => {
  const labels = {
    'new': 'جديد',
    'open': 'مفتوح',
    'pending-customer': 'في انتظار العميل',
    'waiting': 'في الانتظار',
    'resolved': 'محلول',
    'closed': 'مغلق'
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: CRMClientRequest['priority']): string => {
  const labels = {
    'low': 'منخفض',
    'normal': 'عادي',
    'high': 'عالي',
    'urgent': 'عاجل'
  };
  return labels[priority] || priority;
};

// Analytics for CRM
export const getCRMAnalytics = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Basic counts
  const open = crmRequests.filter(req => ['new', 'open', 'pending-customer', 'waiting'].includes(req.status)).length;
  const atRisk = crmRequests.filter(req => req.sla?.breached).length;
  const todayNew = crmRequests.filter(req => (req.createdAt || new Date()) >= today).length;
  const breaches = crmRequests.filter(req => req.sla?.breached).length;
  
  // Calculate averages
  const resolvedRequests = crmRequests.filter(req => req.status === 'resolved' || req.status === 'closed');
  const avgResolution = resolvedRequests.length > 0 ?
    resolvedRequests.reduce((sum, req) => {
      const resolutionTime = (req.updatedAt || new Date()).getTime() - (req.createdAt || new Date()).getTime();
      return sum + resolutionTime;
    }, 0) / resolvedRequests.length / (1000 * 60 * 60) : 0; // Convert to hours
  
  // First response time (from timeline)
  const requestsWithReplies = crmRequests.filter(req => 
    req.timeline?.some(entry => entry.kind === 'reply')
  );
  const avgFirstResponse = requestsWithReplies.length > 0 ?
    requestsWithReplies.reduce((sum, req) => {
      const firstReply = req.timeline?.find(entry => entry.kind === 'reply');
      if (firstReply) {
        const responseTime = new Date(firstReply.createdAt).getTime() - (req.createdAt || new Date()).getTime();
        return sum + responseTime;
      }
      return sum;
    }, 0) / requestsWithReplies.length / (1000 * 60 * 60) : 0; // Convert to hours
  
  // Last 30 days data for charts
  const last30DaysData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    
    const openCount = crmRequests.filter(req => 
      (req.createdAt || new Date()) >= date && (req.createdAt || new Date()) < nextDate &&
      ['new', 'open', 'pending-customer', 'waiting'].includes(req.status)
    ).length;
    
    const resolvedCount = crmRequests.filter(req => 
      (req.updatedAt || new Date()) >= date && (req.updatedAt || new Date()) < nextDate &&
      ['resolved', 'closed'].includes(req.status)
    ).length;
    
    last30DaysData.push({
      date: date.toISOString().split('T')[0],
      open: openCount,
      resolved: resolvedCount
    });
  }
  
  // SLA breaches by tier
  const slaBreachesByTier = {
    tier1: crmRequests.filter(req => req.escalation?.tier === 1 && req.sla?.breached).length,
    tier2: crmRequests.filter(req => req.escalation?.tier === 2 && req.sla?.breached).length,
    tier3: crmRequests.filter(req => req.escalation?.tier === 3 && req.sla?.breached).length
  };
  
  return {
    kpis: {
      open,
      atRisk,
      avgFirstResponse: Math.round(avgFirstResponse * 10) / 10,
      avgResolution: Math.round(avgResolution * 10) / 10,
      todayNew,
      breaches
    },
    charts: {
      last30Days: last30DaysData,
      slaBreachesByTier
    }
  };
};