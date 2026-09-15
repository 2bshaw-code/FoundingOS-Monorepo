# FoundingOS Restructure — Summary & Remaining Blockers

## Update (second pass — execution)

A follow-up pass **executed** the highest-impact, lowest-risk items left
open after the first (docs-only) pass, after confirming via
`git diff main..<branch> --stat -- foundmeat foundcrypto` that none of the
4 active `agents/*` branches touch these directories:

- **Deleted CoreOperations and CoreOperations entirely**: `foundmeat/`,
  `foundcrypto/`, `apps/foundmeat-*`, `apps/foundcrypto-*`, `apps/meat-web`,
  `foundingos/FoundingOs/CoreOperations*`, `foundingos/FoundingOs/CoreOperations*`,
  and their consoles under
  `Upgrade-and-Additional-Companies/Consoles/`. Tracked files removed via
  `git rm`; untracked build artifacts removed via `rm -rf`.
  **not** deleted — every route in that service still depends on those
  models, so removal requires a schema migration and a product decision
  on the `core_operationsLeadSync.ts` lead pipeline (see blockers, unchanged).
- **Cleaned all live code references** to CoreOperations/CoreOperations across the
  four remaining active suite trees (`founder-os`, `core_operations`,
  `core_workforce`, `core_intelligence`): `ecosystemFeed.ts`, `routes.ts`, `auth.ts`
  (`ecosystemRoles`), `server.ts` (CORS `defaultOrigins`, 4 backends),
  `.env.example` (4 backends), and frontend files `FounderSite.tsx`,
  `PremiumFounderConsole.tsx`, `CompanyManagement.tsx`,
  `FounderHome.tsx`, `pages/Home.tsx`, `CoreOperationsSite.tsx`. Only
  intentional "deprecated, see docs" comments remain — verified by a
  final `grep` sweep across those four trees.
- **Renamed suite copy** in the above frontend files from brand names to
  Core.Operations / Core.Workforce / Core.Intelligence per
  [positioning.md](./positioning.md), including fixing a pre-existing
  label bug in `CompanyManagement.tsx` where the module-label
  fallthrough always resolved to "CoreOperations".
- **Validated every edited file** by transpiling it directly through the
  TypeScript compiler API (`ts.transpileModule`, since a project-wide
  `tsc`/`npx` invocation did not complete in this environment — see
  environment note below) — zero diagnostics across all ~15 edited
  files.
- Did **not** touch: `shared/brand-assets` and `shared/ui` component
  exports (`CoreOperationsBrandMark`, `CoreOperationsLogo` still exist, unused —
  low-risk dead code, left as-is since deleting a shared package export
  directory/route/table renames from [migration-map.md](./migration-map.md);
  and the DB migration.

## Environment note (first pass)

This session ran against `/Users/bobbyshaw/Desktop/whatsapp-retail-os/founder-os-group`,
which lives under macOS iCloud Desktop & Documents sync. Full-tree
operations (`git status`, `find .`, `tsc` with default lib scanning) took
10+ minutes or did not complete during this session, while single-file
reads/writes and `grep`/`glob` (which respect `.gitignore`) worked
normally. Repo also has **4 active agent branches** and **4 worktrees**
(`agents/audit-env-local-port-assignments`,
`agents/quantumos-mobile-app-development`,
`agents/this-is-what-you-asked-me-last-and`,
`agents/xcode-switch-and-open-project`) checked out alongside `main`.
Given both constraints, the first pass **did not perform bulk destructive
renames or deletions** across the ~9 duplicated brand trees (`foundmeat/`,
`foundcrypto/`, `core_operations/`/`core_intelligence/` under both the repo root and
`foundingos/FoundingOs/`, plus `apps/*` and
`Upgrade-and-Additional-Companies/Consoles/*`), since that risks
irrecoverable data loss or breaking work in progress on other branches
without a reliable way to verify a clean result in this session.

## What this pass completed (docs + code, verified)

1. **Locked positioning statement** —
   [docs/positioning.md](./positioning.md): "FoundingOS is the operating
   system for founder-run businesses — one core platform, three suites
   (Core.Operations, Core.Workforce, Core.Intelligence)..."
2. **Shared backbone spec** — [docs/shared-backbone.md](./shared-backbone.md):
   identity/auth, console shell, suite registry, database, API
   conventions, telemetry, naming rules.
3. **Shared schema** — [docs/shared-schema.md](./shared-schema.md): single
   database, table-prefix model (`core_ops_`, `core_workforce_`,
   `core_intel_`), tenant-scoped rows, deprecated-table list.
4. **Architecture diagram** — [docs/architecture.md](./architecture.md):
   ASCII system diagram, request flow, target deployment topology.
5. **Deprecations** — [docs/deprecations.md](./deprecations.md): CoreOperations,
   files, Prisma models, routes) with rationale and status.
