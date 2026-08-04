"use client";

import React from "react";
import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { EmptyState } from "@/components/admin/common/empty-state";

export default function AdminWorkspacesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Workspace Provisioning"
        description="Monitor active client accounts, billing statuses, and provision isolated tenant workspaces."
      >
        <Button
          size="sm"
          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
          disabled
        >
          <Plus className="h-3 w-3 mr-1.5" />
          Provision Workspace
        </Button>
      </AdminPageHeader>

      <EmptyState
        icon={Layers}
        title="No Workspaces Available"
        description="Provisioned workspaces mapping to the accounts database table will display here. This module supports manual activation and suspension actions."
        actionLabel="View Platform Domains Roadmap"
        onAction={() => window.open("/docs/strategy/SyncWA_Website_Strategy_Document.md#471-platform-crm-implementation-roadmap", "_blank")}
      />
    </div>
  );
}
