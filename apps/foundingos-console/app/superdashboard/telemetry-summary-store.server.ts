/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 36 — server-side fetch for the internal telemetry dashboard. Calls
// core-operations-backend's founder_master-only GET /platform/telemetry/summary
// (Phase 36 route) rather than querying Postgres directly, because
// TelemetryEvent lives in that service's own `wros` Prisma schema
// (core-operations/backend/prisma/schema.prisma), a separate generated
// client this app has no dependency on — unlike brand-metric-store.server.ts's
// direct @foundingos/db import, which reads this app's own legacy schema.
export type TelemetrySummary = {
  totalEvents: number
  errorCount: number
  errorRate: number
  offlineEventCount: number
  bySuite: Array<{ suite: string; count: number }>
  byName: Array<{ name: string; count: number }>
  byTenant: Array<{ tenantId: string; count: number }>
  recent: Array<{ tenantId: string | null; suite: string; name: string; occurredAt: string; properties: unknown }>
}

const EMPTY_SUMMARY: TelemetrySummary = {
  totalEvents: 0,
  errorCount: 0,
  errorRate: 0,
  offlineEventCount: 0,
  bySuite: [],
  byName: [],
  byTenant: [],
  recent: [],
}

/**
 * Best-effort: returns an empty (not error-throwing) summary if the internal
 * API base/token env vars aren't configured, or if the request fails, so a
 * missing deployment secret degrades to "no data yet" rather than a 500 on
 * this internal-only page. Requires CORE_OPERATIONS_INTERNAL_TOKEN — a
 * founder_master-role service token — to be configured in this app's
 * deployment environment; not wired to a login flow (see docs/feature-flags.md
 * and docs/telemetry.md for the matching "no console session plumbing yet"
 * blocker this shares with Phase 34's admin UI).
 */
export async function readTelemetrySummary(params: { suite?: string; since?: string; limit?: number } = {}): Promise<TelemetrySummary> {
  const base = (process.env.CORE_OPERATIONS_API_BASE || '').replace(/\/+$/, '')
  const token = process.env.CORE_OPERATIONS_INTERNAL_TOKEN
  if (!base || !token) return EMPTY_SUMMARY

  const query = new URLSearchParams()
  if (params.suite) query.set('suite', params.suite)
  if (params.since) query.set('since', params.since)
  if (params.limit) query.set('limit', String(params.limit))

  try {
    const response = await fetch(`${base}/api/v1/ops/platform/telemetry/summary?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!response.ok) return EMPTY_SUMMARY
    const body = await response.json()
    return body?.data ?? EMPTY_SUMMARY
  } catch {
    return EMPTY_SUMMARY
  }
}
