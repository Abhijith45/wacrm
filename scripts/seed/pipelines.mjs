// ===========================================================================
// SyncWA Seed Module — Pipelines & Stages
// Creates sales pipelines and stages for each customer workspace.
// ===========================================================================

import {
  DEFAULT_PIPELINE,
  ADDITIONAL_PIPELINES,
  WORKSPACE_TAGS,
} from "./config.mjs";
import {
  logSuccess,
  logSkip,
} from "./utils.mjs";

const MODULE = "pipelines";

/**
 * Creates pipelines and their stages for each customer workspace.
 * Also creates workspace-level tags.
 * Idempotent: checks by pipeline name + account_id before inserting.
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedPipelines(ctx) {
  const { supabase, profile, stats } = ctx;
  const workspaces = ctx.seededData.workspaces || [];

  if (workspaces.length === 0) {
    logSkip(MODULE, "No workspaces — skipping pipeline creation");
    stats.pipelines = 0;
    stats.pipelineStages = 0;
    stats.workspaceTags = 0;
    return;
  }

  let pipelinesCreated = 0;
  let stagesCreated = 0;
  let wsTagsCreated = 0;

  const pipelineDefs = [DEFAULT_PIPELINE];
  if (profile.quantities.additionalPipelines) {
    pipelineDefs.push(...ADDITIONAL_PIPELINES);
  }

  for (const ws of workspaces) {
    const { accountId, ownerId } = ws;
    if (!accountId || !ownerId) continue;

    // ── Pipelines ─────────────────────────────────────────────────────────
    for (const pDef of pipelineDefs) {
      // Idempotent check
      const { data: existing } = await supabase
        .from("pipelines")
        .select("id")
        .eq("account_id", accountId)
        .eq("name", pDef.name)
        .maybeSingle();

      if (existing) {
        continue;
      }

      const { data: pipeline, error: pErr } = await supabase
        .from("pipelines")
        .insert({
          name: pDef.name,
          account_id: accountId,
          user_id: ownerId,
        })
        .select("id")
        .single();

      if (pErr || !pipeline) continue;

      pipelinesCreated++;

      // Create stages
      const stagePayloads = pDef.stages.map((s) => ({
        pipeline_id: pipeline.id,
        name: s.name,
        color: s.color,
        position: s.position,
      }));

      const { error: sErr } = await supabase
        .from("pipeline_stages")
        .insert(stagePayloads);

      if (!sErr) {
        stagesCreated += stagePayloads.length;
      }
    }

    // ── Workspace Tags ────────────────────────────────────────────────────
    for (const tag of WORKSPACE_TAGS) {
      // Idempotent check
      const { data: existing } = await supabase
        .from("tags")
        .select("id")
        .eq("account_id", accountId)
        .eq("name", tag.name)
        .maybeSingle();

      if (existing) continue;

      const { error: tErr } = await supabase
        .from("tags")
        .insert({
          name: tag.name,
          color: tag.color,
          account_id: accountId,
          user_id: ownerId,
        });

      if (!tErr) wsTagsCreated++;
    }
  }

  stats.pipelines = pipelinesCreated;
  stats.pipelineStages = stagesCreated;
  stats.workspaceTags = wsTagsCreated;

  if (pipelinesCreated > 0) {
    logSuccess(MODULE, `${pipelinesCreated} Pipelines with ${stagesCreated} Stages created`);
  } else {
    logSkip(MODULE, "All pipelines already exist");
  }

  if (wsTagsCreated > 0) {
    logSuccess(MODULE, `${wsTagsCreated} Workspace Tags created`);
  }
}
