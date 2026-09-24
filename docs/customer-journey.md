# Customer Journey (Actual Current Code Paths)

This document traces what the code currently does today across the three main FoundingOS customer-facing surfaces. It intentionally describes implemented behavior only.

## Marketing Website Journey

### 1) First entry is usually the preview gate, not the landing page
- `apps/foundingos-web/middleware.ts` redirects **almost every route** to `/access` when `SITE_ACCESS_ENABLED === 'true'` unless the visitor already has the `foundingos_site_access` cookie or the special founder tester session cookie.
- Excluded routes are only `/access`, `/privacy`, `/api/access/*`, and `/api/billing/webhook` (`apps/foundingos-web/middleware.ts`).
- `/access` is implemented by `apps/foundingos-web/app/access/page.tsx` and posts to `apps/foundingos-web/app/api/access/login/route.ts`.
- That login endpoint:
  - validates email + shared invitation password via `apps/foundingos-web/src/site-access.ts`
  - sets the `foundingos_site_access` cookie
  - records a preview visitor in `packages/db/prisma/schema.prisma` (`PreviewVisitor`) via `apps/foundingos-web/src/preview-visitors.ts`
  - redirects back to the requested page.
- This is **not** tenant-scoped auth and does **not** create a Core.Operations user/session.

### 2) Landing pages are static marketing content
- After access is granted, almost all marketing routes resolve through `apps/foundingos-web/app/[[...slug]]/page.tsx`.
- The actual page UI comes from `packages/ui/src/index.tsx` (`FounderLauncher` / `SecondaryPage`).
- Implemented pages are: home, suites, workspaces, consoles, test-workspaces, marketing, intelligence, about, pricing, contact (`apps/foundingos-web/app/[[...slug]]/page.tsx`).
- These pages are mostly static content and links. There are **no Core.Operations backend calls** from the landing/pricing/contact flows.
- Important CTA behavior from `packages/ui/src/index.tsx`:
  - home page links mainly to static previews like `/intelligence`, `/workspaces/marketing`, `/test-workspaces/...`
  - pricing CTAs go to `/contact`, not to a real signup or tenant bootstrap flow.

