"use client";

import React from "react";
import { CheckCircle2, Circle, Loader2, Sparkles, Trophy } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import type { OnboardingChecklist } from "@/lib/services/onboarding/checklist";

interface OnboardingCardProps {
  checklist: OnboardingChecklist | null;
  progressPercentage: number;
  completed: boolean;
  loading: boolean;
}

export function OnboardingCard({
  checklist,
  progressPercentage,
  completed,
  loading,
}: OnboardingCardProps) {
  if (loading) {
    return (
      <SectionCard title="Workspace Onboarding" subtitle="Loading customer journey details...">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SectionCard>
    );
  }

  if (!checklist) {
    return (
      <SectionCard title="Workspace Onboarding" subtitle="Customer journey not started.">
        <div className="text-center py-4 text-xs font-semibold text-muted-foreground italic">
          Workspace has not been provisioned yet.
        </div>
      </SectionCard>
    );
  }

  // Definition of human-friendly checklist items
  const stepsList = [
    { key: "workspaceCreated", label: "Workspace Created", description: "Account container initialized" },
    { key: "ownerInvited", label: "Owner Invited", description: "Invitation credential dispatched" },
    { key: "ownerLoggedIn", label: "Owner Logged In", description: "First dashboard session registered" },
    { key: "channelsConnected", label: "WhatsApp Connected", description: "WhatsApp API channel linked" },
    { key: "teamInvited", label: "First Team Member", description: "Teammate added to organization" },
    { key: "contactsImported", label: "First Contact Imported", description: "Customer contacts list seeded" },
    { key: "firstPipelineCreated", label: "First Pipeline Created", description: "Custom pipeline configured" },
    { key: "firstAutomationCreated", label: "First Automation Created", description: "Initial automation flow enabled" },
  ];

  // Calculate estimated completion remaining
  const totalSteps = stepsList.length;
  const completedStepsCount = stepsList.filter((s) => checklist[s.key as keyof OnboardingChecklist] === true).length;
  const remainingSteps = totalSteps - completedStepsCount;
  const estimatedMinsRemaining = remainingSteps * 3; // Approx 3 mins per step

  return (
    <SectionCard title="Workspace Onboarding" subtitle="Onboarding progress tracking.">
      <div className="space-y-4 text-xs font-semibold select-none">
        
        {/* Progress header & slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase font-bold">Progress</span>
            <span className="text-foreground font-black">{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/30">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Workspace Onboarding Progress"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>
              {completedStepsCount} of {totalSteps} steps completed
            </span>
            {remainingSteps > 0 ? (
              <span>~{estimatedMinsRemaining} mins remaining</span>
            ) : (
              <span className="text-emerald-500 font-bold flex items-center">
                <Trophy className="h-3 w-3 mr-1 shrink-0" />
                Activated
              </span>
            )}
          </div>
        </div>

        {/* Customer Health Indicator Placeholder (PRD Section 12) */}
        <div className="bg-muted/30 border border-border p-2.5 rounded-lg flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>Health Index</span>
          </span>
          <span className="px-1.5 py-0.5 rounded font-black bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
            Good
          </span>
        </div>

        {/* Checklist steps list */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 border-t border-border pt-3">
          {stepsList.map((step) => {
            const isDone = checklist[step.key as keyof OnboardingChecklist] === true;
            return (
              <div
                key={step.key}
                className="flex items-start justify-between space-x-2.5"
                tabIndex={0}
                aria-label={`Step: ${step.label}. Status: ${isDone ? "Completed" : "Pending"}`}
              >
                <div className="flex items-start space-x-2 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <span className={`block font-bold text-[11px] leading-tight ${isDone ? "text-foreground" : "text-muted-foreground/80"}`}>
                      {step.label}
                    </span>
                    <span className="block text-[9px] text-muted-foreground/60 leading-normal truncate">
                      {step.description}
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] uppercase px-1 rounded shrink-0 ${isDone ? "bg-emerald-500/10 text-emerald-500 font-bold" : "bg-muted text-muted-foreground/60"}`}>
                  {isDone ? "Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </SectionCard>
  );
}
