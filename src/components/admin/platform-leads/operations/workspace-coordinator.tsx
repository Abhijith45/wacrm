"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Rocket,
  MessageSquareCode,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { LeadHeader } from "@/components/admin/platform-leads/details/header";
import {
  ContactCard,
  CompanyCard,
  MessageCard,
} from "@/components/admin/platform-leads/details/cards";
import { PlaceholderSection } from "@/components/admin/platform-leads/details/placeholders";
import { ActivityTimeline } from "@/components/admin/platform-leads/activity/timeline";

import type { PlatformLead, PlatformLeadStatus, PlatformCustomer } from "@/types";
import type { HydratedActivity, PlatformStaff, PlatformTag } from "@/lib/leads/repository";
import type { OnboardingChecklist } from "@/lib/services/onboarding/checklist";

// Operations Panel Cards
import { StatusCard } from "./status-card";
import { AssignmentCard } from "./assignment-card";
import { TagManager } from "./tag-manager";
import { OnboardingCard } from "./onboarding-card";
import { CommercialCard } from "@/components/admin/customers/commercial/commercial-card";

interface OnboardingPayload {
  checklist: OnboardingChecklist;
  progressPercentage: number;
  completed: boolean;
}

interface LeadDetailsWorkspaceProps {
  initialLead: PlatformLead;
  initialActivities: HydratedActivity[];
  initialTags: PlatformTag[];
  allTags: PlatformTag[];
  staffList: PlatformStaff[];
  initialOnboarding: OnboardingPayload | null;
  initialCustomer: PlatformCustomer | null;
}



