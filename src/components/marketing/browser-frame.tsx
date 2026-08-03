import React from "react";

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
}

export function BrowserFrame({ children, url = "app.syncwa.com" }: BrowserFrameProps) {
  return (
    <div className="w-full rounded-lg border border-border bg-card overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border select-none">
        {/* Browser control buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]/80 block" />
          <span className="w-3 h-3 rounded-full bg-[#eab308]/80 block" />
          <span className="w-3 h-3 rounded-full bg-[#22c55e]/80 block" />
        </div>
        {/* Mock URL Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mx-4 bg-background/50 text-muted-foreground text-[10px] rounded border border-border/80 px-4 py-1 text-center font-mono truncate">
          https://{url}
        </div>
        {/* Right spacing */}
        <div className="w-12" />
      </div>
      {/* Visual content wrapper */}
      <div className="w-full bg-background/95 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
