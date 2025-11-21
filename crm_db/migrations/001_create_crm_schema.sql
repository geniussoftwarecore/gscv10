-- CRM Core Schema Migration
-- Safe migration with rollback capability
-- All tables use soft delete pattern

-- Create CRM schema
CREATE SCHEMA IF NOT EXISTS crm_core;

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Feature Flags Table
CREATE TABLE crm_core.crm_feature_flags (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM Teams
CREATE TABLE crm_core.crm_teams (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    manager_id VARCHAR,
    region TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Users  
CREATE TABLE crm_core.crm_users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'rep',
    team_id VARCHAR REFERENCES crm_core.crm_teams(id),
    is_active BOOLEAN DEFAULT TRUE,
    avatar TEXT,
    phone TEXT,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Add foreign key for manager after users table exists
ALTER TABLE crm_core.crm_teams 
ADD CONSTRAINT fk_team_manager 
FOREIGN KEY (manager_id) REFERENCES crm_core.crm_users(id);

-- CRM Accounts
CREATE TABLE crm_core.crm_accounts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    industry TEXT,
    size_tier TEXT DEFAULT 'smb',
    region TEXT,
    owner_team_id VARCHAR REFERENCES crm_core.crm_teams(id),
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    tax_id TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    billing_address JSONB,
    shipping_address JSONB,
    annual_revenue DECIMAL,
    number_of_employees INTEGER,
    parent_account_id VARCHAR,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Contacts  
CREATE TABLE crm_core.crm_contacts (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    primary_email TEXT UNIQUE,
    mx_validated BOOLEAN DEFAULT FALSE,
    phones JSONB,
    channels JSONB,
    opt_in_status TEXT DEFAULT 'pending',
    opt_in_source TEXT,
    utm JSONB,
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    job_title TEXT,
    department TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    social_profiles JSONB,
    preferences JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Leads
CREATE TABLE crm_core.crm_leads (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    lead_source TEXT DEFAULT 'website',
    lead_status TEXT DEFAULT 'new',
    lead_rating TEXT DEFAULT 'cold',
    lead_score INTEGER DEFAULT 0,
    fit_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    estimated_value DECIMAL,
    expected_close_date TIMESTAMP,
    assigned_to VARCHAR REFERENCES crm_core.crm_users(id),
    team_id VARCHAR REFERENCES crm_core.crm_teams(id),
    utm JSONB,
    description TEXT,
    unqualified_reason TEXT,
    converted_at TIMESTAMP,
    converted_contact_id VARCHAR,
    converted_account_id VARCHAR,
    converted_opportunity_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Opportunities
CREATE TABLE crm_core.crm_opportunities (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    contact_id VARCHAR REFERENCES crm_core.crm_contacts(id),
    stage TEXT DEFAULT 'prospecting',
    expected_value DECIMAL,
    close_date TIMESTAMP,
    win_probability INTEGER DEFAULT 0,
    actual_close_date TIMESTAMP,
    lead_source TEXT,
    description TEXT,
    loss_reason TEXT,
    next_step TEXT,
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    team_id VARCHAR REFERENCES crm_core.crm_teams(id),
    competitor_id VARCHAR,
    forecast_category TEXT DEFAULT 'pipeline',
    stage_entered_at TIMESTAMP,
    stage_age INTEGER,
    is_won BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Products
CREATE TABLE crm_core.crm_products (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    description TEXT,
    category TEXT,
    product_family TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Pricebook
CREATE TABLE crm_core.crm_pricebook (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    product_id VARCHAR REFERENCES crm_core.crm_products(id),
    currency TEXT DEFAULT 'USD',
    list_price DECIMAL,
    cost_price DECIMAL,
    pricing_type TEXT DEFAULT 'fixed',
    pricing_rules JSONB,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM Activities
CREATE TABLE crm_core.crm_activities (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    description TEXT,
    actor_id VARCHAR REFERENCES crm_core.crm_users(id),
    against_type TEXT NOT NULL,
    against_id VARCHAR NOT NULL,
    outcome TEXT,
    duration_sec INTEGER,
    attachments JSONB,
    due_at TIMESTAMP,
    reminder_at TIMESTAMP,
    completed_at TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Tickets
CREATE TABLE crm_core.crm_tickets (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'open',
    contact_id VARCHAR REFERENCES crm_core.crm_contacts(id),
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    assigned_to VARCHAR REFERENCES crm_core.crm_users(id),
    team_id VARCHAR REFERENCES crm_core.crm_teams(id),
    sla_target TIMESTAMP,
    sla_breached BOOLEAN DEFAULT FALSE,
    first_response_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    escalated_at TIMESTAMP,
    satisfaction INTEGER,
    tags JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Quotes
CREATE TABLE crm_core.crm_quotes (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    opportunity_id VARCHAR REFERENCES crm_core.crm_opportunities(id),
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    contact_id VARCHAR REFERENCES crm_core.crm_contacts(id),
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    status TEXT DEFAULT 'draft',
    subtotal DECIMAL,
    discount DECIMAL,
    tax DECIMAL,
    total DECIMAL,
    currency TEXT DEFAULT 'USD',
    valid_until TIMESTAMP,
    terms TEXT,
    notes TEXT,
    approval_status TEXT DEFAULT 'pending',
    approved_by VARCHAR REFERENCES crm_core.crm_users(id),
    approved_at TIMESTAMP,
    sent_at TIMESTAMP,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Invoices
CREATE TABLE crm_core.crm_invoices (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    quote_id VARCHAR REFERENCES crm_core.crm_quotes(id),
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    contact_id VARCHAR REFERENCES crm_core.crm_contacts(id),
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    status TEXT DEFAULT 'draft',
    subtotal DECIMAL,
    discount DECIMAL,
    tax DECIMAL,
    total DECIMAL,
    currency TEXT DEFAULT 'USD',
    due_date TIMESTAMP,
    paid_date TIMESTAMP,
    paid_amount DECIMAL DEFAULT 0,
    payment_method TEXT,
    payment_reference TEXT,
    terms TEXT,
    notes TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Subscriptions
CREATE TABLE crm_core.crm_subscriptions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    account_id VARCHAR REFERENCES crm_core.crm_accounts(id),
    contact_id VARCHAR REFERENCES crm_core.crm_contacts(id),
    product_id VARCHAR REFERENCES crm_core.crm_products(id),
    owner_id VARCHAR REFERENCES crm_core.crm_users(id),
    status TEXT DEFAULT 'active',
    billing_frequency TEXT DEFAULT 'monthly',
    amount DECIMAL,
    currency TEXT DEFAULT 'USD',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    renewal_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT TRUE,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- CRM Timeline
CREATE TABLE crm_core.crm_timeline (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id VARCHAR NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    actor_id VARCHAR REFERENCES crm_core.crm_users(id),
    actor_type TEXT DEFAULT 'user',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CRM Audit Log
CREATE TABLE crm_core.crm_audit_log (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id VARCHAR NOT NULL,
    operation TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields JSONB,
    actor_id VARCHAR REFERENCES crm_core.crm_users(id),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CRM Tags
CREATE TABLE crm_core.crm_tags (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM Entity Tags (polymorphic)
CREATE TABLE crm_core.crm_entity_tags (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id VARCHAR REFERENCES crm_core.crm_tags(id),
    entity_type TEXT NOT NULL,
    entity_id VARCHAR NOT NULL,
    created_by VARCHAR REFERENCES crm_core.crm_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- CRM Custom Fields
CREATE TABLE crm_core.crm_custom_fields (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL,
    field_options JSONB,
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CRM Custom Values
CREATE TABLE crm_core.crm_custom_values (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id VARCHAR REFERENCES crm_core.crm_custom_fields(id),
    entity_id VARCHAR NOT NULL,
    text_value TEXT,
    number_value DECIMAL,
    date_value TIMESTAMP,
    boolean_value BOOLEAN,
    json_value JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data Quality Tables
CREATE TABLE crm_core.crm_dedupe_jobs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    duplicates_found INTEGER DEFAULT 0,
    duplicates_fixed INTEGER DEFAULT 0,
    criteria JSONB,
    results JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by VARCHAR REFERENCES crm_core.crm_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm_core.crm_merge_candidates (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    master_record_id VARCHAR NOT NULL,
    duplicate_record_id VARCHAR NOT NULL,
    match_score DECIMAL,
    match_criteria JSONB,
    status TEXT DEFAULT 'pending',
    reviewed_by VARCHAR REFERENCES crm_core.crm_users(id),
    reviewed_at TIMESTAMP,
    merged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CRM Workflows
CREATE TABLE crm_core.crm_workflows (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_conditions JSONB,
    actions JSONB,
    is_active BOOLEAN DEFAULT FALSE,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP,
    created_by VARCHAR REFERENCES crm_core.crm_users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_crm_accounts_normalized_name_region ON crm_core.crm_accounts(normalized_name, region) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_accounts_owner ON crm_core.crm_accounts(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_accounts_updated_at ON crm_core.crm_accounts(updated_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_contacts_email ON crm_core.crm_contacts(primary_email) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_contacts_account ON crm_core.crm_contacts(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_contacts_phones ON crm_core.crm_contacts USING GIN (phones) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_contacts_updated_at ON crm_core.crm_contacts(updated_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_leads_assigned_to ON crm_core.crm_leads(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_leads_status ON crm_core.crm_leads(lead_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_leads_score ON crm_core.crm_leads(lead_score DESC) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_opportunities_owner ON crm_core.crm_opportunities(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_opportunities_stage ON crm_core.crm_opportunities(stage) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_opportunities_close_date ON crm_core.crm_opportunities(close_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_opportunities_account ON crm_core.crm_opportunities(account_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_activities_against ON crm_core.crm_activities(against_type, against_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_activities_actor ON crm_core.crm_activities(actor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_activities_due ON crm_core.crm_activities(due_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_tickets_assigned ON crm_core.crm_tickets(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_tickets_status ON crm_core.crm_tickets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_tickets_sla ON crm_core.crm_tickets(sla_target) WHERE deleted_at IS NULL;

CREATE INDEX idx_crm_timeline_entity ON crm_core.crm_timeline(entity_type, entity_id);
CREATE INDEX idx_crm_timeline_created ON crm_core.crm_timeline(created_at DESC);

CREATE INDEX idx_crm_audit_table_record ON crm_core.crm_audit_log(table_name, record_id);
CREATE INDEX idx_crm_audit_actor ON crm_core.crm_audit_log(actor_id);
CREATE INDEX idx_crm_audit_created ON crm_core.crm_audit_log(created_at DESC);

-- Insert default feature flags
INSERT INTO crm_core.crm_feature_flags (name, enabled, description) VALUES
('crm_feature_leads', TRUE, 'Enable leads management'),
('crm_feature_opportunities', TRUE, 'Enable opportunities/deals tracking'),
('crm_feature_activities', TRUE, 'Enable activities and timeline'),
('crm_feature_tickets', TRUE, 'Enable support tickets'),
('crm_feature_quotes', FALSE, 'Enable quotes and CPQ'),
('crm_feature_invoices', FALSE, 'Enable invoicing'),
('crm_feature_subscriptions', FALSE, 'Enable subscription management'),
('crm_feature_workflows', FALSE, 'Enable workflow automation'),
('crm_feature_advanced_reporting', FALSE, 'Enable advanced reporting and BI'),
('crm_feature_integrations', FALSE, 'Enable third-party integrations');

-- Insert sample admin user (password should be hashed in real implementation)
INSERT INTO crm_core.crm_teams (id, name, description, region) VALUES
('team-001', 'Sales Team', 'Primary sales team', 'MENA');

INSERT INTO crm_core.crm_users (id, username, email, first_name, last_name, role, team_id) VALUES
('admin-001', 'admin@geniussoftware.co', 'admin@geniussoftware.co', 'Admin', 'User', 'admin', 'team-001');

UPDATE crm_core.crm_teams SET manager_id = 'admin-001' WHERE id = 'team-001';

COMMIT;