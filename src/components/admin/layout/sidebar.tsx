"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Layers,
  CheckSquare,
  Settings,
  Shield,
  LogOut,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformStaffContext } from "@/lib/auth/platform";

interface AdminSidebarProps {
  staff: PlatformStaffContext;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ staff, isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const sections = [
    {
      title: "Platform",
      items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "Sales",
      items: [{ name: "Platform Leads", href: "/admin/leads", icon: ClipboardList }],
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
      items: [{ name: "Settings", href: "/admin/settings", icon: Settings }],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-full transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="relative h-8 w-8">
              <Image
                src="/syncwa-logo-no-bg.png"
                alt="SyncWA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">
                SyncWA
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                Owner Portal
              </span>
            </div>
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <span className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest block select-none">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 group relative",
                        active
                          ? "bg-primary-soft text-primary font-bold shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.name}</span>
                      {active && (
                        <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="px-6 py-4 border-t border-border space-y-3.5 bg-muted/10">
          {/* Docs placeholder link */}
          <Link
            href="/docs/SYNCWA_CUSTOMIZATION_GUIDE.md"
            className="flex items-center space-x-2 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-foreground" />
            <span>Documentation</span>
          </Link>

          {/* Version */}
          <div className="flex items-center justify-between text-[9px] font-semibold text-muted-foreground/50 select-none">
            <span>SyncWA Version</span>
            <span>v0.8.0</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-card border border-border">
            <div className="h-8 w-8 rounded-full bg-primary-soft border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {staff.avatarUrl ? (
                <Image
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                staff.fullName.charAt(0).toUpperCase() || <Shield className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate leading-normal">
                {staff.fullName || "SyncWA Operator"}
              </p>
              <p className="text-[9px] text-muted-foreground truncate leading-normal capitalize font-semibold">
                {staff.platformRole}
              </p>
            </div>
            <Link
              href="/login"
              title="Log Out"
              className="p-1 rounded-md text-muted-foreground hover:bg-destructive-soft hover:text-destructive transition-colors shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
