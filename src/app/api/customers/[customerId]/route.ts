import { NextResponse } from "next/server";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { supabaseAdmin } from "@/lib/flows/admin-client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    // 1. Verify Platform Staff Authentication
    const staff = await getCurrentPlatformStaff();

    const { customerId } = await params;
    if (!customerId) {
      return NextResponse.json({ error: "Missing customer identifier" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { companyName, email, phone, companySize } = body;

    // Validation
    const errors: Record<string, string> = {};
    if (!companyName || !companyName.trim()) {
      errors.companyName = "Company name is required";
    }
    if (!email || !email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    // Update platform_customers table
    const { data: updatedCustomer, error: updateErr } = await supabase
      .from("platform_customers")
      .update({
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        company_size: companySize ? companySize.trim() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId)
      .select()
      .maybeSingle();

    if (updateErr || !updatedCustomer) {
      console.error("[api/customers/PATCH] error:", updateErr);
      return NextResponse.json({ error: updateErr?.message || "Failed to update customer" }, { status: 500 });
    }

    // Resolve complete updated customer details payload
    const { getPlatformCustomerDetail } = await import("@/lib/leads/repository");
    const detail = await getPlatformCustomerDetail(customerId);

    return NextResponse.json({
      success: true,
      customer: detail.customer,
      detail,
    }, { status: 200 });

  } catch (error) {
    console.error("[api/customers/PATCH] Error updating customer:", error);
    const status = error instanceof Error && (error.name === "UnauthorizedError" || error.name === "ForbiddenError") ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status });
  }
}
