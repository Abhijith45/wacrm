# Module Analysis - SyncWA

This document provides a technical and operational breakdown of each product module in the SyncWA repository.

---

## 1. Authentication & Workspace Sharing (Access Management)
* **Purpose:** Handles user logins, password resets, signup account creations, invitation links, role allocations, team management, and secure account transfers.
* **Screens:**
  * Login: `/login`
  * Registration/Signup: `/signup`
  * Forgot Password: `/forgot-password`
  * Join Page: `/join/[token]`
* **Routes:**
  * `src/app/(auth)/login/`
  * `src/app/(auth)/signup/`
  * `src/app/(auth)/forgot-password/`
  * `src/app/join/[token]/`
* **Major Components:**
  * `src/components/auth/login-form.tsx`
  * `src/components/auth/signup-form.tsx`
  * `src/components/settings/members-tab.tsx`
  * `src/components/settings/invite-member-dialog.tsx`
* **Backend APIs:**
  * `GET /api/account`
  * `PATCH /api/account`
  * `GET/PATCH/DELETE /api/account/members/[userId]`
  * `POST /api/account/transfer-ownership`
  * `GET/POST /api/account/invitations`
  * `DELETE /api/account/invitations/[id]`
  * `GET /api/invitations/[token]/peek`
  * `POST /api/invitations/[token]/redeem`
* **Database Tables:**
  * `profiles` (links metadata to auth users)
  * `accounts` (defines shared organizational tenants)
  * `account_members` (joins profiles to accounts with roles: owner, admin, agent, viewer)
  * `account_invitations` (tracks active member invitations)
* **Completeness:** Implemented. Fully functional role-based constraints.
* **Dependencies:** Supabase Auth, `@supabase/ssr`, Node.js Crypto.

---

## 2. Shared Inbox & Messaging (Conversations)
* **Purpose:** Centralized interface for team agents to read, assign, tag, reaction-emoji, swipe-reply, and respond to incoming WhatsApp messages.
* **Screens:**
  * Chat Dashboard Inbox: `/inbox` (supports deep links to conversations `?c=<id>`)
* **Routes:**
  * `src/app/(dashboard)/inbox/`
* **Major Components:**
  * `message-thread.tsx` (scrollable message feed)
  * `message-bubble.tsx` (displays text, locations, media, buttons, lists, templates, and status tags)
  * `message-composer.tsx` (supports drafts, template pickups, quick replies, media uploads, and AI draft assistants)
  * `contact-sidebar.tsx` (right-hand details panel containing custom fields, pipelines, deals, and notes)
  * `conversation-list.tsx` (left-hand sidebar list filtering chats by assignment/status)
* **Backend APIs:**
  * `POST /api/whatsapp/send` (send free-form text or media messages)
  * `POST /api/whatsapp/react` (send message reaction emojis)
  * `GET/POST/DELETE /api/whatsapp/media` (temporary media retrieval)
  * WhatsApp Inbound Webhook: `POST /api/whatsapp/webhook`
* **Database Tables:**
  * `conversations` (aggregates messaging sessions with statuses: open, pending, closed)
  * `messages` (logs inbound/outbound chat texts, media links, and interactive ids)
  * `message_reactions` (tracks emoji reactions applied by customers or agents)
* **Completeness:** Implemented. Emits real-time messages via Supabase Realtime publication.
* **Dependencies:** Meta Cloud API, Supabase Realtime, `@base-ui/react` dialogs.

---

## 3. Contact Registry & Custom Fields
* **Purpose:** Stores customer directory records, Normalizes phone numbers, tags users, handles custom field mappings, adds timeline notes, and imports databases via CSV.
* **Screens:**
  * Contacts List: `/contacts`
* **Routes:**
  * `src/app/(dashboard)/contacts/`
* **Major Components:**
  * `contact-detail-view.tsx` (full-page contact panel with notes, custom values, and deals)
  * `contact-form.tsx` (create or edit client records with duplicate warnings)
  * `import-modal.tsx` (wizard-based CSV loader with mapping selectors)
  * `custom-fields-manager.tsx` (UI for creating custom metadata fields)
