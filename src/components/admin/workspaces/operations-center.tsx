"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Activity,
  User,
  Layout,
  RefreshCw,
  Mail,
  Play,
  Pause,
  AlertTriangle,
  Archive,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Database,
  Users,
  MessageSquare,
  Megaphone,
  Zap,
  Sliders,
  HardDrive,
} from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WorkspaceDetailPayload {
  workspace: {
    id: string;
    name: string;
    slug: string;
    status: string;
    trialStartedAt: string | null;
    trialEndsAt: string | null;
    dailyBroadcastLimit: number;
    created_at: string;
    version: string;
    environment: string;
    customer_id?: string | null;
  };
  owner: {
    companyName: string;
    ownerName: string;
    ownerEmail: string;
    createdDate: string;
  };
  health: {
    score: number;
    overallStatus: string;
    subsystems: Record<
      string,
      {
        name: string;
        status: string;
        details?: string;
        weight: number;
      }
    >;
  };
  metrics: {
    membersCount: number;
    contactsCount: number;
    conversationsCount: number;
    dealsCount: number;
    pipelinesCount: number;
    broadcastsCount: number;
    automationsCount: number;
    storageUsageBytes: number;
    whatsappStatus: string;
  };
  activities: any[];
}

interface WorkspaceOperationsCenterProps {
  initialDetail: WorkspaceDetailPayload;
}

