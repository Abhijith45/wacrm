"use client";

import React from "react";
import { Layers, Globe, Settings, Sliders, Puzzle } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";

interface WorkspacePanelProps {
  account: any;
  ownerEmail: string;
  membersCount: number;
}

export function WorkspacePanel({
  account,
  ownerEmail,
  membersCount,
}: WorkspacePanelProps) {
  if (!account) {
    return (
      <SectionCard title="Workspace Settings" subtitle="Provisioning parameters.">
        <div className="text-center py-6 text-xs text-muted-foreground font-semibold italic">
          No provisioned workspace is linked to this Customer yet.
        </div>
      </SectionCard>
    );
  }

  // Build the workspace login route
  const workspaceUrl = `https://syncwa.com/w/${account.slug}`;

  return (
    <SectionCard title="Workspace Settings" subtitle="Provisioning parameters.">
      <div className="space-y-4 text-xs font-semibold select-none">
        
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Workspace Domain Route
            </span>
            <a
              href={workspaceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-bold break-all inline-flex items-center space-x-1"
            >
              <Globe className="h-3.5 w-3.5 mr-1" />
              <span>{workspaceUrl}</span>
            </a>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Workspace Identifier (Slug)
            </span>
            <span className="text-foreground font-bold">{account.slug}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Workspace Owner Email
            </span>
            <span className="text-foreground font-bold break-all">{ownerEmail || "N/A"}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Total Staff Accounts
            </span>
            <span className="text-foreground font-bold">{membersCount} members</span>
          </div>
        </div>

        {/* Feature Flags Placeholders (PRD/Sprint Scope) */}
        <div className="space-y-3">
          <span className="text-[9px] text-muted-foreground uppercase font-bold block">
            Future Capabilities & Add-ons
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Custom Domain */}
            <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1.5 opacity-50 cursor-not-allowed">
              <span className="text-[10px] text-foreground font-bold flex items-center">
                <Globe className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Custom Domains
              </span>
              <span className="block text-[9px] text-muted-foreground leading-normal font-medium">
                Link custom domains and SSL routes. Coming soon.
              </span>
            </div>

            {/* Feature Flags */}
            <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1.5 opacity-50 cursor-not-allowed">
              <span className="text-[10px] text-foreground font-bold flex items-center">
                <Sliders className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Feature Flags
              </span>
              <span className="block text-[9px] text-muted-foreground leading-normal font-medium">
                Unlock beta triggers and advanced features. Coming soon.
              </span>
            </div>

            {/* Third party plugins */}
            <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1.5 opacity-50 cursor-not-allowed">
              <span className="text-[10px] text-foreground font-bold flex items-center">
                <Puzzle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Meta Integrations
              </span>
              <span className="block text-[9px] text-muted-foreground leading-normal font-medium">
                Map custom webhooks and runners. Coming soon.
              </span>
            </div>

          </div>
        </div>

      </div>
    </SectionCard>
  );
}
