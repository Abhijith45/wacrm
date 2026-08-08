"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { PlatformLead, PlatformLeadStatus } from "@/types";


interface LeadTableProps {
  leads: PlatformLead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const searchParams = useSearchParams();
  const refQuery = searchParams.toString();

  // Status semantic variant mapper
  const getStatusVariant = (status: PlatformLeadStatus) => {
    switch (status) {
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

  const getRequestTypeVariant = (requestType: string) => {
    switch (requestType) {
      case "DEMO":
        return "info" as const;
      case "ONBOARDING":
        return "success" as const;
      case "GENERAL":
        return "neutral" as const;
      case "PARTNERSHIP":
        return "warning" as const;
      case "TECHNICAL":
        return "destructive" as const;
      default:
        return "neutral" as const;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Request Type</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs font-semibold text-foreground">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/10 transition-colors">
                {/* Status Column */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <StatusBadge
                    label={lead.status.replace("_", " ")}
                    variant={getStatusVariant(lead.status)}
                  />
                </td>

                {/* Request Type Column */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <StatusBadge
                    label={lead.request_type.toLowerCase()}
                    variant={getRequestTypeVariant(lead.request_type)}
                  />
                </td>

                {/* Name Column */}
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-foreground">
                  {lead.name}
                </td>

                {/* Company Column */}
                <td className="px-6 py-3.5 whitespace-nowrap text-muted-foreground">
                  {lead.company_name}
                </td>

                {/* Email Column */}
                <td className="px-6 py-3.5 whitespace-nowrap text-muted-foreground">
                  {lead.email}
                </td>

                {/* Phone Column */}
                <td className="px-6 py-3.5 whitespace-nowrap text-muted-foreground">
                  {lead.phone || "—"}
                </td>

                {/* Source Column */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize font-bold">
                    {lead.source.replace("_", " ")}
                  </span>
                </td>

                {/* Created Date Column */}
                <td className="px-6 py-3.5 whitespace-nowrap text-muted-foreground">
                  {format(new Date(lead.created_at), "MMM dd, yyyy HH:mm")}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-3.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {/* View Details Action Link */}
                    <Link href={`/admin/platform-leads/${lead.id}${refQuery ? `?ref=${encodeURIComponent(refQuery)}` : ""}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-primary-soft hover:text-primary cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>


                    {/* Placeholder for more actions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:bg-muted cursor-pointer"
                      title="More Actions"
                      disabled
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
