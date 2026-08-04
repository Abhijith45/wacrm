import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="p-12 bg-card border border-border rounded-xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
      <div className="h-12 w-12 rounded-full bg-primary-soft border border-primary/20 flex items-center justify-center text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-normal max-w-sm">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
