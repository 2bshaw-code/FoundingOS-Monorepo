# FoundingOS — Single Schema Migration Plan (Phase 32)

**Status: planning document. No schema or code changes should be made from
this plan until it has been reviewed and explicitly approved — this is the
Phase 32 deliverable and gate, per the Reliability & Resilience /
Schema Unification cycle spec.**

## 1. What "unified schema" already means in this repo

Two schemas exist side by side today, and they are **not** equally legacy:

| Schema | Location | Status |
|---|---|---|
| **`wros`** (Workspace Records / Operations Schema) | `core-operations/backend/prisma/schema.prisma` | **Already the unified model.** `TenantSuiteLicense`, `TenantWorkspace`, `WorkspaceRecord`, `AgentAction`, `Event`, `TelemetryEvent` are all suite-agnostic, tenant-scoped, and are the real destination for every FoundingOS suite (`core_operations`, `core_workforce`, `core_intelligence` all read/write into it, directly or via HTTP). |
| **`packages/db` schema** (no named Postgres schema — legacy default `public`) | `packages/db/prisma/schema.prisma` | **The actual legacy schema.** Pre-FoundingOS, per-brand, one row per brand rather than per tenant. Five models already carry `@deprecated` Prisma doc-comments (Phase 25): `Brand`, `BrandMetric`, `BrandSubscription`, `CrmDeal`, `BrandFinance`. |

This means the earlier phase spec's proposed new model names
(`TenantRecord`, `TenantWorkflow`, `TenantAction`) **already exist in
substance** as `WorkspaceRecord` (generic per-tenant/workspace/module
record — covers CRM deals, jobs, candidates, invoices, etc. via its
`module`/`data` JSON shape) and `AgentAction` (governed action lifecycle:
propose → decide → execute → reverse). **Recommendation: do not create a
second, differently-named unified model family.** The migration target is
"move the five legacy `packages/db` models into `wros`'s existing
`WorkspaceRecord`/`TenantSuiteLicense` shapes," not "build a third schema."
This keeps the eventual model count down and avoids the same
schema-duplication problem this migration is meant to resolve.

## 2. Full reference audit (as of this pass)

### 2.1 Legacy models and their real readers/writers

| Legacy model | Readers/writers found | Notes |
|---|---|---|
| `Brand` | No direct `prisma.brand.*` call sites found outside `packages/db` itself. | Likely already fully decoupled at the application layer — `packages/config/src/suites.ts`'s suite registry is the live source of truth for brand/suite metadata now. Confirm via a full-text `grep` immediately before any deletion, since this audit is scoped to `.ts`/`.tsx` and may miss dynamic access. |
| `BrandMetric` | • `apps/foundingos-console/app/superdashboard/brand-metric-store.server.ts` (read + upsert)<br>• `apps/foundingos-console/app/superdashboard/scraping-store.server.ts` (read)<br>• `apps/foundingos-console/app/superdashboard/server/tester-metrics.server.ts` (read)<br>• **12 per-brand console "scrape/refresh" cron routes** — `apps/{retail,retail-console-starter,meat,meat-console-starter,crypto,talent,health,finance,logistics,logistics-console-starter,foundthat,foundthat-console-starter}-console*/app/api/scrape/refresh/route.ts` — each upserts a synthetic engagement number into `BrandMetric` on a cron/Vercel schedule. | **Important audit finding, not a scraping violation**: despite the route path `api/scrape/refresh`, these routes perform no third-party network calls — they generate a deterministic synthetic engagement signal (hash-seeded, documented in-file as "Synthetic scraper: no external network calls, no paid APIs"). The `SCRAPING_DISABLED` kill switch (docs/deprecations.md) governs *real* third-party scraping (the former FoundThat data-collection pipeline) and does not gate these routes — they were never real scraping, just misleadingly named. This is naming debt, not a policy violation, but it means 12 live cron endpoints across still-deployed per-brand consoles are actively writing to a `@deprecated` table today. |
| `BrandSubscription` | No direct call sites found outside `packages/db`/its own migrations. | Likely dead — the real subscription/tier concept is `TenantSuiteLicense.planTier` in `wros`. Confirm before removal. |
| `CrmDeal` | No direct call sites found outside `packages/db`/its own migrations. | The doc-comment says it also backs "the SuperDash cross-brand pipeline rollup," but no current `.ts`/`.tsx` file computes that rollup from `CrmDeal` — likely stale/never wired up, or computed from `WorkspaceRecord` (module `crm`) already. Confirm before removal. |
| `BrandFinance` | No direct call sites found outside `packages/db`/its own migrations. | Same caveat as `CrmDeal` — doc-comment describes a role ("Finance module... AND Brand-console earnings") that may already be served by `WorkspaceRecord` (module `payments`/`finance`) in `wros` instead. |

### 2.2 The three core services and the aggregator

- **`core-operations`, `core-workforce`, `core-intelligence` backends**:
  zero references to any `packages/db` model. They run against `wros`
  exclusively via their own Prisma clients (`core-operations/backend/prisma`,
  etc., all pointed at the same Postgres database but the `wros` Postgres
  schema). **No migration work is needed inside these three services** —
  they were already built against the unified model from day one.
