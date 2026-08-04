# Feature-Value Mapping - SyncWA

This document maps SyncWA's core codebase features directly to their customer values, business benefits, daily workflows, website placements, and asset requirements.

---

## Feature-Value Map

| Feature Name | Customer Problem | Business Benefit | Daily Use Case | Target User | Website Worthy? | Asset Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Shared Team Inbox** | Disjointed communication across multiple personal numbers. | Consolidates all chats into a unified queue; improves response times. | Support reps claim inbound threads, assign owners, and leave notes. | Support reps, Sales reps. | **Homepage & Feature Page** | **Screenshot:** Shared Inbox Dashboard view. <br>**Video:** Agent claiming and replying. |
| **Contact Notes** | Reps lack customer history during handoffs. | Shares context internally, reducing repetitive customer questions. | Agent logs summary notes of call resolutions on the contact profile. | Support reps, Sales reps. | **Feature Page** | **Screenshot:** Notes history in Contact sidebar. |
| **Contact Deduplication** | Duplicate phone numbers create fragmented threads. | Prevents duplicate entries and ensures a clean CRM database. | CSV imports automatically skip duplicates; inbound normalizes phone formats. | Support reps, Admins. | **Feature Page** | None |
| **CSV Contact Import** | Manual contact entry is slow. | Bulk-uploads client directories in seconds. | Marketer uploads a lead list, mapping fields (name, phone, company, tags). | Admins, Marketers. | **Feature Page** | **Screenshot:** CSV upload wizard mapping screen. |
| **Sales Kanban Board** | Sales reps lose track of deal statuses. | Visualizes sales pipeline, tracking deal values and close dates. | Rep drags deal cards across stages as deals progress. | Sales reps, Owners. | **Homepage & Feature Page** | **Screenshot:** Kanban Board. <br>**Video:** Dragging card to another column. |
| **Campaign Broadcasts** | Manual messages are slow and risk phone bans. | Reaches bulk audiences safely using Meta-approved templates. | Marketer selects a template, targets tag segments, and schedules the broadcast. | Marketers, Admins. | **Homepage & Feature Page** | **Screenshot:** Broadcast status list with sent/read counts. |
| **No-Code Automations** | Repetitive manual tagging and routing. | Automates workflows, routing threads and updating records. | Trigger sends buttons or assigns chats when a specific tag is added. | Admins, Ops Leads. | **Homepage & Feature Page** | **Screenshot:** Automation rules tree mapping list. |
| **Visual Flows Canvas** | Visual chatbots are complex to program. | Visualizes and automates branching support flows. | Admin visualizes Welcome menus, routing button taps on the canvas. | Admins, Ops Leads. | **Homepage & Feature Page** | **Screenshot:** Drag-and-drop Flow editor. <br>**Video:** Creating nodes and linking edges. |
| **AI Grounded Replies** | AI bots hallucinating or sending generic replies. | Grounds AI answers in uploaded FAQs, with human takeover controls. | Bot answers FAQs; agent takes over the thread if the bot hands off. | Support reps, Admins. | **Homepage & Feature Page** | **Screenshot:** AI Playground interface. <br>**Video:** AI-draft suggestion composed in inbox. |
| **Public API & Webhooks** | Unable to sync data with external systems. | Connects WhatsApp workflows to external CRMs or ERPs. | External server receives signed `message.received` event notifications. | Developers, Integrators. | **Feature Page & Developer Docs** | None |
| **Model Context Protocol** | Interacting with CRM requires visual dashboard. | Enables natural-language commands to query or update the CRM. | Developer asks Claude Code/Cursor to send a template to a contact. | Developers, AI Assistants. | **Feature Page & Developer Docs** | None |
