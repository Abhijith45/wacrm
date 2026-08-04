"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      onClick={handleRefresh}
      size="sm"
      variant="outline"
      className="text-xs font-semibold border-border bg-card text-foreground hover:bg-muted/50 cursor-pointer"
      disabled={isPending}
    >
      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isPending ? "animate-spin" : ""}`} />
      Refresh
    </Button>
  );
}
