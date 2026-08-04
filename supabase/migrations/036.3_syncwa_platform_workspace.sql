-- ============================================================================
-- SyncWA Migration
-- Version      : 036.7
-- Name         : syncwa_platform_workspace
-- Depends On   : 036.6_syncwa_platform_customer.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 3
-- Owner        : SyncWA
-- ============================================================================

-- 1. Add workspace columns (slug, customer_id, status, trial bounds, limits) to accounts table
ALTER TABLE public.accounts 
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.platform_customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS daily_broadcast_limit INTEGER DEFAULT 50;

CREATE INDEX IF NOT EXISTS idx_accounts_slug ON public.accounts(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_customer_id ON public.accounts(customer_id) WHERE customer_id IS NOT NULL;

-- 2. Drop and Recreate check_lead_activities_activity_type to support provisioning activities
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
    'customer_converted'
  ));
