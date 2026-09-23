# FoundingOS Restructure — Migration Map

Concrete before/after mapping for naming, routes, env vars, and table
prefixes. Use this as the checklist when doing the physical rename pass
(tracked as a blocker; see [restructure-summary.md](./restructure-summary.md)).

## Directory / app mapping

| Legacy path | New concept | Action |
| --- | --- | --- |
| `founder-os/` | Legacy founder-platform aggregator | **Deprecated (Phase 24)** — not in npm workspaces, own isolated `founder_os` Postgres schema, no active app depends on it. Retire rather than rename/migrate; see [deprecations.md](./deprecations.md). |
| `core_operations/` | Core.Operations | Rename to `core-operations/` |
| `core_workforce/` | Core.Workforce | Rename to `core-workforce/` |
| `foundmeat/` | *(deprecated)* | Archive out of active tree |
| `foundcrypto/` | *(deprecated)* | Archive out of active tree |
| `apps/foundingos-web` | FoundingOS marketing site | Keep name |
| `apps/foundingos-console` | FoundingOS console shell | Keep name |
| `apps/retail-web`, `apps/retail-console` | Core.Operations web/console | Fold into console shell module |
| `apps/talent-web`, `apps/talent-console` | Core.Workforce web/console | Fold into console shell module |
| `apps/meat-*`, `apps/foundmeat-*` | *(deprecated)* | Remove from `apps/` |
| `apps/crypto-*`, `apps/foundcrypto-*` | *(deprecated)* | Remove from `apps/` |
| `apps/foundfinance-*`, `apps/foundhealth-*`, `apps/foundlogistics-*` | Parked (not in 3-suite scope) | Exclude from active build; keep code, mark parked |
| `Upgrade-and-Additional-Companies/Consoles/*` | Superseded by console shell modules | Retire once module migration lands |
| `packages/*` | Shared backbone | Rename `@founder-os/*` → `@foundingos/*` (done — see Package mapping) |

## Route mapping

| Legacy route | New route |
| --- | --- |
| `/core_operations/retail-manager-console` | `/core-operations/manager` |
| `/core_operations/staff-console` | `/core-operations/staff` |
| `/core_workforce/workforce-intelligence-console` | `/core-workforce/intelligence` |
| `/core_workforce/recruiter-console/*` | `/core-workforce/recruiter/*` |
| `/foundthis/intelligence-console` | `/core-intelligence` |
| `/foundmeat/*` | *(removed)* |
| `/foundcrypto/*` | *(removed)* |
| `/system/*` | unchanged (platform/operator routes) |

Keep legacy routes as redirects during transition, consistent with the
existing convention in [ROUTING.md](../ROUTING.md).

## Env var mapping

| Legacy | New |
| --- | --- |
| `NEXT_PUBLIC_RETAIL_WEB_URL` / `NEXT_PUBLIC_RETAIL_CONSOLE_URL` | `NEXT_PUBLIC_CORE_OPERATIONS_WEB_URL` / `..._CONSOLE_URL` |
| `NEXT_PUBLIC_TALENT_WEB_URL` / `NEXT_PUBLIC_TALENT_CONSOLE_URL` | `NEXT_PUBLIC_CORE_WORKFORCE_WEB_URL` / `..._CONSOLE_URL` |
| `NEXT_PUBLIC_IT_WEB_URL` / `NEXT_PUBLIC_IT_CONSOLE_URL` | `NEXT_PUBLIC_CORE_INTELLIGENCE_WEB_URL` / `..._CONSOLE_URL` |
| `NEXT_PUBLIC_MEAT_*`, `NEXT_PUBLIC_CRYPTO_*` | *(removed)* |
| `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET` | unchanged (already shared) |
| `DATABASE_URL` (per brand) | Single `DATABASE_URL` for the shared schema |

## Table prefix mapping

See full detail in [shared-schema.md](./shared-schema.md). Summary:

| Legacy schema | New prefix |
| --- | --- |
| `core_operations.*` | `core_ops_*` |
| `core_workforce.*` | `core_workforce_*` |
| `foundmeat.*` | *(dropped after export)* |
| `foundcrypto.*` | *(dropped after export)* |
| `founder_os.*` | unprefixed shared/platform tables |

## Package mapping

Completed in Phase 23. `packages/config`, `packages/auth`, `packages/ui`,
`packages/db`, and `packages/billing` were already `@foundingos/*` scoped.
The remaining `shared/*` packages (still consumed by the three `core-*`
backend services) have now been renamed too. `@foundingos/auth` and
`@foundingos/ui` were already taken by the newer `packages/*` libraries, so
the renamed `shared/*` packages use distinguishing names:

| Legacy | New |
| --- | --- |
| `@founder-os/auth` (`shared/auth`) | `@foundingos/service-auth` |
| `@founder-os/bob` (`shared/bob`) | `@foundingos/bob` |
| `@founder-os/ui` (`shared/ui`) | `@foundingos/legacy-ui` |
| `@founder-os/brand-assets` (`shared/brand-assets`) | `@foundingos/brand-assets` |
| `@founder-os/media` (`shared/media`) | `@foundingos/media` |
| `@founder-os/core-operations-backend` | `@foundingos/core-operations-backend` |
| `@founder-os/core-workforce-backend` | `@foundingos/core-workforce-backend` |
| `@founder-os/core-intelligence-backend` | `@foundingos/core-intelligence-backend` |
| `packages/config` brand registry | Suite registry (see [feature-flags.md](./feature-flags.md)) |

`@foundingos/legacy-ui` and `@foundingos/brand-assets` are not consumed by
any app in the active npm workspaces today — only the `founder-os/`
aggregator (Phase 24) still depends on them. The rename was applied for
consistency and to unblock future workspace inclusion, not because they are
in active use.

## Execution status

The package-scope rename (`@founder-os/*` → `@foundingos/*`) is executed as
of Phase 23. Directory/route/env/table-prefix renames beyond that are
**not yet executed as a bulk rename** in this pass. Rationale and next
steps are in
[restructure-summary.md](./restructure-summary.md).
