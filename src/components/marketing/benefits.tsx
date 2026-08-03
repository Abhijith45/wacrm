import React from "react";
import {
  Layers,
  Users2,
  Zap,
  History,
  Workflow,
  ShieldCheck,
} from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      title: "One platform instead of multiple tools",
      desc: "Consolidate your customer interactions, sales pipeline tracking, and chatbot configurations under a single unified dashboard.",
      icon: Layers,
    },
    {
      title: "Improve team collaboration",
      desc: "Assign conversation assignees, record internal notes on timeline profiles, and track active team presence indicators.",
      icon: Users2,
    },
    {
      title: "Respond faster to customers",
      desc: "Leverage approved message templates, instant quick replies, and contextual AI drafts to answer customer inquiries rapidly.",
      icon: Zap,
    },
    {
      title: "Track every customer interaction",
      desc: "Maintain a single, clean timeline of notes, message histories, and linked deals, de-duplicated automatically by E.164 phone numbers.",
      icon: History,
    },
    {
      title: "Reduce manual work",
      desc: "Delegate routine answering to visual chatbots and automate data entries or webhook alerts using trigger-action rules.",
      icon: Workflow,
    },
    {
      title: "Grow with confidence",
      desc: "Enjoy complete control over your credentials and customer records on your own dedicated Supabase database with zero per-seat fees.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Why Businesses Choose SyncWA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            By shifting from rigid monthly SaaS platforms to an open-source, self-hosted template, you gain total structural flexibility and cost control.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-6 space-y-4 hover:border-primary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground leading-snug">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
