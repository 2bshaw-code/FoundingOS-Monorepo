/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher, type WorkspaceSlug } from '@foundingos/ui'
import { WorkspaceTestPage, type TestWorkspaceSlug } from '@foundingos/ui/workspace-test-page'
import { notFound } from 'next/navigation'

const pages = new Set(['suites', 'workspaces', 'consoles', 'test-workspaces', 'marketing', 'intelligence', 'about', 'pricing', 'contact'])
const workspaceSlugs = new Set<WorkspaceSlug>(['retail', 'logistics', 'finance', 'talent', 'health'])
const testWorkspaceSlugs = new Set<TestWorkspaceSlug>(['retail', 'logistics', 'finance', 'marketing', 'talent', 'health', 'intelligence'])
const workspaceSections: Record<TestWorkspaceSlug, string[]> = {
  retail: ['overview', 'sales-pipeline', 'orders', 'point-of-sale', 'crm', 'segments', 'loyalty', 'inbox', 'campaigns', 'automations', 'content', 'products', 'inventory', 'promotions', 'channels', 'purchasing', 'suppliers', 'fulfilment', 'returns', 'service', 'payments', 'reports', 'team', 'integrations', 'settings'],
  logistics: ['overview', 'dispatch', 'routes', 'deliveries', 'tracking', 'exceptions', 'fleet', 'drivers', 'warehouses', 'customers', 'quotes', 'billing', 'reports', 'automations', 'team', 'integrations', 'settings'],
  finance: ['overview', 'cashflow', 'invoices', 'bills', 'banking', 'reconciliation', 'expenses', 'payments', 'budgets', 'forecasting', 'tax', 'approvals', 'reports', 'automations', 'team', 'integrations', 'settings'],
  marketing: ['overview', 'campaigns', 'calendar', 'audiences', 'segments', 'leads', 'content', 'brand-studio', 'channels', 'journeys', 'inbox', 'attribution', 'reports', 'automations', 'team', 'integrations', 'settings'],
  talent: ['overview', 'candidates', 'jobs', 'interviews', 'offers', 'onboarding', 'people', 'performance', 'time-off', 'learning', 'payroll', 'engagement', 'reports', 'automations', 'team', 'integrations', 'settings'],
  health: ['overview', 'appointments', 'patients', 'care-plans', 'triage', 'clinical-inbox', 'follow-ups', 'practitioners', 'locations', 'inventory', 'billing', 'claims', 'compliance', 'reports', 'automations', 'team', 'integrations', 'settings'],
  intelligence: ['overview', 'signals', 'risks', 'recommendations', 'forecasts', 'scenarios', 'anomalies', 'event-feed', 'workflows', 'models', 'data-sources', 'reports', 'automations', 'team', 'integrations', 'settings'],
}

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['suites'] },
    { slug: ['workspaces'] },
    { slug: ['workspaces', 'retail'] },
    { slug: ['workspaces', 'logistics'] },
    { slug: ['workspaces', 'finance'] },
    { slug: ['workspaces', 'marketing'] },
    { slug: ['workspaces', 'talent'] },
    { slug: ['workspaces', 'health'] },
    ...Object.entries(workspaceSections).flatMap(([workspace, sections]) => [
      { slug: ['test-workspaces', workspace] },
      ...sections.filter((section) => section !== 'overview').map((section) => ({ slug: ['test-workspaces', workspace, section] })),
    ]),
    // Compatibility paths for previously published links.
    { slug: ['consoles'] },
    { slug: ['consoles', 'retail'] },
    { slug: ['consoles', 'logistics'] },
    { slug: ['consoles', 'finance'] },
    { slug: ['consoles', 'talent'] },
    { slug: ['consoles', 'health'] },
    { slug: ['marketing'] },
    { slug: ['intelligence'] },
    { slug: ['about'] },
    { slug: ['pricing'] },
    { slug: ['contact'] },
  ]
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const page = slug[0] || 'home'
  if (page === 'home') return <FounderLauncher />
  if (!pages.has(page)) notFound()
  if (page === 'test-workspaces') {
    const workspace = slug[1] as TestWorkspaceSlug
    const section = slug[2] ?? 'overview'
    if (!testWorkspaceSlugs.has(workspace) || slug.length > 3 || !workspaceSections[workspace].includes(section)) notFound()
    return <WorkspaceTestPage section={section} workspace={workspace} />
  }
  if ((page === 'workspaces' || page === 'consoles') && slug[1]) {
    if (page === 'workspaces' && slug[1] === 'marketing' && slug.length === 2) {
      return <FounderLauncher page="marketing" />
    }
    if (!workspaceSlugs.has(slug[1] as WorkspaceSlug) || slug.length > 2) notFound()
    return <FounderLauncher page={page} workspaceSlug={slug[1] as WorkspaceSlug} />
  }
  if (slug.length > 1) notFound()
  return <FounderLauncher page={page as 'suites' | 'workspaces' | 'consoles' | 'marketing' | 'intelligence' | 'about' | 'pricing' | 'contact'} />
}