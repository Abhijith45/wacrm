import React from "react";
import {
  MessageSquare,
  Users,
  GitBranch,
  Radio,
  Zap,
  TrendingUp,
  Shield,
  Bot,
} from "lucide-react";

export function Features() {
  const coreFeatures = [
    {
      title: "Shared Team Inbox",
      description: "Manage WhatsApp conversations collaboratively. Assign chats, update thread statuses, react to messages, and compose responses using templates.",
      icon: MessageSquare,
    },
    {
      title: "Contact Management",
      description: "Keep customer information organized. Catalog metadata details with custom fields, tag markers, history notes, and merge duplicates automatically.",
      icon: Users,
    },
    {
      title: "Lead Management",
      description: "Track every opportunity from enquiry to conversion. Drag-and-drop deals across customized stages on visual Kanban pipeline boards.",
      icon: GitBranch,
    },
    {
      title: "Broadcast Campaigns",
      description: "Reach customers efficiently using approved templates. Target custom contact tags segments, map body variables, and schedule outreach.",
      icon: Radio,
    },
    {
      title: "Workflow Automation",
      description: "Reduce repetitive work through automation. Configure trigger-action rules and design interactive branching chatbots on a visual canvas.",
      icon: Zap,
    },
    {
      title: "Reports & Analytics",
      description: "Understand business performance with actionable insights. Access dashboard charts monitoring messaging volumes and average agent speeds.",
      icon: TrendingUp,
    },
    {
      title: "Roles & Permissions",
      description: "Give every team member the right level of access. Define owners, admins, agents, and viewers to protect configurations and secrets.",
      icon: Shield,
    },
    {
      title: "AI Assistance",
      description: "Improve productivity using intelligent assistance. Ground AI completions in uploaded FAQs, generate composer drafts, and enable auto-replies.",
      icon: Bot,
    },
  ];

  return (
    <section id="features" className="w-full py-16 md:py-20 border-b border-border bg-background scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Headers */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Designed for Modern Teams
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Every feature is developed to deliver production-grade stability, visual consistency, and data residency security.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-5 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="h-8 w-8 rounded bg-primary-soft flex items-center justify-center text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{f.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
