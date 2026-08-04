import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LegalHeroProps {
  title: string;
  subtitle: string;
}

export function LegalHero({ title, subtitle }: LegalHeroProps) {
  return (
    <section className="relative w-full py-12 md:py-16 border-b border-border bg-gradient-to-b from-card/30 via-background to-background text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.526_0.247_293_/_0.04),transparent_50%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-3 relative z-10">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

interface EffectiveDateCardProps {
  date: string;
}

export function EffectiveDateCard({ date }: EffectiveDateCardProps) {
  return (
    <div className="p-4 bg-card/60 border border-border/80 rounded-xl flex items-center space-x-3 text-xs">
      <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
        <span className="font-mono font-bold text-sm">📅</span>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Effective Date</p>
        <p className="font-bold text-foreground">{date}</p>
      </div>
    </div>
  );
}

export function LegalContactCard() {
  return (
    <div className="p-6 bg-card border border-border rounded-xl text-center space-y-4 max-w-2xl mx-auto">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HelpCircle className="h-5 w-5" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-foreground">Questions?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          If you have any questions regarding this document, please contact the SyncWA team through the Contact page.
        </p>
      </div>
      <div>
        <Link
          href="/contact"
          className={cn(buttonVariants({ size: "sm" }), "text-[10px] h-8 px-4 cursor-pointer")}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
