import React from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: SectionCardProps) {
  const hasHeader = title || subtitle || action;

  return (
    <div className={cn("p-6 bg-card border border-border rounded-xl space-y-5", className)}>
      {hasHeader && (
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
            {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
