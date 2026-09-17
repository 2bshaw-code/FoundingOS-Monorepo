/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher, type WorkspaceSlug } from '@foundingos/ui'
import { notFound } from 'next/navigation'

const pages = new Set(['suites', 'workspaces', 'consoles', 'marketing', 'intelligence', 'about', 'pricing', 'contact'])
const workspaceSlugs = new Set<WorkspaceSlug>(['retail', 'logistics', 'finance', 'talent', 'health'])

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