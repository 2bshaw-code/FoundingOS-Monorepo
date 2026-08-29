import { ConsoleDashboard, ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

function titleForSlug(slug: string[]) {
  if (slug.length === 0 || slug[0] === 'dashboard') return `${brands.crypto.name} Dashboard`
  if (slug[0] === 'settings') return `${brands.crypto.name} Settings`
  if (slug[0] === 'crm') return `${brands.crypto.name} CRM`
  if (slug[0] === 'modules' && slug[1]) return `${brands.crypto.name} ${slug[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`
  return brands.crypto.name
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  return { title: titleForSlug(params.slug ?? []) }
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) { const { slug = [] } = await params; if (slug.length === 0) return <ConsoleDashboard brand={brands.crypto} />; if (slug[0] === 'dashboard') return <ConsoleDashboard brand={brands.crypto} />; if (slug[0] === 'settings') return <SettingsPage brand={brands.crypto} />; if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.crypto} moduleId={slug[1]} />; notFound() }