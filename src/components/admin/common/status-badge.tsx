import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "destructive" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({
  label,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  const variants = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    destructive: "bg-destructive/10 border-destructive/20 text-destructive",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  const dots = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-destructive",
    info: "bg-blue-500",
    neutral: "bg-muted-foreground/60",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold select-none capitalize",
        variants[variant],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dots[variant])} />
      <span>{label}</span>
    </div>
  );
}
