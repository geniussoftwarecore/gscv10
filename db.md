# CRM Database Documentation

This document describes the database schema and relationships for the comprehensive CRM system.

## Quick Start

### Migration and Seeding
```bash
# Generate migration files from schema
tsx scripts/migrate.ts

# Seed database with demo data
tsx scripts/seed.ts

# Reset database (drop all tables)
tsx scripts/reset.ts

# Add updated_at triggers
psql $DATABASE_URL -f scripts/add-triggers.sql
```

## Core Tables and Relationships

### Users and Authentication
- `users` - System users with role-based access (admin, manager, agent, viewer)

### CRM Core Entities

#### Companies (Accounts)
- `accounts` - Companies/organizations in the CRM
- **Relationships:**
  - `assigned_to` → `users.id` (account owner)
  - `parent_account_id` → `accounts.id` (parent company)

#### Contacts  
- `contacts` - Individual people within companies
- **Relationships:**
  - `account_id` → `accounts.id` (company)
  - `lead_id` → `leads.id` (source lead)

#### Sales Pipeline
- `deal_stages` - Configurable sales pipeline stages
- `opportunities` - Sales deals/opportunities
- **Relationships:**
  - `account_id` → `accounts.id` (company)
  - `contact_id` → `contacts.id` (primary contact)
  - `stage_id` → `deal_stages.id` (current stage)
  - `assigned_to` → `users.id` (deal owner)

#### Support System
- `ticket_status` - Configurable ticket statuses
- `support_tickets` - Customer support tickets
- **Relationships:**
  - `user_id` → `users.id` (ticket creator)
  - `status_id` → `ticket_status.id` (current status)
  - `assigned_to` → `users.id` (support agent)
  - `project_id` → `projects.id` (related project)

#### Activities and Tasks
- `tasks` - Action items and follow-ups
- `crm_activities` - Activity history and timeline
- **Relationships:**
  - `assigned_to` → `users.id` (task assignee)
  - `created_by` → `users.id` (task creator)
  - `related_to` + `related_id` - Polymorphic relationship to any entity

#### Lead Management
- `leads` - Potential customers before qualification
- **Relationships:**
  - `assigned_to` → `users.id` (lead owner)

### Audit and Compliance
- `audit_logs` - Complete audit trail for all CRM actions
- **Relationships:**
  - `actor_id` → `users.id` (user who performed action)
  - `entity_type` + `entity_id` - Polymorphic relationship to audited entity

### Configuration and Metadata
- `saved_filters` - User-saved search filters
- `client_requests` - Customer service requests
- **Relationships:**
  - `user_id` → `users.id` (filter owner)
  - `lead_id` → `leads.id` (related lead)
  - `service_id` → `services.id` (requested service)

## Performance Optimizations

### Composite Indexes
The schema includes strategic composite indexes for common query patterns:

- `accounts_type_assigned_idx` - Filter by account type and owner
- `opportunities_stage_owner_idx` - Filter deals by stage and owner  
- `tickets_status_assignee_idx` - Filter tickets by status and assignee
- `contacts_primary_account_idx` - Find primary contacts by account

### Single Column Indexes
- User roles, active status
- Account industry, company names
- Contact emails, activity status
- Deal stages, expected close dates
- Ticket priorities, categories

## Data Integrity

### NOT NULL Constraints
Critical fields have NOT NULL constraints:
- Entity names and identifiers
- Status fields (active/inactive states)
- Timestamps (created_at, updated_at)
- Required relationship fields

### Default Values
- Boolean flags default to appropriate values
- JSON fields default to empty objects/arrays
- Status fields default to initial states
- Timestamps auto-populate

### Updated At Triggers
Automatic `updated_at` timestamp maintenance via PostgreSQL triggers:
```sql
-- Example trigger (applied to all tables with updated_at)
CREATE TRIGGER update_accounts_updated_at 
    BEFORE UPDATE ON accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Role-Based Data Access

### Permission Levels
1. **Admin** - Full access to all data and audit logs
2. **Manager** - Access to assigned territories and audit reports  
3. **Agent** - Access to assigned accounts, contacts, deals
4. **Viewer** - Read-only access to permitted data

### Field-Level Security
The application layer implements field filtering based on user roles:
- Sensitive financial data restricted to admin/manager
- Personal contact details filtered for viewers
- Audit metadata only visible to admin/manager

## Demo Data

The seed script creates a complete demo environment:
- 4 users (one per role) 
- 6 deal stages (standard sales pipeline)
- 5 ticket statuses (support workflow)
- 4 companies across different industries
- 5 contacts with realistic relationships
- 4 opportunities in various stages
- Support tickets and activities

### Demo User Credentials
- **Admin:** admin@crm.com / admin123
- **Manager:** manager@crm.com / manager123  
- **Agent:** agent@crm.com / agent123
- **Viewer:** viewer@crm.com / viewer123

## Business Logic

### Opportunity Management
- Opportunities link to accounts and primary contacts
- Stage progression tracks probability and closure status
- Activities provide complete interaction history
- Tasks manage follow-up actions

### Support Workflow
- Tickets can be linked to projects for context
- Configurable statuses support custom workflows
- SLA tracking via creation and due dates
- Agent assignment and escalation paths

### Audit Compliance
- All CUD operations logged with full context
- Field-level change tracking with before/after values
- IP address and user agent capture
- Polymorphic design supports any entity type

This schema provides a robust foundation for a full-featured CRM system with enterprise-grade security, performance, and compliance capabilities.