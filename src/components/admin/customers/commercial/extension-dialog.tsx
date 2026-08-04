"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtensionDialogProps {
  onClose: () => void;
  onConfirm: (days: number, reason: string) => Promise<void>;
  loading: boolean;
}

export function ExtensionDialog({
  onClose,
  onConfirm,
  loading,
}: ExtensionDialogProps) {
  const [days, setDays] = useState(7);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0 || !reason.trim() || loading) return;
    await onConfirm(days, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card border border-border w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 text-left select-none animate-scale-in mx-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
            Extend Trial Duration
          </h3>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Manually extend this workspace trial period. All updates are logged in the audit trail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Extension Days */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground uppercase font-bold block">
              Days to Extend
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={loading}
              className="w-full bg-muted/30 border border-input rounded-md px-3 py-1.5 focus:outline-none focus:border-primary disabled:opacity-50 text-xs text-foreground font-bold"
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground uppercase font-bold block">
              Reason for Extension
            </label>
            <textarea
              placeholder="e.g. Client requested demo extension to complete security review..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="w-full h-20 bg-muted/30 border border-input rounded-md px-3 py-1.5 focus:outline-none focus:border-primary disabled:opacity-50 text-xs text-foreground font-medium resize-none"
              required
            />
          </div>

          {/* Warning notice */}
          <div className="p-2.5 bg-muted/40 border border-border text-muted-foreground rounded-lg text-[10px] leading-relaxed">
            Note: Extending the trial automatically reactivates the workspace if it was suspended due to expiration.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-md border border-border text-xs font-semibold hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading || days <= 0 || !reason.trim()}
              className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 h-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Extend Trial</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
