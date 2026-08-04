"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { EmptyState } from "@/components/admin/common/empty-state";

export default function AdminOnboardingPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Onboarding Analytics"
        description="Review workspace configuration milestones, checklist compliance, and feature usage parameters."
      />

      <EmptyState
        icon={CheckSquare}
        title="No Onboarding Telemetry"
        description="Onboarding progress mapped to accounts.onboarding_status JSONB configs will display here. Allows sales teams to track which trial clients require guide assists."
        actionLabel="View Engineering Constitution"
        onAction={() => window.open("/docs/strategy/SYNCWA_ENGINEERING_STANDARDS.md", "_blank")}
      />
    </div>
  );
}
