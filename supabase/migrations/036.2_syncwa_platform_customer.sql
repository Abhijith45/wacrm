-- ============================================================================
-- SyncWA Migration
-- Version      : 036.6
-- Name         : syncwa_platform_customer
-- Depends On   : 036.5_syncwa_platform_foundation.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 3
-- Owner        : SyncWA
-- ============================================================================

-- 1. Drop existing anonymous check constraint on lead_activities.activity_type and recreate it including 'customer_converted'
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

-- 2. Create platform_customers table
CREATE TABLE IF NOT EXISTS public.platform_customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        UUID REFERENCES public.platform_leads(id) ON DELETE SET NULL,
  company_name   TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  phone          TEXT,
  company_size   TEXT,
  status         TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('prospect', 'trial', 'active', 'suspended', 'cancelled', 'archived')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_customers_email ON public.platform_customers(email);
CREATE INDEX IF NOT EXISTS idx_platform_customers_lead_id ON public.platform_customers(lead_id) WHERE lead_id IS NOT NULL;

-- 3. Enable RLS and define policies
ALTER TABLE public.platform_customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS platform_customers_staff_all ON public.platform_customers;
CREATE POLICY platform_customers_staff_all ON public.platform_customers
  FOR ALL USING (public.is_platform_staff());

-- 4. Set set_updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.platform_customers;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.platform_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Stored Procedure for Atomic Customer Conversion
CREATE OR REPLACE FUNCTION public.convert_lead_to_customer(
  p_lead_id UUID,
  p_operator_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_lead RECORD;
  v_customer RECORD;
  v_activity RECORD;
  v_result JSONB;
BEGIN
  -- A. Lock lead for update to prevent concurrent execution races
  SELECT * INTO v_lead 
  FROM public.platform_leads 
  WHERE id = p_lead_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Lead not found.');
  END IF;

  -- B. Check duplicate customer email
  IF EXISTS (
    SELECT 1 FROM public.platform_customers WHERE email = v_lead.email
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'A customer with this email is already registered.');
  END If;

  -- C. Validate eligibility status
  IF v_lead.status NOT IN ('qualified', 'demo_completed') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Lead is not qualified for customer conversion.');
  END IF;

  -- D. Check for mandatory details
  IF v_lead.email IS NULL OR v_lead.name IS NULL OR v_lead.company_name IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Lead missing mandatory contact or company details.');
  END IF;

  -- E. Insert Platform Customer row
  INSERT INTO public.platform_customers (
    lead_id,
    company_name,
    email,
    phone,
    company_size,
    status
  ) VALUES (
    v_lead.id,
    v_lead.company_name,
    v_lead.email,
    v_lead.phone,
    v_lead.company_size,
    'trial'
  ) RETURNING * INTO v_customer;

  -- F. Update Platform Lead status to converted
  UPDATE public.platform_leads
  SET 
    status = 'converted',
    converted_at = NOW(),
    updated_at = NOW()
  WHERE id = v_lead.id;

  -- G. Log timeline activity
  INSERT INTO public.lead_activities (
    lead_id,
    activity_type,
    note,
    metadata,
    created_by
  ) VALUES (
    v_lead.id,
    'customer_converted',
    'Lead successfully converted to Customer account.',
    jsonb_build_object('customer_id', v_customer.id),
    p_operator_id
  ) RETURNING * INTO v_activity;

  -- Return success status
  v_result := jsonb_build_object(
    'success', true,
    'customer_id', v_customer.id,
    'activity_id', v_activity.id
  );

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
