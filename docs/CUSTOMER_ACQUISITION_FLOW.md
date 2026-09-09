# SyncWA Customer Acquisition and Onboarding Lifecycle

This document describes the customer acquisition, onboarding, and workspace provisioning workflows for the SyncWA Platform CRM in Version 1.0.

---

## 1. Customer Acquisition Model Overview

SyncWA operates as an **assisted onboarding business platform**. It is not a public self-service SaaS. Customers cannot create workspaces or accounts independently.

Instead, all new customer acquisition is channeled through a sales-assisted qualification and provisioning model:

```
Website Visitor
      ↓
Talk to Sales / Book a Demo (via Contact Form)
      ↓
Platform Lead Record Created (with Request Type)
      ↓
Qualification & Negotiation by Operators
      ↓
Customer Conversion Triggered
      ↓
Automated Workspace Provisioning
      ↓
Owner Invitation Email Sent
      ↓
Credential Setup (Password Recovery / Reset)
      ↓
Active Login & Onboarding Checklist
```

---

## 2. Removing Public Registration

To enforce this business model, public registration has been removed and gated at multiple layers:

1. **CTA Removal**: All public "Start Free", "Register", or "Create Account" links on marketing pages (Homepage, Features, Pricing, Header, Footer) have been replaced with **Talk to Sales** or **Book a Demo**, routing directly to the contact page (`/contact`).
2. **Path Gating**: The `/signup` route is gated in `src/proxy.ts`. Direct access to `/signup` by public visitors is blocked, and they are redirected to `/login`.
3. **Invitation Exceptions**: Teammates invited to join existing workspaces are sent a unique invitation link (`/join/[token]`). When they click **Create account & join**, they are sent to `/signup?invite=[token]`. The gating middleware detects the `invite` query parameter and permits access, allowing them to register their credentials securely.

---

## 3. Intelligent Contact Form & Leads Intake

The `/contact` page form acts as the intake engine for new platform leads. It requires visitors to classify their inquiry via a dropdown field: **"How can we help you?"**

### Request Type Classification Mapping
Each dropdown option selected by the user maps to a database `request_type` string in the `platform_leads` table:

| Frontend Dropdown Label | Backend DB Value | Description |
| :--- | :--- | :--- |
| **Book a Demo** | `DEMO` | Visitor wants a product walkthrough. |
| **Start Using SyncWA** | `ONBOARDING` | Visitor wants to set up a new workspace. |
| **General Enquiry** | `GENERAL` | General questions about capabilities or hosting. |
| **Partnership** | `PARTNERSHIP` | Business collaboration or agency questions. |
| **Technical Question** | `TECHNICAL` | Questions regarding API limits, webhook setup, etc. |

---

## 4. Database Schema and Constraints

The `platform_leads` table stores the request type classification in the `request_type` column:
- **Type**: `TEXT NOT NULL`
- **Default**: `'GENERAL'`
- **Constraint**: `CHECK (request_type IN ('DEMO', 'ONBOARDING', 'GENERAL', 'PARTNERSHIP', 'TECHNICAL'))`

---

## 5. Platform CRM Lead Dashboard & Processing

Once a lead is registered, Platform Admins manage the lifecycle inside the Platform CRM:

1. **Dashboard Metrics**: Telemetry cards display counts of `Demo requests`, `Onboarding requests`, and `General enquiries` alongside overall lead statistics.
2. **Filtering and Sorting**: Admins can search, sort, and filter the leads directory by `Request Type` to quickly isolate high-priority demo or onboarding queries.
3. **Lead Details**: The detailed view for each lead displays the request type badge prominently in the header and details panel.
4. **Qualification & Conversion**: If qualified, the admin clicks **Convert to Customer** to trigger the workspace provisioning orchestrator, creating the isolated tenant workspace and sending the owner onboarding welcome email.
