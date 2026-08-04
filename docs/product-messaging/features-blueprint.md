# Feature Page Blueprints - SyncWA

This document outlines the content structure for the SyncWA public feature pages, grouping features by customer value categories.

---

## Feature Categories

### 1. Collaborative Communication
* **Problems Solved:** Agents double-texting or missing messages due to fragmented threads on personal mobile devices.
* **Core Features:** Shared Inbox, conversation status tags (open, pending, closed), chat assignments, quoted replies, emoji reactions, and agent presence markers.
* **Customer Benefits:** Consolidates all chats into a unified queue; improves response times and team collaboration.
* **Suggested Screenshots:** Inbox thread showing assigned agent badges and the agent presence bar.
* **Suggested Demo:** Live walkthrough of an agent claiming a chat and replying using visual templates.

### 2. CRM & Customer Directory
* **Problems Solved:** Duplicate contact profiles, lack of customer notes, and manual entry errors.
* **Core Features:** Contact profiles, custom fields, tags, timeline notes, automated E.164 phone deduplication, and client-side CSV import wizard.
* **Customer Benefits:** Keeps customer records organized, prevents duplicate threads, and allows agents to log timeline notes for teammate handoffs.
* **Suggested Screenshots:** Contact detail view showing custom fields and notes.
* **Suggested Demo:** Walkthrough of a user importing a CSV list, mapping headers, and checking deduplication warnings.

### 3. Sales Tracking & Pipelines
* **Problems Solved:** Sales reps losing track of deal values and close dates discussed in chat threads.
* **Core Features:** Kanban deals board, custom stage colorizations, deal updates (open, won, lost), and account-level default currencies.
* **Customer Benefits:** Visualizes the sales pipeline, tracking deal values and expected close dates to prevent leads from slipping through the cracks.
* **Suggested Screenshots:** Pipelines Kanban board showing deal cards.
* **Suggested Demo:** Creating a deal from the inbox contact sidebar and dragging it across pipeline stages.

### 4. Interactive Chatbots (Visual Flows)
* **Problems Solved:** High developer costs or rigid text-only scripts to set up FAQ chatbots.
* **Core Features:** Visual drag-and-drop canvas (`@xyflow/react`), nodes library (welcome prompts, button menus, list menus, variable inputs), and handoff controls.
* **Customer Benefits:** Allows non-technical teams to build branching customer menu selections and automate support paths visually.
* **Suggested Screenshots:** Visual Flows canvas graph.
* **Suggested Demo:** Walking through the template chatbot welcome menu and editing a condition branch.

### 5. Bring-Your-Own-Key AI Agents
* **Problems Solved:** AI bots hallucinating or sending generic replies without company context.
* **Core Features:** Composer draft suggestions, auto-replies (respecting conversation caps), local FAQ knowledge base searches (pgvector embeddings), token dashboards, and human takeover controls.
* **Customer Benefits:** Grounds AI completions in uploaded FAQs, with human takeover controls to pause/resume AI reply agents.
* **Suggested Screenshots:** AI Playground chat sandbox.
* **Suggested Demo:** Asking the AI agent a question in the Playground and watching it retrieve grounding documents.

### 6. Security & Custom Settings
* **Problems Solved:** Data leakage risks, restricted customization, and unauthorized database access.
* **Core Features:** Database Row-Level Security, AES-256-GCM credential encryption, 5 colors theme panel, and Members invite roster.
* **Customer Benefits:** Keeps credentials secure, ensures only authorized members access workspace data, and allows branding customization.
* **Suggested Screenshots:** Settings overview page showing theme selections.
* **Suggested Demo:** Generating a workspace invite link and redeeming it on the redemption page.

### 7. Developer APIs & Integrations
* **Problems Solved:** Unable to trigger external automations or connect WhatsApp workflows to other business databases.
* **Core Features:** Scoped REST API keys (CRUD keys with scope checklists), signed HTTPS outbound webhooks, SSRF guards, and Model Context Protocol (MCP) server.
* **Customer Benefits:** Connects WhatsApp workflows to external CRMs or ERPs, enabling programmatic messaging, contact updates, and natural-language commands.
* **Suggested Screenshots:** API keys settings tab.
* **Suggested Demo:** Querying contact records or launching broadcasts using bearer keys in external scripts.
