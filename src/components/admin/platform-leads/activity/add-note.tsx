"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { HydratedActivity } from "@/lib/leads/repository";

interface AddNoteFormProps {
  leadId: string;
  onNoteAdded: (note: HydratedActivity) => void;
}

export function AddNoteForm({ leadId, onNoteAdded }: AddNoteFormProps) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = note.trim();
    if (!trimmed) {
      setErrorMsg("Note content cannot be empty.");
      return;
    }

    if (trimmed.length > 2000) {
      setErrorMsg("Note content exceeds 2000 characters limit.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/leads/${leadId}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to persist note. Please try again.");
      }

      // Reset state and notify parent component
      setNote("");
      onNoteAdded(data.activity);
    } catch (err) {
      console.error("[AddNoteForm] note submission failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 select-none bg-card border border-border p-4 rounded-xl">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-foreground">
        <MessageSquarePlus className="h-4 w-4 text-muted-foreground/80" />
        <span>Add Internal Activity Note</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-2 text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-normal font-semibold">{errorMsg}</p>
        </div>
      )}

      <Textarea
        placeholder="Write operator remarks, call logs, or meeting notes here..."
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
        rows={3}
        disabled={submitting}
        className="resize-none text-xs border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
      />

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          size="sm"
          className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving Note...
            </>
          ) : (
            "Save Note"
          )}
        </Button>
      </div>
    </form>
  );
}
