# FoundingOS — Single Schema Migration Plan (Phase 32, revised)

**Status: planning document, revised after a corrected code audit (see §2).
The original version of this document (first pass, Phase 32) proposed
treating four legacy models identically. That proposal was wrong for three
of the four — this revision corrects it before any schema/code changes are
made.**

## 1. What "unified schema" already means in this repo

Two schemas exist side by side today, and they are **not** equally legacy:

| Schema | Location | Status |
|---|---|---|
| **`wros`** (Workspace Records / Operations Schema) | `core-operations/backend/prisma/schema.prisma` | **Already the unified model.** `TenantSuiteLicense`, `TenantWorkspace`, `WorkspaceRecord`, `AgentAction`, `Event`, `TelemetryEvent` are all suite-agnostic, tenant-scoped, and are the real destination for every FoundingOS suite (`core_operations`, `core_workforce`, `core_intelligence` all read/write into it, directly or via HTTP). |
| **`packages/db` schema** (no named Postgres schema — legacy default `public`) | `packages/db/prisma/schema.prisma` | Contains five models with a Phase 25 `@deprecated` doc-comment: `Brand`, `BrandMetric`, `BrandSubscription`, `CrmDeal`, `BrandFinance`. **Deprecated does not mean dead** — see §2 below. Only one of the five is actually unused. |

This means the earlier phase spec's proposed new model names
(`TenantRecord`, `TenantWorkflow`, `TenantAction`) **already exist in
substance** as `WorkspaceRecord` (generic per-tenant/workspace/module
record) and `AgentAction` (governed action lifecycle). **Recommendation:
do not create a second, differently-named unified model family** — any
future migration target for these tables is "move into `wros`'s existing
`WorkspaceRecord`/`TenantSuiteLicense` shapes," not "build a third schema."

## 2. Corrected reference audit — this is the important part

The first pass of this document (written before this revision) claimed
`Brand`, `BrandSubscription`, and `CrmDeal` had "no direct call sites
found... likely dead." That claim was based on a search scoped too
narrowly (roughly: direct `prisma.<model>.` call sites in a quick pass) and
missed the actual data-access layer these features go through. A full
grep + import-graph check (this revision) found the following:

| Legacy model | Live readers/writers found | Verdict |
|---|---|---|
| `Brand` | No direct `prisma.brand.*` call sites found anywhere outside `packages/db` itself. | **Confirmed dead.** The suite/brand registry is `packages/config/src/suites.ts` now; nothing reads this table. Still worth a final full-text grep immediately before any drop migration, since a table drop is irreversible, but nothing found in `.ts`/`.tsx` across two independent passes. |
| `BrandMetric` | • `apps/foundingos-console/app/superdashboard/brand-metric-store.server.ts` (upsert on survey submission, read for the SuperDash brand panel)<br>• `apps/foundingos-console/app/superdashboard/scraping-store.server.ts` (read)<br>• `apps/foundingos-console/app/superdashboard/server/tester-metrics.server.ts` (read)<br>• **12 per-brand console "scrape/refresh" cron routes** (`apps/{retail,retail-console-starter,meat,meat-console-starter,crypto,talent,health,finance,logistics,logistics-console-starter,foundthat,foundthat-console-starter}-console*/app/api/scrape/refresh/route.ts`), each upserting a synthetic engagement number on a schedule. | **Confirmed synthetic/internal-only.** Despite the `scrape/refresh` path name, these routes make no third-party network calls — they write a deterministic, hash-seeded synthetic engagement signal (documented in-file as "no external network calls, no paid APIs"). All six readers/writers are internal SuperDash tooling, not a customer-facing feature. **This is the one model in the original list that really is disposable.** |
| `BrandSubscription` | • `apps/foundingos-console/app/superdashboard/monetary-store.server.ts` (`readAllBrandSubscriptions`, `setBrandSubscription`)<br>• `apps/foundingos-console/app/api/superdash/package-subscriptions/route.ts` (GET is public/read-only, POST requires a real signed-in session)<br>• `packages/ui/src/superdash/SuperDashCommercialPanel.tsx`<br>• `packages/ui/src/real-monetary.tsx` | **Live.** This is "Package Model D" — real, admin-set per-brand subscription tier/price/MRR/ARR, displayed in SuperDash's commercial panel. Values are set by a real admin action (not scraped or synthetic), per the model's own doc-comment. **Not disposable.** |
| `CrmDeal` | • `monetary-store.server.ts` (`readCrmDeals`, `createCrmDeal`)<br>• `apps/foundingos-console/app/api/crm/deals/route.ts` (public GET, authenticated POST)<br>• `apps/foundingos-console/app/api/superdash/pipeline-rollup/route.ts`<br>• `packages/ui/src/real-pipeline-value-panel.tsx`<br>• `packages/ui/src/real-monetary.tsx` (imported by `crm.tsx`, `console.tsx`, `brand-micro-dashboard.tsx`) | **Live.** Backs the real per-brand CRM pipeline value panel embedded in the shared brand console shell (`console.tsx`) — real deals, not sample data (this table replaced the previous hardcoded "£3.2k"-style placeholder text). **Not disposable.** |
| `BrandFinance` | • `monetary-store.server.ts` (`readBrandFinance`, `setBrandFinance`)<br>• `apps/foundingos-console/app/api/brand/finance/route.ts`<br>• `packages/ui/src/real-monetary.tsx` (imported by `packages/ui/src/modules/AccountingModule.tsx`) | **Live.** Backs the real per-brand finance/accounting panel (revenue/expenses/profit, aliased as brandRevenue/brandProfit for the brand-console view). **Not disposable.** |

