# Website Information Architecture (IA) Input - SyncWA

This document provides factual inputs and structure suggestions for the SyncWA public website Information Architecture (IA) based solely on implemented codebase functionality.

---

## 1. Core Positioning

* **Factual Tagline Ideas:**
  * "Self-Hostable CRM Template for WhatsApp: Shared Inbox, Sales Pipelines, and No-Code Chatbots."
  * "Privacy-First WhatsApp CRM for Teams: Complete Data Ownership, Visual Automation Canvas, and Bring-Your-Own-Key AI Agents."
  * "Own Your Customer Communications: Fork, Brand, and Deploy Your WhatsApp CRM on Supabase & Next.js."
* **Core Value Proposition:**
  A single-tenant, self-hosted CRM template that gives businesses complete ownership of their codebase, database records, and API tokens. Eliminates monthly per-seat SaaS licensing fees while offering professional team collaboration, official Meta WhatsApp Cloud API integrations, visual chatbot editors, no-code automations, and vector-grounded AI reply agents.
* **Target Audience:**
  * Software engineers and agencies looking to customize and brand a CRM for clients.
  * Privacy-focused businesses wanting complete control of client databases.
  * Sales and customer support desks (2 to 50 agents) managing a single official WhatsApp number.
* **Customer Pain Points Solved:**
  * Expensive seat-based SaaS subscriptions from third-party WhatsApp providers.
  * Vendor data lock-in and security exposure of customer communications.
  * Duplicate contact profiles and fragmented thread histories.
  * Complex scripting needed to create conversational menus and automated rules.

---

## 2. Business Benefits
* **Data Privacy & Control:** Databases live inside the customer's own Supabase project. RLS rules protect all entries at the database level.
* **Zero Per-Seat SaaS Pricing:** Deploy to Hostinger or Vercel, pay only for hosting and direct OpenAI/Anthropic/Meta API usage. No agent licensing caps.
* **Extensible React Stack:** Built on standard Next.js, React, Tailwind v4, and PostgreSQL. Easy for developers to customize and brand.

---

## 3. Suitable Homepage Sections

1. **Hero Section:**
   * Headline summarizing the self-hosted CRM template nature.
   * CTAs: "Fork on GitHub" and "Deploy to Hostinger".
2. **Interactive Shared Inbox Showcase:**
   * Features: Team collaboration, message statuses, reactions, quotes, contact note history, and assignee rules.
3. **CRM & Visual Pipelines Section:**
   * Features: Custom contact fields, normalizations, CSV imports, Kanban deals tracking, custom stage colorizations, and default currency settings.
4. **Visual Automation & Chatbot Section:**
   * Features: Rule triggers (keywords, tags), drag-and-drop chatbot canvas (collect inputs, condition branches, send media).
5. **BYO-Key AI Agents Section:**
   * Features: One-click suggestion composer drafts, auto-replies, local Knowledge Base retrieval (pgvector vector search), usage analytics, and human takeover controls.
6. **Developer Tools & Security Section:**
   * Features: Scoped API keys, signed outbound HTTPS webhooks (SSRF protected), and Model Context Protocol (MCP) server support.
7. **One-Click Deployment Section:**
   * Features: Visual guide highlighting 60-second Node.js deployment to Hostinger hPanel.

---

## 4. Suitable Feature Page Sections

* **Shared Inbox Page:** Agent dashboards, message thread rendering (text, emojis, media, templates), reaction logs, composer toolsets, and contact sidebars.
* **Sales Pipeline Page:** Kanban board stages, deal card overlays, expected close dates, pipeline donut values, and multi-currency formats.
* **Flows & Automations Page:** xyflow node canvas configurations, variable input capture, conditional route checks, trigger event matrices, and chron wait sweeps.
* **AI Agent Setup Page:** Provider keys config, vector backfill indexing, knowledge base file directories, and token dashboards.
* **Developer API Page:** Bearer keys, Webhook signatures, payload structures, and MCP JSON configuration setups.

---

## 5. Suitable Pricing Page Sections

* **Comparison Chart:**
  * Traditional SaaS: Monthly agent subscriptions, restricted databases, locked schemas, usage markups.
  * SyncWA Template: Free open-source code (MIT License), self-hosted project ownership, direct usage costs (pay Meta and AI providers directly).

---

## 6. Suitable Login / Join Page Content
* **Portal Credentials:** Email and password fields.
* **Invitation Redeeming:** Single-click join option for invited members, showcasing account names and assigned roles.

---

## 7. Factual CTA Recommendations
* **Developers:** "Fork on GitHub" (direct code link).
* **Workspace Operators:** "Deploy on Hostinger" (1-click integration).
* **Architects:** "Read Public API Specs" (link to public-api.md).
