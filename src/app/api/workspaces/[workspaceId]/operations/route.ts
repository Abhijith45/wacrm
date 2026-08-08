import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { supabaseAdmin } from "@/lib/flows/admin-client";
import { getPlatformWorkspaceDetail, createLeadActivity } from "@/lib/leads/repository";
import { CommercialService } from "@/lib/services/commercial";
import { WelcomeCommunicationService } from "@/lib/services/onboarding/communication";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication
    const staff = await getCurrentPlatformStaff();

    const { workspaceId } = await params;
    if (!workspaceId) {
      return NextResponse.json({ error: "Missing workspace identifier" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.action !== "string") {
      return NextResponse.json({ error: "Invalid operational payload" }, { status: 400 });
    }

    const { action } = body;

    // Load workspace details to get customer & lead mappings
    const detail = await getPlatformWorkspaceDetail(workspaceId);
    if (!detail) {
      return NextResponse.json({ error: "Workspace details not found" }, { status: 404 });
    }

    const customerId = detail.workspace.customer_id;
    const leadId = detail.workspace.platform_customers?.lead_id || "00000000-0000-0000-0000-000000000000";

    const supabase = supabaseAdmin();

    if (action === "pause") {
      if (!customerId) {
        return NextResponse.json({ error: "Workspace has no customer association" }, { status: 400 });
      }
      await CommercialService.updateCommercialStatus(customerId, leadId, "paused", staff.userId);
    } 
    else if (action === "resume") {
      if (!customerId) {
        return NextResponse.json({ error: "Workspace has no customer association" }, { status: 400 });
      }
      await CommercialService.resumeWorkspace(customerId, leadId, staff.userId);
    } 
    else if (action === "suspend") {
      if (!customerId) {
        return NextResponse.json({ error: "Workspace has no customer association" }, { status: 400 });
      }
      const { reason } = body;
      await supabase
        .from("platform_customers")
        .update({ suspended_reason: reason || "Administrative suspension" })
        .eq("id", customerId);

      await CommercialService.updateCommercialStatus(customerId, leadId, "suspended", staff.userId);
    } 
    else if (action === "archive") {
      if (!customerId) {
        return NextResponse.json({ error: "Workspace has no customer association" }, { status: 400 });
      }
      await CommercialService.updateCommercialStatus(customerId, leadId, "archived", staff.userId);
    } 
    else if (action === "resend_invitation") {
      const ownerEmail = detail.owner.ownerEmail;
      const ownerName = detail.owner.ownerName;
      const slug = detail.workspace.slug;
      const trialEndsAt = detail.workspace.trialEndsAt;

      if (!ownerEmail || ownerEmail === "Unspecified") {
        return NextResponse.json({ error: "Workspace has no owner contact email" }, { status: 400 });
      }

      const welcomeComm = new WelcomeCommunicationService();
      await welcomeComm.triggerWelcomeEmail({
        email: ownerEmail,
        fullName: ownerName,
        loginUrl: `https://syncwa.com/w/${slug}/login`,
        trialEndsAt: trialEndsAt ? new Date(trialEndsAt).toLocaleDateString() : "N/A",
      });

      // Log activity to timeline
      if (leadId && leadId !== "00000000-0000-0000-0000-000000000000") {
        await createLeadActivity(
          leadId,
          "note_added",
          "Administrative action: Resent onboarding invitation welcome email.",
          { system_event: "onboarding_email_resent" },
          staff.userId
        );
      }
    } 
    else {
      return NextResponse.json({ error: `Unsupported action operation: ${action}` }, { status: 400 });
    }

    // Refetch updated details to return
    const updatedDetail = await getPlatformWorkspaceDetail(workspaceId);

    return NextResponse.json({
      success: true,
      detail: updatedDetail,
    }, { status: 200 });

  } catch (error) {
    console.error("[api/workspaces/operations] Error handling operations POST command:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
