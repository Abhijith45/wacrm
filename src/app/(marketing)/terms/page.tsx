import React from "react";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { TableOfContents } from "@/components/marketing/legal-toc";
import { LegalHero, EffectiveDateCard, LegalContactCard } from "@/components/marketing/legal";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Terms of Service",
  description: "Read the SyncWA terms of service to understand the conditions governing platform usage, account security, and acceptable use.",
};

const SECTIONS = [
  { id: "introduction", title: "Introduction" },
  { id: "use-of-service", title: "Use of the Service" },
  { id: "account-responsibilities", title: "Account Responsibilities" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "customer-data", title: "Customer Data" },
  { id: "availability", title: "Availability" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "changes-to-terms", title: "Changes to These Terms" },
  { id: "contact", title: "Contact" }
];

export default async function TermsOfServicePage() {
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
        title="Terms of Service"
        subtitle="Understand the terms and conditions governing the use of SyncWA."
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
                By accessing or using SyncWA, you agree to these Terms of Service.
              </p>
              <p>
                If you do not agree with these terms, please do not use the platform.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Use of the Service */}
            <section id="use-of-service" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Use of the Service</h2>
              <p>
                SyncWA provides a cloud-based platform for managing customer communication, CRM, sales, marketing, automation, and related business operations.
              </p>
              <p>
                You agree to use the platform responsibly and in compliance with applicable laws.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Account Responsibilities */}
            <section id="account-responsibilities" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Account Responsibilities</h2>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Maintaining the security of your account</li>
                <li>Protecting your login credentials</li>
                <li>Activities performed under your account</li>
                <li>Providing accurate information</li>
              </ul>
              <p className="pt-2">Notify us immediately if you believe your account has been compromised.</p>
            </section>

            <hr className="border-border/60" />

            {/* Acceptable Use */}
            <section id="acceptable-use" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Use SyncWA for illegal activities</li>
                <li>Send spam or unauthorized communications</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Disrupt or interfere with platform operations</li>
                <li>Upload malicious software or harmful content</li>
              </ul>
              <p className="pt-2">Violation of these terms may result in account suspension or termination.</p>
            </section>

            <hr className="border-border/60" />

            {/* Customer Data */}
            <section id="customer-data" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Customer Data</h2>
              <p>You retain ownership of your data.</p>
              <p>By using SyncWA, you grant us permission to process your data solely for providing and maintaining the service.</p>
            </section>

            <hr className="border-border/60" />

            {/* Availability */}
            <section id="availability" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Availability</h2>
              <p>
                We strive to provide a reliable service but do not guarantee uninterrupted availability.
              </p>
              <p>
                Maintenance, updates, or unforeseen issues may occasionally affect access.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Intellectual Property */}
            <section id="intellectual-property" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Intellectual Property</h2>
              <p>
                SyncWA, including its branding, software, design, and content, is the property of SyncWA and may not be copied, modified, or distributed without permission.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Limitation of Liability */}
            <section id="limitation-of-liability" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, SyncWA shall not be liable for indirect, incidental, special, or consequential damages arising from the use of the platform.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Termination */}
            <section id="termination" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms of Service or misuse the platform.
              </p>
            </section>

            <hr className="border-border/60" />

            {/* Changes to These Terms */}
            <section id="changes-to-terms" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Changes to These Terms</h2>
              <p>We may update these Terms of Service periodically.</p>
              <p>Continued use of SyncWA after changes become effective constitutes acceptance of the updated terms.</p>
            </section>

            <hr className="border-border/60" />

            {/* Contact */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg font-bold text-foreground">Contact</h2>
              <p>For questions regarding these Terms of Service, please contact us through the Contact page.</p>
            </section>

            <hr className="border-border/60" />

            <div className="pt-4 text-xs font-semibold text-foreground italic">
              Thank you for choosing SyncWA.
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
