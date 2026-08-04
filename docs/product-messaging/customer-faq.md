# Customer FAQ - SyncWA

This document compiles frequently asked questions from potential customers, answered using verified codebase features.

---

## Customer FAQ

### 1. General Questions

#### Can I use my personal WhatsApp number with SyncWA?
No. SyncWA integrates exclusively with the official WhatsApp Business Cloud API. You must set up a Meta Developer Account and connect an official business phone number. Unofficial browser automation hacks or web-scraped personal QR-code tools are not supported.

#### How much does SyncWA cost?
The SyncWA template is open-source (MIT licensed) and has zero licensing or per-seat fees. Your only costs are:
1. **Hosting:** Your server and database fees (e.g. Supabase and Hostinger plans).
2. **Meta Conversations:** Direct message fees charged by Meta.
3. **AI Tokens:** Direct usage costs from OpenAI or Anthropic (if you use AI features).

#### Where is my customer database stored?
Your customer contacts, notes, message logs, custom fields, and credentials live entirely on your own cloud database project (Supabase PostgreSQL database). SyncWA does not host or access your data.

#### Is there an agent seat limit?
No. You can invite unlimited team members to your workspace using secure redemption links, assigning roles (owner, admin, agent, viewer) based on your team needs.

---

### 2. Features & Capabilities

#### Can I build automated FAQ chatbots?
Yes. SyncWA includes a visual drag-and-drop canvas (`@xyflow/react`) to construct branching chatbot flows. You can configure options menus, collect user input into variables, route paths using conditions, and trigger human agent handoffs.

#### How does the AI agent answer customer questions?
The AI reply assistant retrieves relevant excerpts from your uploaded FAQ documents using lexical or vector search (pgvector) to ground its responses, helping prevent hallucinations.

#### Can the AI bot answer customer queries automatically?
Yes. When enabled, the AI bot responds to unassigned threads, bounded by a per-conversation reply cap. If it cannot help or the customer asks for a person, it pauses, assigns the chat to a configured handoff agent, and appends an internal context summary note.

#### Can I send bulk marketing broadcasts?
Yes. You can launch template broadcasts to targeted contact list segments (up to 1,000 recipients per request), map body/header variables (such as name or company), and schedule campaigns.

#### Can I connect SyncWA to my external business systems?
Yes. SyncWA provides a public REST API with scoped API keys and signed HTTPS webhooks to trigger external automations on message events.

---

### 3. Unverified Capabilities

#### Is there a dedicated iOS or Android mobile application?
* > NOT VERIFIED
  No mobile application files or mobile references exist in the repository. SyncWA is built as a responsive web dashboard designed for desktop and mobile browsers.

#### Does SyncWA support other messaging channels (e.g. SMS, Instagram)?
* > NOT VERIFIED
  No other messaging channels are implemented in the codebase. The database schema, triggers, and APIs are designed exclusively for WhatsApp.
