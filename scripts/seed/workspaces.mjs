// ===========================================================================
// SyncWA Seed Module — Customer Workspaces
// Provisions customer workspaces by creating owners via Auth API,
// then configuring workspace accounts and platform customer records.
// ===========================================================================

import {
  findUserByEmail,
  createAuthUser,
  slugify,
  logSuccess,
  logSkip,
  logError,
  sleep,
  SeededRandom,
  randomDate,
} from "./utils.mjs";

const MODULE = "workspaces";

/**
 * Creates customer workspaces for each customer configuration in the profile.
 * Idempotent: checks by owner email and customer email before creating.
 *
 * Flow per customer:
 *   1. Create owner auth user → triggers handle_new_user → creates account + profile
 *   2. Update account with workspace metadata (slug, trial, limits)
 *   3. Pick a "converted" lead to link, or create a platform_customers record directly
 *   4. Link platform_customer ← account via customer_id
 *
 * @param {object} ctx — Shared seeder context
 */
export async function seedWorkspaces(ctx) {
  const { supabase, profile, stats } = ctx;
  const { customers } = profile;

  if (!customers || customers.length === 0) {
    logSkip(MODULE, "No customers to provision for this profile");
    stats.customers = 0;
    return;
  }

  const rng = new SeededRandom(2001);
  let created = 0;
  let skipped = 0;
  const workspaceData = [];

  for (const cust of customers) {
    // ── Idempotent Guard: Check if customer already exists by email ──────
    const { data: existingCustomer } = await supabase
      .from("platform_customers")
      .select("id")
      .eq("email", cust.ownerEmail)
      .maybeSingle();

    if (existingCustomer) {
      // Fetch existing workspace data for downstream modules
      const { data: existingAccount } = await supabase
        .from("accounts")
        .select("id, owner_user_id")
        .eq("customer_id", existingCustomer.id)
        .maybeSingle();

      workspaceData.push({
        customerId: existingCustomer.id,
        accountId: existingAccount?.id || null,
        ownerId: existingAccount?.owner_user_id || null,
        ownerEmail: cust.ownerEmail,
        companyName: cust.companyName,
        admins: cust.admins,
        agents: cust.agents,
      });

      skipped++;
      console.log(`[workspaces] ⊘ Workspace "${cust.companyName}" already exists`);
      console.log(`    ↳ Owner Credentials: ${cust.ownerEmail} / SyncWA@Demo2026!`);
      continue;
    }

    try {
      // ── 1. Create Owner Auth User ───────────────────────────────────────
      let userId, accountId;

      const existingUser = await findUserByEmail(supabase, cust.ownerEmail);

      if (existingUser) {
        userId = existingUser.id;
        // Get their account
        const { data: prof } = await supabase
          .from("profiles")
          .select("account_id")
          .eq("user_id", userId)
          .maybeSingle();
        accountId = prof?.account_id;
      } else {
        const result = await createAuthUser(
          supabase,
          cust.ownerEmail,
          "SyncWA@Demo2026!",
          cust.ownerName
        );
        userId = result.userId;
        accountId = result.accountId;
      }

      if (!accountId) {
        throw new Error(`No account found for owner ${cust.ownerEmail}`);
      }

      // ── 2. Update Account with Workspace Metadata ─────────────────────
      const slug = slugify(cust.companyName);
      const trialStart = randomDate(rng, 30);
      const trialEnd = new Date(trialStart.getTime() + 14 * 86400000);

      const { error: accErr } = await supabase
        .from("accounts")
        .update({
          name: cust.companyName,
          slug,
          status: "active",
          trial_started_at: trialStart.toISOString(),
          trial_ends_at: trialEnd.toISOString(),
          daily_broadcast_limit: 50,
        })
        .eq("id", accountId);

      if (accErr) {
        throw new Error(`Failed to update account: ${accErr.message}`);
      }

      // ── 3. Create Platform Customer Record ────────────────────────────
      const { data: customer, error: custErr } = await supabase
        .from("platform_customers")
        .insert({
          company_name: cust.companyName,
          email: cust.ownerEmail,
          phone: null,
          company_size: cust.companySize,
          status: "trial",
        })
        .select("id")
        .single();

      if (custErr) {
        throw new Error(`Failed to create customer: ${custErr.message}`);
      }

      // ── 4. Link Account ← Customer ───────────────────────────────────
      await supabase
        .from("accounts")
        .update({ customer_id: customer.id })
        .eq("id", accountId);

      // ── 5. Link a Converted Lead to this Customer (if available) ──────
      const leadIds = ctx.seededData.leadIds || [];
      const convertedLeads = [];

      // Find converted leads not yet linked to a customer
      for (const lid of leadIds) {
        const { data: lead } = await supabase
          .from("platform_leads")
          .select("id, status, workspace_id")
          .eq("id", lid)
          .eq("status", "converted")
          .is("workspace_id", null)
          .maybeSingle();

        if (lead) {
          convertedLeads.push(lead.id);
          if (convertedLeads.length >= 1) break;
        }
      }

      if (convertedLeads.length > 0) {
        const linkedLeadId = convertedLeads[0];
        await supabase
          .from("platform_leads")
          .update({
            workspace_id: accountId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", linkedLeadId);

        // Also link the customer to the lead
        await supabase
          .from("platform_customers")
          .update({ lead_id: linkedLeadId })
          .eq("id", customer.id);
      }

      workspaceData.push({
        customerId: customer.id,
        accountId,
        ownerId: userId,
        ownerEmail: cust.ownerEmail,
        companyName: cust.companyName,
        admins: cust.admins,
        agents: cust.agents,
      });

      created++;
      logSuccess(MODULE, `Workspace "${cust.companyName}" provisioned (/${slug})`);
      console.log(`    ↳ Owner Credentials: ${cust.ownerEmail} / SyncWA@Demo2026!`);
    } catch (err) {
      logError(MODULE, `Failed to provision "${cust.companyName}": ${err.message}`);
    }
  }

  ctx.seededData.workspaces = workspaceData;
  stats.customers = created + skipped;

  if (skipped > 0) {
    logSuccess(MODULE, `${created} workspaces created, ${skipped} already existed`);
  } else if (created > 0) {
    logSuccess(MODULE, `${created} Customer Workspaces provisioned`);
  }
}
