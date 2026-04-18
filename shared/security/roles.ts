import { z } from "zod";

// All supported business roles
export type Role = "admin" | "manager" | "sales" | "support" | "customer" | "finance";

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

// Permission actions
export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  EXPORT: "export",
  MANAGE: "manage",
  ASSIGN: "assign",
  APPROVE: "approve",
  ESCALATE: "escalate"
} as const;

// CRM Resources
export const RESOURCES = {
  ACCOUNTS: "accounts",
  CONTACTS: "contacts",
  DEALS: "deals",
  TICKETS: "tickets",
  USERS: "users",
  TEAMS: "teams",
  REPORTS: "reports",
  SETTINGS: "settings",
  AUDIT_LOGS: "audit_logs",
  INVOICES: "invoices"
} as const;

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // Full access to everything
  admin: [
    {
      resource: "*",
      actions: [ACTIONS.MANAGE]
    }
  ],

  // Broad operational access; manages teams, approvals, and reports
  manager: [
    { resource: RESOURCES.ACCOUNTS,   actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT] },
    { resource: RESOURCES.CONTACTS,   actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT] },
    { resource: RESOURCES.DEALS,      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN, ACTIONS.APPROVE] },
    { resource: RESOURCES.TICKETS,    actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN, ACTIONS.ESCALATE] },
    { resource: RESOURCES.INVOICES,   actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.EXPORT] },
    { resource: RESOURCES.USERS,      actions: [ACTIONS.READ, ACTIONS.UPDATE], conditions: { teamScope: true } },
    { resource: RESOURCES.TEAMS,      actions: [ACTIONS.READ, ACTIONS.UPDATE], conditions: { ownTeam: true } },
    { resource: RESOURCES.REPORTS,    actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.AUDIT_LOGS, actions: [ACTIONS.READ], conditions: { teamScope: true } }
  ],

  // Handles deals, accounts, and contacts; no user management
  sales: [
    { resource: RESOURCES.ACCOUNTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.DEALS,    actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.ASSIGN] },
    { resource: RESOURCES.TICKETS,  actions: [ACTIONS.READ], conditions: { assignedOnly: true } },
    { resource: RESOURCES.INVOICES, actions: [ACTIONS.CREATE, ACTIONS.READ] },
    { resource: RESOURCES.REPORTS,  actions: [ACTIONS.READ], conditions: { ownDataOnly: true } },
    { resource: RESOURCES.USERS,    actions: [ACTIONS.READ], conditions: { selfOnly: true } }
  ],

  // Handles customer tickets and contact inquiries; read accounts/contacts
  support: [
    { resource: RESOURCES.ACCOUNTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.CONTACTS, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
    { resource: RESOURCES.TICKETS,  actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.ASSIGN, ACTIONS.ESCALATE] },
    { resource: RESOURCES.DEALS,    actions: [ACTIONS.READ], conditions: { assignedOnly: true } },
    { resource: RESOURCES.INVOICES, actions: [ACTIONS.READ] },
    { resource: RESOURCES.REPORTS,  actions: [ACTIONS.READ], conditions: { ownDataOnly: true } },
    { resource: RESOURCES.USERS,    actions: [ACTIONS.READ], conditions: { selfOnly: true } }
  ],

  // Read-only access limited to own data
  customer: [
    { resource: RESOURCES.ACCOUNTS, actions: [ACTIONS.READ], conditions: { selfOnly: true } },
    { resource: RESOURCES.TICKETS,  actions: [ACTIONS.CREATE, ACTIONS.READ], conditions: { selfOnly: true } },
    { resource: RESOURCES.INVOICES, actions: [ACTIONS.READ], conditions: { selfOnly: true } },
    { resource: RESOURCES.USERS,    actions: [ACTIONS.READ], conditions: { selfOnly: true } }
  ],

  // Full read access to financial data; can export reports
  finance: [
    { resource: RESOURCES.ACCOUNTS, actions: [ACTIONS.READ] },
    { resource: RESOURCES.DEALS,    actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.INVOICES, actions: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.EXPORT] },
    { resource: RESOURCES.REPORTS,  actions: [ACTIONS.READ, ACTIONS.EXPORT] },
    { resource: RESOURCES.USERS,    actions: [ACTIONS.READ], conditions: { selfOnly: true } }
  ]
};

