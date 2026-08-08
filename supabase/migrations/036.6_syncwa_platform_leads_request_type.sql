-- ============================================================================
-- SyncWA Migration
-- Version      : 036.10
-- Name         : syncwa_platform_leads_request_type
-- Depends On   : 036.5_syncwa_platform_communication.sql
-- Domain       : Platform CRM
-- Phase        : Sprint 3
-- Owner        : SyncWA
-- ============================================================================

-- Add request_type column to platform_leads table
ALTER TABLE public.platform_leads
  ADD COLUMN IF NOT EXISTS request_type TEXT NOT NULL DEFAULT 'GENERAL' CHECK (request_type IN ('DEMO', 'ONBOARDING', 'GENERAL', 'PARTNERSHIP', 'TECHNICAL'));
