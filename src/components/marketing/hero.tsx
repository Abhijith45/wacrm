import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";
import { DashboardMockup } from "./screen-mockups";

interface HeroProps {
  isLoggedIn?: boolean;
}

export function Hero({ isLoggedIn = false }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 border-b border-border bg-gradient-to-b from-card/30 via-background to-background">
      {/* Decorative subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.526_0.247_293_/_0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-xs font-semibold select-none animate-fade-in">
          <span>✨ Modern Business Platform</span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
          Manage Your Business on WhatsApp — From One Platform
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          SyncWA combines CRM, WhatsApp communication, sales, marketing, automation, and analytics into one unified workspace, helping your team manage customers more efficiently.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/contact"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-center")}
              >
                Explore Features
              </Link>
            </>
          )}
        </div>

        {/* Hero Visual Container */}
        <div className="w-full max-w-5xl pt-8 animate-fade-in">
          <BrowserFrame url="app.syncwa.com/dashboard">
            <DashboardMockup />
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
