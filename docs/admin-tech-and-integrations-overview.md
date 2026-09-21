# FoundingOS — Technical Overview & Integrations Guide (for Admin)

Plain-language answers to "what is this built on?" and "where do I wire up plugins/integrations?"

## 1. What it's built on

| Layer | Technology | Notes |
|---|---|---|
| **Programming language** | TypeScript (everywhere) | Same language across web, mobile, and backend — no context-switching between teams/services. |
| **Web app** | Next.js 14 + React 18 | Hosted on **Vercel**. This is `www.foundingos.com`. |
| **Mobile app** | Expo / React Native | Ships to the **Apple App Store via TestFlight** (Android via the same pipeline, EAS Build). Shares business logic with the web app so both feel and behave the same. |
| **Backend API** | Node.js + Express (TypeScript) | One API service per product suite (Core.Operations, Core.Workforce, Core.Intelligence). |
| **Database** | **PostgreSQL 16** | Accessed through Prisma (an ORM/query layer that keeps the database schema type-safe and versioned in code). |
| **Authentication** | Custom JWT-based auth + NextAuth (console) | Password/session gate in front of the whole product; per-tenant data isolation enforced at the database query level. |
| **Server OS / runtime** | Node.js 20, Linux containers (Debian-based) | Standard, boring, widely-supported choices — nothing exotic or hard to hire for. |
| **Infrastructure** | Vercel (web front end) + Docker Compose (API + Postgres, self-hosted) + EAS (mobile builds/App Store submission) | |
| **Codebase structure** | Single monorepo, npm workspaces | One repository holds the website, console, mobile app, and all three suite backends, sharing common packages for auth, config, UI, and the database client. |

**In one sentence:** FoundingOS is a TypeScript monorepo — a Next.js website/console on Vercel, an Expo/React Native mobile app in TestFlight, Node.js/Express APIs, and a single PostgreSQL database — all industry-standard, well-supported technology with no proprietary or unusual dependencies.

## 2. Where the plugin/integration wiring is

**Location:** every workspace (Retail, Finance, Marketing, Talent, Health, Logistics, Intelligence) has an **Integrations** page under the left-hand navigation: **Administration → Integrations**.

This is the single governed layer where external systems get connected — there is no separate hidden "plugin marketplace"; it's one consistent page reused everywhere.

### What's wired up today

| Provider | Category | What it connects |
|---|---|---|
| WhatsApp Cloud API | Messaging | Sends/receives WhatsApp messages (the primary channel for the product) |
| Stripe | Payments | Payment processing |
| Resend | Email | Transactional email delivery |
| Twilio | SMS | SMS messaging |
| AWS | Storage | File/media storage |
| Sentry | Monitoring | Error tracking |
| Clerk | Identity | Optional identity/auth provider |

### How it works
1. Admin/owner clicks **Configure** on a provider tile.
2. A modal asks only for that provider's required credentials (API keys, tokens, etc.).
3. Credentials are sent to `/platform/integrations/{provider}`, encrypted at rest, and **never returned to the browser** once saved.
4. The system automatically runs a readiness check against the provider; the tile shows **Connected** only once that check passes.

### Where this fits in onboarding
New tenant setup is a guided wizard with four steps: **Business details → Owner details → Workspace setup → Integrations**. The Integrations step in onboarding links directly into the same Administration → Integrations page described above — it's not a separate system, just the same page surfaced earlier in the setup flow so a new business can connect WhatsApp/payments/email before going live.

## 3. Related documents already in this repo
- [`docs/architecture.md`](./architecture.md) — full system/request-flow diagrams
- [`docs/shared-backbone.md`](./shared-backbone.md) — shared identity, licensing, telemetry services
- [`docs/technical-due-diligence.md`](./technical-due-diligence.md) — due-diligence-style summary for external reviewers
- [`docs/production-readiness.md`](./production-readiness.md) — security/ops checklist for going live