export function WorkspaceOperationsCenter({
  initialDetail,
}: WorkspaceOperationsCenterProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<WorkspaceDetailPayload>(initialDetail);
  const [loading, setLoading] = useState(false);

  // Operation dialog states
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const { workspace, owner, health, metrics, activities } = detail;

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("syncwa-breadcrumb", { detail: workspace.name })
    );
  }, [workspace.name]);

  const handleAction = async (action: string, payload: any = {}) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/workspaces/${workspace.id}/operations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...payload }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Action failed to execute.");
      }

      setDetail(data.detail);
      toast.success(`Action "${action}" completed successfully!`);
    } catch (err) {
      console.error("[WorkspaceOperationsCenter] action failed:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to execute workspace action."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "paused":
        return "info";
      case "suspended":
        return "destructive";
      case "archived":
        return "neutral";
      default:
        return "info";
    }
  };

  const getSubsystemIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
      case "configured":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "unknown":
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground/60 shrink-0" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 select-none relative">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-50 rounded-2xl">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <button
            onClick={() => router.push("/admin/workspaces")}
            className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Workspaces
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black tracking-tight text-foreground">
              {workspace.name}
            </h1>
            <StatusBadge
              label={health.overallStatus}
              variant={getStatusColor(health.overallStatus)}
            />
          </div>
          <p className="text-xs font-semibold text-muted-foreground font-mono">
            ID: {workspace.id}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => handleAction("resend_invitation")}
            className="text-xs bg-muted border border-border text-foreground hover:bg-muted/70 font-semibold cursor-pointer h-8"
          >
            <Mail className="h-3 w-3 mr-1.5" />
            Resend Invitation
          </Button>

          {health.overallStatus === "paused" ? (
            <Button
              size="sm"
              onClick={() => handleAction("resume")}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer h-8"
            >
              <Play className="h-3 w-3 mr-1.5" />
              Resume Workspace
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleAction("pause")}
              disabled={health.overallStatus === "archived"}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold cursor-pointer h-8"
            >
              <Pause className="h-3 w-3 mr-1.5" />
              Pause Workspace
            </Button>
          )}

          {health.overallStatus === "suspended" ? (
            <Button
              size="sm"
              onClick={() => handleAction("resume")}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer h-8"
            >
              <Play className="h-3 w-3 mr-1.5" />
              Resume Workspace
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowSuspendDialog(true)}
              disabled={health.overallStatus === "archived"}
              className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold cursor-pointer h-8"
            >
              <AlertTriangle className="h-3 w-3 mr-1.5" />
              Suspend Workspace
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setShowArchiveDialog(true)}
            disabled={health.overallStatus === "archived"}
            className="text-xs bg-muted text-muted-foreground border border-border hover:bg-muted/80 font-semibold cursor-pointer h-8"
          >
            <Archive className="h-3 w-3 mr-1.5" />
            Archive Workspace
          </Button>

          <Button
            size="sm"
            onClick={() => handleAction("refresh")}
            className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Metadata & Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Workspace Info */}
            <SectionCard
              title="Workspace Information"
              subtitle="Technical environment parameters."
            >
              <div className="space-y-2.5 text-xs font-semibold select-none">
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">URL Slug</span>
                  <span className="font-mono text-foreground font-bold">
                    {workspace.slug}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="capitalize text-foreground font-bold">
                    {workspace.environment}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">Version</span>
                  <span className="text-foreground font-bold">
                    {workspace.version}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created Date</span>
                  <span className="text-foreground font-bold">
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Owner Info */}
            <SectionCard
              title="Owner Information"
              subtitle="Primary account administrator details."
            >
              <div className="space-y-2.5 text-xs font-semibold select-none">
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">Company Name</span>
                  <span className="text-foreground font-bold">
                    {owner.companyName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">Owner Owner</span>
                  <span className="text-foreground font-bold">
                    {owner.ownerName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-1.5">
                  <span className="text-muted-foreground">Owner Email</span>
                  <span className="text-foreground font-bold font-mono">
                    {owner.ownerEmail}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Link</span>
                  {workspace.customer_id && (
                    <Link
                      href={`/admin/customers/${workspace.customer_id}`}
                      className="inline-flex items-center text-primary hover:underline font-bold"
                    >
                      <span>View Customer</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Resource Usage Grid */}
          <SectionCard
            title="Resource Metrics"
            subtitle="Aggregated workspace database record counts."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Users className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">{metrics.membersCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Teammates
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Database className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">{metrics.contactsCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Contacts
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <MessageSquare className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">
                  {metrics.conversationsCount}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Chats
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Megaphone className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">
                  {metrics.broadcastsCount}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Broadcasts
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Sliders className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">{metrics.pipelinesCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Pipelines
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Zap className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">
                  {metrics.automationsCount}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Automations
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <HardDrive className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">
                  {formatBytes(metrics.storageUsageBytes)}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Storage
                </div>
              </div>
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-1">
                <Sliders className="h-4 w-4 mx-auto text-muted-foreground" />
                <div className="text-lg font-black">{metrics.dealsCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Deals
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Integrations Card */}
          <SectionCard
            title="Active Integrations"
            subtitle="Configuration flags and health status."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex items-center justify-between border border-border p-3 rounded-xl bg-card">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">WhatsApp Business API</div>
                  <div className="text-[10px] text-muted-foreground">
                    Metadata connection status
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                    metrics.whatsappStatus === "Connected"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {metrics.whatsappStatus}
                </span>
              </div>

              <div className="flex items-center justify-between border border-border p-3 rounded-xl bg-card">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">Outbound Mail SMTP</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {process.env.SMTP_HOST ? "Host configured" : "Local mail Mock"}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-black border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Healthy
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Side: Health Score & Subsystems */}
        <div className="space-y-6">
          {/* Health Score Card */}
          <SectionCard
            title="System Diagnostics"
            subtitle="Weighted operational health parameters."
          >
            <div className="space-y-6 select-none">
              <div className="text-center py-4 relative">
                <div className="text-5xl font-black tracking-tighter text-foreground">
                  {health.score}%
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5">
                  Workspace Health Index
                </div>
              </div>

              {/* Subsystems List */}
              <div className="space-y-2 border-t border-border pt-4">
                {Object.values(health.subsystems).map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-start justify-between p-2 rounded-lg border border-border/40 bg-muted/10"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-bold text-foreground">
                        {sub.name}
                      </div>
                      {sub.details && (
                        <div className="text-[9px] text-muted-foreground font-mono leading-tight">
                          {sub.details}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          sub.status === "unknown"
                            ? "text-muted-foreground/60"
                            : ""
                        }`}
                      >
                        {sub.status}
                      </span>
                      {getSubsystemIcon(sub.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Activity Timeline Card */}
          <SectionCard
            title="Activity Logs"
            subtitle="Workspace provisioning and status timeline."
          >
            {activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-xs font-semibold">
                No timeline logs recorded.
              </div>
            ) : (
              <div className="space-y-3.5 select-none relative max-h-[360px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="border-l border-border pl-3 pb-1 space-y-0.5 relative text-xs"
                  >
                    <div className="absolute left-[-4.5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                      <span>{act.activity_type.replace("_", " ")}</span>
                      <span>{new Date(act.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-foreground leading-tight text-xs">
                      {act.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Suspend Reason Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="sm:max-w-md select-none">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">
              Suspend Workspace
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Specify the administrative reason for suspending this workspace. All inbound and outbound messaging limits will be disabled immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="suspend-reason" className="text-xs font-bold text-foreground">
              Suspension Reason
            </Label>
            <Input
              id="suspend-reason"
              placeholder="e.g. Compliance review, unpaid invoice"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="text-xs font-semibold"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSuspendDialog(false)}
              className="text-xs font-semibold h-8 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAction("suspend", { reason: suspendReason.trim() });
                setShowSuspendDialog(false);
                setSuspendReason("");
              }}
              disabled={!suspendReason.trim()}
              className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold h-8 cursor-pointer"
            >
              Suspend Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="sm:max-w-md select-none">
          <DialogHeader>
            <DialogTitle className="font-black text-foreground">
              Archive Workspace
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to archive this workspace? This action is terminal and will deactivate all active user access sessions permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowArchiveDialog(false)}
              className="text-xs font-semibold h-8 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAction("archive");
                setShowArchiveDialog(false);
              }}
              className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold h-8 cursor-pointer"
            >
              Confirm Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
