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
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.it.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.it.name} Settings`
  if (slug[0] === 'crm') return `${brands.it.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.it.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  if (slug[0] && routeAliases[slug[0]]) return `${brands.it.name} ${routeAliases[slug[0]].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.it.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params

  if (slug.length === 0) return <ConsoleDashboard brand={brands.it} />
  if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.it} />
  if (slug[0] === 'settings') return <SettingsPage brand={brands.it} />
  if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.it} moduleId={slug[1]} />
  if (slug[0] && routeAliases[slug[0]]) return <ModulePage brand={brands.it} moduleId={routeAliases[slug[0]]} />

  notFound()
}