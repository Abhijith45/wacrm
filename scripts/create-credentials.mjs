#!/usr/bin/env node
// ===========================================================================
// SyncWA Test Credentials & Workspace Seeder Script
//
// Usage:
//   node scripts/create-credentials.mjs   # or: npm run seed:credentials
// ===========================================================================

import {
  loadEnv,
  createAdminClient,
  findUserByEmail,
  createAuthUser,
  updateProfilePlatformStaff,
  reassignProfileToAccount,
} from "./seed/utils.mjs";

// ANSI Colors for readable formatting
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  dim: "\x1b[2m",
};

async function main() {
  console.log("");
  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
  console.log(`${C.bold}${C.cyan}                SyncWA Test Credentials & Workspace Seeder                      ${C.reset}`);
  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
  console.log("");

  // 1. Load Environment & Initialize Supabase Admin Client
  loadEnv();
  const supabase = createAdminClient();

  // ---------------------------------------------------------------------------
  // 1. Founder / Admin Credentials
  // ---------------------------------------------------------------------------
  const founderEmail = "founder.admin@syncwa.com";
  const founderPassword = "SyncWA@Founder2026!";
  const founderName = "SyncWA Founder Admin";
  let founderUserId;

  const existingFounder = await findUserByEmail(supabase, founderEmail);
  if (existingFounder) {
    founderUserId = existingFounder.id;
    await updateProfilePlatformStaff(supabase, founderUserId, "founder");
  } else {
    const created = await createAuthUser(supabase, founderEmail, founderPassword, founderName);
    founderUserId = created.userId;
    await updateProfilePlatformStaff(supabase, founderUserId, "founder");
  }

  // ---------------------------------------------------------------------------
  // 2. Client A Credentials (Assigned Workspace + 5 Contacts)
  // ---------------------------------------------------------------------------
  const clientAEmail = "clienta.owner@syncwa.com";
  const clientAPassword = "SyncWA@ClientA2026!";
  const clientAName = "Client A Owner";
  const companyAName = "Client A Enterprise";
  const slugA = "client-a-enterprise";

  let clientAUserId, clientAAccountId, clientACustomerId;

  // Check or create Auth User for Client A
  const existingClientAUser = await findUserByEmail(supabase, clientAEmail);
  if (existingClientAUser) {
    clientAUserId = existingClientAUser.id;
    const { data: prof } = await supabase.from("profiles").select("account_id").eq("user_id", clientAUserId).maybeSingle();
    clientAAccountId = prof?.account_id;
  } else {
    const created = await createAuthUser(supabase, clientAEmail, clientAPassword, clientAName);
    clientAUserId = created.userId;
    clientAAccountId = created.accountId;
  }

  // Check or create platform_customers record for Client A
  let { data: custA } = await supabase.from("platform_customers").select("id").eq("email", clientAEmail).maybeSingle();
  if (!custA) {
    const { data: newCust, error: custErr } = await supabase
      .from("platform_customers")
      .insert({
        company_name: companyAName,
        email: clientAEmail,
        company_size: "11-50",
        status: "active",
      })
      .select("id")
      .single();
    if (custErr) throw new Error(`Failed to create platform customer A: ${custErr.message}`);
    custA = newCust;
  }
  clientACustomerId = custA.id;

  // Update or create accounts workspace for Client A
  if (clientAAccountId) {
    await supabase
      .from("accounts")
      .update({
        name: companyAName,
        slug: slugA,
        status: "active",
        customer_id: clientACustomerId,
      })
      .eq("id", clientAAccountId);
  } else {
    const { data: newAcc, error: accErr } = await supabase
      .from("accounts")
      .insert({
        name: companyAName,
        slug: slugA,
        status: "active",
        owner_user_id: clientAUserId,
        customer_id: clientACustomerId,
      })
      .select("id")
      .single();
    if (accErr) throw new Error(`Failed to create workspace for Client A: ${accErr.message}`);
    clientAAccountId = newAcc.id;
  }

  // Ensure profile points to workspace account
  await reassignProfileToAccount(supabase, clientAUserId, clientAAccountId, "owner");

  // Create 5 Contact Records under Client A's workspace
  const contactsData = [
    { name: "Rahul Sharma", phone: "6386206026", email: "rahul.sharma@example.com", company: "Sharma Enterprises" },
    { name: "Ananya Gupta", phone: "+919876543210", email: "ananya.g@example.com", company: "Gupta Logistics" },
    { name: "Vikram Patel", phone: "+919812345678", email: "vikram.p@example.com", company: "Patel Traders" },
    { name: "Priya Verma", phone: "+919711223344", email: "priya.v@example.com", company: "Verma Tech" },
    { name: "Amit Kumar", phone: "+919655443322", email: "amit.k@example.com", company: "Kumar Retail" },
  ];

  const seededContacts = [];
  for (const c of contactsData) {
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("id, name, phone, email, company")
      .eq("account_id", clientAAccountId)
      .eq("phone", c.phone)
      .maybeSingle();

    if (existingContact) {
      seededContacts.push(existingContact);
    } else {
      const { data: newContact, error: cErr } = await supabase
        .from("contacts")
        .insert({
          account_id: clientAAccountId,
          user_id: clientAUserId,
          name: c.name,
          phone: c.phone,
          email: c.email,
          company: c.company,
        })
        .select("id, name, phone, email, company")
        .single();

      if (!cErr && newContact) {
        seededContacts.push(newContact);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Client B Credentials (No Workspace Assigned)
  // ---------------------------------------------------------------------------
  const clientBEmail = "clientb.owner@syncwa.com";
  const clientBPassword = "SyncWA@ClientB2026!";
  const clientBName = "Client B Owner";
  const companyBName = "Client B Solutions";

  let clientBUserId, clientBCustomerId;

  const existingClientBUser = await findUserByEmail(supabase, clientBEmail);
  if (existingClientBUser) {
    clientBUserId = existingClientBUser.id;
  } else {
    const created = await createAuthUser(supabase, clientBEmail, clientBPassword, clientBName);
    clientBUserId = created.userId;
  }

  // Check or create platform_customers for Client B (without linked workspace account)
  let { data: custB } = await supabase.from("platform_customers").select("id").eq("email", clientBEmail).maybeSingle();
  if (!custB) {
    const { data: newCustB, error: custBErr } = await supabase
      .from("platform_customers")
      .insert({
        company_name: companyBName,
        email: clientBEmail,
        company_size: "1-10",
        status: "prospect",
      })
      .select("id")
      .single();
    if (custBErr) throw new Error(`Failed to create platform customer B: ${custBErr.message}`);
    custB = newCustB;
  }
  clientBCustomerId = custB.id;

  // Unlink any workspace account from Client B profile to keep as Unassigned
  await supabase
    .from("profiles")
    .update({ account_id: null, is_platform_staff: false })
    .eq("user_id", clientBUserId);

  // ---------------------------------------------------------------------------
  // 4. Output Summary to Console
  // ---------------------------------------------------------------------------
  console.log(`${C.bold}${C.green}✔ Credentials & Workspace setup completed successfully!${C.reset}\n`);

  console.log(`${C.bold}${C.yellow}1. Founder / Admin Credentials:${C.reset}`);
  console.log(`   ${C.bold}Role:${C.reset}        Platform Staff (Founder Admin)`);
  console.log(`   ${C.bold}Email:${C.reset}       ${founderEmail}`);
  console.log(`   ${C.bold}Password:${C.reset}    ${founderPassword}`);
  console.log(`   ${C.bold}Flags:${C.reset}       is_platform_staff = true, platform_role = founder\n`);

  console.log(`${C.bold}${C.yellow}2. Client A Credentials (Assigned Workspace):${C.reset}`);
  console.log(`   ${C.bold}Company:${C.reset}     ${companyAName}`);
  console.log(`   ${C.bold}Owner Name:${C.reset}  ${clientAName}`);
  console.log(`   ${C.bold}Email:${C.reset}       ${clientAEmail}`);
  console.log(`   ${C.bold}Password:${C.reset}    ${clientAPassword}`);
  console.log(`   ${C.bold}Workspace:${C.reset}   Client A Workspace (Slug: /${slugA})`);
  console.log(`   ${C.bold}Workspace ID:${C.reset} ${clientAAccountId}`);
  console.log(`   ${C.bold}Contacts (${seededContacts.length}):${C.reset}`);
  seededContacts.forEach((ct, idx) => {
    const isTarget = ct.phone === "6386206026";
    const highlight = isTarget ? `${C.bold}${C.magenta}` : C.reset;
    console.log(`     ${idx + 1}. ${highlight}${ct.name} | Phone: ${ct.phone} | Email: ${ct.email} | Co: ${ct.company}${C.reset}`);
  });
  console.log("");

  console.log(`${C.bold}${C.yellow}3. Client B Credentials (No Workspace Assigned):${C.reset}`);
  console.log(`   ${C.bold}Company:${C.reset}     ${companyBName}`);
  console.log(`   ${C.bold}Owner Name:${C.reset}  ${clientBName}`);
  console.log(`   ${C.bold}Email:${C.reset}       ${clientBEmail}`);
  console.log(`   ${C.bold}Password:${C.reset}    ${clientBPassword}`);
  console.log(`   ${C.bold}Workspace:${C.reset}   ${C.bold}${C.magenta}UNASSIGNED (No Workspace Account linked)${C.reset}\n`);

  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
}

main().catch((err) => {
  console.error(`${C.bold}\x1b[31mSeeding script execution failed: ${err.message}${C.reset}`, err);
  process.exit(1);
});
