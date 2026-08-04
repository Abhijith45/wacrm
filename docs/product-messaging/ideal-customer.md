# Ideal Customer Profile (ICP) - SyncWA

This document identifies the target audiences, team structures, decision-makers, and daily workflows for SyncWA, translating codebase capabilities into customer segments.

---

## 1. Customer Target Segments

### Primary Target Audience: SMBs & Local Businesses
* **Profile:** Small to medium-sized businesses that use WhatsApp as their primary customer engagement channel and want multiple agents to handle conversations from a single phone number.
* **Team Size:** 2 to 50 customer support agents or sales representatives.
* **Industries:**
  * **E-Commerce & Conversational Sales:** Businesses selling products directly through WhatsApp chat, sending order confirmations, and providing post-purchase assistance.
  * **Local Services (Clinics, Real Estate, Law Offices):** Organizations that communicate sensitive personal information and require strict data security.
  * **Consultancies & Agencies:** Service providers tracking project deals and communicating directly with clients.

### Secondary Target Audience: Digital Agencies & Software Developers
* **Profile:** Agencies and developers who build custom client solutions. They fork SyncWA to white-label, customize, and deliver a branded WhatsApp portal to their clients as a value-added service.

---

## 2. Decision Makers & Daily Users

### The Decision Makers (Evaluating Adoption)
* **Titles:** Business Owners, CTOs, IT Directors, Agency Founders, Operations Managers.
* **Role in Evaluation:** They evaluate hosting requirements, security compliance (data residency on owned servers), and cost reduction (eliminating recurring per-seat SaaS licensing fees).

### The Daily Users (Daily Workspace Reps)
* **Titles:** Customer Support Agents, Sales Representatives, Account Managers.
* **Role in Application:** They spend their workdays in the dashboard, claiming chats, moving deals on the Kanban board, editing contact profiles, and sending template messages.

---

## 3. Typical Daily Workflows

```
[Customer Messages Official WhatsApp Number]
                     │
                     ▼
       [Flows / Chatbot Filters Message]
      (Resolves FAQs or Captures Contact Info)
                     │
                     ├─► [Resolved / Ended]
                     │
                     ▼ (Handoff Triggered)
       [Enters Shared Inbox Queue]
   (Agent Claims Chat ──► Leaves Internal Notes)
                     │
                     ▼
          [Sales Pipeline Progression]
  (Agent Creates Deal ──► Drags Card Across Stages)
```

1. **Inbound Routing:** An incoming customer message is intercepted by an active visual Chatbot (Flow) to answer standard FAQs or collect contact information.
2. **Handoff to Queue:** If the chatbot cannot resolve the query or the customer requests a person, the Flow pauses, routes the conversation to a configured handoff agent, and appends an internal LLM-generated summary note.
3. **Inbox Collaboration:** Support agents claim the thread, update tags, assign custom contact fields, or log internal timeline notes for teammate handoffs.
4. **Deal Tracking:** A sales agent creates a deal linked to the conversation, placing it in a pipeline and dragging it across Kanban stages to track deal values.
5. **Campaign Segmentation:** Marketing managers filter the contacts database by tags (e.g. `VIP`) to schedule template broadcast blasts, monitoring delivery statistics.

---

## 4. Key Customer Pain Points & Business Goals

| Evaluated Dimension | The Customer's Pain Points | The Customer's Business Goals |
| :--- | :--- | :--- |
| **Financial Cost** | High monthly SaaS fees that scale with every new agent added, penalizing business growth. | Eliminate per-seat seat pricing, paying only for direct hosting and API tokens. |
| **Data Privacy** | Customer chat logs and database files are hosted on third-party multi-tenant servers, risking leaks. | Maintain complete control of customer records on dedicated Supabase servers. |
| **User Experience** | Fragmented conversation threads, duplicate contact profiles, and delayed responses. | Unified inbox queue, automatic de-duplication, and visual chatbot workflows. |
| **Software Customization** | Locked templates, rigid UI themes, and fixed CRM fields that cannot adapt to business needs. | Custom CRM metadata fields, visual colors theme settings, and fully modifiable source code. |
