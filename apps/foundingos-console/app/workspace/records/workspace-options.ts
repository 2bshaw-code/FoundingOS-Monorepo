/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// The 7 real tenant workspaces (matches core-operations/backend/src/platform.ts
// workspaceSlugs, and apps/foundingos-mobile/lib/workspace-modules.ts) grouped under the
// three FoundingOS suites. A curated starter module per workspace keeps this page usable
// without duplicating the full ~150-module catalogue from packages/ui's
// CompleteWorkspaceApplication — any module id works against the real backend, these are
// just sensible, real defaults to start from.
export const WORKSPACE_OPTIONS: Array<{ slug: string; label: string; suite: string; defaultModule: string }> = [
  { slug: 'retail', label: 'Retail', suite: 'Core.Operations', defaultModule: 'inventory' },
  { slug: 'logistics', label: 'Logistics', suite: 'Core.Operations', defaultModule: 'deliveries' },
  { slug: 'finance', label: 'Finance', suite: 'Core.Operations', defaultModule: 'invoices' },
  { slug: 'marketing', label: 'Marketing', suite: 'Core.Operations', defaultModule: 'campaigns' },
  { slug: 'talent', label: 'Talent', suite: 'Core.Workforce', defaultModule: 'candidates' },
  { slug: 'health', label: 'Health', suite: 'Core.Workforce', defaultModule: 'cases' },
  { slug: 'intelligence', label: 'Intelligence', suite: 'Core.Intelligence', defaultModule: 'reports' },
]
