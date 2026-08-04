// ===========================================================================
// SyncWA Seed Module — Platform Leads
// Creates platform leads with realistic data distribution.
// ===========================================================================

import {
  INTEREST_AREAS,
  LEAD_MESSAGES,
  COMPANY_SIZES,
} from "./config.mjs";
import {
  SeededRandom,
  randomName,
  randomCompanyName,
  randomPhone,
  randomEmail,
  randomDate,
  randomSource,
  randomLeadStatus,
  logSuccess,
  logSkip,
  logError,
  formatNumber,
} from "./utils.mjs";

const MODULE = "leads";

/**
 * Creates platform leads with realistic data distribution.
 * Idempotent: checks by email before inserting.
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedLeads(ctx) {
  const { supabase, profile, stats } = ctx;
  const { quantities } = profile;

  // Production profile creates no leads
  if (quantities.leadsPerCustomer === 0) {
    logSkip(MODULE, "Production profile — no leads to create");
    stats.leads = 0;
    return;
  }

  const totalLeads = quantities.leadsPerCustomer;
  const rng = new SeededRandom(1001);
  let created = 0;
  let skipped = 0;
  const leadIds = [];

  for (let i = 0; i < totalLeads; i++) {
    const name = randomName(rng);
    const company = randomCompanyName(rng);
    const email = randomEmail(name, null, rng);
    const phone = randomPhone(rng);
    const status = randomLeadStatus(rng);
    const source = randomSource(rng);
    const createdAt = randomDate(rng);
    const message = rng.pick(LEAD_MESSAGES);
    const interestArea = rng.pick(INTEREST_AREAS);
    const companySize = rng.pick(COMPANY_SIZES);
    const country = rng.pick(["India", "United States", "United Kingdom", "UAE", "Singapore", "Germany", "Australia", "Canada"]);

    // Idempotent check: skip if lead with this email already exists
    const { data: existing } = await supabase
      .from("platform_leads")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      leadIds.push(existing.id);
      skipped++;
      continue;
    }

    const leadPayload = {
      name,
      company_name: company,
      email,
      phone,
      country,
      company_size: companySize,
      message,
      interest_area: interestArea,
      source,
      status,
      assigned_to: ctx.seededData.platformOwnerId || null,
      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
    };

    // Set converted_at for converted leads
    if (status === "converted") {
      const convertedDate = new Date(createdAt.getTime() + rng.between(1, 14) * 86400000);
      leadPayload.converted_at = convertedDate.toISOString();
    }

    // Add UTM data to some leads
    if (rng.next() > 0.5) {
      leadPayload.utm_source = rng.pick(["google", "facebook", "linkedin", "twitter", "newsletter"]);
      leadPayload.utm_medium = rng.pick(["cpc", "social", "email", "organic", "referral"]);
      leadPayload.utm_campaign = rng.pick(["launch_2026", "summer_promo", "enterprise_q3", "startup_special", "webinar_series"]);
    }

    const { data, error } = await supabase
      .from("platform_leads")
      .insert(leadPayload)
      .select("id")
      .single();

    if (error) {
      logError(MODULE, `Failed to create lead ${email}: ${error.message}`);
      continue;
    }

    leadIds.push(data.id);
    created++;
  }

  ctx.seededData.leadIds = leadIds;
  stats.leads = created + skipped;

  if (skipped > 0) {
    logSuccess(MODULE, `${formatNumber(created)} leads created, ${formatNumber(skipped)} already existed`);
  } else {
    logSuccess(MODULE, `${formatNumber(created)} Platform Leads created`);
  }
}
