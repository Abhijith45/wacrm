"use client";

import React from "react";
import { Users, Layers, Trophy, Clock } from "lucide-react";
import { MetricCard } from "@/components/admin/dashboard/metric-card";
import type { PlatformCustomer } from "@/types";

interface CustomerSummaryCardsProps {
  customer: PlatformCustomer;
  trialEndsAt: string | null;
  membersCount: number;
  onboardingPercentage: number;
}

export function CustomerSummaryCards({
  customer,
  trialEndsAt,
  membersCount,
  onboardingPercentage,
}: CustomerSummaryCardsProps) {
  
  // Calculate remaining trial days
  let trialRemainingDaysLabel = "N/A";
  let isTrialActive = false;

  if (customer.status === "trial" || customer.status === "trial_expiring") {
    isTrialActive = true;
    if (trialEndsAt) {
      const diff = new Date(trialEndsAt).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      trialRemainingDaysLabel = days > 0 ? `${days} Days` : "Expired";
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      
      {/* Plan type */}
      <MetricCard
        title="Commercial Plan"
        value={customer.status === "active" ? "Active Plan" : "Trial Program"}
        change="Status"
        isPositive={customer.status === "active"}
        description={customer.status.replace("_", " ")}
        icon={Trophy}
        variant={customer.status === "active" ? "emerald" : "amber"}
      />

      {/* Trial Remainder */}
      <MetricCard
        title="Trial Remaining"
        value={trialRemainingDaysLabel}
        change={isTrialActive ? "Running" : "Completed"}
        isPositive={isTrialActive && trialRemainingDaysLabel !== "Expired"}
        description="duration of evaluation"
        icon={Clock}
        variant={isTrialActive ? "blue" : "neutral"}
      />

      {/* Onboarding Stage */}
      <MetricCard
        title="Onboarding Activation"
        value={`${onboardingPercentage}%`}
        change={onboardingPercentage === 100 ? "Activated" : "In Progress"}
        isPositive={onboardingPercentage === 100}
        description="checklist completion"
        icon={Layers}
        variant={onboardingPercentage === 100 ? "emerald" : "blue"}
      />

      {/* Workspace Profile Members */}
      <MetricCard
        title="Active Workspace Users"
        value={String(membersCount)}
        change="Teammates"
        isPositive={membersCount > 1}
        description="members count inside organization"
        icon={Users}
        variant="purple"
      />

    </div>
  );
}
