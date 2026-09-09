# SyncWA (wacrm) — Self-Hostable WhatsApp CRM & SaaS Platform

> **SyncWA** is a full-featured, self-hostable CRM and automation platform for WhatsApp® built on **Next.js 16**, **Supabase (PostgreSQL + Auth + Storage)**, and the **Meta WhatsApp Cloud API**.
>
> Manage shared inboxes, visual conversation flows, sales pipelines, broadcast campaigns, AI-assisted customer support, and SaaS operator workflows — all in one unified codebase with complete data ownership.

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-violet.svg" alt="License: MIT"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js 16"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ecf8e?logo=supabase" alt="Supabase"></a>
  <a href="https://developers.facebook.com/docs/whatsapp/cloud-api"><img src="https://img.shields.io/badge/Meta-WhatsApp%20Cloud%20API-25D366?logo=whatsapp" alt="WhatsApp Cloud API"></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-Enabled-orange" alt="Model Context Protocol"></a>
</p>

---

## 🌟 Key Features

### 💬 1. Shared WhatsApp Business Inbox
- **Multi-Agent Collaboration**: Connect your official WhatsApp Business number and let your entire team collaborate on customer conversations from a single unified workspace.
- **Rich Media & Voice Messaging**: Send and receive images, videos, documents, and record in-browser voice notes using Opus audio encoding.
- **Message Reactions & Context**: Real-time emoji reactions, swipe-to-reply quoting, message delivery status tracking (sent, delivered, read), and live agent presence indicators.
- **Quick Replies & Interactive Elements**: Dispatch reusable text snippets or rich interactive button menus and list messages in one click.

### ⚡ 2. Visual Flow Builder & No-Code Automations
- **Drag-and-Drop Canvas**: Build interactive chatbot sequences and multi-step conversation trees using an intuitive visual editor powered by `@xyflow/react`.
- **Flexible Flow Nodes**: Trigger on inbound messages/keywords, send interactive buttons and lists, wait with delay timers, evaluate conditional logic, assign agents, tag contacts, or fire external HTTP webhooks.
- **Linear Automations Engine**: Alternative lightweight rule-based automation engine for instant auto-replies, round-robin assignments, and keyword matching.

### 👥 3. Contact & Audience Management
- **Centralized Contact Directory**: Normalize phone numbers automatically with account-scoped uniqueness and deduplication.
- **Custom Fields & Dynamic Tags**: Add custom attributes (text, number, date, dropdowns) and color-coded tags to organize and segment your audience.
- **CSV Import & Export**: Import existing customer lists with field mapping and deduplication safeguards.

### 📊 4. Sales Pipelines & Kanban Deals
- **Kanban Deal Board**: Drag and drop sales opportunities across customizable pipeline stages powered by `@dnd-kit`.
- **Linked Conversations**: Connect deals directly to active WhatsApp conversation threads for 360-degree sales context.
- **Multi-Currency Support**: Track expected deal value across global currencies with automated stage rollups.

### 📢 5. WhatsApp Broadcasts & Meta Templates
- **Meta-Approved Template Manager**: Create, submit, and sync official WhatsApp message templates directly with Meta Graph API.
- **Personalized Campaigns**: Broadcast template messages to filtered contact segments with dynamic `{{1}}`, `{{2}}` variable substitution.
- **Resumable Delivery & Analytics**: Background delivery locks, automated retries, and real-time delivery, read, and reply rate tracking.

### 🤖 6. Bring-Your-Own-Key (BYOK) AI Assistant & Knowledge Base
- **Inbox Drafting & Copilot**: Generate contextual reply drafts in one click using your own OpenAI (GPT-4o / GPT-4o-mini) or Anthropic (Claude 3.5 Sonnet) API keys.
- **Autonomous Auto-Reply Bot**: Optional AI chatbot mode with per-thread reply caps, conversation summarization, and clean human handoff when complex inquiries arise.
- **Hybrid Knowledge Base**: Ground AI responses in your product FAQs, guides, and policies using Postgres Full-Text Search or semantic vector search (`pgvector`). Keys are stored securely with AES-256-GCM encryption.

