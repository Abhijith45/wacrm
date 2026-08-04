-- ============================================================================
-- SyncWA Migration
-- Version      : 036.8
-- Name         : syncwa_platform_commercial
-- Depends On   : 036.7_syncwa_platform_workspace.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 3
-- Owner        : SyncWA
-- ============================================================================

-- 1. Add commercial tracking columns to platform_customers table
ALTER TABLE public.platform_customers
  ADD COLUMN IF NOT EXISTS trial_extension_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
  ADD COLUMN IF NOT EXISTS commercial_notes TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Drop and Recreate check constraint on platform_customers.status to support 'trial_expiring'
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT tc.constraint_name 
    INTO constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'platform_customers' 
      AND tc.constraint_type = 'CHECK' 
      AND ccu.column_name = 'status';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.platform_customers DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;

ALTER TABLE public.platform_customers ADD CONSTRAINT check_platform_customers_status 
  CHECK (status IN ('prospect', 'trial', 'trial_expiring', 'active', 'suspended', 'cancelled', 'archived'));

-- 3. Drop and Recreate check_lead_activities_activity_type to support commercial timeline events
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT tc.constraint_name 
    INTO constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'lead_activities' 
      AND tc.constraint_type = 'CHECK' 
      AND ccu.column_name = 'activity_type';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.lead_activities DROP CONSTRAINT ' || constraint_name;
    END IF;
END $$;

ALTER TABLE public.lead_activities ADD CONSTRAINT check_lead_activities_activity_type 
  CHECK (activity_type IN (
    'note_added', 
    'email_sent', 
    'call_made', 
    'demo_completed', 
    'status_changed', 
    'assigned', 
    'workspace_provisioned', 
    'workspace_created',
    'customer_converted',
    'trial_extended',
    'trial_expired',
    'workspace_suspended',
    'workspace_reactivated',
    'commercial_status_changed'
  ));
