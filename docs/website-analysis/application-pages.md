# Application Pages - SyncWA

This document profiles all application screens, layouts, and route definitions implemented in the SyncWA repository.

---

## Page Catalog

### 1. Login Page
* **Route:** `/login`
* **Purpose:** Allows users to authenticate using email and password.
* **Authentication Required:** No (Anonymous).
* **Components:** `src/components/auth/login-form.tsx`
* **Features:**
  * Login inputs with validation.
  * Links to signup and forgot password screens.
  * Remembers auth session on successful submit.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 2. Sign Up Page
* **Route:** `/signup`
* **Purpose:** Registers new users.
* **Authentication Required:** No (Anonymous).
* **Components:** `src/components/auth/signup-form.tsx`
* **Features:**
  * Registration fields with validation.
  * Automatically creates a new personal account workspace for the user (via `handle_new_user` Postgres trigger).
* **Screenshots:** No application UI screenshots are stored in the repository.

### 3. Forgot Password Page
* **Route:** `/forgot-password`
* **Purpose:** Initiates reset password link distributions.
* **Authentication Required:** No (Anonymous).
* **Components:** Uses custom form logic inside route.
* **Features:**
  * Email input with validator.
  * Dispatches reset request to Supabase Auth handler.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 4. Join Workspace Page
* **Route:** `/join/[token]`
* **Purpose:** Allows invited teammates to redeem invitations and join a workspace.
* **Authentication Required:** Yes. (User must be logged in. If not, they are directed to `/login?invite=[token]`).
* **Components:** Public peek controller checks invitation parameters.
* **Features:**
  * Displays account name and role associated with the invite.
  * Authenticates and joins in 1-click.
  * Prevents redemption if user's current account has active business data to avoid accidental overwrites.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 5. Workspace Dashboard Landing
* **Route:** `/dashboard`
* **Purpose:** Displays operational charts, quick-actions, and metrics.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/dashboard/metric-card.tsx`
  * `src/components/dashboard/quick-actions.tsx`
  * `src/components/dashboard/conversations-chart.tsx`
  * `src/components/dashboard/pipeline-donut.tsx`
  * `src/components/dashboard/response-time-chart.tsx`
  * `src/components/dashboard/activity-feed.tsx`
* **Features:**
  * Metric summary cards for: Active chats, New contacts today, Open deals value, Messages sent today.
  * Quick-action shortcut links (Send Template, Add Contact, Create Deal, Create Automation).
  * Line chart comparing incoming and outgoing message volumes (7/30/90 day range filters).
  * Donut chart showing open deals distribution by pipeline stages.
  * Column chart tracking average team response times by day of the week.
  * Real-time workspace activity log feed.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 6. Shared Inbox
* **Route:** `/inbox`
* **Purpose:** Consolidates all customer WhatsApp threads into a collaborative inbox.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/inbox/conversation-list.tsx`
  * `src/components/inbox/message-thread.tsx`
  * `src/components/inbox/message-composer.tsx`
  * `src/components/inbox/message-bubble.tsx`
  * `src/components/inbox/contact-sidebar.tsx`
  * `src/components/inbox/ai-thread-banner.tsx`
* **Features:**
  * Real-time conversation list with status filters (open, pending, closed) and assignment filters (all, unassigned, assigned to me).
  * Scrollable chat history with date boundaries and agent markers.
  * Rich message bubbles displaying text, emojis, media (images, video, documents, audio), interactive options, and reactions.
  * Message composer supporting text inputs, emoji reaction panel, templates picker, quick replies, and attachments.
  * AI-draft reply generation button.
  * AI auto-reply takeover and resume banner.
  * Right-hand contact profile card detailing custom fields, tags, timeline notes, and deals.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 7. Team Notifications
* **Route:** `/notifications`
* **Purpose:** Displays internal notifications.
* **Authentication Required:** Yes.
* **Components:** Uses page route details.
* **Features:**
  * Chronological notifications lists.
  * Supports clear all and mark read actions.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 8. Contact Directory
* **Route:** `/contacts`
* **Purpose:** Displays contacts database.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/contacts/contact-detail-view.tsx`
  * `src/components/contacts/contact-form.tsx`
  * `src/components/contacts/import-modal.tsx`
* **Features:**
  * Paginated contact rows with search queries.
  * Create/edit contact drawer with duplicate warnings.
  * Contact detail views containing notes, custom metadata, and deals.
  * CSV batch imports wizard with drag-and-drop files upload and column selector.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 9. Sales Pipelines
* **Route:** `/pipelines`
* **Purpose:** Kanban board for managing deals.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/pipelines/pipeline-board.tsx`
  * `src/components/pipelines/deal-card.tsx`
  * `src/components/pipelines/deal-form.tsx`
  * `src/components/pipelines/pipeline-analytics.tsx`
  * `src/components/pipelines/pipeline-settings.tsx`
