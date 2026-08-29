/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BRAND_PERSONALITIES } from '@foundingos/config/brand-intelligence'
import { generateBrandAIOutput } from '@foundingos/config/brand-ai-engine'
import { buildBrandSignal } from '@foundingos/config/brandSignalFeed'
import { enrichBrandSignalWithQuantum, buildQuantumForecastSparkline } from '@foundingos/config/quantum-orchestration-layer'
import { buildQuantumDemoCtaLabel } from '@foundingos/config/quantum-defined-engine'
import { BrandMicroDashboard } from '@foundingos/ui/brand-micro-dashboard'

export default async function IntelligencePage() {
  const layer = BRAND_PERSONALITIES.meat
  const ai = generateBrandAIOutput('meat')
  const quantum = await enrichBrandSignalWithQuantum(buildBrandSignal('meat'))
  return (
    <BrandMicroDashboard
      brandName={layer.name}
      color={layer.color}
      pulse={ai.pulse}
      microStory={ai.microStory}
      kpis={layer.kpis}
      sparkline={layer.sparkline}
      insight={ai.insight}
      risk={ai.risk}
      opportunity={ai.opportunity}
      recommendation={ai.recommendation}
      quantumForecast={quantum.quantumForecast}
      quantumForecastSparkline={buildQuantumForecastSparkline(layer.sparkline, quantum.quantumPulseAdjustment ?? 0)}
      quantumAnomaly={quantum.quantumAnomaly}
      quantumOpportunity={quantum.quantumOpportunity}
      quantumPulseAdjustment={quantum.quantumPulseAdjustment}
      quantumInsightSentence={quantum.quantumInsightSentence}
      quantumDemoCtaLabel={buildQuantumDemoCtaLabel()}
    />
  )
}
