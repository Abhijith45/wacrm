# AGENTS.md — AI Agent Guide & Codebase Context for SyncWA / wacrm

> **Purpose**: This document provides complete architectural, operational, and structural context for AI coding agents (Antigravity, Claude, Cursor, Copilot, etc.) working on this codebase. Read this file before planning or executing any codebase modifications.

---

<!-- BEGIN:nextjs-agent-rules -->
# Important: Next.js 16 & React 19 Rules

This project runs **Next.js 16 (App Router)** and **React 19** with breaking changes from older versions:
- Server Components are the default. Add `'use client'` only when state, effects, or browser APIs are required.
- Dynamic route segment parameters `params` and `searchParams` in Page/Layout props are **Promises** and must be `await`ed or resolved with `React.use()`.
- Request cookies and headers (`cookies()`, `headers()` from `next/headers`) are **asynchronous** (`await cookies()`).
- Proxy / routing interception is configured in `src/proxy.ts` (evaluated via Next.js middleware hooks).
- Read the relevant guide in `node_modules/next/dist/docs/` when in doubt.
<!-- END:nextjs-agent-rules -->

---

## 1. Application Overview

**SyncWA (wacrm)** is a production-grade, self-hostable WhatsApp CRM, Marketing Platform, and SaaS Workspace built on **Next.js 16**, **Supabase (PostgreSQL, Auth, Realtime, Storage)**, and the **Meta WhatsApp Cloud API**.

The application serves two core personas across distinct route boundaries:
1. **Customer CRM Workspace (`/dashboard`, `/inbox`, `/contacts`, `/pipelines`, `/broadcasts`, `/automations`, `/flows`, `/settings`)**: Multi-agent shared WhatsApp inbox, drag-and-drop sales pipelines, contact management, Meta template broadcasts, visual automation flows, bring-your-own-key AI reply assistant, and team collaboration.
2. **Platform CRM / Admin Portal (`/admin`)**: Operational back-office for SaaS operators — managing inbound platform leads, client workspaces, onboarding progress, communication logs, and commercial metrics.
3. **Public Marketing & Auth (`/`, `/(marketing)`, `/(auth)`, `/join/[token]`)**: Landing pages, pricing, contact forms, auth wrappers, and invitation acceptance.
4. **Public REST API & MCP Server (`/api/v1`, `/mcp-server`)**: Programmatic API secured by SHA-256 API keys, plus a Model Context Protocol server enabling Claude and Cursor to drive CRM operations.

---

## 2. Technology Stack & Key Dependencies

| Layer | Technology | Key Packages & Versions |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Standalone output) | `next: 16.2.12`, `react: 19.2.4`, `react-dom: 19.2.4` |
| **Language** | TypeScript (Strict mode) | `typescript: ^6`, `@types/react: ^19`, `@types/node: ^26` |
| **Styling** | Tailwind CSS v4 + Tailwind Animate | `tailwindcss: ^4`, `@tailwindcss/postcss: ^4`, `tw-animate-css` |
| **UI Components** | Radix UI / Base UI / shadcn/ui patterns | `@base-ui/react: ^1.6.0`, `lucide-react`, `sonner`, `clsx`, `tailwind-merge` |
| **Visual Flow Canvas** | xyflow (React Flow) | `@xyflow/react: ^12.11.2`, `@dagrejs/dagre: ^3.1.0` |
| **Kanban / Drag & Drop** | DnD Kit | `@dnd-kit/core: ^6.3.1`, `@dnd-kit/sortable: ^10.0.0` |
| **Charts & Visuals** | Recharts | `recharts: ^3.10.1` |
| **Database & Auth** | Supabase (PostgreSQL, RLS, Storage) | `@supabase/supabase-js: ^2.107.0`, `@supabase/ssr: ^0.12.0`, `pg: ^8.23.0` |
| **Internationalization** | next-intl | `next-intl: ^4.13.5` (Locales: `en`, `ko` in `messages/`) |
| **Audio Recording** | Opus Recorder | `opus-recorder: ^8.0.5` |
| **Testing** | Vitest | `vitest: ^4.1.10` |

---

## 3. Codebase Directory Structure

