"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  id: string;
}

export function FeaturesNav() {
  const items: NavItem[] = [
    { label: "Communication", id: "communication" },
    { label: "CRM", id: "crm" },
    { label: "Sales", id: "sales" },
    { label: "Marketing", id: "marketing" },
    { label: "Automation", id: "automation" },
    { label: "Analytics", id: "analytics" },
    { label: "Team", id: "team" },
    { label: "Security", id: "security" },
    { label: "Integrations", id: "integrations" }
  ];

  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 110; // offset for header and sticky nav
      window.scrollTo({
        top,
        behavior: "smooth"
      });
      setActiveId(id);
    }
  };

  return (
    <div className="sticky top-14 z-30 w-full border-b border-border bg-background/95 backdrop-blur shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center overflow-x-auto scrollbar-none gap-6 text-xs font-semibold">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "whitespace-nowrap transition-colors py-1.5 border-b-2 cursor-pointer",
              activeId === item.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
