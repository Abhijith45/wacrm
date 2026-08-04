import React from "react";
import {
  MessageSquare,
  Users,
  GitBranch,
  Radio,
  Zap,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export function ProductOverview() {
  const pillars = [
    {
      name: "Communication",
      desc: "Manage customer messaging in a shared inbox with templates, reactions, and attachments.",
      icon: MessageSquare,
    },
    {
      name: "CRM",
      desc: "Maintain profiles with custom fields, color tags, notes, and auto phone de-duplication.",
      icon: Users,
    },
    {
      name: "Sales",
      desc: "Track opportunities and expected deal values on visual Kanban pipeline boards.",
      icon: GitBranch,
    },
    {
      name: "Marketing",
      desc: "Reach bulk target segments using official template broadcast outreach campaigns.",
      icon: Radio,
    },
    {
      name: "Automation",
      desc: "Build automated messaging rules and visual branching Flows chatbots without coding.",
      icon: Zap,
    },
    {
      name: "Analytics",
      desc: "Access dashboard charts monitoring message volumes, response times, and AI spend.",
      icon: TrendingUp,
    },
    {
      name: "Team Collaboration",
      desc: "Assign conversation owners, share internal notes, and track agent presence states.",
      icon: UserCheck,
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 border-b border-border bg-card/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Header Title */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Everything You Need to Manage Customer Relationships
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            SyncWA combines multiple business capabilities into one integrated platform.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-5 space-y-4 hover:border-primary/30 transition-colors"
              >
                <div className="h-8 w-8 rounded bg-primary-soft flex items-center justify-center text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{pillar.name}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
