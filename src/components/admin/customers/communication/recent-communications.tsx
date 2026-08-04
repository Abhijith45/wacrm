"use client";

import React from "react";
import { Mail, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { CommunicationHistoryRecord } from "@/lib/services/communication/types";

interface RecentCommunicationsProps {
  communications: CommunicationHistoryRecord[];
  onRetry: (historyId: string) => Promise<void>;
  loading: boolean;
}

export function RecentCommunications({
  communications,
  onRetry,
  loading,
}: RecentCommunicationsProps) {
  
  const getStatusIconAndLabel = (status: string) => {
    switch (status) {
      case "sent":
        return {
          icon: CheckCircle2,
          color: "text-emerald-500",
          badgeColor: "success" as const,
        };
      case "failed":
        return {
          icon: XCircle,
          color: "text-destructive",
          badgeColor: "destructive" as const,
        };
      default:
        return {
          icon: Clock,
          color: "text-amber-500",
          badgeColor: "warning" as const,
        };
    }
  };

  return (
    <SectionCard title="Lifecycle Communications" subtitle="Tracking automated system notifications.">
      <div className="space-y-4 text-xs font-semibold select-none">
        
        {communications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground/60 font-semibold italic">
            No communication events recorded for this customer yet.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-semibold border-collapse" aria-label="Customer Communication History">
              <thead>
                <tr className="border-b border-border text-[9px] text-muted-foreground uppercase tracking-wider">
                  <th className="pb-2.5 font-bold">Template / Subject</th>
                  <th className="pb-2.5 font-bold">Recipient</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Retries</th>
                  <th className="pb-2.5 font-bold">Dispatched At</th>
                  <th className="pb-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {communications.map((comm) => {
                  const ui = getStatusIconAndLabel(comm.status);
                  const Icon = ui.icon;
                  const dateStr = new Date(comm.created_at).toLocaleString();

                  return (
                    <tr key={comm.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 pr-2.5 max-w-[200px]">
                        <div className="flex items-start space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block font-black text-[11px] leading-tight text-foreground capitalize">
                              {comm.template_name.replace("_", " ")}
                            </span>
                            <span className="block text-[9px] text-muted-foreground/65 font-medium leading-normal truncate">
                              {comm.failure_reason || "Delivered successfully"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 pr-2.5 text-muted-foreground font-mono text-[10px] truncate max-w-[120px]">
                        {comm.recipient}
                      </td>

                      <td className="py-3 pr-2.5">
                        <div className="flex items-center space-x-1.5">
                          <Icon className={`h-3.5 w-3.5 ${ui.color} shrink-0`} />
                          <StatusBadge label={comm.status} variant={ui.badgeColor} />
                        </div>
                      </td>

                      <td className="py-3 pr-2.5 text-muted-foreground">
                        {comm.retry_count} / 3
                      </td>

                      <td className="py-3 pr-2.5 text-muted-foreground font-medium text-[10px]">
                        {dateStr}
                      </td>

                      <td className="py-3 text-right pl-2.5">
                        {comm.status === "failed" && (
                          <button
                            onClick={() => onRetry(comm.id)}
                            disabled={loading || comm.retry_count >= 3}
                            className="inline-flex items-center space-x-1 text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label={`Retry sending template ${comm.template_name}`}
                          >
                            <RefreshCw className="h-3 w-3 shrink-0" />
                            <span>Retry</span>
                          </button>
                        )}
                        {comm.status === "sent" && (
                          <span className="text-[9px] text-emerald-500 font-bold uppercase">Dispatched</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </SectionCard>
  );
}
