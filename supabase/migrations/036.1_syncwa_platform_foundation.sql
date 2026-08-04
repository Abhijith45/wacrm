-- ============================================================================
-- SyncWA Migration
-- Version      : 036.5
-- Name         : syncwa_platform_foundation
-- Depends On   : 036_conversation_contact_dedup.sql
-- Domain       : Platform CRM / Website Domain / Workspace Domain
-- Phase        : MVP Phase 1
-- Owner        : SyncWA
-- ============================================================================

-- 1. Extend PROFILES with Platform Roles and Constraints
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_platform_staff BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS platform_role TEXT CHECK (platform_role IN ('founder', 'admin', 'sales', 'support', 'finance', 'operations')),
  ADD CONSTRAINT chk_platform_staff_role CHECK (
    (is_platform_staff = TRUE AND platform_role IS NOT NULL) OR
    (is_platform_staff = FALSE AND platform_role IS NULL)
  );

CREATE INDEX IF NOT EXISTS idx_profiles_is_platform_staff
  ON public.profiles(is_platform_staff)
  WHERE is_platform_staff = TRUE;

-- Helper function to verify if the active session belongs to platform staff.
-- Optimized to return FALSE (not NULL) if user is not authenticated.
CREATE OR REPLACE FUNCTION public.is_platform_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_platform_staff FROM public.profiles WHERE user_id = auth.uid()),
    FALSE
  );
$$;

ALTER FUNCTION public.is_platform_staff() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_platform_staff() TO authenticated, service_role;

-- 2. Extend ACCOUNTS (Workspace) with distinct workspace & subscription lifecycles
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deactivated')),
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'unpaid')),
  ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_status JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_accounts_status ON public.accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_subscription_status ON public.accounts(subscription_status);

-- 3. Create PLATFORM_LEADS with UTM marketing attribution
CREATE TABLE IF NOT EXISTS public.platform_leads (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  company_name   TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  country        TEXT,
  company_size   TEXT,
  message        TEXT NOT NULL,
  subject        TEXT,
  interest_area  TEXT,
  source         TEXT NOT NULL DEFAULT 'contact_form',
  status         TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'demo_scheduled', 'demo_completed', 'trial_active', 'converted', 'lost', 'unqualified')),
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT,
  utm_content    TEXT,
  utm_term       TEXT,
  referrer_url   TEXT,
  assigned_to    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id   UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  converted_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_leads_status ON public.platform_leads(status);
CREATE INDEX IF NOT EXISTS idx_platform_leads_assigned_to ON public.platform_leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_platform_leads_created_at ON public.platform_leads(created_at DESC);

ALTER TABLE public.platform_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS platform_leads_staff_all ON public.platform_leads;
CREATE POLICY platform_leads_staff_all ON public.platform_leads
  FOR ALL USING (public.is_platform_staff());

DROP TRIGGER IF EXISTS set_updated_at ON public.platform_leads;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.platform_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Create LEAD_ACTIVITIES
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        UUID NOT NULL REFERENCES public.platform_leads(id) ON DELETE CASCADE,
  activity_type  TEXT NOT NULL CHECK (activity_type IN ('note_added', 'email_sent', 'call_made', 'demo_completed', 'status_changed', 'assigned', 'workspace_provisioned', 'workspace_created')),
  note           TEXT,
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities(lead_id, created_at DESC);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lead_activities_staff_all ON public.lead_activities;
CREATE POLICY lead_activities_staff_all ON public.lead_activities
  FOR ALL USING (public.is_platform_staff());

-- 5. Create PLATFORM_TAGS
CREATE TABLE IF NOT EXISTS public.platform_tags (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL UNIQUE,
  color          TEXT NOT NULL DEFAULT '#3b82f6',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.platform_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS platform_tags_staff_all ON public.platform_tags;
CREATE POLICY platform_tags_staff_all ON public.platform_tags
  FOR ALL USING (public.is_platform_staff());

-- 6. Create PLATFORM_LEAD_TAGS (Many-to-Many join table)
CREATE TABLE IF NOT EXISTS public.platform_lead_tags (
  lead_id        UUID NOT NULL REFERENCES public.platform_leads(id) ON DELETE CASCADE,
  tag_id         UUID NOT NULL REFERENCES public.platform_tags(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (lead_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_platform_lead_tags_tag ON public.platform_lead_tags(tag_id);

ALTER TABLE public.platform_lead_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS platform_lead_tags_staff_all ON public.platform_lead_tags;
CREATE POLICY platform_lead_tags_staff_all ON public.platform_lead_tags
  FOR ALL USING (public.is_platform_staff());
