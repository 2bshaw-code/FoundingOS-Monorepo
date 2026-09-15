# FoundingOS Workspace

**FoundingOS is the operating system for founder-run businesses** — one
core platform with three suites: **Core.Operations**, **Core.Workforce**,
and **Core.Intelligence**. This is the locked positioning; see
[docs/positioning.md](./docs/positioning.md).

> This repository is mid-restructure from a nine-brand model into the
> single-brand, three-suite model above. See
> [docs/restructure-summary.md](./docs/restructure-summary.md) for current
> status, [docs/shared-backbone.md](./docs/shared-backbone.md) for the
> target architecture, and [docs/deprecations.md](./docs/deprecations.md)
> for the consolidated suite model and removed legacy products.

## Applications

| Application | Target suite | Frontend hostname | Frontend port | Backend port | PostgreSQL schema |
| --- | --- | --- | ---: | ---: | --- |
| CoreOperations | Core.Operations | `localhost:3000` | 3000 | 4000 | `core_operations` → `core_ops_*` |
| CoreWorkforce | Core.Workforce | `localhost:3003` | 3003 | 4003 | `core_workforce` → `core_workforce_*` |
| FoundingOS Console | Platform shell | `localhost:3005` | 3005 | 5000 | `founder_os` |
| Core.Intelligence | Intelligence suite | `localhost:3006` | 3006 | 4006 | `core_intelligence` |

The hostnames are documented targets only. This scaffold does not edit `/etc/hosts`, proxies, DNS, server configuration, or existing environment files.

## Shared packages

- `@foundingos/auth`: role and access-policy utilities
- `@foundingos/ui`: shared React primitives
- `@foundingos/media`: shared media-upload contracts and helpers
- `@foundingos/config`: brand/suite registry — see
  [`packages/config/src/suites.ts`](./packages/config/src/suites.ts) for the
  current Core.Operations / Core.Workforce / Core.Intelligence suite
  definitions.

## Restructure documentation

- [docs/positioning.md](./docs/positioning.md) — locked positioning statement
- [docs/shared-backbone.md](./docs/shared-backbone.md) — shared platform contract
- [docs/shared-schema.md](./docs/shared-schema.md) — unified data model
- [docs/architecture.md](./docs/architecture.md) — architecture diagram
- [docs/migration-map.md](./docs/migration-map.md) — path/route/env/table rename map
- [docs/feature-flags.md](./docs/feature-flags.md) — suite licensing & buyer feature flags
- [docs/pricing.md](./docs/pricing.md) — modular suite pricing
- [docs/telemetry.md](./docs/telemetry.md) — shared telemetry schema
- [docs/api-review.md](./docs/api-review.md) — API/integration review findings
- [docs/acquisition-one-pager.md](./docs/acquisition-one-pager.md) — buyer-facing summary
- [docs/restructure-summary.md](./docs/restructure-summary.md) — status and remaining blockers

## Safety

Deployment credentials, production secrets, database migrations, and provider configuration are intentionally not stored in this repository. See [production readiness](./docs/production-readiness.md) before release.

## Runtime modes

For a buyer demo, load `.env.demo`; it selects local storage and mock provider
adapters without contacting AWS, Stripe, Clerk, Resend, Twilio, Sentry, or
Apple/EAS. For a real deployment, copy `production.example.env` to
`.env.production`, fill every provider credential, set `APP_MODE=production`,
and follow the [deployment runbook](./docs/production-deployment-runbook.md).
Production mode falls back to demo mode when required credentials are absent.
