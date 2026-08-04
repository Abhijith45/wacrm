"use client";

import React from "react";
import { Sparkles, Activity, ShieldAlert, Heart, Calendar } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";

interface CustomerHealthPanelProps {
  onboardingPercentage: number;
  customerStatus: string;
  workspaceStatus: string;
  lastActivityDate: string | null;
}

export function CustomerHealthPanel({
  onboardingPercentage,
  customerStatus,
  workspaceStatus,
  lastActivityDate,
}: CustomerHealthPanelProps) {
  
  // Calculate a simplified overall client score based on active metrics (for visualization)
  const isWorkspaceActive = workspaceStatus === "active";
  const isOnboardingComplete = onboardingPercentage === 100;
  const isTrialOrActive = ["trial", "trial_expiring", "active"].includes(customerStatus);

  let healthColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  let healthLabel = "Excellent";

  if (!isWorkspaceActive || !isTrialOrActive) {
    healthColor = "text-destructive bg-destructive/10 border-destructive/20";
    healthLabel = "Critical (Suspended)";
  } else if (!isOnboardingComplete) {
    healthColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    healthLabel = "Good (Onboarding)";
  }

  return (
    <SectionCard title="Customer Health Center" subtitle="Monitor account activation health and flags.">
      <div className="space-y-4 text-xs font-semibold select-none">
        
        {/* Overall Health Status banner */}
        <div className={`p-4 border rounded-2xl flex items-center justify-between ${healthColor}`}>
          <div className="flex items-center space-x-2.5">
            <Heart className="h-5 w-5 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider leading-none">Health Rating</span>
              <span className="block text-sm font-black uppercase mt-1">{healthLabel}</span>
            </div>
          </div>
          <Sparkles className="h-5 w-5 opacity-60" />
        </div>

        {/* Real-time Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-3">
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">
              Active Parameters
            </span>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-1.5 text-muted-foreground/60" />
                  Onboarding Progress
                </span>
                <span>{onboardingPercentage}% Complete</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-1.5 text-muted-foreground/60" />
                  Workspace Access
                </span>
                <span className="capitalize">{workspaceStatus || "Inactive"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground/60" />
                  Last Event Recorded
                </span>
                <span>{lastActivityDate ? new Date(lastActivityDate).toLocaleDateString() : "No activity"}</span>
              </div>
            </div>
          </div>

          {/* Placeholders for future usage data metrics */}
          <div className="space-y-3 opacity-50 cursor-not-allowed">
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">
              Future Telemetry & Support (Placeholders)
            </span>

            <div className="space-y-2.5 font-medium text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>WhatsApp Broadcast Usage</span>
                <span className="font-bold">0 / 50 daily limit</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Billing Status</span>
                <span className="font-bold">No Invoices Pending</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Open Support Tickets</span>
                <span className="font-bold">0 Tickets</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SectionCard>
  );
}
