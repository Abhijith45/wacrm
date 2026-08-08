"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { MessageSquareCode, Building2, Users, Calendar, User, Mail, Phone, MessageSquare, Database, Megaphone, Zap, Sliders } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerHeader } from "./customer-header";
import { CustomerSummaryCards } from "./customer-summary";
import { WorkspacePanel } from "./workspace-panel";
import { CustomerHealthPanel } from "./health-panel";
import { CommercialCard } from "@/components/admin/customers/commercial/commercial-card";
import { OnboardingCard } from "@/components/admin/platform-leads/operations/onboarding-card";
import { ActivityTimeline } from "@/components/admin/platform-leads/activity/timeline";
import { PlaceholderSection } from "@/components/admin/platform-leads/details/placeholders";
import { RecentCommunications } from "./communication/recent-communications";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  metrics: {
    contactsCount: number;
    conversationsCount: number;
    dealsCount: number;
    pipelinesCount: number;
    broadcastsCount: number;
    automationsCount: number;
    storageUsageBytes: number;
    whatsappStatus: string;
  };
}

interface CustomerOperationsCenterProps {
  initialDetail: CustomerDetailPayload;
  initialOnboarding: OnboardingPayload | null;
}

export function CustomerOperationsCenter({
  initialDetail,
  initialOnboarding,
}: CustomerOperationsCenterProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<PlatformCustomer>(initialDetail.customer);
  const [account, setAccount] = useState<any>(initialDetail.account);
  const [activities, setActivities] = useState<HydratedActivity[]>(initialDetail.activities);
  const [membersCount, setMembersCount] = useState<number>(initialDetail.membersCount);
  const [communications, setCommunications] = useState<CommunicationHistoryRecord[]>(initialDetail.communications);
  const ownerProfile = initialDetail.ownerProfile;
  
  const [onboarding, setOnboarding] = useState<OnboardingPayload | null>(initialOnboarding);
  const [loading, setLoading] = useState(false);

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [formBaseline, setFormBaseline] = useState({
    companyName: initialDetail.customer.company_name,
    companySize: initialDetail.customer.company_size || "",
    email: initialDetail.customer.email,
    phone: initialDetail.customer.phone || "",
  });
  const [form, setForm] = useState(formBaseline);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmation Dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);

  // Compute dirty state
  const isDirty =
    form.companyName !== formBaseline.companyName ||
    form.companySize !== formBaseline.companySize ||
    form.email !== formBaseline.email ||
    form.phone !== formBaseline.phone;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("syncwa-breadcrumb", { detail: customer.company_name }));
  }, [customer.company_name]);

  // Client-side routing interceptor for SPA navigation
  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && (href.startsWith("/") || href.startsWith(window.location.origin))) {
          const isDownload = anchor.hasAttribute("download");
          const targetAttr = anchor.getAttribute("target");
          const isNewTab = targetAttr === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;

          if (!isDownload && !isNewTab) {
            e.preventDefault();
            e.stopPropagation();

            setPendingDestination(href);
            setShowConfirmDialog(true);
          }
        }
      }
    };

    window.addEventListener("click", handleAnchorClick, true);
    return () => window.removeEventListener("click", handleAnchorClick, true);
  }, [isDirty]);

  // Browser back/forward button interceptor
  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingDestination("/admin/customers");
      setShowConfirmDialog(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  // Browser reload/tab-closing guard
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (destinationToNavigate: string | null = null) => {
    if (!validateForm()) {
      toast.error("Please resolve validation errors before saving.");
      setShowConfirmDialog(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          companySize: form.companySize,
          email: form.email,
          phone: form.phone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save customer changes.");
      }

      setCustomer(data.customer);
      setAccount(data.detail.account);
      setActivities(data.detail.activities);
      setCommunications(data.detail.communications);

      const updatedBaseline = {
        companyName: data.customer.company_name,
        companySize: data.customer.company_size || "",
        email: data.customer.email,
        phone: data.customer.phone || "",
      };

      setFormBaseline(updatedBaseline);
      setForm(updatedBaseline);
      setIsEditMode(false);
      setShowConfirmDialog(false);
      toast.success("Customer changes successfully saved!");

      if (destinationToNavigate) {
        setTimeout(() => {
          router.push(destinationToNavigate);
        }, 100);
      }
    } catch (err) {
      console.error("[OperationsCenter] Save failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = (destinationToNavigate: string | null = null) => {
    setForm(formBaseline);
    setErrors({});
    setIsEditMode(false);
    setShowConfirmDialog(false);
    toast.info("Changes discarded.");

    if (destinationToNavigate) {
      setTimeout(() => {
        router.push(destinationToNavigate);
      }, 100);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setPendingDestination(null);
      setShowConfirmDialog(true);
    } else {
      setIsEditMode(false);
      setErrors({});
    }
  };

  const handleBackClick = () => {
    if (isDirty) {
      setPendingDestination("/admin/customers");
      setShowConfirmDialog(true);
    } else {
      router.push("/admin/customers");
    }
  };

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
        isEditMode={isEditMode}
        onEditToggle={() => setIsEditMode(true)}
        onSave={() => handleSave(null)}
        onCancel={handleCancelClick}
        onBackClick={handleBackClick}
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
          
          {/* Customer Profile Card */}
          <SectionCard title="Customer Profile" subtitle="General company demographics and timestamps.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold select-none">
              <div className="space-y-1">
                <Label htmlFor="companyName" className="text-[10px] text-muted-foreground uppercase font-bold">Company Name</Label>
                {isEditMode ? (
                  <>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className={cn("bg-muted/30", errors.companyName && "border-destructive")}
                    />
                    {errors.companyName && (
                      <p className="text-[10px] text-destructive mt-1 font-semibold">{errors.companyName}</p>
                    )}
                  </>
                ) : (
                  <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{customer.company_name}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="companySize" className="text-[10px] text-muted-foreground uppercase font-bold">Company Size</Label>
                {isEditMode ? (
                  <select
                    id="companySize"
                    value={form.companySize}
                    onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <option value="">Not Specified</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                ) : (
                  <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{customer.company_size ? `${customer.company_size} employees` : "Not Specified"}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Created At</span>
                <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{new Date(customer.created_at).toLocaleString()}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Last Updated</span>
                <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{new Date(customer.updated_at).toLocaleString()}</span>
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Primary Contact Card */}
          <SectionCard title="Primary Contact" subtitle="Workspace Owner profile outreach details.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold select-none">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Full Name</span>
                <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{ownerProfile?.full_name || "N/A"}</span>
                </span>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[10px] text-muted-foreground uppercase font-bold">Primary Email</Label>
                {isEditMode ? (
                  <>
                    <Input
                      id="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={cn("bg-muted/30", errors.email && "border-destructive")}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-destructive mt-1 font-semibold">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{customer.email}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-[10px] text-muted-foreground uppercase font-bold">Primary Phone</Label>
                {isEditMode ? (
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-muted/30 h-9"
                  />
                ) : (
                  <span className="text-foreground flex items-center space-x-1.5 h-9 py-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{customer.phone || "Not Provided"}</span>
                  </span>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Workspace info & flags */}
          <WorkspacePanel
            account={account}
            ownerEmail={initialDetail.ownerProfile ? initialDetail.ownerProfile.email : ""}
            membersCount={membersCount}
          />

          {/* Workspace Operational Metrics Summary (Aggregate values only) */}
          <SectionCard
            title="Workspace Operational Metrics"
            subtitle="Aggregated usage and capacity metrics (individual contacts, conversation transcripts, and deal records are kept strictly private)."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold select-none">
              
              {/* Contacts */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Contacts</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.contactsCount}</span>
              </div>

              {/* Conversations */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Chats</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.conversationsCount}</span>
              </div>

              {/* Deals */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Database className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Deals</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.dealsCount}</span>
              </div>

              {/* Pipelines */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Sliders className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Pipelines</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.pipelinesCount}</span>
              </div>

              {/* Broadcasts */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Megaphone className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Broadcasts</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.broadcastsCount}</span>
              </div>

              {/* Automations */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Zap className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Automations</span>
                </div>
                <span className="block text-lg font-black text-foreground">{initialDetail.metrics.automationsCount}</span>
              </div>

              {/* Storage */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Database className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Storage</span>
                </div>
                <span className="block text-lg font-black text-foreground">
                  {initialDetail.metrics.storageUsageBytes > 1024 * 1024
                    ? `${(initialDetail.metrics.storageUsageBytes / (1024 * 1024)).toFixed(1)} MB`
                    : `${(initialDetail.metrics.storageUsageBytes / 1024).toFixed(1)} KB`}
                </span>
              </div>

              {/* WhatsApp status */}
              <div className="p-3.5 bg-muted/20 border border-border/40 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <MessageSquareCode className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">WhatsApp</span>
                </div>
                <span className={`block text-[11px] font-black uppercase ${
                  initialDetail.metrics.whatsappStatus === "connected" ? "text-emerald-500" : "text-amber-500"
                }`}>
                  {initialDetail.metrics.whatsappStatus}
                </span>
              </div>

            </div>
          </SectionCard>

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

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={(open) => {
        if (!open) return;
      }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Do you want to save them before leaving this page?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleDiscard(pendingDestination)}
              className="cursor-pointer"
            >
              Discard Changes
            </Button>
            <Button
              onClick={() => handleSave(pendingDestination)}
              className="cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
