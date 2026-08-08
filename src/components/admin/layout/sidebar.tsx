"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Layers,
  CheckSquare,
  Settings,
  X,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformStaffContext } from "@/lib/auth/platform";
import { createClient } from "@/lib/supabase/client";
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

interface AdminSidebarProps {
  staff: PlatformStaffContext;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ staff, isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const sections = [
    {
      title: "Platform",
      items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "Sales",
      items: [{ name: "Platform Leads", href: "/admin/platform-leads", icon: ClipboardList }],
    },
    {
      title: "Customers",
      items: [
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Workspaces", href: "/admin/workspaces", icon: Layers },
        { name: "Onboarding", href: "/admin/onboarding", icon: CheckSquare },
      ],
    },
    {
      title: "Administration",
      items: [
        { name: "Settings", href: "/admin/settings", icon: Settings },
        { name: "Documentation", href: "/admin/docs", icon: FileText },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-out will-change-transform lg:translate-x-0 lg:static lg:z-0 lg:w-60 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Primary"
      >
        {/* Brand Header */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <div className="relative h-4 w-4">
                <Image
                  src="/syncwa-logo-no-bg.png"
                  alt="SyncWA Logo"
                  fill
                  className="object-contain invert dark:invert-0"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-none">
                SyncWA
              </span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mt-0.5 leading-none">
                Owner Portal
              </span>
            </div>
          </Link>

          {/* Close button for Mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest block select-none">
                {section.title}
              </span>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus:outline-none data-popup-open:bg-muted/60 cursor-pointer">
              <Avatar className="size-8 shrink-0">
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
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground leading-normal">
                  {staff.fullName || "SyncWA Operator"}
                </p>
                <p className="truncate text-xs text-muted-foreground leading-normal">
                  {staff.email || ""}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={6}
              className="min-w-56 bg-popover text-popover-foreground ring-border"
            >
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
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-popover-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
              >
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
