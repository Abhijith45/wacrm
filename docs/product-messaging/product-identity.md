# Product Identity - SyncWA

This document outlines the core identity, category, positioning, and pitches for SyncWA, translating its technical build into customer-facing business value.

---

## 1. What is SyncWA?
SyncWA is a self-hostable, single-tenant Customer Relationship Management (CRM) application built specifically for businesses that use WhatsApp® as their primary customer interaction channel. It consolidates team messaging, sales pipelines, contacts databases, broadcasting campaigns, automated chatbots, and AI assistants into a single unified workspace, giving organizations complete ownership of their data and infrastructure.

## 2. Product Category
* **Primary Category:** WhatsApp CRM (Customer Relationship Management).
* **Secondary Categories:** Conversational Commerce Software, Shared Team Inbox, Visual Chatbot Builder.

## 3. Business Problems Solved
* **SaaS Vendor Lock-In & Security Risks:** Traditional CRMs host data on third-party servers, exposing customer databases to provider outages, price increases, and privacy breaches. SyncWA runs on the customer's own cloud (Supabase), keeping data completely private.
* **Prohibitive "Per-Seat" Agent Licensing Fees:** Most WhatsApp inbox tools charge per user per month. SyncWA has zero agent fees; businesses only pay for hosting and direct message/token usage.
* **Siloed Conversations & Duplicate Contacts:** Customers messaging multiple sales reps on different numbers leads to fragmented threads. SyncWA routes all threads from a single official number to a shared team queue while de-duplicating customer records by phone number automatically.
* **Coding Barriers for Automated Chatbots:** Creating automated customer menus usually requires writing custom backend code. SyncWA offers a visual visual builder to design interactive branching chatbots in minutes.
* **Repetitive Support Inquiries:** Support reps waste hours drafting answers to identical FAQs. SyncWA embeds AI composing assistants to draft reply suggestions and auto-reply bots that answer questions from company FAQs.

## 4. Who Should Use SyncWA?
* **Small to Medium Customer Support & Sales Teams (2-50 agents):** Looking to collaborate on a single official WhatsApp Business number without seat caps.
* **Privacy-Conscious Organizations:** Law firms, clinics, financial groups, or local businesses that cannot legally host customer database records on third-party multi-tenant SaaS environments.
* **Digital Agencies & Developers:** Looking to fork, white-label, customize, and deploy WhatsApp messaging portals for client portfolios under a permissive license (MIT).

## 5. Who Should NOT Use SyncWA?
* **Hobbyists Looking for "Zero-Click" Setups:** SyncWA is self-hosted. It requires setting up a Supabase project and Meta Developer Account, which is not suitable for individuals without basic technical understanding.
* **Teams Relying on Personal WhatsApp Accounts:** SyncWA integrates exclusively with the official WhatsApp Business Cloud API. It cannot connect to personal numbers or web-scraped/unofficial QR-code tools.
* **Multi-tenant SaaS Platforms:** Out of the box, SyncWA is designed as a single-account template, not a SaaS platform to resell to multiple separate businesses from a single installation.

## 6. Product Differentiators
* **Full Data Ownership:** All databases, credentials, files, and templates live inside the business's own hosting accounts.
* **Visual Conversational Canvas:** An interactive drag-and-drop chatbot editor (`@xyflow/react`) that manages conversational flows visually.
* **Flexible AI Grounding:** Businesses bring their own OpenAI/Anthropic API keys, storing credentials encrypted using AES-256-GCM. Grounding FAQ documents are parsed locally via database vector searches.
* **Extensible & Brandable Stack:** Built using a simple, modern stack (Next.js, React, Tailwind v4, PostgreSQL) with 5 visual theme templates.

---

## 7. Factual Elevator Pitches

### The Simplest One-Line Explanation
> "A self-hostable team CRM for WhatsApp that combines a shared inbox, visual chatbot editor, sales pipelines, and AI assistants with zero per-seat licensing fees."

### The 30-Second Elevator Pitch
> "SyncWA is an open-source team inbox and CRM built for WhatsApp. It lets your customer support and sales agents reply from a single official number, track leads on visual Kanban boards, and build automated chatbots on an interactive canvas. Because you host it yourself, your customer data remains completely private, and you pay zero per-seat agent fees, paying only for the direct hosting and API tokens you actually use."

### The 2-Minute Explanation
> "SyncWA is a self-hosted WhatsApp workspace designed to replace expensive per-agent SaaS inbox providers. 
> 
> For your team, it provides a shared inbox where agents can claim chats, leave internal notes on profiles, react to messages, and compose replies using visual templates. It includes a contact registry that maps custom fields and de-duplicates customer records, plus a sales Kanban board to drag-and-drop deals and monitor pipeline value across currencies.
> 
> To automate your messaging, SyncWA features two engines: a trigger-action automations builder to react to keywords or tags, and an interactive canvas to visually map branching chatbots that collect customer inputs, route paths, or hand off threads to human agents.
> 
> Furthermore, you can plug in your own OpenAI or Anthropic keys to suggest replies inside the agent's composer, or activate an auto-reply bot that answers questions directly from your uploaded FAQ articles. Because SyncWA runs on your own Next.js server and Supabase database, you have complete control over your customer records, and can white-label, rebrand, or customize the CRM as your business grows."
