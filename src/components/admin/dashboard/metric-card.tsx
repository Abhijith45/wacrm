import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  description?: string;
  icon: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "purple" | "neutral";
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  description,
  icon: Icon,
  variant = "neutral",
  className,
}: MetricCardProps) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    neutral: "text-muted-foreground bg-muted border-border",
  };

  return (
    <div
      className={cn(
        "p-5 bg-card border border-border rounded-xl space-y-4 hover:border-primary/20 hover:shadow-md transition-all duration-300 group",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-105",
            colors[variant]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-black text-foreground tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-[10px] font-bold flex items-center",
              isPositive ? "text-emerald-500" : "text-destructive"
            )}
          >
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground leading-none">
          {description}
        </p>
      )}
    </div>
  );
}
