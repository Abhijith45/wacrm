import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What is SyncWA?",
      answer: "SyncWA is a self-hostable team CRM template for WhatsApp® that runs on Next.js 16 and Supabase. It consolidates team communication, contact profiles, Kanban pipelines, bulk template broadcasts, and no-code chatbots into a single unified workspace.",
    },
    {
      question: "Who is SyncWA designed for?",
      answer: "It is designed for small to medium-sized customer support and sales teams (2-50 agents) that use WhatsApp as a main business channel and value complete database privacy, as well as digital agencies looking for a white-label template to customize and brand.",
    },
    {
      question: "How do I get started?",
      answer: "You can fork the repository, connect your Supabase database and Meta Developer Cloud API keys, and deploy the application to managed Node.js hosting environments like Hostinger in just a few clicks.",
    },
  ];

  return (
    <section id="faq" className="w-full py-16 md:py-20 border-b border-border bg-card/20 scroll-mt-14">
      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-12">
        {/* Headers */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Everything you need to know about the SyncWA self-hosted WhatsApp CRM.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="bg-card border border-border rounded-lg p-4">
          <Accordion className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} className="border-border">
                <AccordionTrigger className="text-xs md:text-sm font-semibold hover:no-underline py-4 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
