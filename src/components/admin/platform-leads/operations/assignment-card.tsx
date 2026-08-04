"use client";

import React from "react";
import { Loader2, UserCheck, UserMinus } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Button } from "@/components/ui/button";
import type { PlatformStaff } from "@/lib/leads/repository";

interface AssignmentCardProps {
  assignedTo: string | null;
  staffList: PlatformStaff[];
  loading: boolean;
  onAssigneeChange: (assigneeId: string | null) => Promise<void>;
}

export function AssignmentCard({
  assignedTo,
  staffList,
  loading,
  onAssigneeChange,
}: AssignmentCardProps) {
  // Find current assignee details
  const activeStaff = staffList.find((s) => s.userId === assignedTo);

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    await onAssigneeChange(value === "" ? null : value);
  };

  const handleRemove = async () => {
    await onAssigneeChange(null);
  };

  return (
    <SectionCard title="Lead Assignment" subtitle="Assign operator to qualify leads.">
      <div className="space-y-4 text-xs font-semibold select-none">
        {/* Assignee display */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground flex items-center space-x-1.5">
            <UserCheck className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span>Assigned Rep</span>
          </span>
          <span className="text-foreground font-bold">
            {activeStaff ? activeStaff.fullName : "Unassigned"}
          </span>
        </div>

        {/* Action controls */}
        <div className="space-y-2">
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Assign Platform Operator
            </span>
            <div className="relative">
              <select
                value={assignedTo || ""}
                onChange={handleSelectChange}
                disabled={loading}
                className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Choose operator...</option>
                {staffList.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.fullName} ({s.email})
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

          {/* Remove assignment button */}
          {assignedTo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={loading}
              className="w-full text-xs text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive cursor-pointer h-8"
            >
              <UserMinus className="h-3.5 w-3.5 mr-1.5" />
              Remove Assignment
            </Button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
