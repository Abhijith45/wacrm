import React from "react";
import Link from "next/link";
import { Mail, Phone, Calendar, Clock, ArrowRight, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { ContactForm } from "@/components/marketing/contact-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = {
  title: "Contact Us",
  description: "Reach out to the SyncWA team for general inquiries, product walkthroughs, custom pricing, or technical support.",
};

// Configurable data source
const CONTACT_CONFIG = {
  email: "support@syncwa.com",
  whatsappNumber: "+91 98765 43210",
  whatsappLink: "https://wa.me/919876543210",
  demoLink: "mailto:support@syncwa.com?subject=Request%20Product%20Demo",
  businessHours: {
    days: "Monday – Friday",
    hours: "09:00 AM – 06:00 PM",
    timezone: "IST (UTC+5:30)"
  }
};

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const faqs = [
    {
      q: "Can I request a product demo?",
      a: "Yes. Simply click 'Book Demo' to schedule a live, personalized walkthrough where we can demonstrate visual flow builders, campaigns, and shared team workspace components."
    },
    {
      q: "How quickly will I receive a response?",
      a: "We review support and sales tickets continuously. General inquiries typically receive replies within 2 to 4 business hours."
    },
    {
      q: "Can I discuss enterprise requirements?",
      a: "Yes, we support high-volume API integrations and dedicated hosting tiers. Contact us at support@syncwa.com to discuss custom SLA terms."
    },
    {
      q: "Do you provide onboarding assistance?",
      a: "Yes. Our team can help you configure Meta Developer credentials, verify WhatsApp templates, import CRM contacts, and build initial automation flows."
    },
    {
      q: "Can I migrate from another CRM?",
      a: "Yes. You can import existing contacts and custom fields via CSV files. Phone numbers are automatically E.164 normalized upon import."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* 1. Header */}
      <Header isLoggedIn={isLoggedIn} />

      {/* 2. Hero Section */}
      <section className="relative w-full overflow-hidden py-16 md:py-24 border-b border-border bg-gradient-to-b from-card/30 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.526_0.247_293_/_0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft border border-primary/20 text-primary text-xs font-semibold select-none">
            <span>📞 Contact Us</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            We're Here to Help
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Whether you have questions about SyncWA, need a product demonstration, want to discuss pricing, or require technical assistance, our team is ready to help.
          </p>
        </div>
      </section>

      {/* 3 & 4. Contact Options & Form (Two Column Layout on Desktop) */}
      <section className="w-full py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Options & Business Hours */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Choose the Best Way to Reach Us
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select a communication channel to get started immediately.
                </p>
              </div>

              {/* Options Grid */}
              <div className="space-y-4">
                {/* Email Card */}
                <div className="p-5 bg-card border border-border rounded-xl flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-xs md:text-sm text-foreground">Email Us</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Reach out for general enquiries, product information, partnership opportunities, or technical support.
                    </p>
                    <Link
                      href={`mailto:${CONTACT_CONFIG.email}`}
                      className="inline-flex text-[11px] font-semibold text-primary hover:underline"
                    >
                      {CONTACT_CONFIG.email}
                    </Link>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="p-5 bg-card border border-border rounded-xl flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-xs md:text-sm text-foreground">Chat on WhatsApp</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Connect with our team directly for quick questions and product guidance.
                    </p>
                    <Link
                      href={CONTACT_CONFIG.whatsappLink}
                      target="_blank"
                      className="inline-flex text-[11px] font-semibold text-primary hover:underline"
                    >
                      {CONTACT_CONFIG.whatsappNumber}
                    </Link>
                  </div>
                </div>

                {/* Schedule Demo Card */}
                <div className="p-5 bg-card border border-border rounded-xl flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-xs md:text-sm text-foreground">Book a Product Demo</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Schedule a personalized walkthrough and discover how SyncWA can support your business.
                    </p>
                    <div>
                      <Link
                        href={CONTACT_CONFIG.demoLink}
                        className={cn(buttonVariants({ size: "sm" }), "text-[10px] h-8 px-3 cursor-pointer")}
                      >
                        Book Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Business Hours Info Card */}
              <div className="p-5 bg-card/40 border border-border/80 rounded-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4.5 w-4.5 text-primary shrink-0" />
                  <h3 className="font-bold text-xs md:text-sm text-foreground">Business Hours</h3>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-semibold text-foreground">{CONTACT_CONFIG.businessHours.days}</span>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="text-muted-foreground">Hours</span>
                    <span className="font-semibold text-foreground">
                      {CONTACT_CONFIG.businessHours.hours} <span className="text-[10px] text-muted-foreground">({CONTACT_CONFIG.businessHours.timezone})</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="w-full py-16 md:py-20 border-b border-border bg-card/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find answers to common questions about communication options and scheduling.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <Accordion className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} className="border-border">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold hover:no-underline py-4 text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="relative w-full py-16 md:py-24 border-b border-border bg-gradient-to-b from-background to-card/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.526_0.247_293_/_0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Ready to Explore SyncWA?
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            Book a personalized demo and discover how SyncWA can simplify customer communication and business operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Link
              href={CONTACT_CONFIG.demoLink}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>Book Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-center")}
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
