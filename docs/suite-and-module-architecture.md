# FoundingOS — Suite and Module Architecture

This document is the buyer-facing reference for how FoundingOS's product
surface is organized. It complements
[architecture.md](./architecture.md) (system/deployment diagram) and
[migration-map.md](./migration-map.md) (legacy-to-current mapping).

## Suites

FoundingOS ships three product suites. Suite definitions are the single
source of truth in `packages/config/src/suites.ts` — pricing, feature flags,
console navigation, API route prefixes, and database table prefixes are all
derived from this registry, not hardcoded per app.

| Suite | Former brand(s) | Route prefix | Table prefix | Modules |
|---|---|---|---|---|
| **Core.Operations** | FoundRetail (retail), FoundFinance (finance), FoundHealth (health), FoundLogistics (logistics) | `/api/v1/ops` | `core_ops_` | Customers, Inventory, Orders, Billing, Delivery |
| **Core.Workforce** | FoundTalent (talent) | `/api/v1/work` | `core_workforce_` | Applicants, Recruiters, Jobs, Workforce Intel |
| **Core.Intelligence** | FoundThat (intelligence) | `/api/v1/int` | `core_intel_` | KPI Dashboards, Funnels, Reports |

A tenant's access to a suite is governed by a `TenantSuiteLicense` (see
`packages/config/src/suites.ts`): console navigation only renders modules for
suites the tenant is licensed and enabled for — unlicensed suites are hidden
entirely, not shown disabled. Bundle discounts apply automatically when a
tenant licenses more than one suite (`bundleDiscounts`: 15% for 2 suites, 25%
for 3).

Suites can also be disabled at the deployment level independent of tenant
licensing, via `FOUNDINGOS_ENABLE_<SUITE>=false` environment variables
(`isSuiteDeployable()`).

## Primary mobile application

`apps/foundingos-mobile` is the only target customer application. It uses the
existing SuperDashboard mobile shell as its foundation: responsive cards,
offline outbox, command bar, workspace switcher, AI summaries, and shared
navigation are retained. The old cross-brand data model is not.

After authentication, the shell operates in one tenant context and renders
only the suites and workspaces enabled for the user's plan and role:

| Primary app surface | Suite |
|---|---|
| Retail, Logistics, Finance, Marketing | Core.Operations |
| Talent, Health | Core.Workforce |
| FoundingOS Home, Event Feed, recommendations, risks | Core.Intelligence |

The historical vertical mobile roots under `apps/` are transitional
implementation references only. They are not separately marketed products
and must not gain new customer-facing features. Functionality needed from
them should move into `apps/foundingos-mobile` behind the shared tenant,
licence, role, and feature-flag boundaries.

SuperDashboard's cross-tenant administrative view remains isolated to
FounderOS-owned control surfaces. Reusing its visual shell must never expose
platform-wide tenant data or administrative actions in a customer session.

## Deprecated brands

`meat` and `crypto` remain as `BrandSlug` entries in
`packages/config/src/index.ts` **only** so that legacy code paths performing
a brand lookup do not throw at runtime during the migration window — they are
explicitly labelled `(deprecated)` in `name`/`legalName`/`marketingName` and
are also listed in `packages/config/src/suites.ts`'s `deprecatedBrands`
constant. They must not be surfaced in any navigation, marketing page, or
mobile app. See [migration-map.md](./migration-map.md) and
[deprecations.md](./deprecations.md) for the full removal record.

## Shared backbone

All suites and apps share:

- **`@foundingos/auth`** — identity, sessions, tokens.
- **`@foundingos/config`** — this suite registry, brand registry (legacy),
  feature flags, commercial/pricing config, and `runtime-mode.ts` (demo vs.
  production provider selection).
- **`@foundingos/db`** — one Prisma schema, one Postgres database, prefixed
  tables per suite, tenant-scoped rows everywhere.
- **`@foundingos/ui`** — shared console shell, mobile runtime-mode helper
  (`mobile-runtime-mode.ts`), shared components, and the quantum design
  system (lighter glow, thinner edges, reduced shadows, unified spacing).
- **Telemetry pipeline** — one event schema, namespaced per suite.
- **API gateway conventions** — `/api/v1/*`, `/health`, `/api/v1/status`,
  `/auth/*` are consistent across every suite's backend.

See [shared-schema.md](./shared-schema.md) for the full data model and
[architecture.md](./architecture.md) for the request-flow and deployment
diagrams.
