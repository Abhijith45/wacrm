// ===========================================================================
// SyncWA Seed Module — Timeline Activities
// Creates realistic activity history for platform leads.
// ===========================================================================

import { ACTIVITY_NOTES } from "./config.mjs";
import {
  SeededRandom,
  randomDateSeries,
  logSuccess,
  logSkip,
  formatNumber,
} from "./utils.mjs";

const MODULE = "activities";

// Activity types allowed by the DB check constraint
const ACTIVITY_TYPES = [
  "note_added",
  "email_sent",
  "call_made",
  "status_changed",
  "assigned",
  "demo_completed",
];

/**
 * Creates realistic timeline activities for platform leads.
 * Idempotent: checks existing activity count per lead to avoid duplicates.
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedActivities(ctx) {
  const { supabase, profile, stats } = ctx;
  const leadIds = ctx.seededData.leadIds || [];
  const { quantities } = profile;

  if (
    leadIds.length === 0 ||
    quantities.activitiesPerLead.max === 0
  ) {
    logSkip(MODULE, "No leads or zero activities configured — skipping");
    stats.activities = 0;
    return;
  }

  const rng = new SeededRandom(5001);
  const operatorId = ctx.seededData.platformOwnerId;
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const leadId of leadIds) {
    // ── Idempotent Check: Skip if lead already has activities ────────────
    const { count: existingCount } = await supabase
      .from("lead_activities")
      .select("id", { count: "exact", head: true })
      .eq("lead_id", leadId);

    if (existingCount && existingCount > 0) {
      totalSkipped++;
      continue;
    }

    // Generate a random number of activities for this lead
    const actCount = rng.between(
      quantities.activitiesPerLead.min,
      quantities.activitiesPerLead.max
    );

    if (actCount === 0) continue;

    // Generate sorted timestamps
    const timestamps = randomDateSeries(rng, actCount);

    const payloads = [];

    for (let i = 0; i < actCount; i++) {
      const activityType = rng.pick(ACTIVITY_TYPES);
      const notePool = ACTIVITY_NOTES[activityType] || ACTIVITY_NOTES.note_added;
      const note = rng.pick(notePool);

      payloads.push({
        lead_id: leadId,
        activity_type: activityType,
        note,
        metadata: {
          seeded: true,
          index: i,
        },
        created_by: operatorId || null,
        created_at: timestamps[i].toISOString(),
      });
    }

    // Batch insert for performance
    const { error } = await supabase
      .from("lead_activities")
      .insert(payloads);

    if (error) {
      // If batch fails, skip silently (could be constraint issue)
      continue;
    }

    totalCreated += payloads.length;
  }

  stats.activities = totalCreated;

  if (totalSkipped > 0) {
    logSuccess(
      MODULE,
      `${formatNumber(totalCreated)} activities created, ${formatNumber(totalSkipped)} leads already had activities`
    );
  } else {
    logSuccess(MODULE, `${formatNumber(totalCreated)} Timeline Activities created`);
  }
}
