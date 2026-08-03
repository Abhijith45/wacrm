# Messaging Opportunities - SyncWA

This document identifies gaps and opportunities in SyncWA's product messaging, documentation, and visual assets, suggesting areas to clarify to help potential customers evaluate the product.

---

## 1. Product Explanations to Clarify

* **Automations vs. Flows:** The codebase runs two conversational engines side-by-side (Automations for simple trigger-action rules, and Flows for visual branching chatbot state machines). The documentation does not clearly distinguish between the two, which can confuse users on when to use which.
* **Knowledge Base Embeddings & Vector Grounding:** The vector database grounding and embeddings configuration are only briefly mentioned. Users need a clear explanation of how documents are parsed and vectorized, and how vector searches compare to lexical Postgres searches.
* **SSRF Webhook Guards:** The outbound webhook security restrictions are documented technically, but businesses need a simpler explanation of how these guards prevent SSRF vulnerabilities and secure their internal networks.

---

## 2. Missing Visual Assets & Diagrams

* > NOT VERIFIED
  * **Application UI Screenshots:** The repository contains **no application UI screenshots** of the shared inbox, Kanban deals board, automation builder, flow canvas, AI playground, or members roster. These are critical for landing page conversions.
  * **Inbound Message Flow Diagram:** No visual diagram illustrates the inbound routing hierarchy (Meta Webhook -> Flows Chatbot check -> Automations check -> AI Auto-reply check -> Outbound Webhook dispatch). A clear flow diagram would make the messaging path much easier to understand.
  * **Self-Hosting Setup Diagrams:** A simple architecture diagram showing the relationships between the customer's browser, Next.js server, Supabase database, and Meta Cloud API is missing.

---

## 3. Missing Marketing Elements

* **Interactive Demos:** No interactive sandbox playground or video walk-throughs show agents handling chats or building chatbots.
* **Customer Proof & Case Studies:** As an open-source template project, the repository lacks case studies or testimonials showing how businesses use the CRM.
* **Customer-Facing FAQs:** The repository documentation does not contain any consumer-oriented FAQ guides answering basic billing or setup questions.
* **User Onboarding Guides:** No guided walkthrough is built into the application to help first-time users connect their Meta credentials or invite teammates.
