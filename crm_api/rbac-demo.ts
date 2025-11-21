import { Router, Request, Response } from "express";
import { requireAuth } from "../server/middleware/requireAuth";
import { CRM_PERMISSIONS, checkPermission } from "../server/middleware/requirePermission";
import { SecurityService } from "../crm_services/securityService";
import { AuditService } from "../crm_services/auditService";

const router = Router();

// Apply authentication to all CRM routes
router.use(requireAuth);

/**
 * Demo endpoint: Get CRM accounts with RBAC filtering
 * - Admins see all fields
 * - Managers see most fields except sensitive financial data  
 * - Agents see basic fields only
 * - Viewers see public fields only
 */
router.get("/accounts", CRM_PERMISSIONS.accounts.read, async (req: Request, res: Response) => {
  try {
    const userRole = req.user!.role as any;
    
    // Mock account data for demonstration
    const mockAccounts = [
      {
        id: "acc-001",
        legalName: "شركة التقنية المتقدمة",
        normalizedName: "advanced-tech-co",
        industry: "technology",
        sizeTier: "ent",
        region: "MENA",
        ownerTeamId: "team-001",
        ownerId: "user-001",
        taxId: "123456789",
        website: "https://advancedtech.com",
        phone: "+966-11-1234567",
        email: "info@advancedtech.com",
        billingAddress: {
          street: "شارع الملك فهد",
          city: "الرياض",
          state: "الرياض",
          country: "المملكة العربية السعودية",
          postalCode: "12345"
        },
        shippingAddress: {
          street: "شارع الملك فهد",
          city: "الرياض", 
          state: "الرياض",
          country: "المملكة العربية السعودية",
          postalCode: "12345"
        },
        annualRevenue: 5000000,
        numberOfEmployees: 150,
        parentAccountId: null,
        description: "شركة رائدة في مجال التكنولوجيا",
        isActive: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-08-25T22:00:00Z",
        deletedAt: null
      },
      {
        id: "acc-002", 
        legalName: "مؤسسة الخدمات الطبية",
        normalizedName: "medical-services-org",
        industry: "healthcare",
        sizeTier: "smb",
        region: "MENA",
        ownerTeamId: "team-002",
        ownerId: "user-002",
        taxId: "987654321",
        website: "https://medicalservices.com",
        phone: "+966-11-7654321",
        email: "contact@medicalservices.com",
        billingAddress: {
          street: "شارع العليا",
          city: "الرياض",
          state: "الرياض", 
          country: "المملكة العربية السعودية",
          postalCode: "54321"
        },
        shippingAddress: {
          street: "شارع العليا",
          city: "الرياض",
          state: "الرياض",
          country: "المملكة العربية السعودية", 
          postalCode: "54321"
        },
        annualRevenue: 1200000,
        numberOfEmployees: 45,
        parentAccountId: null,
        description: "مؤسسة متخصصة في الخدمات الطبية",
        isActive: true,
        createdAt: "2024-02-20T14:30:00Z",
        updatedAt: "2024-08-25T21:45:00Z",
        deletedAt: null
      }
    ];

    // Apply field-level filtering based on user role
    const filteredAccounts = SecurityService.filterEntitiesFields(
      mockAccounts,
      userRole,
      "accounts"
    );

    // Log the audit event
    await AuditService.logFromRequest(req, "read", "accounts", "list", {
      entityName: "Account List"
    });

    // Get field access policy for frontend
    const fieldPolicy = SecurityService.getFieldAccessPolicy(userRole, "accounts");

    res.json({
      success: true,
      data: filteredAccounts,
      meta: {
        userRole: userRole,
        visibleFields: SecurityService.getVisibleFields(userRole, "accounts"),
        fieldPolicy: fieldPolicy,
        message: `عرض ${filteredAccounts.length} حساب بالصلاحيات المتاحة للدور: ${userRole}`
      }
    });

  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في جلب بيانات الحسابات"
    });
  }
});

/**
 * Demo endpoint: Update account with audit logging
 */
router.put("/accounts/:id", CRM_PERMISSIONS.accounts.update, async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
    const userRole = req.user!.role as any;
    const updates = req.body;

    // Mock existing account data
    const existingAccount = {
      id: accountId,
      legalName: "شركة التقنية المتقدمة",
      normalizedName: "advanced-tech-co",
      industry: "technology",
      ownerId: "user-001",
      updatedAt: "2024-08-25T22:00:00Z"
    };

    // Filter fields based on user permissions
    const allowedUpdates = SecurityService.filterFields(updates, userRole, "accounts");
    
    // Mock updated account
    const updatedAccount = { ...existingAccount, ...allowedUpdates, updatedAt: new Date().toISOString() };

    // Log the audit event with before/after comparison
    await AuditService.logFromRequest(req, "update", "accounts", accountId, {
      entityName: existingAccount.legalName,
      before: existingAccount,
      after: updatedAccount
    });

    res.json({
      success: true,
      data: SecurityService.filterFields(updatedAccount, userRole, "accounts"),
      meta: {
        userRole: userRole,
        updatedFields: Object.keys(allowedUpdates),
        message: `تم تحديث الحساب بنجاح بالصلاحيات المتاحة للدور: ${userRole}`
      }
    });

  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في تحديث بيانات الحساب"
    });
  }
});

