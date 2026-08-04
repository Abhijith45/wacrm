import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { supabaseAdmin } from "@/lib/flows/admin-client";
import {
  updateLeadStatus,
  updateLeadAssignment,
  addLeadTag,
  removeLeadTag,
  convertLeadToCustomer,
  getPlatformLeadById,
  getLeadActivities,
} from "@/lib/leads/repository";
import { WorkspaceProvisioningService } from "@/lib/services/provisioning";
import { OnboardingService } from "@/lib/services/onboarding/service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication
    const staff = await getCurrentPlatformStaff();

    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: "Missing lead identifier" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.action !== "string") {
      return NextResponse.json({ error: "Invalid operational payload" }, { status: 400 });
    }

    const { action } = body;

    // 2. Route Action Commands
    if (action === "status") {
      const { status } = body;
      const validStatuses = [
        "new",
        "contacted",
        "qualified",
        "demo_scheduled",
        "demo_completed",
        "trial_active",
        "converted",
        "lost",
        "unqualified",
      ];
      if (!status || !validStatuses.includes(status)) {
        return NextResponse.json({ error: `Invalid status code: ${status}` }, { status: 400 });
      }

      const result = await updateLeadStatus(leadId, status, staff.userId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    }

    if (action === "assign") {
      const assigneeId = typeof body.assigneeId === "string" ? body.assigneeId.trim() : null;
      // Triggers reassignment or removal
      const result = await updateLeadAssignment(leadId, assigneeId || null, staff.userId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    }

    if (action === "add_tag") {
      const tagName = typeof body.tagName === "string" ? body.tagName.trim() : "";
      if (!tagName) {
        return NextResponse.json({ error: "Tag name cannot be empty" }, { status: 400 });
      }

      const result = await addLeadTag(leadId, tagName, staff.userId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    }

    if (action === "remove_tag") {
      const tagId = typeof body.tagId === "string" ? body.tagId.trim() : "";
      if (!tagId) {
        return NextResponse.json({ error: "Tag identifier cannot be empty" }, { status: 400 });
      }

      const result = await removeLeadTag(leadId, tagId, staff.userId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    }

    if (action === "convert") {
      // A. Role Authorization Check (locked PRD 25.1)
      const allowedRoles = ["founder", "admin", "sales"];
      if (!allowedRoles.includes(staff.platformRole)) {
        return NextResponse.json(
          { error: "Only Founders, Administrators, or Sales Managers are authorized to convert leads." },
          { status: 403 }
        );
      }

      // B. Retrieve Lead detail records
      const lead = await getPlatformLeadById(leadId);
      if (!lead) {
        return NextResponse.json({ error: "Lead details not found." }, { status: 404 });
      }

      let customerId: string;

      // C. Handle Idempotency / Retry cases (locked PRD 25.2)
      if (lead.status === "converted") {
        // Query the existing customer record ID
        const supabase = supabaseAdmin();
        const { data: customerData, error: customerErr } = await supabase
          .from("platform_customers")
          .select("id")
          .eq("lead_id", leadId)
          .maybeSingle();

        if (customerErr || !customerData) {
          return NextResponse.json(
            { error: "Lead is already converted, but no Customer profile was found." },
            { status: 404 }
          );
        }
        customerId = customerData.id;
      } else {
        // D. Trigger Customer Conversion Transaction RPC
        const rpcResult = await convertLeadToCustomer(leadId, staff.userId);
        customerId = rpcResult.customerId;
      }

      // E. Trigger Workspace Provisioning & Initialization (Sprint 3.2)
      if (!lead.workspace_id) {
        await WorkspaceProvisioningService.provisionWorkspace(
          leadId,
          customerId,
          staff.userId
        );
      }

      // F. Retrieve updated Lead and Activities list
      const updatedLead = await getPlatformLeadById(leadId);
      const updatedActivities = await getLeadActivities(leadId);

      // G. Resolve onboarding checklist state (Sprint 3.3)
      let onboardingPayload = null;
      if (updatedLead && updatedLead.workspace_id) {
        const onboardingService = new OnboardingService();
        const supabase = supabaseAdmin();

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("account_id", updatedLead.workspace_id)
          .eq("account_role", "owner")
          .maybeSingle();

        if (profile?.user_id) {
          onboardingPayload = await onboardingService.evaluateAndLogMilestones(
            leadId,
            updatedLead.workspace_id,
            profile.user_id,
            staff.userId
          );
        }
      }

      return NextResponse.json({
        success: true,
        customerId,
        lead: updatedLead,
        activities: updatedActivities,
        onboarding: onboardingPayload,
      }, { status: 200 });
    }

    return NextResponse.json({ error: `Unsupported action operation: ${action}` }, { status: 400 });
  } catch (error) {
    console.error("[api/leads/operations] Error handling operations POST command:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
