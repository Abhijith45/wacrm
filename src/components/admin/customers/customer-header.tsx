"use client";

import React from "react";
import { ArrowLeft, RefreshCw, Layers, ShieldAlert, CreditCard, HelpCircle, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { PlatformCustomer, PlatformCustomerStatus } from "@/types";

interface CustomerHeaderProps {
  customer: PlatformCustomer;
  workspaceName: string;
  workspaceStatus: string;
  onboardingPercentage: number;
  onRefresh: () => void;
  refreshing: boolean;
}

export function CustomerHeader({
  customer,
  workspaceName,
  workspaceStatus,
  onboardingPercentage,
  onRefresh,
  refreshing,
}: CustomerHeaderProps) {
  // Helper for plan status badge color
  const getPlanColor = (status: PlatformCustomerStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "trial":
      case "trial_expiring":
        return "warning";
      case "suspended":
      case "cancelled":
        return "destructive";
      default:
        return "info";
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Directory
        </Link>

        {/* Sync/Refresh Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="text-xs border-border bg-card text-foreground hover:bg-muted/50 h-8 cursor-pointer font-semibold"
        >
          <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Stats
        </Button>
      </div>

      {/* Main header block */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        
        {/* Name and Meta */}
        <div className="space-y-2">
          <div className="space-y-1">
            <h1 className="text-lg font-black text-foreground uppercase tracking-wider">
              {customer.company_name}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold flex items-center">
              <Layers className="h-3.5 w-3.5 mr-1 text-muted-foreground/60" />
              <span>Workspace: {workspaceName || "Unprovisioned"}</span>
              <span className="mx-2">&bull;</span>
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground/60" />
              <span>Client Since: {new Date(customer.created_at).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Badge pill rows */}
          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge
              label={`Plan: ${customer.status.replace("_", " ")}`}
              variant={getPlanColor(customer.status)}
            />
            <StatusBadge
              label={`Workspace: ${workspaceStatus || "inactive"}`}
              variant={workspaceStatus === "active" ? "success" : "destructive"}
            />
            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/15">
              Onboarding: {onboardingPercentage}%
            </span>
          </div>
        </div>

        {/* Disabled Future Action Placeholders (PRD / Sprint Scope) */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-[10px] uppercase font-bold border-border/80 text-muted-foreground/50 h-8 cursor-not-allowed"
            title="Billing Management placeholder (future release)"
          >
            <CreditCard className="h-3 w-3 mr-1" />
            Billing Info
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-[10px] uppercase font-bold border-border/80 text-muted-foreground/50 h-8 cursor-not-allowed"
            title="Support Desk placeholder (future release)"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Open Support
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-[10px] uppercase font-bold border-border/80 text-muted-foreground/50 h-8 cursor-not-allowed hover:bg-destructive/10"
            title="Platform Clean placeholder (future release)"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Decommission
          </Button>
        </div>

      </div>
    </div>
  );
}