### 🔒 7. Multi-Tenant Team Security & Roles
- **Granular RBAC**: Role-based access control supporting `owner`, `admin`, `agent`, and `viewer` tiers.
- **One-Click Invitation Links**: Invite teammates securely via signed invitation links (`/join/[token]`).
- **PostgreSQL Row-Level Security (RLS)**: Strict database-level tenant isolation ensures data privacy across accounts.

### 🏢 8. Platform CRM & SaaS Operator Portal (`/admin`)
- **Inbound Lead Qualification**: Review leads originating from marketing contact forms, track interest areas, and assign operators.
- **Customer Workspace Lifecycle**: Manage customer onboarding stages, trial states, and workspace provisioning.
- **Platform Telemetry**: Monitor operational KPIs, commercial metrics, and customer communication logs.

### 🔌 9. Public REST API & MCP Server
- **REST API v1 (`/api/v1`)**: Programmatically send messages, manage contacts, trigger broadcasts, and configure outgoing webhooks using SHA-256 hashed API keys.
- **Model Context Protocol (MCP)**: Native MCP server (`mcp-server/`) allowing Claude Desktop, Cursor, or external AI agents to query and operate your CRM tools securely.

### 🌐 10. Built-in Internationalization
- Fully localized in **English (`en`)** and **Korean (`ko`)** using `next-intl` with instant runtime switching.

---

## 🛠️ Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                       Frontend Layer                        │
│   Next.js 16 (App Router) • React 19 • TypeScript • Tailwind v4   │
│   Radix/Base UI • Lucide Icons • @xyflow/react • @dnd-kit   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Application & API Layer                  │
│    Next.js Server Actions & Route Handlers • next-intl      │
│    AES-256-GCM Token Encryption • HMAC-SHA256 Webhooks      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Data & Infrastructure                    │
│   Supabase (PostgreSQL 15+ with RLS) • Supabase Auth        │
│   Supabase Storage (Chat Media) • pgvector • Opus Audio     │
│   Meta WhatsApp Cloud API (Graph API v21.0+)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
wacrm/
├── docs/                        # Architecture guides, API specifications, and PRDs
├── mcp-server/                  # Model Context Protocol server for Claude / Cursor
├── messages/                    # Translation dictionaries (en.json, ko.json)
├── public/                      # Static logos, fonts, and assets
├── scripts/                     # Database migration runners and demo data seeders
│   ├── migrate.mjs              # Multi-mode SQL migration runner
│   ├── create-credentials.mjs   # Encryption key generator
│   └── seed/                    # Demo and testing data seeders
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Login, signup, password reset
│   │   ├── (dashboard)/         # Customer CRM (inbox, contacts, flows, pipelines, etc.)
│   │   ├── (marketing)/         # Public landing page, features, pricing, contact
│   │   ├── admin/               # Platform CRM / Operator back-office
│   │   ├── api/                 # WhatsApp webhooks, AI, flows, public API v1
│   │   ├── join/                # Team invite redemption (/join/[token])
│   │   └── proxy.ts             # Route protection and role redirection middleware
│   ├── components/              # Modular UI components by domain
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # next-intl configuration
│   ├── lib/                     # Business logic (WhatsApp client, AI, engine, auth)
│   └── types/                   # Master TypeScript interfaces
└── supabase/
    └── migrations/              # Database schema migrations (001 to 039+)
```

---

## 🚀 Getting Started (Local Setup)

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Supabase Account**: A free Supabase project (or local Supabase instance)
- **Meta for Developers Account**: Access to WhatsApp Cloud API (for live messaging)

---

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArnasDon/wacrm.git
   cd wacrm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

### 3. Environment Configuration

Copy the example environment configuration:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and populate the required variables:

```bash
# ------------------------------------------------------------------
# Supabase Configuration (Project Settings -> API)
# ------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ------------------------------------------------------------------
# Encryption & Security
# ------------------------------------------------------------------
# Generate a 32-byte (64 hex character) encryption key:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-character-hex-encryption-key

# Meta App Secret (Meta for Developers -> App Settings -> Basic)
META_APP_SECRET=your-meta-app-secret

# Optional: Meta App ID (Required for image-header template creation)
META_APP_ID=your-meta-app-id

