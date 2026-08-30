/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Front-end-only tester identity — purely cosmetic/local state, no backend, no
// sessions, no cookies. Reads/writes are wrapped so a malformed or blocked
// localStorage never throws into the rest of the app.

const TESTER_PROFILE_KEY = 'founderos_tester_profile'

export type TesterRole = 'Founder' | 'Operator' | 'Investor' | 'Tester'

export type TesterProfile = {
  name: string
  brand: string | null
  role: TesterRole | null
  createdAt: string
}

export function readTesterProfile(): TesterProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(TESTER_PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.name !== 'string') return null
    return parsed as TesterProfile
  } catch {
    return null
  }
}

export function writeTesterProfile(profile: TesterProfile) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TESTER_PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore write failures (e.g. private browsing / storage disabled) — tester
    // access simply won't be remembered, nothing else in the app depends on it.
  }
}
