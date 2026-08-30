/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Demo/front-end activation state — no live database or payment processor is
// wired to this. Package activation is tracked client-side only, matching the
// existing demo/prototype pattern already used elsewhere in this ecosystem
// (e.g. the sidebar-collapsed preference).

const ACTIVATION_KEY = 'foundingos-package-activation'

export type ActivationState = {
  businessName: string
  industry: string
  baseTier: string
  industryPack?: string
  hardwarePacks: string[]
  quantumOS: boolean
  intelligenceOS: boolean
  pricingModel: 'A' | 'B' | 'C'
  totalMonthly: number
  activatedAt: string
}

export function readActivationState(): ActivationState | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(ACTIVATION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ActivationState
  } catch {
    return null
  }
}

export function writeActivationState(state: ActivationState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACTIVATION_KEY, JSON.stringify(state))
}

export function clearActivationState() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACTIVATION_KEY)
}
