# SyncWA Engineering Constitution and Standards

**Version:** 1.0  
**Status:** Source of Truth (Engineering Constitution)  
**Owner:** Technical Leadership and Engineering Council  
**Last Updated:** 2026-08-04  
**Primary Audience:** All developers, technical architects, and database administrators contributing to SyncWA  

---

## Table of Contents

1. [Engineering Philosophy](#1-engineering-philosophy)
2. [Implementation Workflow](#2-implementation-workflow)
3. [Reuse Before Create](#3-reuse-before-create)
4. [Database Engineering Rules](#4-database-engineering-rules)
5. [Migration Standards](#5-migration-standards)
6. [Folder Ownership](#6-folder-ownership)
7. [Component Rules](#7-component-rules)
8. [Platform Domains](#8-platform-domains)
9. [Feature Classification](#9-feature-classification)
10. [API Rules](#10-api-rules)
11. [Security Rules](#11-security-rules)
12. [Documentation Requirements](#12-documentation-requirements)
13. [Upstream Compatibility](#13-upstream-compatibility)
14. [Code Review Checklist](#14-code-review-checklist)
15. [Definition of Done](#15-definition-of-done)

---

## 1. Engineering Philosophy

SyncWA is engineered not as a customized single-user installation, but as a commercial, multi-tenant Software-as-a-Service (SaaS) business platform. Every architectural and implementation decision must be evaluated against long-term maintenance costs and platform flexibility.

Our core engineering guidelines require that all code, database, and system-level operations optimize for the following:

- **Maintainability**: Code must be clear, self-documenting, and structured to make future updates straightforward. Accept upstream styling conventions within upstream directories to minimize drift, and use clean, modular abstractions for SyncWA code.
- **Scalability**: DB schema designs, queries, and APIs must handle thousands of active customer workspaces and high-volume message delivery loops without performance regression.
- **Modularity**: Code must be decoupled into domain-aligned modules. Avoid creating monolithic files or spaghetti dependencies.
- **Future Independent Deployment**: Sub-applications (such as the Marketing Website, Customer CRM, and Platform CRM) must remain logically isolated so they can be separated into standalone micro-applications with independent deployment footprints when scale demands it.
- **Backward Compatibility**: Ensure APIs, database migrations, and schema changes remain compatible with previously deployed client instances and earlier upstream codebase commits.

**Critical Rule:** Quick fixes, ad-hoc hacks, and architectural compromises are strictly prohibited. Temporary solutions that introduce technical debt or compromise long-term architecture will be rejected during code review.

---

## 2. Implementation Workflow

Every feature request, bug fix, database change, or system integration must follow this sequence. Never skip steps, and never commit code directly without moving through the upstream planning and validation phases.

```text
  Business Discussion & Product Scoping
                   │
                   ▼
       Strategy Document Update (SWSD)
                   │
                   ▼
 Technical Architecture Review & Domain Alignment
                   │
                   ▼
  Database Schema Audit & Tenancy Evaluation
                   │
                   ▼
  Implementation Plan Creation (and Approval)
                   │
                   ▼
     Database Migrations (Additive Only)
                   │
                   ▼
     Backend Services & API Development
                   │
                   ▼
  Frontend Components & Client UI Development
                   │
                   ▼
   Automated Unit, Integration & Security Tests
                   │
                   ▼
Documentation Updates (Guides, domain model, API)
                   │
                   ▼
               Deployment
```

No developer should begin writing database migrations or application code without completing the preceding strategy updates, architecture reviews, and database audits. Understanding the existing context is mandatory before making modifications.

## Architecture Impact Assessment (Mandatory)

Before implementing any feature, migration, API, or refactoring, perform an Architecture Impact Assessment.

Every implementation plan must answer the following questions:

1. What business problem is being solved?
2. Which Platform Domain does this belong to?
3. Can existing code or database entities be reused?
4. Does it require database changes?
5. Does it affect upstream compatibility?
6. Which documentation must be updated?
7. What are the long-term architectural implications?

Implementation should not begin until these questions have been answered.

---

## 3. Reuse Before Create

Avoid duplicate code, logic, and schemas. Before writing a single function, helper, or model, engineers must audit the active codebase and answer three questions:

1. **Does this already exist?** Check if the required business logic, database table, or utility function is already implemented in the codebase or upstream directories.
2. **Can it be reused?** Verify if the existing code can satisfy the new requirements in its current form.
3. **Can it be extended?** If the current implementation does not satisfy the requirement, can it be safely extended (e.g. by adding optional parameters, interfaces, or metadata columns) without introducing breaking changes or violating tenancy rules?

**Standard:** Prefer **Extend** over **Replace**. Never duplicate existing codebase logic.

---

## 4. Database Engineering Rules

Creating new database tables introduces schema maintenance costs, index overhead, and migration friction. Before authoring any SQL migration or Prisma model:

- **Perform a Database Schema Audit**: Check the existing database tables, columns, constraints, and relationships.
- **Check for Equivalent Entities**: Determine if the database already contains a model representing the required business concept.
- **Check for Extension Potential**: Can the existing database schema be extended (by adding optional/nullable columns or JSONB metadata fields) to satisfy the requirements?
- **Avoid Concept Duplication**: Never create parallel tables representing similar data structures or roles.

### Core Mappings

To maintain schema consistency, these core entity mappings are locked and must be adhered to:

| Business Concept | Codebase Table | RLS tenanting | Strategy |
|---|---|---|---|
| **Customer Workspace** | `accounts` | Partition primitive | Reuse the existing `accounts` table. Do not create a new `workspaces` table. Extend `accounts` with statuses, billing cycles, or onboarding checklists. |
| **Workspace Membership** | `profiles` | Scoped via `account_id` | Reuse `profiles` + `account_id` + `account_role`. Do not introduce a `workspace_users` or separate membership join table for MVP. |

---

## 5. Migration Standards

### 5.1 Decimal Versioning
SyncWA migrations must be cleanly isolated from upstream migrations. All downstream migrations must use **decimal versioning** corresponding to their dependency chain.

- **Upstream Pattern**: Integer increments (e.g., `035_interactive_messages.sql`, `036_conversation_contact_dedup.sql`).
- **SyncWA Pattern**: Decimal extensions based on the last applied upstream migration (e.g., `036.1_syncwa_platform_leads.sql`, `036.2_syncwa_lead_activities.sql`).

This naming convention ensures that when the upstream repository adds a new migration, the files remain logically ordered, and local merges do not overwrite or collide with downstream files.

### 5.2 Mandatory Migration Header
Every SQL migration script written for the SyncWA database must begin with the following standardized, metadata header:

```sql
-- ============================================================================
-- SyncWA Migration
-- Version      : <Decimal_Version>
-- Name         : <Snake_Case_Migration_Name>
-- Depends On   : <Last_Upstream_Or_Downstream_Migration_Filename>
-- Domain       : <Platform_Domain>
-- Phase        : <Target_Release_Phase>
-- Owner        : SyncWA
-- ============================================================================
```

### 5.3 Technical Migration Requirements
- **Reversible**: Where practical, provide instructions or backup paths to roll back the migration.
- **Additive**: Prefer adding tables, columns, indexes, and constraints. Avoid destructive changes (such as dropping tables, columns, or changing datatypes) that break compatibilities.
- **Upstream Compatibility**: Ensure changes do not break RLS rules or database functions relied upon by the core Customer CRM workspace.
- **Index Definitions**: Include explicit indexes on foreign keys, lookup fields, and query boundaries.
- **Constraint Integrity**: Enforce foreign keys and check constraints at the database tier rather than relying solely on application validation.
- **Self-Documenting Code**: Include detailed SQL comments explaining the purpose of triggers, functions, and non-obvious constraints.

---

## 6. Folder Ownership

SyncWA divides codebase directories into clean ownership domains. Under no circumstances should folder boundaries be violated:

- **Core / Common (`src/lib/`, `src/hooks/`)**: Contains shared utility scripts, database clients, and helpers. Code here must be highly reusable and have zero dependencies on marketing or platform administration modules.
- **Marketing (`src/app/(marketing)/`, `src/components/marketing/`)**: Completely owned by SyncWA. Governs public pages and lead capture elements. It must remain self-contained.
- **Customer CRM (`src/app/(dashboard)/`, `src/components/dashboard/`)**: Retains maximum compatibility with the upstream repository. Upstream enhancements or layouts should merge here with minimal conflict.
- **Platform CRM (`src/app/(admin)/`, `src/components/admin/`)**: SyncWA-only administrative modules. It has no upstream representation and operates under separate security/authorization rules.

---

## 7. Component Rules

The user interface (UI) must remain cohesive, polished, and performant.

- **Audit Reusable Components**: Before building a new button, form, dialog, or table, search `src/components/ui` or marketing components for reusable assets.
- **Do Not Duplicate UI Elements**: If a component's visuals and behaviors are similar to an existing component, import and configure the existing component.
- **Component Creation Criteria**: You may create a new component only when:
  - The business responsibility and context differ completely.
  - Reusing or extending the existing component would introduce too many conditional flags and decrease readability.
  - Decoupling improves build times and route group compilation boundaries.

---

## 8. Platform Domains

Every new model, API, class, page, or service developed for the Platform CRM must map to exactly one official business domain:

1. **Website**: Public page management, content strategies, and initial lead capture forms.
2. **Customer Management**: Lead qualifying, sales pipeline coordination, and demo logs.
3. **Workspace**: Client workspace provisioning, onboarding monitoring, status parameters.
4. **Subscription**: Pricing configurations, plan durations, and feature limits gating.
5. **Billing**: Invoices, transactions, gateway hooks, receipts, and financial audit logs.
6. **Support**: Support tickets, technical diagnostics, and escalation routing.
7. **Analytics**: Aggregate platform dashboards, retention indices, and usage telemetry.
8. **Administration**: Operator profiles, backend settings, and system-wide feature flags.
9. **Integration**: Directory of platform-approved external modules and API keys.

## Domain Ownership Matrix

Each business domain owns its own:

- Database entities
- APIs
- Services
- UI components
- Documentation

Cross-domain dependencies should remain minimal.

Examples:

Website Domain
→ Marketing pages
→ Contact forms
→ Platform Leads

Workspace Domain
→ Accounts
→ Profiles
→ Workspace lifecycle

Billing Domain
→ Plans
→ Subscriptions
→ Payments

This separation prepares SyncWA for future independent deployments and service boundaries.

---

## 9. Feature Classification

Every Pull Request (PR) and implementation plan must classify the target changes under one of these categories:

- **Core Extension**: Extends upstream CRM concepts (e.g. adding custom fields to contacts, or optimizing messaging APIs).
- **SyncWA Feature**: Business logic and public-facing elements unique to the marketing or pricing websites.
- **Platform Feature**: Internal administrative systems for managing SaaS operations (e.g. lead pipelines, subscription lifecycles, and billing).

Document the classification in the PR description and commit metadata.

---

## 10. API Rules

- **Prefer Extension**: Add optional parameters or new endpoints instead of rewriting existing routes.
- **No Breaking Changes**: Never modify active API endpoint inputs or outputs in a way that breaks existing automated clients or frontends.
- **Versioned API Routes**: When breaking changes are structurally unavoidable, version the API endpoint (`/api/v1/*` -> `/api/v2/*`) to support transition periods.
- **Modular Layout**: Keep API endpoints isolated by domain within the Next.js router.

---

## 11. Security Rules

- **Zero Trust Frontend**: Never rely on client-side parameters, forms, or validations for security. All data validation, sanitization, and verification must happen on the backend server.
- **Strict Tenant Isolation**: Row Level Security (RLS) is the primary guard. Every customer query must be filtered by `account_id` via the database policy layer or authenticated session parameters.
- **Platform vs Workspace Role Separation**: Platform roles (operators) and Workspace roles (customers) are completely independent. A user with platform-wide administrative rights does not automatically inherit write access inside customer workspaces, and customer admins have zero access to platform tables.
- **Data Protection**: Store all sensitive integration tokens, access keys, and API secrets encrypted using AES-256-GCM at rest.

---

## 12. Documentation Requirements

No implementation is complete until the documentation is updated. Developers must document their work as part of the implementation ticket.

- **SWSD**: Update when marketing copy, brand voice, pages, or conversion flows are added or altered.
- **Customization Guide**: Update when codebase layouts, synchronization workflows, or merge rules change.
- **Engineering Standards**: Update when coding principles, database constraints, or migration version rules are modified.
- **Technical Architecture / DB Domain Docs**: Update when database schemas, schemas, or RLS parameters are introduced.

## Architecture Decision Records (ADR)

Major architectural decisions should be documented before implementation.

Examples include:

- Multi-tenant strategy
- Workspace architecture
- Platform CRM
- Authentication strategy
- Billing model
- Deployment strategy

Every ADR should include:

- Problem
- Decision
- Alternatives considered
- Consequences

This ensures future contributors understand why important decisions were made.

---

## 13. Upstream Compatibility

Before editing upstream files, developers must consider alternative extension patterns:

- **Extensibility Hooks**: Can the change be triggered via a database webhook, event handler, or server-side utility hook instead of editing the core file?
- **Wrappers**: Can the upstream component be wrapped inside a SyncWA container to add custom styling or behaviors?
- **Modular Additions**: Can the custom behavior be placed in a new, separate file and imported into the upstream routine?

Direct changes to upstream files must be kept to an absolute minimum to preserve conflict-free merges.

---

## 14. Code Review Checklist

Pull Requests will be rejected unless they pass the following checks:

* [ ] **Architecture Preserved**: The implementation respects existing route group and domain boundaries.
* [ ] **Reuse Prioritized**: Existing components, functions, and helpers were reused or extended; no redundant code was introduced.
* [ ] **No Duplicated Entities**: No parallel database tables or conceptual duplicates were created (e.g., used `accounts` for workspaces).
* [ ] **SyncWA Migration Standards Followed**: Migrations use decimal numbering and carry the mandatory metadata header.
* [ ] **Backward & Upstream Compatible**: Change does not break existing APIs or compromise future upstream merge paths.
* [ ] **Security Verified**: Row Level Security (RLS) policies are active, and backend validation checks are in place.
* [ ] **Domain Scoped**: New files and modules belong to one of the defined Platform Domains.
* [ ] **Documentation Updated**: All relevant markdown files (`SWSD`, `Customization Guide`, etc.) were updated.
* [ ] **Tests Passing**: Verified locally that unit, integration, and security checks execute successfully.

---

## 15. Definition of Done

An implementation task or PR is considered **Done** only when it satisfies the following criteria:

1. **Business Logic Complete**: The feature functions exactly as defined in the product requirements.
2. **Database Schema Finalized**: Schema audits completed, migrations tested, indexes defined, and constraints enforced.
3. **Backend API Fully Integrated**: Backend routes complete, and security checks active.
4. **Frontend UI Polished**: Layouts are fully responsive, performant, and visual assets are correctly loaded.
5. **Automated Verification Complete**: The test suite compiles and runs with zero failures.
6. **Documentation Updated**: Strategic, engineering, and API document files are updated and pushed.
7. **Code Reviewed & Approved**: Code passes the architectural checklist and receives peer approval.

---

*This document is the engineering constitution of SyncWA. Adherence to these rules is mandatory.*