# ------------------------------------------------------------------
# Application URL & Locale
# ------------------------------------------------------------------
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_LOCALE=en

# ------------------------------------------------------------------
# Database Connection (For running migrations locally)
# ------------------------------------------------------------------
DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

### 4. Database Setup & Migrations

SyncWA includes an automated migration runner that executes all sequential SQL migrations in `supabase/migrations/`:

```bash
npm run db:migrate
```

*(Alternatively, you can provide `SUPABASE_ACCESS_TOKEN` in `.env.local` or copy SQL migration files into the Supabase Dashboard SQL Editor).*

---

### 5. Seed Development Data

Populate your database with realistic demonstration accounts, contacts, pipelines, visual flows, and platform leads:

```bash
# Seed standard demo profile (Recommended for local dev):
npm run seed:demo

# Or seed a testing dataset:
npm run seed:testing
```

---

### 6. Run the Application

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Customer CRM**: Sign in and navigate to `/dashboard` or `/inbox`.
- **Platform Admin Portal**: Accounts with `is_platform_staff = true` will navigate to `/admin`.

---

## 📱 Meta WhatsApp Cloud API Setup

To connect live WhatsApp messaging:

1. Go to [Meta for Developers](https://developers.facebook.com) and create a **Business** App.
2. Add the **WhatsApp** product to your app.
3. In **App Settings → Basic**, copy your **App Secret** to `META_APP_SECRET` in `.env.local`.
4. Under **WhatsApp → Configuration**:
   - **Callback URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **Verify Token**: Any custom random string you configure in your CRM settings.
   - **Webhook Fields**: Subscribe to `messages` and `message_template_status_update`.
5. In the CRM under **Settings → WhatsApp Connection**, enter your:
   - **Phone Number ID**
   - **WhatsApp Business Account ID (WABA ID)**
   - **System User Permanent Access Token**
6. Test by sending a WhatsApp message to your business phone number. The incoming message will instantly appear in `/inbox`!

---

## 🤖 Model Context Protocol (MCP) Server

SyncWA includes a built-in MCP server (`mcp-server/`) that exposes your CRM to AI agents like Claude Desktop or Cursor.

To configure Claude Desktop to interact with your CRM:
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "syncwa": {
      "command": "node",
      "args": ["<path-to-wacrm>/mcp-server/dist/index.js"],
      "env": {
        "CRM_API_URL": "http://localhost:3000/api/v1",
        "CRM_API_KEY": "wacrm_live_your_generated_api_key"
      }
    }
  }
}
```

See [`docs/mcp.md`](./docs/mcp.md) for full details.

---

## 📜 NPM Scripts Reference

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `localhost:3000` |
| `npm run build` | Builds the optimized production standalone bundle |
| `npm run start` | Runs the compiled production server |
| `npm run typecheck` | Validates TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint rules |
| `npm run test` | Executes Vitest unit and integration test suites |
| `npm run db:migrate` | Runs all pending SQL migrations against your Supabase database |
| `npm run seed:demo` | Seeds demo contacts, conversations, pipelines, and platform leads |
| `npm run seed:testing` | Seeds deterministic testing fixtures |
| `npm run seed:production` | Initializes baseline production platform roles and metadata |
| `npm run format` | Formats all code files with Prettier |

---

## 🚢 Deployment Options

### Deploy on Hostinger (Recommended)
SyncWA is optimized for [Hostinger Managed Node.js](https://wacrm.tech/docs/deployment-hostinger):
1. Connect your GitHub repository in Hostinger hPanel.
2. Select **Node.js** application.
3. Configure environment variables in the panel.
4. Push to `main` — automatic build and zero-downtime deployment.

### Docker & Docker Compose
A production `Dockerfile` and `docker-compose.yml` are included:
```bash
docker compose up -d --build
```
See [`docs/docker.md`](./docs/docker.md) for environment configuration and volume mounting instructions.

### Vercel / Railway / VPS
Deploy anywhere standard Node.js applications run with output mode set to standalone in `next.config.ts`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
You are free to fork, brand, customize, self-host, and use this codebase for personal or commercial projects.
