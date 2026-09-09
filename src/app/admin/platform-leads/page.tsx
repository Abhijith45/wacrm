import React, { Suspense } from "react";
import { PhoneCall, AlertTriangle, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { EmptyState } from "@/components/admin/common/empty-state";
import { LeadSummaryCards } from "@/components/admin/platform-leads/summary-cards";
import { LeadToolbar } from "@/components/admin/platform-leads/toolbar";
import { LeadTable } from "@/components/admin/platform-leads/table";
import { LeadPagination } from "@/components/admin/platform-leads/pagination";
import { RefreshButton } from "@/components/admin/platform-leads/refresh-button";
import { getPlatformLeads, getLeadMetrics } from "@/lib/leads/repository";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Platform Leads | SyncWA Admin",
  description: "Monitor marketing leads and qualify customer onboarding pipeline.",
};

interface SearchParams {
  q?: string;
  status?: string;
  source?: string;
  requestType?: string;
  sortBy?: "newest" | "oldest" | "name" | "company" | "status" | "request_type";
  page?: string;
}

export default async function PlatformLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  let leadsData;
  let metrics;
  let errorMsg = "";

  try {
    // 1. Fetch telemetry metrics and leads in parallel
    [leadsData, metrics] = await Promise.all([
      getPlatformLeads({
        q: params.q,
        status: params.status,
        source: params.source,
        requestType: params.requestType,
        sortBy: params.sortBy,
        page,
        pageSize: 20,
      }),
      getLeadMetrics(),
    ]);
  } catch (err) {
    console.error("[PlatformLeadsPage] Fetch failure:", err);
    errorMsg = err instanceof Error ? err.message : "Failed to load database contents.";
  }

  // 2. Error State Render
  if (errorMsg) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Platform Leads"
          description="Manage website enquiries and customer acquisition."
        >
          <RefreshButton />
        </AdminPageHeader>

        <div className="p-12 bg-destructive/5 border border-destructive/20 rounded-xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto select-none">
          <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-foreground">Database Query Error</h3>
            <p className="text-xs text-muted-foreground leading-normal max-w-sm">
              {errorMsg} Check server credentials, table relations, or database migration logs.
            </p>
          </div>
          <RefreshButton />
        </div>
      </div>
    );
  }

  // Guaranteed values post-try block
  const leads = leadsData?.leads || [];
  const totalCount = leadsData?.totalCount || 0;
  const totalPages = leadsData?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* 3. Page Header */}
      <AdminPageHeader
        title="Platform Leads"
        description="Manage website enquiries and customer acquisition."
      >
        <RefreshButton />
        <Button
          size="sm"
          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
          disabled
        >
          <Plus className="h-3 w-3 mr-1.5" />
          Add Lead
        </Button>
      </AdminPageHeader>

      {/* 4. Summary Metrics Cards */}
      {metrics && <LeadSummaryCards metrics={metrics} />}

      {/* 5. Filtering and Search Toolbar */}
      <Suspense fallback={<div className="h-16 bg-card border border-border rounded-xl animate-pulse" />}>
        <LeadToolbar />
      </Suspense>

      {/* 6. Lead Listing / Table */}
      {totalCount === 0 ? (
        <EmptyState
          icon={PhoneCall}
          title="No Platform Leads Found"
          description="Try clearing search keywords, toggling filter statuses, or visit the contact form page to register inquiries."
          actionLabel="Go to Contact Page"
          onAction={async () => {
            "use server";
            redirect("/contact");
          }}
        />
      ) : (
        <>
          <LeadTable leads={leads} />
          {/* 7. Pagination Controls */}
          <LeadPagination
            page={page}
            pageSize={20}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
