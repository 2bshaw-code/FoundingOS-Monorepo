import { ModulePage, SettingsPage } from '@foundingos/ui'
import { brands } from '@foundingos/config'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  if (slug[0] === 'settings') return <SettingsPage brand={brands.foundingos} />
  if (slug[0] === 'modules' && slug[1]) return <ModulePage brand={brands.foundingos} moduleId={slug[1]} />
  notFound()
}