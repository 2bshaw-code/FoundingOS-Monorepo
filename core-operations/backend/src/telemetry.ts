/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 28 — ingestion pipeline for the shared TelemetryEvent envelope
// (see /docs/telemetry.md). Kept pure/testable where possible (validation,
// rate-limit bucketing) so behavior can be unit-tested without a database,
// matching this file's siblings (see event-feed.ts, event-feed.test.ts).
import { authService, prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

/**
 * Best-effort bearer-token identity resolution for the telemetry endpoint,
 * which (unlike every other `/platform/*` route) is intentionally reachable
 * without auth so pre-login/marketing-site events can be ingested. If an
 * `Authorization` header is present it must be valid — a bad token is a
 * real error (401), not silently downgraded to anonymous, so a broken
 * client integration surfaces immediately rather than quietly losing
 * tenant attribution.
 */
export function resolveOptionalTenantId(authorizationHeader: string | undefined): string | undefined {
  if (!authorizationHeader) return undefined
  const [scheme, token] = authorizationHeader.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) throw Object.assign(new Error('Malformed Authorization header'), { status: 401 })
  const identity = authService.verifyAccessToken(token)
  return identity.tenantId
}

export const KNOWN_SUITES = new Set(['core_operations', 'core_workforce', 'core_intelligence', 'platform'])
const KNOWN_ACTOR_TYPES = new Set(['user', 'system', 'api'])

/** Raw, untrusted shape a client may submit for one event. */
export type RawTelemetryEvent = {
  tenantId?: unknown
  suite?: unknown
  name?: unknown
  actorType?: unknown
  actorId?: unknown
  occurredAt?: unknown
  properties?: unknown
}

export type ValidatedTelemetryEvent = {
  tenantId?: string
  suite: string
  name: string
  actorType: string
  actorId?: string
  occurredAt: Date
  properties: unknown
}

export class TelemetryValidationError extends Error {
  status = 400
  constructor(message: string) {
    super(message)
  }
}

/**
 * Validates and normalizes one raw event. Throws `TelemetryValidationError`
 * (mapped to HTTP 400 by the route) on any malformed field — ingestion never
 * silently drops or guesses at a bad event, so a client integration bug is
 * visible immediately rather than producing quietly-incomplete telemetry.
 */
export function validateTelemetryEvent(raw: RawTelemetryEvent): ValidatedTelemetryEvent {
  const suite = String(raw.suite || '').trim()
  if (!KNOWN_SUITES.has(suite)) throw new TelemetryValidationError(`Unknown suite: ${suite || '(missing)'}`)
  const name = String(raw.name || '').trim()
  if (!name || name.length > 200) throw new TelemetryValidationError('Event name is required (max 200 chars)')
  const actorType = String(raw.actorType || '').trim()
  if (!KNOWN_ACTOR_TYPES.has(actorType)) throw new TelemetryValidationError(`Unknown actorType: ${actorType || '(missing)'}`)
  const occurredAtRaw = raw.occurredAt ? new Date(String(raw.occurredAt)) : new Date()
  if (Number.isNaN(occurredAtRaw.getTime())) throw new TelemetryValidationError('occurredAt must be a valid ISO date')
  const tenantId = raw.tenantId ? String(raw.tenantId).trim() : undefined
  const actorId = raw.actorId ? String(raw.actorId).trim() : undefined
  if (raw.properties !== undefined && (typeof raw.properties !== 'object' || raw.properties === null || Array.isArray(raw.properties))) {
    throw new TelemetryValidationError('properties must be a JSON object')
  }
  return {
    tenantId: tenantId || undefined,
    suite,
    name,
    actorType,
    actorId: actorId || undefined,
    occurredAt: occurredAtRaw,
    properties: raw.properties ?? {},
  }
}

const MAX_BATCH_SIZE = 100

/** Validates a request body that may be one event or `{ events: [...] }`. Never mutates the input. */
export function parseTelemetryBatch(body: unknown): ValidatedTelemetryEvent[] {
  const rawList: RawTelemetryEvent[] = Array.isArray((body as { events?: unknown })?.events)
    ? ((body as { events: RawTelemetryEvent[] }).events)
    : [body as RawTelemetryEvent]
  if (rawList.length === 0) throw new TelemetryValidationError('At least one event is required')
  if (rawList.length > MAX_BATCH_SIZE) throw new TelemetryValidationError(`Batch too large (max ${MAX_BATCH_SIZE} events)`)
  return rawList.map(validateTelemetryEvent)
}

