import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// --- Scenario knobs the mock reads -----------------------------------------
let mockUser: { id: string } | null = null;
let mockIsPlatformStaff = false;
let refreshedCookies: Array<{
  name: string;
  value: string;
  options: Record<string, unknown>;
}> = [];

vi.mock("@supabase/ssr", () => ({
  createServerClient: (
    _url: string,
    _key: string,
    opts: {
      cookies: { setAll: (c: typeof refreshedCookies) => void };
    },
  ) => ({
    auth: {
      getUser: async () => {
        if (refreshedCookies.length) opts.cookies.setAll(refreshedCookies);
        return { data: { user: mockUser } };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            return { data: { is_platform_staff: mockIsPlatformStaff } };
          },
        }),
      }),
    }),
  }),
}));

// Imported after the mock is registered.
const { proxy } = await import("./proxy");

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  mockUser = null;
  mockIsPlatformStaff = false;
  refreshedCookies = [];
});

afterEach(() => vi.clearAllMocks());

const ROTATED = {
  name: "sb-test-auth-token",
  value: "rotated-refresh-token",
  options: { path: "/", httpOnly: true },
};

describe("proxy — refreshed auth cookies survive redirects", () => {
  it("carries the rotated token when redirecting a customer user off /login to /dashboard", async () => {
    mockUser = { id: "user-1" };
    mockIsPlatformStaff = false;
    refreshedCookies = [ROTATED];

    const res = await proxy(
      new NextRequest("https://app.test/login"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
    expect(res.cookies.get(ROTATED.name)?.value).toBe(ROTATED.value);
  });

  it("carries the rotated token when redirecting an unauth user to /login", async () => {
    mockUser = null;
    refreshedCookies = [{ ...ROTATED, value: "cleared" }];

    const res = await proxy(
      new NextRequest("https://app.test/dashboard"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
    expect(res.cookies.get(ROTATED.name)?.value).toBe("cleared");
  });

  it("redirects a signed-in user with an invite token to /join/<token>", async () => {
    mockUser = { id: "user-1" };
    mockIsPlatformStaff = false;
    refreshedCookies = [ROTATED];

    const res = await proxy(
      new NextRequest("https://app.test/login?invite=abc123"),
    );

    expect(res.headers.get("location")).toContain("/join/abc123");
    expect(res.cookies.get(ROTATED.name)?.value).toBe(ROTATED.value);
  });

  it("passes through (no redirect) for a signed-in customer on a protected page", async () => {
    mockUser = { id: "user-1" };
    mockIsPlatformStaff = false;
    refreshedCookies = [ROTATED];

    const res = await proxy(
      new NextRequest("https://app.test/dashboard"),
    );

    // No redirect — the normal NextResponse.next() already carries cookies.
    expect(res.headers.get("location")).toBeNull();
    expect(res.cookies.get(ROTATED.name)?.value).toBe(ROTATED.value);
  });

  it("redirects public visitors off /signup to /login if invite token is missing", async () => {
    mockUser = null;
    refreshedCookies = [];

    const res = await proxy(
      new NextRequest("https://app.test/signup"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("passes through for a public visitor on /signup if invite token is present", async () => {
    mockUser = null;
    refreshedCookies = [];

    const res = await proxy(
      new NextRequest("https://app.test/signup?invite=abc123"),
    );

    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects a signed-in Platform Staff user off /login to /admin", async () => {
    mockUser = { id: "user-staff" };
    mockIsPlatformStaff = true;
    refreshedCookies = [ROTATED];

    const res = await proxy(
      new NextRequest("https://app.test/login"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin");
  });

  it("redirects Platform Staff user off customer routes to /admin", async () => {
    mockUser = { id: "user-staff" };
    mockIsPlatformStaff = true;

    const res = await proxy(
      new NextRequest("https://app.test/dashboard"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin");
  });

  it("redirects Customer user off admin routes to /dashboard", async () => {
    mockUser = { id: "user-customer" };
    mockIsPlatformStaff = false;

    const res = await proxy(
      new NextRequest("https://app.test/admin/platform-leads"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });
});
