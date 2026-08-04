"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Shield, ChevronRight, Bell, Menu } from "lucide-react";
import type { PlatformStaffContext } from "@/lib/auth/platform";

interface AdminHeaderProps {
  staff: PlatformStaffContext;
  onMenuToggle: () => void;
}

export function AdminHeader({ staff, onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const label = segment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      return { label, href, isLast };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 select-none">
      {/* Left side: Hamburger + Breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Menu toggle for Mobile/Tablet */}
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground lg:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">
            Admin
          </span>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
              <span
                className={
                  crumb.isLast
                    ? "text-foreground font-bold"
                    : "hover:text-foreground transition-colors cursor-pointer"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right side: Search, Notifications, Badges */}
      <div className="flex items-center space-x-4">
        {/* Search Bar Placeholder */}
        <div className="relative w-48 sm:w-64 hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search leads, workspaces..."
            className="w-full bg-muted/40 border border-input rounded-md pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            disabled
          />
        </div>

        {/* Notifications Placeholder */}
        <button
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
          disabled
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />
        </button>

        {/* Platform Role Badge */}
        <div className="flex items-center space-x-2 border-l border-border pl-4">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-primary-soft border border-primary/20 text-primary text-[10px] font-bold select-none capitalize">
            <Shield className="h-2.5 w-2.5" />
            <span>{staff.platformRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
