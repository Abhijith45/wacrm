# Documentation Summary - SyncWA

This document captures facts, features, and rules extracted from the primary documentation files within the repository.

---

## 1. README.md
* **Purpose:** High-level project description, feature summary, quick start guide, deploy guidelines, stack overview, and licensing.
* **Important Findings:**
  * SyncWA is a self-hostable CRM template, not a multi-tenant SaaS. It emphasizes full ownership of data, domains, and keys with zero seat licensing fees.
  * Recommends deployment on Hostinger's Managed Node.js shared plans (Premium/Business/Cloud) connected through Git hPanel integrations.
  * The stack comprises Next.js 16 (App Router), React 19, Tailwind v4, Supabase (PostgreSQL, Auth, Storage, and RLS), and Meta Cloud API.
* **Product Information & Features Extracted:**
  * **Shared Inbox:** Staffed by a whole team. Multiple agents working on one official WhatsApp Business number, supporting per-conversation assignment, thread status tags (open, pending, closed), and contact notes.
  * **Contacts:** Tags, custom fields, CSV upload, normalization, and contact deduplication.
  * **Sales Pipelines:** Visual Kanban boards with deals linked to conversations and configurable currencies.
  * **Broadcasts:** Message sends using Meta-approved templates, delivery/read tracking, and per-recipient variable substitutions.
  * **No-Code Automations:** Event-driven visual builder with conditional branches, wait steps, tagging, and webhooks.
  * **AI Reply Assistant:** BYO OpenAI/Anthropic keys (stored AES-encrypted). Enables one-click AI composer drafts, auto-reply chatbot bounded by conversation caps, and lexical/semantic knowledge base retrieval.
  * **REST API:** Scoped, revocable API keys at `/api/v1`.
  * **MCP Server:** Natural-language integration over Model Context Protocol (`mcp-server/`).
* **Business Rules & User Roles:**
  * Solo use runs as single-user with zero setup. Teams can invite users with role-based access control.
  * WhatsApp Business webhook requires a secure HTTPS endpoint (SSL/TLS).
* **APIs Referenced:**
  * Public REST API: `/api/v1`
  * Model Context Protocol (MCP) server.

---

## 2. docs/docker.md
* **Purpose:** Describes packaging, building, and running SyncWA locally or on containerized infrastructure using Docker and Docker Compose.
* **Important Findings:**
  * The project features a multi-stage `Dockerfile` (targeting Next.js standalone output, running under a non-root user) and a `docker-compose.yml` defining an `app` service.
  * Supabase remains external; no database container is shipped inside the Docker Compose.
  * `NEXT_PUBLIC_*` environment variables are baked into the client bundle at build-time. Other environment variables (`SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`, etc.) are read at runtime.
* **Product Information & Features Extracted:**
  * Database migrations under `supabase/migrations/` are **not** automatically applied by the container; they must be executed manually via the Supabase CLI.
  * The container does not run internal schedulers. Automation Wait steps or Flows require an external cron scheduler targeting `GET /api/automations/cron` and `GET /api/flows/cron` with the `x-cron-secret` header.
* **APIs Referenced:**
  * `GET /api/automations/cron`
  * `GET /api/flows/cron`

---

## 3. docs/mcp.md
* **Purpose:** Overview of the Model Context Protocol (MCP) server shipped with SyncWA, allowing AI clients (e.g. Claude Desktop, Cursor) to interact with the CRM.
* **Important Findings:**
  * Shipped in the `mcp-server/` directory and published on npm as `wacrm-mcp`.
  * Acts as a natural language interface on top of the public REST API (`/api/v1`), matching the auth scope of the API key used.
* **Product Information & Features Extracted:**
  * **Safety Model:** By default, the server is strictly **read-only** (allowing tools like `whoami`, contacts list/get, conversations list/get, messages list, and broadcast status).
  * **Write Actions:** To enable writes (sending messages, creating/updating contacts), the client config must explicitly set `WACRM_ENABLE_WRITES: "true"`.
  * **Mass Broadcasts:** Template broadcasts are marked destructive and require explicit `confirm` and `WACRM_ENABLE_BROADCASTS: "true"`.
