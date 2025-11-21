-- CRM Core Tables Migration
-- Create core CRM entities with proper relationships and indexes

-- Companies table
CREATE TABLE IF NOT EXISTS crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size_range VARCHAR(50), -- '1-10', '11-50', '51-200', '201-1000', '1000+'
    annual_revenue DECIMAL(15,2),
    website VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    address JSONB, -- {street, city, state, country, postal_code}
    description TEXT,
    logo_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, prospect
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    job_title VARCHAR(200),
    department VARCHAR(100),
    linkedin_url VARCHAR(500),
    avatar_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT FALSE,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    lead_source VARCHAR(100), -- website, referral, cold-call, social-media, event
    lead_score INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    notes TEXT,
    last_contacted_at TIMESTAMP,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deal stages table
CREATE TABLE IF NOT EXISTS crm_deal_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    probability INTEGER DEFAULT 0, -- 0-100
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN DEFAULT FALSE,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS crm_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES crm_companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    stage_id UUID REFERENCES crm_deal_stages(id),
    name VARCHAR(255) NOT NULL,
    value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    probability INTEGER DEFAULT 0, -- 0-100
    expected_close_date DATE,
    actual_close_date DATE,
    description TEXT,
    lead_source VARCHAR(100),
    lost_reason VARCHAR(500),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ticket status table
CREATE TABLE IF NOT EXISTS crm_ticket_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    is_closed BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS crm_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
    status_id UUID REFERENCES crm_ticket_status(id),
    subject VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    category VARCHAR(100) DEFAULT 'general',
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    due_date TIMESTAMP,
    resolved_at TIMESTAMP,
    first_response_at TIMESTAMP,
    tags JSONB DEFAULT '[]',
    satisfaction_rating INTEGER, -- 1-5
    satisfaction_comment TEXT,
    time_spent INTEGER DEFAULT 0, -- minutes
    sla_breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities timeline table
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL, -- call, email, meeting, note, task, deal-update, status-change
    title VARCHAR(500) NOT NULL,
    description TEXT,
    -- Related entities (polymorphic relationship)
    entity_type VARCHAR(50) NOT NULL, -- company, contact, deal, ticket
    entity_id UUID NOT NULL,
    -- Activity details
    user_id UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}', -- flexible data storage
    duration INTEGER, -- in minutes for calls/meetings
    outcome VARCHAR(500),
    is_pinned BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_companies_owner_id ON crm_companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_companies_updated_at ON crm_companies(updated_at);
CREATE INDEX IF NOT EXISTS idx_crm_companies_status ON crm_companies(status);
CREATE INDEX IF NOT EXISTS idx_crm_companies_name ON crm_companies(name);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id ON crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_owner_id ON crm_contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_updated_at ON crm_contacts(updated_at);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_name ON crm_contacts(first_name, last_name);

CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id ON crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage_id ON crm_deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner_id ON crm_deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_updated_at ON crm_deals(updated_at);
CREATE INDEX IF NOT EXISTS idx_crm_deals_expected_close_date ON crm_deals(expected_close_date);

CREATE INDEX IF NOT EXISTS idx_crm_tickets_company_id ON crm_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_contact_id ON crm_tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_deal_id ON crm_tickets(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_status_id ON crm_tickets(status_id);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_assigned_to ON crm_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_updated_at ON crm_tickets(updated_at);
CREATE INDEX IF NOT EXISTS idx_crm_tickets_priority ON crm_tickets(priority);

CREATE INDEX IF NOT EXISTS idx_crm_activities_entity ON crm_activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON crm_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_activities_type ON crm_activities(type);

-- Insert default deal stages
INSERT INTO crm_deal_stages (name, position, probability, color) VALUES
('Lead', 1, 10, '#6B7280'),
('Qualified', 2, 25, '#3B82F6'),
('Proposal', 3, 50, '#F59E0B'),
('Negotiation', 4, 75, '#EF4444'),
('Closed Won', 5, 100, '#10B981'),
('Closed Lost', 6, 0, '#6B7280')
ON CONFLICT DO NOTHING;

-- Insert default ticket statuses
INSERT INTO crm_ticket_status (name, color, is_closed, is_default, position) VALUES
('Open', '#3B82F6', FALSE, TRUE, 1),
('In Progress', '#F59E0B', FALSE, FALSE, 2),
('Waiting for Customer', '#6B7280', FALSE, FALSE, 3),
('Resolved', '#10B981', TRUE, FALSE, 4),
('Closed', '#374151', TRUE, FALSE, 5)
ON CONFLICT DO NOTHING;