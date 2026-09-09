"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeadToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state to keep UI input snappy while debouncing/submitting
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [source, setSource] = useState(searchParams.get("source") || "");
  const [requestType, setRequestType] = useState(searchParams.get("requestType") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Sync state if URL changes out-of-band
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setStatus(searchParams.get("status") || "");
    setSource(searchParams.get("source") || "");
    setRequestType(searchParams.get("requestType") || "");
    setSortBy(searchParams.get("sortBy") || "newest");
  }, [searchParams]);

  // Push updates to URL query string
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Maintain local query input state to prevent state wiping on dropdown filters
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page index on filter or search parameter change
    if (!updates.hasOwnProperty("page")) {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q });
  };

  const handleClear = () => {
    setQ("");
    setStatus("");
    setSource("");
    setRequestType("");
    setSortBy("newest");
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("status") ||
    searchParams.has("source") ||
    searchParams.has("requestType") ||
    searchParams.get("sortBy") !== "newest" && searchParams.has("sortBy");

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border border-border rounded-xl select-none">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search name, company, email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-muted/40 border border-input rounded-md pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                updateUrl({ status: e.target.value });
              }}
              className="flex h-8 rounded-md border border-input bg-muted/20 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="demo_scheduled">Demo Scheduled</option>
              <option value="demo_completed">Demo Completed</option>
              <option value="trial_active">Trial Active</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
              <option value="unqualified">Unqualified</option>
            </select>
          </div>

          {/* Source Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Source</span>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                updateUrl({ source: e.target.value });
              }}
              className="flex h-8 rounded-md border border-input bg-muted/20 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Sources</option>
              <option value="contact_form">Contact Form</option>
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
            </select>
          </div>

          {/* Request Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Type</span>
            <select
              value={requestType}
              onChange={(e) => {
                setRequestType(e.target.value);
                updateUrl({ requestType: e.target.value });
              }}
              className="flex h-8 rounded-md border border-input bg-muted/20 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Types</option>
              <option value="DEMO">Demo</option>
              <option value="ONBOARDING">Onboarding</option>
              <option value="GENERAL">General</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="TECHNICAL">Technical</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrl({ sortBy: e.target.value });
              }}
              className="flex h-8 rounded-md border border-input bg-muted/20 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="company">Company (A-Z)</option>
              <option value="status">Status (A-Z)</option>
              <option value="request_type">Request Type</option>
            </select>
          </div>

          {/* Reset Filters Option */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
