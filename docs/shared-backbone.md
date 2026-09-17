# FoundingOS Restructure — Shared Backbone

This document defines the shared backbone that every FoundingOS suite is
built on. It is the contract between suites: anything not listed here is
suite-specific and must not leak into other suites.

## 1. Single brand, three suites

FoundingOS collapses the previous nine-brand structure into **one brand**
(`foundingos`) delivered as **one platform** with **three product suites**:

| Suite | Replaces (legacy brand) | Domain |
| --- | --- | --- |
| **Core.Operations** | CoreOperations | Customers, orders, inventory, billing, delivery, messaging commerce |
| **Core.Workforce** | CoreWorkforce | Applicants, recruiters, jobs, workforce intelligence |

Legacy brands **removed/deprecated** entirely (not migrated into a suite):

- **CoreOperations** — vertical meat-trade product. Deprecated.
- **CoreOperations** — crypto trading/signals product. Deprecated.
  Deprecated. Only first-party analytics survive, folded into
  Core.Intelligence.

See  for the full removal list and
[migration-map.md](./migration-map.md) for path/route/table renames.

## 2. Shared backbone components

Every suite consumes the same backbone; suites must not fork these:

1. **Identity & Auth** (`@founder-os/auth` → renamed `@foundingos/auth`)
   - One issuer (`founding-os`), one audience (`founding-os-apps`).
   - Shared `AuthUser`, `AuthSession`, `PasswordReset` tables per suite
     schema (see [shared-schema.md](./shared-schema.md)).
   - Roles are suite-scoped but issued by the same token service:
     `FounderOnly`, `SystemOperator`, `ReadOnly` (platform); suite roles
     defined per suite (e.g. Core.Operations: `Owner`, `Merchant`, `Staff`).
2. **Console shell** (`packages/ui`)
   - One shared shell: sidebar, dashboard KPIs, settings, module routes,
     activity log, admin user management.
   - Suites register modules into the shell; they do not run their own
     shell.
3. **Brand/suite registry** (`packages/config`)
   - Single source of truth for suite metadata, URLs, and feature flags
     (see [feature-flags.md](./feature-flags.md)).
4. **Database** (`packages/db`, Prisma)
   - One logical database, one Prisma schema, per-suite table prefixes
     (see [shared-schema.md](./shared-schema.md)) instead of per-brand
     schemas/databases.
5. **API conventions**
   - Every service exposes `GET /health`, `GET /api/v1/status`, and
     resources under `/api/v1/*`.
   - Shared auth router mounted at `/api/v1/auth` (login, refresh, logout,
     password flows).
   - Shared response envelope: request IDs, structured errors, security
     headers, rate limits (see [api-review.md](./api-review.md)).
6. **Telemetry** (see [telemetry.md](./telemetry.md))
   - One event schema, one ingestion path, per-suite event namespaces.
7. **Messaging Core**
   - Channel-neutral ingestion, durable conversations/messages, participant
     authorization, intent routing, channel formatting, and delivery status.
   - WhatsApp Cloud API is the first production transport. Telegram, SMS,
     Messenger, Instagram, email, Slack, and RCS must implement the same
     contract rather than embedding channel logic in a workspace.
   - Every inbound message and executed/failed intent publishes an event into
     the shared Event Feed.

### Messaging Core flow

```text
WhatsApp webhook
  -> signature verification
  -> tenant channel connection
  -> provider-message idempotency
  -> conversation + participant authorization
  -> deterministic intent classifier
  -> workspace command
  -> shared Event Feed
  -> WhatsApp confirmation
```

Phase-one commands are `/status`, `/order`, `/delivered`, `/invoice`, and
`/campaign`. Natural-language order capture is supported as a guarded fallback.
Unsupported or unauthorized actions are recorded and rejected; they never
silently mutate business records.

## 3. Event-driven AI Insights contract

Core.Intelligence panels in suite consoles consume the shared event feed
contract published by Core.Operations:

- `GET /api/v1/ops/events?limit=200` for baseline history
- `GET /api/v1/ops/events/stream` for live SSE updates

The insights layer derives four output classes from this feed:

1. Predictions (delivery and cashflow trajectory)
2. Risk flags (inventory and receivables pressure)
3. Workflow suggestions (cross-suite next best actions)
4. Anomalies (event volume/coverage irregularities)

## 4. Non-negotiable naming rules

- Product/brand name in all copy, routes, env vars, and table prefixes is
  **FoundingOS**, plus suite name (**Core.Operations**, **Core.Workforce**,
  **Core.Intelligence**). Legacy brand words (CoreOperations, CoreOperations,
  CoreIntelligence, CoreWorkforce, CoreOperations, CoreOperations, CoreOperations,
  CoreOperations, CoreIntelligence) must not appear in new copy, new routes, new env
  vars, or new table names. Existing references are tracked for cleanup in
  [migration-map.md](./migration-map.md).
- Env vars: `FOUNDINGOS_<SUITE>_<PURPOSE>`, e.g.
  `FOUNDINGOS_CORE_OPERATIONS_DATABASE_URL`.
- Table prefixes: `core_ops_`, `core_workforce_`, `core_intel_`, and
  unprefixed shared tables (`AuthUser`, `AuthSession`, `Subscription`, ...).
- Routes: `/core-operations/*`, `/core-workforce/*`, `/core-intelligence/*`,
  with `/system/*` reserved for platform/operator routes.

## 5. Architecture diagram

See [architecture.md](./architecture.md) for the full diagram and component
descriptions.
