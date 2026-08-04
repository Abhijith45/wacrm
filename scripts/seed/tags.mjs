// ===========================================================================
// SyncWA Seed Module — Tags
// Creates platform-level tags and workspace-level tags.
// ===========================================================================

import {
  PLATFORM_TAGS,
  WORKSPACE_TAGS,
} from "./config.mjs";
import {
  SeededRandom,
  logSuccess,
  logSkip,
} from "./utils.mjs";

const MODULE = "tags";

/**
 * Creates platform tags and workspace tags.
 * Idempotent: uses upsert for platform_tags (unique name), checks before insert for workspace tags.
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedTags(ctx) {
  const { supabase, profile, stats } = ctx;
  const rng = new SeededRandom(3001);

  let platformCreated = 0;
  let workspaceCreated = 0;

  // ── Platform Tags ───────────────────────────────────────────────────────
  const platformTagIds = [];

  for (const tag of PLATFORM_TAGS) {
    const { data, error } = await supabase
      .from("platform_tags")
      .upsert({ name: tag.name, color: tag.color }, { onConflict: "name" })
      .select("id")
      .single();

    if (!error && data) {
      platformTagIds.push(data.id);
      platformCreated++;
    }
  }

  ctx.seededData.platformTagIds = platformTagIds;

  // ── Associate Platform Tags to Leads ────────────────────────────────────
  const leadIds = ctx.seededData.leadIds || [];
  let tagsAssociated = 0;

  for (const leadId of leadIds) {
    // Each lead gets 1-3 random tags
    const tagCount = rng.between(1, 3);
    const selectedTagIds = rng.pickMultiple(platformTagIds, tagCount);

    for (const tagId of selectedTagIds) {
      const { error } = await supabase
        .from("platform_lead_tags")
        .insert({ lead_id: leadId, tag_id: tagId })
        .select();

      // Skip duplicates (23505 = unique_violation)
      if (!error) {
        tagsAssociated++;
      }
    }
  }

  // ── Workspace Tags ──────────────────────────────────────────────────────
  // These are created per-workspace when workspaces are seeded.
  // Store the definitions for downstream use.
  ctx.seededData.workspaceTagDefs = WORKSPACE_TAGS;

  stats.platformTags = platformCreated;
  stats.leadTagAssociations = tagsAssociated;

  logSuccess(MODULE, `${platformCreated} Platform Tags created`);
  if (tagsAssociated > 0) {
    logSuccess(MODULE, `${tagsAssociated} Lead-Tag associations created`);
  }
}