export const ingestTelemetryEvents = async (events: ValidatedTelemetryEvent[]) => {
  const { count } = await prisma.telemetryEvent.createMany({
    data: events.map((event) => ({
      tenantId: event.tenantId,
      suite: event.suite,
      name: event.name,
      actorType: event.actorType,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      properties: json(event.properties),
    })),
  })
  return count
}

/**
 * Phase 30 — fire-and-forget emission helper for instrumenting business
 * routes directly in-process (this service IS core-operations, so there is
 * no HTTP hop). Never throws and never awaited by callers: a telemetry
 * write failure must not affect the real request/response it's attached
 * to. `core-workforce` and `core-intelligence` do not have direct database
 * access to this table, so they emit over HTTP to
 * `POST /api/v1/ops/platform/telemetry` instead (see their
 * core-operations-client.ts).
 */
export function emitBackendTelemetry(
  tenantId: string | undefined,
  name: string,
  properties: Record<string, unknown> = {},
): void {
  void ingestTelemetryEvents([
    {
      tenantId,
      suite: 'core_operations',
      name,
      actorType: 'system',
      occurredAt: new Date(),
      properties,
    },
  ]).catch((error) => {
    console.error(`[telemetry] failed to emit "${name}"`, error)
  })
}

export type TelemetryQuery = { suite?: unknown; name?: unknown; since?: unknown; limit?: unknown }

export function buildTelemetryQuery(tenantId: string | undefined, query: TelemetryQuery = {}): Prisma.TelemetryEventFindManyArgs {
  const suite = String(query.suite || '').trim()
  const name = String(query.name || '').trim()
  const since = query.since ? new Date(String(query.since)) : undefined
  if (since && Number.isNaN(since.getTime())) throw new TelemetryValidationError('since must be a valid ISO date')
  const requestedLimit = Number(query.limit || 100)
  const limit = Number.isFinite(requestedLimit) ? Math.min(200, Math.max(1, Math.round(requestedLimit))) : 100
  return {
    where: {
      ...(tenantId ? { tenantId } : {}),
      ...(suite ? { suite } : {}),
      ...(name ? { name } : {}),
      ...(since ? { occurredAt: { gte: since } } : {}),
    },
    orderBy: { occurredAt: 'desc' },
    take: limit,
  }
}

export const queryTelemetryEvents = (tenantId: string | undefined, query: TelemetryQuery = {}) =>
  prisma.telemetryEvent.findMany(buildTelemetryQuery(tenantId, query))

// --- Phase 36: internal-only telemetry summary (no per-tenant scoping) ------
//
// Deliberately separate from queryTelemetryEvents/buildTelemetryQuery above:
// that one is tenant-scoped (an owner viewing their own events) and returns
// raw rows; this is a founder_master-only cross-tenant aggregate for the
// internal dashboard. `since`/`suite`/`limit` reuse the same validation, but
// `tenantId` here is an optional *filter*, not an enforced scope.
export type TelemetrySummaryQuery = { suite?: unknown; since?: unknown; limit?: unknown; tenantId?: unknown }

/** Minimal event shape the summary needs — matches the persisted TelemetryEvent row. */
export type SummarizableTelemetryEvent = {
  tenantId: string | null
  suite: string
  name: string
  occurredAt: Date
  properties: unknown
}

// Best-effort classification, not a guaranteed taxonomy: no event-name or
// properties convention is currently enforced across the mobile client,
// web client, and three backend emitters (see docs/telemetry.md), so this
// intentionally matches on either an explicit `properties.outcome ===
// 'failure'` (used by some emitters) or a loose name substring, rather than
// requiring every producer to agree on a schema retroactively. Revisit once
// a real taxonomy is standardized.
const ERROR_NAME_PATTERN = /error|fail/i
const OFFLINE_NAME_PATTERN = /offline/i

