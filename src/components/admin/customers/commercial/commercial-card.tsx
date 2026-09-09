"use client";

import React, { useState } from "react";
import { Loader2, Calendar, ShieldAlert, BadgeHelp, RefreshCw, AlertTriangle } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import { Button } from "@/components/ui/button";
import { ExtensionDialog } from "./extension-dialog";
import type { PlatformCustomer, PlatformCustomerStatus } from "@/types";
import type { HydratedActivity } from "@/lib/leads/repository";

interface CommercialCardProps {
  customer: PlatformCustomer | null;
  activities: HydratedActivity[];
  workspaceId: string | null;
  loading: boolean;
  onCommercialAction: (payload: any) => Promise<void>;
}

export function CommercialCard({
  customer,
  activities,
  workspaceId,
  loading,
  onCommercialAction,
}: CommercialCardProps) {
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [suspendingReason, setSuspendingReason] = useState("");
  const [showSuspendInput, setShowSuspendInput] = useState(false);

  if (!customer) return null;

  // Filter trial extension logs from timeline activities
  const extensionLogs = activities.filter(
    (act) => act.activity_type === "trial_extended"
  );

  const handleExtendConfirm = async (days: number, reason: string) => {
    setUpdating(true);
    try {
      await onCommercialAction({ action: "extend", days, reason });
      setShowExtendDialog(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleSuspendToggle = async () => {
    if (customer.status === "suspended") {
      setUpdating(true);
      try {
        await onCommercialAction({ action: "resume" });
      } finally {
        setUpdating(false);
      }
    } else {
      setShowSuspendInput(true);
    }
  };

  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendingReason.trim() || updating) return;
    setUpdating(true);
    try {
      await onCommercialAction({ action: "suspend", reason: suspendingReason.trim() });
      setShowSuspendInput(false);
      setSuspendingReason("");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PlatformCustomerStatus;
    if (!val || val === customer.status) return;
    setUpdating(true);
    try {
      await onCommercialAction({ action: "status", status: val });
    } finally {
      setUpdating(false);
    }
  };

  // Human-friendly status helper
  const getStatusLabelColor = (status: PlatformCustomerStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "trial":
        return "warning";
      case "pending_approval":
        return "info";
      case "paused":
        return "info";
      case "suspended":
        return "destructive";
      case "cancelled":
        return "destructive";
      case "blocked":
        return "destructive";
      default:
        return "info";
    }
  };

  return (
    <SectionCard title="Commercial Profile" subtitle="Manage trial states and subscriptions.">
      <div className="space-y-4 text-xs font-semibold select-none">
        
        {/* Status Mappings */}
        <div className="space-y-2 border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center space-x-1.5">
              <BadgeHelp className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              <span>Commercial Plan</span>
            </span>
            <StatusBadge
              label={customer.status.replace("_", " ")}
              variant={getStatusLabelColor(customer.status)}
            />
          </div>

          {customer.suspended_reason && (
            <div className="p-2 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] rounded-lg leading-relaxed flex items-start space-x-1.5">
              <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>Suspension: {customer.suspended_reason}</span>
            </div>
          )}
        </div>

        {/* Operational parameters */}
        <div className="space-y-2">
          {/* Plan actions */}
          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground uppercase font-bold block">
              Set Commercial Status
            </label>
            <select
              value={customer.status}
              onChange={handleStatusSelect}
              disabled={updating || loading}
              className="flex h-8 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-bold"
            >
              <option value="pending_approval">Pending Approval</option>
              <option value="trial">Trial</option>
              <option value="active">Active Subscription</option>
              <option value="paused">Paused</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
              <option value="blocked">Blocked</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Action triggers */}
          <div className="flex gap-2 pt-1.5">
            <Button
              onClick={() => setShowExtendDialog(true)}
              disabled={updating || loading || (customer.status !== "trial" && customer.status !== "suspended")}
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-border bg-card text-foreground hover:bg-muted/50 h-8 cursor-pointer"
            >
              Extend Trial
            </Button>
            <Button
              onClick={handleSuspendToggle}
              disabled={updating || loading || customer.status === "cancelled" || customer.status === "blocked" || customer.status === "archived"}
              variant={customer.status === "suspended" ? "default" : "destructive"}
              size="sm"
              className="flex-1 text-xs h-8 cursor-pointer"
            >
              {customer.status === "suspended" ? "Resume Workspace" : "Suspend Access"}
            </Button>
          </div>
        </div>

        {/* Suspend Reason Input Form */}
        {showSuspendInput && (
          <form onSubmit={handleSuspendSubmit} className="space-y-2 p-3 bg-muted/30 border border-border rounded-xl">
            <div className="space-y-1">
              <label className="text-[9px] text-muted-foreground uppercase font-bold block">
                Reason for Suspension
              </label>
              <input
                type="text"
                placeholder="e.g. Trial period expired without upgrade..."
                value={suspendingReason}
                onChange={(e) => setSuspendingReason(e.target.value)}
                disabled={updating}
                className="w-full bg-background border border-input rounded-md px-2.5 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                required
              />
            </div>
            <div className="flex justify-end space-x-1.5">
              <button
                type="button"
                onClick={() => { setShowSuspendInput(false); setSuspendingReason(""); }}
                className="px-2 py-1 rounded text-[10px] hover:bg-muted font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating || !suspendingReason.trim()}
                className="px-2 py-1 bg-destructive hover:bg-destructive-hover text-white rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                {updating ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>Confirm</span>}
              </button>
            </div>
          </form>
        )}

        {/* Trial Extension History Section */}
        {extensionLogs.length > 0 && (
          <div className="space-y-2 border-t border-border pt-3">
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">
              Trial Extension History
            </span>
            <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
              {extensionLogs.map((log) => (
                <div key={log.id} className="p-2 bg-muted/20 border border-border/40 rounded-lg space-y-1 text-[10px]">
                  <div className="flex items-center justify-between text-muted-foreground font-semibold">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground/60" />
                      Extended +{log.metadata?.extension_days || 0} days
                    </span>
                    <span>By {log.operatorName}</span>
                  </div>
                  <p className="text-foreground/80 font-medium italic leading-relaxed">
                    "{log.metadata?.reason || "No reason given."}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Trial Extension Popup Modal Dialog */}
      {showExtendDialog && (
        <ExtensionDialog
          onClose={() => setShowExtendDialog(false)}
          onConfirm={handleExtendConfirm}
          loading={updating}
        />
      )}
    </SectionCard>
  );
}
