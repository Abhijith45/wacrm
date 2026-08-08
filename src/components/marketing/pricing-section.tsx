"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

interface FeatureSection {
  title: string;
  features: PlanFeature[];
}

interface Plan {
  id: string;
  name: string;
  badge: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  ctaText: string;
  ctaHref: string;
  isPopular?: boolean;
  includes: string[];
}

export const PRICING_CONFIG = {
  savingPercentage: 20,
  plans: [
    {
      id: "starter",
      name: "Starter",
      badge: "Best for Individuals",
      description: "Perfect for individuals and small teams getting started with customer communication.",
      priceMonthly: "Coming Soon",
      priceYearly: "Coming Soon",
      ctaText: "Book a Demo",
      ctaHref: "/contact",
      includes: [
        "Shared Team Inbox",
        "Contact Management",
        "Lead Management",
        "Basic Analytics",
        "Broadcast Campaigns",
        "Workflow Automation",
        "Email Support"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      badge: "Most Popular",
      description: "Designed for growing businesses managing larger teams and customer operations.",
      priceMonthly: "Coming Soon",
      priceYearly: "Coming Soon",
      ctaText: "Book a Demo",
      ctaHref: "/contact",
      isPopular: true,
      includes: [
        "Everything in Starter",
        "Advanced Analytics",
        "Sales Pipeline",
        "Advanced Automation",
        "Team Collaboration",
        "Roles & Permissions",
        "Priority Support",
        "API Access"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Custom Solution",
      description: "For organizations requiring advanced customization, dedicated support, and enterprise-grade scalability.",
      priceMonthly: "Contact Sales",
      priceYearly: "Contact Sales",
      ctaText: "Contact Sales",
      ctaHref: "/contact",
      includes: [
        "Everything in Professional",
        "Dedicated Success Manager",
        "Custom Integrations",
        "Enterprise Security",
        "Advanced Permissions",
        "Custom Workflows",
        "Priority Infrastructure",
        "Dedicated Onboarding",
        "Custom SLAs"
      ]
    }
  ] as Plan[],
  comparisonSections: [
    {
      title: "Communication",
      features: [
        { name: "Shared Team Inbox", starter: true, professional: true, enterprise: true },
        { name: "Real-time Conversations", starter: true, professional: true, enterprise: true },
        { name: "Quick Replies & Snippets", starter: true, professional: true, enterprise: true },
        { name: "Approved Media Templates", starter: true, professional: true, enterprise: true }
      ]
    },
    {
      title: "CRM",
      features: [
        { name: "Contacts Directory", starter: true, professional: true, enterprise: true },
        { name: "Lead Profiles & History", starter: true, professional: true, enterprise: true },
        { name: "Custom Fields & Tags", starter: "Basic", professional: "Unlimited", enterprise: "Unlimited" }
      ]
    },
    {
      title: "Sales",
      features: [
        { name: "Sales Pipeline (Kanban)", starter: false, professional: true, enterprise: true },
        { name: "Opportunity Tracking", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      title: "Marketing",
      features: [
        { name: "Broadcast Campaigns", starter: true, professional: true, enterprise: true },
        { name: "Customer Segmentation", starter: "Basic", professional: "Advanced", enterprise: "Advanced" }
      ]
    },
    {
      title: "Automation",
      features: [
        { name: "Workflow Flow Builder", starter: "Basic (2 flows)", professional: "Advanced (10 flows)", enterprise: "Custom" },
        { name: "Auto Assignment", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      title: "Analytics",
      features: [
        { name: "Dashboard Reports", starter: "Basic", professional: "Advanced", enterprise: "Full Custom" },
        { name: "Agent Performance Logs", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      title: "Administration",
      features: [
        { name: "User Roles & Permissions", starter: false, professional: true, enterprise: true },
        { name: "Activity Logs Session Audit", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      title: "Support",
      features: [
        { name: "Customer Support Tier", starter: "Email Support", professional: "Priority Support", enterprise: "Dedicated Manager + SLA" }
      ]
    },
    {
      title: "API",
      features: [
        { name: "REST API Access", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      title: "Security",
      features: [
        { name: "Enterprise-grade Isolation", starter: false, professional: false, enterprise: true }
      ]
    },
    {
      title: "Storage",
      features: [
        { name: "Data Logs Retention", starter: "30 days", professional: "90 days", enterprise: "Unlimited" }
      ]
    },
    {
      title: "Limits",
      features: [
        { name: "Connected WhatsApp Numbers", starter: "1 number", professional: "Up to 3", enterprise: "Custom limits" }
      ]
    }
  ] as FeatureSection[]
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const renderVal = (val: boolean | string) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
      ) : (
        <span className="text-muted-foreground/40 font-mono">—</span>
      );
    }
    return <span className="text-xs font-medium text-foreground">{val}</span>;
  };

  return (
    <div className="w-full space-y-16">
      {/* 4. Billing Toggle */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center bg-card border border-border p-1 rounded-full relative">
          <button
            type="button"
            role="switch"
            aria-checked={!isYearly}
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              !isYearly
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={isYearly}
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              isYearly
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
          </button>
        </div>
        {isYearly && (
          <span className="text-[10px] font-bold text-primary bg-primary-soft border border-primary/20 px-2.5 py-0.5 rounded-full">
            Save {PRICING_CONFIG.savingPercentage}% with annual billing
          </span>
        )}
      </div>

      {/* 5. Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-6">
        {PRICING_CONFIG.plans.map((plan) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between p-6 bg-card border rounded-2xl transition-all duration-300",
                plan.isPopular
                  ? "border-primary shadow-lg md:scale-105 z-10"
                  : "border-border hover:border-primary/20"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  {!plan.isPopular && (
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-2">
                  <p className="text-2xl md:text-3xl font-extrabold text-foreground">
                    {price}
                  </p>
                  {price !== "Coming Soon" && price !== "Contact Sales" && (
                    <span className="text-[10px] text-muted-foreground">
                      per user / month
                    </span>
                  )}
                </div>

                {/* Includes List */}
                <div className="border-t border-border/50 pt-4 space-y-2.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    What's Included
                  </span>
                  <ul className="space-y-2 text-xs">
                    {plan.includes.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-6">
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    buttonVariants({
                      variant: plan.isPopular ? "default" : "outline",
                      size: "sm"
                    }),
                    "w-full flex items-center justify-center space-x-1.5"
                  )}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Compare Plans
          </h2>
          <p className="text-xs text-muted-foreground">
            Explore a detailed comparison of features and capabilities.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto border border-border rounded-xl bg-card">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="p-4 font-bold text-muted-foreground w-2/5">Capability</th>
                <th className="p-4 font-bold text-center text-foreground w-1/5">Starter</th>
                <th className="p-4 font-bold text-center text-foreground w-1/5">Professional</th>
                <th className="p-4 font-bold text-center text-foreground w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRICING_CONFIG.comparisonSections.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr className="bg-muted/10 border-t border-border">
                    <td
                      colSpan={4}
                      className="p-3 font-bold text-primary text-[10px] uppercase tracking-wider"
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.features.map((feature, fIdx) => (
                    <tr key={fIdx} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3.5 text-muted-foreground font-medium pl-6">
                        {feature.name}
                      </td>
                      <td className="p-3.5 text-center">{renderVal(feature.starter)}</td>
                      <td className="p-3.5 text-center">{renderVal(feature.professional)}</td>
                      <td className="p-3.5 text-center">{renderVal(feature.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion/Card View */}
        <div className="md:hidden space-y-4">
          {PRICING_CONFIG.comparisonSections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border pb-1">
                {section.title}
              </h3>
              <div className="space-y-3.5 divide-y divide-border/40">
                {section.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className={cn("pt-3 space-y-2 text-xs", fIdx === 0 && "pt-0 border-t-0")}
                  >
                    <span className="font-semibold text-muted-foreground block">
                      {feature.name}
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-1.5 bg-muted/40 rounded border border-border/40 space-y-0.5">
                        <span className="text-[8px] text-muted-foreground uppercase block font-bold">
                          Starter
                        </span>
                        <div className="flex justify-center pt-0.5">
                          {renderVal(feature.starter)}
                        </div>
                      </div>
                      <div className="p-1.5 bg-muted/40 rounded border border-border/40 space-y-0.5">
                        <span className="text-[8px] text-muted-foreground uppercase block font-bold">
                          Professional
                        </span>
                        <div className="flex justify-center pt-0.5">
                          {renderVal(feature.professional)}
                        </div>
                      </div>
                      <div className="p-1.5 bg-muted/40 rounded border border-border/40 space-y-0.5">
                        <span className="text-[8px] text-muted-foreground uppercase block font-bold">
                          Enterprise
                        </span>
                        <div className="flex justify-center pt-0.5">
                          {renderVal(feature.enterprise)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