```text
wacrm/
├── .github/                     # GitHub Actions CI workflows & security policies
├── docs/                        # Architecture, PRDs, API guides, and customization specs
│   ├── CUSTOMER_ACQUISITION_FLOW.md
│   ├── SYNCWA_CUSTOMIZATION_GUIDE.md   # Architectural boundaries & fork rules
│   ├── docker.md               # Container deployment guide
│   ├── mcp.md                  # Model Context Protocol setup
│   └── public-api.md           # REST API v1 documentation
├── mcp-server/                  # Standalone MCP Server for AI assistants (Claude, Cursor)
├── messages/                    # i18n translation bundles (en.json, ko.json)
├── public/                      # Static assets, logos, and icons
├── scripts/                     # Automation, migration, and seed scripts
│   ├── migrate.mjs              # Multi-mode database migration runner
│   ├── create-credentials.mjs   # Encryption key & token generator
│   └── seed/                    # Development seeders (demo, testing, production)
├── src/
│   ├── app/                     # Next.js App Router route hierarchy
│   │   ├── (auth)/              # Authentication routes (/login, /signup, /forgot-password)
│   │   ├── (dashboard)/         # Customer CRM workspace
│   │   │   ├── agents/          # Team member directory
│   │   │   ├── automations/     # Linear rule-based automation manager
│   │   │   ├── broadcasts/      # Meta template broadcast campaigns
│   │   │   ├── contacts/        # Contact directory, tags, custom fields, CSV import
│   │   │   ├── dashboard/       # CRM analytics & response metrics
│   │   │   ├── flows/           # Visual drag-and-drop conversation flow builder
│   │   │   ├── inbox/           # Real-time multi-agent shared WhatsApp inbox
│   │   │   ├── notifications/   # In-app notification center
│   │   │   ├── pipelines/       # Kanban sales pipelines & deals
│   │   │   └── settings/        # Account, WhatsApp WABA, AI BYOK, & API key settings
│   │   ├── (marketing)/         # Public marketing website (/features, /pricing, /contact)
│   │   ├── admin/               # Platform CRM / Operator Portal
│   │   │   ├── customers/       # Customer accounts & trial statuses
│   │   │   ├── onboarding/      # Workspace onboarding progress checklist
│   │   │   ├── platform-leads/  # Inbound sales leads CRM & qualification
│   │   │   ├── settings/        # Platform-level configurations
│   │   │   └── workspaces/      # Tenant workspace provisioning
│   │   ├── api/                 # Next.js Route Handlers
│   │   │   ├── account/         # Member management, invitations, profile updates
│   │   │   ├── ai/              # AI drafting, auto-reply, & knowledge base indexing
│   │   │   ├── automations/     # Automation executions & cron trigger
│   │   │   ├── contacts/        # Contact CRUD & CSV import
│   │   │   ├── flows/           # Visual flow execution & edge dispatch
│   │   │   ├── v1/              # Public REST API (messages, contacts, broadcasts, webhooks)
│   │   │   └── whatsapp/        # Meta Cloud API webhooks, sync, media upload, template submit
│   │   ├── join/                # One-click workspace invitation acceptance (/join/[token])
│   │   ├── globals.css          # Tailwind CSS tokens & theme variables
│   │   ├── layout.tsx           # Root HTML layout with i18n & Sonner toaster
│   │   ├── page.tsx             # Root page redirector (renders marketing homepage)
│   │   └── proxy.ts             # Route guard, session refresh, & role-based middleware
│   ├── components/              # Modular React UI Components
│   │   ├── admin/               # Platform CRM components (cards, tables, activity timeline)
│   │   ├── auth/                # Auth forms (login, signup, password reset)
│   │   ├── automations/         # Automation step forms & trigger selectors
│   │   ├── broadcasts/          # Broadcast wizard & recipient progress table
│   │   ├── contacts/            # Contact drawer, tag badges, custom fields manager
│   │   ├── dashboard/           # Analytics charts, metrics, and KPI cards
│   │   ├── flows/               # React Flow visual canvas, nodes, sidebar, drawer
│   │   ├── inbox/               # Thread list, chat panel, message composer, audio recorder
│   │   ├── interactive/         # WhatsApp interactive button & list previews
│   │   ├── marketing/           # Landing page sections (Hero, Showcase, Pricing, FAQ)
│   │   ├── pipelines/           # DnD Kit Kanban board, stage columns, deal cards
│   │   ├── settings/            # WABA connect, AI key config, API key manager
│   │   └── ui/                  # Atomic UI primitives (Button, Dialog, Input, Dropdown, etc.)
│   ├── hooks/                   # Custom React hooks (usePresence, useDebounce, useMediaQuery)
│   ├── i18n/                    # next-intl configuration & request hooks
│   ├── lib/                     # Core Business Logic & Backend Utilities
│   │   ├── account/             # Profile & account resolution
│   │   ├── ai/                  # AI engine, providers (OpenAI/Anthropic), chunking, knowledge search
│   │   ├── api-keys/            # SHA-256 hashed API key validation & generation
│   │   ├── auth/                # Session handling, roles (hasMinRole), platform staff context
│   │   ├── automations/         # Automation execution engine & condition evaluator
│   │   ├── contacts/            # Phone normalization, deduplication, tag filters
│   │   ├── conversations/       # Thread status, assignment, reopening logic
│   │   ├── flows/               # Visual flow runner, DAG layout, node dispatchers
│   │   ├── inbox/               # Chat search, message grouping, real-time presence
│   │   ├── leads/               # Platform leads repository & commercial telemetry
│   │   ├── media/               # Media upload, MIME-type validation, audio transcoding
│   │   ├── services/            # Onboarding, provisioning, commercial, & communication services
│   │   ├── supabase/            # Browser client, server client, & admin service-role factory
│   │   ├── webhooks/            # Outgoing webhook signature & delivery queue
│   │   └── whatsapp/            # Meta Graph API client, AES-256 encryption, template management
│   └── types/                   # Master TypeScript interfaces & database mappings
│       ├── index.ts             # Complete domain model types
│       └── opus-recorder.d.ts   # Audio recorder type declarations
└── supabase/
    └── migrations/              # 46+ Sequential SQL migrations with full RLS policies
```

