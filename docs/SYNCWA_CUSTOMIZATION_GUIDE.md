# SyncWA Customization and Fork Maintenance Guide

**Version:** 1.0  
**Status:** Source of Truth (Engineering Governance)  
**Owner:** Engineering and Technical Strategy  
**Last Updated:** 2026-08-04  
**Primary Audience:** Software engineers, database administrators, and technical architects joining the SyncWA project  

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Project Evolution](#2-project-evolution)
3. [Repository Strategy](#3-repository-strategy)
4. [Upstream Synchronization Strategy](#4-upstream-synchronization-strategy)
5. [Customization Philosophy](#5-customization-philosophy)
6. [Folder Ownership](#6-folder-ownership)
7. [Database Ownership](#7-database-ownership)
8. [Coding Principles](#8-coding-principles)
9. [Route Group Strategy](#9-route-group-strategy)
10. [Future Platform Architecture](#10-future-platform-architecture)
11. [Database Evolution Strategy](#11-database-evolution-strategy)
12. [Source of Truth Documents](#12-source-of-truth-documents)
13. [Development Workflow](#13-development-workflow)
14. [Upstream Merge Rules](#14-upstream-merge-rules)
15. [Long-Term Vision](#15-long-term-vision)

---

## 1. Purpose

SyncWA is maintained as a long-term fork of an upstream open-source WhatsApp CRM project. While SyncWA is rapidly diverging into a commercial, multi-tenant Software-as-a-Service (SaaS) business platform, we must preserve the ability to sync with the upstream repository to benefit from upstream improvements, bug fixes, and security patches.

This Customization Guide serves as the official engineering governance document for the SyncWA codebase. Its purpose is to:
- Establish rules of codebase and database ownership.
- Minimize future merge conflicts and structural regression.
- Provide a standardized framework for implementing new product features.
- Define the repository synchronization workflow for engineering teams.

Every developer working on SyncWA must read, understand, and adhere to this guide.

---

## 2. Project Evolution

SyncWA is no longer merely a customized deployment of the upstream CRM. It is actively evolving into an independent commercial platform. This transition is mapped below:

```text
Original Upstream CRM
         │
         ▼
    SyncWA Fork
         │
         ▼
Branding & Visual Customization (Version 1.0)
         │
         ▼
Marketing Website Integration (Version 1.1 — introducing route groups)
         │
         ▼
Platform CRM / Owner Portal (Version 1.2 — domain-driven platform)
         │
         ▼
Commercial SaaS Launch (Multi-tenant account & subscription tracking)
         │
         ▼
Independent Deployable Product (Long-term decoupled micro-applications)
```

As the project scales, the divergence between the upstream codebase and SyncWA will expand. This document outlines how to manage this divergence responsibly.

---

## 3. Repository Strategy

SyncWA remains a downstream fork of the upstream project, but synchronization is no longer automatic or trivial. 

Because SyncWA has introduced structural changes (such as multi-tenant account scoping, Visual Flows, and the Marketing Website), upstream updates must be evaluated manually before integration. Any incoming upstream pull request, commit, or patch must be screened to ensure it does not break SyncWA-specific business logic or RLS security parameters.

---

## 4. Upstream Synchronization Strategy

Direct merges of upstream branches (e.g., `git merge upstream/main`) are strictly prohibited due to structural divergence. Instead, engineers must follow the official synchronization workflow:

```text
Step 1: Fetch Upstream Updates
                 │
                 ▼
Step 2: Review Upstream Release Notes & Logs
                 │
                 ▼
Step 3: Compare Modified Files with SyncWA Codebase
                 │
                 ▼
Step 4: Identify Relevant Bug Fixes & Refinements
                 │
                 ▼
Step 5: Cherry-pick Commits or Manually Port Code
                 │
                 ▼
Step 6: Run Local Verification Tests
                 │
                 ▼
Step 7: Commit to Downstream Dev Branch for Review
```

### Preferred Synchronization Workflow
1. **Fetch**: Maintain a Git remote pointing to the upstream repository (`git remote add upstream <url>`) and regularly fetch updates.
2. **Evaluate**: Review release notes, commit logs, and issues to identify target bug fixes, performance optimizations, or WhatsApp API alignment updates.
3. **Compare**: Compare files changed in the upstream commit against their downstream counterparts in SyncWA to predict merge conflicts.
4. **Isolate**: If the target improvement lies within shared files (e.g., the WhatsApp message receiver handler), isolate the specific commit hash.
5. **Port**: Cherry-pick the commit (`git cherry-pick -x <hash>`) or manually copy the logical changes if the underlying code structures have diverged too far.
6. **Test**: Run the automated test suite locally to verify that RLS boundaries and route groups remain intact.
7. **Merge**: Submit a Pull Request merging the ported changes into the SyncWA development branch.

---

## 5. Customization Philosophy

To maintain architectural clarity, all features developed for SyncWA must belong to exactly one of the three customization categories:

```text
Feature Categorization
  ├── Core Extension (Shared files; extends upstream structures)
  ├── SyncWA Feature (Marketing website; content; branding)
  └── Platform Feature (Platform CRM; billing; internal administration)
```

### 5.1 Core Extension
- **Definition**: Extending existing upstream functionality without replacing the underlying database schema or application architecture.
- **Rules**: Keep modifications backward-compatible. Add columns or fields rather than renaming existing ones. Use hook or event systems where possible instead of hacking upstream files directly.
- **Examples**: Additional contact fields, custom validation rules on CRM imports, new dashboard widgets, or additional public API endpoints.

### 5.2 SyncWA Feature
- **Definition**: Front-facing business modules and branding elements unique to the SyncWA product.
- **Rules**: Keep these modules physically isolated from upstream files. Place them under dedicated route groups or directories.
- **Examples**: Marketing Website pages (`(marketing)` route group), pricing plan comparison pages, contact form frontend assets, custom logos, and corporate branding themes.

### 5.3 Platform Feature
- **Definition**: Administrative modules and capabilities required for SaaS platform operations. These are completely absent in the upstream project.
- **Rules**: Build these exclusively under the Platform CRM boundary. Under no circumstances should platform logic leak into Customer CRM modules.
- **Examples**: Lead Management (`platform_leads`), customer workspace provisioning, onboarding checklists, subscription configuration, billing receipts, and database tenancy diagnostics.

---

## 6. Folder Ownership

Codebase folders belong to specific ownership classifications to prevent accidental modification during upstream synchronization:

```text
Codebase Folder Classifications
  ├── Shared Documentation  →  docs/
  ├── SyncWA Only           →  src/app/(marketing)/, src/app/(admin)/
  ├── Upstream-Compatible   →  src/app/(dashboard)/, src/components/dashboard/
  └── Shared System         →  src/app/(auth)/, src/lib/auth/
```

- **Shared Documentation (`docs/`)**: Document files are managed downstream but can receive upstream documentation revisions if the underlying features match. Strategic assets (like the SWSD or this Customization Guide) are SyncWA-only.
- **SyncWA Only (`src/app/(marketing)/`, `src/app/(admin)/`)**: These folders are completely owned by SyncWA. Upstream merges should never affect files in these paths.
- **Upstream-Compatible (`src/app/(dashboard)/`, `src/components/dashboard/`)**: These directories contain the core Customer CRM workspace. We strive to maintain folder layout and file structure compatibility with upstream to simplify merging future inbox or pipeline enhancements.
- **Shared System (`src/app/(auth)/`, `src/lib/auth/`)**: Tenancy mapping, sign-in wrappers, and session contexts are modified downstream but must remain compatible with the upstream auth providers.

---

## 7. Database Ownership

SyncWA inherits database tables from upstream and introduces its own tables for SaaS administration. We must enforce strict rules of database entity ownership:

- **Upstream-Inherited Tables**: Tables such as `contacts`, `conversations`, `messages`, `pipelines`, and `deals` are inherited from upstream. We must avoid altering these tables' names or deleting columns to remain compatible with upstream code.
- **Downstream Extensions**: If an upstream table needs to support a SyncWA business requirement, **extend it** by adding new columns, indexes, or metadata fields (e.g. adding `status` or `onboarding_status` to `accounts` / workspaces). Do not create duplicate tables.
- **Platform-Exclusive Tables**: Tables required for Platform CRM operations (e.g., `platform_leads`, `lead_activities`) belong exclusively to SyncWA and are isolated from the customer database scope.

---

## 8. Coding Principles

Engineers must follow these official guidelines when writing code or designing databases:

1. **Extend Before Replace**: Always attempt to extend existing components, classes, or database tables rather than replacing them.
2. **Reuse Before Duplicate**: Before introducing a new table or function, confirm that an equivalent concept does not already exist. (e.g. Workspace maps to `accounts` and Workspace Membership maps to `profiles`).
3. **Keep Business Logic Modular**: Isolate SyncWA business logic into dedicated helper classes, modules, or services. Avoid burying custom logic inside large upstream functions.
4. **Prefer Additive Database Migrations**: Only create additive migrations (adding tables, columns, indexes). Avoid destructive operations (dropping columns, renaming tables) that break upstream code.
5. **Avoid Unnecessary Refactoring of Upstream Code**: Refactoring upstream files "for style" or "cleanliness" makes future merges extremely difficult. Accept the style of upstream code inside upstream folders.
6. **Keep SyncWA Modules Isolated**: Ensure that marketing or platform code is self-contained. Importing dashboard modules into marketing components is allowed, but dashboard code must never import platform administration modules.

---

## 9. Route Group Strategy

The Next.js Application Router utilizes route groups to divide the codebase into logical sub-applications:

```text
src/app/
  ├── (marketing)  →  Public marketing website (pages, terms, privacy)
  ├── (auth)       →  Shared authentication flows (login, signup)
  ├── (dashboard)  →  Customer CRM Workspace (inbox, contacts, sales)
  └── (admin)      →  Platform CRM / Owner Portal (leads, provisioning)
```

Each route group represents a clean separation of concerns. During the MVP phase, this structure keeps the codebase unified in a single repository, minimizing deployment overhead. However, the logical isolation of route groups is designed to make future physical decoupling straightforward.

---

## 10. Future Platform Architecture

The long-term platform vision separates each route group into independent, micro-frontends or microservice deployments sharing a unified infrastructure:

```text
                  [Public Client Request]
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    Marketing Website   Customer CRM     Platform CRM
      (syncwa.com)    (app.syncwa.com) (admin.syncwa.com)
            │                │                │
            └────────────────┼────────────────┘
                             ▼
              [Unified Database & Auth Layer]
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     Shared Components             Shared Business Logic
```

By enforcing strict folder ownership and route group boundaries today, we preserve the path to this decoupled cloud architecture.

---

## 11. Database Evolution Strategy

Database modifications must preserve multi-tenant stability and avoid name collisions.

- **Audit First**: Before submitting any database migration, developers must execute a database architecture audit to identify reusable tables, evaluate RLS impacts, and ensure naming consistency.
- **Prefer Extensions**: If a business concept is already represented in the schema, extend the existing table. (e.g., Add status, trial expiry, subscription mapping, and onboarding flags to the `accounts` table instead of creating a `workspaces` table).
- **Group by Platform Domains**: New tables must be grouped into one of the official Platform Domains:

```text
Platform Domains
  ├── Website Domain               (platform_leads, lead_activities, tags)
  ├── Customer Management Domain   (sales pipelines, demo tracking)
  ├── Workspace Domain             (workspace status, onboarding)
  ├── Subscription Domain          (plans, tiers)
  ├── Billing Domain               (invoices, payments, receipts)
  ├── Support Domain               (tickets, case history)
  ├── Analytics Domain             (system metrics, retention telemetry)
  ├── Administration Domain        (feature flags, operator access control)
  └── Integration Domain           (integration registry, API scopes)
```

---

## 12. Source of Truth Documents

Documentation should have clearly defined responsibilities to avoid conflicting guidelines:

```text
                   [SWSD]
     Product, Business & Website Strategy
                     │
                     ▼
       [SYNCWA_CUSTOMIZATION_GUIDE]
           Engineering Governance
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   [Tech Arch Doc]       [Database Domain Model]
```

- **SyncWA Website Strategy Document (SWSD)**: Governs product positioning, conversion funnels, brand guidelines, and page-by-page website copy. Owned by Product and Brand leadership.
- **SyncWA Customization Guide (this document)**: Governs engineering practices, fork maintenance, folder boundaries, and coding principles. Owned by Engineering leadership.
- **Technical Architecture Document (Future)**: Outlines deployment layout, cloud providers, and network topology.
- **Database Domain Model (Future)**: Explains tables, indexes, schemas, and RLS policies in detail.

---

## 13. Development Workflow

Documentation must always precede implementation. This prevents developers from writing redundant code or introducing architectural drift:

```text
Business Discussion
        │
        ▼
Strategy Document Update (SWSD / Guide)
        │
        ▼
Architecture Review & Database Audit
        │
        ▼
Database Migration Changes (if any)
        │
        ▼
Backend API & Service Development
        │
        ▼
Frontend Component & UI Implementation
        │
        ▼
Automated & Manual Testing
        │
        ▼
Deployment
        │
        ▼
Documentation Post-Mortem Update (if required)
```

By ensuring the strategy and architecture are updated first, we verify that the proposed changes adhere to the customization philosophy before any code is written.

---

## 14. Upstream Merge Rules

When incorporating upstream commits, developers must strictly adhere to the following rules:

1. **No Overwrites**: Never overwrite or delete SyncWA-specific route groups (`(marketing)`, `(admin)`) or domain-isolated helper files.
2. **Manual Review Required**: Every line of incoming upstream code must be manually reviewed. Do not run automated git merges directly on the production branch.
3. **Keep Modules Isolated**: If upstream code requires changes in core configurations (e.g. webpack, tailwind, tsconfig), ensure the changes do not disrupt the build systems of the other sub-applications.
4. **Prefer Extension Points**: If an upstream file must be modified to support downstream features, wrap the modification in an extension hook or modular helper rather than embedding logic inline.
5. **Verify Security**: After every merge, verify that Row Level Security (RLS) and the `is_account_member` helper policies remain intact on all tables.
6. **Mandatory Post-Merge Testing**: Run the full test suite and verify contact form persistence before deploying merged branches.

---

## 15. Long-Term Vision

Over time, SyncWA will gradually diverge into its own commercial SaaS business platform. We do not seek to remain identical to the upstream repository. The goal is to evolve responsibly.

By maintaining clean route group boundaries, respecting folder ownership, extending existing database entities, and performing architecture audits before writing migrations, we guarantee that SyncWA will scale into a premium commercial SaaS platform while retaining the option to incorporate upstream improvements whenever feasible.

---

*This document is a permanent source of truth for the SyncWA engineering team.*
