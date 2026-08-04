import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { getPlatformLeadById, getLeadActivities } from "@/lib/leads/repository";
import { CommunicationService } from "@/lib/services/communication/service";
import { supabaseAdmin } from "@/lib/flows/admin-client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication & Authorization
    const staff = await getCurrentPlatformStaff();

    const allowedRoles = ["founder", "admin", "sales"];
    if (!allowedRoles.includes(staff.platformRole)) {
      return NextResponse.json(
        { error: "You are not authorized to trigger manual communication overrides." },
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

    // 2. Dispatch Manual Retry Commands
    if (action === "retry") {
      const { historyId } = body;
      if (!historyId) {
        return NextResponse.json({ error: "Missing communication history identifier." }, { status: 400 });
      }

      const communicationService = new CommunicationService();
      await communicationService.manualRetry(historyId, staff.userId);
    } else {
      return NextResponse.json({ error: `Unsupported action operation: ${action}` }, { status: 400 });
    }

    // 3. Fetch updated timeline activities and communication history records
    const updatedActivities = await getLeadActivities(leadId);

    const supabase = supabaseAdmin();
    const { data: updatedHistory } = await supabase
      .from("communication_history")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      activities: updatedActivities,
      communications: updatedHistory || [],
    }, { status: 200 });
  } catch (error) {
    console.error("[api/leads/communication] Error handling communication POST override:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