/**
 * Demo endpoint: Get audit logs (with permission check)
 */
router.get("/audit-logs", CRM_PERMISSIONS.auditLogs.read, async (req: Request, res: Response) => {
  try {
    const { entityType, entityId, page = 1, limit = 20 } = req.query;
    const userRole = req.user!.role as any;

    // Mock audit log data
    const mockAuditLogs = [
      {
        id: "audit-001",
        actorId: req.user!.id,
        action: "read",
        entityType: "accounts",
        entityId: "acc-001", 
        entityName: "شركة التقنية المتقدمة",
        diff: null,
        metadata: {
          userAgent: req.get("User-Agent"),
          ipAddress: req.ip,
          source: "web"
        },
        createdAt: new Date().toISOString(),
        actorName: "أحمد محمد"
      },
      {
        id: "audit-002",
        actorId: "user-002",
        action: "update",
        entityType: "accounts", 
        entityId: "acc-001",
        entityName: "شركة التقنية المتقدمة",
        diff: {
          before: { phone: "+966-11-1111111" },
          after: { phone: "+966-11-1234567" },
          changed: ["phone"]
        },
        metadata: {
          userAgent: "Mozilla/5.0...",
          ipAddress: "192.168.1.100",
          source: "web"
        },
        createdAt: "2024-08-25T21:30:00Z",
        actorName: "سارة أحمد"
      }
    ];

    // Filter audit logs based on user permissions
    let filteredLogs = mockAuditLogs;
    
    // Non-admin users can only see their team's audit logs
    if (userRole !== "admin") {
      filteredLogs = mockAuditLogs.filter(log => 
        log.actorId === req.user!.id || 
        (userRole === "manager" && log.entityType === entityType)
      );
    }

    // Apply entity filtering if requested
    if (entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === entityType);
    }
    if (entityId) {
      filteredLogs = filteredLogs.filter(log => log.entityId === entityId);
    }

    res.json({
      success: true,
      data: {
        logs: filteredLogs,
        total: filteredLogs.length,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(filteredLogs.length / parseInt(limit as string))
      },
      meta: {
        userRole: userRole,
        message: `عرض ${filteredLogs.length} سجل مراجعة بالصلاحيات المتاحة`
      }
    });

  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في جلب سجل المراجعة"
    });
  }
});

/**
 * Permission demonstration endpoint
 */
router.get("/permissions/demo", async (req: Request, res: Response) => {
  try {
    const userRole = req.user!.role as any;
    
    // Test various permissions
    const permissionTests = {
      canCreateAccounts: checkPermission(req, "accounts", "create"),
      canUpdateAccounts: checkPermission(req, "accounts", "update"),
      canDeleteAccounts: checkPermission(req, "accounts", "delete"),
      canExportData: checkPermission(req, "accounts", "export"),
      canManageUsers: checkPermission(req, "users", "update"),
      canViewAuditLogs: checkPermission(req, "audit_logs", "read")
    };

    // Get field visibility for different entities
    const fieldVisibility = {
      accounts: SecurityService.getFieldVisibilityMap(userRole, "accounts"),
      contacts: SecurityService.getFieldVisibilityMap(userRole, "contacts"),
      deals: SecurityService.getFieldVisibilityMap(userRole, "deals"),
      users: SecurityService.getFieldVisibilityMap(userRole, "users")
    };

    res.json({
      success: true,
      data: {
        userRole: userRole,
        permissions: permissionTests,
        fieldVisibility: fieldVisibility,
        explanation: {
          admin: "يمكن للمدير الوصول إلى جميع البيانات والحقول",
          manager: "يمكن للمدير المساعد الوصول إلى معظم البيانات عدا المعلومات المالية الحساسة",
          agent: "يمكن للموظف الوصول إلى البيانات المخصصة له فقط",
          viewer: "يمكن للمشاهد عرض البيانات الأساسية فقط"
        }
      }
    });

  } catch (error) {
    console.error("Error in permissions demo:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في عرض صلاحيات النظام"
    });
  }
});

export default router;