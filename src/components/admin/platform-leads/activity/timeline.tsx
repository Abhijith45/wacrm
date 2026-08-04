"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  Activity,
  Phone,
  Mail,
  User,
  Rocket,
  CheckCircle,
  FileText,
  Calendar,
  Layers,
  Tag,
} from "lucide-react";
import { EmptyState } from "@/components/admin/common/empty-state";
import { AddNoteForm } from "./add-note";
import type { HydratedActivity } from "@/lib/leads/repository";

interface ActivityTimelineProps {
  leadId: string;
  initialActivities: HydratedActivity[];
}

type ActivityFilter = "all" | "notes" | "calls" | "system";

export function ActivityTimeline({ leadId, initialActivities }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<HydratedActivity[]>(initialActivities);
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const handleNoteAdded = (newActivity: HydratedActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Filter logic
  const filteredActivities = activities.filter((act) => {
    if (filter === "all") return true;
    if (filter === "notes") return act.activity_type === "note_added";
    if (filter === "calls") return act.activity_type === "call_made";
    if (filter === "system") {
      return [
        "status_changed",
        "assigned",
        "workspace_provisioned",
        "workspace_created",
      ].includes(act.activity_type);
    }
    return true;
  });

  // Icon selector mapping
  const getActivityIcon = (act: HydratedActivity) => {
    const type = act.activity_type;
    const meta = act.metadata || {};

    if (type === "note_added" && meta.system_event === "tag_added") {
      return { icon: Tag, bg: "bg-blue-500/10", text: "text-blue-500" };
    }
    if (type === "note_added" && meta.system_event === "tag_removed") {
      return { icon: Tag, bg: "bg-red-500/10", text: "text-red-500" };
    }

    switch (type) {
      case "note_added":
        return { icon: MessageSquare, bg: "bg-blue-500/10", text: "text-blue-500" };
      case "status_changed":
        return { icon: Activity, bg: "bg-amber-500/10", text: "text-amber-500" };
      case "call_made":
        return { icon: Phone, bg: "bg-emerald-500/10", text: "text-emerald-500" };
      case "email_sent":
        return { icon: Mail, bg: "bg-blue-500/10", text: "text-blue-500" };
      case "assigned":
        return { icon: User, bg: "bg-purple-500/10", text: "text-purple-500" };
      case "workspace_provisioned":
      case "workspace_created":
        return { icon: Rocket, bg: "bg-purple-500/10", text: "text-purple-500" };
      case "demo_completed":
      case "customer_converted":
        return { icon: CheckCircle, bg: "bg-emerald-500/10", text: "text-emerald-500" };
      default:
        return { icon: FileText, bg: "bg-muted", text: "text-muted-foreground" };
    }
  };


  // Metadata renderer
  const renderActivityMeta = (act: HydratedActivity) => {
    const meta = act.metadata || {};
    if (act.activity_type === "status_changed") {
      const oldVal = meta.old_status ? String(meta.old_status).replace("_", " ") : "none";
      const newVal = meta.new_status ? String(meta.new_status).replace("_", " ") : "none";
      return (
        <span className="text-[10px] text-muted-foreground font-semibold inline-flex items-center space-x-1 capitalize mt-1.5">
          <span>Lifecycle update:</span>
          <span className="px-1.5 py-0.5 rounded bg-muted font-bold text-foreground">{oldVal}</span>
          <span>&rarr;</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/10">{newVal}</span>
        </span>
      );
    }

    if (act.activity_type === "assigned") {
      const oldRep = meta.old_assignee || "Unassigned";
      const newRep = meta.new_assignee || "Unassigned";
      return (
        <span className="text-[10px] text-muted-foreground font-semibold inline-flex items-center space-x-1 mt-1.5">
          <span>Representative shift:</span>
          <span className="px-1.5 py-0.5 rounded bg-muted font-bold text-foreground">{oldRep}</span>
          <span>&rarr;</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold border border-purple-500/10">{newRep}</span>
        </span>
      );
    }

    if (act.activity_type === "workspace_provisioned" || act.activity_type === "workspace_created") {
      const wName = meta.workspace_name || "CRM Sandbox";
      return (
        <span className="text-[10px] text-muted-foreground font-semibold inline-flex items-center space-x-1 mt-1.5">
          <span>Target Workspace:</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold border border-purple-500/10">{wName}</span>
        </span>
      );
    }

    if (act.activity_type === "customer_converted") {
      const customerId = meta.customer_id ? String(meta.customer_id).substring(0, 8) : "Pending";
      return (
        <span className="text-[10px] text-muted-foreground font-semibold inline-flex items-center space-x-1 mt-1.5">
          <span>Customer Profile:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/10 uppercase">ID #{customerId}</span>
        </span>
      );
    }


    return null;
  };

  const filters: { label: string; value: ActivityFilter }[] = [
    { label: "All Logs", value: "all" },
    { label: "Operator Notes", value: "notes" },
    { label: "Outreach Calls", value: "calls" },
    { label: "System Events", value: "system" },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Note submission component */}
      <AddNoteForm leadId={leadId} onNoteAdded={handleNoteAdded} />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-bold text-foreground">Operational Timeline</span>
        <div className="flex items-center space-x-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                filter === f.value
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline entries list */}
      {filteredActivities.length === 0 ? (
        <div className="p-6 bg-card border border-border rounded-xl">
          <EmptyState
            icon={Layers}
            title="No Activity Logs"
            description={
              filter === "all"
                ? "No activities recorded yet for this lead."
                : `No activity logs match the selected filter category: "${filter}".`
            }
          />
        </div>
      ) : (
        <div className="relative border-l border-border pl-6 ml-3.5 space-y-6">
          {filteredActivities.map((act) => {
            const { icon: Icon, bg, text } = getActivityIcon(act);
            return (
              <div key={act.id} className="relative group select-none">
                {/* Timeline Icon Marker Node */}
                <div
                  className={`absolute -left-[35px] top-0 h-[22px] w-[22px] rounded-full ${bg} ${text} border-2 border-background flex items-center justify-center`}
                >
                  <Icon className="h-3 w-3" />
                </div>

                {/* Activity content */}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-foreground capitalize">
                      {act.activity_type === "note_added" && act.metadata?.system_event === "tag_added"
                        ? "Tag Attached"
                        : act.activity_type === "note_added" && act.metadata?.system_event === "tag_removed"
                        ? "Tag Removed"
                        : act.activity_type === "customer_converted"
                        ? "Lead Converted"
                        : act.activity_type.replace("_", " ")}
                    </span>

                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(act.created_at), "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                    By <span className="text-foreground font-bold">{act.operatorName}</span>
                  </p>

                  {act.note && (
                    <div className="mt-2 bg-muted/20 border border-border p-3 rounded-lg text-xs text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                      {act.note}
                    </div>
                  )}

                  {/* Metadata display */}
                  {renderActivityMeta(act)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
