import React from "react";
import { notFound } from "next/navigation";
import { getPlatformCustomerDetail } from "@/lib/leads/repository";
import { supabaseAdmin } from "@/lib/flows/admin-client";
import { OnboardingService } from "@/lib/services/onboarding/service";
import { CustomerOperationsCenter } from "@/components/admin/customers/operations-center";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";

interface Params {
  customerId: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { customerId } = await params;
  const detail = await getPlatformCustomerDetail(customerId);
  return {
    title: detail ? `${detail.customer.company_name} | Customer Cockpit` : "Customer Not Found | SyncWA Admin",
  };
}

export default async function CustomerOperationsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { customerId } = await params;

  // Verify platform staff authentication first
  const staff = await getCurrentPlatformStaff();

  // 1. Fetch detailed customer parameters from database layers
  const detail = await getPlatformCustomerDetail(customerId);
  if (!detail) {
    notFound();
  }

  // 2. Fetch/Evaluate Onboarding progress
  let initialOnboarding = null;
  if (detail.account && detail.ownerProfile) {
    const onboardingService = new OnboardingService();
    initialOnboarding = await onboardingService.evaluateAndLogMilestones(
      detail.customer.lead_id,
      detail.account.id,
      detail.ownerProfile.user_id,
      staff.userId
    );
  }

  // 3. Render client-side Operations Center coordinator dashboard
  return (
    <CustomerOperationsCenter
      initialDetail={detail}
      initialOnboarding={initialOnboarding}
    />
  );
}
