# Homepage Blueprint - SyncWA

This document outlines the content hierarchy and structural sections for the SyncWA public homepage, mapping sections to target emotions, customer questions, and asset requirements.

---

## Homepage Sections Layout

### 1. Hero Fold (First Impression)
* **Purpose:** Introduce the category, value proposition, and key call-to-actions.
* **Target Emotion:** Relief, empowerment.
* **Customer Question:** "What is SyncWA, and what does it do?"
* **Answer:** A self-hostable WhatsApp CRM template with a shared inbox, visual chatbot canvas, and zero agent seat licensing fees.
* **Supporting Feature:** Shared inbox, visual Flows builder, Hostinger one-click deployment.
* **Required Screenshot:** Shared inbox workspace dashboard.
* **Required Illustration:** None.
* **CTA:** "Fork on GitHub" (Primary) / "Deploy on Hostinger" (Secondary)
* **Priority:** Critical (1)

### 2. Core Positioning (Own Your Data)
* **Purpose:** Contrast the privacy and cost of self-hosting with third-party SaaS alternatives.
* **Target Emotion:** Security, control, financial clarity.
* **Customer Question:** "Why should I choose a self-hosted CRM instead of a SaaS?"
* **Answer:** SyncWA runs on your own Supabase cloud, keeping your database completely private with zero per-seat licensing fees.
* **Supporting Feature:** PostgreSQL database, RLS policies, unlimited agent invites.
* **Required Screenshot:** Members roster settings panel showing user roles.
* **Required Illustration:** Diagram illustrating single-tenant data flow.
* **CTA:** "Read Self-Hosting Architecture Guide"
* **Priority:** High (2)

### 3. Collaborative Shared Inbox
* **Purpose:** Showcase real-time team support workflows.
* **Target Emotion:** Team synergy, operational peace-of-mind.
* **Customer Question:** "How do multiple agents collaborate on a single number?"
* **Answer:** Agents can claim conversations from a unified inbox queue, assign chats, leave note histories, and track agent presence.
* **Supporting Feature:** Chat assignments, conversation status filters, contact notes timeline, presence heartbeats.
* **Required Screenshot:** Message thread showing assignee badge and contact notes.
* **Required Illustration:** None.
* **CTA:** "Explore Inbox Workflows"
* **Priority:** High (3)

### 4. Visual Branching Chatbot Canvas
* **Purpose:** Highlight no-code visual chatbot builders.
* **Target Emotion:** Creative control, automation efficiency.
* **Customer Question:** "How do I build automated customer menu selections?"
* **Answer:** You can design visual chatbot menus without writing code using a drag-and-drop canvas (`@xyflow/react`) to connect nodes, collect inputs, and trigger handoffs.
* **Supporting Feature:** Visual Flows builder, nodes library, validation checks.
* **Required Screenshot:** visual Flows canvas graph.
* **Required Illustration:** None.
* **CTA:** "See Chatbot Canvas Guide"
* **Priority:** High (4)

### 5. Grounded AI reply & Takeover
* **Purpose:** Showcase AI capabilities with guardrails.
* **Target Emotion:** Confidence, smart automation.
* **Customer Question:** "Can I trust an AI chatbot with my customers?"
* **Answer:** The AI bot uses your own API keys, grounding completions in your FAQ documentation and handing off to humans with an internal summary.
* **Supporting Feature:** Hybrid search Knowledge Base, auto-reply cap, AI takeover composing banner.
* **Required Screenshot:** AI Playground test sandbox.
* **Required Illustration:** None.
* **CTA:** "Read AI Grounding Guide"
* **Priority:** Medium (5)

### 6. Sales Kanban Pipelines
* **Purpose:** Show lead tracking features.
* **Target Emotion:** Progress, sales confidence.
* **Customer Question:** "How do we track lead values discussed in chat threads?"
* **Answer:** Reps can create deals linked directly to inbox conversations and track values across custom pipeline stages.
* **Supporting Feature:** Kanban board, stage reorder, deal updates, currency defaults.
* **Required Screenshot:** Pipelines Kanban board grid.
* **Required Illustration:** None.
* **CTA:** "Explore Sales Pipeline Settings"
* **Priority:** Medium (6)

### 7. Hostinger Deployment Quick-Start
* **Purpose:** Demonstrate the simplicity of self-hosting.
* **Target Emotion:** Simplicity, speed.
* **Customer Question:** "How long does it take to get SyncWA live?"
* **Answer:** Connect your fork and deploy to Hostinger hPanel in a few clicks. Next.js runs out-of-the-box on managed Node.js plans.
* **Supporting Feature:** hPanel Git deploy integrations.
* **Required Screenshot:** hPanel Git deployment screen.
* **Required Illustration:** [hostinger-deploy.png](file:///c:/Users/Abhijeet%20Rawat/Desktop/wacrm/.github/assets/hostinger-deploy.png)
* **CTA:** "Open Setup Walkthrough"
* **Priority:** High (7)
