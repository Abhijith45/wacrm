# Content Priority Classification - SyncWA

This document classifies SyncWA codebase features, configurations, and settings by website visibility, audience type, and security priority.

---

## Content Classification Matrix

### 1. Public Website: Homepage
* **Priority:** High.
* **Content:**
  * Tagline and value propositions.
  * Shared Inbox overview (multi-agent, unified number).
  * visual Kanban Deals Board preview.
  * Visual Chatbot Flows canvas preview.
  * BYO-Key AI benefits (composer drafts, auto-replies).
  * Hostinger deployment quick-start guide.

### 2. Public Website: Feature Pages
* **Priority:** High.
* **Content:**
  * Shared inbox collaboration features (assignments, statuses, reactions, quotes, notes).
  * CRM details (E.164 deduplication, CSV imports, custom fields, tags).
  * Pipeline settings (stage reordering, currency options).
  * Broadcast campaigns wizard (audience filtering, variable mapping).
  * visual Flows configurations (nodes library, inputs, conditions, handoffs).
  * AI configurations (knowledge base file chunk vector grounding).

### 3. Public Website: Pricing Page
* **Priority:** Medium.
* **Content:**
  * Self-hosting comparison: Traditional SaaS fees vs. SyncWA self-hosting costs.
  * Direct pricing explanation: Paying Meta and AI providers directly with zero agent seat markups.

### 4. Public Website: Documentation Landing
* **Priority:** High (Developer / Admin).
* **Content:**
  * Local development quickstart guide (`README.md`).
  * Docker Compose packaging parameters (`docs/docker.md`).
  * Hostinger deployment guides.
  * Supabase CLI migration commands.

### 5. Developer Portal Only
* **Priority:** High (Developer).
* **Content:**
  * Scoped REST developer API `/api/v1` specs (`docs/public-api.md`).
  * Outbound webhook signed payloads and SSRF guards.
  * Model Context Protocol (MCP) server configuration guides (`docs/mcp.md`).

### 6. Workspace Admin Only
* **Priority:** High (Admin / Owner).
* **Content:**
  * Member role management and invitation portals.
  * API Key registration, scope lists, and revocation controls.
  * WhatsApp Business config credentials (verify tokens, access tokens).
  * OpenAI/Anthropic credentials setup.
  * Grounding documentation directory uploads.

### 7. Never Public / Internal Only
* **Priority:** Critical (Security).
* **Content:**
  * Supabase Service Role Key.
  * AES Token Encryption Key.
  * Meta App Secret.
  * WhatsApp verification verify tokens.
  * API key database hashes.
  * Internal API routes (e.g. `/api/account/...`, `/api/whatsapp/config`).
  * Database triggers, RLS code, and custom SQL RPCs.
  * Handoff agent ids and user configuration settings.