// Field-level visibility per role
export const FIELD_VISIBILITY: Record<Role, Record<string, string[]>> = {
  admin: {
    accounts: ["*"],
    contacts: ["*"],
    deals:    ["*"],
    tickets:  ["*"],
    users:    ["*"],
    invoices: ["*"]
  },

  manager: {
    accounts: ["id", "legalName", "normalizedName", "industry", "sizeTier", "region", "ownerTeamId", "ownerId", "website", "phone", "email", "billingAddress", "shippingAddress", "revenue", "employees", "isActive", "createdAt", "updatedAt"],
    contacts: ["id", "accountId", "firstName", "lastName", "email", "phone", "position", "department", "isPrimary", "isActive", "createdAt", "updatedAt"],
    deals:    ["id", "accountId", "contactId", "title", "description", "value", "currency", "stage", "probability", "expectedCloseDate", "ownerId", "isActive", "createdAt", "updatedAt"],
    tickets:  ["id", "accountId", "contactId", "title", "description", "priority", "status", "category", "assignedTo", "createdBy", "resolvedAt", "createdAt", "updatedAt"],
    users:    ["id", "username", "email", "firstName", "lastName", "role", "teamId", "isActive", "phone", "lastLoginAt", "createdAt"],
    invoices: ["id", "accountId", "amount", "status", "dueDate", "paidDate", "createdAt"]
  },

  sales: {
    accounts: ["id", "legalName", "normalizedName", "industry", "sizeTier", "region", "website", "phone", "email", "isActive", "createdAt", "updatedAt"],
    contacts: ["id", "accountId", "firstName", "lastName", "email", "phone", "position", "department", "isPrimary", "isActive", "createdAt", "updatedAt"],
    deals:    ["id", "accountId", "contactId", "title", "description", "value", "currency", "stage", "probability", "expectedCloseDate", "ownerId", "isActive", "createdAt", "updatedAt"],
    tickets:  ["id", "title", "status", "priority", "assignedTo"],
    users:    ["id", "firstName", "lastName", "email", "phone", "role", "teamId"],
    invoices: ["id", "accountId", "amount", "status", "dueDate", "createdAt"]
  },

  support: {
    accounts: ["id", "legalName", "normalizedName", "website", "phone", "email", "isActive"],
    contacts: ["id", "accountId", "firstName", "lastName", "email", "phone", "position", "department", "isPrimary", "isActive"],
    deals:    ["id", "title", "stage", "ownerId"],
    tickets:  ["id", "accountId", "contactId", "title", "description", "priority", "status", "category", "assignedTo", "createdBy", "createdAt", "updatedAt"],
    users:    ["id", "firstName", "lastName", "email", "phone", "role", "teamId"],
    invoices: ["id", "accountId", "amount", "status", "dueDate"]
  },

  customer: {
    accounts: ["id", "legalName", "website", "phone", "email"],
    contacts: ["id", "firstName", "lastName", "email", "phone"],
    deals:    [],
    tickets:  ["id", "title", "description", "priority", "status", "createdAt", "updatedAt"],
    users:    ["id", "firstName", "lastName", "email"],
    invoices: ["id", "amount", "status", "dueDate", "paidDate"]
  },

  finance: {
    accounts: ["id", "legalName", "normalizedName", "industry", "sizeTier", "region", "revenue", "employees", "isActive"],
    contacts: ["id", "accountId", "firstName", "lastName", "email"],
    deals:    ["id", "accountId", "title", "value", "currency", "stage", "probability", "expectedCloseDate", "ownerId", "isActive", "createdAt"],
    tickets:  ["id", "title", "status"],
    users:    ["id", "firstName", "lastName", "email", "role"],
    invoices: ["*"]
  }
};

// Helper functions for permission checking
export function hasPermission(
  userRole: Role,
  resource: string,
  action: string,
  context?: Record<string, any>
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  // Check for wildcard admin permission
  const wildcardPerm = permissions.find(p => p.resource === "*");
  if (wildcardPerm && wildcardPerm.actions.includes(ACTIONS.MANAGE)) {
    return true;
  }

  // Check specific resource permissions
  const resourcePerm = permissions.find(p => p.resource === resource);
  if (!resourcePerm) return false;

  // Check if action is allowed
  if (!resourcePerm.actions.includes(action)) return false;

  // Check conditions if present
  if (resourcePerm.conditions && context) {
    return checkConditions(resourcePerm.conditions, context, userRole);
  }

  return true;
}

export function getVisibleFields(userRole: Role, entityType: string): string[] {
  const fields = FIELD_VISIBILITY[userRole]?.[entityType];
  return fields || [];
}

export function canViewField(userRole: Role, entityType: string, fieldName: string): boolean {
  const visibleFields = getVisibleFields(userRole, entityType);
  return visibleFields.includes("*") || visibleFields.includes(fieldName);
}

export function filterEntityFields<T extends Record<string, any>>(
  entity: T,
  userRole: Role,
  entityType: string
): Partial<T> {
  const visibleFields = getVisibleFields(userRole, entityType);

  if (visibleFields.includes("*")) {
    return entity;
  }

  const filtered: Partial<T> = {};
  for (const field of visibleFields) {
    if (field in entity) {
      filtered[field as keyof T] = entity[field];
    }
  }

  return filtered;
}

function checkConditions(
  conditions: Record<string, any>,
  context: Record<string, any>,
  userRole: Role
): boolean {
  if (conditions.assignedOnly) {
    return context.assignedTo === context.userId || context.ownerId === context.userId;
  }

  if (conditions.teamScope) {
    return context.teamId === context.userTeamId;
  }

  if (conditions.selfOnly) {
    return context.entityId === context.userId;
  }

  if (conditions.ownTeam) {
    return context.teamId === context.userTeamId;
  }

  if (conditions.ownDataOnly) {
    return context.ownerId === context.userId || context.createdBy === context.userId;
  }

  if (conditions.limitedScope) {
    return userRole === "customer" ? context.isPublicReport : true;
  }

  return true;
}

// Validation schemas
export const roleSchema = z.enum(["admin", "manager", "sales", "support", "customer", "finance"]);

export const permissionContextSchema = z.object({
  userId: z.string(),
  userRole: roleSchema,
  userTeamId: z.string().optional(),
  entityId: z.string().optional(),
  assignedTo: z.string().optional(),
  ownerId: z.string().optional(),
  createdBy: z.string().optional(),
  teamId: z.string().optional(),
  isPublicReport: z.boolean().optional()
});

export type PermissionContext = z.infer<typeof permissionContextSchema>;

// Convenience arrays for middleware use
export const ADMIN_ROLES: Role[] = ["admin"];
export const MANAGEMENT_ROLES: Role[] = ["admin", "manager"];
export const STAFF_ROLES: Role[] = ["admin", "manager", "sales", "support", "finance"];
export const ALL_ROLES: Role[] = ["admin", "manager", "sales", "support", "customer", "finance"];
