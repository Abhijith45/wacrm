// ===========================================================================
// SyncWA Development Data Seeder — Utility Helpers
// ===========================================================================

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  FIRST_NAMES,
  LAST_NAMES,
  COMPANY_NAMES,
  LEAD_SOURCES,
  LEAD_STATUSES_DISTRIBUTION,
  SEED_DATE_RANGE_DAYS,
} from "./config.mjs";

// ── Environment Loading ─────────────────────────────────────────────────────

/**
 * Reads `.env.local` and populates process.env with its key=value pairs.
 * Handles quoted values and comments. No external dependency required.
 */
export function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  let content;
  try {
    content = readFileSync(envPath, "utf-8");
  } catch {
    throw new Error(
      `Cannot read .env.local at ${envPath}. Make sure you are running from the project root.`
    );
  }

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ── Supabase Admin Client ───────────────────────────────────────────────────

let _adminClient = null;

/**
 * Creates or returns a cached Supabase client using the service-role key.
 * Bypasses RLS — suitable for seeder operations.
 */
export function createAdminClient() {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
    );
  }

  _adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _adminClient;
}

// ── Deterministic Random (Seeded PRNG) ──────────────────────────────────────

/**
 * Simple seeded pseudo-random number generator (Mulberry32).
 * Produces deterministic sequences for reproducible seed data.
 */
export class SeededRandom {
  constructor(seed = 42) {
    this._seed = seed;
  }

  /** Returns a float in [0, 1) */
  next() {
    let t = (this._seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns an integer in [min, max] (inclusive) */
  between(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Returns a random element from an array */
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Returns a random subset of `count` elements from an array */
  pickMultiple(arr, count) {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
  }

  /** Picks from a weighted distribution array [{status, weight}] */
  pickWeighted(distribution) {
    const total = distribution.reduce((sum, d) => sum + d.weight, 0);
    let roll = this.next() * total;
    for (const d of distribution) {
      roll -= d.weight;
      if (roll <= 0) return d.status;
    }
    return distribution[distribution.length - 1].status;
  }
}

// ── Data Generators ─────────────────────────────────────────────────────────

/**
 * Generates a full name from first/last name pools.
 */
export function randomName(rng) {
  return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
}

/**
 * Generates a company name from the pool.
 */
export function randomCompanyName(rng) {
  return rng.pick(COMPANY_NAMES);
}

/**
 * Generates a realistic-looking phone number.
 */
export function randomPhone(rng) {
  const prefix = rng.pick(["+91", "+1", "+44", "+971", "+65"]);
  const digits = Array.from({ length: 10 }, () => rng.between(0, 9)).join("");
  return `${prefix}${digits}`;
}

/**
 * Generates a valid-format email from a name and optional company domain.
 */
export function randomEmail(name, companyDomain, rng) {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .split(" ")
    .filter(Boolean);
  const local =
    clean.length >= 2
      ? `${clean[0]}.${clean[1]}${rng.between(1, 99)}`
      : `${clean[0] || "user"}${rng.between(100, 999)}`;

  const domain =
    companyDomain ||
    rng.pick([
      "gmail.com",
      "outlook.com",
      "yahoo.com",
      "company.co",
      "business.io",
    ]);

  return `${local}@${domain}`;
}

/**
 * Generates a date within the past N days from now.
 */
export function randomDate(rng, daysBack = SEED_DATE_RANGE_DAYS) {
  const now = Date.now();
  const offset = rng.between(0, daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

/**
 * Generates a sorted array of dates (ascending) within the past N days.
 */
export function randomDateSeries(rng, count, daysBack = SEED_DATE_RANGE_DAYS) {
  const dates = Array.from({ length: count }, () => randomDate(rng, daysBack));
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Generates a random lead source.
 */
export function randomSource(rng) {
  return rng.pick(LEAD_SOURCES);
}

/**
 * Picks a lead status from the weighted distribution.
 */
export function randomLeadStatus(rng) {
  return rng.pickWeighted(LEAD_STATUSES_DISTRIBUTION);
}

/**
 * Converts a string to a URL-safe slug.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Auth Helpers ────────────────────────────────────────────────────────────

/**
 * Finds an existing auth user by email. Returns { id } or null.
 */
export async function findUserByEmail(supabase, email) {
  // Supabase Admin API: list users filtered by email
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }

  // Filter locally since listUsers doesn't support email filter directly
  // Use a direct query to auth.users as service role has access
  const { data: users, error: queryErr } = await supabase
    .from("profiles")
    .select("user_id, email")
    .eq("email", email)
    .maybeSingle();

  if (queryErr) return null;
  return users ? { id: users.user_id } : null;
}

/**
 * Creates a new auth user via the Supabase Admin API.
 * Waits for the handle_new_user trigger to create profile + account rows.
 * Returns { userId, accountId, profileId }.
 */
export async function createAuthUser(supabase, email, password, fullName) {
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (authError) {
    throw new Error(
      `Auth user creation failed for ${email}: ${authError.message}`
    );
  }

  const userId = authData.user.id;

  // Wait for the handle_new_user trigger to propagate (up to 3 retries)
  let profile = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data } = await supabase
      .from("profiles")
      .select("id, account_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (data?.account_id) {
      profile = data;
      break;
    }
    await sleep(300);
  }

  if (!profile?.account_id) {
    throw new Error(
      `Trigger propagation failed for user ${email} (${userId}). No profile/account found.`
    );
  }

  return {
    userId,
    accountId: profile.account_id,
    profileId: profile.id,
  };
}

/**
 * Sets platform staff flags on a user's profile.
 */
export async function updateProfilePlatformStaff(
  supabase,
  userId,
  platformRole
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      is_platform_staff: true,
      platform_role: platformRole,
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      `Failed to set platform staff for user ${userId}: ${error.message}`
    );
  }
}

/**
 * Reassigns a user's profile to a different account with a specific role.
 */
export async function reassignProfileToAccount(
  supabase,
  userId,
  accountId,
  role
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      account_id: accountId,
      account_role: role,
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      `Failed to reassign profile for user ${userId}: ${error.message}`
    );
  }
}

// ── Logging ─────────────────────────────────────────────────────────────────

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

export function log(module, message) {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log(
    `${COLORS.dim}${ts}${COLORS.reset} ${COLORS.cyan}[${module}]${COLORS.reset} ${message}`
  );
}

export function logSuccess(module, message) {
  log(module, `${COLORS.green}✓${COLORS.reset} ${message}`);
}

export function logSkip(module, message) {
  log(module, `${COLORS.yellow}⊘${COLORS.reset} ${message}`);
}

export function logError(module, message) {
  log(module, `${COLORS.red}✗${COLORS.reset} ${message}`);
}

// ── General Utilities ───────────────────────────────────────────────────────

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formats a number with thousands separators.
 */
export function formatNumber(n) {
  return n.toLocaleString("en-US");
}
