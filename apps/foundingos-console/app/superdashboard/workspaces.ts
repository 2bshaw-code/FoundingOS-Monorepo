/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { deprecatedBrands } from '@foundingos/config/suites'

// Maps the legacy signal slugs to the workspace and suite names used since the
// FoundingOS restructure (see docs/positioning.md and docs/migration-map.md).
const WORKSPACES: Record<string, { label: string; suite: string }> = {
  retail: { label: 'Retail', suite: 'Core.Operations' },
  logistics: { label: 'Logistics', suite: 'Core.Operations' },
  finance: { label: 'Finance', suite: 'Core.Operations' },
  health: { label: 'Health', suite: 'Core.Operations' },
  talent: { label: 'Talent', suite: 'Core.Workforce' },
  foundthat: { label: 'System Integrity', suite: 'Core.Intelligence' },
  it: { label: 'Intelligence', suite: 'Core.Intelligence' },
}

const SUITE_BY_LABEL = new Map(Object.values(WORKSPACES).map(({ label, suite }) => [label, suite]))

export function isActiveWorkspaceSignal(signal: { brand: string }): boolean {
  return !(deprecatedBrands as readonly string[]).includes(signal.brand)
}

export function workspaceLabel(slug: string): string {
  return WORKSPACES[slug]?.label ?? slug
}

export function workspaceSuite(label: string): string {
  return SUITE_BY_LABEL.get(label) ?? '—'
}

// Shared quantum copy names the raw slug ("for foundthat"); show the workspace name instead.
export function withWorkspaceLabel(slug: string, text: string | null | undefined): string | undefined {
  return text?.replaceAll(`for ${slug} `, `for ${workspaceLabel(slug)} `)
}
