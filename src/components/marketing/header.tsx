"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const navigationLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Talk to Sales", href: "/contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/syncwa-logo-no-bg.png"
            alt="SyncWA Logo"
            width={28}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }))}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Login
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ size: "sm" }))}>
                Talk to Sales
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 cursor-pointer")}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-card text-foreground border-l border-border w-64 p-6">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-border">
                    <Image
                      src="/syncwa-logo-no-bg.png"
                      alt="SyncWA Logo"
                      width={24}
                      height={24}
                      className="h-6 w-auto object-contain"
                    />
                  </div>

                  {/* Links */}
                  <nav className="flex flex-col space-y-4 text-sm font-medium">
                    {navigationLinks.map((link) => {
                      const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "transition-colors hover:text-foreground py-1",
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 border-t border-border pt-4">
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className={cn(buttonVariants({ size: "default" }), "w-full text-center")}
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={handleLinkClick}
                        className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full text-center")}
                      >
                        Login
                      </Link>
                      <Link
                        href="/contact"
                        onClick={handleLinkClick}
                        className={cn(buttonVariants({ size: "default" }), "w-full text-center")}
                      >
                        Talk to Sales
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