* **Features:**
  * Kanban Columns mapping to pipeline stages with automated column aggregates.
  * Drag-and-drop deals across stages.
  * Deal builder dialog linking contacts, expected close dates, notes, and values.
  * Pipeline settings (CRUD pipelines, custom stage positions, column colors).
* **Screenshots:** No application UI screenshots are stored in the repository.

### 10. Broadcast Campaigns
* **Route:** `/broadcasts`
* **Purpose:** Initiates and monitors WhatsApp template broadcasts.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/broadcasts/step1-choose-template.tsx`
  * `src/components/broadcasts/step2-select-audience.tsx`
  * `src/components/broadcasts/step3-personalize.tsx`
  * `src/components/broadcasts/step4-schedule-send.tsx`
* **Features:**
  * Step-by-step broadcast builder.
  * Campaign target segmentation by tags or CSV uploads.
  * Variable placeholders mapper (maps contacts parameters to template inputs).
  * Campaign scheduling coordinator (immediate send or future run).
  * Campaign monitoring logs displaying sent, delivered, read, and replied counts.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 11. Automations Builder
* **Route:** `/automations`
* **Purpose:** visual rules manager for message/contact workflows.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/automations/automation-builder.tsx`
* **Features:**
  * Visual rules tree mapping triggers (keywords, tags, events) to action chains.
  * Workflow configuration forms (delays, webhook urls, tag changes, assignments).
  * Toggle states (draft/active) and run logs.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 12. Chatbots Canvas (Flows)
* **Route:** `/flows`
* **Purpose:** visual canvas builder for branching chatbots.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/flows/flow-canvas.tsx`
  * `src/components/flows/flow-builder.tsx`
  * `src/components/flows/validation-panel.tsx`
* **Features:**
  * Visual drag-and-drop canvas powered by xyflow.
  * Nodes collection: Message bubble, Button menu, List menu, Media send, Variable capture (user input), Conditions router (branches), Tag added/removed, Handoff to agent, End node.
  * Real-time flow state validations.
  * Unsaved edit warnings.
  * History logs viewer of chatbot runs.
* **Screenshots:** No application UI screenshots are stored in the repository.

### 13. AI Agents Hub
* **Route:** `/agents`
* **Purpose:** Coordinates OpenAI/Anthropic assistant credentials, playground tests, and vector grounding.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/agents/ai-playground.tsx`
  * `src/components/agents/ai-usage.tsx`
  * `src/components/settings/ai-config.tsx`
  * `src/components/settings/ai-knowledge.tsx`
* **Features:**
  * Sandbox playground to chat-test agent responses.
  * AI agent settings (provider, BYO key, system prompts, handoff defaults, conversation limits).
  * Knowledge Base manager (FAQ additions/deletions, backfill index triggers).
  * Token analytics dashboard (charts daily token usage by model/provider).
* **Screenshots:** No application UI screenshots are stored in the repository.

### 14. Workspace & Account Settings
* **Route:** `/settings` (deep links: `/settings?tab=<tab_name>`)
* **Purpose:** Central settings hub.
* **Authentication Required:** Yes.
* **Components:**
  * `src/components/settings/settings-overview.tsx`
  * `src/components/settings/profile-form.tsx`
  * `src/components/settings/whatsapp-config.tsx`
  * `src/components/settings/template-manager.tsx`
  * `src/components/settings/quick-replies-manager.tsx`
  * `src/components/settings/fields-and-tags-panel.tsx`
  * `src/components/settings/deals-settings.tsx`
  * `src/components/settings/members-tab.tsx`
  * `src/components/settings/api-keys-settings.tsx`
* **Features:**
  * Left rail groupings (top, account, workspace).
  * WhatsApp Business Cloud API config (Access token, Verify token, Phone ID).
  * Sync Meta-approved templates into CRM.
  * Profile management (avatar, email, name, global sign-out).
  * Theme switcher (5 colors).
  * Team roster (role management, invite creation, ownership transfer).
  * Scoped REST API keys manager.
* **Screenshots:** No application UI screenshots are stored in the repository.
