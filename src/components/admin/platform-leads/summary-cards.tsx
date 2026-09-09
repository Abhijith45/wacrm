import React from "react";
import { PhoneCall, Users, CheckSquare, Layers, Calendar, Zap, Mail } from "lucide-react";
import { MetricCard } from "@/components/admin/dashboard/metric-card";
import type { LeadMetrics } from "@/lib/leads/repository";

interface LeadSummaryCardsProps {
  metrics: LeadMetrics;
}

export function LeadSummaryCards({ metrics }: LeadSummaryCardsProps) {
  const cards = [
    {
      title: "Total leads",
      value: metrics.totalLeads,
      description: "total website enquiries",
      icon: PhoneCall,
      variant: "blue" as const,
    },
    {
      title: "New leads",
      value: metrics.newLeads,
      description: "awaiting sales qualification",
      icon: Layers,
      variant: "amber" as const,
    },
    {
      title: "Qualified leads",
      value: metrics.qualifiedLeads,
      description: "leads passed sales filters",
      icon: CheckSquare,
      variant: "purple" as const,
    },
    {
      title: "Converted leads",
      value: metrics.convertedLeads,
      description: "upgraded to trial or paid",
      icon: Users,
      variant: "emerald" as const,
    },
    {
      title: "Demo requests",
      value: metrics.demoRequests,
      description: "requested product walk-throughs",
      icon: Calendar,
      variant: "blue" as const,
    },
    {
      title: "Onboarding requests",
      value: metrics.onboardingRequests,
      description: "users waiting to activate workspace",
      icon: Zap,
      variant: "emerald" as const,
    },
    {
      title: "General enquiries",
      value: metrics.generalEnquiries,
      description: "general, support, or partnership chats",
      icon: Mail,
      variant: "neutral" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          variant={card.variant}
        />
      ))}
    </div>
  );
}
