// ===========================================================================
// SyncWA Seed Module — Platform Owner
// Creates the founding platform staff user.
// ===========================================================================

import { PLATFORM_OWNER } from "./config.mjs";
import {
  findUserByEmail,
  createAuthUser,
  updateProfilePlatformStaff,
  logSuccess,
  logSkip,
  logError,
} from "./utils.mjs";

const MODULE = "platform";

/**
 * Creates the Platform Owner (founder) if not already present.
 * Idempotent: skips creation if a user with the founder email exists.
 *
 * @param {object} ctx — Shared seeder context { supabase, profile, stats, seededData }
 */
export async function seedPlatform(ctx) {
  const { supabase, stats } = ctx;
  const { email, password, fullName, platformRole } = PLATFORM_OWNER;

  // 1. Check if founder already exists (idempotent guard)
  const existing = await findUserByEmail(supabase, email);

  if (existing) {
    logSkip(MODULE, `Platform Owner already exists (${email})`);
    console.log(`    ↳ Credentials: ${email} / ${password}`);
    ctx.seededData.platformOwnerId = existing.id;

    // Ensure platform staff flags are set even on re-run
    await updateProfilePlatformStaff(supabase, existing.id, platformRole);
    stats.platformOwners = 1;
    return;
  }

  // 2. Create auth user via Admin API
  try {
    const { userId } = await createAuthUser(
      supabase,
      email,
      password,
      fullName
    );

    // 3. Set platform staff flags
    await updateProfilePlatformStaff(supabase, userId, platformRole);

    ctx.seededData.platformOwnerId = userId;
    stats.platformOwners = 1;

    logSuccess(MODULE, `Platform Owner created (${email})`);
    console.log(`    ↳ Credentials: ${email} / ${password}`);
  } catch (err) {
    logError(MODULE, `Failed to create Platform Owner: ${err.message}`);
    throw err;
  }
}
