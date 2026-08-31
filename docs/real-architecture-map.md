# FoundingOS — Real Architecture Map

This is a factual map of what actually exists and runs in this codebase today, written in
response to a proposed "master box" folder structure that didn't match reality (fictional
brands like "brandos"/"marketos"/"commerceos"/"quantumos" as separate apps, a monolithic
`/foundingos/core/server.ts`, duplicate Guardian/Autonomous files, etc.). Nothing here is
new code — it's a map of what's real, live, and verified working.

## 1. Ground truth: 26 apps, not one server

There is no single `/foundingos` monolith. This is an npm-workspaces monorepo with **26
independently deployed Next.js apps** under `apps/*`, each its own Vercel project, plus
shared code in `packages/*`:

- **9 brand marketing websites**: `foundingos-web`, `retail-web`, `meat-web`, `foundthat-web`,
  `talent-web`, `crypto-web`, `finance-web`, `health-web`, `logistics-web`
- **16 brand consoles**: one Growth + one Starter console per brand (retail, meat, foundthat,
  talent, crypto, finance, health, logistics)
- **1 master console**: `foundingos-console` — home of SuperDashboard, Guardian, the tester
  program, and all cross-brand intelligence described below

The real 8 brands are **FoundRetail, FoundMeat, FoundThat, FoundTalent, FoundCrypto,
FoundFinance, FoundHealth, FoundLogistics** — defined once in `packages/config/src/index.ts`.
QuantumOS, IntelligenceOS, and SystemOS are **package tiers/add-ons** a brand can be sold, not
separate brands or apps.

## 2. Auth & sessions

- `apps/foundingos-console/app/tester/session.ts` — the two real cookies:
  `fo_tester_session` (tester) and `fo_tester_admin_session` (admin). Pure Web Crypto tokens,
  safe in both middleware and route handlers.
- `apps/foundingos-console/middleware.ts` — the real global gate. Per-route branches for
  `/tester/admin`, `/tester/dashboard|survey|demo`, and `/finance`/`/crypto`. Admin bypass on
  the tester-page branch (added this session) and stale-cookie clearing.
- `apps/foundingos-console/app/api/tester/login/route.ts` — `isSuperFounderAdmin(email,
  password)` in `tester-data.ts` is the single real "root admin" check
  (`2bshaw@gmail.com` + a private `SUPER_FOUNDER_ADMIN_PASSWORD` secret). On match: signs an
  admin-scoped token, clears any tester cookie, redirects to `/superdashboard`.

## 3. Guardian (category-level intelligence)

- `packages/ui/src/superdash/SuperDashGuardian.ts` — original static enforcement list
  (isolation/lockdown/brand-consistency), unchanged all session.
- `packages/ui/src/superdash/SuperDashSurveyGuardian.ts` — real, additive Guardian logic:
  detects missing/blank answers, zero-engagement categories, and genuine broken routes (via
  a live HTTP probe, not a static list).
- `apps/foundingos-console/app/system/guardian/page.tsx` — the real page rendering both,
  currently open (no auth gate).

## 4. Autonomous (engagement-driven decisions)

- `packages/ui/src/superdash/SuperDashAutonomous.ts` — generic, category-tile-scoped:
  auto-coach ≤0.7, auto-optimize ≥1.35. Unchanged.
- `apps/foundingos-console/app/superdashboard/brand-metric-store.server.ts` — the real
  **brand-level** engagement scoring (`computeAnomalyScore`) and high-engagement trigger
  (`shouldTriggerHighEngagement`), upgraded this session: threshold 1.20, capped ~1.3–1.4,
  requires totalEngagement ≥3 and ≥2 distinct categories before firing.

## 5. BrandMetric (real, live Postgres data)

- Prisma model `BrandMetric` (table `brand_metrics`) — `brandName` (unique), `totalEngagement`,
  `anomalyScore`, `categoryBreakdown` (JSON), `lastUpdated`.
- Written by `upsertBrandMetricOnSubmission()` in `brand-metric-store.server.ts` on every
  real survey submission, for all 8 brands (verified live, non-zero, distinct per brand).
- Read by `SuperDashBrandMetricsPanel.tsx` (packages/ui) — the real "Live Brand Engagement"
  panel in SuperDashboard. The older mock "Brand performance matrix" table (revenue/orders/
  marketing% columns) still exists alongside it — deliberately not deleted, since it drives
  other widgets (Quantum Sync Layer node count, risk heatmap) with fields BrandMetric has no
  equivalent for.

## 6. Logging

Real Prisma models, live in Postgres: `SurveyEntry` (table `survey_entries`), `TesterSession`
(`tester_sessions`), `AnomalyLog` (`anomaly_logs`), `EngagementLog` (`engagement_logs`),
`BrandMetric` (`brand_metrics`). `AnomalyLog`/`EngagementLog` hold both the original
category-level rows and the newer brand-level high-engagement trigger rows (nullable
`brandName`/`totalEngagement`/`categoryBreakdown` columns added additively).

## 7. Dashboard

`apps/foundingos-console/app/superdashboard/SuperDashboardPage.tsx` is the real,
single dashboard shell (not 6 separate widget files) — composing:
`SuperDashQuantumTiles`, `SuperDashSurveyPanel` (Customer/Buyer/Investor), `SuperDashSurveyFeedPanel`
(cross-brand survey feed + Anomaly/Autonomous/Guardian summaries), `SuperDashBrandMetricsPanel`
(live brand engagement), plus the original mock portfolio table/heatmap/sync layer.

## 8. Route health & stability testing

- `apps/foundingos-console/app/superdashboard/route-health.server.ts` — `checkAllBrandRouteHealth()`
  is the real, live route-health check across all 8 brands (27 real routes: 13 for retail's
  full survey flow, 2 each × 7 for the others). Verified 27/27 healthy.
- The 3 real stability checks, run before every deploy this session: `npm run
  verify:brand-assets`, `verify:superdashboard-isolation`, `verify:lockdown` (all in
  `/scripts`). Plus `tsc --noEmit` and `next build` per touched app.

## 9. Survey pipeline (per brand)

- `retail-web`: full pipeline — `/landing` (sign-in), `/home`, `/retail`, `/retail/console`,
  10 category pages under `/survey/*`, `/survey/thankyou`, all forwarding to
  `foundingos-console`'s `/api/superdash/survey-feed`.
- The other 7 brand websites: a single `/survey` page (category dropdown, same 10 shared
  category keys) + `/survey/thankyou`, same forwarding pattern.

## 10. Packages & Quantum visuals (already existed pre-session)

- `packages/config/src/package-model-d.ts`, `pricing-engine.ts`, `quantum-recommendation.ts`
  — real pricing/package logic, predates this session's work.
- `packages/config/src/quantum/*` (client, orchestration layer, enrichment, modules) and
  `packages/ui/src/Quantum*`/`quantum-*` components — real, existing Quantum visual/data
  layer, used across brand consoles and websites.

## 11. Database

Real Prisma Postgres (Vercel Marketplace, "Prisma Postgres"), connected to both
`foundingos-console-prep` and `retail-web-prep`. 7 real migrations applied, zero drift,
verified against a scratch shadow database each time before touching production.
