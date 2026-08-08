-- ============================================================================
-- SyncWA Migration
-- Version      : 036.7
-- Name         : platform_customer_status_updates
-- Depends On   : 036.2_syncwa_platform_customer.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 4
-- Owner        : SyncWA
-- ============================================================================

-- 1. Migrate any historical status values to valid new lifecycle states
UPDATE public.platform_customers 
SET status = 'trial' 
WHERE status IN ('prospect', 'trial_expiring');

-- 2. Drop existing anonymous check constraint on public.platform_customers.status
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

-- 3. Add updated CHECK constraint supporting the new status list
ALTER TABLE public.platform_customers ADD CONSTRAINT check_platform_customers_status 
  CHECK (status IN (
    'pending_approval', 
    'trial', 
    'active', 
    'paused', 
    'suspended', 
    'cancelled', 
    'blocked', 
    'archived'
  ));
