import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 p-6 bg-card border border-border rounded-xl">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground leading-normal max-w-2xl">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center space-x-3">{children}</div>}
    </div>
  );
}
