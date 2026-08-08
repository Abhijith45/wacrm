import React from "react";
import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { FileText, ChevronRight, BookOpen, AlertTriangle } from "lucide-react";
import { getCurrentPlatformStaff } from "@/lib/auth/platform";
import { AdminPageHeader } from "@/components/admin/common/page-header";
import { Card, CardContent } from "@/components/ui/card";

interface DocsPageProps {
  searchParams: Promise<{ doc?: string }>;
}

export default async function AdminDocsPage({ searchParams }: DocsPageProps) {
  // 1. Verify Platform Staff Authentication
  const staff = await getCurrentPlatformStaff();
  
  const params = await searchParams;
  const activeDocId = params.doc || "customization";

  // Document definitions
  const docsList = [
    { id: "customization", name: "Customization Guide", path: "docs/SYNCWA_CUSTOMIZATION_GUIDE.md" },
    { id: "engineering", name: "Engineering Standards", path: "docs/strategy/SYNCWA_ENGINEERING_STANDARDS.md" },
    { id: "acquisition", name: "Customer Acquisition Flow", path: "docs/CUSTOMER_ACQUISITION_FLOW.md" },
  ];

  const activeDoc = docsList.find((d) => d.id === activeDocId) || docsList[0];
  
  let docContent = "";
  let loadError = "";

  try {
    const filePath = join(process.cwd(), activeDoc.path);
    docContent = readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("[AdminDocsPage] Failed to read doc file:", err);
    loadError = "Could not load the specified document file. Please ensure it exists on the filesystem.";
  }

  // Simple Markdown to React Parser for rich representation
  function parseMarkdown(md: string) {
    const lines = md.split("\n");
    const parsed: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];
    let inBlockquote = false;
    let blockquoteText = "";
    let blockquoteType = "";

    const renderText = (text: string) => {
      // Process bold (**text**)
      let parts: React.ReactNode[] = [text];
      
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;
      const newParts: React.ReactNode[] = [];
      
      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          newParts.push(text.substring(lastIndex, match.index));
        }
        newParts.push(<strong key={match.index} className="font-extrabold text-foreground">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < text.length) {
        newParts.push(text.substring(lastIndex));
      }
      
      // Process inline code (`code`)
      const finalParts: React.ReactNode[] = [];
      newParts.forEach((part, i) => {
        if (typeof part !== 'string') {
          finalParts.push(part);
          return;
        }
        const codeRegex = /`(.*?)`/g;
        let cMatch;
        let cLastIndex = 0;
        while ((cMatch = codeRegex.exec(part)) !== null) {
          if (cMatch.index > cLastIndex) {
            finalParts.push(part.substring(cLastIndex, cMatch.index));
          }
          finalParts.push(
            <code key={`${i}-${cMatch.index}`} className="px-1.5 py-0.5 rounded bg-muted/75 font-mono text-[11px] text-primary-hover font-semibold">
              {cMatch[1]}
            </code>
          );
          cLastIndex = codeRegex.lastIndex;
        }
        if (cLastIndex < part.length) {
          finalParts.push(part.substring(cLastIndex));
        }
      });

      return finalParts.length > 0 ? finalParts : text;
    };

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        parsed.push(
          <ul key={`list-${key}`} className="list-disc pl-5 space-y-1.5 my-3 text-muted-foreground font-semibold leading-relaxed">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushBlockquote = (key: number) => {
      if (inBlockquote) {
        let variant = "info";
        if (blockquoteType === "IMPORTANT" || blockquoteType === "WARNING") variant = "warning";
        if (blockquoteType === "CAUTION") variant = "destructive";
        
        const colors = {
          info: "bg-blue-500/10 border-blue-500/30 text-blue-500",
          warning: "bg-amber-500/10 border-amber-500/30 text-amber-500",
          destructive: "bg-destructive/10 border-destructive/30 text-destructive",
        };

        parsed.push(
          <div key={`bq-${key}`} className={`p-4 border rounded-xl my-4 text-xs font-semibold leading-relaxed ${colors[variant as keyof typeof colors]}`}>
            {renderText(blockquoteText.trim())}
          </div>
        );
        blockquoteText = "";
        blockquoteType = "";
        inBlockquote = false;
      }
    };

    lines.forEach((line, index) => {
      // Blockquote & Alerts
      if (line.trim().startsWith(">")) {
        flushList(index);
        inBlockquote = true;
        const cleanLine = line.trim().substring(1).trim();
        if (cleanLine.startsWith("[!")) {
          const typeMatch = cleanLine.match(/\[!(.*?)\]/);
          if (typeMatch) {
            blockquoteType = typeMatch[1];
            return;
          }
        }
        blockquoteText += " " + cleanLine;
        return;
      } else {
        flushBlockquote(index);
      }

      // List item
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        inList = true;
        const itemText = line.trim().substring(2);
        listItems.push(
          <li key={`li-${index}`} className="text-xs">
            {renderText(itemText)}
          </li>
        );
        return;
      } else {
        flushList(index);
      }

      // Heading 1
      if (line.startsWith("# ")) {
        parsed.push(
          <h1 key={`h1-${index}`} className="text-lg font-black text-foreground tracking-tight uppercase border-b border-border pb-2 mt-6 mb-4">
            {line.substring(2)}
          </h1>
        );
        return;
      }

      // Heading 2
      if (line.startsWith("## ")) {
        parsed.push(
          <h2 key={`h2-${index}`} className="text-sm font-black text-foreground tracking-tight uppercase mt-6 mb-3">
            {line.substring(3)}
          </h2>
        );
        return;
      }

      // Heading 3
      if (line.startsWith("### ")) {
        parsed.push(
          <h3 key={`h3-${index}`} className="text-xs font-black text-foreground tracking-tight uppercase mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
        return;
      }

      // Paragraph
      if (line.trim()) {
        parsed.push(
          <p key={`p-${index}`} className="text-xs text-muted-foreground font-semibold leading-relaxed mb-4">
            {renderText(line)}
          </p>
        );
      }
    });

    // Final flushes
    flushList(lines.length);
    flushBlockquote(lines.length);

    return parsed;
  }

  return (
    <div className="space-y-6 select-none">
      <AdminPageHeader
        title="Documentation Center"
        description="SyncWA custom guidelines, strategy docs, and business workflows."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Document Tabs switcher */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block mb-2 px-1">
            Documents
          </span>
          <div className="flex flex-col space-y-1">
            {docsList.map((doc) => {
              const active = doc.id === activeDocId;
              return (
                <Link
                  key={doc.id}
                  href={`/admin/docs?doc=${doc.id}`}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    active
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Document Reader */}
        <div className="lg:col-span-3">
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-border pb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-sm font-black text-foreground uppercase tracking-wider leading-none">
                    {activeDoc.name}
                  </h2>
                  <span className="text-[9px] text-muted-foreground font-semibold leading-normal block mt-1 font-mono">
                    Path: {activeDoc.path}
                  </span>
                </div>
              </div>

              {loadError ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start space-x-3 text-destructive">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <p className="text-xs font-semibold leading-normal">{loadError}</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none pt-2">
                  {parseMarkdown(docContent)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
