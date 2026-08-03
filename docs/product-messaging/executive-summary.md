# Product Messaging Executive Summary - SyncWA

This document provides a summary of the customer discovery and product messaging inputs for SyncWA, designed to serve as a foundation for your website design.

---

## 1. Product Summary
SyncWA is a self-hostable CRM template for WhatsApp® that consolidates team messaging, sales pipelines, contact directories, broadcasts, visual chatbots, and AI assistants into a single unified workspace. It runs on Next.js 16 and Supabase, giving businesses complete ownership of their databases and credentials, with zero per-seat licensing fees.

## 2. Ideal Customer
* **Primary Target:** Small-to-medium support and sales teams (2-50 agents) managing a single official WhatsApp number, and digital agencies looking for a white-label CRM to customize and deploy for client portfolios.
* **Daily Users:** Support agents and sales reps claiming conversations, tracking deals, and editing customer records.

## 3. Top Business Problems Solved
* **SaaS licensing Overhead:** Eliminates monthly agent seat licensing fees, allowing teams to scale without financial penalties.
* **Lack of Data Residency Control:** Ensures complete data privacy by hosting all chat histories and contact files on the client's own cloud project (Supabase).
* **Fragmented Client Threads:** Consolidates multiple reps' conversations into a single shared inbox and automatically de-duplicates records by phone number.

## 4. Most Valuable Features
* **Shared Team Inbox:** Team messaging, chat assignments, timeline notes, and agent presence markers.
* **Visual Kanban Deals Board:** visual pipeline stages, drag-and-drop deals, close dates, and currencies.
* **Visual Chatbots Canvas (Flows):** Visual node canvas builder (`@xyflow/react`) to connect branching welcome menus, capture customer inputs, and trigger handoffs.
* **BYO-Key AI reply Assistant:** grounds completions in FAQ documents using vector search, with human takeover compose banners and reply caps.

---

## 5. Website Priorities

### Homepage Sections Priority
1. **Hero Header:** Introduce Category (self-hosted WhatsApp CRM) and core value proposition (zero seat fees, complete data control).
2. **Data Ownership:** Contrast self-hosting with SaaS options.
3. **Shared Inbox:** Showcase team communication features.
4. **Visual Chatbots Canvas:** Present Flows node graph canvas.
5. **Hostinger Quick Deploy:** Factual walkthrough of Git deploys.

### Feature Page Priorities
* Detailed guides for: Shared Inbox, CRM Directory, Visual Chatbots (Flows), Grounded AI reply, Developer APIs/webhooks, and Workspace Settings.

### Trust Signals
* Direct Meta Cloud API integration, absolute database sovereignty (Supabase project), granular role access control (owner, admin, agent, viewer), and AI bot takeover compose banners.

### Recommended Website Navigation
* **Primary Header:** Homepage, Features (Dropdown), Self-Host Docs, Developer API/MCP Specs, Pricing, and a "Fork on GitHub" CTA button.

---

## 6. Content & Assets Gaps

### Content Still Missing
* Clear explanations distinguishing Automations from visual Flows chatbots, and a visual inbound message routing diagram.

### Screenshots Required
* Shared inbox dashboard, CRM contact sidebar showing custom fields and notes, visual Flows node graph, AI Playground chat window, and the Workspace Members settings roster.

### Demo Videos Required
* Agent claiming and replying, dragging deal cards across stages, creating visual chatbot canvas connections, and vector faq document searches in the AI playground.

### Documentation Gaps
* Step-by-step guides for Meta Business API token registrations and Supabase CLI database migrations, which are currently hosted in an external repository (`ArnasDon/wacrm-site`).

---

## 7. Website Readiness Score
* **Score:** `8.5 / 10`
* **Rationale:** The product capabilities are completed and functionally validated. The value propositions are clear. The remaining `1.5` points reflect the complete absence of application UI screenshots in the repository and the dependency on external setup guides that must be compiled before launch.
