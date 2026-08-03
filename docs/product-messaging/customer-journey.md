# Customer Journey - SyncWA

This document maps the journey of a customer from a first-time website visitor to an active advocate, detailing the information they need at each stage based on codebase capabilities.

---

## The Customer Journey Map

```
  [Visitor] ──► [Interest] ──► [Problem Recognition] ──► [Feature Discovery]
                                                                 │
  [Adoption] ◄── [Trial] ◄── [Trust Building] ◄──────────────────┘
      │
      └──► [Expansion] ──► [Advocacy]
```

### 1. Visitor (First Impression)
* **Goal:** Understand what the product is in 10 seconds.
* **Information Needed:** A clear tagline and value proposition showing it is a self-hostable CRM template for WhatsApp with a shared inbox and zero agent seat licensing fees.
* **Supporting Features:** Core identity details (MIT License, self-hosted, official Meta API).

### 2. Interest (Initial Engagement)
* **Goal:** Evaluate high-level capabilities.
* **Information Needed:** Overview of the workspace (Shared Inbox, Contacts Database, Sales Kanban, Campaigns, Automations, visual Chatbots, and AI).
* **Supporting Features:** Dashboard views, sidebar navigation items catalog.

### 3. Problem Recognition (The Catalyst)
* **Goal:** Compare the template to expensive SaaS solutions.
* **Information Needed:** A clear breakdown of costs and data security concerns (e.g. data residency vs. third-party SaaS cloud storage).
* **Supporting Features:** Single-tenant database architecture, zero per-seat licensing, BYO Key models.

### 4. Feature Discovery (Deep Dive)
* **Goal:** Verify that the product can solve specific operational issues.
* **Information Needed:** Factual details on how features operate (how CSV imports deduplicate, how Flow canvases construct branches, and how AI reply assistants ground FAQs).
* **Supporting Features:** Drag-and-drop Kanban Pipeline board, visual Flows canvas configurations, Knowledge Base groundings.

### 5. Trust Building (De-risking)
* **Goal:** Verify the security and reliability of a self-hosted installation.
* **Information Needed:** Security primitives (database RLS, encrypted credentials, signed webhook payloads, SSRF guards).
* **Supporting Features:** PostgreSQL migration details (`is_account_member` filters), `encryption.ts` logic, `ssrf.ts` parameters.

### 6. Trial (Local Evaluation)
* **Goal:** Set up a quick-start proof-of-concept.
* **Information Needed:** Walkthroughs for local installation, Docker configurations, and setting up environment variables.
* **Supporting Features:** `README.md` commands, `docs/docker.md` composition, `.env.local.example` structure.

### 7. Adoption (Operational Setup)
* **Goal:** Move the platform to production and onboard the team.
* **Information Needed:** Instructions for production deployment, team invites, and currency settings.
* **Supporting Features:** Hostinger hPanel Git deploy integrations, Members tab redeems link portal, deals currency settings.

### 8. Expansion (Developer Customization)
* **Goal:** Integrate SyncWA with external systems.
* **Information Needed:** API specifications, webhook configuration options, and MCP server setup.
* **Supporting Features:** `docs/public-api.md`, `docs/mcp.md` credentials, scoped API key registers.

### 9. Advocacy (White-Labeling)
* **Goal:** Customize and brand the CRM for client distributions.
* **Information Needed:** Customization capabilities, appearance theme panels, and licensing permissions.
* **Supporting Features:** MIT License, `appearance-panel.tsx` visual colors picker (Violet, Emerald, Cobalt, Amber, Rose).
