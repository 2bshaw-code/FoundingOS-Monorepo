# FoundingOS — Telemetry

## Goals

- One event schema across all suites (replaces any per-brand ad hoc
  logging/analytics).
- Every event is tenant-scoped and suite-namespaced so Core.Intelligence
  can build first-party analytics **from the platform's own telemetry**,

## Event envelope

```ts
interface TelemetryEvent {
  id: string                 // uuid
  tenantId: string
  suite: 'core_operations' | 'core_workforce' | 'core_intelligence' | 'platform'
  name: string                // e.g. "order.created", "applicant.stage_changed"
  actorType: 'user' | 'system' | 'api'
  actorId?: string
  occurredAt: string          // ISO 8601
  properties: Record<string, unknown>  // suite-defined payload, no PII beyond what's already in the primary record
}
```

- Persisted to the shared `TelemetryEvent` table (see
  [shared-schema.md](./shared-schema.md)).

## Suite event catalog (starting set)

| Suite | Example events |
| --- | --- |
| Core.Operations | `order.created`, `order.fulfilled`, `invoice.paid`, `customer.created` |
| Core.Workforce | `applicant.created`, `applicant.stage_changed`, `job.published` |
| Core.Intelligence | `report.viewed`, `dashboard.kpi_computed` |
| Platform | `tenant.suite_licensed`, `user.login`, `session.revoked` |

## Privacy & retention

- No logging of passwords, tokens, or reset codes (carried over from
  [AUTHENTICATION.md](../AUTHENTICATION.md) diagnostics rule).
- Default retention: 400 days, configurable per tenant contract.
  first-party in-product events are valid sources for Core.Intelligence.

## Implementation status

Schema and catalog defined in this pass. Ingestion pipeline (queue,
batching, storage wiring) is not implemented — tracked as a blocker in
[restructure-summary.md](./restructure-summary.md).