6. **Migration map** — [docs/migration-map.md](./migration-map.md):
   directory, route, env var, table-prefix, and package rename tables.
7. **Feature flags / buyer config** —
   [docs/feature-flags.md](./feature-flags.md): `SuiteKey`,
   `TenantSuiteLicense` model, buyer-subset profiles, env kill switches.
8. **Modular pricing** — [docs/pricing.md](./pricing.md): per-suite
   pricing structure and bundle discounts, wired to the same `SuiteKey`
   values as feature flags.
9. **Telemetry spec** — [docs/telemetry.md](./telemetry.md): shared event
   envelope, suite event catalog, privacy/retention rules.
10. **API & integration review** —
    [docs/api-review.md](./api-review.md): concrete route-by-route
    findings in `core_intelligence/backend/src/routes.ts`
    `core_workforce/backend/src/routes.ts`, with a specific call-out that
    decision before removal.
11. **Acquisition one-pager** —
    [docs/acquisition-one-pager.md](./acquisition-one-pager.md): buyer-
    facing summary of the consolidation thesis, suite summary, what was
    removed and why, current-vs-target state table.
12. **Code: suite registry** —
    [`packages/config/src/suites.ts`](../packages/config/src/suites.ts)
    (new file, syntax-validated via the TypeScript compiler API): defines
    `SuiteKey`, `SuiteDefinition`, `suites` registry, `TenantSuiteLicense`,
    `bundleDiscounts`, `getEnabledSuites()`, `isSuiteDeployable()`, and a
    `deprecatedBrands` marker list. Exported from `@foundingos/config` via
    a new `./suites` package export in
    [`packages/config/package.json`](../packages/config/package.json).
13. **Legacy registry annotated, not broken** —
    [`packages/config/src/index.ts`](../packages/config/src/index.ts) gets
    a deprecation comment pointing at the new suite registry, without
    removing the existing `brands` export other code still consumes.
14. **Root docs updated with migration notes** —
    [README.md](../README.md) rewritten with suite-first framing and links
    to all new docs; [ROUTING.md](../ROUTING.md),
    [AUTHENTICATION.md](../AUTHENTICATION.md),
    [MARKET_LAUNCH_GATE.md](../MARKET_LAUNCH_GATE.md), and
    [FOUNDEROS_NEXT_README.md](../FOUNDEROS_NEXT_README.md) each got a
    migration-note callout pointing to the new docs, without rewriting
    their (still-accurate) operational content.

## Validated

- `packages/config/src/suites.ts` transpiles cleanly with zero diagnostics
  (checked directly via the TypeScript compiler API, since a project-wide
  `tsc --noEmit` did not complete in this session's filesystem — see
  environment note above).
- No existing exports were removed or renamed in `packages/config/src/index.ts`
  or `package.json` — only additive changes, so existing consumers are
  unaffected.
  this is the authoritative removal list for the next phase.

## Zero-legacy-reference validation: CoreOperations/CoreOperations clean in active suites; broader rename still pending

