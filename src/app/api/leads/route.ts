import { NextResponse } from "next/server";
import { findDuplicateLead, createPlatformLead, createLeadActivity } from "@/lib/leads/repository";


export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // 1. Inputs Extraction & Sanitization
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const businessEmail = typeof body.businessEmail === "string" ? body.businessEmail.trim() : "";
    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
    const companySize = typeof body.companySize === "string" ? body.companySize.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const country = typeof body.country === "string" ? body.country.trim() : "";
    const interestArea = typeof body.interestArea === "string" ? body.interestArea.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "contact_form";

    // Marketing UTM Parameters
    const utmSource = typeof body.utm_source === "string" ? body.utm_source.trim() : "";
    const utmMedium = typeof body.utm_medium === "string" ? body.utm_medium.trim() : "";
    const utmCampaign = typeof body.utm_campaign === "string" ? body.utm_campaign.trim() : "";
    const utmContent = typeof body.utm_content === "string" ? body.utm_content.trim() : "";
    const utmTerm = typeof body.utm_term === "string" ? body.utm_term.trim() : "";
    const referrerUrl = typeof body.referrer_url === "string" ? body.referrer_url.trim() : "";

    // 2. Server-side Validations
    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }
    if (!businessEmail) {
      return NextResponse.json({ error: "Business email is required" }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(businessEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Length limit checks (Defensive security guards)
    if (fullName.length > 255) {
      return NextResponse.json({ error: "Full name exceeds maximum length (255 characters)" }, { status: 400 });
    }
    if (companyName.length > 255) {
      return NextResponse.json({ error: "Company name exceeds maximum length (255 characters)" }, { status: 400 });
    }
    if (businessEmail.length > 255) {
      return NextResponse.json({ error: "Email exceeds maximum length (255 characters)" }, { status: 400 });
    }
    if (phoneNumber.length > 50) {
      return NextResponse.json({ error: "Phone number exceeds maximum length (50 characters)" }, { status: 400 });
    }
    if (subject.length > 300) {
      return NextResponse.json({ error: "Subject exceeds maximum length (300 characters)" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message exceeds maximum length (5000 characters)" }, { status: 400 });
    }

    // 3. Duplicate Detection Check
    const duplicate = await findDuplicateLead({
      email: businessEmail,
      phone: phoneNumber,
      companyName: companyName,
      name: fullName,
    });

    if (duplicate) {
      console.warn(`[api/leads] Duplicate lead signup attempt blocked. Email: ${businessEmail}, ID: ${duplicate.id}`);
      return NextResponse.json(
        {
          error: "A lead with this email or phone is already registered. Our sales team is already reviewing your details.",
        },
        { status: 409 }
      );
    }

    // 4. Persistence
    const lead = await createPlatformLead({
      name: fullName,
      company_name: companyName,
      email: businessEmail,
      phone: phoneNumber,
      company_size: companySize,
      subject,
      message,
      country,
      interest_area: interestArea,
      source,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      referrer_url: referrerUrl,
    });

    // Automatically trigger initial activity timeline log (Lead Created / Status Changed)
    try {
      await createLeadActivity(
        lead.id,
        "status_changed",
        "Lead registered via public website contact form.",
        {
          old_status: null,
          new_status: "new",
        }
      );
    } catch (actErr) {
      console.error("[api/leads] Warning: failed to log initial timeline activity:", actErr);
      // Do not fail lead creation if activity logging fails (defensive fallback)
    }

    console.log(`[api/leads] Successfully created platform lead. ID: ${lead.id}, Email: ${businessEmail}`);
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("[api/leads] Unexpected execution error:", error);
    return NextResponse.json({ error: "An unexpected server error occurred. Please try again." }, { status: 500 });
  }
}
