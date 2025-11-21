import { z } from "zod";

// Core role definitions
export type Role = "admin" | "manager" | "agent" | "viewer";

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
  MANAGE: "manage", // Full control
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
  AUDIT_LOGS: "audit_logs"
} as const;

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    {
      resource: "*",
      actions: [ACTIONS.MANAGE] // Full access to everything
    }
  ],
  
  manager: [
    {
      resource: RESOURCES.ACCOUNTS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT]
    },
    {
      resource: RESOURCES.CONTACTS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.EXPORT]
    },
    {
      resource: RESOURCES.DEALS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN, ACTIONS.APPROVE]
    },
    {
      resource: RESOURCES.TICKETS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.ASSIGN, ACTIONS.ESCALATE]
    },
    {
      resource: RESOURCES.USERS,
      actions: [ACTIONS.READ, ACTIONS.UPDATE],
      conditions: { teamScope: true } // Only team members
    },
    {
      resource: RESOURCES.TEAMS,
      actions: [ACTIONS.READ, ACTIONS.UPDATE],
      conditions: { ownTeam: true } // Only own team
    },
    {
      resource: RESOURCES.REPORTS,
      actions: [ACTIONS.READ, ACTIONS.EXPORT]
    },
    {
      resource: RESOURCES.AUDIT_LOGS,
      actions: [ACTIONS.READ],
      conditions: { teamScope: true }
    }
  ],
  
  agent: [
    {
      resource: RESOURCES.ACCOUNTS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
      conditions: { assignedOnly: true } // Only assigned accounts
    },
    {
      resource: RESOURCES.CONTACTS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE]
    },
    {
      resource: RESOURCES.DEALS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
      conditions: { assignedOnly: true }
    },
    {
      resource: RESOURCES.TICKETS,
      actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
      conditions: { assignedOnly: true }
    },
    {
      resource: RESOURCES.USERS,
      actions: [ACTIONS.READ],
      conditions: { selfOnly: true } // Only own profile
    },
    {
      resource: RESOURCES.REPORTS,
      actions: [ACTIONS.READ],
      conditions: { ownDataOnly: true }
    }
  ],
  
  viewer: [
    {
      resource: RESOURCES.ACCOUNTS,
      actions: [ACTIONS.READ],
      conditions: { teamScope: true }
    },
    {
      resource: RESOURCES.CONTACTS, 
      actions: [ACTIONS.READ],
      conditions: { teamScope: true }
    },
    {
      resource: RESOURCES.DEALS,
      actions: [ACTIONS.READ],
      conditions: { teamScope: true }
    },
    {
      resource: RESOURCES.TICKETS,
      actions: [ACTIONS.READ],
      conditions: { teamScope: true }
    },
    {
      resource: RESOURCES.USERS,
      actions: [ACTIONS.READ],
      conditions: { selfOnly: true }
    },
    {
      resource: RESOURCES.REPORTS,
      actions: [ACTIONS.READ],
      conditions: { limitedScope: true }
    }
  ]
};

// Field-level visibility per role
export const FIELD_VISIBILITY: Record<Role, Record<string, string[]>> = {
  admin: {
    accounts: ["*"], // All fields
    contacts: ["*"],
    deals: ["*"],
    tickets: ["*"],
    users: ["*"]
  },
  
  manager: {
    accounts: [
      "id", "legalName", "normalizedName", "industry", "sizeTier", "region",
      "ownerTeamId", "ownerId", "website", "phone", "email", "billingAddress", 
      "shippingAddress", "revenue", "employees", "isActive", "createdAt", "updatedAt"
    ],
    contacts: [
      "id", "accountId", "firstName", "lastName", "email", "phone", "position",
      "department", "isPrimary", "isActive", "createdAt", "updatedAt"
    ],
    deals: [
      "id", "accountId", "contactId", "title", "description", "value", "currency",
      "stage", "probability", "expectedCloseDate", "ownerId", "isActive", "createdAt", "updatedAt"
    ],
    tickets: [
      "id", "accountId", "contactId", "title", "description", "priority", "status",
      "category", "assignedTo", "createdBy", "resolvedAt", "createdAt", "updatedAt"
    ],
    users: [
      "id", "username", "email", "firstName", "lastName", "role", "teamId", 
      "isActive", "phone", "lastLoginAt", "createdAt"
      // Hide: password-related fields
    ]
  },
  
  agent: {
    accounts: [
      "id", "legalName", "normalizedName", "industry", "sizeTier", "region",
      "website", "phone", "email", "isActive", "createdAt", "updatedAt"
      // Hide: revenue, financial data
    ],
    contacts: [
      "id", "accountId", "firstName", "lastName", "email", "phone", "position",
      "department", "isPrimary", "isActive", "createdAt", "updatedAt"
    ],
    deals: [
      "id", "accountId", "contactId", "title", "description", "value", "currency",
      "stage", "probability", "expectedCloseDate", "ownerId", "isActive", "createdAt", "updatedAt"
    ],
    tickets: [
      "id", "accountId", "contactId", "title", "description", "priority", "status",
      "category", "assignedTo", "createdBy", "createdAt", "updatedAt"
      // Hide: internal notes, resolution details unless assigned
    ],
    users: [
      "id", "firstName", "lastName", "email", "phone", "role", "teamId"
      // Hide: sensitive user data
    ]
  },
  
  viewer: {
    accounts: [
      "id", "legalName", "normalizedName", "industry", "sizeTier", "region",
      "website", "phone", "email", "isActive"
      // Hide: financial data, internal notes
    ],
    contacts: [
      "id", "accountId", "firstName", "lastName", "email", "phone", "position",
      "department", "isPrimary", "isActive"
    ],
    deals: [
      "id", "accountId", "contactId", "title", "stage", "ownerId", "isActive"
      // Hide: financial details, probability
    ],
    tickets: [
      "id", "accountId", "contactId", "title", "priority", "status", "category", "assignedTo"
      // Hide: internal details, descriptions
    ],
    users: [
      "id", "firstName", "lastName", "role", "teamId"
      // Minimal user info only
    ]
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
  // Implementation for checking various conditions
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
    // Viewer has limited report access
    return userRole === "viewer" ? context.isPublicReport : true;
  }
  
  return true;
}

// Validation schemas
export const roleSchema = z.enum(["admin", "manager", "agent", "viewer"]);

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