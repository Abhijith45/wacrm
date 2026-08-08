"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import type { PlatformStaffContext } from "@/lib/auth/platform";

interface AdminShellProps {
  staff: PlatformStaffContext;
  children: React.ReactNode;
}

export function AdminShell({ staff, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar staff={staff} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader staff={staff} onMenuToggle={() => setSidebarOpen(true)} />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
