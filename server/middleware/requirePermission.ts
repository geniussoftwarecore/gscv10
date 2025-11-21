import { Request, Response, NextFunction } from "express";
import { hasPermission, RESOURCES, ACTIONS, type Role, type PermissionContext } from "@shared/security/roles";

// Extend Express Request type to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        teamId?: string;
        username: string;
        email: string;
      };
    }
  }
}

export interface RequirePermissionOptions {
  resource: string;
  action: string;
  getContext?: (req: Request) => Record<string, any>;
}

/**
 * Authorization middleware that checks if user has permission for specific resource/action
 */
export function requirePermission(options: RequirePermissionOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "UNAUTHORIZED" 
      });
    }

    const { resource, action, getContext } = options;
    
    // Build permission context
    const baseContext: PermissionContext = {
      userId: req.user.id,
      userRole: req.user.role,
      userTeamId: req.user.teamId
    };

    // Add route-specific context if provided
    const additionalContext = getContext ? getContext(req) : {};
    const context = { ...baseContext, ...additionalContext };

    // Check permission
    const allowed = hasPermission(req.user.role, resource, action, context);
    
    if (!allowed) {
      return res.status(403).json({
        error: `Insufficient permissions. Required: ${action} on ${resource}`,
        code: "FORBIDDEN",
        details: {
          userRole: req.user.role,
          requiredPermission: { resource, action }
        }
      });
    }

    // Add context to request for use in route handlers
    req.permissionContext = context;
    
    next();
  };
}

/**
 * Middleware factory for common CRM resource permissions
 */
export const CRM_PERMISSIONS = {
  // Account permissions
  accounts: {
    read: requirePermission({
      resource: RESOURCES.ACCOUNTS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        teamId: req.query.teamId as string,
        ownerId: req.query.ownerId as string
      })
    }),
    
    create: requirePermission({
      resource: RESOURCES.ACCOUNTS,
      action: ACTIONS.CREATE
    }),
    
    update: requirePermission({
      resource: RESOURCES.ACCOUNTS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        entityId: req.params.id,
        ownerId: req.body.ownerId || req.query.ownerId as string,
        teamId: req.body.ownerTeamId || req.query.teamId as string
      })
    }),
    
    delete: requirePermission({
      resource: RESOURCES.ACCOUNTS,
      action: ACTIONS.DELETE,
      getContext: (req) => ({
        entityId: req.params.id,
        ownerId: req.body.ownerId || req.query.ownerId as string
      })
    }),
    
    export: requirePermission({
      resource: RESOURCES.ACCOUNTS,
      action: ACTIONS.EXPORT
    })
  },

  // Contact permissions
  contacts: {
    read: requirePermission({
      resource: RESOURCES.CONTACTS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        accountId: req.query.accountId as string,
        teamId: req.query.teamId as string
      })
    }),
    
    create: requirePermission({
      resource: RESOURCES.CONTACTS,
      action: ACTIONS.CREATE
    }),
    
    update: requirePermission({
      resource: RESOURCES.CONTACTS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        entityId: req.params.id,
        accountId: req.body.accountId || req.query.accountId as string
      })
    }),
    
    delete: requirePermission({
      resource: RESOURCES.CONTACTS,
      action: ACTIONS.DELETE,
      getContext: (req) => ({
        entityId: req.params.id
      })
    })
  },

  // Deal permissions
  deals: {
    read: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        ownerId: req.query.ownerId as string,
        teamId: req.query.teamId as string,
        assignedTo: req.query.assignedTo as string
      })
    }),
    
    create: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.CREATE
    }),
    
    update: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        entityId: req.params.id,
        ownerId: req.body.ownerId || req.query.ownerId as string,
        assignedTo: req.body.assignedTo || req.query.assignedTo as string
      })
    }),
    
    delete: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.DELETE,
      getContext: (req) => ({
        entityId: req.params.id,
        ownerId: req.body.ownerId || req.query.ownerId as string
      })
    }),

    assign: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.ASSIGN,
      getContext: (req) => ({
        entityId: req.params.id,
        ownerId: req.body.ownerId as string
      })
    }),

    approve: requirePermission({
      resource: RESOURCES.DEALS,
      action: ACTIONS.APPROVE,
      getContext: (req) => ({
        entityId: req.params.id
      })
    })
  },

  // Ticket permissions
  tickets: {
    read: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        assignedTo: req.query.assignedTo as string,
        createdBy: req.query.createdBy as string,
        teamId: req.query.teamId as string
      })
    }),
    
    create: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.CREATE
    }),
    
    update: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        entityId: req.params.id,
        assignedTo: req.body.assignedTo || req.query.assignedTo as string,
        createdBy: req.body.createdBy || req.query.createdBy as string
      })
    }),
    
    delete: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.DELETE,
      getContext: (req) => ({
        entityId: req.params.id,
        assignedTo: req.body.assignedTo as string
      })
    }),

    assign: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.ASSIGN
    }),

    escalate: requirePermission({
      resource: RESOURCES.TICKETS,
      action: ACTIONS.ESCALATE,
      getContext: (req) => ({
        entityId: req.params.id
      })
    })
  },

  // User management permissions
  users: {
    read: requirePermission({
      resource: RESOURCES.USERS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        entityId: req.params.id,
        teamId: req.query.teamId as string
      })
    }),
    
    update: requirePermission({
      resource: RESOURCES.USERS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        entityId: req.params.id,
        teamId: req.body.teamId || req.query.teamId as string
      })
    }),
    
    delete: requirePermission({
      resource: RESOURCES.USERS,
      action: ACTIONS.DELETE,
      getContext: (req) => ({
        entityId: req.params.id
      })
    })
  },

  // Team permissions
  teams: {
    read: requirePermission({
      resource: RESOURCES.TEAMS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        teamId: req.params.id
      })
    }),
    
    update: requirePermission({
      resource: RESOURCES.TEAMS,
      action: ACTIONS.UPDATE,
      getContext: (req) => ({
        teamId: req.params.id
      })
    })
  },

  // Report permissions
  reports: {
    read: requirePermission({
      resource: RESOURCES.REPORTS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        ownerId: req.query.ownerId as string,
        isPublicReport: req.query.public === "true"
      })
    }),
    
    export: requirePermission({
      resource: RESOURCES.REPORTS,
      action: ACTIONS.EXPORT
    })
  },

  // Audit log permissions
  auditLogs: {
    read: requirePermission({
      resource: RESOURCES.AUDIT_LOGS,
      action: ACTIONS.READ,
      getContext: (req) => ({
        teamId: req.query.teamId as string,
        entityId: req.query.entityId as string
      })
    })
  }
};

/**
 * Utility to check permissions programmatically within route handlers
 */
export function checkPermission(
  req: Request,
  resource: string,
  action: string,
  additionalContext?: Record<string, any>
): boolean {
  if (!req.user) return false;

  const context: PermissionContext = {
    userId: req.user.id,
    userRole: req.user.role,
    userTeamId: req.user.teamId,
    ...additionalContext
  };

  return hasPermission(req.user.role, resource, action, context);
}

// Add permission context to Express Request type
declare global {
  namespace Express {
    interface Request {
      permissionContext?: PermissionContext;
    }
  }
}