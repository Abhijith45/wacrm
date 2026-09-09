import React from "react";
import { notFound } from "next/navigation";
import { getPlatformWorkspaceDetail } from "@/lib/leads/repository";
import { WorkspaceOperationsCenter } from "@/components/admin/workspaces/operations-center";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";

interface Params {
  workspaceId: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { workspaceId } = await params;
  const detail = await getPlatformWorkspaceDetail(workspaceId);
  return {
    title: detail ? `${detail.workspace.name} | Workspace Console` : "Workspace Not Found | SyncWA Admin",
  };
}

export default async function WorkspaceOperationsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { workspaceId } = await params;

  // Verify platform staff authentication
  await getCurrentPlatformStaff();

  // Load detailed workspace operational parameters
  const detail = await getPlatformWorkspaceDetail(workspaceId);
  if (!detail) {
    notFound();
  }

  return (
    <WorkspaceOperationsCenter
      initialDetail={detail}
    />
  );
}
