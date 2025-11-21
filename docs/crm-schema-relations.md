# CRM Database Schema Relations & Architecture

## Overview
The CRM system uses a PostgreSQL database with a dedicated `crm_core` schema to isolate CRM entities from the main application data. The schema is designed with enterprise-grade security, comprehensive audit trails, and optimized performance through strategic indexing.

## Core Entity Relationships

### 1. Organizational Hierarchy
```
Teams (crmTeams)
├── Users (crmUsers) [via teamId]
├── Accounts (crmAccounts) [via ownerTeamId]
└── Manager Assignment [via managerId -> crmUsers.id]
```

### 2. Account Management
```
Accounts (crmAccounts)
├── Contacts (crmContacts) [via accountId] 
├── Opportunities (crmOpportunities) [via accountId]
├── Tickets (crmTickets) [via accountId]
└── Owner Assignment [via ownerId -> crmUsers.id]
```

### 3. Sales Pipeline Flow
```
Leads (crmLeads)
├── Assignment [via assignedTo -> crmUsers.id]
├── Team Ownership [via teamId -> crmTeams.id]
└── Conversion Flow:
    ├── convertedAccountId -> crmAccounts.id
    ├── convertedContactId -> crmContacts.id  
    └── convertedOpportunityId -> crmOpportunities.id

Opportunities (crmOpportunities)
├── Account Relation [via accountId -> crmAccounts.id]
├── Primary Contact [via contactId -> crmContacts.id]
├── Owner Assignment [via ownerId -> crmUsers.id]
└── Team Assignment [via teamId -> crmTeams.id]
```

### 4. Support & Service
```
Tickets (crmTickets)
├── Customer Info:
│   ├── contactId -> crmContacts.id
│   └── accountId -> crmAccounts.id
└── Assignment:
    ├── assignedTo -> crmUsers.id (handler)
    ├── ownerId -> crmUsers.id (owner)
    └── teamId -> crmTeams.id
```

### 5. Activity Tracking (Polymorphic)
```
Activities (crmActivities)
├── Actor [via actorId -> crmUsers.id]
└── Polymorphic Relation [via againstType + againstId]:
    ├── "contact" -> crmContacts.id
    ├── "account" -> crmAccounts.id  
    ├── "opportunity" -> crmOpportunities.id
    ├── "lead" -> crmLeads.id
    └── "ticket" -> crmTickets.id
```

### 6. Audit & Compliance (Polymorphic)
```
AuditLogs (crmAuditLogs) 
├── Actor [via actorId -> crmUsers.id]
└── Entity Tracking [via entityType + entityId]:
    ├── "users" -> crmUsers.id
    ├── "accounts" -> crmAccounts.id
    ├── "contacts" -> crmContacts.id
    ├── "opportunities" -> crmOpportunities.id
    ├── "leads" -> crmLeads.id
    └── "tickets" -> crmTickets.id
```

## Performance Optimization Indexes

### Primary Query Patterns
1. **Status + Assignment Filtering**
   - `crm_leads_status_assignee_idx` (leadStatus, assignedTo)
   - `crm_tickets_status_assignee_idx` (status, assignedTo)

2. **Stage + Ownership Tracking**  
   - `crm_opportunities_stage_owner_idx` (stage, ownerId)
   - `crm_opportunities_forecast_stage_idx` (forecastCategory, stage)

3. **Team-Based Access Control**
   - `crm_users_team_active_idx` (teamId, isActive)
   - `crm_accounts_team_active_idx` (ownerTeamId, isActive)
   - `crm_leads_team_assignee_idx` (teamId, assignedTo)

4. **Entity Relationship Lookups**
   - `crm_contacts_account_active_idx` (accountId, isActive)
   - `crm_opportunities_account_owner_idx` (accountId, ownerId)
   - `crm_activities_against_type_id_idx` (againstType, againstId)

5. **Audit Trail Performance**
   - `crm_audit_logs_entity_type_id_idx` (entityType, entityId)
   - `crm_audit_logs_actor_action_idx` (actorId, action)
   - `crm_audit_logs_created_at_idx` (createdAt)

## Data Integrity Features

### 1. Hardened Constraints
- **NOT NULL enforcement** on critical fields (names, IDs, statuses)
- **Unique constraints** on business identifiers (emails, ticket numbers, SKUs)
- **Default values** for status fields and boolean flags
- **Automatic timestamps** with onUpdate triggers

### 2. Foreign Key Relationships
- **Cascading references** between core entities
- **Optional relationships** for flexibility (contactId in tickets)
- **Self-referencing** for hierarchical data (parentAccountId)

### 3. RBAC Integration
- **Role-based field visibility** through securityService
- **Permission-based route protection** via middleware
- **Team-scoped data access** through ownerTeamId fields

## Migration Strategy

### Command Sequence
```bash
# Generate and apply migrations
tsx server/db-migrate.ts

# Seed with coherent test data  
tsx server/db-seed.ts

# Or run individually:
npx drizzle-kit generate
npx drizzle-kit migrate  
npx drizzle-kit push
```

### Seed Data Features
- **Multi-language support** (Arabic business names and descriptions)
- **Realistic business scenarios** across different industries
- **Complete relationship chains** (teams → users → accounts → contacts → opportunities)
- **Active tickets and activities** for immediate UI demos
- **Sample audit trail** showing system usage patterns

## Usage Examples

### Finding Team Performance
```sql
SELECT t.name as team_name, 
       COUNT(o.id) as opportunities,
       SUM(o.expected_value) as pipeline_value
FROM crm_core.crm_teams t
LEFT JOIN crm_core.crm_opportunities o ON o.team_id = t.id
WHERE t.is_active = true
GROUP BY t.id, t.name;
```

### User Activity Dashboard
```sql
SELECT u.first_name, u.last_name,
       COUNT(a.id) as activities_today
FROM crm_core.crm_users u
LEFT JOIN crm_core.crm_activities a ON a.actor_id = u.id 
WHERE a.created_at >= CURRENT_DATE
GROUP BY u.id, u.first_name, u.last_name;
```

### Pipeline Health Check
```sql  
SELECT stage,
       COUNT(*) as deal_count,
       AVG(win_probability) as avg_probability,
       SUM(expected_value) as stage_value
FROM crm_core.crm_opportunities 
WHERE is_closed = false
GROUP BY stage
ORDER BY stage_value DESC;
```

This architecture provides a robust foundation for enterprise CRM operations with comprehensive audit trails, role-based security, and optimized performance for common business queries.