"use client";

import React from "react";
import { PhoneCall, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { EmptyState } from "@/components/admin/common/empty-state";

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform Leads"
        description="Capture, review, and qualify inbound sales leads from public website enquiries."
      >
        <Button
          size="sm"
          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
          disabled
        >
          <Plus className="h-3 w-3 mr-1.5" />
          Add Lead
        </Button>
      </AdminPageHeader>

      <EmptyState
        icon={PhoneCall}
        title="No Platform Leads"
        description="Leads submitted via the public contact form will appear here. The leads management module is scheduled for Sprint 2.0."
        actionLabel="View Customer Lifecycle Docs"
        onAction={() => window.open("/docs/strategy/SyncWA_Website_Strategy_Document.md", "_blank")}
      />
    </div>
  );
}