**Net correction: of the five `@deprecated` models, only `Brand` and
`BrandMetric` have zero live production readers. `BrandSubscription`,
`CrmDeal`, and `BrandFinance` all back real, currently-displayed console UI
and must not be dropped or silently repointed without a proper
tenant-aware replacement design — that is materially more work than a
"repoint the readers" pass and is explicitly out of scope for this
revision.**

## 3. The three core services and the aggregator (unchanged from the first pass)

- **`core-operations`, `core-workforce`, `core-intelligence` backends**:
  zero references to any `packages/db` model. No migration work is needed
  inside these three services.
- **`founder-os/` aggregator**: per Phase 24's decision (retire, do not
  migrate), it runs its own isolated `founder_os` schema and is out of
  scope here.

## 4. Revised scope for Phase 35

Given §2, Phase 35 ("Legacy Model Removal") is scoped down to **only**:

- `Brand` — drop the table outright (zero readers, confirmed twice).
- `BrandMetric` — repoint its 3 SuperDashboard readers and 12 cron-route
  writers away from `packages/db`, then drop the table. The high-engagement
  trigger's writes into `AnomalyLog`/`EngagementLog` (which are **not**
  fully legacy — they also serve a still-active category-level anomaly
  feature, see their own schema doc-comments) move to `TelemetryEvent`
  instead of being dropped, since those two tables themselves are staying.

`BrandSubscription`, `CrmDeal`, and `BrandFinance` remain **deprecated but
untouched** — their `@deprecated` doc-comments and `docs/deprecations.md`
entries stand as a signal not to add new writers, but no removal or
migration work proceeds against them in this pass. A real migration for
these three would need: (a) a tenant-identity decision specific to each
(do these per-brand consoles map to real tenants going forward, or do they
stay as a separate non-multi-tenant demo/pre-launch product surface), and
(b) a proper multi-tenant-aware replacement design (new `WorkspaceRecord`
modules, a real per-tenant CRM/finance/subscription data model, and a
migration of the live data currently sitting in these tables) — not a
"repoint and drop" pass. That is tracked as explicit follow-up work, not
implicitly bundled into "Phase 35."

## 5. Model mapping (for the models actually in scope)

