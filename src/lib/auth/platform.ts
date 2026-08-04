import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError, ForbiddenError } from "./account";

export type PlatformRole = "founder" | "admin" | "sales" | "support" | "finance" | "operations";

export interface PlatformStaffContext {
  userId: string;
  email: string;
  fullName: string;
  isPlatformStaff: boolean;
  platformRole: PlatformRole;
  avatarUrl: string | null;
}

/**
 * Resolve the active platform staff user context.
 * Throws UnauthorizedError if no authenticated session is present.
 * Throws ForbiddenError if the user profile does not carry is_platform_staff = true.
 */
export async function getCurrentPlatformStaff(): Promise<PlatformStaffContext> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    throw new UnauthorizedError("Unauthorized access to Platform CRM");
  }

  // Query profiles for the required platform role flags.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url, is_platform_staff, platform_role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile) {
    console.error("[getCurrentPlatformStaff] profile fetch error:", error);
    throw new ForbiddenError("Forbidden: Profile could not be resolved");
  }

  if (!profile.is_platform_staff || !profile.platform_role) {
    throw new ForbiddenError("Forbidden: Access restricted to platform staff");
  }

  return {
    userId: user.id,
    email: profile.email || user.email || "",
    fullName: profile.full_name || "",
    isPlatformStaff: profile.is_platform_staff,
    platformRole: profile.platform_role as PlatformRole,
    avatarUrl: profile.avatar_url || null,
  };
}

/**
 * Resolve context and assert a minimum list of allowed Platform Roles.
 */
export async function requirePlatformRole(allowedRoles: PlatformRole[]): Promise<PlatformStaffContext> {
  const ctx = await getCurrentPlatformStaff();
  if (!allowedRoles.includes(ctx.platformRole)) {
    throw new ForbiddenError(
      `Forbidden: Access restricted. Requires one of the following platform roles: ${allowedRoles.join(", ")}`
    );
  }
  return ctx;
}
