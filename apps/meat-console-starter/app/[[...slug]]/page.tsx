/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ConsoleDashboard, ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

function titleForSlug(slug: string[]) {
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.meat.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.meat.name} Settings`
  if (slug[0] === 'crm') return `${brands.meat.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.meat.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.meat.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; if (slug.length === 0) return <ConsoleDashboard brand={brands.meat} />; if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.meat} />; if (slug[0] === 'settings') return <SettingsPage brand={brands.meat} />; if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.meat} moduleId={slug[1]} />; notFound() }