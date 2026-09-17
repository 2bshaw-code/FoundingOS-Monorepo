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
import { AIInsightsPanel } from '@foundingos/ui/ai-insights'
import { InsightsPanel } from '@foundingos/ui/insights'

const CORE_OPERATIONS_API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-api.foundingos.com/api/v1/ops'

export default async function IntelligencePage() {
  const layer = BRAND_PERSONALITIES.retail
  const ai = generateBrandAIOutput('retail')
  const quantum = await enrichBrandSignalWithQuantum(buildBrandSignal('retail'))
  return (
    <>
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
      <AIInsightsPanel
        apiBase={CORE_OPERATIONS_API_BASE}
        title="Retail-to-cash intelligence"
        sourceScope={['retail', 'logistics', 'finance']}
      />
      <InsightsPanel apiBase={CORE_OPERATIONS_API_BASE} sourceScope={['retail', 'logistics', 'finance']} />
    </>
  )
}
