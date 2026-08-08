import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAProps {
  isLoggedIn?: boolean;
}

export function CTA({ isLoggedIn = false }: CTAProps) {
  return (
    <section id="contact" className="relative w-full py-16 md:py-24 border-b border-border bg-gradient-to-b from-background to-card/30 overflow-hidden">
      {/* Subtle background radial light glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.526_0.247_293_/_0.06),transparent_60%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
        {/* Headline */}
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
          Start Building Better Customer Relationships
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
          Manage conversations, organize customers, and grow your business from one unified platform. Complete data privacy with zero per-seat licensing fees.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>Talk to Sales</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/features"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
          >
            <span>Explore Features</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
