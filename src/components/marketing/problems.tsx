import React from "react";
import {
  MessageSquare,
  Users,
  Clock,
  GitBranch,
  TrendingUp,
  ArrowDown,
} from "lucide-react";

export function Problems() {
  const problems = [
    {
      problem: "Multiple employees replying from different phones",
      solution: "Centralize conversations with a shared team inbox.",
      icon: MessageSquare,
      iconColor: "text-primary bg-primary-soft",
    },
    {
      problem: "Customer information scattered everywhere",
      solution: "Maintain complete customer profiles and interaction history.",
      icon: Users,
      iconColor: "text-emerald-500 bg-emerald-500/10",
    },
    {
      problem: "Manual follow-ups consume valuable time",
      solution: "Automate repetitive tasks and reminders.",
      icon: Clock,
      iconColor: "text-amber-500 bg-amber-500/10",
    },
    {
      problem: "Difficult to track sales opportunities",
      solution: "Manage leads and monitor your sales pipeline.",
      icon: GitBranch,
      iconColor: "text-cobalt-500 bg-cobalt-500/10",
    },
    {
      problem: "Limited visibility into team performance",
      solution: "Access reports and analytics from one dashboard.",
      icon: TrendingUp,
      iconColor: "text-rose-500 bg-rose-500/10",
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Headers */}
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Managing Customers Shouldn't Be Complicated
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Many businesses rely on WhatsApp every day—but managing conversations across multiple people quickly becomes difficult. SyncWA helps organize customer communication, sales, and team collaboration in one place.
          </p>
        </div>

        {/* Problem-Solution Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-primary/30 transition-colors"
              >
                {/* Header Icon & Problem Statement */}
                <div className="space-y-3">
                  <div className={`h-8 w-8 rounded flex items-center justify-center ${p.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    The Problem
                  </h3>
                  <p className="text-sm font-bold text-foreground leading-snug">
                    {p.problem}
                  </p>
                </div>

                {/* Transition Indicator */}
                <div className="flex items-center text-muted-foreground/60 py-1 select-none">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider ml-1">Resolution</span>
                </div>

                {/* Solution Statement */}
                <div className="bg-background border border-border/80 rounded p-3 text-xs leading-normal">
                  <span className="font-semibold text-primary block mb-0.5">SyncWA Answer</span>
                  <p className="text-foreground">{p.solution}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