* **APIs Referenced:**
  * Under the hood, maps directly to public REST API endpoints.

---

## 4. docs/public-api.md
* **Purpose:** Developer documentation for the public REST API (`/api/v1`) of SyncWA, detailing authentication, rate limits, webhooks, and endpoint contracts.
* **Important Findings:**
  * **Authentication:** Uses bearer tokens starting with `wacrm_live_...`.
  * **Tenancy:** Keys are account-scoped. A key acts only within the account where it was generated.
  * **Rate Limiting:** Per-key limit of 120 requests/minute. The limiter is in-memory and per-process.
  * **Webhook Deliveries:** Best-effort semantics. Repeats in webhook statuses can arrive out-of-order. Signatures are verified using `X-Wacrm-Signature` (HMAC-SHA256 over `timestamp.body`).
  * Webhook URLs are restricted to `https://` and public IP addresses (internal RFC1918 ranges, localhost, and metadata IP `169.254.169.254` are blocked).
* **Product Information & Features Extracted:**
  * Supported scopes: `messages:send`, `messages:read`, `contacts:read`, `contacts:write`, `conversations:read`, `broadcasts:send`, `webhooks:manage`.
  * API endpoints support cursor pagination.
  * Webhook events emitted: `message.received`, `message.status_updated`, `conversation.created`.
* **APIs Referenced:**
  * `GET /api/v1/me`
  * `POST /api/v1/messages`
  * `GET /api/v1/contacts`
  * `POST /api/v1/contacts`
  * `GET /api/v1/contacts/{id}`
  * `PATCH /api/v1/contacts/{id}`
  * `GET /api/v1/conversations`
  * `GET /api/v1/conversations/{id}`
  * `GET /api/v1/conversations/{id}/messages`
  * `POST /api/v1/broadcasts`
  * `GET /api/v1/broadcasts/{id}`
  * Webhook management endpoints (`GET/POST/PATCH/DELETE /api/v1/webhooks` and `GET/PATCH/DELETE /api/v1/webhooks/{id}`).

---

## 5. CHANGELOG.md
* **Purpose:** Log of user-visible changes, version releases, and schema migrations.
* **Product Information Extracted:**
  * **v0.8.1:** Harden conversation resolver to prevent duplicate threads per contact. Unique constraint `(account_id, contact_id)`.
  * **v0.8.0:** AI auto-reply enhancements (Take over / Resume thread control banner from Inbox, Hand off to a specific agent/queue with an internal LLM exchange note, Token usage tracking/analytics dashboard).
  * **v0.7.0:** Dedicated `AI Agents` section containing Playground (chat tester) and Setup options.
  * **v0.6.0:** AI Knowledge Base featuring hybrid retrieval (Lexical FTS + optional pgvector embeddings).
  * **v0.5.0:** Bring-your-own-key AI reply draft button in Composer, and auto-reply bot with human handoff.
  * **v0.4.0:** Outbound webhooks.
  * **v0.3.0:** Account sharing / Multi-user tenancy, configurable deal currency, Members setting panel (invitation generation links `/join/[token]`, role updates), API key system, and phone normalization de-duplication rules.
  * **v0.2.2:** Flows support `send_media` (images, videos, documents).
  * **v0.2.0:** Branching chatbot conversations engine (Flows), templates (Welcome menu, FAQ bot, Lead capture), and 5 appearance color themes.
  * **v0.1.1:** Inbox message actions: emoji reactions, reply-with-quote, and copy-text.
  * **v0.1.0:** Initial template release.

---

## 6. CONTRIBUTING.md
* **Purpose:** Guidelines for forking, customizing, and contributing to the upstream repository.
* **Important Findings:**
  * SyncWA is explicitly designed to be forked and customized rather than acting as an upstream-pull package. Feature additions are generally expected to live in local forks.
  * Dictates local dev loop commands (`npm run dev`, `npm run build`, `npm run typecheck`, etc.).

---

## 7. AGENTS.md & CLAUDE.md
* **Purpose:** Developer environment rules and directives.
* **Important Findings:**
  * Highlights that Next.js 16 contains breaking changes relative to public training models and refers to local documentation under `node_modules/next/dist/docs/`.
