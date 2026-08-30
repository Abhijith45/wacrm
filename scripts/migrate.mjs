#!/usr/bin/env node
// ===========================================================================
// SyncWA Generic Database Migration Runner
//
// Usage:
//   node scripts/migrate.mjs          # or: npm run db:migrate
// ===========================================================================

import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "./seed/utils.mjs";

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

async function main() {
  console.log("");
  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
  console.log(`${C.bold}${C.cyan}                    SyncWA Generic Migration Runner                             ${C.reset}`);
  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
  console.log("");

  loadEnv();

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  const projectRef = projectUrl ? projectUrl.replace("https://", "").replace(".supabase.co", "") : null;

  const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.error(`${C.red}Migrations directory not found at ${migrationsDir}${C.reset}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  console.log(`Found ${files.length} migration files in supabase/migrations/\n`);

  if (dbUrl) {
    // -------------------------------------------------------------------------
    // Method 1: Direct Postgres Connection via pg module
    // -------------------------------------------------------------------------
    console.log(`${C.bold}${C.yellow}Executing migrations via direct Postgres connection (DATABASE_URL)...${C.reset}\n`);
    const { Client } = await import("pg");
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();

    try {
      for (const file of files) {
        console.log(`Applying: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, "utf-8");
        await client.query(sql);
        console.log(`${C.green}✔ ${file} applied successfully.${C.reset}`);
      }
    } finally {
      await client.end();
    }
  } else if (accessToken && projectRef) {
    // -------------------------------------------------------------------------
    // Method 2: Supabase Management API using SUPABASE_ACCESS_TOKEN
    // -------------------------------------------------------------------------
    console.log(`${C.bold}${C.yellow}Executing migrations via Supabase Management API (${projectRef})...${C.reset}\n`);
    
    for (const file of files) {
      console.log(`Applying: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/sql`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: sql })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`${C.red}✖ Failed applying ${file}: ${errText}${C.reset}`);
        process.exit(1);
      }
      console.log(`${C.green}✔ ${file} applied successfully.${C.reset}`);
    }
  } else {
    // -------------------------------------------------------------------------
    // Instructions when DDL credentials are missing in .env.local
    // -------------------------------------------------------------------------
    console.log(`${C.bold}${C.yellow}Generic Migration Setup Instructions:${C.reset}`);
    console.log(`The PostgREST service role key in .env.local grants full data access (DML),`);
    console.log(`but DDL schema migrations (creating functions, indexes, and columns) require one of the following:\n`);
    
    console.log(`${C.bold}Option 1: Add Postgres connection string to .env.local:${C.reset}`);
    console.log(`   ${C.cyan}DATABASE_URL="postgres://postgres.[project-ref]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"${C.reset}`);
    console.log(`   Then run: ${C.bold}npm run db:migrate${C.reset}\n`);

    console.log(`${C.bold}Option 2: Add Supabase Access Token to .env.local:${C.reset}`);
    console.log(`   ${C.cyan}SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxxxx"${C.reset} (from https://supabase.com/dashboard/account/tokens)`);
    console.log(`   Then run: ${C.bold}npm run db:migrate${C.reset}\n`);

    console.log(`${C.bold}Option 3: Run directly in Supabase Dashboard SQL Editor:${C.reset}`);
    console.log(`   Copy the SQL contents of files 037, 038, 039 directly into:`);
    console.log(`   ${C.cyan}https://supabase.com/dashboard/project/${projectRef || "<project-ref>"}/sql/new${C.reset}\n`);
  }

  console.log(`${C.bold}${C.cyan}================================================================================${C.reset}`);
}

main().catch(err => {
  console.error(`Migration script error: ${err.message}`, err);
  process.exit(1);
});
