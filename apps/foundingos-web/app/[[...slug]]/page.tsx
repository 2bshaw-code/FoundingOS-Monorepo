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
    { slug: ['test-workspaces', 'retail'] },
    { slug: ['test-workspaces', 'logistics'] },
    { slug: ['test-workspaces', 'finance'] },
    { slug: ['test-workspaces', 'marketing'] },
    { slug: ['test-workspaces', 'talent'] },
    { slug: ['test-workspaces', 'health'] },
    { slug: ['test-workspaces', 'intelligence'] },
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
    if (slug.length !== 2 || !testWorkspaceSlugs.has(slug[1] as TestWorkspaceSlug)) notFound()
    return <WorkspaceTestPage workspace={slug[1] as TestWorkspaceSlug} />
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