-- ============================================================================
-- SyncWA Migration
-- Version      : 036.9
-- Name         : syncwa_platform_communication
-- Depends On   : 036.8_syncwa_platform_commercial.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 3
-- Owner        : SyncWA
-- ============================================================================

-- 1. Create communication_history table
CREATE TABLE IF NOT EXISTS public.communication_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  provider TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0,
  failure_reason TEXT,
  delivery_result JSONB,
  lead_id UUID REFERENCES public.platform_leads (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Configure Row Level Security (RLS) on communication_history
ALTER TABLE public.communication_history ENABLE ROW LEVEL SECURITY;

-- 3. Access policies for platform staff
CREATE POLICY platform_staff_select ON public.communication_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_platform_staff = true
    )
  );

CREATE POLICY platform_staff_write ON public.communication_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_platform_staff = true
    )
  );

-- 4. Create database performance indexes
CREATE INDEX IF NOT EXISTS idx_communication_history_lead_id ON public.communication_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_communication_history_status ON public.communication_history(status);
CREATE INDEX IF NOT EXISTS idx_communication_history_created_at ON public.communication_history(created_at DESC);
