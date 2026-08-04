import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

// Inline social icons that don't depend on Lucide exports
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const links = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/syncwa-logo-no-bg.png"
            alt="SyncWA Logo"
            className="h-6 w-auto object-contain"
          />
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {links.map((link, i) => (
            <Link key={i} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3 text-[10px] text-muted-foreground">
          {/* Social icons */}
          <div className="flex items-center space-x-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-foreground transition-colors">
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-foreground transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-foreground transition-colors">
              <TwitterIcon className="h-4 w-4" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors">
              <LinkedinIcon className="h-4 w-4" />
            </Link>
          </div>
          <p>© {new Date().getFullYear()} SyncWA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