function isErrorEvent(event: SummarizableTelemetryEvent): boolean {
  const outcome = (event.properties as Record<string, unknown> | null)?.outcome
  if (outcome === 'failure') return true
  return ERROR_NAME_PATTERN.test(event.name)
}

export type TelemetrySummary = {
  totalEvents: number
  errorCount: number
  errorRate: number
  offlineEventCount: number
  bySuite: Array<{ suite: string; count: number }>
  byName: Array<{ name: string; count: number }>
  byTenant: Array<{ tenantId: string; count: number }>
  recent: SummarizableTelemetryEvent[]
}

/**
 * Pure aggregation over an already-fetched event list — kept separate from
 * the Prisma query below so it can be unit-tested without a database,
 * matching this file's existing validation/rate-limit functions.
 */
export function summarizeTelemetryEvents(events: SummarizableTelemetryEvent[]): TelemetrySummary {
  const bySuite = new Map<string, number>()
  const byName = new Map<string, number>()
  const byTenant = new Map<string, number>()
  let errorCount = 0
  let offlineEventCount = 0

  for (const event of events) {
    bySuite.set(event.suite, (bySuite.get(event.suite) ?? 0) + 1)
    byName.set(event.name, (byName.get(event.name) ?? 0) + 1)
    if (event.tenantId) byTenant.set(event.tenantId, (byTenant.get(event.tenantId) ?? 0) + 1)
    if (isErrorEvent(event)) errorCount += 1
    if (OFFLINE_NAME_PATTERN.test(event.name)) offlineEventCount += 1
  }

  const toSortedCounts = <T extends string>(map: Map<T, number>, keyName: 'suite' | 'name' | 'tenantId') =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ [keyName]: key, count }) as never)

  return {
    totalEvents: events.length,
    errorCount,
    errorRate: events.length ? Number((errorCount / events.length).toFixed(4)) : 0,
    offlineEventCount,
    bySuite: toSortedCounts(bySuite, 'suite'),
    byName: toSortedCounts(byName, 'name'),
    byTenant: toSortedCounts(byTenant, 'tenantId'),
    recent: [...events].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 25),
  }
}

export function buildTelemetrySummaryQuery(query: TelemetrySummaryQuery = {}): Prisma.TelemetryEventFindManyArgs {
  const suite = String(query.suite || '').trim()
  const tenantId = String(query.tenantId || '').trim()
  const since = query.since ? new Date(String(query.since)) : undefined
  if (since && Number.isNaN(since.getTime())) throw new TelemetryValidationError('since must be a valid ISO date')
  const requestedLimit = Number(query.limit || 500)
  const limit = Number.isFinite(requestedLimit) ? Math.min(2000, Math.max(1, Math.round(requestedLimit))) : 500
  return {
    where: {
      ...(suite ? { suite } : {}),
      ...(tenantId ? { tenantId } : {}),
      ...(since ? { occurredAt: { gte: since } } : {}),
    },
    orderBy: { occurredAt: 'desc' },
    take: limit,
  }
}

export const queryTelemetrySummary = async (query: TelemetrySummaryQuery = {}): Promise<TelemetrySummary> =>
  summarizeTelemetryEvents(await prisma.telemetryEvent.findMany(buildTelemetrySummaryQuery(query)))


// --- Per-tenant (falling back to per-IP) rate limiting -----------------------
//
// Distinct from the global per-IP `createRateLimit` already applied to all
// `/api/v1` routes in app.ts: that guards against a single abusive client;
// this additionally guards against one legitimate-but-buggy tenant
// (e.g. a stuck retry loop) drowning out ingestion capacity for everyone
// else, by bucketing on tenantId when present.
export type RateLimitDecision = { allowed: boolean; remaining: number; resetAt: number }

export function createTelemetryRateLimiter(windowMs = 60_000, max = 60) {
  const hits = new Map<string, { count: number; resetAt: number }>()
  return (key: string): RateLimitDecision => {
    const now = Date.now()
    const current = hits.get(key)
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current
    entry.count += 1
    hits.set(key, entry)
    if (hits.size > 10_000) for (const [itemKey, value] of hits) if (value.resetAt <= now) hits.delete(itemKey)
    return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count), resetAt: entry.resetAt }
  }
}
