/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { authedFetch } from './api'

export type BespokeAction = { id: string; action: string; sessionId: string; note: string | null; payload: unknown; createdAt: string }

// Real write-back for bespoke, brand-specific actions (a paper trade, a cold-chain reading, a
// restock, an approval decision, a pipeline move, a delivery status change, etc.) that don't
// map onto a brandConfig module id — posts to this brand's own
// POST /api/console/bespoke-actions (Bearer-authenticated, same session as every other
// native-reachable route), which persists into the real module_actions table under a
// feature-scoped pseudo moduleId. Returns null on any failure so callers can fall back to
// their existing on-device cache rather than lose the action outright — this is the real
// write path, on-device storage becomes the offline queue/cache in front of it, not the only
// copy of the truth anymore.
export async function postBespokeAction(input: { moduleId: string; action: string; note?: string; payload?: unknown }): Promise<BespokeAction | null> {
  try {
    const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/bespoke-actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!response.ok) return null
    const json = await response.json()
    return json.action ?? null
  } catch {
    return null
  }
}

// Real history read for a bespoke feature (e.g. moduleId "delivery:DL-102" or a feature-wide
// key like "crypto-portfolio") — most recent real actions, newest first. Returns [] on any
// failure so a transient network error never blanks out a screen that already has local data.
export async function getBespokeActions(moduleId: string): Promise<BespokeAction[]> {
  try {
    const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/bespoke-actions?moduleId=${encodeURIComponent(moduleId)}`)
    if (!response.ok) return []
    const json = await response.json()
    return Array.isArray(json.actions) ? json.actions : []
  } catch {
    return []
  }
}
