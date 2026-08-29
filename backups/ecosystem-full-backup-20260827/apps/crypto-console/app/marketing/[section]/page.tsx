/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { notFound } from 'next/navigation'
import { MARKETING_SECTIONS, MarketingSectionPage, marketingModule } from '@foundingos/ui/marketing'
import { brandConfig } from '../../brand-config'

export function generateStaticParams() {
  return MARKETING_SECTIONS.map((section) => ({ section: section.slug }))
}

export default function MarketingSectionRoute({ params }: { params: { section: string } }) {
  const module = marketingModule(params.section)
  if (!module) notFound()

  return <MarketingSectionPage config={brandConfig} module={module} />
}
