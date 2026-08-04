import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { getLeadActivities, createLeadActivity } from "@/lib/leads/repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication
    await getCurrentPlatformStaff();

    const { leadId } = await params;
    if (!leadId) {
      return NextResponse.json({ error: "Missing lead identifier" }, { status: 400 });
    }

    const activities = await getLeadActivities(leadId);
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("[api/leads/activities] GET error:", error);
    // Return unauthorized or generic server error depending on type
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}

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
    if (!body || typeof body.note !== "string" || !body.note.trim()) {
      return NextResponse.json({ error: "Note content cannot be empty" }, { status: 400 });
    }

    const noteText = body.note.trim();
    if (noteText.length > 2000) {
      return NextResponse.json({ error: "Note exceeds maximum limit of 2000 characters" }, { status: 400 });
    }

    // 2. Persist manual Note activity
    const activity = await createLeadActivity(
      leadId,
      "note_added",
      noteText,
      {},
      staff.userId // Match profile user_id referencing auth.users(id)
    );


    return NextResponse.json({ success: true, activity }, { status: 201 });
  } catch (error) {
    console.error("[api/leads/activities] POST error:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
