/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FOUNDINGOS_ACCENT } from './brands'
import { WORKSPACES } from './workspace-modules'

// Every destination in the app — the suites, their dedicated dashboards, and the
// live per-workspace module grids — is defined once here and reused by both the
// Workspaces directory tab and the Search tab, instead of each screen keeping its
// own copy of this list out of sync with the other.
export const SUITE_LINKS = [
  { slug: 'foundingos', label: 'Home', name: 'Command Deck', tagline: 'Business pulse, approvals, messaging, and setup in one place.', route: '/home', accent: FOUNDINGOS_ACCENT },
  { slug: 'core_operations', label: 'Core.Operations', name: 'Work & Approvals', tagline: 'Governed actions across retail, logistics, finance, marketing, and health.', route: '/workflows', accent: '#26E07F' },
  { slug: 'core_workforce', label: 'Core.Workforce', name: 'Hiring', tagline: 'Roles, applicants, pipeline, and interviews.', route: '/workforce', accent: '#FFB703' },
  { slug: 'core_intelligence', label: 'Core.Intelligence', name: 'Intelligence', tagline: 'Accuracy, learning, signals, and the audit trail.', route: '/intelligence', accent: '#A78BFA' },
  { slug: 'marketing_studio', label: 'Marketing', name: 'Marketing Console', tagline: 'Campaigns, posts, and AI content generation.', route: '/marketing', accent: '#f56fc2' },
  { slug: 'automation', label: 'Automation', name: 'Messaging & Automation', tagline: 'WhatsApp automations and outbound messaging.', route: '/automation', accent: '#4cc9ff' },
  { slug: 'data', label: 'Data', name: 'Data & Offline Outbox', tagline: 'Sync status and queued offline actions.', route: '/data', accent: '#ffb33e' },
  { slug: 'team', label: 'Account', name: 'Team & Invitations', tagline: 'Manage teammates and pending invites across the whole account.', route: '/team', accent: '#4cc9ff' },
  { slug: 'guardian', label: 'Account', name: 'Guardian', tagline: 'AI action confidence, overrides, and safety signals.', route: '/guardian', accent: '#A78BFA' },
  { slug: 'activity', label: 'Account', name: 'Activity', tagline: 'The shared event feed — every action across every workspace.', route: '/activity', accent: '#26E07F' },
] as const

export type SearchResult = {
  id: string
  title: string
  subtitle: string
  accent: string
  route: string
}

// Flat, searchable index over every real destination in the app: the suite
// dashboards above, every one of the 7 live workspaces, and every module inside
// them (120+ real screens) — this replaces the old Command Bar search, which only
// matched against 4 hardcoded legacy brand entries and their fake module labels.
export function searchCatalogue(query: string): SearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: SearchResult[] = []

  for (const suite of SUITE_LINKS) {
    if (suite.name.toLowerCase().includes(needle) || suite.label.toLowerCase().includes(needle) || suite.tagline.toLowerCase().includes(needle)) {
      results.push({ id: `suite:${suite.slug}`, title: suite.name, subtitle: suite.tagline, accent: suite.accent, route: suite.route })
    }
  }

  for (const workspace of WORKSPACES) {
    if (workspace.label.toLowerCase().includes(needle)) {
      results.push({
        id: `workspace:${workspace.slug}`,
        title: workspace.label,
        subtitle: `${workspace.modules.length} modules`,
        accent: workspace.accent,
        route: `/workspace/${workspace.slug}`,
      })
    }
    for (const module of workspace.modules) {
      if (module.label.toLowerCase().includes(needle) || module.group.toLowerCase().includes(needle)) {
        results.push({
          id: `module:${workspace.slug}:${module.id}`,
          title: module.label,
          subtitle: `${workspace.label} · ${module.group}`,
          accent: workspace.accent,
          route: `/workspace/${workspace.slug}/${module.id}`,
        })
      }
    }
  }

  return results.slice(0, 40)
}
