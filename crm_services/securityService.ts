import { filterEntityFields, getVisibleFields, canViewField, type Role } from "@shared/security/roles";

/**
 * Security wrapper service for applying field-level visibility and permissions
 */
export class SecurityService {
  /**
   * Filters entity fields based on user role and entity type
   */
  static filterFields<T extends Record<string, any>>(
    entity: T,
    userRole: Role,
    entityType: string
  ): Partial<T> {
    return filterEntityFields(entity, userRole, entityType);
  }

  /**
   * Filters an array of entities
   */
  static filterEntitiesFields<T extends Record<string, any>>(
    entities: T[],
    userRole: Role,
    entityType: string
  ): Partial<T>[] {
    return entities.map(entity => this.filterFields(entity, userRole, entityType));
  }

  /**
   * Gets list of visible fields for a role and entity type
   */
  static getVisibleFields(userRole: Role, entityType: string): string[] {
    return getVisibleFields(userRole, entityType);
  }

  /**
   * Checks if a specific field is visible to the role
   */
  static canViewField(userRole: Role, entityType: string, fieldName: string): boolean {
    return canViewField(userRole, entityType, fieldName);
  }

  /**
   * Creates field visibility metadata for UI components
   */
  static getFieldVisibilityMap(userRole: Role, entityType: string): Record<string, boolean> {
    const visibleFields = getVisibleFields(userRole, entityType);
    const fieldMap: Record<string, boolean> = {};

    // Define all possible fields for each entity type
    const allFields = this.getAllFieldsForEntityType(entityType);
    
    for (const field of allFields) {
      fieldMap[field] = visibleFields.includes("*") || visibleFields.includes(field);
    }

    return fieldMap;
  }

  /**
   * Returns all possible fields for an entity type
   */
  private static getAllFieldsForEntityType(entityType: string): string[] {
    const fieldMaps: Record<string, string[]> = {
      accounts: [
        "id", "legalName", "normalizedName", "industry", "sizeTier", "region",
        "ownerTeamId", "ownerId", "taxId", "website", "phone", "email", 
        "billingAddress", "shippingAddress", "annualRevenue", "numberOfEmployees",
        "parentAccountId", "description", "isActive", "createdAt", "updatedAt", "deletedAt"
      ],
      contacts: [
        "id", "firstName", "lastName", "primaryEmail", "mxValidated", "phones",
        "channels", "optInStatus", "optInSource", "utm", "accountId", "jobTitle",
        "department", "isPrimary", "socialProfiles", "preferences", "isActive",
        "createdAt", "updatedAt", "deletedAt"
      ],
      deals: [
        "id", "accountId", "primaryContactId", "title", "description", "value",
        "currency", "stage", "probability", "expectedCloseDate", "actualCloseDate",
        "lostReason", "ownerId", "createdBy", "source", "isActive", "createdAt", "updatedAt"
      ],
      tickets: [
        "id", "accountId", "contactId", "title", "description", "priority", "status",
        "category", "subcategory", "assignedTo", "createdBy", "escalatedAt", "resolvedAt",
        "closedAt", "sla", "isActive", "createdAt", "updatedAt"
      ],
      users: [
        "id", "username", "email", "firstName", "lastName", "role", "teamId",
        "isActive", "avatar", "phone", "lastLoginAt", "createdAt", "updatedAt", "deletedAt"
      ]
    };

    return fieldMaps[entityType] || [];
  }

  /**
   * Creates a field access policy for frontend form components
   */
  static getFieldAccessPolicy(userRole: Role, entityType: string) {
    const visibilityMap = this.getFieldVisibilityMap(userRole, entityType);
    const policy = {
      visible: {} as Record<string, boolean>,
      editable: {} as Record<string, boolean>,
      required: {} as Record<string, boolean>
    };

    // Base visibility
    policy.visible = visibilityMap;

    // Editability rules based on role
    for (const field in visibilityMap) {
      if (!visibilityMap[field]) {
        policy.editable[field] = false;
        continue;
      }

      // Apply role-specific edit restrictions
      policy.editable[field] = this.canEditField(userRole, entityType, field);
    }

    // Required field validation (role-independent for now)
    policy.required = this.getRequiredFields(entityType);

    return policy;
  }

  /**
   * Determines if a field can be edited by a role
   */
  private static canEditField(userRole: Role, entityType: string, fieldName: string): boolean {
    // Admin can edit everything they can see
    if (userRole === "admin") return true;

    // Restricted fields that only admins can edit
    const adminOnlyFields = ["id", "createdAt", "updatedAt", "deletedAt"];
    if (adminOnlyFields.includes(fieldName)) return false;

    // Manager restrictions
    if (userRole === "manager") {
      const managerRestrictedFields = ["ownerId", "teamId"]; // Can't reassign ownership without proper checks
      return !managerRestrictedFields.includes(fieldName);
    }

    // Agent restrictions
    if (userRole === "agent") {
      const agentRestrictedFields = [
        "ownerId", "teamId", "annualRevenue", "numberOfEmployees", // Financial/sensitive data
        "role", "isActive" // User management fields
      ];
      return !agentRestrictedFields.includes(fieldName);
    }

    // Viewer can't edit anything
    if (userRole === "viewer") return false;

    return true;
  }

  /**
   * Gets required fields for entity validation
   */
  private static getRequiredFields(entityType: string): Record<string, boolean> {
    const requiredFieldMaps: Record<string, Record<string, boolean>> = {
      accounts: {
        legalName: true,
        normalizedName: true
      },
      contacts: {
        firstName: true,
        lastName: true,
        accountId: true
      },
      deals: {
        title: true,
        accountId: true,
        value: true,
        stage: true,
        ownerId: true
      },
      tickets: {
        title: true,
        description: true,
        priority: true,
        status: true,
        createdBy: true
      },
      users: {
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    };

    return requiredFieldMaps[entityType] || {};
  }
}