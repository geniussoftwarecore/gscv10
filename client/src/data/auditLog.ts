// Audit Log for CRM Actions
export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: 'status-change' | 'assign' | 'escalate' | 'reply' | 'note' | 'tag-add' | 'tag-remove' | 'priority-change';
  targetId: string;
  meta: Record<string, any>;
}

// Load audit entries from localStorage
const loadAuditFromStorage = (): AuditEntry[] => {
  try {
    const stored = localStorage.getItem("gsc_audit");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading audit log:", error);
    return [];
  }
};

// Save audit entries to localStorage
const saveAuditToStorage = (entries: AuditEntry[]): void => {
  try {
    localStorage.setItem("gsc_audit", JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving audit log:", error);
  }
};

let auditEntries: AuditEntry[] = loadAuditFromStorage();

// Add new audit entry
export const addAuditEntry = (
  actorId: string,
  actorName: string,
  action: AuditEntry['action'],
  targetId: string,
  meta: Record<string, any> = {}
): void => {
  const entry: AuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    at: new Date().toISOString(),
    actorId,
    actorName,
    action,
    targetId,
    meta
  };
  
  auditEntries.push(entry);
  saveAuditToStorage(auditEntries);
};

// Get audit entries with optional filters
export const getAuditEntries = (filters?: {
  targetId?: string;
  actorId?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
}): AuditEntry[] => {
  let filtered = [...auditEntries];
  
  if (filters?.targetId) {
    filtered = filtered.filter(entry => entry.targetId === filters.targetId);
  }
  
  if (filters?.actorId) {
    filtered = filtered.filter(entry => entry.actorId === filters.actorId);
  }
  
  if (filters?.action) {
    filtered = filtered.filter(entry => entry.action === filters.action);
  }
  
  if (filters?.fromDate) {
    filtered = filtered.filter(entry => entry.at >= filters.fromDate!);
  }
  
  if (filters?.toDate) {
    filtered = filtered.filter(entry => entry.at <= filters.toDate!);
  }
  
  return filtered.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
};

// Clear all audit entries (for testing/development)
export const clearAuditLog = (): void => {
  auditEntries = [];
  saveAuditToStorage([]);
};