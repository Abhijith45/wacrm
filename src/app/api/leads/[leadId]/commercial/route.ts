import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import {
  getPlatformLeadById,
  getLeadActivities,
} from "@/lib/leads/repository";
import { CommercialService } from "@/lib/services/commercial";
import { supabaseAdmin } from "@/lib/flows/admin-client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication & Authorization
    const staff = await getCurrentPlatformStaff();
    
    // Role validation checks (founder, admin, sales only)
    const allowedRoles = ["founder", "admin", "sales"];
    if (!allowedRoles.includes(staff.platformRole)) {
      return NextResponse.json(
        { error: "You are not authorized to perform commercial operations." },
        { status: 403 }
      );
    }

    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: "Missing lead identifier" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.action !== "string") {
      return NextResponse.json({ error: "Invalid operational payload" }, { status: 400 });
    }

    const { action } = body;

    // Load active customer record first
    const supabase = supabaseAdmin();
    const { data: customer, error: customerErr } = await supabase
      .from("platform_customers")
      .select("id")
      .eq("lead_id", leadId)
      .maybeSingle();

    if (customerErr || !customer) {
      return NextResponse.json(
        { error: "Customer commercial profile not found for this lead." },
        { status: 404 }
      );
    }

    let updatedCustomer = null;

    // 2. Dispatch Action Commands
    if (action === "extend") {
      const days = Number(body.days);
      const reason = typeof body.reason === "string" ? body.reason.trim() : "";

      if (isNaN(days) || days <= 0) {
        return NextResponse.json({ error: "Extension days must be a positive integer." }, { status: 400 });
      }
      if (!reason) {
        return NextResponse.json({ error: "Reason for extension is required." }, { status: 400 });
      }

      updatedCustomer = await CommercialService.extendTrial(
        customer.id,
        leadId,
        days,
        reason,
        staff.userId
      );
    } else if (action === "suspend") {
      const reason = typeof body.reason === "string" ? body.reason.trim() : "";
      if (!reason) {
        return NextResponse.json({ error: "Reason for workspace suspension is required." }, { status: 400 });
      }

      updatedCustomer = await CommercialService.suspendWorkspace(
        customer.id,
        leadId,
        reason,
        staff.userId
      );
    } else if (action === "resume") {
      updatedCustomer = await CommercialService.resumeWorkspace(
        customer.id,
        leadId,
        staff.userId
      );
    } else if (action === "status") {
      const { status } = body;
      if (!status) {
        return NextResponse.json({ error: "New status code is required." }, { status: 400 });
      }

      updatedCustomer = await CommercialService.updateCommercialStatus(
        customer.id,
        leadId,
        status,
        staff.userId
      );
    } else {
      return NextResponse.json({ error: `Unsupported action operation: ${action}` }, { status: 400 });
    }

    // 3. Retrieve updated Lead and Activities list
    const updatedLead = await getPlatformLeadById(leadId);
    const updatedActivities = await getLeadActivities(leadId);

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
      lead: updatedLead,
      activities: updatedActivities,
    }, { status: 200 });
  } catch (error) {
    console.error("[api/leads/commercial] Error handling commercial POST command:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
