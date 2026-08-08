"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
import { MessageSquare, UsersRound, Eye, EyeOff, Check } from "lucide-react";
import { BrowserFrame } from "@/components/marketing/browser-frame";
import { DashboardMockup } from "@/components/marketing/screen-mockups";
import { cn } from "@/lib/utils";

// `useSearchParams` opts the component out of static prerendering
// unless it sits under a Suspense boundary. We split the form into
// a child component so the outer page can prerender the chrome
// (background, card frame) while the form hydrates with the query
// string on the client.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  // Forwarded from `/join/<token>` when the visitor already has an
  // account. After a successful sign-in we send them to the join
  // page to accept rather than to /dashboard.
  const inviteToken = searchParams.get("invite");
  const t = useTranslations("LoginPage");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Full-page navigation (not router.push) so the browser issues a
    // fresh top-level request that carries the just-written Supabase
    // auth cookies to the middleware gating /dashboard. A soft
    // client-side navigation can reach the protected route before the
    // server observes the new session, so the middleware bounces it
    // back to /login — which looks like the page "just refreshing"
    // instead of signing in (issue #365). Mirrors the deliberate full
    // reload the invite-accept flow already uses in join/[token].
    const destination = inviteToken
      ? `/join/${encodeURIComponent(inviteToken)}`
      : "/dashboard";
    window.location.href = destination;
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
              Welcome Back to SyncWA
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

      {/* Right Login Form Panel */}
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
              <h2 className="text-xl font-bold text-foreground">Welcome Back to SyncWA</h2>
              <p className="text-xs text-muted-foreground">Manage customer conversations, sales, and automation.</p>
            </div>
          </div>

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
                {inviteToken ? t('titleAccept') : t('titleWelcome')}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-normal">
                {inviteToken ? t('descAccept') : t('descWelcome')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive-foreground">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground/90">
                    {t('emailLabel')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 text-xs border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground/90">
                      {t('passwordLabel')}
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t('passwordPlaceholder')}
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>{t('signingIn')}</span>
                    </div>
                  ) : (
                    <span>{t('signIn')}</span>
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
              {inviteToken ? (
                <p className="text-center text-xs text-muted-foreground">
                  {t('noAccount')}{" "}
                  <Link
                    href={`/signup?invite=${encodeURIComponent(inviteToken)}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {t('createAccount')}
                  </Link>
                </p>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-foreground">
                      {t('needAccessTitle')}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {t('needAccessDesc')}
                    </p>
                  </div>
                  <Link href="/contact" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-border text-xs h-9 cursor-pointer"
                    >
                      {t('talkToSales')}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
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
