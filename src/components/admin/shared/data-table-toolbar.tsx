"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  onSearchChange,
  searchValue = "",
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/20 border border-border rounded-lg select-none">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-card border border-input rounded-md pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Action / Filter Containers */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted/50 cursor-pointer"
          disabled
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          Filter
        </Button>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
