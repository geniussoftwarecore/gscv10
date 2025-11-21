import { db } from "../server/db";
import { auditLogs, users } from "../shared/schema";
import { eq, and, desc, asc, sql, count } from "drizzle-orm";
import { Request } from "express";

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  diff?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changed?: string[];
  };
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    source?: string;
    requestId?: string;
    sessionId?: string;
  };
  createdAt: Date;
}

export interface AuditLogFilters {
  actorId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AuditService {
  /**
   * Log an audit event
   */
  static async logEvent(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    options: {
      entityName?: string;
      before?: Record<string, any>;
      after?: Record<string, any>;
      metadata?: {
        userAgent?: string;
        ipAddress?: string;
        source?: string;
        requestId?: string;
        sessionId?: string;
      };
    } = {}
  ): Promise<void> {
    try {
      const { entityName, before, after, metadata } = options;
      
      // Calculate changed fields
      const changed = before && after ? this.getChangedFields(before, after) : undefined;
      
      const diff = before || after ? {
        before,
        after,
        changed
      } : undefined;

      await db.insert(auditLogs).values({
        actorId,
        action,
        entityType,
        entityId,
        diff: {
          before,
          after,
          changes: changed?.map(field => ({
            field,
            oldValue: before?.[field],
            newValue: after?.[field]
          }))
        },
        ip: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        metadata: {
          entityName,
          source: metadata?.source,
          requestId: metadata?.requestId,
          sessionId: metadata?.sessionId
        }
      });

    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error("Failed to log audit event:", error);
    }
  }

  /**
   * Log audit event from Express request context
   */
  static async logFromRequest(
    req: Request,
    action: string,
    entityType: string,
    entityId: string,
    options: {
      entityName?: string;
      before?: Record<string, any>;
      after?: Record<string, any>;
    } = {}
  ): Promise<void> {
    if (!req.user?.id) {
      console.warn("Cannot log audit event: no user in request");
      return;
    }

    const metadata = {
      userAgent: req.get("User-Agent"),
      ipAddress: req.ip || req.connection.remoteAddress,
      source: "web",
      requestId: req.get("X-Request-ID"),
      sessionId: req.sessionID
    };

    await this.logEvent(req.user.id, action, entityType, entityId, {
      ...options,
      metadata
    });
  }

  /**
   * Get audit logs with filtering and pagination
   */
  static async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const {
      actorId,
      entityType,
      entityId,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = filters;

    // Build where conditions
    const conditions = [];
    
    if (actorId) conditions.push(eq(auditLogs.actorId, actorId));
    if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
    if (entityId) conditions.push(eq(auditLogs.entityId, entityId));
    if (action) conditions.push(eq(auditLogs.action, action));
    
    // Date range filtering would need additional SQL operators
    // For now, keeping it simple

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(whereClause);

    // Get paginated results
    const offset = (page - 1) * limit;
    const logRows = await db
      .select({
        log: auditLogs,
        actorName: users.name
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.actorId, users.id))
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const logs: AuditLogEntry[] = logRows.map(row => ({
      id: row.log.id,
      actorId: row.log.actorId,
      action: row.log.action,
      entityType: row.log.entityType,
      entityId: row.log.entityId,
      entityName: row.actorName || row.log.metadata?.entityName,
      diff: row.log.diff,
      metadata: {
        userAgent: row.log.userAgent,
        ipAddress: row.log.ip,
        source: row.log.metadata?.source,
        requestId: row.log.metadata?.requestId,
        sessionId: row.log.metadata?.sessionId
      },
      createdAt: row.log.createdAt
    }));

    return {
      logs,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };
  }

  /**
   * Get audit logs for a specific entity
   */
  static async getEntityHistory(
    entityType: string,
    entityId: string,
    page = 1,
    limit = 20
  ): Promise<AuditLogResponse> {
    return this.getLogs({
      entityType,
      entityId,
      page,
      limit
    });
  }

  /**
   * Get recent activity for a user
   */
  static async getUserActivity(
    actorId: string,
    page = 1,
    limit = 20
  ): Promise<AuditLogResponse> {
    return this.getLogs({
      actorId,
      page,
      limit
    });
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats(entityType?: string, days = 30): Promise<{
    totalEvents: number;
    actionBreakdown: Record<string, number>;
    topActors: Array<{ actorId: string; count: number }>;
  }> {
    // This would require more complex SQL queries
    // For now, returning basic structure
    
    const conditions = [];
    if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(whereClause);

    return {
      totalEvents: totalCount,
      actionBreakdown: {}, // Would need GROUP BY queries
      topActors: [] // Would need GROUP BY and ORDER BY queries
    };
  }

  /**
   * Helper to determine changed fields between two objects
   */
  private static getChangedFields(
    before: Record<string, any>,
    after: Record<string, any>
  ): string[] {
    const changed: string[] = [];
    
    // Check all fields in both objects
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    
    for (const key of allKeys) {
      if (before[key] !== after[key]) {
        changed.push(key);
      }
    }
    
    return changed;
  }
}

// Middleware to automatically log certain actions
export function auditMiddleware(
  action: string,
  entityType: string,
  getEntityId: (req: Request) => string,
  getEntityName?: (req: Request) => string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(body: any) {
      // Log the audit event after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        AuditService.logFromRequest(req, action, entityType, getEntityId(req), {
          entityName: getEntityName?.(req),
          before: req.body?.before,
          after: req.body?.after || req.body
        }).catch(console.error);
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
}

import { Response, NextFunction } from "express";