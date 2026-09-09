import React from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Mail, Shield, Zap, Sparkles, MessageSquare, Check, Users, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { PricingSection } from "@/components/marketing/pricing-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = {
  title: "Pricing",
  description: "Simple pricing plans for growing teams. No hidden user seat fees. Pay only for what you consume.",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const choices = [
    {
      icon: Target,
      title: "Start small and scale later",
      desc: "Begin with our Starter tier and upgrade elements dynamically as your customer logs expand."
    },
    {
      icon: Zap,
      title: "No unnecessary complexity",
      desc: "Every configuration is optimized to ensure you can self-host and sync your official WhatsApp API in clicks."
    },
    {
      icon: MessageSquare,
      title: "Designed for modern businesses",
      desc: "Tailored around visual flows, quick replies, broadcast templates, and shared team workspace structures."
    },
    {
      icon: Shield,
      title: "Transparent pricing",
      desc: "No seat license markups. You always pay the direct Meta Cloud API fees and host costs."
    },
    {
      icon: Sparkles,
      title: "Flexible upgrade path",
      desc: "Transition smoothly between Starter, Professional, and Enterprise plans with zero loss of timeline data."
    },
    {
      icon: Users,
      title: "Dedicated business support",
      desc: "Access our technical engineers and specialists to troubleshoot custom webhooks and deployment integrations."
    }
  ];

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes. You can upgrade, downgrade, or transfer your tier details directly from your settings panel at any time."
    },
    {
      q: "Is there a free trial?",
      a: "Yes, we offer a 14-day free trial on our hosted instance so you can connect your test number and build visual chatbot flows."
    },
    {
      q: "What happens when my trial ends?",
      a: "After 14 days, you can choose to enter your billing details to keep running on our cloud instances, or export your DB schema to self-host for free."
    },
    {
      q: "Can I upgrade anytime?",
      a: "Yes, upgrades apply instantly. Plan parameters are adjusted dynamically in your active session."
    },
    {
      q: "Do you offer annual billing?",
      a: "Yes. Annual billing is available and offers a 20% discount compared to monthly cycles."
    },
    {
      q: "Can I contact sales before purchasing?",
      a: "Of course! Drop us a line at support@syncwa.com and our integration architects will guide you through the setup steps."
    },
    {
      q: "Do you offer enterprise pricing?",
      a: "Yes. For organizations with high-volume requirements or custom SLA dependencies, contact us at support@syncwa.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* 1. Header */}
      <Header isLoggedIn={isLoggedIn} />

      {/* 2. Hero Section */}
      <section className="relative w-full overflow-hidden py-16 md:py-24 border-b border-border bg-gradient-to-b from-card/30 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.526_0.247_293_/_0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-xs font-semibold select-none">
            <span>💳 Pricing</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Simple Pricing for Growing Businesses
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Choose the plan that best fits your business today and scale as your team grows. No hidden fees. Upgrade whenever you're ready.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href={isLoggedIn ? "/dashboard" : "/contact"}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>{isLoggedIn ? "Go to Dashboard" : "Book a Demo"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-center")}
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Pricing Philosophy */}
      <section className="w-full py-12 md:py-16 border-b border-border bg-card/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Built to Grow with Your Business
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether you're just getting started or managing a growing team, SyncWA offers flexible plans designed to support your business at every stage.
          </p>
        </div>
      </section>

      {/* 4, 5, 6. Billing Toggle, Pricing Cards, Comparison Table */}
      <section className="w-full py-16 border-b border-border">
        <PricingSection />
      </section>

      {/* 7. Why Choose SyncWA */}
      <section className="w-full py-16 md:py-20 border-b border-border bg-card/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Why Choose SyncWA
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discover what makes our model ideal for self-hostable CRM operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {choices.map((item, idx) => (
              <div key={idx} className="p-6 bg-card border border-border rounded-xl space-y-3 hover:border-primary/20 transition-all">
                <div className="h-9 w-9 rounded bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-xs md:text-sm text-foreground">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="w-full py-16 md:py-20 border-b border-border bg-card/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find answers to common questions regarding plans, trials, and support.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <Accordion className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} className="border-border">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold hover:no-underline py-4 text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="relative w-full py-16 md:py-24 border-b border-border bg-gradient-to-b from-background to-card/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.526_0.247_293_/_0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Ready to Grow with SyncWA?
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            Start managing customer relationships from one platform today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Link
              href={isLoggedIn ? "/dashboard" : "/contact"}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>{isLoggedIn ? "Go to Dashboard" : "Book a Demo"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Talk to Sales</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
