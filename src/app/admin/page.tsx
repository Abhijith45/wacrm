import React from "react";
import Link from "next/link";
import {
  Users,
  Layers,
  PhoneCall,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Clock,
  ShieldAlert,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import {
  getPlatformCommercialMetrics,
  getPlatformCommunicationMetrics,
  getPlatformLeads,
} from "@/lib/leads/repository";

export default async function AdminDashboardPage() {
  const [commercialMetrics, commsMetrics, recentLeadsData] = await Promise.all([
    getPlatformCommercialMetrics(),
    getPlatformCommunicationMetrics(),
    getPlatformLeads({ pageSize: 4, sortBy: "newest" }),
  ]);

  const recentLeads = recentLeadsData.leads;

  const getStatusVariant = (status: string) => {
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

  const stats = [
    {
      title: "Platform Leads",
      value: String(commercialMetrics.totalLeads),
      change: "Active Inbound CRM",
      isPositive: true,
      description: "leads from contact forms",
      icon: PhoneCall,
      variant: "blue" as const,
      href: "/admin/platform-leads",
    },
    {
      title: "Active Customers",
      value: String(commercialMetrics.activeCustomers),
      change: "Production Status",
      isPositive: true,
      description: "active paying clients",
      icon: Users,
      variant: "emerald" as const,
      href: "/admin/customers",
    },
    {
      title: "Trial / Pending Approval",
      value: `${commercialMetrics.trialCustomers} / ${commercialMetrics.pendingApprovalCustomers}`,
      change: "Under Review",
      isPositive: true,
      description: "workspaces on evaluation",
      icon: Layers,
      variant: "amber" as const,
      href: "/admin/customers",
    },
    {
      title: "Onboarding Progress",
      value: `${commercialMetrics.onboardingCompleted} Completed`,
      change: `In Progress: ${commercialMetrics.onboardingInProgress}`,
      isPositive: commercialMetrics.onboardingInProgress === 0,
      description: "customer configuration progress",
      icon: Clock,
      variant: "blue" as const,
      href: "/admin/onboarding",
    },
    {
      title: "Paused / Suspended",
      value: `${commercialMetrics.pausedCustomers} / ${commercialMetrics.suspendedCustomers}`,
      change: "Action Required",
      isPositive: commercialMetrics.suspendedCustomers === 0 && commercialMetrics.pausedCustomers === 0,
      description: "temporary access restrictions",
      icon: ShieldAlert,
      variant: (commercialMetrics.suspendedCustomers > 0 ? "destructive" : "warning") as any,
      href: "/admin/customers",
    },
    {
      title: "Blocked / Archived",
      value: `${commercialMetrics.blockedCustomers} / ${commercialMetrics.archivedCustomers}`,
      change: "Historical Logs",
      isPositive: true,
      description: "permanent blocks & compliance archives",
      icon: Users,
      variant: "neutral" as const,
      href: "/admin/customers",
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Monitor system-wide SaaS operational metrics, customer onboarding stages, and qualified inbound leads."
      >
        <Link href="/admin/platform-leads">
          <Button size="sm" className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer">
            <Zap className="h-3 w-3 mr-1.5" />
            Quick Action
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block transition-transform hover:scale-[1.01]">
            <MetricCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              description={stat.description}
              icon={stat.icon}
              variant={stat.variant}
            />
          </Link>
        ))}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Leads List */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Recent Leads"
            subtitle="Latest marketing web enquiries needing qualification."
            action={
              <Link href="/admin/platform-leads">
                <Button variant="ghost" size="sm" className="text-[10px] h-7 font-bold text-primary cursor-pointer hover:bg-primary-soft">
                  View All Leads
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            }
          >
            <div className="divide-y divide-border">
              {recentLeads.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground font-semibold italic">
                  No platform leads recorded in database yet.
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/platform-leads/${lead.id}`}
                    className="py-3 flex items-center justify-between hover:bg-muted/30 px-2 rounded-xl transition-colors first:pt-2 last:pb-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary-soft border border-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground leading-snug">{lead.name}</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          {lead.company_name} &bull; {lead.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[9px] font-semibold text-muted-foreground shrink-0">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                      <StatusBadge
                        label={lead.status.replace("_", " ")}
                        variant={getStatusVariant(lead.status)}
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        {/* Operational Overview */}
        <div>
          <SectionCard
            title="Operational Health"
            subtitle="Realtime status indicators for system services."
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Auth Gateway</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Meta Webhook Service</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Healthy</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Flow Runners</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-foreground">AIReply Service</span>
                </div>
                <span className="text-[10px] text-amber-500 font-bold uppercase">Degraded (API Key)</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
