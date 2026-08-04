import React from "react";
import { redirect } from "next/navigation";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export const metadata = {
  title: "Platform Admin | SyncWA",
  description: "SyncWA Platform Administration Portal",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let staffContext;
  try {
    staffContext = await getCurrentPlatformStaff();
  } catch (err) {
    console.error("[AdminLayout] Auth verification failed:", err);
    const isForbidden = err instanceof Error && err.message.includes("Forbidden");
    if (isForbidden) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  }

  return <AdminShell staff={staffContext}>{children}</AdminShell>;
}