---

## 4. Multi-Tenancy & Data Architecture

### 4.1 Tenancy & Role Hierarchy
- **Account Isolation**: Every customer entity belongs to an `account_id` (representing a company workspace).
- **Profiles**: Map 1:1 with `auth.users`. Each profile contains `account_id` and `account_role`.
- **Roles & Permissions (`src/lib/auth/roles.ts`)**:
  - `owner`: Full control, billing, workspace deletion, member management, transfer ownership.
  - `admin`: Manage WhatsApp configuration, templates, team members, automations, and API keys.
  - `agent`: Read/write contacts, manage conversations, send messages, move pipeline deals.
  - `viewer`: Read-only access to inbox, contacts, and pipelines.
- **Platform Staff (`src/lib/auth/platform.ts`)**:
  - Profiles with `is_platform_staff = true` have access to `/admin`.
  - Roles: `founder`, `admin`, `sales`, `support`, `finance`, `operations`.
  - Platform staff are strictly segregated: `src/proxy.ts` prevents customer users from accessing `/admin` and platform staff from accessing `/dashboard`.

### 4.2 Database Clients: User Client vs Admin Service Role
- **User Server Client (`createClient()` from `@/lib/supabase/server`)**: Used in all standard Server Components, Server Actions, and authenticated Route Handlers. Honors PostgreSQL **Row Level Security (RLS)** using the caller's JWT.
- **Service Role Admin Client (`supabaseAdmin()` / `@/lib/supabase/admin`)**: Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS.
  - **Permitted uses ONLY**: Inbound WhatsApp webhooks (`/api/whatsapp/webhook`), background cron tasks, automation engine executions, public API key resolution (`/api/v1/*`), and platform provisioning.
  - **CRITICAL**: Never expose or import the service-role client into client-side components.

