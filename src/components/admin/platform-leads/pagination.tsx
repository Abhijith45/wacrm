"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function LeadPagination({
  page,
  pageSize,
  totalCount,
  totalPages,
}: LeadPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalCount === 0 || totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl select-none">
      {/* Page Counts */}
      <span className="text-[10px] font-semibold text-muted-foreground">
        Showing <span className="font-bold text-foreground">{start}</span> to{" "}
        <span className="font-bold text-foreground">{end}</span> of{" "}
        <span className="font-bold text-foreground">{totalCount}</span> entries
      </span>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 p-0 text-xs font-semibold cursor-pointer disabled:opacity-50"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-bold text-foreground px-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 p-0 text-xs font-semibold cursor-pointer disabled:opacity-50"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
