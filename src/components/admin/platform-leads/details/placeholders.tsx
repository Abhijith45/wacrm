import React from "react";
import { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { EmptyState } from "@/components/admin/common/empty-state";

interface PlaceholderSectionProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  className?: string;
}

export function PlaceholderSection({
  title,
  subtitle,
  icon,
  emptyTitle,
  emptyDescription,
  className,
}: PlaceholderSectionProps) {
  return (
    <SectionCard title={title} subtitle={subtitle} className={className}>
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </SectionCard>
  );
}
