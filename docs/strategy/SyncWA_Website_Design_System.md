# SyncWA Website Design System & UI Specification (WSDS)

Version: 1.0  
Status: Active Specification  
Last Updated: 2026-08-03  
Owner: Brand Design and Frontend Engineering Teams  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Principles](#2-design-principles)
3. [Visual Identity](#3-visual-identity)
4. [Layout System](#4-layout-system)
5. [Grid System](#5-grid-system)
6. [Spacing System](#6-spacing-system)
7. [Typography](#7-typography)
8. [Color System](#8-color-system)
9. [Elevation](#9-elevation)
10. [Borders](#10-borders)
11. [Radius](#11-radius)
12. [Shadows](#12-shadows)
13. [Icons](#13-icons)
14. [Illustrations](#14-illustrations)
15. [Screenshot Guidelines](#15-screenshot-guidelines)
16. [Components Specification](#16-components-specification)
17. [Forms & Input Elements](#17-forms--input-elements)
18. [Tables & Data Grids](#18-tables--data-grids)
19. [Navigation Strategy](#19-navigation-strategy)
20. [Responsive Design & Breakpoints](#20-responsive-design--breakpoints)
21. [Accessibility (a11y) Guidelines](#21-accessibility-a11y-guidelines)
22. [Motion & Interaction Patterns](#22-motion--interaction-patterns)
23. [Empty States](#23-empty-states)
24. [Error States](#24-error-states)
25. [Loading States & Skeletons](#25-loading-states--skeletons)
26. [CTA Strategy](#26-cta-strategy)
27. [Content Hierarchy](#27-content-hierarchy)
28. [Design Do's & Don'ts](#28-design-dos--donts)
29. [Future Expansion Guidelines](#29-future-expansion-guidelines)
30. [Governance & Maintenance](#30-governance--maintenance)
31. [Design Improvement Recommendations](#31-design-improvement-recommendations)

---

## 1. Design Philosophy

The SyncWA Website Design System (WSDS) extends the visual and interaction patterns of the core application to the public marketing pages. The design philosophy centers on **Product-First Professionalism**.

```
    [Professionalism] ──► Minimalist Interface (Low Cognitive Load)
           │
           ├──► Product-as-Hero (Factual App Interface Visuals)
           │
           └──► Trust-First Presentation (Clean Contrast & Structure)
```

The interface must present the application directly. Abstract visual ornaments, three-dimensional floating shapes, and heavily stylized marketing illustrations are excluded in favor of high-fidelity product screenshots, interactive dashboards, and realistic workflow mockups. The public website must feel like a natural extension of the product; a user transiting from a landing page to the login workspace should experience perfect visual continuity.

---

## 2. Design Principles

### 2.1 Product as Hero
The actual application interface is the primary asset. Feature sections must lead with contextual, high-definition app captures rather than abstract icons or conceptual graphics.

### 2.2 High Information Density
SyncWA is a productivity tool, not a lifestyle portal. Information must be structured compactly to provide immediate scanning capability. Avoid excessive, empty whitespace that forces unnecessary scrolling.

### 2.3 Business Outcomes First
Visual elements must align with customer value. Every screenshot or diagram must illustrate a solved pain point (e.g., showing the team assignment queue to answer the question: *"How do agents collaborate on a single number?"*).

### 2.4 Restrained Motion
Animations are restricted to subtle micro-interactions (such as component focus changes, hover transitions, and drawer placements). Autoplay carousels, scrolling text strings, and complex entrance animations are prohibited.

---

## 3. Visual Identity

The brand identity relies on **structural containment** and **clean typography**. Panels and cards use clear border lines rather than diffuse drop shadows. Visual accents are delivered through the default brand color (Violet), with support for the application's secondary themes.

---

## 4. Layout System

The website layout uses a structured vertical flow with a max container width.

* **Max Width Container:** `1280px` (`max-w-7xl`)
* **Default Horizontal Padding:**
  * Desktop (lg+): `24px` (`px-6`)
  * Mobile (sm): `16px` (`px-4`)

### Basic Section Page Structure
```
+--------------------------------------------------------+
|                      Navbar                            |
+--------------------------------------------------------+
|                                                        |
|                    Hero Section                        |
|                                                        |
+--------------------------------------------------------+
|                                                        |
|                 Pillars Section                        |
|                                                        |
+--------------------------------------------------------+
|                                                        |
|                Feature Walkthrough                     |
|                                                        |
+--------------------------------------------------------+
|                      Footer                            |
+--------------------------------------------------------+
```

---

## 5. Grid System

Layout grids follow a 12-column flex system.

| Breakpoint | Columns | Container Max Width | Margin | Gutter |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop (lg+)** | 12 | 1200px | Auto | 24px |
| **Tablet (md)** | 8 | 768px | Auto | 16px |
| **Mobile (sm)** | 4 | 100% | 16px | 12px |

---

## 6. Spacing System

SyncWA uses a consistent 4px-based spacing ladder.

| Token | Pixels | Tailwind Value | Purpose |
| :--- | :--- | :--- | :--- |
| `spacing-xs` | 4px | `p-1` / `m-1` | Inline elements padding, tags margins. |
| `spacing-sm` | 8px | `p-2` / `m-2` | Inputs internal padding, dropdown list items. |
| `spacing-md` | 16px | `p-4` / `m-4` | Card padding, small grid margins. |
| `spacing-lg` | 24px | `p-6` / `m-6` | Standard container padding, form groupings. |
| `spacing-xl` | 32px | `p-8` / `m-8` | Section vertical blocks spacing. |
| `spacing-2xl`| 48px | `py-12` | Large section headers spacing. |
| `spacing-3xl`| 64px | `py-16` | Hero sections vertical spacing. |

---

## 7. Typography

The primary typography relies on **Inter** for sans-serif components, and **Geist Mono** for code and technical parameters.

### Font System Table

| Scale Role | Font Size (px) | Line Height (px) | Weight | Tailwind Equivalent |
| :--- | :--- | :--- | :--- | :--- |
| **Display Header** | 48px | 56px | Bold (700) | `text-5xl font-bold tracking-tight` |
| **Primary Header (H1)** | 36px | 44px | Bold (700) | `text-4xl font-bold tracking-tight` |
| **Section Header (H2)** | 24px | 32px | Semibold (600) | `text-2xl font-semibold` |
| **Subhead (H3)** | 20px | 28px | Medium (500) | `text-xl font-medium` |
| **Lead Body** | 18px | 28px | Regular (400) | `text-lg text-muted-foreground` |
| **Standard Body** | 14px | 20px | Regular (400) | `text-sm text-foreground` |
| **Muted Copy / Small**| 12px | 16px | Regular (400) | `text-xs text-muted-foreground` |

---

## 8. Color System

SyncWA implements orthogonal light/dark surface modes combined with 5 primary theme color swatches. Color settings use `OKLCH` variables for accurate contrast calculations.

### 8.1 Base Surface Modes

#### Dark Mode Surfaces (Default Identity)
* **Background:** `oklch(0.13 0.01 260)`
* **Foreground:** `oklch(0.985 0 0)`
* **Card Base:** `oklch(0.18 0.01 260)`
* **Card-2 (Hover Tiles):** `oklch(0.205 0.01 260)`
* **Muted Background:** `oklch(0.22 0.01 260)`
* **Muted Foreground:** `oklch(0.65 0.01 260)`
* **Borders & Inputs:** `oklch(0.28 0.01 260)`

#### Light Mode Surfaces (Opt-In Alternative)
* **Background:** `oklch(0.99 0.002 260)`
* **Foreground:** `oklch(0.21 0.01 260)`
* **Card Base:** `oklch(1 0 0)`
* **Card-2 (Hover Tiles):** `oklch(0.985 0.002 260)`
* **Muted Background:** `oklch(0.967 0.003 260)`
* **Muted Foreground:** `oklch(0.52 0.015 260)`
* **Borders & Inputs:** `oklch(0.922 0.004 260)`

---

### 8.2 Primary Accents

#### Violet Accent (Brand Default)
* `--primary`: `oklch(0.526 0.247 293)`
* `--primary-foreground`: `oklch(0.985 0 0)`
* `--primary-hover`: `oklch(0.6 0.22 293)`
* `--primary-soft`: `oklch(0.526 0.247 293 / 0.12)`

#### Secondary Accents (Product Support Options)
* **Emerald (WhatsApp Theme):** `oklch(0.62 0.16 162)`
* **Cobalt (B2B SaaS Blue):** `oklch(0.585 0.2 254)`
* **Amber (Support Swatch):** `oklch(0.745 0.16 65)`
* **Rose (D2C Lifestyle Brand):** `oklch(0.645 0.22 16)`

---

## 9. Elevation

SyncWA uses flat containment borders over high-shadow offsets. Elevation is represented by shifts in surface colors rather than heavy shadow styling.

```
[Layer 0: Background] ──► oklch(0.13 0.01 260) (Dark background)
        │
        └──► [Layer 1: Cards & Panels] ──► oklch(0.18 0.01 260) (Card container)
                │
                └──► [Layer 2: Popovers / Dialogs] ──► oklch(0.205 0.01 260) (Popover popup)
```

---

## 10. Borders

* **Default Border Stroke:** `1px` (`border`)
* **Default Border Style:** `solid`
* **Default Border Color:** `oklch(0.28 0.01 260)` (Dark Mode) / `oklch(0.922 0.004 260)` (Light Mode)

---

## 11. Radius

Corner radiuses scale relative to the base token `--radius` (defined as `0.625rem` or `10px`).

| Token | Calculation | Pixel Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| `radius-sm` | `calc(var(--radius) * 0.6)` | 6px | Tags, badges, inner input boundaries. |
| `radius-md` | `calc(var(--radius) * 0.8)` | 8px | Buttons, text field inputs, list selections. |
| `radius-lg` | `var(--radius)` | 10px | Standard card containers, drawers. |
| `radius-xl` | `calc(var(--radius) * 1.4)` | 14px | Main dialog cards, visual page blocks. |

---

## 12. Shadows

* **Default State:** No shadows.
* **Popup Card Shadows:** Flat borders are preferred, but dialog overlays use a subtle dark blur to separate overlapping layers:
  * `box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.4)`

---

## 13. Icons

* **Library:** Lucide React.
* **Stroke Width:** `1.5px` (default)
* **Default Size:** `16px` (`w-4 h-4`) inside content; `20px` (`w-5 h-5`) for main triggers/headers.
* **Color:** Matches the surrounding text color (`text-foreground` or `text-muted-foreground`).

---

## 14. Illustrations

* **Guidelines:** Conceptual drawings are omitted on the homepage. If a placeholder illustration is necessary (such as in an empty state or error panel), it must use vector-drawn line doodles matching the style of [inbox-doodle.svg](file:///c:/Users/Abhijeet%20Rawat/Desktop/wacrm/public/inbox-doodle.svg).

---

## 15. Screenshot Guidelines

Product screenshots are the primary design asset. They must follow these rules:

1. **Clean UI State:** Hide personal details, phone numbers, and auth hashes. Use realistic mock data (e.g. `Jane Doe`, `VIP Tag`, `wamid.123...`).
2. **Theme Match:** All screenshots must be captured in the default Dark Mode with the Violet accent theme to align with the brand.
3. **Aspect Ratios:**
   * Main Dashboards: `16:9` widescreen aspect ratio.
   * Mobile panels or sidebars: `4:5` vertical aspect ratio.
4. **Resolution:** Render at 2x resolution to keep text crisp on high-density displays (Retina screens).
5. **No Device Wrappers:** Avoid adding laptop or phone frame wraps around screenshots; use simple border lines (`1px border border-border`) with a subtle corner radius (`radius-lg`).

---

## 16. Components Specification

---

### Navigation Bar
* **Purpose:** Handles top-level page routing and displays branding.
* **Usage:** Sticky header container at the top of every page.
* **Do:** Keep branding text clear, lock standard routes in place, and display the primary CTA button.
* **Don't:** Add multiple drop-down menus or clutter the header with secondary links.
* **Spacing:** Height `56px` (`h-14`), horizontal padding `spacing-lg`.
* **Responsive Behavior:** Switches to a mobile hamburger toggle at the `lg` breakpoint (`1024px`).
* **Interaction Behavior:** Sticky scrolling with a slight background color change (`bg-background/80 backdrop-blur`).
* **Accessibility:** Role `navigation`, keyboard focus on all menu items, and proper ARIA labels.

---

### Hero Container
* **Purpose:** First section fold introducing the product and value proposition.
* **Usage:** Single top-level block on the homepage.
* **Do:** Lead with a bold tagline, outline the core value proposition in 2 sentences, and display the primary CTA button.
* **Don't:** Clutter the block with multiple secondary CTAs or abstract illustrations.
* **Spacing:** Vertical padding `spacing-3xl`.
* **Responsive Behavior:** Stack headings vertically on mobile viewports.
* **Interaction Behavior:** Flat layouts, micro-transitions on CTA hover.
* **Accessibility:** Focusable CTA buttons with clear text.

---

### Feature Cards
* **Purpose:** Outline specific product modules or capabilities.
* **Usage:** Render in groups of 3 or 4 inside modular grids.
* **Do:** Display a single clear icon, a 1-line title, and a 2-sentence description.
* **Don't:** Overload cards with details; link to the respective feature page instead.
* **Spacing:** Internal padding `spacing-md`.
* **Responsive Behavior:** Col-span shifts from 3 columns (desktop) to 1 column (mobile).
* **Interaction Behavior:** Elevate background surface on hover (change card color from `bg-card` to `bg-card-2`).
* **Accessibility:** Accessible screen reader tags on header links.

---

### Pricing Cards
* **Purpose:** Outline hosting choices and billing models.
* **Usage:** Grouped side-by-side on the pricing page.
* **Do:** Highlight the zero-licensing-fees benefit, list hosting dependencies, and display the primary CTA.
* **Don't:** Hide hidden costs or meta-conversations fees; keep all pricing transparent.
* **Spacing:** Internal padding `spacing-lg`.
* **Responsive Behavior:** Stack vertically on mobile screen widths.
* **Interaction Behavior:** Focus accent border styling on the recommended plan card.
* **Accessibility:** High-contrast headings and pricing numbers.

---

### Accordion / FAQ List
* **Purpose:** Answers common customer questions on pricing, setup, and phone numbers.
* **Usage:** Grouped list at the bottom of the homepage or pricing page.
* **Do:** Keep answers concise and factual.
* **Don't:** Link questions to empty text fields or use complex nested layouts.
* **Spacing:** Vertical padding `spacing-md` per accordion header.
* **Responsive Behavior:** Adapts smoothly across all viewport widths.
* **Interaction Behavior:** Expand/collapse panels with micro-transitions.
* **Accessibility:** Proper keyboard triggers (`Space` / `Enter` to expand), ARIA attributes (`aria-expanded`).

---

### Buttons
* **Purpose:** Primary trigger element for user actions and routing.
* **Usage:** Used in headers, forms, and landing pages.
* **Do:** Keep labels concise, use contrast to indicate priority, and maintain clear focus borders.
* **Don't:** Mix multiple styles or stack primary buttons close together.
* **Spacing:** Vertical padding `8px` (`py-2`), horizontal padding `16px` (`px-4`).
* **Responsive Behavior:** Stretch to full width on mobile viewports.
* **Interaction Behavior:** Switch background to `bg-primary-hover` on hover; show focus rings on active tab state.
* **Accessibility:** Support keyboard focus, clear contrast, and unique IDs.

---

### empty State Panel
* **Purpose:** Rendered when no database entries are found (e.g. empty inbox queue).
* **Usage:** Centered illustration panel.
* **Do:** Display a line doodle graphic, a 1-line explanation, and a CTA action button.
* **Don't:** Leave panels blank or use generic graphics.
* **Spacing:** Padding `spacing-xl`.
* **Responsive Behavior:** Adapts smoothly across all viewports.
* **Interaction Behavior:** Flat layout with focus transitions on CTA buttons.
* **Accessibility:** Include descriptive alternative text for vectors.

---

## 17. Forms & Input Elements

Forms must prioritize high readability and clean keyboard navigation.

```
[Label: Name]
  ▼ (spacing-xs: 4px)
[Input Text Field ──────────────────────────] ◄── Focus state displays active border color
  ▼ (spacing-sm: 8px)
[Helper/Validation text]
```

### Form Design Standards
* **Input Height:** `36px` (`h-9`) for standard forms; `40px` (`h-10`) for search headers.
* **Focus State:** Adds a thin outline using the active theme color (`--ring`).
* **Validation Colors:** 
  * Errors: `oklch(0.577 0.245 27.325)` (Red border and text).
  * Warnings: Amber border and text.

---

## 18. Tables & Data Grids

Tables (used in lists of contacts, API keys, or campaign logs) must structure information clearly.

### Table Component Grid Specs
* **Header Height:** `40px` (`h-10`), using muted text styling (`text-xs font-semibold uppercase tracking-wider`).
* **Row Height:** `48px` (`h-12`) for list rows.
* **Borders:** Thin divider line (`1px border-b border-border`) between rows.
* **Hover State:** Row background changes to `bg-card-2` on hover.

---

## 19. Navigation Strategy

* **Desktop Header Navigation:** Renders primary pages (Features, Pricing, Docs, API).
* **Mobile Sidebar Navigation:** Slides in from the left on mobile viewports, using drawer triggers.
* **Keyboard Focus Navigation:** Users can navigate headers, sidebar menus, and form fields using `Tab` key routing.

---

## 20. Responsive Design & Breakpoints

SyncWA follows a desktop-first productivity design, with layout adjustments for mobile devices.

| Breakpoint Name | Screen Width | Layout Shift Behavior |
| :--- | :--- | :--- |
| **Mobile (`sm`)** | `< 640px` | Full-width buttons, stacked columns, slide-in sidebar menus. |
| **Tablet (`md`)** | `640px - 1024px` | 2-column grid card groups, collapsed table columns. |
| **Desktop (`lg`)** | `1024px - 1280px` | 12-column grids, fixed sidebars, visible main navigation headers. |
| **Widescreen (`xl`)**| `> 1280px` | Locked container width at 1280px, auto margins. |

---

## 21. Accessibility (a11y) Guidelines

The design system adheres to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications:

1. **Color Contrast:** All text must maintain a minimum contrast ratio of 4.5:1 against its background color (checked using OKLCH coordinate bounds).
2. **Keyboard Focus Indicator:** Focus states must display a visible outline using the active theme color:
   * `outline: 2px solid var(--ring)`
3. **Screen Readers:** All icon triggers must include `aria-label` attributes. Product screenshots must use descriptive alternative text.
4. **Touch Targets:** Interactive buttons on mobile screens must have a minimum target size of `44px x 44px`.

---

## 22. Motion & Interaction Patterns

SyncWA uses simple, functional CSS micro-interactions:
* **Default Transitions:** `transition-colors duration-200 ease-out`.
* **Hover State Transitions:**
  * Primary Buttons: Background changes to hover values (`primary-hover`).
  * Secondary Cards: Elevate background surface on hover (change color from `bg-card` to `bg-card-2`).
* **Motion Reduction:** Honor user preference settings by bypassing layout animations if `prefers-reduced-motion` is enabled.

---

## 23. Empty States

* **Component:** visual centered box.
* **Content:** Uses a decorative line vector [inbox-doodle.svg](file:///c:/Users/Abhijeet%20Rawat/Desktop/wacrm/public/inbox-doodle.svg), a 1-line description, and a single CTA button.
* **Do:** Keep empty states helpful and provide a clear CTA to add content.
* **Don't:** Leave panels blank or use complex layouts.

---

## 24. Error States

* **Design:** Highlight validation errors using red borders and helper text:
  * Border color: `oklch(0.577 0.245 27.325)`
* **Content:** Display copy-pasteable error logs for developers in technical pages.
* **Accessibility:** Link error text to inputs using the `aria-describedby` attribute.

---

## 25. Loading States & Skeletons

* **Component:** Skeleton containers.
* **Design:** Use layout templates with a subtle pulse animation:
  * `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`
* **Spacing:** Skeleton placeholders must match the exact height and width of the loading component (e.g. metric cards).

---

## 26. CTA Strategy

* **Primary CTAs:** Focus visitor actions on one main goal ("Start Free Trial").
* **Secondary CTAs:** Provide path options for evaluating visitors ("See Features", "Book Demo").
* **Placement:** Nav headers, hero sections, feature sections, trust sections.

---

## 27. Content Hierarchy

1. **Category:** Lead with the product category header.
2. **Tagline:** Summarize the core value proposition.
3. **Pillars:** Detail supporting features (Inbox, CRM, visual Chatbots, AI).
4. **Trust:** Highlight security compliance details (RLS, GCM encryption).
5. **CTA:** End with primary call-to-actions.

---

## 28. Design Do's & Don'ts

### Do
* Use high-definition product screenshots to explain features.
* Maintain clean color contrast in both dark and light modes.
* Standardize corner radiuses relative to the base token `--radius`.
* Rely on flat borders for component containment.

### Don't
* Use abstract hero illustrations or 3D shapes.
* Introduce different fonts; keep typography centered on Inter.
* Add multiple primary CTA buttons close together.
* Clutter layouts with excessive white space or decorative animations.

---

## 29. Future Expansion Guidelines

As SyncWA expands (e.g., adding integration pages, blogs, help centers, or API pages), designs must build on the existing system. Derive new patterns from existing templates (such as card grids or table dividers) rather than creating new components.

---

## 30. Governance & Maintenance

* **System Owner:** Brand design and frontend engineering teams.
* **Modifications:** Alterations to spacing scales, typography variables, or color values must be logged in `CHANGELOG.md` and updated in `globals.css` and the WSDS spec.

---

## 31. Design Improvement Recommendations

Based on a review of the existing codebase, the following design improvements are recommended:

### Recommendation 1: Consolidate Typography Classes
* **Current Situation:** Tailwind text classes are applied directly across various components.
* **Issue:** Can lead to minor differences in font weights and line heights.
* **Recommendation:** Create semantic typography utilities in CSS (e.g., `.text-display-header`, `.text-body-lead`) and map them to tailwind typography variables.
* **Reasoning:** Standardizes typography formatting across the application and website.
* **Expected UX Improvement:** Cleaner font layouts and easier visual hierarchy scanning.

### Recommendation 2: Consolidate Theme Accents
* **Current Situation:** Accents are set directly using custom oklch color variables in `globals.css`.
* **Issue:** Changes to theme values require editing values across multiple CSS lines.
* **Recommendation:** Standardize theme colors under a single CSS accent mapping block using theme ids.
* **Reasoning:** Reduces styling duplication and makes it easier to add new themes.
* **Expected UX Improvement:** Consistent color matching across the application's dark and light modes.

### Recommendation 3: Standardize Skeleton Dimensions
* **Current Situation:** Skeletons have custom dimensions defined inside page templates.
* **Issue:** Skeletons can shift slightly when components load, causing minor layout shifts.
* **Recommendation:** Create reusable skeleton components with matching dimensions to prevent layout shifts.
* **Reasoning:** Ensures skeletons render at the exact height and width of the loading component.
* **Expected UX Improvement:** Smoother page transitions and improved loading experience.

---
# SyncWA Homepage Content Specification

## Page Goal

The homepage should help first-time visitors understand:

- What SyncWA is.
- What business problems it solves.
- Why businesses should choose it.
- What major capabilities it provides.
- How to get started.

The homepage should communicate the product within the first 10–15 seconds.

---

# Hero Section

## Badge

✨ Modern Business Platform

---

## Headline

Manage Your Business on WhatsApp — From One Platform

---

## Subheading

SyncWA combines CRM, WhatsApp communication, sales, marketing, automation, and analytics into one unified workspace, helping your team manage customers more efficiently.

---

## Primary CTA

Start Free

---

## Secondary CTA

Book Demo

---

## Hero Visual

Large Dashboard Screenshot

The screenshot should showcase

- Dashboard
- Navigation
- Analytics
- Recent Conversations
- Active Leads

---

# Trusted For

## Section Title

Built for Growing Businesses

## Description

Whether you're managing sales, customer support, or marketing, SyncWA helps your team stay connected and organized.

## Cards

Sales Teams

Customer Support

Education Consultants

Real Estate

Agencies

Small Businesses

---

# Problems We Solve

## Section Title

Managing Customers Shouldn't Be Complicated

## Intro

Many businesses rely on WhatsApp every day—but managing conversations across multiple people quickly becomes difficult.

SyncWA helps organize customer communication, sales, and team collaboration in one place.

---

## Problem Cards

### Multiple employees replying from different phones

↓

Centralize conversations with a shared team inbox.

---

### Customer information scattered everywhere

↓

Maintain complete customer profiles and interaction history.

---

### Manual follow-ups consume valuable time

↓

Automate repetitive tasks and reminders.

---

### Difficult to track sales opportunities

↓

Manage leads and monitor your sales pipeline.

---

### Limited visibility into team performance

↓

Access reports and analytics from one dashboard.

---

# Product Overview

## Title

Everything You Need to Manage Customer Relationships

## Description

SyncWA combines multiple business capabilities into one integrated platform.

## Pillars

Communication

CRM

Sales

Marketing

Automation

Analytics

Team Collaboration

---

# Core Features

## Section Title

Designed for Modern Teams

Feature Cards

### Shared Team Inbox

Manage WhatsApp conversations collaboratively.

---

### Contact Management

Keep customer information organized.

---

### Lead Management

Track every opportunity from enquiry to conversion.

---

### Broadcast Campaigns

Reach customers efficiently using approved templates.

---

### Workflow Automation

Reduce repetitive work through automation.

---

### Reports & Analytics

Understand business performance with actionable insights.

---

### Roles & Permissions

Give every team member the right level of access.

---

### AI Assistance

Improve productivity using intelligent assistance.

(Only display if implemented.)

---

# Product Showcase

## Title

See SyncWA in Action

## Description

Real product screenshots from the application.

Required Screens

Dashboard

Inbox

Lead Details

Campaign

Automation

Analytics

---

# Why SyncWA

## Title

Why Businesses Choose SyncWA

Cards

One platform instead of multiple tools

Improve team collaboration

Respond faster to customers

Track every customer interaction

Reduce manual work

Grow with confidence

---

# Frequently Asked Questions

What is SyncWA?

Who is SyncWA designed for?

Can multiple team members use one WhatsApp number?

Can I manage customer information?

Can I automate routine tasks?

How do I get started?

---

# Final CTA

## Headline

Start Building Better Customer Relationships

## Description

Manage conversations, organize customers, and grow your business from one unified platform.

Primary Button

Start Free

Secondary Button

Contact Sales

---

# Footer

Navigation

Features

Pricing

Contact

Login

Privacy Policy

Terms of Service

Copyright

Social Links

---
# SyncWA Features Page Content Specification

## Page Goal

The Features page provides a comprehensive overview of SyncWA's capabilities.

It should help potential customers understand how SyncWA supports customer communication, CRM, sales, marketing, automation, analytics, and team collaboration.

The page should organize features around business value instead of technical modules.

---

# Hero Section

## Badge

✨ Product Features

---

## Headline

Everything You Need to Grow Your Business with WhatsApp

---

## Description

SyncWA combines customer communication, CRM, sales, marketing, automation, analytics, and collaboration into one unified platform, helping your team work more efficiently.

---

## CTA

Primary

Start Free

Secondary

Book Demo

---

## Hero Visual

Product Dashboard Screenshot

---

# Platform Overview

## Title

One Platform. Multiple Business Capabilities.

## Description

Instead of switching between multiple tools, manage your customer relationships from a single workspace.

---

## Product Pillars

Communication

CRM

Sales

Marketing

Automation

Analytics

Team Collaboration

Administration

---

# Communication

## Title

Keep Every Customer Conversation Organized

## Description

Centralize WhatsApp communication so your team can collaborate efficiently and respond faster.

### Features

Shared Team Inbox

Real-time Conversations

Quick Replies

Message Templates

Media Sharing

Conversation Assignment

Conversation Labels

Internal Notes

## Screenshot

Shared Inbox

---

# CRM

## Title

Build Stronger Customer Relationships

## Description

Keep customer information organized and accessible to your entire team.

### Features

Contacts

Lead Profiles

Custom Fields

Tags

Activity Timeline

Interaction History

Notes

Customer Information

## Screenshot

Contact Details

---

# Sales

## Title

Track Every Opportunity

## Description

Manage leads from the first enquiry to successful conversion.

### Features

Sales Pipeline

Lead Management

Opportunity Tracking

Follow-ups

Task Assignment

Lead Status

Sales Activities

## Screenshot

Pipeline

---

# Marketing

## Title

Reach Customers Efficiently

## Description

Create campaigns and communicate with customers at scale using WhatsApp.

### Features

Broadcast Campaigns

Customer Segments

Approved Templates

Campaign Management

Audience Management

Campaign Analytics

## Screenshot

Broadcast Dashboard

---

# Automation

## Title

Automate Repetitive Work

## Description

Reduce manual effort by automating routine workflows and business processes.

### Features

Workflow Automation

Flows

Auto Assignment

Notifications

Triggers

Conditions

Actions

## Screenshot

Automation Builder

---

# Analytics

## Title

Measure Business Performance

## Description

Gain visibility into customer engagement, team performance, and business growth.

### Features

Dashboard

Reports

Campaign Analytics

Sales Metrics

Activity Reports

Performance Insights

## Screenshot

Analytics Dashboard

---

# Team Collaboration

## Title

Help Your Team Work Together

## Description

Enable secure collaboration while maintaining visibility and accountability.

### Features

Users

Roles

Permissions

Activity Logs

Assignments

Workspace Management

## Screenshot

Team Management

---

# AI Assistance

Display ONLY if implemented.

## Title

Work Smarter with AI

## Description

Use AI-powered capabilities to improve productivity and assist daily operations.

### Features

AI Assistant

Knowledge Assistance

Suggested Responses

Workflow Assistance

## Screenshot

AI Workspace

---

# Why Businesses Choose SyncWA

## Cards

Everything in one platform

Reduce manual work

Respond faster

Improve collaboration

Track customer journeys

Grow with confidence

---

# Frequently Asked Questions

How is SyncWA different from a traditional CRM?

Can multiple team members manage the same WhatsApp number?

Can I automate repetitive tasks?

Can I manage customer information?

Does SyncWA support team collaboration?

Can SyncWA grow with my business?

---

# Final CTA

## Headline

Discover Everything SyncWA Can Do

## Description

Explore a complete platform designed to help your business communicate, collaborate, and grow.

Primary CTA

Start Free

Secondary CTA

Contact Sales

---
# SyncWA Pricing Page Content Specification

## Page Goal

The Pricing page helps businesses understand which SyncWA plan best fits their team.

The page should communicate value before price.

Visitors should clearly understand

- Who each plan is for
- What capabilities are included
- When they should upgrade
- How to contact sales for custom requirements

The pricing page should remain simple, transparent, and trustworthy.

---

# Hero Section

## Badge

💳 Pricing

---

## Headline

Simple Pricing for Growing Businesses

---

## Description

Choose the plan that best fits your business today and scale as your team grows.

No hidden fees. Upgrade whenever you're ready.

---

## CTA

Primary

Start Free

Secondary

Contact Sales

---

# Pricing Philosophy

## Title

Built to Grow with Your Business

## Description

Whether you're just getting started or managing a growing team, SyncWA offers flexible plans designed to support your business at every stage.

---

# Billing Toggle

Monthly

Yearly

Display

Save XX%

(Percentage should be configurable later.)

---

# Pricing Plans

## Starter

### Badge

Best for Individuals

### Description

Perfect for individuals and small teams getting started with customer communication.

### Price

Coming Soon

(or configurable)

### CTA

Start Free

### Includes

Shared Team Inbox

Contact Management

Lead Management

Basic Analytics

Broadcast Campaigns

Workflow Automation

Email Support

---

## Professional

### Badge

Most Popular

### Description

Designed for growing businesses managing larger teams and customer operations.

### Price

Coming Soon

### CTA

Get Started

### Includes

Everything in Starter

Advanced Analytics

Sales Pipeline

Advanced Automation

Team Collaboration

Roles & Permissions

Priority Support

API Access

---

## Enterprise

### Badge

Custom Solution

### Description

For organizations requiring advanced customization, dedicated support, and enterprise-grade scalability.

### Price

Contact Sales

### CTA

Contact Sales

### Includes

Everything in Professional

Dedicated Success Manager

Custom Integrations

Enterprise Security

Advanced Permissions

Custom Workflows

Priority Infrastructure

Dedicated Onboarding

Custom SLAs

---

# Feature Comparison

## Title

Compare Plans

Columns

Feature

Starter

Professional

Enterprise

Sections

Communication

CRM

Sales

Marketing

Automation

Analytics

Administration

Support

API

Security

Storage

Limits

Use check icons.

Avoid excessive detail.

---

# Why Choose SyncWA

Cards

Start small and scale later

No unnecessary complexity

Designed for modern businesses

Transparent pricing

Flexible upgrade path

Dedicated business support

---

# Frequently Asked Questions

Can I change my plan later?

Is there a free trial?

What happens when my trial ends?

Can I upgrade anytime?

Do you offer annual billing?

Can I contact sales before purchasing?

Do you offer enterprise pricing?

---

# Final CTA

## Headline

Ready to Grow with SyncWA?

## Description

Start managing customer relationships from one platform today.

Primary CTA

Start Free

Secondary CTA

Book Demo

---

# Footer

Reuse website footer.

---

# SyncWA Contact Page Content Specification

## Page Goal

The Contact page provides businesses with a simple and professional way to reach the SyncWA team.

The page should encourage communication while maintaining trust and clarity.

Visitors should immediately understand how to contact the team and what kind of assistance they can expect.

---

# Hero Section

## Badge

📞 Contact Us

---

## Headline

We're Here to Help

---

## Description

Whether you have questions about SyncWA, need a product demonstration, want to discuss pricing, or require technical assistance, our team is ready to help.

---

# Contact Options

## Section Title

Choose the Best Way to Reach Us

---

### Email

#### Title

Email Us

#### Description

Reach out for general enquiries, product information, partnership opportunities, or technical support.

Placeholder

support@syncwa.com

---

### WhatsApp

#### Title

Chat on WhatsApp

#### Description

Connect with our team directly for quick questions and product guidance.

Placeholder

+91 XXXXX XXXXX

---

### Schedule a Demo

#### Title

Book a Product Demo

#### Description

Schedule a personalized walkthrough and discover how SyncWA can support your business.

Button

Book Demo

---

# Contact Form

## Title

Send Us a Message

## Description

Complete the form below and our team will get back to you as soon as possible.

---

## Fields

Full Name

Company Name

Business Email

Phone Number

Company Size

Subject

Message

---

## Submit Button

Send Message

---

## Success Message

Thank you for contacting SyncWA.

Our team has received your message and will respond as soon as possible.

---

# Business Hours

## Title

Business Hours

Monday – Friday

09:00 AM – 06:00 PM

(Timezone should remain configurable.)

---

# Frequently Asked Questions

Can I request a product demo?

How quickly will I receive a response?

Can I discuss enterprise requirements?

Do you provide onboarding assistance?

Can I migrate from another CRM?

---

# Final CTA

## Headline

Ready to Explore SyncWA?

## Description

Book a personalized demo and discover how SyncWA can simplify customer communication and business operations.

Primary CTA

Book Demo

Secondary CTA

Start Free

---

# Footer

Reuse existing website footer.

---

# SyncWA Login Page Content Specification

## Page Goal

Provide existing users with a fast, familiar, and secure sign-in experience.

The page should prioritize usability over marketing.

Visitors should immediately recognize that they are signing in to SyncWA.

---

# Layout

Split Layout (Desktop)

--------------------------------------

Left

Brand Panel

Right

Login Form

--------------------------------------

Mobile

Brand Panel

↓

Login Form

---

# Left Panel

## Logo

Official SyncWA Logo

---

## Headline

Welcome Back to SyncWA

---

## Description

Manage customer conversations, sales, marketing, and team collaboration from one unified platform.

---

## Background

Use a subtle branded illustration OR a large dashboard preview.

Prefer

Real dashboard screenshot

instead of abstract artwork.

---

## Optional Highlights

Small feature list

✓ Shared Inbox

✓ CRM

✓ Automation

✓ Analytics

Do not overload this section.

---

# Right Panel

Card

Centered vertically.

---

## Title

Welcome Back

---

## Subtitle

Sign in to your SyncWA workspace.

---

## Fields

Email

Password

---

## Links

Forgot Password

---

## Primary Button

Sign In

---

## Divider

or

---

## Footer Text

Don't have an account?

Create Account

---

# Authentication

Do NOT change

Validation

Authentication logic

API

Routing

Session management

Only update UI.

---

# Error States

Reuse existing authentication.

Improve only presentation.

Inline messages.

Accessible.

---

# Loading State

Disable button.

Spinner.

Loading text.

---

# Success State

Existing behaviour.

No changes.

---

# Accessibility

Keyboard navigation

Focus states

Labels

ARIA

Password visibility toggle

AutoComplete

---

# Responsive Behaviour

Desktop

Split layout

Tablet

Narrow split

Mobile

Single column

---

# Footer

Privacy Policy

Terms of Service

Version

(Optional)

---

# Privacy Policy

**Effective Date:** August 4, 2026

Welcome to **SyncWA**.

Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use the SyncWA platform.

---

# Information We Collect

We may collect the following information when you use SyncWA:

- Name
- Email address
- Phone number
- Company information
- Account credentials
- Workspace information
- Usage and activity data
- Customer data you choose to manage within SyncWA

---

# How We Use Your Information

We use your information to:

- Create and manage your account
- Provide and improve our services
- Secure your workspace
- Respond to support requests
- Communicate important product updates
- Monitor platform performance and reliability

We do not sell your personal information.

---

# Customer Data

You retain ownership of the customer data you store in SyncWA.

We process this data only to provide the requested services.

---

# Data Security

We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, or disclosure.

No internet-based service can guarantee absolute security.

---

# Third-Party Services

SyncWA may integrate with third-party services such as:

- WhatsApp Business Platform
- Authentication providers
- Cloud infrastructure providers
- Analytics services

These services are governed by their respective privacy policies.

---

# Cookies

SyncWA may use cookies or similar technologies to:

- Keep you signed in
- Improve user experience
- Analyze platform usage

You may control cookies through your browser settings.

---

# Your Rights

Depending on your location, you may have the right to:

- Access your personal information
- Request corrections
- Request deletion of your account
- Contact us regarding privacy concerns

---

# Changes to This Policy

We may update this Privacy Policy from time to time.

Any significant changes will be published on this page.

---

# Contact

If you have questions regarding this Privacy Policy, please contact us through the Contact page or email our support team.

---

Thank you for trusting SyncWA.

---

# Terms of Service

**Effective Date:** August 4, 2026

Welcome to **SyncWA**.

By accessing or using SyncWA, you agree to these Terms of Service.

If you do not agree with these terms, please do not use the platform.

---

# Use of the Service

SyncWA provides a cloud-based platform for managing customer communication, CRM, sales, marketing, automation, and related business operations.

You agree to use the platform responsibly and in compliance with applicable laws.

---

# Account Responsibilities

You are responsible for:

- Maintaining the security of your account
- Protecting your login credentials
- Activities performed under your account
- Providing accurate information

Notify us immediately if you believe your account has been compromised.

---

# Acceptable Use

You agree not to:

- Use SyncWA for illegal activities
- Send spam or unauthorized communications
- Attempt to gain unauthorized access
- Disrupt or interfere with platform operations
- Upload malicious software or harmful content

Violation of these terms may result in account suspension or termination.

---

# Customer Data

You retain ownership of your data.

By using SyncWA, you grant us permission to process your data solely for providing and maintaining the service.

---

# Availability

We strive to provide a reliable service but do not guarantee uninterrupted availability.

Maintenance, updates, or unforeseen issues may occasionally affect access.

---

# Intellectual Property

SyncWA, including its branding, software, design, and content, is the property of SyncWA and may not be copied, modified, or distributed without permission.

---

# Limitation of Liability

To the maximum extent permitted by law, SyncWA shall not be liable for indirect, incidental, special, or consequential damages arising from the use of the platform.

---

# Termination

We reserve the right to suspend or terminate accounts that violate these Terms of Service or misuse the platform.

---

# Changes to These Terms

We may update these Terms of Service periodically.

Continued use of SyncWA after changes become effective constitutes acceptance of the updated terms.

---

# Contact

For questions regarding these Terms of Service, please contact us through the Contact page.

---

Thank you for choosing SyncWA.

---