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

// Real, working micro-dashboard for this brand's internal FounderOS sidebar tile — same live
// pipeline as /finance and /crypto (BRAND_PERSONALITIES + generateBrandAIOutput + quantum
// enrichment). Was previously missing entirely (404); this brings it in line with the other
// brand consoles using existing, already brand-accurate KPI/intelligence data.
export default async function FoundThatPage() {
  const layer = BRAND_PERSONALITIES.foundthat
  const ai = generateBrandAIOutput('foundthat')
  const quantum = await enrichBrandSignalWithQuantum(buildBrandSignal('foundthat'))
  return (
    <BrandMicroDashboard
      brandSlug="foundthat"
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