### 4.3 Key Database Tables
- **Tenancy & Users**: `accounts`, `profiles`, `account_invitations`, `member_presence`.
- **CRM Entities**: `contacts`, `tags`, `contact_tags`, `custom_fields`, `contact_custom_values`, `contact_notes`.
- **Messaging**: `conversations`, `messages`, `message_reactions`, `whatsapp_config`, `message_templates`, `quick_replies`.
- **Sales**: `pipelines`, `pipeline_stages`, `deals`.
- **Marketing & Automation**: `broadcasts`, `broadcast_recipients`, `automations`, `automation_steps`, `automation_logs`, `flows`, `flow_nodes`, `flow_edges`, `flow_runs`.
- **AI & Integrations**: `ai_configs`, `ai_knowledge_docs`, `ai_knowledge_chunks`, `api_keys`, `webhook_endpoints`, `webhook_deliveries`.
- **Platform SaaS**: `platform_leads`, `lead_activities`, `platform_customers`, `platform_workspaces`, `platform_communications`.

---

## 5. WhatsApp & Webhook Processing Pipeline

```text
                        [Meta Cloud API Webhook]
                                   │
                                   ▼
                       POST /api/whatsapp/webhook
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
HMAC Signature Verification                             Status Updates
(X-Hub-Signature-256 vs META_APP_SECRET)          (Sent / Delivered / Read / Failed)
       │                                                       │
       ▼                                                       ▼
Inbound Message Payload Processing                       Update `messages` &
(Text, Media, Audio, Interactive Buttons/List,            `broadcast_recipients`
 Quick Reply, Template Response)                               │
       │                                                       ▼
       ├─────────────────────────────────────────────┐   Dispatch Webhooks
       ▼                                             ▼
Contact Resolution & Dedup                  Inbound Media Mirroring
(Normalize phone & check uniqueness)        (Stream to `chat-media` bucket)
       │
       ▼
Resolve / Reopen Conversation
       │
       ├───────────────────────────────────────────────────────┐
       ▼                                                       ▼
Linear Automations Engine                             Visual Flows Engine
(Evaluate triggers: keyword, first message, tag)      (Resume or start flow run DAG)
       │                                                       │
       ▼                                                       ▼
AI Auto-Reply Dispatcher                              Send Outbound Replies
(BYOK context + hybrid knowledge retrieval)           (Graph API message send)
```

### 5.1 Webhook Verification & Security
- `GET /api/whatsapp/webhook`: Handles Meta hub challenge verification (`hub.mode`, `hub.challenge`, `hub.verify_token`).
- `POST /api/whatsapp/webhook`: Enforces `verifyMetaWebhookSignature` using HMAC SHA-256 and `META_APP_SECRET`.

### 5.2 Token Encryption
- WhatsApp Access Tokens and AI API keys are encrypted at rest using **AES-256-GCM** with `ENCRYPTION_KEY` (`src/lib/whatsapp/encryption.ts`).
- Never store plaintext access tokens or API keys in the database.

---

## 6. Engineering Conventions & Rules for AI Agents

### 6.1 Coding Principles
1. **Extend, Never Break**: Follow additive database migrations and backward-compatible schemas. Never drop existing columns without deprecation cycles.
2. **Boundary Isolation**:
   - `src/app/(dashboard)` is Customer CRM space.
   - `src/app/admin` is Platform CRM space.
   - Dashboard code must never import modules from `src/app/admin` or platform-exclusive models.
3. **No Hardcoded Secrets**: All environment configurations must load from `process.env`.
4. **Type Safety**: Strictly define types in `src/types/index.ts` or domain-specific `types.ts` files. Avoid `any`.
5. **Internationalization (i18n)**: User-facing dashboard strings should leverage translation keys from `messages/en.json` and `messages/ko.json` via `next-intl`.

### 6.2 Next.js 16 App Router Specifics
- Page parameters must be awaited:
  ```typescript
  export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }) {
    const { id } = await params;
    const search = await searchParams;
    // ...
  }
  ```
- Always pass cookies properly through SSR Supabase helpers in server actions and route handlers.

### 6.3 Database Migrations
- Migration files reside in `supabase/migrations/` using incremental naming: `040_<feature_name>.sql`.
- Include RLS policies with `SECURITY DEFINER` helper functions (`current_account_id()`).
- Migrations can be run using `npm run db:migrate`.

### 6.4 Common Commands for Verification
```bash
npm run typecheck    # TypeScript verification (tsc --noEmit)
npm run lint         # ESLint check
npm run test         # Run Vitest test suite
npm run dev          # Start Next.js development server
npm run db:migrate   # Run pending SQL migrations
npm run seed:demo    # Seed demo CRM workspace & platform data
```
