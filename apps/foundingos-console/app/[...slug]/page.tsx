/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandModulePage, BrandSettingsPage } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  if (slug[0] === 'settings') return <BrandSettingsPage config={brandConfig} />
  if (slug[0] === 'modules' && slug[1]) return <BrandModulePage config={brandConfig} moduleId={slug[1]} />
  notFound()
}