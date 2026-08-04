# Website Content Source - SyncWA

This document outlines the classification of codebase information and features to determine what is safe for the public website, what should remain private/internal, and what features are marked "coming soon".

---

## 1. Safe for the Public Website

### Product Overview & Value Propositions
* **Factual Pitch:** A self-hostable CRM template for WhatsApp® enabling teams to run a collaborative workspace with zero monthly seat licensing fees.
* **Privacy & Ownership:** Single-tenant database isolation. Complete ownership of code, credentials, customer databases, and visual styles. No SaaS lock-in.

### Key Implemented Features
* **Shared Team Inbox:** Multiple agents managing a single official WhatsApp number. Chat allocations, status labeling (open/pending/closed), internal contact notes, emoji reactions, swipe quoted replies, and attachment previews.
* **CRM Directory:** Contact profile database with customizable attributes, colored tag labels, E.164 phone number de-duplication, and client-side CSV files importer.
* **Sales Kanban Board:** visual pipeline stages, drag-and-drop deals, expected close dates, and customizable currency settings.
* **Broadcast Campaign Wizard:** Step-by-step sender choosing templates, segmentation via tags or CSV files, parameter variable mapping, scheduled or immediate sending, and delivery stats.
* **No-Code Automations Builder:** visual rules mapping inbound message events and keywords to CRM actions (assigns, messaging, tags, webhooks).
* **No-Code Flows Canvas:** Visual branching drag-and-drop chatbot canvas (`@xyflow/react`) to build multi-step menus, collect inputs, evaluate conditions, and trigger human agent handoffs.
* **AI Reply Assistant:** Bring-your-own-key OpenAI/Anthropic assistant suggesting drafts in the inbox and auto-answering unassigned threads with local hybrid search grounding (Lexical and pgvector Semantic vector searches).
* **AI Usage Insights:** Dashboard tracking token spends and provider allocations.
* **Agent Presence:** Heartbeat-driven online/away indicators for team collaboration.
* **Public REST API & Webhooks:** Scoped API key generation and signed HTTPS outbound webhooks (`message.received`, `message.status_updated`, `conversation.created`).
* **Model Context Protocol (MCP):** Connects the CRM to AI clients like Claude Code/Cursor.

### Architecture & Security Highlights
* **Technology Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Supabase (PostgreSQL + Auth + Storage).
* **Credential Protection:** WhatsApp access tokens and AI keys are stored encrypted at rest using AES-256-GCM.
* **SSRF Guard:** Webhooks block internal private IP targets.
* **Row-Level Security:** Every single table is protected by Postgres RLS, checking account membership before any query.

---

## 2. Should NOT be Public

### Internal Configuration & Secrets
* **Private API Endpoints:** Internal routes managing workspace configuration (e.g. `/api/account/...`, `/api/whatsapp/config`, `/api/ai/config`).
* **Secrets:** Meta App Secret, Supabase Service Role Key, AES Encryption Key, WhatsApp verify tokens, and API key hashes.
* **Environment Variables:**
  * `SUPABASE_SERVICE_ROLE_KEY`
  * `ENCRYPTION_KEY`
  * `META_APP_SECRET`
  * `AUTOMATION_CRON_SECRET`
  * `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  * `ALLOWED_INVITE_HOSTS`

### Database & Code Details
* **Database Schema:** Exact PostgreSQL column formats, tables names (e.g. `automation_pending_executions`), RLS rules, SQL triggers, and RPC definitions (e.g. `claim_ai_reply_slot`).
* **Code Logic:** Exact implementations of the Flows state machine transitions or webhook signature checking algorithms.

---

## 3. Coming Soon

### Partially Implemented / Future Features
* **Webhook Delivery Queue:** A queue-based retry-with-backoff mechanism for failed webhook posts. (Currently best-effort; dead targets are auto-disabled after 15 consecutive failures).
* **Additional Pipeline/Deals Actions in Public API:** Programmatic deal creation and pipeline stage changes.