export function LeadDetailsWorkspace({
  initialLead,
  initialActivities,
  initialTags,
  allTags,
  staffList,
  initialOnboarding,
  initialCustomer,
}: LeadDetailsWorkspaceProps) {
  const [lead, setLead] = useState<PlatformLead>(initialLead);
  const [activities, setActivities] = useState<HydratedActivity[]>(initialActivities);
  const [leadTags, setLeadTags] = useState<PlatformTag[]>(initialTags);
  const [tagsPool, setTagsPool] = useState<PlatformTag[]>(allTags);
  const [onboarding, setOnboarding] = useState<OnboardingPayload | null>(initialOnboarding);
  const [customer, setCustomer] = useState<PlatformCustomer | null>(initialCustomer);


  
  const [loading, setLoading] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);

  // 0. Lead Conversion Command Mutation
  const handleConvertLead = async () => {
    setConverting(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Customer conversion execution failed.");
      }

      setLead(data.lead);
      setActivities(data.activities);
      setOnboarding(data.onboarding);
      setCustomer(data.customer);
      setShowConvertModal(false);
      toast.success("Lead successfully converted to Customer!");


    } catch (err) {
      console.error("[Workspace] conversion error:", err);
      toast.error(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setConverting(false);
    }
  };


  // 1. Status Mutation
  const handleStatusChange = async (newStatus: PlatformLeadStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      setLead(data.lead);
      setActivities((prev) => [data.activity, ...prev]);
      toast.success(`Lead status updated to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      console.error("[Workspace] status update error:", err);
      toast.error(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Assignment Mutation
  const handleAssigneeChange = async (assigneeId: string | null) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign", assigneeId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update assignment.");
      }

      setLead(data.lead);
      setActivities((prev) => [data.activity, ...prev]);
      
      const rep = staffList.find(s => s.userId === assigneeId);
      toast.success(assigneeId ? `Assigned to ${rep?.fullName}` : "Assignment removed.");
    } catch (err) {
      console.error("[Workspace] assignment update error:", err);
      toast.error(err instanceof Error ? err.message : "Assignment update failed.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Tag Insertion Mutation
  const handleAddTag = async (tagName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_tag", tagName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to associate tag.");
      }

      // Add to local lead tags if not exists
      if (!leadTags.some(t => t.id === data.tag.id)) {
        setLeadTags((prev) => [...prev, data.tag]);
      }
      // Add to overall tags list suggestions pool if not exists
      if (!tagsPool.some(t => t.id === data.tag.id)) {
        setTagsPool((prev) => [...prev, data.tag].sort((a,b) => a.name.localeCompare(b.name)));
      }
      
      setActivities((prev) => [data.activity, ...prev]);
      toast.success(`Tag "${data.tag.name}" attached`);
    } catch (err) {
      console.error("[Workspace] add tag error:", err);
      toast.error(err instanceof Error ? err.message : "Tag association failed.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Tag Deletion Mutation
  const handleRemoveTag = async (tagId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/operations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_tag", tagId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to remove tag.");
      }

      setLeadTags((prev) => prev.filter(t => t.id !== tagId));
      setActivities((prev) => [data.activity, ...prev]);
      toast.success("Tag removed successfully");
    } catch (err) {
      console.error("[Workspace] remove tag error:", err);
      toast.error(err instanceof Error ? err.message : "Tag removal failed.");
    } finally {
      setLoading(false);
    }
  };

  // 4B. Commercial Action Command Mutation (Sprint 3.4)
  const handleCommercialAction = async (payload: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}/commercial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Commercial command execution failed.");
      }

      setCustomer(data.customer);
      setLead(data.lead);
      setActivities(data.activities);
      toast.success("Commercial status successfully updated!");
    } catch (err) {
      console.error("[Commercial] operation error:", err);
      toast.error(err instanceof Error ? err.message : "Commercial update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="space-y-6 select-none relative">
      {/* Dynamic Breadcrumbs & Actions Header */}
      <LeadHeader lead={lead} onConvert={() => setShowConvertModal(true)} isConverting={converting} />


      {/* Two Column Layout: Primary Cards vs Operations Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Primary Panel - 70%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <ContactCard lead={lead} />

          {/* Company Details */}
          <CompanyCard lead={lead} />

          {/* Message Content */}
          <MessageCard lead={lead} />

          {/* Chronological Timeline Feed */}
          <ActivityTimeline leadId={lead.id} initialActivities={activities} />

          {/* Future Section: Internal Support Notes */}
          <PlaceholderSection
            title="Internal Support Notes"
            subtitle="Confidential operator remarks and logs."
            icon={MessageSquareCode}
            emptyTitle="No Support Notes"
            emptyDescription="Operator notes and remarks will be recorded here to facilitate coordination. Coming soon."
          />
        </div>

        {/* Right Column (Operations Sidebar - 30%) */}
        <div className="space-y-6">
          {/* Status Switcher Card */}
          <StatusCard
            status={lead.status}
            loading={loading}
            onStatusChange={handleStatusChange}
          />

          {/* Assignment Switcher Card */}
          <AssignmentCard
            assignedTo={lead.assigned_to}
            staffList={staffList}
            loading={loading}
            onAssigneeChange={handleAssigneeChange}
          />

          {/* Tags Switcher Card */}
          <TagManager
            leadTags={leadTags}
            allTags={tagsPool}
            loading={loading}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />

          {/* Workspace Onboarding Checklist & Progress Panel (Sprint 3.3) */}
          {lead.status === "converted" && (
            <OnboardingCard
              checklist={onboarding ? onboarding.checklist : null}
              progressPercentage={onboarding ? onboarding.progressPercentage : 0}
              completed={onboarding ? onboarding.completed : false}
              loading={loading}
            />
          )}

          {/* Customer Commercial Status Card (Sprint 3.4) */}
          {lead.status === "converted" && (
            <CommercialCard
              customer={customer}
              activities={activities}
              workspaceId={lead.workspace_id}
              loading={loading}
              onCommercialAction={handleCommercialAction}
            />
          )}
        </div>


      </div>

      {/* 5. Customer Conversion Confirmation Dialog Modal (locked PRD 24) */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 text-left select-none animate-scale-in mx-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center">
                Confirm Customer Conversion
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Please review lead details before converting this record into a formal SyncWA Customer account.
              </p>
            </div>

            {/* Lead Summary details */}
            <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="text-foreground font-bold">{lead.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Name:</span>
                <span className="text-foreground font-bold">{lead.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Email:</span>
                <span className="text-foreground font-bold truncate max-w-[200px]">{lead.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <span className="capitalize font-bold text-primary">{lead.status.replace("_", " ")}</span>
              </div>
            </div>

            {/* Warning statement */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl text-[11px] leading-relaxed font-semibold">
              Warning: This operation is atomic and irreversible. A Customer profile and isolated tenant Workspace will be generated automatically. A 14-day trial plan will be initialized and bound to the new Workspace.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConvertModal(false)}
                disabled={converting}
                className="px-3.5 py-1.5 rounded-md border border-border text-xs font-semibold hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConvertLead}
                disabled={converting}
                className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {converting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Converting Lead...</span>
                  </>
                ) : (
                  <span>Confirm Conversion</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

