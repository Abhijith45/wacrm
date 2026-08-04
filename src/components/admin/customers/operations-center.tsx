"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { MessageSquareCode } from "lucide-react";
import { CustomerHeader } from "./customer-header";
import { CustomerSummaryCards } from "./customer-summary";
import { WorkspacePanel } from "./workspace-panel";
import { CustomerHealthPanel } from "./health-panel";
import { CommercialCard } from "@/components/admin/customers/commercial/commercial-card";
import { OnboardingCard } from "@/components/admin/platform-leads/operations/onboarding-card";
import { ActivityTimeline } from "@/components/admin/platform-leads/activity/timeline";
import { PlaceholderSection } from "@/components/admin/platform-leads/details/placeholders";
import { RecentCommunications } from "./communication/recent-communications";

import type { PlatformCustomer } from "@/types";
import type { HydratedActivity } from "@/lib/leads/repository";
import type { OnboardingChecklist } from "@/lib/services/onboarding/checklist";
import type { CommunicationHistoryRecord } from "@/lib/services/communication/types";

interface OnboardingPayload {
  checklist: OnboardingChecklist;
  progressPercentage: number;
  completed: boolean;
}

interface CustomerDetailPayload {
  customer: PlatformCustomer;
  account: any;
  ownerProfile: any;
  membersCount: number;
  activities: HydratedActivity[];
  communications: CommunicationHistoryRecord[];
}

interface CustomerOperationsCenterProps {
  initialDetail: CustomerDetailPayload;
  initialOnboarding: OnboardingPayload | null;
}

export function CustomerOperationsCenter({
  initialDetail,
  initialOnboarding,
}: CustomerOperationsCenterProps) {
  const [customer, setCustomer] = useState<PlatformCustomer>(initialDetail.customer);
  const [account, setAccount] = useState<any>(initialDetail.account);
  const [activities, setActivities] = useState<HydratedActivity[]>(initialDetail.activities);
  const [membersCount, setMembersCount] = useState<number>(initialDetail.membersCount);
  const [communications, setCommunications] = useState<CommunicationHistoryRecord[]>(initialDetail.communications);
  
  const [onboarding, setOnboarding] = useState<OnboardingPayload | null>(initialOnboarding);
  const [loading, setLoading] = useState(false);

  // Trigger manual refresh by reload
  const handleRefresh = async () => {
    setLoading(true);
    try {
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  // Triggers manual commercial mutations (Extend trial, suspend/resume, status)
  const handleCommercialAction = async (payload: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${customer.lead_id}/commercial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Commercial command execution failed.");
      }

      setCustomer(data.customer);
      setActivities(data.activities);
      if (data.lead) {
        setAccount((prev: any) => ({
          ...prev,
          status: data.lead.workspace_status || prev?.status,
        }));
      }
      toast.success("Commercial status successfully updated!");
    } catch (err) {
      console.error("[OperationsCenter] commercial action failed:", err);
      toast.error(err instanceof Error ? err.message : "Commercial update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Triggers manual communication retry action overrides (Sprint 3.6)
  const handleRetryAction = async (historyId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${customer.lead_id}/communication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry", historyId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Manual retry override failed.");
      }

      setActivities(data.activities);
      setCommunications(data.communications);
      toast.success("Manual email retry triggered successfully!");
    } catch (err) {
      console.error("[OperationsCenter] retry failed:", err);
      toast.error(err instanceof Error ? err.message : "Retry failed.");
    } finally {
      setLoading(false);
    }
  };

  // Get active onboarding percentage
  const onboardingPercentage = onboarding ? onboarding.progressPercentage : 0;
  const lastActivityDate = activities.length > 0 ? activities[0].created_at : null;

  return (
    <div className="space-y-6 select-none relative">
      
      {/* 1. Header controls */}
      <CustomerHeader
        customer={customer}
        workspaceName={account ? account.name : ""}
        workspaceStatus={account ? account.status : "inactive"}
        onboardingPercentage={onboardingPercentage}
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* 2. Key stats metrics cards row */}
      <CustomerSummaryCards
        customer={customer}
        trialEndsAt={account ? account.trial_ends_at : null}
        membersCount={membersCount}
        onboardingPercentage={onboardingPercentage}
      />

      {/* 3. Panel Grid layout split (Left content columns vs Right sidebar actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns (70%) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Workspace info & flags */}
          <WorkspacePanel
            account={account}
            ownerEmail={initialDetail.ownerProfile ? initialDetail.ownerProfile.email : ""}
            membersCount={membersCount}
          />

          {/* Customer Health tracking */}
          <CustomerHealthPanel
            onboardingPercentage={onboardingPercentage}
            customerStatus={customer.status}
            workspaceStatus={account ? account.status : "inactive"}
            lastActivityDate={lastActivityDate}
          />

          {/* Lifecycle Communications History List (Sprint 3.6) */}
          <RecentCommunications
            communications={communications}
            onRetry={handleRetryAction}
            loading={loading}
          />

          {/* Unified Timeline */}
          {customer.lead_id && (
            <ActivityTimeline
              leadId={customer.lead_id}
              initialActivities={activities}
            />
          )}

          {/* Placeholder panel for Internal Notes */}
          <PlaceholderSection
            title="Internal Operations Log"
            subtitle="Operator coordination remarks."
            icon={MessageSquareCode}
            emptyTitle="No Operations Log"
            emptyDescription="Operator notes and audit logs will be recorded here to facilitate customer support. Coming soon."
          />

        </div>

        {/* Right Columns Sidebar (30%) */}
        <div className="space-y-6">
          
          {/* Onboarding Checklist Tracker */}
          <OnboardingCard
            checklist={onboarding ? onboarding.checklist : null}
            progressPercentage={onboarding ? onboarding.progressPercentage : 0}
            completed={onboarding ? onboarding.completed : false}
            loading={loading}
          />

          {/* Commercial State Adjustments card */}
          <CommercialCard
            customer={customer}
            activities={activities}
            workspaceId={account ? account.id : null}
            loading={loading}
            onCommercialAction={handleCommercialAction}
          />

        </div>

      </div>

    </div>
  );
}
