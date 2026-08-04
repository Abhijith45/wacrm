import React from "react";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { TableOfContents } from "@/components/marketing/legal-toc";
import { LegalHero, EffectiveDateCard, LegalContactCard } from "@/components/marketing/legal";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Privacy Policy",
  description: "Read the SyncWA privacy policy to understand how we handle, process, and secure personal and workspace data.",
};

const SECTIONS = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "customer-data", title: "Customer Data" },
  { id: "data-security", title: "Data Security" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "cookies", title: "Cookies" },
  { id: "your-rights", title: "Your Rights" },
  { id: "changes-to-policy", title: "Changes to This Policy" },
  { id: "contact", title: "Contact" }
];

export default async function PrivacyPolicyPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {/* 1. Header */}
      <Header isLoggedIn={isLoggedIn} />

      {/* 2. Hero */}
      <LegalHero
        title="Privacy Policy"
        subtitle="Learn how SyncWA collects, uses, and protects your information."
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 3 & 4. Left Sidebar (Effective Date Card + Table of Contents) */}
          <aside className="lg:col-span-4 space-y-6">
            <EffectiveDateCard date="August 4, 2026" />
            <TableOfContents sections={SECTIONS} />
          </aside>

          {/* 5. Right Content Area */}
          <article className="lg:col-span-8 max-w-3xl space-y-12 text-sm leading-relaxed text-muted-foreground">
            
            {/* Introduction Section */}
            <section id="introduction" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Introduction</h2>
              <p>
                Welcome to <strong className="text-foreground">SyncWA</strong>.
              </p>
              <p>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use the SyncWA platform.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Information We Collect */}
            <section id="information-we-collect" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Information We Collect</h2>
              <p>We may collect the following information when you use SyncWA:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company information</li>
                <li>Account credentials</li>
                <li>Workspace information</li>
                <li>Usage and activity data</li>
                <li>Customer data you choose to manage within SyncWA</li>
              </ul>
            </section>

            <hr className="border-border/60" />

            {/* How We Use Your Information */}
            <section id="how-we-use" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Create and manage your account</li>
                <li>Provide and improve our services</li>
                <li>Secure your workspace</li>
                <li>Respond to support requests</li>
                <li>Communicate important product updates</li>
                <li>Monitor platform performance and reliability</li>
              </ul>
              <p className="pt-2 font-medium text-foreground">We do not sell your personal information.</p>
            </section>

            <hr className="border-border/60" />

            {/* Customer Data */}
            <section id="customer-data" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Customer Data</h2>
              <p>You retain ownership of the customer data you store in SyncWA.</p>
              <p>We process this data only to provide the requested services.</p>
            </section>

            <hr className="border-border/60" />

            {/* Data Security */}
            <section id="data-security" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Data Security</h2>
              <p>We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, or disclosure.</p>
              <p>No internet-based service can guarantee absolute security.</p>
            </section>

            <hr className="border-border/60" />

            {/* Third-Party Services */}
            <section id="third-party" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Third-Party Services</h2>
              <p>SyncWA may integrate with third-party services such as:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>WhatsApp Business Platform</li>
                <li>Authentication providers</li>
                <li>Cloud infrastructure providers</li>
                <li>Analytics services</li>
              </ul>
              <p>These services are governed by their respective privacy policies.</p>
            </section>

            <hr className="border-border/60" />

            {/* Cookies */}
            <section id="cookies" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Cookies</h2>
              <p>SyncWA may use cookies or similar technologies to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Keep you signed in</li>
                <li>Improve user experience</li>
                <li>Analyze platform usage</li>
              </ul>
              <p>You may control cookies through your browser settings.</p>
            </section>

            <hr className="border-border/60" />

            {/* Your Rights */}
            <section id="your-rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Access your personal information</li>
                <li>Request corrections</li>
                <li>Request deletion of your account</li>
                <li>Contact us regarding privacy concerns</li>
              </ul>
            </section>

            <hr className="border-border/60" />

            {/* Changes to This Policy */}
            <section id="changes-to-policy" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time.</p>
              <p>Any significant changes will be published on this page.</p>
            </section>

            <hr className="border-border/60" />

            {/* Contact */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Contact</h2>
              <p>If you have questions regarding this Privacy Policy, please contact us through the Contact page or email our support team.</p>
            </section>

            <hr className="border-border/60" />

            <div className="pt-4 text-xs font-semibold text-foreground italic">
              Thank you for trusting SyncWA.
            </div>

          </article>
        </div>

        {/* 6. Contact Section */}
        <div className="pt-16 md:pt-24">
          <LegalContactCard />
        </div>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
