import React from "react";
import { Mail, Phone, Globe, Building2, Users, FileText, Calendar, User, Info } from "lucide-react";
import { format } from "date-fns";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatusBadge } from "@/components/admin/common/status-badge";
import type { PlatformLead, PlatformLeadStatus } from "@/types";

interface CardProps {
  lead: PlatformLead;
}

export function ContactCard({ lead }: CardProps) {
  return (
    <SectionCard title="Contact Information" subtitle="Primary outreach channels for this lead.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold select-none">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Full Name</span>
          <span className="text-foreground flex items-center space-x-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.name}</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Email Address</span>
          <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center space-x-1.5 cursor-pointer">
            <Mail className="h-3.5 w-3.5 text-primary/60 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Phone Number</span>
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} className="text-primary hover:underline flex items-center space-x-1.5 cursor-pointer">
              <Phone className="h-3.5 w-3.5 text-primary/60 shrink-0" />
              <span>{lead.phone}</span>
            </a>
          ) : (
            <span className="text-muted-foreground italic flex items-center space-x-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span>Not Provided</span>
            </span>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Country / Region</span>
          <span className="text-foreground flex items-center space-x-1.5">
            <Globe className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.country || "Not Specified"}</span>
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

export function CompanyCard({ lead }: CardProps) {
  const getRequestTypeVariant = (requestType: string) => {
    switch (requestType) {
      case "DEMO":
        return "info" as const;
      case "ONBOARDING":
        return "success" as const;
      case "GENERAL":
        return "neutral" as const;
      case "PARTNERSHIP":
        return "warning" as const;
      case "TECHNICAL":
        return "destructive" as const;
      default:
        return "neutral" as const;
    }
  };

  return (
    <SectionCard title="Company Details" subtitle="Client organization parameters and interest tags.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold select-none">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Company Name</span>
          <span className="text-foreground flex items-center space-x-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.company_name}</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Company Size</span>
          <span className="text-foreground flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.company_size ? `${lead.company_size} employees` : "Not Specified"}</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Request Type</span>
          <div className="pt-0.5">
            <StatusBadge
              label={lead.request_type ? lead.request_type.toLowerCase() : "general"}
              variant={getRequestTypeVariant(lead.request_type || "GENERAL")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Interest / Topic Area</span>
          <span className="text-foreground flex items-center space-x-1.5">
            <Info className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.interest_area || "General Product Enquiry"}</span>
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

export function MessageCard({ lead }: CardProps) {
  return (
    <SectionCard title="Submission Enquiry Message" subtitle="Original content submitted by the visitor.">
      <div className="space-y-4 select-none">
        {lead.subject && (
          <div className="space-y-1 border-b border-border pb-3">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Subject Header</span>
            <span className="text-xs font-bold text-foreground flex items-center space-x-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <span>{lead.subject}</span>
            </span>
          </div>
        )}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Message Body</span>
          <div className="bg-muted/30 border border-border p-4 rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-wrap font-medium font-sans">
            {lead.message}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function LeadInfoCard({ lead }: CardProps) {
  const getStatusVariant = (status: PlatformLeadStatus) => {
    switch (status) {
      case "new":
        return "info" as const;
      case "contacted":
        return "warning" as const;
      case "qualified":
        return "success" as const;
      case "demo_scheduled":
        return "info" as const;
      case "demo_completed":
        return "success" as const;
      case "trial_active":
        return "warning" as const;
      case "converted":
        return "success" as const;
      case "lost":
        return "destructive" as const;
      case "unqualified":
        return "neutral" as const;
      default:
        return "neutral" as const;
    }
  };

  return (
    <SectionCard title="Operational Meta" subtitle="System records tracking data.">
      <div className="space-y-4 text-xs font-semibold select-none">
        {/* Status */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground">Lifecycle State</span>
          <StatusBadge
            label={lead.status.replace("_", " ")}
            variant={getStatusVariant(lead.status)}
          />
        </div>

        {/* Lead Source */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground">Form Source</span>
          <span className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-bold capitalize border border-border">
            {lead.source.replace("_", " ")}
          </span>
        </div>

        {/* Lead Creation Date */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground">Enquiry Date</span>
          <span className="text-foreground flex items-center space-x-1.5 font-bold">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{format(new Date(lead.created_at), "MMM dd, yyyy HH:mm")}</span>
          </span>
        </div>

        {/* Lead Update Date */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-muted-foreground">Last Updated</span>
          <span className="text-foreground flex items-center space-x-1.5 font-bold">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{format(new Date(lead.updated_at), "MMM dd, yyyy HH:mm")}</span>
          </span>
        </div>

        {/* Assigned Representative */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-muted-foreground">Representative</span>
          <span className="text-foreground flex items-center space-x-1.5 font-bold">
            <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>{lead.assigned_to ? "Assigned" : "Unassigned"}</span>
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
