"use client";

import React from "react";
import { Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { EmptyState } from "@/components/admin/common/empty-state";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Administration Settings"
        description="Configure operator profiles, global trial parameters, environment configurations, and feature flags."
      />

      <EmptyState
        icon={Settings}
        title="Administration Console Coming Soon"
        description="Manage system-wide permissions and platform configurations. Available for founder and platform admin roles in subsequent sprints."
        actionLabel="View Customization Guide"
        onAction={() => window.open("/docs/SYNCWA_CUSTOMIZATION_GUIDE.md", "_blank")}
      />
    </div>
  );
}
