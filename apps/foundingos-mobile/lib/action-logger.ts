/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Minimal, dependency-free client-side action logger. Records only action
// type, outcome, and small non-sensitive metadata (ids, counts) — never
// record bodies, names, or anything else that could carry customer data.
// Kept in-memory (ring buffer) and surfaced via a hidden debug screen; not
// persisted or sent anywhere yet. Structured so each entry can later be
// forwarded as-is into the TelemetryEvent envelope described in
// docs/telemetry.md once a real sink exists.
export type ActionLogOutcome = 'success' | 'failure'

export type ActionLogEntry = {
  id: string
  type: string
  outcome: ActionLogOutcome
  metadata?: Record<string, string | number | boolean | null>
  occurredAt: string
}

const MAX_ENTRIES = 200
let entries: ActionLogEntry[] = []
let nextId = 0
const listeners = new Set<() => void>()

export function logAction(
  type: string,
  outcome: ActionLogOutcome,
  metadata?: Record<string, string | number | boolean | null>,
) {
  const entry: ActionLogEntry = {
    id: `log-${Date.now()}-${nextId++}`,
    type,
    outcome,
    metadata,
    occurredAt: new Date().toISOString(),
  }
  entries = [entry, ...entries].slice(0, MAX_ENTRIES)
  listeners.forEach((listener) => listener())
}

export function getActionLog(): ActionLogEntry[] {
  return entries
}

export function clearActionLog() {
  entries = []
  listeners.forEach((listener) => listener())
}

export function subscribeToActionLog(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
