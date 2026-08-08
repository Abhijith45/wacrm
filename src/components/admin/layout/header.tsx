"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Menu, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import type { PlatformStaffContext } from "@/lib/auth/platform";
import { createClient } from "@/lib/supabase/client";
import { ModeToggle } from "@/components/layout/mode-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  staff: PlatformStaffContext;
  onMenuToggle: () => void;
}

export function AdminHeader({ staff, onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [customLabel, setCustomLabel] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = (e: Event) => {
      setCustomLabel((e as CustomEvent).detail);
    };
    window.addEventListener("syncwa-breadcrumb", handler);
    return () => window.removeEventListener("syncwa-breadcrumb", handler);
  }, []);

  React.useEffect(() => {
    setCustomLabel(null);
  }, [pathname]);

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment);
      const label = isUuid
        ? (customLabel || "Details")
        : segment
            .replace(/-/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());

      return { label, href, isLast };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 lg:px-6 select-none">
      {/* Left side: Hamburger + Breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2">
        {/* Menu toggle for Mobile/Tablet */}
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground transition-colors cursor-pointer">
            Admin
          </Link>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
              {crumb.isLast ? (
                <span className="text-foreground font-bold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors cursor-pointer">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right side: ModeToggle + Dropdown Menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-muted/70 focus:bg-muted/70 focus:outline-none data-popup-open:bg-muted/70 sm:gap-3 sm:pl-1 sm:pr-3 cursor-pointer"
          >
            <Avatar className="size-8">
              {staff.avatarUrl ? (
                <AvatarImage
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {staff.fullName?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-foreground sm:inline">
              {staff.fullName || "SyncWA Operator"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="min-w-56 bg-popover text-popover-foreground ring-border"
          >
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium text-foreground">
                {staff.fullName || "SyncWA Operator"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {staff.email || ""}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              render={
                <Link
                  href="/admin/settings"
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                />
              }
            >
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href="/admin/settings"
                  className="text-popover-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                />
              }
            >
              <SettingsIcon className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-popover-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
