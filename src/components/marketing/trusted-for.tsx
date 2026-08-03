import React from "react";
import {
  TrendingUp,
  Headphones,
  GraduationCap,
  Building,
  Target,
  Briefcase,
} from "lucide-react";

export function TrustedFor() {
  const cards = [
    {
      title: "Sales Teams",
      description: "Track deals, forecast pipeline values, and convert leads directly inside WhatsApp chat timelines.",
      icon: TrendingUp,
    },
    {
      title: "Customer Support",
      description: "Collaborate in a shared team inbox, answer FAQs automatically, and assign conversations to owners.",
      icon: Headphones,
    },
    {
      title: "Education Consultants",
      description: "Manage prospective student enquiries, track application stages, and broadcast updates.",
      icon: GraduationCap,
    },
    {
      title: "Real Estate",
      description: "Capture listing queries, send photos, and hand off active leads to field agents.",
      icon: Building,
    },
    {
      title: "Agencies",
      description: "Deliver template campaigns, run segmented outreach broadcasts, and verify read metrics.",
      icon: Target,
    },
    {
      title: "Small Businesses",
      description: "Keep complete control over customer data with zero agent seat licensing fees.",
      icon: Briefcase,
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 border-b border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Headers */}
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Built for Growing Businesses
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Whether you're managing sales, customer support, or marketing, SyncWA helps your team stay connected and organized.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-6 space-y-4 hover:border-primary/40 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