- **`founder-os/` aggregator**: per Phase 24's decision (retire, do not
  migrate — see docs/deprecations.md), it runs against its own isolated
  `founder_os` Postgres schema with a third, unrelated legacy model set
  (`Company`, `CompanyModule`, `PackageApplication`). It is excluded from
  the npm workspace and inert. **Out of scope for this migration** — it is
  being retired, not migrated.

### 2.3 What this narrows the plan to

The only real migration surface is **within `apps/foundingos-console`'s
SuperDashboard** (3 server files) **and the 12 per-brand console
scrape/refresh cron routes**, moving them from `packages/db`'s
`BrandMetric`/`AnomalyLog`/`EngagementLog` tables to tenant-scoped rows in
`wros`. `BrandSubscription`, `CrmDeal`, and `Brand` itself appear to have no
live readers at all pending final confirmation (see §2.1) — if confirmed
dead, they can be dropped in Phase 35 without any data migration, only a
`prisma migrate` to drop the tables.

## 3. Model mapping

| Legacy (`packages/db`) | Unified target (`wros`, `core-operations`) | Mapping rule |
|---|---|---|
| `Brand.slug`/`Brand.name` | `TenantSuiteLicense` (keyed by `tenantId`) + the suite registry (`packages/config/src/suites.ts`) | A `Brand` row conceptually becomes one `tenantId`. There is no automatic 1:1 row migration — brands were never tenants; a manual mapping table (brand slug → real or synthetic `tenantId`) must be produced by whoever owns this decision, since the SuperDashboard's "brand" concept predates real multi-tenancy. |
| `BrandMetric` (one row per brand) | `WorkspaceRecord` with `module = 'engagement_metric'`, one row per **tenant** (not brand), `data` JSON holding `{ totalEngagement, anomalyScore, categoryBreakdown }` | Straightforward field-for-field JSON migration once each brand has a `tenantId` mapping (see above). `AnomalyLog`/`EngagementLog` (siblings, not yet marked `@deprecated` but same shape/lifecycle) can become `WorkspaceAuditEvent` rows or `TelemetryEvent` rows (`suite: 'platform'`, `name: 'engagement.snapshot'`) — **recommend `TelemetryEvent`**, since these are analytics/observability rows, not tenant-facing business records, matching the same `Event` vs `TelemetryEvent` distinction established in Phase 28. |
| `BrandSubscription` | `TenantSuiteLicense.planTier` | Only if any live row data exists — audit (§2.1) suggests this table may already be unused. |
| `CrmDeal` | `WorkspaceRecord` with `workspace = 'retail'` (or per-brand equivalent), `module = 'crm'` | This is exactly the shape `WorkspaceRecord` already uses for the live retail CRM pipeline (confirmed via `core-operations`'s `/platform/workspaces/:workspace/:module/records` routes) — if any real `CrmDeal` rows exist, they migrate as records in that same table, not a new one. |
| `BrandFinance` | `WorkspaceRecord` with `module = 'finance'` or `'payments'` | Same reasoning as `CrmDeal`. |

## 4. Transformation rules

1. **Tenant identity is the hard problem, not the data shape.** Every rule
   above is a simple JSON reshape *except* establishing what `tenantId`
   each historical brand-scoped row belongs to. Per-brand consoles
   (`apps/retail-console`, etc.) predate the `Tenant`/`TenantSuiteLicense`
   model entirely — they were never tenant-scoped. Before any data
   migration script is written, someone with product/business context must
   decide: (a) each legacy brand becomes exactly one synthetic/internal
   tenant (simplest, preserves history 1:1), or (b) legacy per-brand data
   is treated as historical/demo data with no real-tenant equivalent and is
   **not** migrated at all, only archived. Given these routes generate
   synthetic engagement numbers rather than real customer data (§2.1),
   **(b) is very likely the right call** — this would reduce Phase 33/35
   to "cut the writers over, do not migrate the deprecated rows."
2. **JSON field renames**: `brandName`/`brandSlug` → dropped (superseded by
   `tenantId` + `workspace`); `lastUpdated` → `updatedAt` (already the
   `WorkspaceRecord` convention); `categoryBreakdown`/`anomalyScore` moves
   into `WorkspaceRecord.data` unchanged.
3. **No FX/currency conversion logic needs to change** — `BrandFinance`/
   `CrmDeal`'s `currency` field maps directly to the equivalent field
   already supported in `WorkspaceRecord.data` for existing `finance`/`crm`
   modules elsewhere in the codebase.

## 5. Phased cutover approach

1. **Phase A — Read-only legacy support (no code changes yet)**: this
   document. Confirm with whoever owns the SuperDashboard whether
   §4 option (a) or (b) applies. This decision changes the entire scope of
   Phases 33/35 from "build a migration script" to "just cut over the
   writers," so it must be resolved first.
2. **Phase B — Dual-write (Phase 33, only if option (a) is chosen)**: the
   12 scrape/refresh routes and the SuperDashboard's own
   `brand-metric-store.server.ts` write to *both* the legacy `BrandMetric`
   table and a new `WorkspaceRecord` row, keyed by the agreed synthetic
   `tenantId` mapping. Reads continue from the legacy table (source of
   truth) during this window.
3. **Phase C — Cutover reads**: SuperDashboard's three server files switch
   their `findMany`/`findUnique` calls to `wros`'s `WorkspaceRecord`
   instead of `packages/db`'s `BrandMetric`. Dual-writes continue for one
   release cycle as a safety net.
4. **Phase D — Stop legacy writes (Phase 35)**: remove the legacy-table
   write half of the dual-write once reads have been on the unified table
   for a full release with no regressions reported.
5. **Phase E — Drop legacy tables**: a final `prisma migrate` against
   `packages/db/prisma/schema.prisma` to drop `BrandMetric`,
   `BrandSubscription`, `CrmDeal`, `BrandFinance`, and (if confirmed dead)
   `Brand` itself, plus their sibling `AnomalyLog`/`EngagementLog` tables
   once their `TelemetryEvent` replacement is confirmed live.

If option (b) from §4.1 is chosen instead, Phases B/C collapse into a
single step: repoint the 12 cron routes and the 3 SuperDashboard files at
new `TelemetryEvent`/`WorkspaceRecord` writes directly (no legacy-data
carry-forward), and Phase D/E happen immediately after, since there is no
dual-write window to wait out.

## 6. Rollback strategy

- Every step in §5 is additive until Phase D — the legacy tables and their
  writers are never modified or removed before Phase D, so any regression
  found in Phase C can be rolled back by simply reverting the SuperDashboard
  read-path change; no data loss occurs because the legacy tables were
  never touched.
- Phase E (table drop) is the only irreversible step. Standard practice
  applies: take a full `pg_dump` of the four (or five) tables immediately
  before running the drop migration, retained for at least one full release
  cycle.
- Because the mapping in §3 depends on resolving §4's tenant-identity
  question, no migration script should be written speculatively — a wrong
  assumption here (e.g., assuming brands map 1:1 to existing real tenants
  when they don't) would corrupt tenant isolation, which is the one thing
  this entire migration must not risk.

## 7. Effort, risk, and data volume assessment

| Item | Effort | Risk | Notes |
|---|---|---|---|
| Resolving §4's tenant-identity question | Low (a decision, not code) | **Blocking** — everything downstream depends on this | Needs a product/business decision, not an engineering one. Recommend defaulting to option (b) (do not migrate synthetic demo data) unless someone confirms real customer data lives in these tables. |
| Confirming `Brand`/`BrandSubscription`/`CrmDeal`/`BrandFinance` have zero live readers (§2.1) | Low — one `grep` pass plus a check of any admin/reporting scripts outside `apps/`/`packages/` (e.g. one-off ops scripts) not covered by this audit's glob | Low | If confirmed dead, these three models can skip the dual-write phase entirely and go straight to Phase E. |
| Migrating `BrandMetric` writers (12 cron routes + 3 SuperDashboard files) | Medium — 15 files touched, but each is a small, mechanical, well-isolated change | Low-medium — these are internal/demo-tier consoles, not tenant-facing production data paths for paying customers | The actual code change per file is small; the volume of files (15) is the main cost driver, not complexity. |
| Data volume | Negligible | Low | These are synthetic per-brand counters (single-row-per-brand tables), not customer transactional data — at most ~12 rows total across `BrandMetric`/`BrandSubscription`/`CrmDeal`/`BrandFinance` combined (one per legacy brand). This is **not** a large-data migration in the traditional sense. |
| Tenant-tier-specific risk | None identified | N/A | No tenant currently depends on these legacy tables for real operational data — all real tenant data already lives in `wros` via `WorkspaceRecord`/`AgentAction`, confirmed in §2.2. This migration is purely about retiring internal/demo tooling, not customer-facing risk. |

## 8. Recommendation

Given the audit above, the pragmatic, lowest-risk path is:

1. Get an explicit answer on §4's tenant-identity question (owner: whoever
   is accountable for the SuperDashboard/demo-tier consoles).
2. If, as expected, these tables hold only synthetic/demo data with no real
   tenant mapping, **skip the dual-write phase (Phase 33) entirely** and
   go straight from "confirm no real data" to "repoint the 15 writer/reader
   files at `wros`, then drop the legacy tables" — this collapses Phases
   32–35 into a single, much smaller Phase 35 pass once this plan is
   approved, rather than a multi-release dual-write migration.
3. Treat `Brand`, `BrandSubscription`, and `CrmDeal` as candidates for
   immediate removal (pending the zero-live-reader confirmation in §2.1)
   without any migration step at all, since no code path was found
   reading them.

This plan intentionally does not propose new `TenantRecord`/
`TenantWorkflow`/`TenantAction` models (§1) — the existing
`WorkspaceRecord`/`AgentAction`/`TenantSuiteLicense` models in `wros`
already fill that role, and introducing parallel models with different
names would recreate the exact fragmentation this migration exists to
remove.
