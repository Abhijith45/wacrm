# SyncWA Data & Domain Model (SDDM)

**Version:** 1.0  
**Status:** Source of Truth (Business & Architecture Authority)  
**Owner:** Core Architecture and Product Strategy  
**Last Updated:** 2026-08-04  
**Primary Audience:** Product Managers, Software Engineers, Database Administrators, System Architects, and Integrators  

---

## Table of Contents

1. [Document Purpose](#1-document-purpose)
2. [Business Domain Overview](#2-business-domain-overview)
3. [Platform Ownership Hierarchy](#3-platform-ownership-hierarchy)
4. [Core Business Entities](#4-core-business-entities)
5. [Entity Lifecycle](#5-entity-lifecycle)
6. [Domain Relationships](#6-domain-relationships)
7. [Platform Roles](#7-platform-roles)
8. [Workspace Roles](#8-workspace-roles)
9. [Business Rules](#9-business-rules)
10. [Domain Boundaries](#10-domain-boundaries)
11. [Future Domain Expansion](#11-future-domain-expansion)
12. [Architecture Principles](#12-architecture-principles)
13. [Glossary](#13-glossary)
14. [Future Database Guidance](#14-future-database-guidance)
15. [Cross References](#15-cross-references)

---

## 1. Document Purpose

This document establishes the official **SyncWA Data & Domain Model (SDDM)**. The SDDM serves as the definitive reference for the conceptual domain boundaries and business entities that govern the SyncWA platform.

### 1.1 Scope and Intent
The SDDM is a conceptual business model. It does not describe active database schema syntax, Prisma configurations, SQL statements, or API implementations. By defining stable business semantics, it ensures that changes to physical database tables, API JSON schemas, and frontend view layers do not break the underlying business logic.

### 1.2 Relationship with Strategy Documents
- **SyncWA Website Strategy Document (SWSD)**: Defines customer lifecycle paths, SaaS vision, and business definitions that the SDDM structures.
- **SyncWA Engineering Standards**: Translates SDDM domain guidelines into concrete code structures, folder layouts, and database migration rules.
- **Database Design and APIs**: The SDDM acts as the blueprint for creating normalized tables and modular REST/GraphQL endpoints.

---

## 2. Business Domain Overview

SyncWA uses Domain-Driven Design (DDD) to group business functionality into modular areas:

### 2.1 Website Domain
- **Purpose**: Customer discovery, public marketing, lead generation, and pricing documentation.
- **Responsibilities**: Host public pages, capture traffic analytics, and process inbound sales inquiries.
- **Primary Entities**: Visitor, Public Article.
- **Future Evolution**: Support multi-lingual localization, self-serve diagnostic tools, and content management APIs.

### 2.2 Customer Management Domain
- **Purpose**: Host user profile data, cross-workspace relationships, and identity registries.
- **Responsibilities**: Manage identity authentication, track user logins, and host profile details.
- **Primary Entities**: Customer, Profile.
- **Future Evolution**: Integrate SSO (Single Sign-On), user directory sync, and granular identity logs.

### 2.3 Workspace Domain
- **Purpose**: Enforce tenancy isolation for customer operations.
- **Responsibilities**: Manage workspace metadata, control onboarding steps, and isolate database contexts.
- **Primary Entities**: Workspace, Workspace Member, Settings.
- **Future Evolution**: Multi-region workspace hosting, backup archiving, and advanced workspace templates.

### 2.4 Sales Domain
- **Purpose**: Track platform customer acquisition and CRM sales workflows.
- **Responsibilities**: Qualify leads, schedule demos, and manage pipelines and deals.
- **Primary Entities**: Platform Lead, Pipeline, Deal.
- **Future Evolution**: AI-assisted lead qualification and interactive CRM sales funnels.

### 2.5 Communication Domain
- **Purpose**: Manage real-time external communications, primarily WhatsApp.
- **Responsibilities**: Sync incoming/outgoing messages, track read receipts, and manage contacts.
- **Primary Entities**: Contact, Conversation, Message.
- **Future Evolution**: Multi-channel sync (SMS, Email, Telegram, Instagram) and shared inbox features.

### 2.6 Marketing Domain
- **Purpose**: Drive workspace growth and customer communication.
- **Responsibilities**: Coordinate broadcast lists, schedule campaigns, and track outbound performance.
- **Primary Entities**: Campaign, Broadcast.
- **Future Evolution**: Smart drip campaigns and automated marketing audiences.

### 2.7 Automation Domain
- **Purpose**: Run rule-based backend routines.
- **Responsibilities**: Monitor webhook triggers, process conditional loops, and run automated message flows.
- **Primary Entities**: Automation, Webhook.
- **Future Evolution**: Visual workflow builders and natural language automation design.

### 2.8 Analytics Domain
- **Purpose**: Track and report workspace performance metrics.
- **Responsibilities**: Calculate response times, message volume stats, and pipeline conversion trends.
- **Primary Entities**: Analytics, Activity.
- **Future Evolution**: Predictive forecasting and custom reporting engines.

### 2.9 Subscription Domain
- **Purpose**: Manage commercial SaaS relationship states.
- **Responsibilities**: Track active subscriptions, trial expirations, and plan tiers.
- **Primary Entities**: Subscription.
- **Future Evolution**: Multi-tiered custom plans and usage-based billing models.

### 2.10 Billing Domain
- **Purpose**: Process payments and manage financial records.
- **Responsibilities**: Generate invoices, process payments, track defaults, and issue receipts.
- **Primary Entities**: Invoice, Payment.
- **Future Evolution**: Automated dunning sequences and regional tax calculations.

### 2.11 Support Domain
- **Purpose**: Resolve customer issues.
- **Responsibilities**: Track tickets, catalog support requests, and host internal help materials.
- **Primary Entities**: Support Ticket.
- **Future Evolution**: AI-driven support suggestions and customer status portals.

### 2.12 Administration Domain
- **Purpose**: Provide global platform controls for operators.
- **Responsibilities**: Manage platform staff, audit logs, workspace allocations, and feature flags.
- **Primary Entities**: Platform User, Audit Log.
- **Future Evolution**: Automated security audits and global platform status grids.

### 2.13 Integration Domain
- **Purpose**: Connect with external systems.
- **Responsibilities**: Manage API clients, authenticate webhooks, and coordinate external data flows.
- **Primary Entities**: API Client, Integration.
- **Future Evolution**: Self-serve API hubs and pre-built system connections.

---

## 3. Platform Ownership Hierarchy

The SyncWA ownership hierarchy enforces strict tenancy boundaries to ensure data security and operational isolation:

```text
Platform
  └── Workspace (Tenancy Isolation Boundary)
        ├── Workspace Members (Access Control)
        ├── Customers / Contacts
        │     ├── Conversations
        │     │     └── Messages
        │     └── Support Tickets
        ├── Sales
        │     └── Pipelines / Deals
        ├── Marketing
        │     └── Campaigns / Broadcasts
        ├── Automation (Workflows)
        └── Analytics (Reports)
```

### 3.1 Ownership Responsibilities
- **Platform**: The global container. It oversees billing, workspaces, leads, and staff roles.
- **Workspace**: The core isolation unit. **A Workspace owns all operational data.** No data can escape the workspace boundary.
- **Workspace Members**: Access is granted strictly through explicit membership. Members belong to a workspace and receive functional roles.
- **Customers & Operational Data**: Contacts, conversations, messages, sales funnels, and analytics are owned by a single workspace. They cannot be shared with or accessed by other workspaces.

---

## 4. Core Business Entities

Every business entity in SyncWA belongs to exactly one primary domain.

### 4.1 Platform User
- **Purpose**: SyncWA internal team members who manage platform operations.
- **Owner**: Administration Domain.
- **Lifecycle**: Active, Suspended.
- **Relationships**: Owns no customer workspace data. Has read/write access to administrative records.
- **Business Rules**: Access is restricted to SyncWA employees who have verified staff credentials.
- **Future Evolution**: Support SSO (Single Sign-On) and identity provider provisioning.

### 4.2 Workspace
- **Purpose**: Represents a tenant account (organization/workspace).
- **Owner**: Workspace Domain.
- **Lifecycle**: Created, Trial, Active, Suspended, Archived.
- **Relationships**: Owns all members, contacts, conversations, pipelines, automations, and billing records.
- **Business Rules**: Isolated at the database level. Must be linked to exactly one active subscription.
- **Future Evolution**: Support multi-database hosting for enterprise clients.

### 4.3 Workspace Member
- **Purpose**: Represents a user who has access to a workspace.
- **Owner**: Workspace Domain.
- **Lifecycle**: Invited, Active, Suspended, Removed.
- **Relationships**: Belongs to a Workspace. Linked to a Profile.
- **Business Rules**: Must have exactly one defined role (e.g. Owner, Admin, Manager) per workspace.
- **Future Evolution**: Support cross-workspace switching for enterprise consultants.

### 4.4 Platform Lead
- **Purpose**: Captures public sales inquiries for qualification.
- **Owner**: Sales Domain.
- **Lifecycle**: Visitor, Lead, Qualified, Demo Scheduled, Demo Completed, Trial Active, Converted, Lost, Unqualified.
- **Relationships**: Linked to an assignee (Platform User). Can convert into an active Workspace.
- **Business Rules**: Created outside the workspace boundary. Captures UTM marketing parameters.
- **Future Evolution**: Auto-enrichment using external data services.

### 4.5 Customer
- **Purpose**: Represents the commercial client entity.
- **Owner**: Customer Management Domain.
- **Lifecycle**: Lead, Trial, Paying Customer, Churned.
- **Relationships**: Owns one or more Workspaces. Linked to Subscriptions and Invoices.
- **Business Rules**: Captures billing addresses and tax details.
- **Future Evolution**: Account consolidation for parent-subsidiary organizations.

### 4.6 Contact
- **Purpose**: Represents an external contact (e.g., WhatsApp contact) stored by a workspace.
- **Owner**: Communication Domain.
- **Lifecycle**: Active, Blocked, Archived.
- **Relationships**: Belongs to a Workspace. Linked to conversations.
- **Business Rules**: Must be unique within the workspace.
- **Future Evolution**: Contact merging and de-duplication rules.

### 4.7 Conversation
- **Purpose**: Groups communication history with a Contact.
- **Owner**: Communication Domain.
- **Lifecycle**: Open, Snoozed, Closed.
- **Relationships**: Belongs to a Workspace. Linked to one Contact and multiple Messages.
- **Business Rules**: Automatically generated on first message sync.
- **Future Evolution**: Multi-agent assignment queues.

### 4.8 Message
- **Purpose**: A single unit of communication (text, media, template).
- **Owner**: Communication Domain.
- **Lifecycle**: Pending, Sent, Delivered, Read, Failed.
- **Relationships**: Belongs to a Conversation.
- **Business Rules**: Read-only once written to protect audit integrity.
- **Future Evolution**: Support interactive message objects.

### 4.9 Pipeline
- **Purpose**: Represents a sales process layout.
- **Owner**: Sales Domain.
- **Lifecycle**: Active, Archived.
- **Relationships**: Belongs to a Workspace. Contains sales stages and Deals.
- **Business Rules**: Workspaces can configure custom stages.
- **Future Evolution**: Multi-pipeline tracking.

### 4.10 Deal
- **Purpose**: Represents a sales opportunity.
- **Owner**: Sales Domain.
- **Lifecycle**: Open, Won, Lost, Abandoned.
- **Relationships**: Belongs to a Pipeline. Linked to a Contact.
- **Business Rules**: Value must be tracked in a defined currency.
- **Future Evolution**: Automatic win-probability calculations.

### 4.11 Campaign
- **Purpose**: A structured outbound marketing sequence.
- **Owner**: Marketing Domain.
- **Lifecycle**: Draft, Scheduled, Sending, Completed, Paused.
- **Relationships**: Belongs to a Workspace. Triggers Broadcasts.
- **Business Rules**: Must comply with WhatsApp template guidelines.
- **Future Evolution**: Smart campaign scheduling based on contact timezones.

### 4.12 Broadcast
- **Purpose**: A one-to-many message send.
- **Owner**: Marketing Domain.
- **Lifecycle**: Sending, Completed.
- **Relationships**: Belongs to a Campaign. Contains multiple Messages.
- **Business Rules**: Limited by WhatsApp rate limits.
- **Future Evolution**: Real-time deliverability dashboards.

### 4.13 Automation
- **Purpose**: An automated business rule (e.g., auto-reply).
- **Owner**: Automation Domain.
- **Lifecycle**: Active, Inactive, Draft.
- **Relationships**: Belongs to a Workspace. Listens to triggers (e.g. incoming message).
- **Business Rules**: Must execute in a sandbox environment.
- **Future Evolution**: Interactive flow canvases.

### 4.14 Analytics
- **Purpose**: Compiled metrics reporting.
- **Owner**: Analytics Domain.
- **Lifecycle**: Generated.
- **Relationships**: Belongs to a Workspace. Summarizes messages and deals.
- **Business Rules**: Real-time or cached metrics depending on scale.
- **Future Evolution**: Custom anomaly alerts.

### 4.15 Subscription
- **Purpose**: Tracks SaaS contract state.
- **Owner**: Subscription Domain.
- **Lifecycle**: Trial, Active, Past Due, Canceled, Unpaid.
- **Relationships**: Belongs to a Workspace. Linked to a plan tier.
- **Business Rules**: Controls feature access and workspace limits.
- **Future Evolution**: Custom enterprise usage tiers.

### 4.16 Invoice
- **Purpose**: Represents a bill for services.
- **Owner**: Billing Domain.
- **Lifecycle**: Draft, Open, Paid, Void, Uncollectible.
- **Relationships**: Linked to a Subscription. Contains line items.
- **Business Rules**: Generated automatically before payment.
- **Future Evolution**: Automated invoice reconciliation.

### 4.17 Payment
- **Purpose**: A transaction record.
- **Owner**: Billing Domain.
- **Lifecycle**: Processing, Succeeded, Failed, Refunded.
- **Relationships**: Linked to an Invoice.
- **Business Rules**: Must match payment gateway references.
- **Future Evolution**: Support crypto and multi-gateway fallbacks.

### 4.18 Support Ticket
- **Purpose**: Represents a customer service request.
- **Owner**: Support Domain.
- **Lifecycle**: New, Open, Pending, Resolved, Closed.
- **Relationships**: Belongs to a Customer and Workspace.
- **Business Rules**: Auto-assigned based on current agent workload.
- **Future Evolution**: Automated AI resolution suggestions.

### 4.19 Notification
- **Purpose**: In-app alerts for users.
- **Owner**: Customer Management Domain.
- **Lifecycle**: Unread, Read, Dismissed.
- **Relationships**: Belongs to a Workspace Member.
- **Business Rules**: Auto-expire after a set period.
- **Future Evolution**: Push notification support.

### 4.20 Tag
- **Purpose**: Categorization tag.
- **Owner**: Workspace Domain.
- **Lifecycle**: Active.
- **Relationships**: Belongs to a Workspace. Can tag Contacts and Deals.
- **Business Rules**: Must have unique names within the workspace.
- **Future Evolution**: Auto-tagging rules.

### 4.21 Activity
- **Purpose**: Logs system actions.
- **Owner**: Analytics Domain.
- **Lifecycle**: Immutable.
- **Relationships**: Linked to the acting entity (User/Workspace).
- **Business Rules**: Immutable record for auditing.
- **Future Evolution**: High-volume compliance logging.

### 4.22 Settings
- **Purpose**: Workspace configuration state.
- **Owner**: Workspace Domain.
- **Lifecycle**: Current.
- **Relationships**: Belongs to a Workspace.
- **Business Rules**: Controls localization, business hours, and integrations.
- **Future Evolution**: Version-controlled settings history.

### 4.23 Integration
- **Purpose**: Third-party connection settings.
- **Owner**: Integration Domain.
- **Lifecycle**: Connected, Disconnected, Degraded.
- **Relationships**: Belongs to a Workspace.
- **Business Rules**: Must securely encrypt tokens.
- **Future Evolution**: Standardized OAuth consent flows.

### 4.24 API Client
- **Purpose**: Authenticates external systems.
- **Owner**: Integration Domain.
- **Lifecycle**: Active, Revoked, Expired.
- **Relationships**: Belongs to a Workspace.
- **Business Rules**: Uses token-based authorization.
- **Future Evolution**: Fine-grained API scope permissions.

### 4.25 Webhook
- **Purpose**: Delivers events to external systems.
- **Owner**: Integration Domain.
- **Lifecycle**: Active, Paused, Retrying.
- **Relationships**: Belongs to a Workspace.
- **Business Rules**: Retries failed deliveries on a backoff schedule.
- **Future Evolution**: Signed payloads for verification.

---

## 5. Entity Lifecycle

Major business flows follow predefined state machines:

### 5.1 Platform Lead Lifecycle
The sales funnel follows this sequence:
```text
[Visitor] (Public site visitor)
   │
   ▼
[Lead] (Contact form submitted)
   │
   ▼
[Qualified] (Sales rep verifies data)
   │
   ▼
[Demo Scheduled] / [Demo Completed] (Operational demo run)
   │
   ▼
[Trial Active] (Temporary workspace provisioned)
   │
   ▼
[Converted] (Paid subscription activated)
```

### 5.2 Workspace Lifecycle
Represents the operational status of the isolated workspace environment:
- **Created**: Initial setup phase.
- **Trial**: Active for testing with limit controls.
- **Active**: Full production use with an active subscription.
- **Suspended**: Access locked due to payment failure or policy violation.
- **Archived**: Read-only or marked for deletion.

### 5.3 Customer Lifecycle
The commercial customer relationship lifecycle:
- **Lead**: Initial interest stage.
- **Trial**: Workspace is in trial status.
- **Paying Customer**: Active billing relationship.
- **Renewal / Expansion**: Plan tier upgrades or additional add-on purchases.
- **Churn**: Subscription canceled; account transitioned to inactive status.

---

## 6. Domain Relationships

Domains interact in a decoupled sequence to keep system boundaries clean:

```text
[Website] ──(Form Submit)──► [Platform Leads] ──(Qualify)──► [Customer Management]
                                                                  │
                                                           (Provision)
                                                                  ▼
[Billing] ◄──(Subscription)── [Workspace] ◄────────────── [Workspace Member]
    │
(Invoice)
    ▼
[Support] ◄───(Query)──── [Contact / Inbox]
```

1. The **Website** captures visitor data and hands it to the **Sales (Platform Leads)** domain.
2. If qualified, a **Customer Profile** and a **Workspace** are provisioned.
3. The **Workspace** links to the **Subscription** and **Billing** domains to manage plan tiers.
4. **Workspace Members** access **Communication (Inbox)** and **Support** domains to run day-to-day operations.

---

## 7. Platform Roles

SyncWA internal staff roles are isolated from customer permissions:

- **Founder**: Full system access, pricing modification, and financial control.
- **Platform Admin**: Manages system configurations, global setting parameters, and server health.
- **Sales**: Qualifies leads, processes demos, and manages workspace trials.
- **Support**: Views system status logs and resolves support tickets.
- **Finance**: Audits transaction records, reviews invoices, and processes refunds.
- **Operations**: Manages database provisioning and workspace allocations.

---

## 8. Workspace Roles

Customer roles govern access inside a specific workspace:

- **Workspace Owner**: Access to all settings, billing, membership, and data. Can delete the workspace.
- **Admin**: Can invite members, edit settings, and manage integrations.
- **Manager**: Can edit pipelines, manage campaigns, and assign tickets.
- **Sales**: Can create contacts, manage deals, and edit customer records.
- **Support**: Can respond to conversations, manage contacts, and close tickets.
- **Marketing**: Can design campaigns, edit broadcast templates, and view analytics.
- **Viewer**: Read-only access to workspaces, contacts, and reports.

---

## 9. Business Rules

- **Workspace Boundaries**: One Workspace owns all operational data. Data cannot be shared across workspace boundaries.
- **No Cross-Workspace Access**: Customers are locked to their workspace context.
- **Staff Separation**: Platform staff never become Workspace members automatically. Accessing a customer workspace requires explicit user permission.
- **Leads Precedence**: Platform Leads exist before Customer profiles or active workspaces are created.
- **Subscription Hierarchy**: Subscriptions belong to Workspaces. Invoices belong to Subscriptions. Payments belong to Invoices.
- **Support Scope**: Support Tickets are owned by Customers, referencing a specific workspace.

---

## 10. Domain Boundaries

To keep the system modular, domain ownership is strictly enforced:

| Domain | Owns Entities | Boundary Rules |
|---|---|---|
| **Website** | Visitor, Public Article | Operational only outside the login boundary. |
| **Sales** | Platform Lead, Lead Activities, Lead Tags | Closed when a workspace is provisioned. |
| **Workspace** | Workspace, Workspace Member, Settings, Custom Fields | Governed by tenant isolation keys. |
| **Customer** | Profiles, Organization Data | Handles shared identity records. |
| **Communication** | Contact, Conversation, Message, Channel | Isolated inside the workspace boundary. |
| **Marketing** | Campaign, Broadcast, Audience | Must use approved templates. |
| **Automation** | Automation Flow, Node, Parameter | Sandboxed execution rules. |
| **Billing** | Subscription, Invoice, Payment, Receipt | Synced with external payment gateways. |
| **Support** | Support Ticket, Knowledge Base, Message Log | Read-only access to ticket histories. |

---

## 11. Future Domain Expansion

The SDDM supports future expansion without breaking existing boundaries:

- **Marketplace**: Connects with the **Workspace** domain to install third-party plugins.
- **AI Assistants**: Hooks into the **Communication** domain to draft replies.
- **Mobile Companion**: Interfaces with the **Customer Management** domain to sync messages to mobile viewports.

---

## 12. Architecture Principles

- **Business-First Design**: Design the business entity before writing database tables or APIs.
- **Domain Ownership**: An entity must belong to exactly one domain.
- **Extend Before Duplicate**: Add optional attributes to existing entities instead of creating new tables.
- **Workspace Isolation**: Enforce tenancy boundaries for all customer operations.
- **Stable Terminology**: Keep business terms stable even if the underlying database columns evolve.

---

## 13. Glossary

- **Platform**: The global SyncWA SaaS ecosystem.
- **Workspace**: A secure tenant account.
- **Customer**: The commercial client billing profile.
- **Lead**: A potential customer captured on the public site.
- **Member**: A user with access to a workspace.
- **Subscription**: The commercial plan tier.
- **Conversation**: The message thread containing history with a contact.
- **Pipeline**: A visual sales progression workflow.
- **Platform CRM**: SyncWA's internal administrative portal.
- **Customer CRM**: The client workspace interface.

---

## 14. Future Database Guidance

The conceptual model is decoupled from database schema implementations:
- **Entity Stability**: Business terms remain stable even as database tables evolve.
- **Name Decoupling**: Database tables do not need to share the exact name of the business entity. For example, the `Workspace` business term is implemented as the `accounts` table in the database.
- **Mapping Table**:
  - `Workspace` → `accounts`
  - `Workspace Member` → `profiles` / `account_role_enum`
  - `Customer` → `organizations`
  - `Platform Lead` → `platform_leads`

---

## 15. Cross References

The SDDM is a core business reference for the SyncWA project:
- Mapped to user flows in the **SyncWA Website Strategy Document (SWSD)**.
- Checked against component layouts in the **Platform CRM Design System (PCDS)**.
- Enforced at the code level by the **SyncWA Engineering Standards**.

---

*This document is the authoritative domain model blueprint for SyncWA.*
