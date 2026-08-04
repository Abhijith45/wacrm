# Project Overview - SyncWA

This document provides a factual overview of the SyncWA project based on code analysis and configuration files in the repository.

---

## 1. Project Purpose
SyncWA (referred to in the repository files as `wacrm`) is a self-hostable Customer Relationship Management (CRM) template designed specifically for WhatsApp®. It serves as a unified workspace for teams to manage customer communication, automate messaging workflows, track sales pipelines, and leverage AI-powered reply agents using their own API keys. It is structured as an opinionated, production-ready template that developers or businesses can fork, brand, customize, and deploy.

## 2. Business Domain
* **Domain:** Customer Relationship Management (CRM) and Conversational Commerce.
* **Core Value Proposition:** Single-tenant, privacy-first, and self-hosted CRM that gives businesses full ownership of their data and infrastructure, with zero per-seat licensing fees.
* **Target Users:** Small to medium businesses, sales teams, and customer support desks that rely on WhatsApp as a primary communication channel and want to manage it collaboratively with multiple agents.

## 3. Product Overview
SyncWA consolidates customer interactions on WhatsApp into a collaborative dashboard. Key capabilities include:
1. **Shared Inbox:** A collaborative team inbox enabling multiple agents to reply to a single official WhatsApp Business phone number, with agent assignment, thread status tagging, and customer context.
2. **Contact & Tag Management:** A contact registry with custom fields, tagging, notes, duplicate detection, and CSV import capabilities.
3. **Sales Pipelines:** A visual Kanban deal board to manage and track lead values, stages, and expected close dates across currencies.
4. **Broadcast Campaigns:** Mass message broadcast runner using Meta-approved WhatsApp templates with contact field variable substitution.
5. **No-Code Automations:** A trigger-action rules engine for incoming messages, tags, or schedules.
6. **No-Code Flows:** A visual branching chatbot canvas for creating button/list-based customer menus and interactive flows.
7. **Bring-Your-Own-Key AI Agents:** An LLM-powered assistant (OpenAI or Anthropic) utilizing a local hybrid knowledge base (Lexical/PostgreSQL and pgvector Semantic search) for automated drafting and auto-replying with human agent handoff.
8. **Public REST API & MCP Server:** Extensible endpoints and Model Context Protocol support to query or trigger the CRM externally.

---

## 4. Tech Stack

### Frontend
* **Core Framework:** Next.js 16.2.12 (using App Router, server layouts, client-side React 19.2.4).
* **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss` in `package.json`), using CSS variables for theme customization (`html[data-theme]`).
* **Design Components:** custom UI elements based on Shadcn UI (using Radix-based primitives under `@base-ui/react`), Tremor component library (for charts/dashboards under `tremor`), and Lucide React icons.
* **Drag-and-Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` (used for the Kanban pipeline board).
* **Localization:** `next-intl` supporting English (`en.json`) and Korean (`ko.json`).
* **Data Visualizations:** `recharts` for token usage and dashboard charts.

### Backend
* **Core API Layer:** Next.js Route Handlers (`src/app/api/...`).
* **Protocol Server:** Model Context Protocol (MCP) server located in `mcp-server/` supporting tool executions over stdio.

### Database
* **Database Engine:** PostgreSQL (hosted externally via Supabase).
* **Database Driver/SDK:** Supabase JS client (`@supabase/supabase-js` and `@supabase/ssr` for server-side auth/session handling).
* **Extensions:** `uuid-ossp` (UUID generation), `pgvector` (vector embeddings storage, enabled in migration 030).
* **ORM:** *No ORM is used.* Database interactions are executed directly via the Supabase Client using PostgREST queries or custom PL/pgSQL RPC functions.

