-- Add missing tables that are in schema.ts but not in the initial migration

-- Deal Stages table for Kanban boards
CREATE TABLE IF NOT EXISTS "deal_stages" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "position" text NOT NULL,
    "probability" text DEFAULT '0' NOT NULL,
    "color" text DEFAULT '#3b82f6' NOT NULL,
    "is_closed" text DEFAULT 'false' NOT NULL,
    "is_won" text DEFAULT 'false' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "deal_stages_name_unique" UNIQUE("name")
);

-- Ticket Status table
CREATE TABLE IF NOT EXISTS "ticket_status" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "position" text NOT NULL,
    "color" text DEFAULT '#3b82f6' NOT NULL,
    "is_closed" text DEFAULT 'false' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "ticket_status_name_unique" UNIQUE("name")
);

-- Saved Filters table for user preferences
CREATE TABLE IF NOT EXISTS "saved_filters" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar,
    "name" text NOT NULL,
    "entities" jsonb,
    "filters" jsonb,
    "is_default" text DEFAULT 'false',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Add foreign key constraints for new tables
ALTER TABLE "saved_filters" ADD CONSTRAINT "saved_filters_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- Update opportunities table to reference deal_stages
ALTER TABLE "opportunities" ADD COLUMN IF NOT EXISTS "stage_id" varchar;
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_stage_id_deal_stages_id_fk" 
FOREIGN KEY ("stage_id") REFERENCES "public"."deal_stages"("id") ON DELETE no action ON UPDATE no action;

-- Update support_tickets to reference ticket_status
ALTER TABLE "support_tickets" ADD COLUMN IF NOT EXISTS "status_id" varchar;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_status_id_ticket_status_id_fk" 
FOREIGN KEY ("status_id") REFERENCES "public"."ticket_status"("id") ON DELETE no action ON UPDATE no action;

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS "deal_stages_position_idx" ON "deal_stages"("position");
CREATE INDEX IF NOT EXISTS "ticket_status_position_idx" ON "ticket_status"("position");
CREATE INDEX IF NOT EXISTS "saved_filters_user_idx" ON "saved_filters"("user_id");
CREATE INDEX IF NOT EXISTS "saved_filters_default_idx" ON "saved_filters"("is_default");