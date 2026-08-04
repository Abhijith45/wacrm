"use client";

import React, { useState } from "react";
import { Loader2, Tag, Plus, X } from "lucide-react";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Button } from "@/components/ui/button";
import type { PlatformTag } from "@/lib/leads/repository";

interface TagManagerProps {
  leadTags: PlatformTag[];
  allTags: PlatformTag[];
  loading: boolean;
  onAddTag: (tagName: string) => Promise<void>;
  onRemoveTag: (tagId: string) => Promise<void>;
}

export function TagManager({
  leadTags,
  allTags,
  loading,
  onAddTag,
  onRemoveTag,
}: TagManagerProps) {
  const [newTag, setNewTag] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (!name || adding || loading) return;

    setAdding(true);
    try {
      await onAddTag(name);
      setNewTag("");
    } finally {
      setAdding(false);
    }
  };

  // Filter out tags that are already attached to this lead
  const suggestions = allTags.filter(
    (tag) => !leadTags.some((lt) => lt.id === tag.id)
  );

  return (
    <SectionCard title="Platform Tags" subtitle="Associate categorization tags.">
      <div className="space-y-4 text-xs font-semibold select-none">
        {/* Tags badges grid */}
        <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
          {leadTags.length === 0 ? (
            <span className="text-[10px] text-muted-foreground italic">
              No tags attached to this lead.
            </span>
          ) : (
            leadTags.map((tag) => (
              <span
                key={tag.id}
                style={{ backgroundColor: `${tag.color}10`, color: tag.color, borderColor: `${tag.color}25` }}
                className="inline-flex items-center pl-2 pr-1 py-0.5 rounded text-[10px] font-bold border"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => onRemoveTag(tag.id)}
                  disabled={loading}
                  className="ml-1 text-muted-foreground/60 hover:text-foreground shrink-0 focus:outline-none cursor-pointer disabled:opacity-50"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Suggestion tags shortcuts */}
        {suggestions.length > 0 && (
          <div className="space-y-1">
            <span className="text-[9px] text-muted-foreground uppercase font-bold block">
              Suggestions
            </span>
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 5).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onAddTag(tag.name)}
                  disabled={loading || adding}
                  style={{ color: tag.color }}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 hover:bg-muted cursor-pointer transition-colors"
                >
                  + {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form input */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Tag name (e.g. enterprise)..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              disabled={loading || adding}
              className="w-full bg-muted/30 border border-input rounded-md pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={loading || adding || !newTag.trim()}
            className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer h-8"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add
              </>
            )}
          </Button>
        </form>
      </div>
    </SectionCard>
  );
}
