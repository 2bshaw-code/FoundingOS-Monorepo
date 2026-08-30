/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ConsoleDashboard, ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const routeAliases: Record<string, string> = {
  intel: 'monitoring',
  data: 'reports',
}

function titleForSlug(slug: string[]) {
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.foundthat.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.foundthat.name} Settings`
  if (slug[0] === 'crm') return `${brands.foundthat.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.foundthat.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  if (slug[0] && routeAliases[slug[0]]) return `${brands.foundthat.name} ${routeAliases[slug[0]].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.foundthat.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params

  if (slug.length === 0) return <ConsoleDashboard brand={brands.foundthat} />
  if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.foundthat} />
  if (slug[0] === 'settings') return <SettingsPage brand={brands.foundthat} />
  if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.foundthat} moduleId={slug[1]} />
  if (slug[0] && routeAliases[slug[0]]) return <ModulePage brand={brands.foundthat} moduleId={routeAliases[slug[0]]} />

  notFound()
}