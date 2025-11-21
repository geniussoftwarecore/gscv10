-- Rollback script for CRM schema migration
-- This script safely removes all CRM tables and schema

BEGIN;

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS crm_core.crm_workflows CASCADE;
DROP TABLE IF EXISTS crm_core.crm_merge_candidates CASCADE;
DROP TABLE IF EXISTS crm_core.crm_dedupe_jobs CASCADE;
DROP TABLE IF EXISTS crm_core.crm_custom_values CASCADE;
DROP TABLE IF EXISTS crm_core.crm_custom_fields CASCADE;
DROP TABLE IF EXISTS crm_core.crm_entity_tags CASCADE;
DROP TABLE IF EXISTS crm_core.crm_tags CASCADE;
DROP TABLE IF EXISTS crm_core.crm_audit_log CASCADE;
DROP TABLE IF EXISTS crm_core.crm_timeline CASCADE;
DROP TABLE IF EXISTS crm_core.crm_subscriptions CASCADE;
DROP TABLE IF EXISTS crm_core.crm_invoices CASCADE;
DROP TABLE IF EXISTS crm_core.crm_quotes CASCADE;
DROP TABLE IF EXISTS crm_core.crm_tickets CASCADE;
DROP TABLE IF EXISTS crm_core.crm_activities CASCADE;
DROP TABLE IF EXISTS crm_core.crm_pricebook CASCADE;
DROP TABLE IF EXISTS crm_core.crm_products CASCADE;
DROP TABLE IF EXISTS crm_core.crm_opportunities CASCADE;
DROP TABLE IF EXISTS crm_core.crm_leads CASCADE;
DROP TABLE IF EXISTS crm_core.crm_contacts CASCADE;
DROP TABLE IF EXISTS crm_core.crm_accounts CASCADE;
DROP TABLE IF EXISTS crm_core.crm_users CASCADE;
DROP TABLE IF EXISTS crm_core.crm_teams CASCADE;
DROP TABLE IF EXISTS crm_core.crm_feature_flags CASCADE;

-- Drop the schema
DROP SCHEMA IF EXISTS crm_core CASCADE;

COMMIT;