* **Backend APIs:**
  * `GET/POST /api/contacts`
  * `GET/PATCH/DELETE /api/contacts/[id]`
* **Database Tables:**
  * `contacts` (stores customer profiles)
  * `tags` (defines visual labels)
  * `contact_tags` (joins contacts to tags)
  * `custom_fields` (defines custom attributes)
  * `contact_custom_values` (stores custom values per contact)
  * `contact_notes` (houses chronological internal team notes)
* **Completeness:** Implemented. CSV parsing occurs client-side before batch database insertion.
* **Dependencies:** `date-fns`, phone normalization libraries.

---

## 4. Sales Pipelines & Deals
* **Purpose:** Tracks deals and pipeline value, manages custom stages, color-codes sales targets, and displays pipeline distributions.
* **Screens:**
  * Kanban Board: `/pipelines`
* **Routes:**
  * `src/app/(dashboard)/pipelines/`
* **Major Components:**
  * `pipeline-board.tsx` (uses dnd-kit to move deal cards between stages)
  * `deal-card.tsx` (renders stage value, expected close date, and company info)
  * `deal-form.tsx` (creates or updates deal status: open, won, lost)
  * `pipeline-analytics.tsx` (renders stage stats and total values)
* **Backend APIs:**
  * Queries and mutations are performed directly via the client-side Supabase SDK.
* **Database Tables:**
  * `pipelines` (stores sales pipelines)
  * `pipeline_stages` (defines stages, positions, and colors)
  * `deals` (details deal title, value, stage, currency, close date, and status)
* **Completeness:** Implemented. Supports dragging across columns, re-rendering total stage calculations.
* **Dependencies:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

---

## 5. Campaign Broadcasts
* **Purpose:** Automates outbound marketing blasts using Meta-approved WhatsApp templates, handles recipient selections, supports variable mapping, and displays delivery/read stats.
* **Screens:**
  * Broadcast Dashboard & Campaign Wizard: `/broadcasts`
* **Routes:**
  * `src/app/(dashboard)/broadcasts/`
* **Major Components:**
  * `step1-choose-template.tsx` (template picker)
  * `step2-select-audience.tsx` (target selection via tags or CSV lists)
  * `step3-personalize.tsx` (variables mapper)
  * `step4-schedule-send.tsx` (scheduling coordinator)
* **Backend APIs:**
  * `GET/POST /api/whatsapp/templates` (lists Meta Business templates)
  * `POST /api/whatsapp/broadcast` (launches background message sends)
* **Database Tables:**
  * `broadcasts` (details campaign name, template, scheduled time, and aggregate status counts)
  * `broadcast_recipients` (details individual recipient status: pending, sent, delivered, read, replied, failed)
* **Completeness:** Implemented. Fan-out occurs asynchronously; cron sweeps schedule triggers.
* **Dependencies:** Meta Cloud API, pg-based trigger functions (for auto-updating broadcast aggregates).

---

## 6. No-Code Automations Engine
* **Purpose:** Triggers actions (messages, tags, CRM changes) based on inbound events (message receipts, keyword matches, tag assignments).
* **Screens:**
  * Automations List & Editor: `/automations`
* **Routes:**
  * `src/app/(dashboard)/automations/`
* **Major Components:**
  * `automation-builder.tsx` (visual conditional rules builder)
* **Backend APIs:**
  * `GET/POST /api/automations`
  * `GET/PUT/DELETE /api/automations/[id]`
  * `GET /api/automations/cron` (executes waiting steps)
* **Database Tables:**
  * `automations` (stores automation metadata)
  * `automation_steps` (holds hierarchical workflow step configurations)
  * `automation_logs` (logs workflow execution details)
  * `automation_pending_executions` (queues scheduled wait actions)
* **Completeness:** Implemented. Scheduled waits rely on external schedulers calling the cron URL.
* **Dependencies:** Node.js timingSafeEqual, cryptographic verify methods.

---

