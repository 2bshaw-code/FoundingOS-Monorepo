/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

// Real, global "AI Assistance: On/Off" preference — one cookie, shared across every
// *.foundingos.com subdomain (17 console apps), the same way the real tester session cookie
// already works (see apps/*/app/tester/session.ts, domain: '.foundingos.com'). Client-only
// (no server dependency) since every component that reads this already lives in
// packages/ui/src/console.tsx, which is 'use client' throughout.
//
// Default is ON (assistance enabled) until the user explicitly turns it off — matches the
// spec ("When On: show all AI guidance normally") and avoids a jarring first-run experience
// where AI help is silently missing before anyone has touched the setting.
const AI_ASSISTANCE_COOKIE = 'fo_ai_assistance'
const ONBOARDED_COOKIE = 'fo_onboarded_brands'
const CHANGE_EVENT = 'fo-ai-assistance-changed'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  // Real Vercel preview/local domains (e.g. *.vercel.app, localhost) can't set a
  // '.foundingos.com' cookie — this falls back to a same-origin cookie there so the toggle
  // still works while testing, and picks up the real cross-subdomain domain in production.
  const host = window.location.hostname
  const domainAttr = host.endsWith('foundingos.com') ? '; domain=.foundingos.com' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/${domainAttr}; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
}

export function isAIAssistanceEnabled(): boolean {
  const value = readCookieValue(AI_ASSISTANCE_COOKIE)
  return value !== 'off'
}

export function setAIAssistanceEnabled(enabled: boolean) {
  writeCookie(AI_ASSISTANCE_COOKIE, enabled ? 'on' : 'off')
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT))
}

// Client hook — every AI surface (FoundAI, AIInsightBanner, AIOnboardingWelcome,
// AIModuleHint, Guardian's AI explanations) calls this and renders nothing when it's false,
// so the toggle is respected everywhere from one place rather than every call site
// re-implementing the same check.
export function useAIAssistance(): boolean {
  const [enabled, setEnabled] = useState(true)
  useEffect(() => {
    setEnabled(isAIAssistanceEnabled())
    const handler = () => setEnabled(isAIAssistanceEnabled())
    window.addEventListener(CHANGE_EVENT, handler)
    return () => window.removeEventListener(CHANGE_EVENT, handler)
  }, [])
  return enabled
}

// First-visit onboarding tracking — one cookie holding a comma-separated set of brand slugs
// already welcomed, so "first enters any brand console" is tracked per-brand but shared
// across that brand's own console + starter variant (both use the same brand slug).
export function hasSeenOnboarding(brandSlug: string): boolean {
  const raw = readCookieValue(ONBOARDED_COOKIE)
  if (!raw) return false
  return raw.split(',').filter(Boolean).includes(brandSlug)
}

export function markOnboardingSeen(brandSlug: string) {
  const raw = readCookieValue(ONBOARDED_COOKIE)
  const seen = new Set(raw ? raw.split(',').filter(Boolean) : [])
  seen.add(brandSlug)
  writeCookie(ONBOARDED_COOKIE, [...seen].join(','))
}

export function AIAssistanceToggle() {
  const enabled = useAIAssistance()
  return (
    <label className="ai-assistance-toggle">
      <span>AI Assistance</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={`ai-toggle-switch ${enabled ? 'on' : 'off'}`}
        onClick={() => setAIAssistanceEnabled(!enabled)}
      >
        <span className="ai-toggle-knob" />
      </button>
      <span className="ai-toggle-state">{enabled ? 'On' : 'Off'}</span>
    </label>
  )
}
