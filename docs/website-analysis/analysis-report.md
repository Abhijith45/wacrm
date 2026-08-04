# SyncWA Product Discovery & Codebase Analysis Report

This document compiles the final analysis report summarizing product maturity, completeness scores, asset catalogs, and information architecture inputs for the SyncWA public website.

---

## 1. Executive Summary
SyncWA (referred to in the code as `wacrm`) is a self-hostable Customer Relationship Management (CRM) template designed for WhatsApp®. It consolidates customer conversations into a shared team inbox, organizes client records with customizable attributes, tracks deal values using visual Kanban boards, and schedules mass template broadcasts. It features a no-code rule builder (Automations) and a visual node canvas editor (Flows) to create interactive branching chatbots. Teams can connect their own OpenAI/Anthropic API keys to draft reply completions or run auto-reply bots grounded in a local hybrid vector knowledge base. The application runs on Next.js 16 (App Router), React 19, and Supabase (PostgreSQL), utilizing PostgreSQL Row-Level Security (RLS) to enforce workspace isolation. It is designed to be forked, branded, customized, and self-hosted.

---

## 2. Product Maturity
SyncWA is a highly mature software template (version `0.8.0` / `0.8.1`). It has evolved from a single-user inbox (v0.1.0) into a robust, multi-tenant workspace sharing platform (v0.3.0) with granular roles, a scoped REST API, signed outbound webhooks (v0.4.0), visual node canvases, and AI features (v0.5.0-v0.8.0). The database migrations are fully structured (36 SQL files), the RLS policies are comprehensive, and data integrity constraints (such as normalised phone duplicate merges and conversation deduplication indexes) are established. The code is modular, type-safe, and ready for commercial use.

---

## 3. Major Features

1. **Shared Team Inbox:** Multi-agent workspace routing WhatsApp chats, assigning threads, setting statuses, reactions, quoted replies, and agent presence markers.
2. **Sales Kanban Board:** visual pipeline stages with drag-and-drop deals, value tracking, and custom currencies.
3. **No-Code Flows Canvas:** Visual interactive chatbot builder powered by xyflow, supporting data collection, branches, and handoffs.
4. **No-Code Automations:** Event-driven rule configurations mapping message triggers to CRM actions and webhooks.
5. **BYO-Key AI Agents:** suggesting suggesting sugestions suggested reply drafts, auto-replies, and vector-grounded lexical/pgvector queries.
6. **Public Developer API & Webhooks:** Scoped bearer keys, cursor-paginated REST endpoints, signed HTTPS webhooks, and SSRF guards.
7. **Model Context Protocol (MCP) Server:** Natural language AI assistant commands.

---

## 4. Missing Documentation

* **Sales Kanban Pipeline Docs:** No detailed documentation file exists in the repository explaining pipelines setup, deals, or currency preferences (though mentioned in the README).
* **Flows Node Configuration Guides:** No developer or user guide in the repository details how node keys are evaluated or how custom variables are scoped within the Flows canvas.
* **AI Knowledge Base Grounding Docs:** There is no local document explaining how documentation uploads are chunked or how vector embeddings are index-backfilled.
* **Database Schema Diagram:** No visual database relationships or schema diagrams are stored in the repo.

---

## 5. Missing Screenshots

* > NOT VERIFIED
  * **Application UI Screenshots:** The repository contains **zero** UI screenshots of the shared inbox, Kanban deals board, automation canvas, AI playground, or member invite rosters. The only graphic asset is a Hostinger deployment infographic. UI mockups and media assets must be generated for the public website.

---

## 6. Website Readiness Score
* **Score:** `8.5 / 10`
* **Rationale:** The product architecture is fully defined, and features are completed, tested, and documented at the code level. The value propositions are clear. The missing `1.5` points reflect the complete absence of application UI screenshots in the repository and the fact that user guides are hosted in a separate site repository (`ArnasDon/wacrm-site`), requiring compilation before launching the public website.

---

## 7. Feature Completeness Score
* **Score:** `9.5 / 10`
* **Rationale:** All capabilities (shared inbox, CRM, pipeline deals, templates, broadcasts, automations, Flows chatbots, vector AI grounding, API/webhooks, and MCP) are fully implemented and operational. The only minor omission is a durable retry-with-backoff queue for failed outbound webhooks.

---

## 8. Suggested Homepage Sections

1. **Hero Header:** Positioning SyncWA as a self-hostable WhatsApp CRM with complete code and data ownership.
2. **Features Grid:** Showcasing Inbox, CRM, Kanban Board, Broadcasts, Automations, Chatbots, AI Agents, and Developer APIs.
3. **Interactive Chatbots Visual:** Presenting the drag-and-drop Flows canvas.
4. **BYO-Key AI Assistant Details:** Explaining suggesting Suggest Suggestion drafts, grounding, and auto-replies with zero seat fees.
5. **Security & Deployment Summary:** Highlighting RLS, GCM encryption, and Hostinger 1-click Git deployment.

---

## 9. Suggested Feature Categories
* **Shared Team Inbox:** Team messaging, allocations, note logs, and presence.
* **CRM & Pipelines:** Contacts profiles, custom fields, tags, and Kanban sales deals.
* **Conversational Automation:** Visual rule engines and Flow chatbot canvases.
* **AI replies:** Grounded completions, composer drafts, auto-replies, and token charts.
* **Integrations:** Scoped REST API, signed webhooks, and MCP server.

---

## 10. Suggested Public Navigation
* **Homepage** (Core positioning, quick-start guide).
* **Features** (Inbox, CRM & Sales, Visual Chatbots, AI Grounding).
* **Self-Host Docs** (Deployment walkthoughs, Supabase configurations, WhatsApp credentials).
* **Developer API** (REST endpoints, signed webhook schemas, MCP configurations).
* **Pricing** (Zero seat fees, hosting comparison).
* **GitHub Link** (Factual codebase repository).

---

## 11. Suggested Website IA Inputs
* **Positioning:** Privacy-first, open-source, self-hosted WhatsApp workspace template.
* **Benefits:** Total data privacy (lives on user's own Supabase), zero per-seat licensing, and customizable Next.js codebase.
* **CTAs:** "Fork on GitHub" (source code), "Deploy on Hostinger" (automated launch).

---

## 12. Documentation Gaps
* **External Hosting:** Setup guides for Meta APIs and Supabase projects are referred to `wacrm.tech/docs`, which live in a separate repo (`ArnasDon/wacrm-site`). These details must be compiled or linked correctly on the public website.
* **Advanced Flows Logic:** The Flows canvas engine contains detailed fallback policies (reprompts, cutoff limits) that are only explained in typescript comments.

---

## 13. Assumptions
* **Pricing Plans:** Assumed to be non-existent in the product itself, as the MIT-licensed code is distributed freely.
* **Embeddings Keys:** Assumed to require OpenAI API keys for vector searches (using `text-embedding-3-small`), even if the completion model runs on Anthropic.
* **Cron Sweeps:** Assumed to require an external scheduler to periodically invoke trigger-action wait sweeps.
