# FoundingOS — Architecture Diagram

## System overview

```
                                 ┌───────────────────────────────┐
                                 │        foundingos.com         │
                                 │   (public marketing website)  │
                                 └───────────────┬───────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FoundingOS Console Shell                       │
│           (packages/ui — sidebar, dashboard, settings, activity)        │
│                                                                           │
│   ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐    │
│   │  Core.Operations  │ │  Core.Workforce   │ │ Core.Intelligence │    │
│   │  (was CoreOperations)│ │  (was CoreWorkforce)│ │ (was CoreIntelligence,   │    │
│   │  Customers         │ │  Applicants       │ │  KPI dashboards   │    │
│   │  Orders            │ │  Jobs             │ │  Funnels          │    │
│   │  Inventory         │ │  Recruiters       │ │  Reports          │    │
│   │  Billing/Invoices  │ │  Workforce Intel  │ │                   │    │
│   │  Delivery          │ │                   │ │                   │    │
│   └─────────┬──────────┘ └─────────┬─────────┘ └─────────┬─────────┘    │
│             │  module registration (feature flags per tenant/suite)     │
└─────────────┼───────────────────────┼─────────────────────┼─────────────┘
              │                       │                     │
              ▼                       ▼                     ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │                     Shared Backbone Services                      │
   │                                                                     │
   │  @foundingos/auth   — identity, sessions, tokens, password flows   │
   │  @foundingos/config — suite registry, feature flags, brand tokens  │
   │  @foundingos/db     — Prisma client, one schema, prefixed tables   │
   │  Telemetry pipeline — one event schema, per-suite namespaces       │
   │  API gateway conv.  — /api/v1/*, /health, /api/v1/status, /auth/*  │
   └──────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────────┐
                    │      PostgreSQL (single DB)    │
                    │  Tenant, TenantSuiteLicense,    │
                    │  User, AuthUser, Subscription,  │
                    │  core_ops_*, core_workforce_*,  │
                    │  core_intel_*                   │
                    └───────────────────────────────┘

   ✗ Removed from architecture:
     - CoreOperations suite (frontend, backend, schema)
     - CoreOperations suite (frontend, backend, schema)
```

## Request flow (single suite example: Core.Operations)

```
Browser
  │  GET /core-operations/orders
  ▼
FoundingOS Console Shell (Next.js app router)
  │  loads module "core-operations" if TenantSuiteLicense includes it
  ▼
Core.Operations module (packages/ui module + suite API client)
  │  calls /api/v1/core-operations/orders with bearer access token
  ▼
Core.Operations backend service
  │  verifies token via @foundingos/auth (issuer founding-os,
  │  audience founding-os-apps)
  │  scopes all queries by tenantId
  ▼
PostgreSQL: core_ops_order WHERE tenantId = :tenantId
```

## Deployment topology (target state)

- **1** public marketing site: `foundingos.com` (replaces 5+ brand
  websites).
- **1** console app (multi-suite, module-flagged) instead of per-brand
  consoles + starter consoles.
- **1** backend deployment per suite (Core.Operations, Core.Workforce,
  Core.Intelligence), each stateless and behind the shared auth/gateway
  conventions, or consolidated into one backend if load allows — see open
  question in [restructure-summary.md](./restructure-summary.md).
- **1** PostgreSQL database, prefixed tables, tenant-scoped rows.

This diagram describes the **target** architecture. The current repository
still contains the legacy per-brand apps described in
[migration-map.md](./migration-map.md); cutover is incremental and
tracked there.
