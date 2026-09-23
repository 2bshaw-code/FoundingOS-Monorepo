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

## Implementation status (Phase 28)

Ingestion is live on the `core-operations` backend (chosen as the host
because it already serves every other cross-suite `/platform/*` concern —
`TenantSuiteLicense`, the `Event` feed, `AgentAction` — and both other
backends already call it over HTTP for cross-suite checks).

### `POST /api/v1/ops/platform/telemetry`

- **Auth**: optional. If an `Authorization: Bearer <token>` header is
  present it must be a valid access token (a malformed/expired token
  returns `401`, it is never silently downgraded to anonymous); the
  resulting session's `tenantId` is attached to every event in the request,
  overriding any `tenantId` the client attempted to set. With no
  `Authorization` header at all, the request is accepted anonymously and
  every event is stored with `tenantId: null` — this is the path for
  pre-login/marketing-site telemetry. A client can never forge another
  tenant's `tenantId` by simply including it in the body.
- **Body**: either one event object matching the envelope above, or
  `{ "events": [ ...up to 100 event objects ] }` for batched sends.
- **Validation** (`telemetry.ts`'s `validateTelemetryEvent`): `suite` must
  be one of `core_operations`/`core_workforce`/`core_intelligence`/
  `platform`; `name` is required (max 200 chars); `actorType` must be one
  of `user`/`system`/`api`; `occurredAt` defaults to "now" if omitted, and
  must be a valid ISO date if provided; `properties` must be a JSON object
  (or omitted, defaulting to `{}`). Any violation returns `400` with a
  specific message — a bad event is never silently dropped.
- **Rate limiting**: a dedicated in-memory limiter (separate from the
  global per-IP `/api/v1` limit already applied to every route), bucketed
  by `x-tenant-id` header when present, else by client IP. Default: 60
  requests/minute per key. Exceeding it returns `429` with
  `RateLimit-*` response headers (mirrors the existing global limiter's
  header names).
- **Response**: `201 { success: true, data: { accepted: <count> } }` on
  success.

### `GET /api/v1/ops/platform/telemetry`

Owner-only (`requireOwnerAccess`), tenant-scoped retrieval for debugging and
the future internal dashboard (Phase 36). Supports `?suite=`, `?name=`,
`?since=` (ISO date), and `?limit=` (max 200, default 100) query filters.

### Storage

New `TelemetryEvent` Prisma model on `core-operations/backend/prisma/schema.prisma`
(`wros` schema, migration `20260923120000_telemetry_event`). Distinct from
the existing `Event` model, which is the tenant-facing operational event
feed rendered in-product — `TelemetryEvent` is the internal
observability/analytics sink and is never shown directly to a tenant.

### Not yet done

- A real internal telemetry dashboard (Phase 36) — events are queryable via
  the endpoint above but have no visualization yet.
- Backend-side rate limiting/abuse protection beyond the per-key limiter
  already in place; sampling/throttling on high-volume client actions if
  usage grows (currently every action-log entry is sent, unsampled).

### What's implemented (Phases 29–31)

- **Client integration** (`apps/foundingos-mobile/lib/telemetry-client.ts`):
  batches unflushed `action-logger.ts` entries into the envelope above and
  POSTs them to this endpoint. Flushes periodically (60s), on app
  foreground/background transitions, immediately on any logged failure
  ("critical error" per the spec), and on network reconnect (wired into
  `network-status.ts` alongside the existing outbox sync). Skips flushing
  entirely while offline; unsent entries simply wait for the next trigger.
  In-memory only — intentionally not persisted across a force-quit, since
  telemetry is best-effort observability, not a governed business action
  (compare with `outbox-sync.ts`, which *is* SQLite-backed because losing a
  queued approval/execution would be a real problem).
- **Backend hooks** (Phase 30): `core-operations` emits directly via
  `emitBackendTelemetry()` (in-process, since it owns the table) at
  workspace access, record creation, record status changes, and agent-action
  decisions. `core-workforce` and `core-intelligence` have no direct access
  to the `TelemetryEvent` table, so they emit over HTTP via a small
  `telemetry-emitter.ts` in each service (fire-and-forget, 5s timeout,
  never throws) — `core-workforce` at job creation and workforce-action
  decisions; `core-intelligence`'s pre-existing internal event taxonomy
  (`recordOrchestrationEvent`, `recordMappingQuery`, etc. in its own
  `telemetry.ts`) now forwards every event it already emits into the real
  pipeline, plus an explicit `recommendation.decision` event.
- **Health/readiness** (Phase 31): all three backends now expose both
  `/health` (always cheap, instant, no dependency checks — liveness) and
  `/ready` (pings the database, and for `core-intelligence`, also its
  Core.Operations dependency — readiness). `core-intelligence`'s `/health`
  previously did the heavy dependency check itself; that logic moved to its
  new `/ready` endpoint. The mobile app's hidden debug screen
  (`debug-log.tsx`) now shows live `/health` status for Core.Operations and
  Core.Workforce (the two services the mobile app talks to directly)
  alongside the action log.
- **Error forwarding**: `use-action-feedback.ts`'s `showError()` already
  logged every rejection/network failure via `logAction(..., 'failure', ...)`
  (Phase 22); the telemetry client now treats any `'failure'`-outcome log
  entry as a trigger for an immediate flush, so client errors reach the
  telemetry sink without a separate error-specific code path.

**Known limitation**: none of this has been exercised against a live device,
real network conditions, or a live Postgres database in this environment —
verified via `tsc --noEmit` (mobile + all three backends), the existing
`telemetry.test.ts` unit suite (still 9/9 passing), and a bundle rebuild
(`scripts/build-core-operations-api.mjs`) only.

## Internal telemetry dashboard (Phase 36)

A read-only, founder/internal-only view of the data collected above:

- **`GET /platform/telemetry/summary`** (`core-operations/backend/src/telemetry.ts`
  `queryTelemetrySummary`/`summarizeTelemetryEvents`, wired in `routes.ts`) —
  cross-tenant aggregate, gated by `requireFounderMaster` (the same
  internal-only guard added for Phase 34's `FeatureFlag` routes), unlike the
  existing tenant-scoped `GET /platform/telemetry`. Accepts optional
  `suite`/`since`/`tenantId`/`limit` query params and returns:
  `totalEvents`, `errorCount`/`errorRate`, `offlineEventCount`, and
  `bySuite`/`byName`/`byTenant` counts plus the most recent 25 raw events.
- **Error/offline classification is a heuristic, not a guaranteed schema**:
  since no event-name or `properties` convention is enforced across the
  mobile client, web client, and three backend emitters today, an event
  counts as an error if either `properties.outcome === 'failure'` or its
  `name` contains "error"/"fail" (case-insensitive), and as offline if its
  `name` contains "offline". Revisit once/if a real taxonomy is
  standardized (see the "Event taxonomy" section above for what exists
  today).
- **UI**: `apps/foundingos-console/app/superdashboard/telemetry/page.tsx`, a
  server component under the existing `/superdashboard` FounderOS-only area
  (same "do not link from any brand console" convention as its sibling
  `page.tsx`). Fetches via
  `telemetry-summary-store.server.ts`, which calls the summary endpoint over
  HTTP — **not** a direct Prisma import — because `TelemetryEvent` lives in
  `core-operations/backend`'s own `wros` schema/generated client, which this
  console app doesn't depend on (unlike `brand-metric-store.server.ts`,
  which reads this app's own legacy `packages/db` schema directly).
- **Known blocker, same shape as Phase 34's admin UI**: this page requires
  `CORE_OPERATIONS_API_BASE` and a `CORE_OPERATIONS_INTERNAL_TOKEN` (a
  founder_master-role service token) to be configured in this app's
  deployment environment — there is no login/session flow wiring it
  automatically. Missing either env var degrades to an empty "no data yet"
  state rather than a hard error, but issuing and rotating that internal
  token is an ops/deployment step outside this pass's scope.
- **Verified**: `summarizeTelemetryEvents` has dedicated unit tests in
  `telemetry.test.ts` (counting, error/offline classification, empty-input
  edge case); `tsc --noEmit` is clean for both `core-operations/backend` and
  `apps/foundingos-console`. Not exercised against a live deployment or a
  populated `TelemetryEvent` table in this pass.


