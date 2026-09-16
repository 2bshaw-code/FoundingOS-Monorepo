/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Events are stored centrally by core-operations/backend (see events.ts / routes.ts there),
// regardless of which suite emitted them — every app's Event Feed screen points here, not at
// its own suite's API base.
export const EVENTS_API_BASE = 'https://core-operations-api.foundingos.com/api/v1'

export type FeedEvent = { id: string; type: string; source: string; payload: Record<string, unknown>; createdAt: string }

export async function fetchEvents(source?: string): Promise<FeedEvent[] | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await authedFetch(`${EVENTS_API_BASE}/ops/events${source ? `?source=${encodeURIComponent(source)}` : ''}`)
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as FeedEvent[] | null
  } catch {
    return null
  }
}
