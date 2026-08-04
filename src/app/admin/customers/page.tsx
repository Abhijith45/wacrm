import React from "react";
import Link from "next/link";
import { Users, Layers, ArrowUpRight, Search, Activity } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import { EmptyState } from "@/components/admin/common/empty-state";
import { getPlatformCustomers } from "@/lib/leads/repository";
import type { PlatformCustomerStatus } from "@/types";

export default async function AdminCustomersPage() {
  const customers = await getPlatformCustomers();

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
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <AdminPageHeader
        title="Customer Directory"
        description="Monitor registered customer accounts, active profiles, and subscription details."
      />

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Registered"
          description="Platform leads converted to formal SyncWA accounts will appear in this directory automatically."
        />
      ) : (
        <SectionCard title="Active Customers Directory" subtitle="Operational view of client workspace tenants.">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 pt-1 font-bold">Company / Customer</th>
                  <th className="pb-3 pt-1 font-bold">Workspace Slug</th>
                  <th className="pb-3 pt-1 font-bold">Commercial Plan</th>
                  <th className="pb-3 pt-1 font-bold">Workspace Status</th>
                  <th className="pb-3 pt-1 font-bold">Created Date</th>
                  <th className="pb-3 pt-1 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.map((cust) => {
                  const account = cust.accounts?.[0]; // Linked account mapping
                  const workspaceStatus = account ? account.status : "inactive";
                  const workspaceSlug = account ? account.slug : "N/A";
                  const createdDate = new Date(cust.created_at).toLocaleDateString();

                  return (
                    <tr key={cust.id} className="hover:bg-muted/15 transition-colors group">
                      <td className="py-3.5 pr-3">
                        <div>
                          <span className="block font-black text-foreground text-[13px] leading-tight group-hover:text-primary transition-colors">
                            {cust.company_name}
                          </span>
                          <span className="block text-[10px] text-muted-foreground/80 font-semibold leading-snug">
                            {cust.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono">
                          {workspaceSlug}
                        </code>
                      </td>

                      <td className="py-3.5 pr-3">
                        <StatusBadge
                          label={cust.status.replace("_", " ")}
                          variant={getPlanColor(cust.status)}
                        />
                      </td>

                      <td className="py-3.5 pr-3">
                        <StatusBadge
                          label={workspaceStatus}
                          variant={workspaceStatus === "active" ? "success" : "destructive"}
                        />
                      </td>

                      <td className="py-3.5 pr-3 text-muted-foreground font-semibold">
                        {createdDate}
                      </td>

                      <td className="py-3.5 text-right pl-3">
                        <Link href={`/admin/customers/${cust.id}`}>
                          <button className="inline-flex items-center space-x-1 text-[11px] font-black text-primary hover:text-primary-hover uppercase tracking-wider cursor-pointer">
                            <span>Open Cockpit</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
