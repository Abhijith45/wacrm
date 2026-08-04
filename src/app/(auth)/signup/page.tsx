"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, CheckCircle, UsersRound, Eye, EyeOff, Check } from "lucide-react";
import { BrowserFrame } from "@/components/marketing/browser-frame";
import { DashboardMockup } from "@/components/marketing/screen-mockups";
import { cn } from "@/lib/utils";

// `useSearchParams` opts the component out of static prerendering
// unless wrapped in Suspense — same pattern as /login.
export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const searchParams = useSearchParams();
  // When the user lands here from `/join/<token>` we carry the
  // invite token in the query so it survives the signup → email
  // verification → redirect round-trip. `emailRedirectTo` below
  // points back at /join/<token> so the user lands on the redeem
  // step after verifying instead of being dropped on /dashboard.
  const inviteToken = searchParams.get("invite");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // If we have an invite token, point Supabase's verification
    // email back at the join page so the user can accept after
    // verifying. Without a token, Supabase uses its default
    // redirect (the app root).
    const emailRedirectTo = inviteToken
      ? `${window.location.origin}/join/${encodeURIComponent(inviteToken)}`
      : undefined;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden font-sans selection:bg-primary/20">
      {/* Left Brand Panel: Hidden on mobile/tablet, flex on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-card/30 via-background to-background border-r border-border p-8 py-6 flex-col justify-between relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.526_0.247_293_/_0.08),transparent_50%)] pointer-events-none" />
        
        {/* Top: Logo & Welcome */}
        <div className="space-y-4 relative z-10">
          <Link href="/" className="inline-flex items-center space-x-2">
            <img
              src="/syncwa-logo-no-bg.png"
              alt="SyncWA Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Start Growing with SyncWA
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Manage customer conversations, sales, marketing, and team collaboration from one unified platform.
            </p>
          </div>
          
          {/* Features Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs text-foreground/90 font-medium">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Shared Inbox</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>CRM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Automation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>Analytics</span>
            </div>
          </div>
        </div>

        {/* Bottom: Large Dashboard Preview */}
        <div className="w-full relative z-10 pt-4 mt-auto">
          <BrowserFrame url="app.syncwa.com/dashboard">
            <DashboardMockup />
          </BrowserFrame>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 lg:px-8 relative bg-card/10">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo header */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-4">
            <img
              src="/syncwa-logo-no-bg.png"
              alt="SyncWA Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Start Growing with SyncWA</h2>
              <p className="text-xs text-muted-foreground">Manage customer conversations, sales, and automation.</p>
            </div>
          </div>

          {success ? (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="items-center text-center space-y-2">
                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl text-foreground font-bold">
                  Check your email
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-normal">
                  We&apos;ve sent a confirmation link to{" "}
                  <span className="text-foreground font-semibold">{email}</span>. Please check your
                  inbox and click the link to verify your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={
                    inviteToken
                      ? `/login?invite=${encodeURIComponent(inviteToken)}`
                      : "/login"
                  }
                >
                  <Button
                    variant="outline"
                    className="w-full border-border text-xs h-9 cursor-pointer"
                  >
                    Back to sign in
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="space-y-1 text-center sm:text-left">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mx-auto sm:mx-0">
                  {inviteToken ? (
                    <UsersRound className="h-4.5 w-4.5 text-primary" />
                  ) : (
                    <MessageSquare className="h-4.5 w-4.5 text-primary" />
                  )}
                </div>
                <CardTitle className="text-xl text-foreground font-bold">
                  {inviteToken ? "Create account & join" : "Create account"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-normal">
                  {inviteToken
                    ? "Verify your email, then accept the invitation to join your team."
                    : "Get started with CRM Template for WhatsApp"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive-foreground">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-foreground/90">
                      Full name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-9 text-xs border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground/90">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 text-xs border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground/90">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-9 text-xs pr-10 border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/90">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-9 text-xs pr-10 border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-9 w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <span>Create account</span>
                    )}
                  </Button>
                </form>

                {/* Divider: or */}
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-border/60"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-muted-foreground uppercase font-semibold select-none">
                    or
                  </span>
                  <div className="flex-grow border-t border-border/60"></div>
                </div>

                {/* Footer text */}
                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href={
                      inviteToken
                        ? `/login?invite=${encodeURIComponent(inviteToken)}`
                        : "/login"
                    }
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Subtle footer links */}
          <div className="flex items-center justify-center space-x-4 text-[10px] text-muted-foreground/80">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
