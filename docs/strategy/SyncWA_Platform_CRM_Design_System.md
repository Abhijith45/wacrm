# SyncWA Platform CRM Design System (PCDS)

**Version:** 1.0  
**Status:** Source of Truth (Design & UX Authority)  
**Owner:** Product Design and UX Strategy  
**Last Updated:** 2026-08-04  
**Primary Audience:** UI/UX designers, frontend engineers, product managers, and QA specialists  

---

## Table of Contents

1. [Document Purpose](#1-document-purpose)
2. [Design Philosophy](#2-design-philosophy)
3. [Layout System](#3-layout-system)
4. [Navigation System](#4-navigation-system)
5. [Page Structure](#5-page-structure)
6. [Dashboard Design](#6-dashboard-design)
7. [Tables](#7-tables)
8. [Forms](#8-forms)
9. [Detail Pages](#9-detail-pages)
10. [Empty States](#10-empty-states)
11. [Status System](#11-status-system)
12. [Typography](#12-typography)
13. [Spacing System](#13-spacing-system)
14. [Component Library](#14-component-library)
15. [Icons](#15-icons)
16. [Colors](#16-colors)
17. [Interaction Patterns](#17-interaction-patterns)
18. [Responsive Behavior](#18-responsive-behavior)
19. [Accessibility](#19-accessibility)
20. [Performance](#20-performance)
21. [Platform Module Guidelines](#21-platform-module-guidelines)
22. [Future Expansion](#22-future-expansion)

---

## 1. Document Purpose

This document defines the official **Platform CRM Design System (PCDS)** for SyncWA. It serves as the single source of truth for the user interface (UI) and user experience (UX) standards of the internal Platform CRM (Owner Portal).

### 1.1 Document Relationships
The PCDS operates in coordination with the other project "Source of Truth" documents:
- **SyncWA Website Strategy Document (SWSD)**: Governs product lifecycle strategy and corporate messaging.
- **SyncWA Website Design System (WSDS)**: Governs public-facing styles, marketing visual assets, and public font tokens.
- **SyncWA Engineering Standards**: Governs directory structures, database evolution, and programming paradigms.

The PCDS does not duplicate marketing or engineering rules. It focuses exclusively on the interaction design, informational density, and components required to build internal administrative workflows for SyncWA operators.

---

## 2. Design Philosophy

The Platform CRM is an internal business utility used exclusively by SyncWA employees (Founders, Administrators, Sales, Support, Finance, and Operations). It is not a marketing tool. The visual design must prioritize operational efficiency and reliability over decorative graphics.

Core design principles:
- **Professional**: Visual layouts must look authoritative, functional, and organized.
- **Minimal**: Use flat borders, crisp edges, and flat backgrounds. Avoid heavy shadows, soft glassmorphism, or complex gradients.
- **Fast**: The interface must load instantly and respond immediately to user input. High readability allows operators to scan records quickly.
- **Reliable**: Layouts must behave predictably. Form elements, navigation links, and list grids must follow consistent placement and alignment across all pages.
- **Information Dense**: Maximize useful screen space. Avoid oversized spacing or decorative graphics. Text, tables, and lists should remain compact to allow scanning complex data sets.
- **Modern**: Incorporate clean typography, semantic color codes, and high-quality, lightweight Lucide icon accents to keep the portal looking contemporary.
- **Business Focused**: Design for operational metrics, sales workflows, trial monitoring, and customer success management.

---

## 3. Layout System

The Platform CRM uses a responsive grid containing three core structural panels: a Sidebar, a Header, and a central Content Area.

```text
┌────────────────────────────────────────────────────────┐
│                        HEADER                          │
│  [Menu]  Admin > Workspaces             [Search] [Role]│
├─────────────┬──────────────────────────────────────────┤
│             │                                          │
│             │  PAGE HEADER                             │
│             │  [Title]                    [Action]     │
│             ├──────────────────────────────────────────┤
│             │                                          │
│   SIDEBAR   │  CONTENT AREA                            │
│             │  ┌────────────────────────────────────┐  │
│             │  │  Metric / Data Grid / Tables       │  │
│             │  └────────────────────────────────────┘  │
│             │                                          │
└─────────────┴──────────────────────────────────────────┘
```

- **Sidebar (Left Panel)**: Occupies a fixed 256px width. Persistent on desktop resolutions (>1024px) and collapsible into a full mobile drawer overlay on smaller viewports.
- **Header (Top Panel)**: Occupies a fixed 64px height. Contains the breadcrumb route tracking on the left, and global search, alert indicators, and operator role badges on the right.
- **Content Area (Main Panel)**: Fills the remaining viewport area. Stretches up to a maximum 1280px width (`max-w-7xl`) and wraps content inside responsive gutters (24px padding on desktop, 16px on mobile).
- **Scrolling**: The Sidebar and Content Area scroll independently. The Header remains sticky to keep breadcrumbs and search targets accessible.

---

## 4. Navigation System

Navigation in the Sidebar is grouped into functional blocks to align with operator departments:

- **Navigation Hierarchy**:
  - **Platform**: *Dashboard* (overall system metrics, health check, activity feeds).
  - **Sales**: *Platform Leads* (marketing form submissions, deal qualification pipeline).
  - **Customers**: *Customers* (paying accounts roster), *Workspaces* (provisioned databases), *Onboarding* (checklist logs).
  - **Administration**: *Settings* (global config, roles, feature flags).
- **Footer Section**: Reserved for system metadata, version trackers (`v0.8.0`), help documentation links, and active profile controls.
- **Active States**: Highlighting uses a subtle tint background (`bg-primary-soft`), bold font weights, and an accent indicator dot on the right.
- **Hover States**: Hovering over inactive links highlights the text and shifts the background color slightly (`hover:bg-muted/50`).
- **Mobile Navigation**: Toggled via a hamburger menu button in the Header, sliding in from the left as an overlay. Clicking outside or tapping the Close icon closes the drawer.

---

## 5. Page Structure

Every module in the Platform CRM must follow a standard structural layout to ensure user familiarity:

```text
Page Header (Title, Subtitle, Page Actions)
   │
   ▼
Filters & Toolbar (Search inputs, filters, date range picks)
   │
   ▼
Main Content Area (Data tables, forms, detail columns)
   │
   ▼
Footer Actions & Pagination (Selected row bulk controls, page counters)
```

1. **Page Header**: Title, description, and primary page actions (e.g. "Add Lead", "Provision Workspace").
2. **Filters & Toolbar**: Search bars and dropdown filters.
3. **Main Content**: The core layout (such as data tables, profile detail grids, or form blocks).
4. **Pagination / Footer Actions**: Page counters, row controls, and bulk operations.

---

## 6. Dashboard Design

The Admin Dashboard provides a compact summary of platform health and business operations.

- **Metric Cards**: Display KPIs (Leads, Customers, Active Workspaces, Trial Status, Growth Rates). Cards must be compact, using thin borders, small icon containers, and bold numeric displays.
- **Recent Activity**: Chronological lists showing recent lead signups, status modifications, or errors.
- **Sizing & Grid**: Metrics occupy a responsive grid (1 column on mobile, 2 on tablet, 3 or 4 on desktop). Cards must share equal heights.
- **No Charts in MVP**: MVP dashboards must rely entirely on compact, text-based KPI cards. Chart libraries are deferred to Phase 3.

---

## 7. Tables

Because the Platform CRM is built on data, tables are the primary data density element:

- **Toolbar**: A header row containing quick search filters, custom column selectors, and bulk actions.
- **Bulk Actions**: Appears when rows are selected, showing actions like "Delete Selected" or "Assign Agent" in the toolbar.
- **Columns**: Text columns align left. Numerical columns align right. Dates, badges, and actions are centered.
- **Sorting**: Interactive headers indicate sort direction via chevron icons.
- **Pagination**: A footer bar containing page sizes, total row counts, and Previous/Next nav buttons.
- **Row Actions**: A right-aligned dropdown containing details, edit parameters, deactivation toggles, or delete confirmations.
- **Status Cells**: Displayed as color-coded status badges with indicator dots to enable fast scanning.
- **Empty States**: Tables with no data must display a centered, illustration-free empty state component.

---

## 8. Forms

Forms must focus on input speed and validation clarity:

- **Spacing**: Keep inputs tightly grouped (`space-y-4` or `space-y-5`).
- **Grouping**: Split large forms into logical card sections rather than long, scrolling pages.
- **Required Fields**: Indicated by a red asterisk (`*`) next to the input label.
- **Validation**: Enforce instant visual validation borders (e.g. green for valid, red for invalid) with accompanying descriptive error messages.
- **Error Messages**: Displayed inline directly below the field in a compact, readable red text.
- **Success Messages**: Displayed as brief confirmation toasts or inline banners.
- **Multi-step Wizards**: Large administrative operations (like provisioning a new database cluster) must use step wizard timelines showing progress.

---

## 9. Detail Pages

Detail pages (e.g., viewing a specific Lead or Workspace) must use a structured two-column layout:

```text
┌──────────────────────────────────────┬────────────────────────┐
│  PRIMARY PANEL                       │  SIDEBAR SUMMARY PANEL │
│                                      │                        │
│  [Summary Metadata Header]           │  [Status Card]         │
│                                      │  [Key Owner Details]   │
│  [Tabs: Details | Timeline | Log]   │                        │
│                                      │  [Action Buttons]      │
│  ┌────────────────────────────────┐  │                        │
│  │ Active Tab View Content        │  │                        │
│  └────────────────────────────────┘  │                        │
└──────────────────────────────────────┴────────────────────────┘
```

- **Primary Panel (Left / 70% width)**: Contains general summary headers, metadata cards, tabbed views (Details, Activity Timeline, System Logs), and detail grids.
- **Sidebar Summary Panel (Right / 30% width)**: Contains status cards, assignee profiles, creation dates, quick action controls, and related records shortcuts.
- **Activity Timelines**: Append-only list showing logged calls, comments, state changes, or emails. Uses clear vertical lines connecting event icon indicators.

---

## 10. Empty States

Empty states should reassure the user and suggest the next logical step:

- **Illustration Guidelines**: Avoid large, colorful marketing illustrations. Use simple Lucide outline icons inside styled, circular borders.
- **Structure**: Title, description, and a single primary action button (e.g. "Create New Lead" or "Verify Configuration").
- **Visuals**: Keep empty states centered within section cards, with generous padding, using muted colors.

---

## 11. Status System

Statuses use semantic color-coded badges to indicate operational and lifecycle states:

| Status Type | Badge Color (Semantic) | Sample Badges | Usage |
|---|---|---|---|
| **Success / Active** | Emerald (`bg-emerald-500/10`, text-emerald) | `active`, `converted`, `qualified` | Workspace is running normally; lead has converted. |
| **Warning / Pending** | Amber (`bg-amber-500/10`, text-amber) | `trial`, `past_due`, `contacted` | Action required; payment warning. |
| **Error / Destructive** | Red (`bg-destructive/10`, text-destructive) | `suspended`, `unpaid`, `lost` | Workspace locked; payment failed; lead lost. |
| **Info / Progress** | Blue (`bg-blue-500/10`, text-blue) | `new`, `demo_scheduled` | Newly submitted lead; upcoming events. |
| **Neutral / Inactive** | Muted Grey (`bg-muted`, text-muted) | `deactivated`, `draft`, `unqualified` | Logged out; archived records. |

- **Badge Format**: Rounded pills containing a colored dot indicator on the left.
- **Tenancy Styling**: Use CSS variables representing semantic names to inherit color changes automatically.

---

## 12. Typography

Typography must prioritize readability and text density. SyncWA uses the Inter sans-serif system:

- **Heading 1**: 24px (`text-2xl`), bold. Used for page-level headers.
- **Heading 2**: 18px (`text-lg`), bold. Used for secondary section panels.
- **Heading 3**: 14px (`text-sm`), bold. Used for card headers.
- **Body Text**: 13px (`text-xs`), leading-normal. Used for descriptions, logs, and notes.
- **Table / Label Text**: 12px (`text-[12px]`), font-medium. Used for input labels and table cells.
- **Metrics Numbers**: 30px (`text-3xl`), font-black, tracking-tight.
- **Monospace Fonts**: 11px. Used for database identifiers (UUIDs), API keys, webhook payloads, and timestamps.

---

## 13. Spacing System

The spacing system enforces high density to keep related items visible in a single viewport:

- **Base Grid**: 4px scaling (e.g., 4, 8, 12, 16, 20, 24, 32, 48px).
- **Gutters**: 24px padding on desktop panels, 16px on mobile screens.
- **Card Spacing**: 24px grid gaps for dashboards, 16px padding within cards.
- **Form Spacing**: 16px vertical gaps between input fields.
- **Information Density Options**: The design targets standard density for the MVP. Future iterations may introduce a "Compact" toggle that reduces font sizes to 11px and padding to 8px.

---

## 14. Component Library

Platform CRM interfaces are built using these reusable UI primitives:

- **`AdminPageHeader`**: Unified page title and button container.
- **`MetricCard`**: Flat, interactive KPI card with variant styling.
- **`SectionCard`**: Main container for charts, lists, and forms.
- **`StatusBadge`**: Semantic badge with status dot indicator.
- **`EmptyState`**: Centered placeholder for empty records.
- **`DataTableToolbar`**: Input search and action bar for lists.
- **`PropertyGrid`**: Clean two-column metadata listing.
- **`ActivityTimeline`**: Styled list tracking log entries.
- **`ActionBar`**: Sticky bottom utility tray for page-level save or delete operations.

---

## 15. Icons

SyncWA uses the Lucide icon library. Icons must represent distinct operational actions:

- **Rules**: Icons must serve as visual aids, not decoration. Every icon must correspond to its business meaning:
  - `LayoutDashboard`: Overall system health and KPI summaries.
  - `ClipboardList`: Lead capture forms and pipeline audits.
  - `Users` / `Building2`: Client profiles and company directories.
  - `Layers` / `Server`: Active workspaces and database configurations.
  - `CheckSquare` / `PlayCircle`: Onboarding checklists and action indicators.
  - `Settings`: Operational parameters, configurations, and environment logs.
  - `Shield`: Security configurations, RLS parameters, and staff role badges.
  - `LogOut` / `X`: Navigation, overlays, and drawer close targets.

---

## 16. Colors

The color system matches SyncWA's active visual theme, utilizing CSS variables to support light, dark, and accent themes:

- **Neutral Backgrounds**: `bg-background` (dark oklch base), `bg-card` (tile card surfaces), `bg-muted` (headers, hover states).
- **Text**: `text-foreground` (white/off-white), `text-muted-foreground` (grey description labels).
- **Borders**: `border-border` (thin separator line).
- **Accent Details**: `bg-primary` (main brand accent oklch violet), `bg-primary-soft` (tinted backgrounds on pills/actives).
- **WCAG AA Compliance**: All text-to-background combinations must maintain a minimum 4.5:1 contrast ratio. Badges must use high contrast text matching their semantic color codes.

---

## 17. Interaction Patterns

- **Hover States**: Shift background colors (`bg-muted/50`) or transition border colors (`border-primary/20`) over a 200ms duration.
- **Focus Indicators**: Focused inputs must display a colored border (`border-primary`) with an outer ring shadow (`ring-1 ring-ring`).
- **Loading Indicators**: Submit buttons display a loading spinner while disabling click events.
- **Danger Confirmations**: Destructive actions (like deleting a lead or suspending a workspace) must display a confirmation dialog. The primary action button must be styled red (`bg-destructive`).
- **Toast Notifications**: Slide in from the bottom-right on desktop, and top-center on mobile. Auto-dismiss after 4 seconds.

---

## 18. Responsive Behavior

- **Desktop (>1024px)**: Sidebar is persistent. Content spans up to a maximum 1280px width (`max-w-7xl`).
- **Tablet (<1024px)**: Sidebar collapses. Content expands to fill the full width. Headers show the hamburger menu toggle.
- **Mobile (<768px)**: Sidebar behaves as an overlay drawer. Two-column detail pages stack vertically. Data tables collapse to scroll horizontally.
- **Large Displays (>1440px)**: The content area centers, preserving side borders.

---

## 19. Accessibility

- **Keyboard Navigation**: Users must be able to navigate the sidebar, forms, and tables using standard keys (Tab, Shift+Tab, Enter, Space, Escape).
- **Focus Management**: Open dialogs must trap focus. Closing a dialog returns focus to the trigger button.
- **ARIA Attributes**: Sidebar links carry `aria-current="page"` when active. Buttons must carry descriptive `aria-label` tags if they only show icons.
- **Semantic HTML**: Keep layouts accessible by using semantic tags (`<aside>`, `<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`).

---

## 20. Performance

- **Server-First Strategy**: Page routing, database audits, and initial data fetches must occur in Server Components.
- **Client Boundary**: Limit `"use client"` to interactive forms, table search bars, mobile drawers, and drop-downs.
- **Lazy Loading**: Large dashboard metrics or logs are lazy-loaded to prevent blocking initial paints.

---

## 21. Platform Module Guidelines

Every upcoming Platform CRM module must adhere to the following layout templates:

### 21.1 Platform Leads (Sprint 2.0)
- **Roster View**: Uses a standard table showing name, company, email, status badge, created_at, and assignee.
- **Detail View**: Uses the standard two-column layout: details and activity timeline on the left, status card and assignee controls on the right.

### 21.2 Workspace Management (Sprint 3.0)
- **Roster View**: Displays workspaces, workspace status, subscription standing, and onboarding progress bars.
- **Detail View**: Primary details and configuration on the left, database health indicators and action toggles (suspend/activate) on the right.

---

## 22. Future Expansion

As SyncWA evolves, the PCDS will extend to support future services:
- **Enterprise Features**: Custom tenant isolation, security dashboards, and single sign-on (SSO) settings.
- **Advanced Charts**: Visual statistics, user retention curves, and revenue growth plots.
- **Marketplace**: App stores, configuration recipes, and partner listings.

All future pages and dashboards must reuse these layout grid and component library rules to prevent visual drift.

---

*This document is the official UI/UX authority for the SyncWA Platform CRM.*
