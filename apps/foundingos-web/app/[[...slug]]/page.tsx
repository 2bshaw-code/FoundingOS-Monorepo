/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher, type WorkspaceSlug } from '@foundingos/ui'
import { WorkspaceDirectory, WorkspaceTestPage, type TestWorkspaceSlug } from '@foundingos/ui/workspace-test-page'
import { notFound } from 'next/navigation'
import { workspaceSections, workspaceStaticParams } from '../../src/workspace-routes'

const pages = new Set(['suites', 'workspaces', 'consoles', 'app', 'test-workspaces', 'marketing', 'intelligence', 'about', 'pricing', 'contact'])
const workspaceSlugs = new Set<WorkspaceSlug>(['retail', 'logistics', 'finance', 'talent', 'hr', 'health', 'legal'])
const testWorkspaceSlugs = new Set<TestWorkspaceSlug>(['retail', 'logistics', 'finance', 'marketing', 'talent', 'hr', 'health', 'legal', 'intelligence'])

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['home'] },
    { slug: ['suites'] },
    { slug: ['workspaces'] },
    { slug: ['test-workspaces'] },
    { slug: ['app'] },
    { slug: ['workspaces', 'retail'] },
    { slug: ['workspaces', 'logistics'] },
    { slug: ['workspaces', 'finance'] },
    { slug: ['workspaces', 'marketing'] },
    { slug: ['workspaces', 'talent'] },
    { slug: ['workspaces', 'hr'] },
    { slug: ['workspaces', 'health'] },
    { slug: ['workspaces', 'legal'] },
    ...workspaceStaticParams(),
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
  if (page === 'test-workspaces' && slug.length === 1) return <WorkspaceDirectory />
  if (page === 'app' && slug.length === 1) return <WorkspaceDirectory basePath="/app" />
  if (page === 'test-workspaces' || page === 'app') {
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