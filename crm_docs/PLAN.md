# CRM System - Execution Plan & Architecture

## Phase A - Plan Complete

### Data Model Overview

#### Core Entities (schema: crm_core)
- **crm_contacts**: Customer contact records with email/phone validation
- **crm_accounts**: Company/organization records with deduplication 
- **crm_leads**: Incoming prospects with scoring and source tracking
- **crm_opportunities**: Sales pipeline deals with forecasting
- **crm_activities**: Timeline events (calls, meetings, tasks, notes)
- **crm_tickets**: Support cases with SLA tracking
- **crm_products**: Service/product catalog with pricing
- **crm_pricebook**: Multi-currency pricing rules
- **crm_quotes**: Sales quotations with approval workflow
- **crm_invoices**: Billing records
- **crm_subscriptions**: Recurring revenue tracking
- **crm_timeline**: Unified event stream
- **crm_auditlog**: Field-level change tracking
- **crm_tags**: Flexible categorization
- **crm_custom_fields**: Extensible field definitions
- **crm_users**: CRM user management
- **crm_teams**: Role-based access control
- **crm_workflows**: Automation rules engine

### API Design
- REST: `/crm/v1/{entity}` with full CRUD + search
- GraphQL: Typed schemas with pagination/filtering
- Idempotency: Required header for write operations
- Authentication: JWT with CRM-scoped permissions
- Rate limiting: 50 TPS sustained

### Automation Graph
1. Lead capture → scoring → assignment
2. Lead qualification → opportunity conversion
3. Pipeline stage progression → notifications
4. Quote generation → approval → delivery
5. Support ticket routing → SLA monitoring
6. Subscription renewal → payment processing

### RBAC Matrix
- **Admin**: Full CRM access, system configuration
- **Manager**: Team oversight, reporting, approvals
- **Sales Rep**: Own leads/deals, basic activities
- **Support**: Tickets, knowledge base, customer data
- **Marketing**: Campaigns, journeys, analytics

### Acceptance Criteria
- ✅ All entities have soft delete
- ✅ Email validation with MX check
- ✅ Phone normalization to E.164
- ✅ Deduplication on normalized fields
- ✅ Feature flags for all functionality
- ✅ RTL/i18n support in UI
- ✅ SLO compliance (300ms read, 600ms write)
- ✅ 85%+ test coverage
- ✅ Reversible migrations

### Global Guardrails Compliance
- ✅ All resources prefixed with `crm_`
- ✅ Isolated schema `crm_core`
- ✅ No foreign keys to non-CRM tables
- ✅ Feature flags: `crm_feature_*`
- ✅ Telemetry namespace: `crm.*`
- ✅ No global system modifications

## Implementation Status
- [ ] Phase B - Database schema & migrations
- [ ] Phase B - Core services & repositories  
- [ ] Phase B - REST API endpoints
- [ ] Phase B - GraphQL schema
- [ ] Phase B - Basic UI components
- [ ] Phase C - Unit tests
- [ ] Phase C - Integration tests
- [ ] Phase C - Acceptance tests
- [ ] Phase D - Documentation
- [ ] Phase D - Deployment artifacts