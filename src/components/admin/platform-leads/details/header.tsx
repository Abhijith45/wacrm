"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronRight, RefreshCw, UserCheck, Play, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { PlatformLead } from "@/types";

interface LeadHeaderProps {
  lead: PlatformLead;
  onConvert?: () => void;
  isConverting?: boolean;
}

export function LeadHeader({ lead, onConvert, isConverting }: LeadHeaderProps) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL reference parameter to preserve active listing query filters
  const ref = searchParams.get("ref");
  const returnHref = ref ? `/admin/platform-leads?${decodeURIComponent(ref)}` : "/admin/platform-leads";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col space-y-4 p-6 bg-card border border-border rounded-xl select-none">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-muted-foreground">
        <Link href={returnHref} className="hover:text-foreground transition-colors flex items-center space-x-1">
          <ArrowLeft className="h-3 w-3 mr-0.5" />
          <span>Platform Leads</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
        <span className="text-foreground font-bold truncate max-w-xs">{lead.name}</span>
      </div>

      {/* Title Details & Action Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-black text-foreground tracking-tight leading-none">
              {lead.name}
            </h2>
            <StatusBadge
              label={lead.status.replace("_", " ")}
              variant={
                lead.status === "qualified" || lead.status === "converted" || lead.status === "demo_completed"
                  ? "success"
                  : lead.status === "lost"
                  ? "destructive"
                  : lead.status === "new"
                  ? "info"
                  : "warning"
              }
            />
          </div>
          <p className="text-xs text-muted-foreground leading-normal">
            Enquiry from <span className="font-bold text-foreground">{lead.company_name}</span> &bull; Source: <span className="capitalize">{lead.source.replace("_", " ")}</span>
          </p>
        </div>

        {/* Actions - Reserved placeholders with disable indicators */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Action */}
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted/50 cursor-pointer"
            disabled={isPending}
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5 text-muted-foreground", isPending && "animate-spin")} />
            Refresh
          </Button>

          {/* Assign Placeholder */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted/50 cursor-not-allowed"
            disabled
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Assign Operator
          </Button>

          {/* Convert to Customer Button */}
          <Button
            onClick={onConvert}
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
            disabled={
              isConverting || 
              (lead.status !== "qualified" && lead.status !== "demo_completed")
            }
          >
            {isConverting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Convert to Customer
              </>
            )}
          </Button>


          {/* Delete Placeholder */}
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs font-semibold hover:bg-destructive-hover cursor-not-allowed"
            disabled
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// CN helper fallback (in case it is not imported)
import { cn } from "@/lib/utils";