| Legacy (`packages/db`) | Unified target (`wros`, `core-operations`) | Mapping rule |
|---|---|---|
| `Brand` | *(none — dropped, not migrated)* | No live readers; the suite/brand registry in `packages/config/src/suites.ts` already replaced it. |
| `BrandMetric` (one row per brand) | `TelemetryEvent` with `suite: 'platform'`, `name: 'demo.engagement_snapshot'`, `tenantId: undefined` (no real tenant mapping exists for these brand-slug rows — see §2), `properties: { brand, totalEngagement, anomalyScore, categoryBreakdown }` | Uses the already-open, unauthenticated `POST /platform/telemetry` ingestion endpoint (Phase 28) rather than the tenant-scoped `WorkspaceRecord` model — these rows have no tenant to scope to, and forcing a fake `tenantId` mapping would be worse than being honest that this is internal/demo telemetry, not tenant business data. |
| `AnomalyLog`/`EngagementLog` brand-level trigger writes (the `brandName`/`totalEngagement`/`categoryBreakdown` fields only — **not** the whole table, which stays for category-level anomaly detection) | `TelemetryEvent` with `name: 'demo.engagement_anomaly'` | Same rationale as `BrandMetric` above — this was always the same code path (`upsertBrandMetricOnSubmission`'s high-engagement trigger) writing to three tables at once; it now writes one `TelemetryEvent` instead of three legacy rows. |
| `BrandSubscription`, `CrmDeal`, `BrandFinance` | *(not mapped in this pass — see §4)* | Deferred. |

## 6. Execution steps (this pass only)

1. Repoint `brand-metric-store.server.ts`'s `upsertBrandMetricOnSubmission`
   to emit `TelemetryEvent` rows via the ingestion endpoint instead of
   writing `BrandMetric`/`AnomalyLog`/`EngagementLog`.
2. Add a founder-only raw event query route
   (`GET /platform/telemetry/events`, mirroring the Phase 36 summary
   route's access gate) so the three SuperDashboard read paths
   (`brand-metric-store.server.ts`, `scraping-store.server.ts`,
   `server/tester-metrics.server.ts`) can read the migrated data back
   without a fake tenant scope.
3. Repoint the 12 cron routes' writes from `prisma.brandMetric.upsert(...)`
   to the same ingestion call.
4. Remove `Brand`, `BrandMetric` from `packages/db/prisma/schema.prisma`
   (keep `AnomalyLog`/`EngagementLog` — only their brand-level fields lose
   their writer, the tables themselves stay for category-level use) and
   add a migration dropping the two tables.
5. Update `docs/deprecations.md` and `docs/migration-map.md` to reflect
   the narrower, corrected scope.
6. Full type check across `apps/foundingos-console`, `packages/db`,
   `core-operations/backend`; run existing test suites; rebuild the
   esbuild bundle.

## 7. Rollback strategy

- Steps 1–3 are additive/behavioral only until step 4 — if the new
  `TelemetryEvent`-backed read paths show a regression, revert the code
  change; the legacy tables are untouched until step 4, so no data is at
  risk during that window.
- Step 4 (table drop) is the only irreversible step for `Brand`/
  `BrandMetric`. Take a `pg_dump` of both tables (and the brand-scoped rows
  in `AnomalyLog`/`EngagementLog`, in case those fields are still wanted
  for historical reference) immediately before running the drop
  migration.
- `BrandSubscription`/`CrmDeal`/`BrandFinance` are not touched at all in
  this pass, so there is nothing to roll back for them.

## 8. Effort, risk, and data volume assessment

| Item | Effort | Risk | Notes |
|---|---|---|---|
| `Brand` removal | Very low — drop only, no writers to repoint | Very low | Zero readers confirmed twice. |
| `BrandMetric` + brand-level `AnomalyLog`/`EngagementLog` migration | Medium — 15 files touched (3 SuperDashboard + 12 cron routes), plus one new backend route | Low — internal/demo-tier tooling only, no tenant-facing production data path | The volume of files (15), not complexity, is the main cost driver; each change is a small, mechanical repoint. |
| `BrandSubscription`/`CrmDeal`/`BrandFinance` | Not attempted this pass | N/A | Deferred — see §4 for what a real migration would require. |
| Data volume (`Brand` + `BrandMetric`) | Negligible | Low | Single-row-per-brand counter tables; at most ~8 rows combined (one per currently-configured brand). |

## 9. Recommendation

Proceed with the narrowed Phase 35 scope in §4/§6 now (Brand + BrandMetric
only). Treat `BrandSubscription`/`CrmDeal`/`BrandFinance` as a distinct,
separately-scoped future initiative — they are real, currently-displayed
product surfaces, not disposable synthetic data, and deserve their own
tenant-identity decision and migration design rather than being bundled
into a "collapse everything into one pass" cleanup.
