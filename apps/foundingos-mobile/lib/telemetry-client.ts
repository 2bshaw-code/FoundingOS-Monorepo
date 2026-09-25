/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 29 — connects the in-memory action-logger ring buffer (Phase 22) to
// the real ingestion endpoint added in Phase 28
// (POST /api/v1/ops/platform/telemetry). Deliberately NOT SQLite-backed like
// outbox-sync.ts: telemetry is best-effort observability, not a governed
// business action, so losing unflushed entries on a force-quit is an
// acceptable, documented trade-off in exchange for staying minimal and
// non-blocking (see docs/telemetry.md and Phase 22's original scoping note).
import { AppState, type AppStateStatus } from 'react-native'
import { getActionLog, subscribeToActionLog, type ActionLogEntry } from './action-logger'
import { CORE_OPS_API_BASE, getSession } from './core-operations-api'
import { useQuantumStore } from './store'

const FLUSH_INTERVAL_MS = 60_000
const MAX_BATCH_SIZE = 50

let flushedIds = new Set<string>()
let flushTimer: ReturnType<typeof setInterval> | null = null
let appStateSubscription: { remove: () => void } | null = null
let isFlushing = false

function toTelemetryEvent(entry: ActionLogEntry, tenantId: string | null) {
  return {
    tenantId: tenantId || undefined,
    suite: 'platform' as const,
    name: `mobile.${entry.type}`,
    actorType: 'user' as const,
    occurredAt: entry.occurredAt,
    // entry.metadata is already restricted to non-PII ids/counts/booleans by
    // action-logger.ts's logAction() contract — no extra filtering needed here.
    properties: entry.metadata ?? {},
  }
}

/**
 * Sends any not-yet-flushed action-log entries to the telemetry endpoint.
 * Safe to call repeatedly (e.g. from a timer, an AppState change, and a
 * network-reconnect event all firing close together) — reentrant calls are
 * skipped, and entries are only marked flushed after a real 2xx response, so
 * a failed send retries on the next trigger rather than being silently lost
 * while still online.
 */
export async function flushTelemetry(): Promise<{ sent: number; failed: boolean }> {
  if (isFlushing) return { sent: 0, failed: false }
  if (!useQuantumStore.getState().isOnline) return { sent: 0, failed: false }
  const pending = getActionLog().filter((entry) => !flushedIds.has(entry.id)).slice(0, MAX_BATCH_SIZE)
  if (pending.length === 0) return { sent: 0, failed: false }

  isFlushing = true
  try {
    const session = await getSession().catch(() => null)
    const events = pending.map((entry) => toTelemetryEvent(entry, session?.tenantId ?? null))
    const response = await fetch(`${CORE_OPS_API_BASE}/api/v1/ops/platform/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      body: JSON.stringify({ events }),
    })
    if (!response.ok) return { sent: 0, failed: true }
    for (const entry of pending) flushedIds.add(entry.id)
    // Bound the tracking set the same way the ring buffer itself is bounded,
    // so a long-running session doesn't grow this indefinitely.
    if (flushedIds.size > 500) flushedIds = new Set(Array.from(flushedIds).slice(-200))
    return { sent: pending.length, failed: false }
  } catch {
    return { sent: 0, failed: true }
  } finally {
    isFlushing = false
  }
}

/**
 * Starts periodic + lifecycle-driven flushing. Call once from the root
 * layout; safe to call more than once (tears down any prior listeners).
 */
export function startTelemetryFlushLoop() {
  stopTelemetryFlushLoop()

  flushTimer = setInterval(() => void flushTelemetry(), FLUSH_INTERVAL_MS)

  appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
    if (nextState === 'background' || nextState === 'active') void flushTelemetry()
  })

  // Also flush immediately on every new log entry that represents a failure
  // — "automatic sending of critical errors" per the Phase 29 spec — rather
  // than waiting for the next periodic tick.
  const unsubscribeLog = subscribeToActionLog(() => {
    const latest = getActionLog()[0]
    if (latest?.outcome === 'failure') void flushTelemetry()
  })

  return () => {
    stopTelemetryFlushLoop()
    unsubscribeLog()
  }
}

export function stopTelemetryFlushLoop() {
  if (flushTimer) clearInterval(flushTimer)
  flushTimer = null
  appStateSubscription?.remove()
  appStateSubscription = null
}
