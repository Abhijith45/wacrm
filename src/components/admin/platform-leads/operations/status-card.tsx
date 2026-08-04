"use client";

import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { PlatformLeadStatus } from "@/types";

interface StatusCardProps {
  status: PlatformLeadStatus;
  loading: boolean;
  onStatusChange: (status: PlatformLeadStatus) => Promise<void>;
}

export function StatusCard({ status, loading, onStatusChange }: StatusCardProps) {
  const statuses: { label: string; value: PlatformLeadStatus }[] = [
    { label: "New Lead", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Demo Scheduled", value: "demo_scheduled" },
    { label: "Demo Completed", value: "demo_completed" },
    { label: "Trial Active", value: "trial_active" },
    { label: "Converted", value: "converted" },
    { label: "Lost", value: "lost" },
    { label: "Unqualified", value: "unqualified" },
  ];

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PlatformLeadStatus;
    if (value && value !== status) {
      await onStatusChange(value);
    }
  };

  const getStatusVariant = (stat: PlatformLeadStatus) => {
    switch (stat) {
      case "new":
        return "info" as const;
      case "contacted":
        return "warning" as const;
      case "qualified":
        return "success" as const;
      case "demo_scheduled":
        return "info" as const;
      case "demo_completed":
        return "success" as const;
      case "trial_active":
        return "warning" as const;
      case "converted":
        return "success" as const;
      case "lost":
        return "destructive" as const;
      case "unqualified":
        return "neutral" as const;
      default:
        return "neutral" as const;
    }
  };

  return (
    <SectionCard title="Lifecycle Status" subtitle="Lead progression status tracking.">
      <div className="space-y-4 text-xs font-semibold select-none">
        {/* Status display */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span>Active Status</span>
          </span>
          <StatusBadge
            label={status.replace("_", " ")}
            variant={getStatusVariant(status)}
          />
        </div>

        {/* Change status control */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">
            Update Lifecycle Status
          </span>
          <div className="relative">
            <select
              value={status}
              onChange={handleSelectChange}
              disabled={loading}
              className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {loading && (
              <div className="absolute right-2 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
