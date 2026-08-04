// ===========================================================================
// SyncWA Seed Module — Workspace Users
// Creates admin and agent users for each customer workspace.
// ===========================================================================

import {
  findUserByEmail,
  createAuthUser,
  reassignProfileToAccount,
  logSuccess,
  logSkip,
  logError,
  SeededRandom,
  randomName,
  sleep,
} from "./utils.mjs";

const MODULE = "users";

/**
 * Creates workspace team members (admins, agents) for each customer workspace.
 * Idempotent: checks by email before creating each user.
 *
 * The handle_new_user trigger creates a personal account per user.
 * After creation, we reassign the user's profile to the customer workspace account.
 * The orphan personal account is left in place (as per the migration design).
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedUsers(ctx) {
  const { supabase, profile, stats } = ctx;
  const workspaces = ctx.seededData.workspaces || [];

  if (workspaces.length === 0) {
    logSkip(MODULE, "No workspaces — skipping user creation");
    stats.users = 0;
    return;
  }

  const rng = new SeededRandom(4001);
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const ws of workspaces) {
    const { accountId, companyName, admins: adminCount, agents: agentCount } = ws;
    if (!accountId) continue;

    const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const usersToCreate = [];

    // Build admin user list
    for (let i = 0; i < adminCount; i++) {
      const name = randomName(rng);
      usersToCreate.push({
        name,
        email: `admin${i + 1}@${companySlug}-demo.com`,
        role: "admin",
      });
    }

    // Build agent user list
    for (let i = 0; i < agentCount; i++) {
      const name = randomName(rng);
      usersToCreate.push({
        name,
        email: `agent${i + 1}@${companySlug}-demo.com`,
        role: "agent",
      });
    }

    for (const user of usersToCreate) {
      // Idempotent guard
      const existing = await findUserByEmail(supabase, user.email);

      if (existing) {
        // Ensure they're assigned to the correct workspace
        await reassignProfileToAccount(supabase, existing.id, accountId, user.role);
        console.log(`    ↳ Existing ${user.role}: ${user.email} / SyncWA@Demo2026!`);
        totalSkipped++;
        continue;
      }

      try {
        const { userId } = await createAuthUser(
          supabase,
          user.email,
          "SyncWA@Demo2026!",
          user.name
        );

        // Reassign from personal account to workspace account
        await reassignProfileToAccount(supabase, userId, accountId, user.role);
        console.log(`    ↳ Created ${user.role}: ${user.email} / SyncWA@Demo2026!`);
        totalCreated++;
      } catch (err) {
        logError(MODULE, `Failed to create ${user.role} ${user.email}: ${err.message}`);
      }

      // Small delay to avoid hammering the auth API
      await sleep(100);
    }
  }

  stats.users = totalCreated + totalSkipped;

  if (totalSkipped > 0) {
    logSuccess(MODULE, `${totalCreated} users created, ${totalSkipped} already existed`);
  } else if (totalCreated > 0) {
    logSuccess(MODULE, `${totalCreated} Workspace Users created`);
  } else {
    logSkip(MODULE, "No users to create");
  }
}
