import React from "react";
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
import { getPlatformCommercialMetrics, getPlatformCommunicationMetrics } from "@/lib/leads/repository";

export default async function AdminDashboardPage() {
  const [commercialMetrics, commsMetrics] = await Promise.all([
    getPlatformCommercialMetrics(),
    getPlatformCommunicationMetrics(),
  ]);

  const stats = [
    {
      title: "Platform Leads",
      value: String(commercialMetrics.totalLeads),
      change: "+12.5%",
      isPositive: true,
      description: "from public contact forms",
      icon: PhoneCall,
      variant: "blue" as const,
    },
    {
      title: "Active Customers",
      value: String(commercialMetrics.activeCustomers),
      change: "+8.3%",
      isPositive: true,
      description: "active paying clients",
      icon: Users,
      variant: "emerald" as const,
    },
    {
      title: "Trial Customers",
      value: String(commercialMetrics.trialCustomers),
      change: "+4.2%",
      isPositive: true,
      description: "workspaces in trial status",
      icon: Layers,
      variant: "amber" as const,
    },
    {
      title: "Expiring Soon",
      value: String(commercialMetrics.expiringSoonCustomers),
      change: "Warning",
      isPositive: false,
      description: "trials expiring within 3 days",
      icon: Clock,
      variant: "amber" as const,
    },
    {
      title: "Emails Sent Today",
      value: String(commsMetrics.sentToday),
      change: "Lifecycle",
      isPositive: true,
      description: "notifications sent today",
      icon: Mail,
      variant: "purple" as const,
    },
    {
      title: "Deliveries (Sent / Fail)",
      value: `${commsMetrics.successful} / ${commsMetrics.failed}`,
      change: `Pending: ${commsMetrics.pending}`,
      isPositive: commsMetrics.failed === 0,
      description: "communication results logs",
      icon: Mail,
      variant: commsMetrics.failed > 0 ? ("destructive" as any) : ("emerald" as any),
    },
  ];

  const recentLeads = [
    { name: "Jane Cooper", company: "Acme Corp", email: "jane@acme.com", status: "new", variant: "info" as const, date: "2 mins ago" },
    { name: "Alex Rivera", company: "Zapier Tech", email: "alex@zapier.com", status: "qualified", variant: "success" as const, date: "15 mins ago" },
    { name: "Ivan Kovac", company: "Kovac Law", email: "ivan@kovac.com", status: "contacted", variant: "warning" as const, date: "1 hour ago" },
    { name: "Sarah Connor", company: "Cyberdyne Systems", email: "sarah@cyberdyne.com", status: "demo_scheduled", variant: "info" as const, date: "3 hours ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Monitor system-wide SaaS operational metrics, customer onboarding stages, and qualified inbound leads."
      >
        <Button size="sm" className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer">
          <Zap className="h-3 w-3 mr-1.5" />
          Quick Action
        </Button>
      </AdminPageHeader>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
          />
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
              <Button variant="ghost" size="sm" className="text-[10px] h-7 font-bold text-primary cursor-pointer hover:bg-primary-soft">
                View All Leads
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            }
          >
            <div className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <div key={lead.email} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-snug">{lead.name}</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {lead.company} &bull; {lead.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-semibold text-muted-foreground shrink-0">{lead.date}</span>
                    <StatusBadge label={lead.status.replace("_", " ")} variant={lead.variant} />
                  </div>
                </div>
              ))}
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
