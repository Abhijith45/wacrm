# Website Messaging Framework - SyncWA

This document defines the messaging framework for the SyncWA public website, mapping customer questions directly to codebase features, screenshot requirements, and call-to-actions.

---

## Website Messaging Outline

### 1. Hero Section (Welcome & Introduction)
* **Purpose:** Establish category, primary value proposition, and differentiators.
* **Customer Questions:** 
  * "What is SyncWA?"
  * "How much does it cost?"
  * "Is it hard to host?"
* **SyncWA Answers:** It is a self-hostable CRM template for WhatsApp featuring a shared inbox, visual chatbots, and sales tracking. It costs zero in agent seat fees and deploys to Hostinger in minutes.
* **Supporting Features:** Shared inbox, visual chatbots, Hostinger one-click deployment.
* **Supporting Screenshots:** Main dashboard inbox view.
* **CTA:** "Fork on GitHub" / "Deploy on Hostinger"

### 2. Core Value Section (The SaaS Trap vs. Own Your Data)
* **Purpose:** Address the pain points of expensive monthly subscriptions and data privacy concerns.
* **Customer Questions:** 
  * "Why shouldn't I just buy a standard WhatsApp CRM SaaS?"
  * "Who owns my client communication database?"
* **SyncWA Answers:** SaaS providers charge per agent seat per month, locking you into their servers. SyncWA is self-hosted on your own Supabase account, giving you complete data privacy and unlimited agent seats.
* **Supporting Features:** Supabase client PostgreSQL database, Row-Level Security, Members tab unlimited invites.
* **Supporting Screenshots:** Workspace Members list dashboard showing roles (owner, admin, agent, viewer).
* **CTA:** "Read Self-Host Guides"

### 3. Shared Team Inbox Section
* **Purpose:** Showcase collaboration on a single official WhatsApp Business number.
* **Customer Questions:** 
  * "Can my support team collaborate on one WhatsApp number?"
  * "How do we prevent reps from stepping on each other's toes?"
* **SyncWA Answers:** Yes. The shared inbox displays all conversations from a single number. Agents can claim threads, assign owners, and leave internal note histories on client profiles.
* **Supporting Features:** Chat assignments, conversation status filters, contact sidebar note logs, agent presence heartbeats.
* **Supporting Screenshots:** Inbox queue view showing assigned agent badges and the Contact notes timeline.
* **CTA:** "Explore Shared Inbox Features"

### 4. Visual Branching Chatbot Section (Flows Canvas)
* **Purpose:** Highlight no-code automated conversations.
* **Customer Questions:** 
  * "How do I build automated customer menu selections?"
  * "Do I need to write code to create a chatbot?"
* **SyncWA Answers:** You can build branching menu systems visually without writing code. SyncWA includes a drag-and-drop node graph canvas (`@xyflow/react`) to connect welcome prompts, button choices, text collection, and human handoffs.
* **Supporting Features:** Visual Flows builder, nodes library, automatic layouts.
* **Supporting Screenshots:** Flows canvas graph displaying connected nodes and the validation panel.
* **CTA:** "See Chatbot Canvas Guide"

### 5. Grounded AI reply Section (AI Agents Setup)
* **Purpose:** Showcase AI capabilities with guardrails.
* **Customer Questions:** 
  * "How does the AI assistant know the answers to my FAQs?"
  * "Can I prevent the AI bot from sending incorrect answers?"
* **SyncWA Answers:** The AI assistant uses your own OpenAI/Anthropic keys, grounding completions in your uploaded FAQ documentation via vector search. It is bounded by a conversation reply cap and hands off to humans with an internal summary.
* **Supporting Features:** Hybrid search Knowledge Base, auto-reply cap, AI takeover/resume composing banner.
* **Supporting Screenshots:** AI Playground chat sandbox.
* **CTA:** "Explore AI Capabilities"

### 6. Developer Integration Section
* **Purpose:** Demonstrate extensibility.
* **Customer Questions:** 
  * "Can I connect SyncWA to my external business databases?"
  * "How do I trigger custom automations from WhatsApp events?"
* **SyncWA Answers:** Yes. SyncWA provides a public REST API with scoped API keys and signed HTTPS outbound webhooks, plus an MCP server to drive the CRM from AI clients like Claude Code.
* **Supporting Features:** Scoped REST API, signed webhooks, SSRF protections, MCP server standalone package.
* **Supporting Screenshots:** API Keys setup page.
* **CTA:** "Read Public API Docs"