## 7. No-Code Interactive Flows (Chatbots)
* **Purpose:** Visually structures and executes button/list-based customer menus, captures variables, evaluates conditions, and hands off threads to human agents.
* **Screens:**
  * Chatbots Canvas: `/flows` (includes runs history at `/flows/[id]/runs`)
* **Routes:**
  * `src/app/(dashboard)/flows/`
* **Major Components:**
  * `flow-canvas.tsx` (drag-and-drop node graph canvas powered by xyflow)
  * `flow-builder.tsx` (controls node modifications and validation panels)
  * `node-config-form.tsx` (node-level options configuration)
* **Backend APIs:**
  * `GET/POST /api/flows`
  * `GET/PUT/DELETE /api/flows/[id]`
  * `POST /api/flows/[id]/activate`
  * `GET /api/flows/[id]/runs`
  * `GET /api/flows/templates`
  * `GET /api/flows/cron` (sweeps expired run states)
* **Database Tables:**
  * `flows` (defines chatbot metadata and default variables)
  * `flow_nodes` (stores node positions and configs)
  * `flow_runs` (tracks customer session paths and variables)
  * `flow_run_events` (logs chatbot transition metrics)
* **Completeness:** Implemented. Full canvas validation panel maps to React nodes.
* **Dependencies:** `@xyflow/react`, `@dagrejs/dagre` (for auto-arranging layouts).

---

## 8. AI Agent Assistant & Auto-Reply
* **Purpose:** Generates one-click completions for agent composings, answers FAQs automatically using the knowledge base, tracks token spending, and manages OpenAI/Anthropic credentials.
* **Screens:**
  * AI Center: `/agents` ( Playground, Setup, and Usage dashboards)
* **Routes:**
  * `src/app/(dashboard)/agents/`
* **Major Components:**
  * `ai-playground.tsx` (chat sandbox to test AI models)
  * `ai-usage.tsx` (visual charts displaying model/provider spends)
  * `ai-config.tsx` (model provider, key submission, business persona context options)
  * `ai-knowledge.tsx` (grounds AI with Lexical/Vector searches on company policies)
* **Backend APIs:**
  * `POST /api/ai/draft` (draft assistant completions)
  * `POST /api/ai/playground` (sandbox tester)
  * `POST /api/ai/autoreply/[id]` (takeover and human resume controls)
  * `GET /api/ai/usage` (usage metrics)
  * `GET/POST/DELETE /api/ai/knowledge` (FAQ documents catalog)
* **Database Tables:**
  * `ai_configs` (stores encrypted OpenAI/Anthropic keys and auto-reply prompts)
  * `ai_usage_log` (tracks token usage counts)
  * `ai_knowledge_documents` (tracks business FAQs)
  * `ai_knowledge_chunks` (stores chunks with embeddings vector arrays)
* **Completeness:** Implemented. Key inputs are saved AES-encrypted at rest.
* **Dependencies:** OpenAI, Anthropic SDKs, `pgvector`, lexical full-text-search query parsers.

---

## 9. Public Developer API & Outbound Webhooks
* **Purpose:** Exposes programmatic controls to external scripts (queries data, sends messages, triggers campaigns, and subscribes to events).
* **Screens:**
  * Settings → API Keys tab (`/settings?tab=api`)
* **Routes:**
  * `src/app/api/v1/`
* **Major Components:**
  * `api-keys-settings.tsx` (registers, scopes, and revokes API keys)
* **Backend APIs:**
  * `GET /api/v1/me`
  * `POST /api/v1/messages`
  * `GET/POST/PATCH /api/v1/contacts`
  * `GET /api/v1/conversations`
  * `POST /api/v1/broadcasts`
  * `GET/POST/PATCH/DELETE /api/v1/webhooks`
* **Database Tables:**
  * `api_keys` (stores hashed credentials and scope lists)
  * `webhook_endpoints` (stores subscription URLs, signature secrets, and failed count states)
* **Completeness:** Implemented. Webhook dispatches are signed with HMAC secrets and guard against SSRF targets.
* **Dependencies:** Node.js Web Crypto API, `ip-address`, `fast-uri`.
