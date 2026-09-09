import React from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { StatusBadge } from "@/components/admin/common/status-badge";
import { getPlatformOnboardingTelemetry } from "@/lib/leads/repository";
import type { PlatformCustomerStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOnboardingPage() {
  const telemetry = await getPlatformOnboardingTelemetry();

  const getStatusColor = (status: PlatformCustomerStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "trial":
        return "warning";
      case "paused":
        return "info";
      case "suspended":
        return "destructive";
      case "cancelled":
        return "destructive";
      case "blocked":
        return "destructive";
      case "archived":
        return "neutral";
      default:
        return "info";
    }
  };

  const getActionCue = (stage: string) => {
    switch (stage) {
      case "invitation_sent":
        return "Verification pending";
      case "profile_setup":
        return "Invite teammates";
      case "team_setup":
        return "Establish API connection";
      case "whatsapp_connected":
        return "Seeding first contact";
      case "crm_initialized":
        return "Trigger first campaign";
      case "first_activity":
        return "Optimize pipelines";
      case "completed":
        return "Onboarding finalized";
      default:
        return "Audit compliance";
    }
  };

  const getStageLabel = (stage: string) => {
    return stage.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="space-y-6 select-none">
      <AdminPageHeader
        title="Onboarding Telemetry"
        description="Review workspace configuration milestones, checklist compliance, and customer activation parameters."
      />

      {telemetry.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-4">
          <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-sm font-bold text-foreground">No Onboarding telemetry</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Once client workspaces are provisioned, their configuration checklists and milestone trackers will display here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-[10px] uppercase font-bold tracking-wider text-muted-foreground select-none">
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Workspace Slug</th>
                  <th className="py-3 px-5">Plan status</th>
                  <th className="py-3 px-5">Active stage</th>
                  <th className="py-3 px-5 text-center">Milestones %</th>
                  <th className="py-3 px-5">Trial Remaining</th>
                  <th className="py-3 px-5">Last Activity</th>
                  <th className="py-3 px-5">Recommended action</th>
                  <th className="py-3 px-5 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.map((client) => {
                  const trialExpiryDays = client.trialEndsAt
                    ? Math.max(0, Math.ceil((new Date(client.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    : 0;

                  return (
                    <tr
                      key={client.customerId}
                      className="border-b border-border hover:bg-muted/10 transition-colors text-xs font-semibold text-foreground select-none"
                    >
                      <td className="py-3.5 px-5 font-black">{client.companyName}</td>
                      <td className="py-3.5 px-5 text-muted-foreground font-bold">{client.slug}</td>
                      <td className="py-3.5 px-5">
                        <StatusBadge
                          label={client.commercialStatus.replace("_", " ")}
                          variant={getStatusColor(client.commercialStatus)}
                        />
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] font-black uppercase text-foreground bg-primary/10 text-primary border border-primary/15 px-2 py-0.5 rounded">
                          {getStageLabel(client.onboardingStage)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[11px] font-black">{client.progressPercentage}%</span>
                          <div className="w-16 bg-muted border border-border/60 h-2 rounded-full overflow-hidden shrink-0">
                            <div
                              className="bg-primary h-full transition-all duration-500"
                              style={{ width: `${client.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        {client.commercialStatus === "trial" ? (
                          <span className={trialExpiryDays <= 3 ? "text-destructive font-black" : "text-muted-foreground"}>
                            {trialExpiryDays} Days
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-muted-foreground">
                        {new Date(client.lastActivityDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/15 px-2.5 py-0.5 rounded-full">
                          {getActionCue(client.onboardingStage)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link href={`/admin/customers/${client.customerId}`}>
                          <button className="inline-flex items-center text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-wider cursor-pointer">
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
