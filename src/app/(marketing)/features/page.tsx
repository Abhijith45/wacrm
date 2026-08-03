import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Users,
  Send,
  Zap,
  BarChart,
  Settings,
  Shield,
  MessageCircle,
  HelpCircle,
  Mail,
  UserCheck,
  Target,
  PlayCircle,
  TrendingUp,
  Layout,
  Share2
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { BrowserFrame } from "@/components/marketing/browser-frame";
import { FeaturesNav } from "@/components/marketing/features-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  DashboardMockup,
  InboxMockup,
  ContactDetailsMockup,
  LeadDetailsMockup,
  CampaignMockup,
  AutomationMockup,
  AnalyticsMockup,
  TeamManagementMockup,
  AiWorkspaceMockup
} from "@/components/marketing/screen-mockups";

export const metadata = {
  title: "Features",
  description: "Everything you need to grow your business with WhatsApp CRM, automation, shared inbox, campaigns, and pipelines.",
};

export default async function FeaturesPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const workflowSteps = [
    { num: "01", name: "Lead Enquiry", desc: "Customer sends a WhatsApp message." },
    { num: "02", name: "WhatsApp Gateway", desc: "Official Meta Cloud API routes the payload." },
    { num: "03", name: "Shared Inbox", desc: "Enquiry is automatically queued & assigned." },
    { num: "04", name: "CRM Profiling", desc: "Normalized profiles are tagged and field-cataloged." },
    { num: "05", name: "Sales Pipeline", desc: "Opportunity stage cards are moved in Kanban." },
    { num: "06", name: "Automation Flows", desc: "Triggers run welcome notes and chatbot menus." },
    { num: "07", name: "Analytics Dashboard", desc: "Metrics log token counts and response speeds." },
    { num: "08", name: "Customer Won", desc: "CRM tracks conversion value to closed-won status." }
  ];

  const faqs = [
    {
      q: "Can multiple team members use one WhatsApp number?",
      a: "Yes. All incoming queries route directly to your connected Meta Cloud API account, feeding the unified shared inbox where agents can view, claim, transfer, and reply to threads."
    },
    {
      q: "How does automation work?",
      a: "Our visual flow canvas is built on trigger-condition-action logic. For example, when a contact sends a matching keyword, the flow triggers automated replies, assigns specific tags, or routes the contact to a support agent."
    },
    {
      q: "Can I customize pipelines?",
      a: "Yes, you can define custom sales stages inside your Kanban boards, move opportunity cards between phases, set deal values, and assign specific follow-up tasks."
    },
    {
      q: "What permissions are available?",
      a: "SyncWA has granular role management setting Agent, Viewer, Admin, or Owner limits to control who has deletion permissions, API key visibility, or bulk broadcast privileges."
    },
    {
      q: "Can I connect multiple WhatsApp numbers?",
      a: "Yes. Enterprise plans support multiple active WhatsApp numbers mapped into clean separate inboxes to manage distinct brand lines."
    },
    {
      q: "How does team collaboration work?",
      a: "Agents can leave internal notes on cards, assign conversations to teammates, tag threads for classification, and view real-time presence indicators to avoid dual-agent collisions."
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
            <span>✨ Product Features</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Everything You Need to Grow Your Business with WhatsApp
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            SyncWA combines customer communication, CRM, sales, marketing, automation, analytics, and collaboration into one unified platform, helping your team work more efficiently.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>View Pricing</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:support@syncwa.com?subject=Request%20Product%20Demo"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-center")}
            >
              Book Demo
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="w-full max-w-5xl pt-8">
            <BrowserFrame url="app.syncwa.com/dashboard">
              <DashboardMockup />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* 2. Sticky Feature Navigation */}
      <FeaturesNav />

      {/* 3. Business Workflow */}
      <section className="w-full py-16 md:py-20 border-b border-border bg-card/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Visual Business Workflow
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect every SyncWA module into a unified customer conversion lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="relative p-5 bg-card border border-border rounded-xl space-y-3 group hover:border-primary/20 transition-colors">
                <span className="text-xs font-bold text-primary font-mono">{step.num}</span>
                <h3 className="font-bold text-xs md:text-sm text-foreground">{step.name}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-border group-hover:text-primary transition-colors z-10">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Communication (Left Text, Right Screenshot) */}
      <section id="communication" className="w-full py-16 md:py-24 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">COMMUNICATION</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Keep Every Customer Conversation Organized
            </h2>
            
            {/* Problem / Solution layout */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Fragmented customer chats spread across individual devices lead to slow, unmonitored replies.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Centralize all enquiries in a collaborative shared team inbox mapping direct threads to specific agents.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Shared Team Inbox",
                "Real-time Conversations",
                "Quick Replies",
                "Message Templates",
                "Media Sharing",
                "Conversation Assignment",
                "Conversation Labels",
                "Internal Notes"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Decrease response times, improve visibility, and prevent agent collision.
            </p>
          </div>
          <div className="lg:col-span-7">
            <BrowserFrame url="app.syncwa.com/inbox">
              <InboxMockup />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* 5. CRM (Left Screenshot, Right Text) */}
      <section id="crm" className="w-full py-16 md:py-24 border-b border-border bg-card/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <BrowserFrame url="app.syncwa.com/contacts">
              <ContactDetailsMockup />
            </BrowserFrame>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">CRM DIRECTORY</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Build Stronger Customer Relationships
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Customer details, history, and key metadata are scattered across sheets and notes.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Keep team-wide profiles with Normalized phone entries, tag lists, and custom fields.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Contacts Profiles",
                "Lead Segmentation",
                "Custom Fields",
                "Tag Groups",
                "Activity Timeline",
                "Interaction History",
                "Internal Notes",
                "Customer Data Profiles"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Maintain database accuracy, capture detailed fields, and log customer contexts.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Sales (Left Text, Right Screenshot) */}
      <section id="sales" className="w-full py-16 md:py-24 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">SALES PIPELINE</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Track Every Opportunity
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Deals are forgotten in inbox queues with no clear ownership of the conversion lifecycle.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Manage deals using visual Kanban pipeline stage cards.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Sales Pipeline",
                "Lead Management",
                "Opportunity Tracking",
                "Follow-ups",
                "Task Assignment",
                "Lead Status",
                "Sales Activities"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Identify bottle-necks, assign tasks, and track conversion rates in real time.
            </p>
          </div>
          <div className="lg:col-span-7">
            <BrowserFrame url="app.syncwa.com/pipelines">
              <LeadDetailsMockup />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* 7. Marketing (Left Screenshot, Right Text) */}
      <section id="marketing" className="w-full py-16 md:py-24 border-b border-border bg-card/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <BrowserFrame url="app.syncwa.com/broadcasts">
              <CampaignMockup />
            </BrowserFrame>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">MARKETING BROADCASTS</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Reach Customers Efficiently
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Outbound communication is slow, manual, and risks WhatsApp account blocks.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Launch bulk campaigns using official, Meta-approved templates.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Broadcast Campaigns",
                "Customer Segments",
                "Approved Templates",
                "Campaign Management",
                "Audience Management",
                "Campaign Analytics"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Scale outreach safely, segment audiences, and review delivery metrics.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Automation (Left Text, Right Screenshot) */}
      <section id="automation" className="w-full py-16 md:py-24 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">AUTOMATION FLOWS</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Automate Repetitive Work
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Agents spend hours manual routing, answering repeated FAQs, and writing welcome notes.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Deploy visual flow chat trees and automatic queue assignments based on key match rules.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Workflow Automation",
                "Visual Flows Canvas",
                "Auto Assignment Rules",
                "System Notifications",
                "Custom Triggers",
                "Branching Conditions",
                "Targeted Actions"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Ensure 24/7 responsiveness, automate routing, and reduce manual workload.
            </p>
          </div>
          <div className="lg:col-span-7">
            <BrowserFrame url="app.syncwa.com/flows">
              <AutomationMockup />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* 9. Analytics (Left Screenshot, Right Text) */}
      <section id="analytics" className="w-full py-16 md:py-24 border-b border-border bg-card/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <BrowserFrame url="app.syncwa.com/analytics">
              <AnalyticsMockup />
            </BrowserFrame>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">METRICS & ANALYTICS</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Measure Business Performance
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Management has zero visibility into agent performance, response speeds, or Meta API token consumption.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Review unified dashboard charts detailing volume, response speeds, and AI token usages.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Dashboard Widgets",
                "Custom Reports",
                "Campaign Analytics",
                "Sales Metrics",
                "Activity Logs",
                "Performance Insights"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Allocate budget correctly, optimize agent performance, and audit operating costs.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Team Collaboration (Left Text, Right Screenshot) */}
      <section id="team" className="w-full py-16 md:py-24 border-b border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">TEAM COLLABORATION</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Help Your Team Work Together Securely
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Shared logins compromise credentials and audit trails, leaving you exposed to data leaks.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Provide separate logins with customizable roles (Owner, Admin, Agent, Viewer) and track audit logs.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Multiple User Logins",
                "Role Tiers Settings",
                "Granular Permissions",
                "Activity Presence Logs",
                "Thread Assignments",
                "Workspace Management"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Ensure accountability, enforce least privilege access, and secure customer databases.
            </p>
          </div>
          <div className="lg:col-span-7">
            <BrowserFrame url="app.syncwa.com/settings">
              <TeamManagementMockup />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* 11. Security & Administration (Left Screenshot, Right Text) */}
      <section id="security" className="w-full py-16 md:py-24 border-b border-border bg-card/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <BrowserFrame url="app.syncwa.com/ai">
              <AiWorkspaceMockup />
            </BrowserFrame>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-soft px-2.5 py-1 rounded">SECURITY & ADMIN</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-[1.15]">
              Enterprise Security & Workspace Controls
            </h2>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-destructive/5 border-l-2 border-destructive text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Business Problem:</span> Complex self-hosted environments are difficult to configure and monitor.
              </div>
              <div className="p-3 bg-primary-soft border-l-2 border-primary text-muted-foreground rounded-r">
                <span className="font-semibold text-foreground">Solution:</span> Consolidate Meta API keys, webhook handlers, and database connection details into one manager panel.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Roles & Security settings",
                "Workspace Management",
                "Detailed Audit Logs",
                "Activity History logs",
                "Database connection checks",
                "Secret API Keys vault"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-primary font-bold">
              ✓ Benefit: Maintain compliance, isolate databases, and control metadata access limits.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Integrations */}
      <section id="integrations" className="w-full py-16 md:py-20 border-b border-border bg-card/10 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Integrate with Your Tech Stack
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect SyncWA with the tools you already use to sync databases and customer profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Available */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Available</span>
              <h3 className="font-bold text-sm text-foreground">Direct APIs</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span>Meta Business Cloud API Connection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span>Supabase Database Schema Sync</span>
                </li>
              </ul>
            </div>

            {/* Coming Soon */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">Coming Soon</span>
              <h3 className="font-bold text-sm text-foreground">Third-Party integrations</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary/45" />
                  <span>HubSpot CRM Bidirectional leads sync</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary/45" />
                  <span>Zapier Event Triggers (5k+ apps)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary/45" />
                  <span>Shopify Order template variables</span>
                </li>
              </ul>
            </div>

            {/* Future Direction */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <span className="text-[9px] font-bold text-primary bg-primary-soft border border-primary/20 px-2 py-0.5 rounded uppercase">Future Direction</span>
              <h3 className="font-bold text-sm text-foreground">Custom SDKs</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary/30" />
                  <span>Outgoing Custom Webhook payloads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-3.5 w-3.5 text-primary/30" />
                  <span>AI Agent Custom Grounding SDKs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Features FAQ */}
      <section className="w-full py-16 md:py-20 border-b border-border bg-card/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Features FAQ
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find answers to specific features, number connection limits, and permission tiers.
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

      {/* 14. Final CTA */}
      <section className="relative w-full py-16 md:py-24 border-b border-border bg-gradient-to-b from-background to-card/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.526_0.247_293_/_0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Discover Everything SyncWA Can Do
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            Explore a complete platform designed to help your business communicate, collaborate, and grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-2">
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <span>View Pricing</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:support@syncwa.com?subject=Request%20Product%20Demo"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto flex items-center justify-center space-x-2")}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Book Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 15. Footer */}
      <Footer />
    </div>
  );
}
