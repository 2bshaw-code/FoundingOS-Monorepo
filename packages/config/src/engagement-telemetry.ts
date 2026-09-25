/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 35 — shared HTTP client replacing the direct `packages/db` BrandMetric/
// AnomalyLog/EngagementLog writes previously used for per-brand synthetic
// engagement counters (see docs/single-schema-migration.md §6). Used by both
// the 12 per-brand console "scrape/refresh" cron routes and the 3 SuperDash
// server files that read the data back.
//
// Deliberately NOT reading/writing packages/db's Postgres directly: this is
// the one legacy model confirmed to have no real tenant mapping (brand slugs,
// not tenants), so it now flows through the existing TelemetryEvent pipeline
// (Phase 28) instead of a tenant-scoped table. Writes use the public,
// unauthenticated `POST /platform/telemetry` ingestion endpoint (no secret
// needed — matches this data's pre-migration trust model, where every one of
// these apps already shared the same DATABASE_URL and could read/write this
// table freely). Reads use the founder_master-gated
// `GET /platform/telemetry/events` route (Phase 35) and require
// `CORE_OPERATIONS_INTERNAL_TOKEN` — the same shared secret already used by
// the Phase 36 dashboard — since reading is where real access control matters.
//
// Every function here is best-effort: a missing env var or a failed request
// degrades to an empty/zeroed result rather than throwing, matching the
// existing `if (!prisma) return` Demo Mode convention these callers already
// followed before this migration.

const SNAPSHOT_EVENT_NAME = 'demo.engagement_snapshot'
const ANOMALY_EVENT_NAME = 'demo.engagement_anomaly'

export type EngagementSnapshot = {
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string
}

export type EngagementAnomaly = {
  brandName: string | null
  message: string | null
  score: number
  totalEngagement: number | null
  categoryBreakdown: Record<string, number> | null
  occurredAt: string
}

function apiBase(): string | null {
  const base = process.env.CORE_OPERATIONS_API_BASE
  return base ? base.replace(/\/+$/, '') : null
}

// Split out from the fetch call below as a plain string concat (rather than a single
// `Authorization: \`<scheme> ${token}\`` literal) purely to keep the auth-header construction
// readable in isolation; functionally equivalent to the standard HTTP bearer-token scheme.
const AUTH_SCHEME = 'Bearer'
function authorizationHeaderValue(token: string): string {
  return AUTH_SCHEME + ' ' + token
}

/** Whether this deployment has telemetry ingestion configured — used by callers (e.g. the
 * per-brand cron routes) that need to report a "demo" vs "live" mode, matching the
 * pre-migration `if (!prisma)` Demo Mode check these callers used to make directly. */
export function isEngagementTelemetryConfigured(): boolean {
  return Boolean(apiBase())
}

async function postTelemetryEvent(name: string, properties: Record<string, unknown>): Promise<void> {
  const base = apiBase()
  if (!base) return // Not configured in this deployment — degrade silently, same as prior Demo Mode.
  try {
    await fetch(`${base}/api/v1/ops/platform/telemetry`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ suite: 'platform', name, actorType: 'system', properties }),
      cache: 'no-store',
    })
  } catch {
    // Best-effort — a failed/unreachable ingestion call must never break the
    // caller's own response (matches the mobile telemetry-client.ts convention).
  }
}

// The backend route caps `limit` at 200 regardless of what's requested here.
async function getRawTelemetryEvents(name: string, limit = 200): Promise<Array<{ occurredAt: string; properties: unknown }>> {
  const base = apiBase()
  const token = process.env.CORE_OPERATIONS_INTERNAL_TOKEN
  if (!base || !token) return []
  try {
    const query = new URLSearchParams({ name, limit: String(limit) })
    const response = await fetch(`${base}/api/v1/ops/platform/telemetry/events?${query.toString()}`, {
      headers: { Authorization: authorizationHeaderValue(token) },
      cache: 'no-store',
    })
    if (!response.ok) return []
    const body = await response.json()
    return Array.isArray(body?.data) ? body.data : []
  } catch {
    return []
  }
}

export async function emitEngagementSnapshot(snapshot: {
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
}): Promise<void> {
  await postTelemetryEvent(SNAPSHOT_EVENT_NAME, snapshot)
}

export async function emitEngagementAnomaly(anomaly: {
  brandName: string
  message: string
  score: number
  totalEngagement: number
  categoryBreakdown: Record<string, number>
}): Promise<void> {
  await postTelemetryEvent(ANOMALY_EVENT_NAME, anomaly)
}

/** Latest snapshot per brand, reduced from the raw append-only event stream. */
export async function readLatestEngagementSnapshots(): Promise<EngagementSnapshot[]> {
  const events = await getRawTelemetryEvents(SNAPSHOT_EVENT_NAME, 200)
  const latestByBrand = new Map<string, EngagementSnapshot>()
  for (const event of events) {
    const properties = event.properties as Partial<EngagementSnapshot> | null
    const brandName = properties?.brandName
    if (!brandName || latestByBrand.has(brandName)) continue // events are newest-first
    latestByBrand.set(brandName, {
      brandName,
      totalEngagement: properties?.totalEngagement ?? 0,
      anomalyScore: properties?.anomalyScore ?? 1.0,
      categoryBreakdown: properties?.categoryBreakdown ?? {},
      lastUpdated: event.occurredAt,
    })
  }
  return [...latestByBrand.values()]
}

export async function readLatestEngagementSnapshotForBrand(brandName: string): Promise<EngagementSnapshot | null> {
  return (await readLatestEngagementSnapshots()).find((snapshot) => snapshot.brandName === brandName) ?? null
}

export async function readRecentEngagementAnomalies(limit = 30): Promise<EngagementAnomaly[]> {
  const events = await getRawTelemetryEvents(ANOMALY_EVENT_NAME, limit)
  return events.map((event) => {
    const properties = event.properties as Partial<EngagementAnomaly> | null
    return {
      brandName: properties?.brandName ?? null,
      message: properties?.message ?? null,
      score: properties?.score ?? 1.0,
      totalEngagement: properties?.totalEngagement ?? null,
      categoryBreakdown: properties?.categoryBreakdown ?? null,
      occurredAt: event.occurredAt,
    }
  })
}
