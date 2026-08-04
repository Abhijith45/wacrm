#!/usr/bin/env node
// ===========================================================================
// SyncWA Development Data Seeder — Orchestrator
//
// Usage:
//   node scripts/seed/index.mjs demo       # or: npm run seed
//   node scripts/seed/index.mjs testing    # or: npm run seed:testing
//   node scripts/seed/index.mjs production # or: npm run seed:production
// ===========================================================================

import { loadEnv, createAdminClient, log, logSuccess, logError, formatNumber } from "./utils.mjs";
import { getDemoProfile } from "./profiles/demo.mjs";
import { getTestingProfile } from "./profiles/testing.mjs";
import { getProductionProfile } from "./profiles/production.mjs";
import { seedPlatform } from "./platform.mjs";
import { seedLeads } from "./leads.mjs";
import { seedTags } from "./tags.mjs";
import { seedWorkspaces } from "./workspaces.mjs";
import { seedUsers } from "./users.mjs";
import { seedPipelines } from "./pipelines.mjs";
import { seedActivities } from "./activities.mjs";
import { seedCommunications } from "./communications.mjs";

// ── ANSI Helpers ────────────────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

// ── Profile Resolver ────────────────────────────────────────────────────────
function resolveProfile(profileName) {
  switch (profileName) {
    case "demo":
      return getDemoProfile();
    case "testing":
      return getTestingProfile();
    case "production":
      return getProductionProfile();
    default:
      return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();

  // Parse profile argument
  const profileName = process.argv[2] || "demo";
  const profile = resolveProfile(profileName);

  if (!profile) {
    console.error(
      `${C.red}Unknown profile "${profileName}".${C.reset} Available profiles: demo, testing, production`
    );
    process.exit(1);
  }

  // Print header
  console.log("");
  console.log(`${C.bold}${C.cyan} ═══════════════════════════════════════════${C.reset}`);
  console.log(`${C.bold}${C.cyan}  SyncWA Development Data Seeder${C.reset}`);
  console.log(`${C.bold}${C.cyan}  Profile: ${C.yellow}${profile.name}${C.reset}`);
  console.log(`${C.bold}${C.cyan} ═══════════════════════════════════════════${C.reset}`);
  console.log("");

  // Load environment
  try {
    loadEnv();
    log("seed", "Environment loaded from .env.local");
  } catch (err) {
    logError("seed", err.message);
    process.exit(1);
  }

  // Validate required env vars
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  for (const key of required) {
    if (!process.env[key]) {
      logError("seed", `Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }

  // Create Supabase admin client
  const supabase = createAdminClient();
  log("seed", "Supabase admin client initialized");

  // ── Schema Cache Validation ─────────────────────────────────────────────
  // PostgREST caches the database schema. If migrations were applied but
  // the cache was never reloaded, all operations on new tables/columns fail.
  // We validate upfront and attempt an automatic reload.
  log("seed", "Validating PostgREST schema cache...");

  const { error: schemaCheck } = await supabase
    .from("profiles")
    .update({ is_platform_staff: false })
    .eq("id", "00000000-0000-0000-0000-000000000000");

  if (schemaCheck && schemaCheck.message?.includes("schema cache")) {
    log("seed", "Schema cache is stale — attempting automatic reload...");

    // Try to reload via NOTIFY by creating a temporary function
    const reloadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/reload_pgrst_schema`;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // First, create the helper function via direct SQL
    // (using the /pg endpoint if available, or Management API)
    try {
      // Attempt reload via pg_notify through a known function
      // This uses the Supabase-specific extension endpoint
      const notifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/extensions__pg_notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ channel: "pgrst", payload: "reload schema" }),
        }
      );

      if (notifyResponse.ok) {
        log("seed", "NOTIFY pgrst sent — waiting 3s for cache reload...");
        await new Promise((r) => setTimeout(r, 3000));

        // Re-check
        const { error: recheck } = await supabase
          .from("profiles")
          .update({ is_platform_staff: false })
          .eq("id", "00000000-0000-0000-0000-000000000000");

        if (!recheck || !recheck.message?.includes("schema cache")) {
          logSuccess("seed", "Schema cache reloaded successfully!");
        } else {
          throw new Error("Still stale after NOTIFY");
        }
      } else {
        throw new Error("NOTIFY endpoint not available");
      }
    } catch {
      console.log("");
      logError("seed", "PostgREST schema cache is stale and could not be auto-reloaded.");
      console.log("");
      console.log(`${C.bold}${C.yellow}  ┌────────────────────────────────────────────────────────────┐${C.reset}`);
      console.log(`${C.bold}${C.yellow}  │  ACTION REQUIRED: Reload PostgREST Schema Cache          │${C.reset}`);
      console.log(`${C.bold}${C.yellow}  ├────────────────────────────────────────────────────────────┤${C.reset}`);
      console.log(`${C.yellow}  │                                                            │${C.reset}`);
      console.log(`${C.yellow}  │  Option 1 (Dashboard):                                     │${C.reset}`);
      console.log(`${C.yellow}  │    Supabase Dashboard → Settings → API                     │${C.reset}`);
      console.log(`${C.yellow}  │    → Click "Reload Schema Cache"                           │${C.reset}`);
      console.log(`${C.yellow}  │                                                            │${C.reset}`);
      console.log(`${C.yellow}  │  Option 2 (SQL Editor):                                    │${C.reset}`);
      console.log(`${C.yellow}  │    Run this in the SQL Editor:                             │${C.reset}`);
      console.log(`${C.yellow}  │    ${C.bold}NOTIFY pgrst, 'reload schema';${C.reset}${C.yellow}                       │${C.reset}`);
      console.log(`${C.yellow}  │                                                            │${C.reset}`);
      console.log(`${C.yellow}  │  Then re-run: ${C.bold}npm run seed${C.reset}${C.yellow}                                │${C.reset}`);
      console.log(`${C.bold}${C.yellow}  └────────────────────────────────────────────────────────────┘${C.reset}`);
      console.log("");
      process.exit(1);
    }
  } else {
    logSuccess("seed", "Schema cache is valid");
  }

  // Shared context object passed to all modules
  const ctx = {
    supabase,
    profile,
    stats: {
      platformOwners: 0,
      leads: 0,
      platformTags: 0,
      leadTagAssociations: 0,
      customers: 0,
      users: 0,
      pipelines: 0,
      pipelineStages: 0,
      workspaceTags: 0,
      activities: 0,
      communications: 0,
    },
    seededData: {
      platformOwnerId: null,
      leadIds: [],
      platformTagIds: [],
      workspaces: [],
      workspaceTagDefs: [],
    },
  };

  console.log("");

  // Execute seed modules in dependency order
  const modules = [
    { name: "Platform Owner", fn: seedPlatform },
    { name: "Platform Leads", fn: seedLeads },
    { name: "Platform Tags", fn: seedTags },
    { name: "Customer Workspaces", fn: seedWorkspaces },
    { name: "Workspace Users", fn: seedUsers },
    { name: "Pipelines & Tags", fn: seedPipelines },
    { name: "Timeline Activities", fn: seedActivities },
    { name: "Communications", fn: seedCommunications },
  ];

  for (const mod of modules) {
    try {
      await mod.fn(ctx);
    } catch (err) {
      logError("seed", `Module "${mod.name}" failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    }
  }

  // Print summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const { stats: s } = ctx;

  console.log("");
  console.log(`${C.bold}${C.cyan} ═══════════════════════════════════════════${C.reset}`);
  console.log(`${C.bold}  Summary${C.reset}`);
  console.log(`${C.dim} ─────────────────────────────────────────${C.reset}`);
  console.log(`  Platform Owner  : ${C.bold}${s.platformOwners}${C.reset}`);
  console.log(`  Customers       : ${C.bold}${s.customers}${C.reset}`);
  console.log(`  Users           : ${C.bold}${s.users}${C.reset}`);
  console.log(`  Leads           : ${C.bold}${formatNumber(s.leads)}${C.reset}`);
  console.log(`  Platform Tags   : ${C.bold}${s.platformTags}${C.reset}`);
  console.log(`  Workspace Tags  : ${C.bold}${s.workspaceTags}${C.reset}`);
  console.log(`  Pipelines       : ${C.bold}${s.pipelines}${C.reset}`);
  console.log(`  Stages          : ${C.bold}${s.pipelineStages}${C.reset}`);
  console.log(`  Activities      : ${C.bold}${formatNumber(s.activities)}${C.reset}`);
  console.log(`  Communications  : ${C.bold}${formatNumber(s.communications)}${C.reset}`);
  console.log(`${C.dim} ─────────────────────────────────────────${C.reset}`);
  console.log(`  ${C.green}✓ Completed Successfully${C.reset} ${C.dim}(${elapsed}s)${C.reset}`);
  console.log(`${C.bold}${C.cyan} ═══════════════════════════════════════════${C.reset}`);
  console.log("");
}

main().catch((err) => {
  logError("seed", `Unhandled error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
