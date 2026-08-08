import React from "react";
import Link from "next/link";
import { Layers, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { StatusBadge } from "@/components/admin/common/status-badge";
import { getPlatformWorkspaces } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

export default async function AdminWorkspacesPage() {
  const workspaces = await getPlatformWorkspaces();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "paused":
        return "info";
      case "suspended":
        return "destructive";
      case "archived":
        return "neutral";
      default:
        return "info";
    }
  };

  return (
    <div className="space-y-6 select-none">
      <AdminPageHeader
        title="Workspace Operations"
        description="Monitor active workspace sub-systems, WhatsApp connectivity flags, and dynamic telemetry health status."
      >
        <div className="group relative">
          <Button
            size="sm"
            className="text-xs bg-muted text-muted-foreground border border-border font-semibold opacity-60 cursor-not-allowed"
            disabled
          >
            <Plus className="h-3 w-3 mr-1.5" />
            Provision Workspace
          </Button>
          <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-card text-foreground border border-border p-2 rounded shadow-lg text-[10px] w-64 z-50 font-bold">
            Manual provisioning is disabled. Workspaces are automatically provisioned during lead conversion.
          </div>
        </div>
      </AdminPageHeader>

      {workspaces.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-4">
          <Layers className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-sm font-bold text-foreground">No Workspaces Active</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Once platform customers are successfully converted, their provisioned backend systems and operational scopes will display here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-[10px] uppercase font-bold tracking-wider text-muted-foreground select-none">
                  <th className="py-3 px-5">Workspace Name</th>
                  <th className="py-3 px-5">Customer Company</th>
                  <th className="py-3 px-5">URL Slug</th>
                  <th className="py-3 px-5">Operation Status</th>
                  <th className="py-3 px-5 text-center">Health Score</th>
                  <th className="py-3 px-5">WhatsApp</th>
                  <th className="py-3 px-5 text-center">Teammates</th>
                  <th className="py-3 px-5">Last Activity</th>
                  <th className="py-3 px-5 text-right">Console</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map((ws) => (
                  <tr
                    key={ws.id}
                    className="border-b border-border hover:bg-muted/10 transition-colors text-xs font-semibold text-foreground select-none"
                  >
                    <td className="py-3.5 px-5 font-black">{ws.name}</td>
                    <td className="py-3.5 px-5 text-muted-foreground font-bold">{ws.customerCompanyName}</td>
                    <td className="py-3.5 px-5 font-mono text-muted-foreground">{ws.slug || "—"}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge
                        label={ws.operationalStatus}
                        variant={getStatusColor(ws.operationalStatus)}
                      />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[11px] font-black">{ws.healthScore}%</span>
                        <div className="w-12 bg-muted border border-border/60 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full transition-all ${
                              ws.healthScore >= 90
                                ? "bg-emerald-500"
                                : ws.healthScore >= 70
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${ws.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                          ws.whatsappStatus === "Connected"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {ws.whatsappStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold">{ws.membersCount}</td>
                    <td className="py-3.5 px-5 text-muted-foreground">
                      {new Date(ws.lastActivityDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link href={`/admin/workspaces/${ws.id}`}>
                        <button className="inline-flex items-center text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-wider cursor-pointer bg-transparent border-none">
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
