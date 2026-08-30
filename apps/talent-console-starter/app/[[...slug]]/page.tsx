/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ConsoleDashboard, ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

function titleForSlug(slug: string[]) {
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.talent.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.talent.name} Settings`
  if (slug[0] === 'crm') return `${brands.talent.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.talent.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.talent.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; if (slug.length === 0) return <ConsoleDashboard brand={brands.talent} />; if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.talent} />; if (slug[0] === 'settings') return <SettingsPage brand={brands.talent} />; if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.talent} moduleId={slug[1]} />; notFound() }