/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { authedFetch } from './api'

export type Entitlements = {
  tier: 'Starter' | 'Growth' | 'Enterprise'
  unlockedModules: string[]
  lockedModules: string[]
  enabledBoltOns: string[]
  availableBoltOns: string[]
}

export type TrialInfo = { active: boolean; endsAt: string | null }

export type EntitlementsResult = { entitlements: Entitlements; trial: TrialInfo }

// Real entitlements fetch — calls this brand's own GET /api/console/entitlements
// (Bearer-authenticated, same as every other native-reachable route), which resolves the
// signed-in identity's real tier from the shared Postgres tester_sessions row and maps it to
// this brand's own module/bolt-on list via @foundingos/config/entitlements. Returns null on
// any failure so callers can fail open (show every module) rather than lock a real user out
// because of a transient network error. Also returns the real 14-day free-trial state (first
// 100 signups only) so the home screen can show "N days left on your free trial".
export async function fetchEntitlements(): Promise<EntitlementsResult | null> {
  try {
    const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/entitlements`)
    if (!response.ok) return null
    const json = await response.json()
    if (!json.entitlements) return null
    return { entitlements: json.entitlements, trial: json.trial ?? { active: false, endsAt: null } }
  } catch {
    return null
  }
}

// Whole-number days remaining on an active trial, for a "X days left" banner. Returns null if
// there's no active trial or the end date has already passed.
export function trialDaysRemaining(trial: TrialInfo | null | undefined): number | null {
  if (!trial?.active || !trial.endsAt) return null
  const msRemaining = new Date(trial.endsAt).getTime() - Date.now()
  if (msRemaining <= 0) return null
  return Math.max(1, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
}