### 3) “Login / signup” — FIXED: `/login` now authenticates a real account
- `apps/foundingos-web/app/login/page.tsx` now collects a real email + password and posts to `apps/foundingos-web/app/api/session/login/route.ts`.
- That route proxies `POST /api/v1/auth/login` on Core.Operations (`shared/auth/src/express.ts` -> `createAuthRouter`) and, on success, stores the returned access/refresh tokens in httpOnly cookies (`apps/foundingos-web/src/tenant-session.ts`).
- On success the user lands on `apps/foundingos-web/app/workspace/page.tsx`, a real signed-in page that re-verifies the session against `GET /api/v1/auth/me` and shows the account's email/role plus a link out to the FoundingOS console and a working sign-out (`apps/foundingos-web/app/api/session/logout/route.ts`).
- **FIXED**: the console (`apps/foundingos-console`) now shares this session via a real handoff — clicking through to the console (or signing in directly at the console's own `/login`) authenticates there too without a second sign-in. See "Console Web App Journey" §2b for the console-side half of this.
- There is still **no** dedicated signup route in `apps/foundingos-web/app`; the catch-all router in `app/[[...slug]]/page.tsx` does not include `signup` or `onboarding`. New accounts are still only created via the invite flow below.

### 4) Invite flow is the main real account-creation flow
- `apps/foundingos-web/app/invite/[token]/page.tsx` is the only clear website flow that creates a real user.
- On load it calls Core.Operations:
  - `GET /ops/platform/team/invitations/inspect?token=...`
  - implemented in `core-operations/backend/src/routes.ts` -> `getInvitationDetails(...)` in `core-operations/backend/src/platform.ts`
- On accept it calls:
  - `POST /ops/platform/team/invitations/accept`
  - implemented in `core-operations/backend/src/routes.ts` -> `acceptTeamInvitation(...)` in `core-operations/backend/src/platform.ts`
- Real persisted effects of accept:
  - creates `AuthUser`
  - marks `TenantInvitation.acceptedAt`
  - writes a `WorkspaceAuditEvent`
  - all in `core-operations/backend/prisma/schema.prisma` and `core-operations/backend/src/platform.ts`.
- Where the user ends up next:
  - success state links to `/login` (`apps/foundingos-web/app/invite/[token]/page.tsx`)
  - `/login` is now a real sign-in (see section 3), so this handoff works end-to-end for the website session, and — as of the fix in §2b of the Console Web App Journey section below — now also carries the user into the console automatically.
- Extra caveat:
  - if `SITE_ACCESS_ENABLED` is on, `/invite/[token]` is still behind the preview middleware (`apps/foundingos-web/middleware.ts`), so an invited user may first hit `/access` before even seeing the invite form.

### 5) Billing endpoints exist, but the user-facing path is incomplete
- Website billing routes:
  - `apps/foundingos-web/app/api/billing/checkout/route.ts`
  - `apps/foundingos-web/app/api/billing/webhook/route.ts`
- Checkout route behavior:
  - if Commercial Mode is **not** active, it returns `501` with “continuing in Demo Mode” (`app/api/billing/checkout/route.ts`, `packages/config/src/commercial-mode.ts`)
  - if active, it creates a Stripe customer + checkout session through `packages/billing/src/stripe-service.ts`.
- Webhook behavior:
  - verifies Stripe webhook signature via `packages/billing/src/webhook-handler.ts`
  - writes subscription state to `BrandSubscription` in `packages/db/prisma/schema.prisma` via `syncSubscriptionFromStripe(...)`.
- Important limitations:
  - the persisted billing target is a **legacy per-brand** `BrandSubscription`, not tenant-scoped `TenantSuiteLicense` / `WorkspaceRecord` data (`packages/billing/src/stripe-service.ts`, `packages/db/prisma/schema.prisma`).
  - the default success/cancel URLs point to `/onboarding?checkout=success|cancelled` (`app/api/billing/checkout/route.ts`), but `apps/foundingos-web` has **no** `/onboarding` route.
  - I did not find a current page in `apps/foundingos-web/app` that actually mounts `packages/ui/src/onboarding/OnboardingForm.tsx`, so this checkout endpoint appears largely **orphaned** from the current website router.

### 6) Feedback flow is real persistence, but only for preview visitors
- `apps/foundingos-web/app/feedback/page.tsx` checks the preview cookie itself and redirects to `/access?returnTo=%2Ffeedback` if missing.
- The form UI is `apps/foundingos-web/app/feedback/preview-feedback-form.tsx`.
- Submit calls `POST /api/feedback` (`apps/foundingos-web/app/api/feedback/route.ts`).
- That endpoint:
  - validates origin
  - requires the preview cookie
  - validates survey answers with `apps/foundingos-web/src/preview-feedback.ts`
  - writes a `SurveyEntry` row through `getPrismaClient()`.
- Persisted storage is `packages/db/prisma/schema.prisma` (`SurveyEntry`), not the tenant-scoped Core.Operations schema.
- On success the user lands on a thank-you state linking back to `/test-workspaces`.

## Console Web App Journey

### 1) Entry routes are inconsistent
- `/` redirects to `/console` (`apps/foundingos-console/app/page.tsx`).
- `/console` renders `apps/foundingos-console/app/founder/FounderConsolePage.tsx` through `app/console/page.tsx`.
- `/dashboard` redirects to `/founder` (`apps/foundingos-console/app/dashboard/page.tsx`).
- `/login` — **FIXED**: previously redirected unconditionally to `https://www.foundingos.com/` with no way back into the console. Now redirects to the real website login (`apps/foundingos-web/app/login/page.tsx`) with a `returnTo` pointing at this app's new `/session/handoff`, so a real sign-in on the website lands the user back here, already authenticated (`apps/foundingos-console/app/login/page.tsx`).

### 2) Auth protection — FIXED: `/console` is no longer publicly reachable
- `apps/foundingos-console/middleware.ts` protects:
  - `/founder/*`, `/ecosystem-demo/*`, and now `/console/*` (see below) as admin-only
  - `/workspace/*` for real tenant accounts (new — see §3 below)
  - `/retail`, `/finance`, `/crypto`, `/meat`, `/talent`, `/foundthat`, `/health`, `/logistics` for tester/admin sessions
  - `/superdashboard` and `/system/guardian` for tester/admin sessions.
- **Previously**, `/console` (and therefore `/`, which redirects to it) rendered the internal founder/admin master control centre — the exact same component protected at `/founder` — with **no auth check at all**. This meant anyone with the URL could see the internal control centre content. Fixed by adding `/console` to the same admin-only gate `/founder` already uses.
- `/crm` and `/modules/*` remain unprotected/demo as described below — unchanged by this fix.

### 2b) Real tenant sign-in now exists, separate from the founder/admin console
- New: `apps/foundingos-console/app/workspace/page.tsx` — a real, signed-in landing page for a tenant account, gated by `apps/foundingos-console/middleware.ts` (checks for a real session cookie) and re-verified against Core.Operations `/api/v1/auth/me`.
- New: `apps/foundingos-console/app/session/handoff/page.tsx` + `app/api/session/handoff/route.ts` — receive the token pair the website's `/login` hands off after a real sign-in (via a URL fragment, never a query string, so it never touches server logs) and establish this app's own session cookies from it, without a second sign-in.
- This is a real, working, one-account single sign-on between the website and the console for genuine tenant accounts. It does **not** yet cover any of the demo/tester/admin flows described elsewhere in this section, and it does not yet make `/crm`, `/modules/*`, or any other console module real (see §4 below — that is separate, not-yet-done work).

### 3) The main shell is mostly static / illustrative
- `apps/foundingos-console/app/founder/FounderConsolePage.tsx` drives the main shell used by `/console`, `/founder`, `/founder/home`, and `/founder/dashboard`.
- The page uses hardcoded sections and counts (for example “All customers 1284”, “All workflows 18”).
- The “All workflows” card links to `/dashboard` (`FounderConsolePage.tsx`), which redirects to `/founder` (`app/dashboard/page.tsx`) instead of opening a dedicated workflows screen.
  - For non-admin users this becomes effectively a **dead end** because `/founder` is admin-protected by middleware. Still open — not addressed by this session's login work, since it's an admin/founder-only surface, not the real tenant journey.
- I found no Core.Operations API calls in `FounderConsolePage.tsx`; it is a static control-center UI.

### 4) `/crm` is a hybrid: seeded demo UI + real legacy per-brand deals
- Route: `apps/foundingos-console/app/crm/page.tsx` -> `packages/ui/src/crm.tsx` (`CRMBoard`).
- Most of the CRM surface is seeded client-side data:
  - `seedRecords(...)`
  - `seedTasks(...)`
  - `seedNotes(...)`
  - all in `packages/ui/src/crm.tsx`.
- One subsection is real persistence:
  - `RealDealsPanel` in `packages/ui/src/real-monetary-panels.tsx`
  - reads `GET /api/crm/deals?brandSlug=...`
  - writes `POST /api/crm/deals`
  - implemented in `apps/foundingos-console/app/api/crm/deals/route.ts`.
- Persisted model is `CrmDeal` in `packages/db/prisma/schema.prisma`, which the schema itself marks as a **legacy per-brand CRM model**.
- This is **not** the tenant-scoped Core.Operations `Lead` model in `core-operations/backend/prisma/schema.prisma`.

### 5) `/modules/[moduleId]` is mostly illustrative, not tenant-backed
- Route: `apps/foundingos-console/app/modules/[moduleId]/page.tsx` -> `packages/ui/src/console.tsx` (`BrandModulePage`).
- Because `apps/foundingos-console/app/brand-config.ts` sets `config.name` to `FoundingOS`, the `Core.Operations` live-path in `BrandModulePage` is **not** used here.
- Instead, the route mostly renders:
  - generic `DataWorkbench` client-state module UIs (`packages/ui/src/console.tsx`)
  - or special-case illustrative modules such as:
    - `packages/ui/src/modules/MarketingModule.tsx`
    - `packages/ui/src/modules/MessagingModule.tsx`
    - `packages/ui/src/modules/SalesModule.tsx`
    - `packages/ui/src/modules/FoundAIDemoModule.tsx`.
- These modules explicitly describe themselves as illustrative / not backed by real engines. Examples:
  - Marketing analytics says “Illustrative — no real send/delivery engine wired up yet” (`packages/ui/src/modules/MarketingModule.tsx`)
  - Messaging says “not a real delivery/automation engine yet” (`packages/ui/src/modules/MessagingModule.tsx`)
  - Sales says it is “not backed by a real CPQ/deal-tracking database” (`packages/ui/src/modules/SalesModule.tsx`)
  - FoundAI Demo says only the chat widget is the “real, working piece,” while workflows/triggers/logs/templates are client-state (`packages/ui/src/modules/FoundAIDemoModule.tsx`).
- I did **not** find these module routes calling `core-operations/backend/src/routes.ts`.

### 6) FoundAI in the console is not the mobile/Core.Operations FoundAI
- The floating FoundAI panel comes from `packages/ui/src/found-ai.tsx`.
- Its free-text responses are local knowledge matching, not Core.Operations LLM calls.
- Its “smart actions” either:
  - navigate to an existing page, or
  - call same-origin demo endpoints such as `apps/foundingos-console/app/api/ai/order-assist/route.ts`.
- Those `/api/ai/*` endpoints return synthetic suggestion payloads (for example random order IDs / invoice IDs) and do not persist to `WorkspaceRecord`, `Lead`, etc.

### 7) Suite-specific routes `/retail`, `/health`, `/finance`, `/talent`, `/logistics`, `/crypto`, `/foundthat`, `/meat`
- These routes render brand micro-dashboards such as:
  - `apps/foundingos-console/app/retail/page.tsx`
  - `apps/foundingos-console/app/finance/page.tsx`
  - `apps/foundingos-console/app/foundthat/page.tsx`
  - etc.
- They are built from deterministic config/code only:
  - `packages/config/src/brand-ai-engine.ts`
  - `packages/config/src/brandSignalFeed.ts`
  - `packages/config/src/quantum/quantum-enrichment.ts` fallback chain
  - `packages/ui/src/brand-micro-dashboard.tsx`.
- Those files explicitly describe the logic as deterministic / heuristic, not tenant-backed operational data.
- The shared micro-dashboard does include `RealBrandFinancePanel`, which reads/writes `apps/foundingos-console/app/api/brand/finance/route.ts` and persists to the legacy per-brand `BrandFinance` model in `packages/db/prisma/schema.prisma`.
- It also reads live FX display data from `apps/foundingos-console/app/api/fx/rates/route.ts`.
- These pages do **not** use the Core.Operations `WorkspaceRecord`/`Lead` models.

### 8) Deprecated / removed brands are still present here
- `apps/foundingos-console/app/foundthat/page.tsx`, `app/meat/page.tsx`, and `app/crypto/page.tsx` still exist.
- `apps/foundingos-console/app/brand-config.ts` still lists `FoundMeat`, `FoundThat`, and `FoundCrypto` in the dashboard table rows.
- This conflicts with the restructure direction captured in prior cleanup work.
- One thing *has* been removed: the legacy scraping workflow returns an explicit removal message in `apps/foundingos-console/app/api/superdash/scraper/run/route.ts` (“The legacy scraping workflow has been removed from FoundingOS.”).

## Mobile App Journey

### 1) Entry is a real login screen with demo-mode escape hatch
- Entry route: `apps/foundingos-mobile/app/index.tsx`.
- On mount it:
  - checks for an existing Core.Operations session via `getSession()` / `verifySession()` from `apps/foundingos-mobile/lib/core-operations-api.ts`
  - checks a legacy tester token via `apps/foundingos-mobile/lib/api.ts`
  - only auto-skips login for a **verified Core.Operations** session.
- Sign-in behavior:
  - tries real Core.Operations first: `POST /api/v1/auth/login` (`lib/core-operations-api.ts`)
  - on success, best-effort logs into Core.Workforce too
  - on failure, falls back to the legacy tester login.
- “View live demo” does **not** create any backend session. It only flips in-memory `demoMode` in `apps/foundingos-mobile/lib/store.ts`.

### 2) After login, the authenticated shell loads suite visibility from Core.Operations
- Tabs are defined in `apps/foundingos-mobile/app/(app)/(tabs)/_layout.tsx`.
- On mount it calls `fetchLicensedSuites()` from `lib/core-operations-api.ts`.
- That calls Core.Operations:
  - `GET /api/v1/ops/module-access/:tenantId/core_workforce`
  - `GET /api/v1/ops/module-access/:tenantId/core_intelligence`
  - implemented in `core-operations/backend/src/routes.ts`.
- Visible bottom tabs are only Today, Workspaces, Approvals, Search; other suite screens are hidden from the tab bar but still routable (`href: null` in `_layout.tsx`).

### 3) Home / Today tab is one of the most real mobile flows
- Screen file: `apps/foundingos-mobile/app/(app)/(tabs)/home.tsx`.
- In demo mode it uses demo datasets (`DEMO_EVENTS`, `DEMO_ONBOARDING`) and demo approvals queue behavior.
- In real mode it loads:
  - approvals queue via `apps/foundingos-mobile/lib/approvals-queue.ts`
    - Core.Operations: `GET /api/v1/ops/platform/agent-actions`
    - Core.Workforce: `GET /api/v1/workforce/platform/workforce-actions`
  - recent events via `GET /api/v1/ops/platform/events?limit=10`
  - onboarding via `GET /api/v1/ops/platform/onboarding`.
- Approve/reject/execute actions call:
  - Core.Operations: `/platform/agent-actions/:id/decision`, `/execute`, `/reverse`
  - Core.Workforce equivalents in `apps/foundingos-mobile/lib/core-workforce-api.ts`.
- Persisted data here is real `AgentAction`, `WorkspaceAuditEvent`, and event-feed data when not in demo mode.

### 4) Onboarding is real in live mode, local-only in demo mode
- Screen file: `apps/foundingos-mobile/app/(app)/onboarding.tsx`.
- Demo mode behavior:
  - loads `DEMO_ONBOARDING` + `DEMO_MESSAGING_READINESS`
  - “save” only mutates local state
  - explicitly tells the user it is not persisted.
- Real mode behavior:
  - `GET /api/v1/ops/platform/onboarding`
  - `GET /api/v1/ops/messaging/readiness`
  - `PUT /api/v1/ops/platform/onboarding`
  - all implemented in `core-operations/backend/src/routes.ts` and `core-operations/backend/src/platform.ts` / `messaging-core.ts`.
- Persisted model is `TenantOnboarding` in `core-operations/backend/prisma/schema.prisma`.
- This is one of the clearest real tenant-backed customer journeys in the repo.

### 5) Workspaces directory is real navigation, but not a real data load
- Directory screen: `apps/foundingos-mobile/app/(app)/(tabs)/brands.tsx`.
- It uses the local catalogue in `apps/foundingos-mobile/lib/workspace-modules.ts` and `lib/nav-directory.ts`.
- It does **not** call the backend for the workspace list.
- It shows a connection notice based only on whether `getSession()` returns a Core.Operations session.
- Important mismatch:
  - the screen says “Every module below reads and writes the same real, tenant-scoped data as the web app” (`app/(app)/(tabs)/brands.tsx`)
  - but that is not true for demo users, and the screen is still navigable when not connected.

### 6) Workspace landing pages are local catalogue pages
- Route: `apps/foundingos-mobile/app/workspace/[workspace]/index.tsx`.
- The module list is built entirely from `findWorkspace(...)` in `lib/workspace-modules.ts`.
- No backend calls happen on this screen.
- It also claims “Every module below reads and writes real, live tenant data — nothing here is a demo or mock.” (`app/workspace/[workspace]/index.tsx`), which is only true if the user has a live Core.Operations session.

### 7) Workspace module screens are real tenant-backed CRUD (but have no demo fallback)
- Route: `apps/foundingos-mobile/app/workspace/[workspace]/[module].tsx`.
- Real-mode backend calls from `apps/foundingos-mobile/lib/core-operations-api.ts`:
  - `GET /api/v1/ops/platform/workspaces/:workspace/:module/records`
  - `POST /api/v1/ops/platform/workspaces/:workspace/:module/records`
  - `PATCH /api/v1/ops/platform/records/:id`
  - `POST /api/v1/ops/platform/records/:id/images`
- Server implementations are in `core-operations/backend/src/routes.ts` and `core-operations/backend/src/platform.ts`.
- Real persisted model is `WorkspaceRecord` in `core-operations/backend/prisma/schema.prisma`, plus `WorkspaceAuditEvent` and emitted workspace events.
- The screen adapts one generic backend model into different UI shapes (kanban / inbox / dashboard / config / records) using local classification logic.
- Important real behavior:
  - inbox “send” does **not** send email; it creates a `WorkspaceRecord` with `status: 'Queued'` and email payload in `data` (`app/workspace/[workspace]/[module].tsx`)
  - the UI explicitly says delivery requires a configured mail channel.
- Important gap:
  - unlike Home/Onboarding/CRM, this screen has **no demo-mode service switch**.
  - If a user entered through “View live demo” (no real session), these screens still try the live authed endpoints and can fail with load errors.

### 8) CRM is one of the few mobile screens that works in both real and demo modes
- Screen: `apps/foundingos-mobile/app/(app)/crm.tsx`.
- It goes through `getPipelineService()` (`apps/foundingos-mobile/lib/services/pipelineService.ts`).
- Demo mode uses `pipelineService.demo.ts` with in-memory seeded leads.
- Real mode uses `pipelineService.real.ts`, which calls Core.Operations:
  - `GET /api/v1/ops/owner/pipeline`
  - `POST /api/v1/ops/leads`
  - `PATCH /api/v1/ops/leads/:id`
- Server routes are registered in `core-operations/backend/src/routes.ts`; the real persisted model is `Lead` in `core-operations/backend/prisma/schema.prisma`.
- This is a real, tenant-backed flow in live mode and a coherent demo in demo mode.

### 9) Search works locally; “Ask FoundAI” is real-mode only
- Screen: `apps/foundingos-mobile/app/(app)/(tabs)/search.tsx`.
- Plain search uses `searchCatalogue(...)` from `apps/foundingos-mobile/lib/nav-directory.ts`; it is entirely local and always works.
- The smaller “what needs my attention” answers come from `apps/foundingos-mobile/lib/ai-command-bar.ts`, which uses the approvals queue. That queue has demo/real switching, so this part works in demo mode.
- The explicit “Ask FoundAI” button calls `askFoundAiQuestion(...)` -> `POST /api/v1/ops/ai/ask` (`lib/ai-command-bar.ts`, `lib/core-operations-api.ts`).
- Server behavior (`core-operations/backend/src/ai.ts`):
  - requires `AI_ENABLED === 'true'`
  - requires `ANTHROPIC_API_KEY`
  - only answers from recent tenant `WorkspaceRecord` rows
  - filters citations to records actually supplied
  - writes a `WorkspaceAuditEvent` with action `ai.asked`.
- Important gap:
  - there is **no** demo fallback here.
  - Demo users can still see the Ask FoundAI card, but the call will fail without a real session and configured AI backend.

## Gaps, Dead Ends, and Web/Mobile Divergence

### Dead ends / broken next steps
- ~~`apps/foundingos-web/app/login/page.tsx` pushes to `/survey`~~ — **FIXED**: `/login` now authenticates against `POST /api/v1/auth/login` via `apps/foundingos-web/app/api/session/login/route.ts` and lands on the real `apps/foundingos-web/app/workspace/page.tsx`.
- ~~`apps/foundingos-web/app/api/billing/checkout/route.ts` defaults success/cancel back to `/onboarding?...`, but `apps/foundingos-web` has no `/onboarding` route~~ — **FIXED**: defaults now point to `/workspace` (real page). Note: nothing in this app currently calls this endpoint, so this was a latent bug rather than a reachable dead end.
- ~~`apps/foundingos-web/app/invite/[token]/page.tsx` succeeds, then hands off to the broken `/login` page~~ — **FIXED**, see above; the invite → login → workspace handoff now works end-to-end on the website, and now also hands the session into `apps/foundingos-console` automatically (see Console Web App Journey §2b).
- `apps/foundingos-console/app/founder/FounderConsolePage.tsx` links “All workflows” to `/dashboard`, but `/dashboard` only redirects to `/founder`, which is admin-only.

### Preview/demo flows that do not persist to the tenant-scoped backend
- Marketing website preview access (`apps/foundingos-web/app/access/page.tsx`) writes `PreviewVisitor` rows in `packages/db/prisma/schema.prisma`, not Core.Operations tenant data.
- Marketing website feedback writes `SurveyEntry` rows in `packages/db/prisma/schema.prisma`, not tenant-scoped Core.Operations records.
- Most console web modules (`packages/ui/src/modules/*.tsx`, `packages/ui/src/console.tsx`, `packages/ui/src/crm.tsx`) are seeded or client-state illustrative flows.
- Console FoundAI uses local knowledge matching and same-origin demo endpoints, not Core.Operations `/api/v1/ops/ai/ask`.
- Mobile onboarding in demo mode is local-only.
- Mobile CRM in demo mode is local-only.

### Places a new user can get stuck
- Website invite recipients may be forced through `/access` first when preview gating is on (`apps/foundingos-web/middleware.ts`).
- ~~After accepting a website invite, the user lands on the broken website `/login` flow~~ — **FIXED**, `/login` now works.
- Mobile demo users can open Workspaces and module screens that claim to be live, but those module screens require real Core.Operations auth and have no demo fallback (`apps/foundingos-mobile/app/workspace/[workspace]/[module].tsx`).
- Mobile demo users can tap “Ask FoundAI” and hit auth/configuration failures because that feature has no demo path.

### Deprecated / legacy brand references still visible
- Console still exposes `/foundthat`, `/meat`, and `/crypto` routes (`apps/foundingos-console/app/foundthat/page.tsx`, `app/meat/page.tsx`, `app/crypto/page.tsx`).
- `apps/foundingos-console/app/brand-config.ts` still lists FoundMeat, FoundThat, and FoundCrypto in the main dashboard table.
- By contrast, mobile’s current workspace catalogue is the unified seven-workspace model only (`apps/foundingos-mobile/lib/workspace-modules.ts`), so legacy brands are not first-class mobile workspaces.
- The one clearly removed legacy behavior I found is the scraper: `apps/foundingos-console/app/api/superdash/scraper/run/route.ts` returns that the legacy scraping workflow has been removed.

### Web/mobile divergence
- **Website**: mostly static marketing + preview gating; only the invite flow creates a real Core.Operations user.
- **Console web app**: mostly illustrative/admin/tester surfaces; some real persistence exists, but it is often via foundingos-console-local APIs backed by **legacy per-brand** `packages/db` models, not Core.Operations tenant models.
- **Mobile**: the strongest real tenant-backed product path today. Live mode uses Core.Operations auth, `TenantOnboarding`, `Lead`, `WorkspaceRecord`, `AgentAction`, and workspace event routes directly.
- **Mobile is ahead of web console** for real tenant-scoped operations.
- **Console web still exposes legacy brands** that mobile’s unified workspace catalogue has already left behind.
