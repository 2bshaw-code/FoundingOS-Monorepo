# FoundingOS — Deprecations

Record of legacy brands, code paths, and infrastructure removed or
superseded during the FoundingOS restructure. See
[migration-map.md](./migration-map.md) for the full directory/route/env/table
rename tables and [suite-and-module-architecture.md](./suite-and-module-architecture.md)
for the current suite model these deprecations were folded into.

## Legacy per-brand schema models (`packages/db`)

**Phase 25.** `packages/db/prisma/schema.prisma` still defines five legacy
per-brand Prisma models left over from the pre-FoundingOS multi-brand era:
`Brand`, `BrandMetric`, `BrandSubscription`, `CrmDeal`, and `BrandFinance`.
All five now carry a `/// @deprecated` Prisma doc comment, which Prisma
Client propagates into the generated TypeScript types — editors will show
a strikethrough on `prisma.brand`, `prisma.crmDeal`, `prisma.brandFinance`,
`prisma.brandMetric`, and `prisma.brandSubscription` wherever they're used.

- **Still actively read** by the SuperDashboard in
  `apps/foundingos-console/app/superdashboard/` (`brand-metric-store.server.ts`,
  `scraping-store.server.ts`, `server/tester-metrics.server.ts`), plus 12
  per-brand console cron routes (`apps/*-console*/app/api/scrape/refresh/route.ts`)
  that write synthetic engagement data into `BrandMetric` — do not delete
  these models until that surface is migrated off them.
- **Replacement path**: the unified `wros` schema's existing
  `WorkspaceRecord`/`TenantSuiteLicense`/`TelemetryEvent` models (not a new
  model family) — see [single-schema-migration.md](./single-schema-migration.md)
  (Phase 32) for the full audit, model mapping, and phased cutover plan.
- **Timeline**: no removal date is set. These models stay in place, marked
  deprecated, until the SuperDashboard's brand-panel/CRM/finance widgets
  are re-pointed at the unified schema. No ESLint rule was added to block
  new usage — this repo currently has no ESLint config for any active app
  (`next lint` falls back to Next's defaults with no local override), so a
  new lint rule would be new tooling investment rather than a small
  addition; the Prisma `@deprecated` JSDoc was judged the lower-cost,
  immediately-effective alternative. Revisit if/when ESLint config is
  added for these apps.

## Removed brands

| Legacy brand | Status | Notes |
|---|---|---|
| **FoundMeat** | Fully removed | No app root, backend, frontend, or mobile app remains in `apps/`. The `meat` entry in `packages/config/src/index.ts`'s legacy brand registry is retained only so old lookups by `BrandSlug` don't throw, and is explicitly labelled `FoundMeat (deprecated)` — it must not be surfaced in navigation, marketing pages, or mobile apps. Listed in `packages/config/src/suites.ts`'s `deprecatedBrands`. |
| **FoundCrypto** | Fully removed | Same treatment as FoundMeat: no live app, legacy registry entry labelled `FoundCrypto (deprecated)`, listed in `deprecatedBrands`. |
| **FoundThat scraping** | Removed | Scraping-based data collection for the CRM/intelligence surface (formerly FoundThat) has been disabled. `SCRAPING_DISABLED=true` is set in both `.env.demo` and `production.example.env` and is treated as a hard kill switch, not a suggestion — no code path should perform third-party scraping regardless of environment. |

## Superseded (not removed, but no longer primary)

- **`founder-os/` aggregator** (`founder-os/frontend`, `founder-os/backend`,
  `founder-os/desktop`) — **Phase 24 decision: retire, do not migrate.**
  Audited and confirmed:
  - Not listed in the root `package.json` npm `workspaces` array — already
    excluded from `npm install`, `tsc --noEmit`, and every build/CI script
    that targets the active monorepo.
  - Runs against its own isolated Postgres schema (`founder_os`, see
    `founder-os/backend/.env.example`), fully separate from the `wros`
    schema used by `core-operations`/`core-workforce`/`core-intelligence`
    and from `packages/db`'s shared schema.
  - Its own legacy models (`Company`, `CompanyModule`, `PackageApplication`)
    are a *different* legacy system from the `Brand`/`CrmDeal`/
    `BrandFinance` models in `packages/db` (see Phase 25 below) — there is
    no "lead-sync" module by that name in this codebase today; the earlier
    [api-review.md](./api-review.md) note describing one is stale and
    should be treated as historical, not actionable.
  - No app in the active workspace (`apps/foundingos-web`,
    `apps/foundingos-console`, or any `core-*-web`/`core-*-console`)
    imports from or proxies to `founder-os/backend` or
    `founder-os/frontend`.
  - Its dependency on the old `@founder-os/*` package scope was
    intentionally **not** updated in the Phase 23 rename — renaming it
    would imply it's still active tooling; it is left pointing at the
    pre-rename names as a passive signal that it is out of scope.
  - **Action for a future pass:** delete `founder-os/` from the repo once
    its `founder_os` Postgres schema (if any production data exists there)
    has been exported or confirmed empty. Until then it is inert dead code,
    not a running or reachable service.
- **Per-brand consoles** (`apps/*-console`, `apps/*-console-starter`) — superseded
  by the unified FoundingOS console shell (`apps/foundingos-web`) with
  suite-based, feature-flagged navigation. Legacy per-brand console
  directories remain in the tree during the migration window; see
  [migration-map.md](./migration-map.md) for their disposition.
- **Legacy brand registry** (`packages/config/src/index.ts`) — superseded by
  the suite registry (`packages/config/src/suites.ts`) for anything
  customer-facing (pricing, feature flags, console navigation). The legacy
  registry is retained only for backward-compatible lookups during
  migration; new code should use the suite registry.
- **`shared/ui/components/BrandLogo.tsx`, `shared/ui/components/BrandCard.tsx`,
  `shared/ui/src/index.tsx`** — not imported by any app in this repository.
  Retained for historical reference only; do not add new imports.

## Verification

- `npm run build` (root) runs a brand-asset and SuperDashboard-isolation
  verification step that fails if forbidden legacy brand symbols
  (e.g. hardcoded FoundMeat/FoundCrypto logos) are used in place of the
  current FoundingOS/Core-suite assets.
- `git diff --check` is expected to pass with no whitespace errors.
- Any new PR that reintroduces a `foundmeat-mobile`/`foundcrypto-mobile` app
  root, restores scraping code, or removes the `(deprecated)` labelling from
  the legacy brand registry should be treated as a regression.
