-- Performance and security indexes for GSC CRM
-- These indexes support common query patterns and improve performance

-- Users table indexes (already exist in schema)
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_active_idx" ON "users"("is_active");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- Support tickets composite indexes for common queries
CREATE INDEX IF NOT EXISTS "tickets_status_assignee_idx" ON "support_tickets"("status", "assigned_to");
CREATE INDEX IF NOT EXISTS "tickets_priority_idx" ON "support_tickets"("priority");
CREATE INDEX IF NOT EXISTS "tickets_category_idx" ON "support_tickets"("category");
CREATE INDEX IF NOT EXISTS "tickets_user_idx" ON "support_tickets"("user_id");

-- Accounts table indexes for CRM operations
CREATE INDEX IF NOT EXISTS "accounts_type_assigned_idx" ON "accounts"("type", "assigned_to");
CREATE INDEX IF NOT EXISTS "accounts_active_idx" ON "accounts"("is_active");
CREATE INDEX IF NOT EXISTS "accounts_industry_idx" ON "accounts"("industry");
CREATE INDEX IF NOT EXISTS "accounts_name_idx" ON "accounts"("name");

-- Contacts table indexes
CREATE INDEX IF NOT EXISTS "contacts_account_idx" ON "contacts"("account_id");
CREATE INDEX IF NOT EXISTS "contacts_active_idx" ON "contacts"("is_active");
CREATE INDEX IF NOT EXISTS "contacts_email_idx" ON "contacts"("email");
CREATE INDEX IF NOT EXISTS "contacts_primary_account_idx" ON "contacts"("is_primary", "account_id");

-- Opportunities table indexes for pipeline queries
CREATE INDEX IF NOT EXISTS "opportunities_stage_owner_idx" ON "opportunities"("stage", "assigned_to");
CREATE INDEX IF NOT EXISTS "opportunities_account_idx" ON "opportunities"("account_id");
CREATE INDEX IF NOT EXISTS "opportunities_close_date_idx" ON "opportunities"("expected_close_date");
CREATE INDEX IF NOT EXISTS "opportunities_stage_idx" ON "opportunities"("stage");

-- Common timestamp queries
CREATE INDEX IF NOT EXISTS "support_tickets_updated_at_idx" ON "support_tickets"("updated_at");
CREATE INDEX IF NOT EXISTS "accounts_updated_at_idx" ON "accounts"("updated_at");
CREATE INDEX IF NOT EXISTS "contacts_updated_at_idx" ON "contacts"("updated_at");
CREATE INDEX IF NOT EXISTS "opportunities_updated_at_idx" ON "opportunities"("updated_at");

-- Leads table indexes
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads"("status");
CREATE INDEX IF NOT EXISTS "leads_assigned_to_idx" ON "leads"("assigned_to");
CREATE INDEX IF NOT EXISTS "leads_source_idx" ON "leads"("lead_source");
CREATE INDEX IF NOT EXISTS "leads_rating_idx" ON "leads"("rating");

-- Activities and timeline queries
CREATE INDEX IF NOT EXISTS "crm_activities_type_idx" ON "crm_activities"("type");
CREATE INDEX IF NOT EXISTS "crm_activities_user_idx" ON "crm_activities"("user_id");
CREATE INDEX IF NOT EXISTS "crm_activities_related_idx" ON "crm_activities"("related_to", "related_id");
CREATE INDEX IF NOT EXISTS "crm_activities_created_at_idx" ON "crm_activities"("created_at");

-- Tasks indexes
CREATE INDEX IF NOT EXISTS "tasks_assigned_to_idx" ON "tasks"("assigned_to");
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks"("status");
CREATE INDEX IF NOT EXISTS "tasks_priority_idx" ON "tasks"("priority");
CREATE INDEX IF NOT EXISTS "tasks_due_date_idx" ON "tasks"("due_date");

-- Notifications for real-time queries
CREATE INDEX IF NOT EXISTS "notifications_user_read_idx" ON "notifications"("user_id", "read");
CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications"("created_at");

-- Service requests
CREATE INDEX IF NOT EXISTS "service_requests_status_idx" ON "service_requests"("status");
CREATE INDEX IF NOT EXISTS "service_requests_priority_idx" ON "service_requests"("priority");

-- Projects
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "projects_user_idx" ON "projects"("user_id");

-- Client requests
CREATE INDEX IF NOT EXISTS "client_requests_status_idx" ON "client_requests"("status");
CREATE INDEX IF NOT EXISTS "client_requests_user_idx" ON "client_requests"("user_id");