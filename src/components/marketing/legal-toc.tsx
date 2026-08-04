"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, List } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140; // viewport top offset
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial active highlight detection
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 90; // offset for headers
      window.scrollTo({
        top,
        behavior: "smooth"
      });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full lg:sticky lg:top-24 space-y-4">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden lg:block space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
          Table of Contents
        </h4>
        <nav className="flex flex-col space-y-2.5 border-l border-border pl-4 text-xs font-semibold">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleScrollTo(section.id)}
              className={cn(
                "text-left transition-colors cursor-pointer hover:text-foreground block py-0.5",
                activeId === section.id
                  ? "text-primary border-l-2 border-primary -ml-[18px] pl-[16px]"
                  : "text-muted-foreground"
              )}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Accordion Toggle */}
      <div className="lg:hidden border border-border bg-card rounded-lg overflow-hidden select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-foreground hover:bg-muted/50 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <List className="h-4 w-4 text-primary" />
            <span>Table of Contents</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="border-t border-border bg-card/50 p-3 flex flex-col space-y-2 text-xs font-semibold">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className={cn(
                  "w-full text-left p-2 rounded transition-colors cursor-pointer",
                  activeId === section.id
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
