# FoundingOS Restructure — Migration Map

Concrete before/after mapping for naming, routes, env vars, and table
prefixes. Use this as the checklist when doing the physical rename pass
(tracked as a blocker; see [restructure-summary.md](./restructure-summary.md)).

## Directory / app mapping

| Legacy path | New concept | Action |
| --- | --- | --- |
| `founder-os/` | FoundingOS platform core | Rename references to `foundingos-core` |
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
| `packages/*` | Shared backbone | Rename `@founder-os/*` → `@foundingos/*` |

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

| Legacy | New |
| --- | --- |
| `@founder-os/auth` | `@foundingos/auth` |
| `@founder-os/ui` | `@foundingos/ui` |
| `@founder-os/media` | `@foundingos/media` |
| `packages/config` brand registry | Suite registry (see [feature-flags.md](./feature-flags.md)) |

## Execution status

This map is written but **not yet executed as a bulk rename** in this pass.
Rationale and next steps are in
[restructure-summary.md](./restructure-summary.md).