### Authentication & Authorization
* **Provider:** Supabase Auth.
* **tenancy Isolation:** Multi-user, single-account-scoped tenancy (introduced in migration 017). Row-Level Security (RLS) is enabled on all tables and checked using a SQL helper `is_account_member(account_id, min_role)`.
* **RBAC Roles:** `owner` (rank 4), `admin` (rank 3), `agent` (rank 2), and `viewer` (rank 1).
* **API Security:** Scoped, revocable API keys (`wacrm_live_...`) checked via SHA-256 database hashes.

### External Integrations
1. **Meta Cloud API:** Official WhatsApp Business Cloud API for message transmission, template management, media hosting, and webhook ingestion.
2. **OpenAI API:** Grounded completions (`gpt-4o-mini` / custom models) and semantic text embeddings (`text-embedding-3-small`).
3. **Anthropic API:** Message completions (`claude-3-5-sonnet-20240620` / custom models).

### Deployment
* **Recommended Platform:** Hostinger Managed Node.js shared hosting (Premium, Business, and Cloud plans), connected via hPanel Git deployment.
* **Containerization:** Multi-stage `Dockerfile` (standalone output) and `docker-compose.yml` for local/containerized deployments.
* **Cron scheduling:** Triggers `/api/automations/cron` and `/api/flows/cron` via external schedulers using the `AUTOMATION_CRON_SECRET` headers.

---

## 5. Folder Structure
The repository is laid out as follows:
```
wacrm/
├── .github/                 # GitHub workflows, SECURITY.md, and codeowner config.
├── docs/                    # Architectural documents, docker setup, and API specifications.
├── mcp-server/              # Standalone Node.js package containing the MCP server.
├── messages/                # Locale files for next-intl (en.json, ko.json).
├── public/                  # Static web assets (logos, doodles, SVGs, and audio binaries).
├── src/                     # Main Next.js application root.
│   ├── app/                 # Next.js App Router folders (includes routing, layouts, and API endpoints).
│   │   ├── (auth)/          # Authentication routes (login, signup, forgot-password).
│   │   ├── (dashboard)/     # Authenticated application workspace routes.
│   │   └── api/             # REST controllers (WhatsApp hooks, public API, internal endpoints).
│   ├── components/          # Reusable React components grouped by module/feature.
│   ├── hooks/               # Custom React hooks (auth, presence, notifications).
│   ├── i18n/                # Next-intl localization settings.
│   ├── lib/                 # Backend helpers, API clients, and business logic modules.
│   └── types/               # TypeScript type definitions (index.ts).
├── supabase/                # Supabase configuration.
│   └── migrations/          # 36 SQL migrations detailing schema, RLS, and triggers.
├── package.json             # NPM dependencies, engines, and run scripts.
└── tsconfig.json            # TypeScript configuration.
```

---

## 6. Major Modules
The product code is modularized into these areas:
1. **Auth & Account Sharing (`src/lib/auth/`):** Manages user registration, login, invitation flows (`/join/[token]`), member role escalations, and ownership transfer.
2. **Shared Inbox (`src/components/inbox/`):** Orchestrates active message threads, agent assignments, template picks, quick replies, reactions, swipe-quotes, and media rendering.
3. **Contacts (`src/components/contacts/`):** Controls contact profiles, tags, notes, custom fields, deduplication rules, and CSV file parser.
4. **Pipelines (`src/components/pipelines/`):** Houses the Kanban board, deal creations, stage management, stage colorization, and pipeline value summaries.
5. **Broadcasts (`src/components/broadcasts/`):** Runs step-by-step campaign creations, target filtering, variable substitution, and background execution queues.
6. **Automations (`src/components/automations/`):** Executes conditional trigger-action workflows (keywords, tags, events, wait timers, webhook calls).
7. **Flows (`src/lib/flows/`):** Runs the visual interactive branching chatbot engine, state machines, stale-session cron cleanup, and button/list rendering.
8. **AI Agents (`src/lib/ai/`):** Manages OpenAI/Anthropic completion clients, auto-replies, draft assistants, lexical/semantic hybrid search grounding, and token logs.
