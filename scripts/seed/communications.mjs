// ===========================================================================
// SyncWA Seed Module — Communication History
// Creates communication history records for converted leads.
// ===========================================================================

import { COMMUNICATION_TEMPLATES } from "./config.mjs";
import {
  SeededRandom,
  randomDateSeries,
  logSuccess,
  logSkip,
  formatNumber,
} from "./utils.mjs";

const MODULE = "communications";

/**
 * Creates communication history records for leads.
 * Focuses on converted/trial_active leads to simulate the onboarding email journey.
 * Idempotent: checks existing communication count per lead.
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedCommunications(ctx) {
  const { supabase, profile, stats } = ctx;
  const leadIds = ctx.seededData.leadIds || [];
  const { quantities } = profile;

  if (
    leadIds.length === 0 ||
    quantities.communicationsPerConvertedLead.max === 0
  ) {
    logSkip(MODULE, "No leads or zero communications configured — skipping");
    stats.communications = 0;
    return;
  }

  const rng = new SeededRandom(6001);
  let totalCreated = 0;
  let totalSkipped = 0;

  // Fetch leads that are converted or trial_active
  const { data: eligibleLeads } = await supabase
    .from("platform_leads")
    .select("id, email, status")
    .in("id", leadIds)
    .in("status", ["converted", "trial_active", "demo_completed"]);

  const targetLeads = eligibleLeads || [];

  for (const lead of targetLeads) {
    // ── Idempotent Check ────────────────────────────────────────────────
    const { count: existingCount } = await supabase
      .from("communication_history")
      .select("id", { count: "exact", head: true })
      .eq("lead_id", lead.id);

    if (existingCount && existingCount > 0) {
      totalSkipped++;
      continue;
    }

    const commCount = rng.between(
      quantities.communicationsPerConvertedLead.min,
      quantities.communicationsPerConvertedLead.max
    );

    if (commCount === 0) continue;

    const timestamps = randomDateSeries(rng, commCount);
    const payloads = [];

    for (let i = 0; i < commCount; i++) {
      // Pick a template name based on order (simulates onboarding journey)
      const templateName =
        i < COMMUNICATION_TEMPLATES.length
          ? COMMUNICATION_TEMPLATES[i]
          : rng.pick(COMMUNICATION_TEMPLATES);

      // Most communications succeed, some fail
      const statusRoll = rng.next();
      let status;
      if (statusRoll < 0.85) {
        status = "sent";
      } else if (statusRoll < 0.95) {
        status = "pending";
      } else {
        status = "failed";
      }

      const payload = {
        recipient: lead.email,
        template_name: templateName,
        status,
        provider: "MockEmailProvider",
        retry_count: status === "failed" ? rng.between(1, 3) : 0,
        failure_reason:
          status === "failed"
            ? rng.pick([
                "SMTP connection timeout",
                "Recipient mailbox full",
                "DNS resolution failed",
              ])
            : null,
        delivery_result:
          status === "sent"
            ? { messageId: `msg_${rng.between(10000, 99999)}` }
            : null,
        lead_id: lead.id,
        created_at: timestamps[i].toISOString(),
        updated_at: timestamps[i].toISOString(),
      };

      payloads.push(payload);
    }

    const { error } = await supabase
      .from("communication_history")
      .insert(payloads);

    if (!error) {
      totalCreated += payloads.length;
    }
  }

  stats.communications = totalCreated;

  if (totalSkipped > 0) {
    logSuccess(
      MODULE,
      `${formatNumber(totalCreated)} communications created, ${formatNumber(totalSkipped)} leads already had history`
    );
  } else if (totalCreated > 0) {
    logSuccess(MODULE, `${formatNumber(totalCreated)} Communication History records created`);
  } else {
    logSkip(MODULE, "No eligible leads for communication seeding");
  }
}
