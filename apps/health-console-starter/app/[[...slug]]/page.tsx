/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ConsoleDashboard, ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

function titleForSlug(slug: string[]) {
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.health.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.health.name} Settings`
  if (slug[0] === 'crm') return `${brands.health.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.health.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.health.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; if (slug.length === 0) return <ConsoleDashboard brand={brands.health} />; if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.health} />; if (slug[0] === 'settings') return <SettingsPage brand={brands.health} />; if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.health} moduleId={slug[1]} />; notFound() }