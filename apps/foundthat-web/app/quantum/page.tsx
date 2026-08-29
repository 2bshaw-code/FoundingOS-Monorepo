/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BRAND_PERSONALITIES } from '@foundingos/config/brand-intelligence'
import { buildUnifiedQuantumPayload } from '@foundingos/config/quantum-orchestration-layer'
import { buildQuantumWebsiteSection, buildQuantumDemoCtaLabel } from '@foundingos/config/quantum-defined-engine'
import { QuantumIntelligenceSection } from '@foundingos/ui/quantum-intelligence-section'

export default async function QuantumPage() {
  const layer = BRAND_PERSONALITIES.it
  const section = buildQuantumWebsiteSection()
  const payload = await buildUnifiedQuantumPayload('it', layer.kpis[0]?.label ?? layer.name)
  return (
    <QuantumIntelligenceSection
      brandName={layer.name}
      sectionTitle={section.title}
      sectionSubtitle={section.subtitle}
      forecast={payload.forecast}
      anomaly={payload.anomaly}
      opportunity={payload.opportunity}
      pulse={payload.pulse}
      insightSentence={payload.insightSentence}
      demoCtaLabel={buildQuantumDemoCtaLabel()}
    />
  )
}
