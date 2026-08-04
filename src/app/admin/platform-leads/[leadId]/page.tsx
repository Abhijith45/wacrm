import React from "react";
import { notFound } from "next/navigation";
import {
  getPlatformLeadById,
  getLeadActivities,
  getPlatformStaffList,
  getPlatformTags,
  getLeadTags,
} from "@/lib/leads/repository";
import { supabaseAdmin } from "@/lib/flows/admin-client";
import { OnboardingService } from "@/lib/services/onboarding/service";
import { LeadDetailsWorkspace } from "@/components/admin/platform-leads/operations/workspace-coordinator";

interface Params {
  leadId: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { leadId } = await params;
  const lead = await getPlatformLeadById(leadId);
  return {
    title: lead ? `${lead.name} | Lead Workspace` : "Lead Not Found | SyncWA Admin",
  };
}

export default async function PlatformLeadDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { leadId } = await params;

  // 1. Fetch all details page datasets in parallel (Server-side reads)
  const lead = await getPlatformLeadById(leadId);
  if (!lead) {
    notFound();
  }

  const [initialActivities, initialTags, allTags, staffList] = await Promise.all([
    getLeadActivities(leadId),
    getLeadTags(leadId),
    getPlatformTags(),
    getPlatformStaffList(),
  ]);

  // 2. Fetch Onboarding & Customer Commercial profile if converted (Sprint 3.3 / 3.4)
  let initialOnboarding = null;
  let initialCustomer = null;

  if (lead.status === "converted" && lead.workspace_id) {
    const onboardingService = new OnboardingService();
    const supabase = supabaseAdmin();

    const [profileResult, customerResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id")
        .eq("account_id", lead.workspace_id)
        .eq("account_role", "owner")
        .maybeSingle(),
      supabase
        .from("platform_customers")
        .select("*")
        .eq("lead_id", leadId)
        .maybeSingle()
    ]);

    initialCustomer = customerResult.data;

    if (profileResult.data?.user_id) {
      initialOnboarding = await onboardingService.evaluateAndLogMilestones(
        leadId,
        lead.workspace_id,
        profileResult.data.user_id,
        "00000000-0000-0000-0000-000000000000" // System operator identifier
      );
    }
  }

  // 3. Render Workspace Coordinator (Client State Wrapper)
  return (
    <LeadDetailsWorkspace
      initialLead={lead}
      initialActivities={initialActivities}
      initialTags={initialTags}
      allTags={allTags}
      staffList={staffList}
      initialOnboarding={initialOnboarding}
      initialCustomer={initialCustomer}
    />
  );
}