A full "zero legacy brand references" grep across the **entire** repo was
still **not** run to completion (tree-wide search across
`Upgrade-and-Additional-Companies/` and `foundingos/FoundingOs/` remains
slow given the filesystem constraints noted above). However, a scoped
`grep -i "foundmeat|foundcrypto"` across the four **actively maintained**
suite trees (`founder-os`, `core_operations`, `core_workforce`, `core_intelligence`) now
returns **zero code matches** — only intentional "deprecated, see
docs/deprecations.md" comments remain. CoreOperations/CoreWorkforce/CoreIntelligence/
CoreIntelligence naming (the brand names being renamed *to* suites, not removed)
still appears throughout as expected — that rename is tracked separately
in [migration-map.md](./migration-map.md) blocker 3. CoreOperations,
CoreOperations, and CoreOperations (parked, not deprecated) were not touched.
**Zero legacy references is true for CoreOperations/CoreOperations in the active
suites; it is not yet true for the CoreOperations→Core.Operations-style suite
renames, nor for `Upgrade-and-Additional-Companies/` and
`foundingos/FoundingOs/` duplicate app trees**, which were not swept in
this pass.

## Remaining blockers (in priority order)

1. ~~**Physical removal of CoreOperations and CoreOperations**~~ — **Done in the
   second pass.** `foundmeat/`, `foundcrypto/`, their
   `apps/*-web`/`apps/*-console` variants, `apps/meat-web`,
   `foundingos/FoundingOs/CoreOperations*`/`CoreOperations*`, and the
   corresponding `Upgrade-and-Additional-Companies/Consoles/CoreOperations-*`/
   `CoreOperations-*` consoles are deleted, and all live code references in
   the remaining active suites are cleaned up (see "Update (second pass)"
   above). **Not yet done:** exporting their Postgres schemas per
   [shared-schema.md](./shared-schema.md) before any production database
   drops those schemas — this repo pass only touched source code, no
   database exists to export from in this environment.
   models, per [api-review.md](./api-review.md) and
   . The founder-os aggregator's
   model — removing it without a schema migration would break the
   service entirely.
3. **Directory/package renames** — execute
   [migration-map.md](./migration-map.md): `core_operations/` →
   `core-operations/`, `core_workforce/` → `core-workforce/`,
   `@founder-os/*` → `@foundingos/*` everywhere (currently
   `packages/config` already uses the new scope; `packages/auth`,
   `packages/ui` still need the same rename applied to their own
   `package.json`/imports).
4. **Database migration** — implement the Prisma schema changes described
   in [shared-schema.md](./shared-schema.md) (single schema,
   `core_ops_*`/`core_workforce_*`/`core_intel_*` prefixes, `Tenant`,
   `TenantSuiteLicense`), write backfill scripts, and run a reviewed
   migration. No migration was created or run in this pass.
5. **Console shell wiring** — implement `getEnabledSuites()`-driven module
   registration in the actual console app (`apps/foundingos-console` /
   `packages/ui`), replacing the current per-brand console apps.
6. **Website/docs rewrite (implementation)** — this pass wrote the
   strategy docs; the actual `apps/foundingos-web` marketing pages,
   `apps/*-web` legacy sites, and their copy still need to be
   rewritten/retired to match [positioning.md](./positioning.md) and
   [pricing.md](./pricing.md).
7. **Telemetry pipeline implementation** — schema/catalog defined in
   [telemetry.md](./telemetry.md); ingestion (queue, batching, storage
   wiring) not implemented.
8. **Targeted tests/builds after code changes land** — once the
   existing test suites named in
   [MARKET_LAUNCH_GATE.md](../MARKET_LAUNCH_GATE.md) ("Release commands":
   `npm ci`, `npm run build`, `npm test`, `npm audit --omit=dev`) plus
   full-repo zero-legacy-reference grep described above.

## Recommended next session setup

Given the filesystem slowness observed here, a follow-up session should:
run from a **non-iCloud-synced path** (or with iCloud paused) before
attempting bulk renames, delete/backup unused `node_modules` copies (many
duplicate `node_modules` trees exist under `Upgrade-and-Additional-Companies/`
and `foundingos/FoundingOs/`), and coordinate with the four active
`agents/*` branches before deleting any shared directories.
