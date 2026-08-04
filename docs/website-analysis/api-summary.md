# API Summary - SyncWA

This document profiles all backend REST API routes, including internal UI endpoints, webhook endpoints, and public developer routes, implemented in the SyncWA repository.

---

## 1. Authentication Mechanisms

* **Session-Based Authentication:** Used by the dashboard UI. Validates sessions using Supabase authentication cookies. Checked globally via `src/middleware.ts`.
* **API Key-Based Authentication:** Used by the public developer REST API (`/api/v1/...`). Validates bearer tokens prefixed with `wacrm_live_...` against SHA-256 hashes stored in `api_keys`.
* **Signature Verification Webhooks:** Used by Meta Cloud API webhook. Validates the signature header `x-hub-signature-256` using the `META_APP_SECRET` token.
* **Cron Token Validation:** Protects cron tasks. Validates the request headers against the local environment string `AUTOMATION_CRON_SECRET`.

---

## 2. API Endpoint Directory

### Public REST Developer API (`/api/v1`)
These endpoints are used by external scripts and automations, authenticated using Bearer API keys.

| Endpoint | Method | Required Scope | Purpose | External APIs Called |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/me` | `GET` | *(None)* | Verifies API key validity and returns account metadata. | None |
| `/api/v1/messages` | `POST` | `messages:send` | Sends a text, template, or media WhatsApp message to a phone number. | Meta Cloud API |
| `/api/v1/contacts` | `GET` | `contacts:read` | Lists contacts with search filters and cursor pagination. | None |
| `/api/v1/contacts` | `POST` | `contacts:write` | Creates a new contact or returns the existing matching phone record. | None |
| `/api/v1/contacts/{id}` | `GET` | `contacts:read` | Retrieves metadata of a single contact. | None |
| `/api/v1/contacts/{id}` | `PATCH` | `contacts:write` | Modifies contact details and replaces contact tags. | None |
| `/api/v1/conversations` | `GET` | `conversations:read` | Lists conversation threads with status and cursor filters. | None |
| `/api/v1/conversations/{id}` | `GET` | `conversations:read` | Retrieves metadata for a single conversation. | None |
| `/api/v1/conversations/{id}/messages` | `GET` | `messages:read` | Lists messages inside a conversation with pagination. | None |
| `/api/v1/broadcasts` | `POST` | `broadcasts:send` | Launches a template broadcast to a list of up to 1,000 recipients. | Meta Cloud API |
| `/api/v1/broadcasts/{id}` | `GET` | `broadcasts:send` | Monitors campaign status and delivery aggregates. | None |
| `/api/v1/webhooks` | `GET` | `webhooks:manage` | Lists registered outbound webhook endpoints. | None |
| `/api/v1/webhooks` | `POST` | `webhooks:manage` | Registers a new outbound webhook subscription. | None |
| `/api/v1/webhooks/{id}` | `GET` | `webhooks:manage` | Retrieves subscription settings for a single webhook. | None |
| `/api/v1/webhooks/{id}` | `PATCH` | `webhooks:manage` | Modifies subscription URLs, event triggers, or active status. | None |
| `/api/v1/webhooks/{id}` | `DELETE` | `webhooks:manage` | Deletes a webhook subscription endpoint. | None |

---

### Internal Webspace & Settings APIs
These endpoints are called by the front-end dashboard, authenticated using Supabase user sessions.

#### Workspace Members
* **`GET /api/account`** - Returns workspace details and current user role.
* **`PATCH /api/account`** - Modifies workspace name (*Admin/Owner only*).
* **`GET /api/account/members`** - Lists all workspace members.
* **`PATCH /api/account/members/[userId]`** - Modifies member role (*Admin/Owner only*).
* **`DELETE /api/account/members/[userId]`** - Removes member from workspace (*Admin/Owner only*).
* **`POST /api/account/transfer-ownership`** - Transfers workspace ownership to another member (*Owner only*).
* **`GET /api/account/invitations`** - Lists outstanding workspace invitations (*Admin/Owner only*).
* **`POST /api/account/invitations`** - Generates a new invitation link (*Admin/Owner only*).
* **`DELETE /api/account/invitations/[id]`** - Revokes an active invitation link (*Admin/Owner only*).
* **`GET /api/invitations/[token]/peek`** - Public route checking invitation parameters for signup styling.
* **`POST /api/invitations/[token]/redeem`** - Redeems invitation, joining the workspace.

#### WhatsApp Integration
* **`POST /api/whatsapp/config`** - Connects phone credentials (*Admin/Owner only*, calls Meta API to verify token).
* **`GET /api/whatsapp/templates`** - Lists templates imported from Meta Cloud API.
* **`POST /api/whatsapp/templates/submit`** - Submits custom template creations to Meta (*Admin/Owner only*).
* **`POST /api/whatsapp/send`** - Transmits free-form text or media messages (*Agent/Admin/Owner only*, calls Meta API).
* **`POST /api/whatsapp/react`** - Sends message reactions (*Agent/Admin/Owner only*, calls Meta API).
* **`GET /api/whatsapp/media/[mediaId]`** - Proxy downloads attachments hosted by Meta Cloud API (*Agent+*).
* **`GET /api/whatsapp/webhook`** - Validates webhook challenges from Meta (*Public*).
* **`POST /api/whatsapp/webhook`** - Webhook callback from Meta receiving messages and status updates (*Public*).

#### AI Agent Settings
* **`GET /api/ai/config`** - Checks if AI integration has been set up.
* **`POST /api/ai/config`** - Updates OpenAI/Anthropic settings and tests credentials (*Admin/Owner only*).
* **`POST /api/ai/draft`** - Generates one-click completions inside composer (*Agent/Admin/Owner only*, calls OpenAI/Anthropic).
* **`POST /api/ai/playground`** - Sandbox to test AI model completions (*Agent+*, calls OpenAI/Anthropic).
* **`GET /api/ai/usage`** - Lists token usage statistics (*Admin/Owner only*).
* **`GET/POST/DELETE /api/ai/knowledge`** - Manages grounding documents database (*Admin/Owner only*, calls OpenAI Embeddings).
* **`POST /api/ai/autoreply/[id]`** - Takes over or resumes AI replies on a specific thread (*Agent/Admin/Owner only*).

#### Chatbot Flows
* **`GET/POST /api/flows`** - Lists or creates chatbot flows (*Agent/Admin/Owner only*).
* **`GET/PUT/DELETE /api/flows/[id]`** - Retrieves, edits, or deletes a flow (*Agent/Admin/Owner only*).
* **`POST /api/flows/[id]/activate`** - Activates a flow builder draft (*Agent/Admin/Owner only*).
* **`GET /api/flows/[id]/runs`** - Retrieves logs of chatbot runs (*Agent/Admin/Owner only*).
* **`GET /api/flows/templates`** - Lists starter chatbot templates (*Agent/Admin/Owner only*).
* **`GET /api/flows/cron`** - Sweeps timed-out run states (*Auth via AUTOMATION_CRON_SECRET*).

#### Workflow Automations
* **`GET/POST /api/automations`** - Lists or creates trigger-action rules (*Agent/Admin/Owner only*).
* **`GET/PUT/DELETE /api/automations/[id]`** - Edits or deletes an automation rule (*Agent/Admin/Owner only*).
* **`GET /api/automations/cron`** - Executes waiting steps (*Auth via AUTOMATION_CRON_SECRET*).

#### Quick Replies
* **`GET/POST /api/quick-replies`** - Lists or creates quick reply snippets (*Agent/Admin/Owner only*).
* **`GET/PUT/DELETE /api/quick-replies/[id]`** - Edits or deletes quick replies (*Agent/Admin/Owner only*).
