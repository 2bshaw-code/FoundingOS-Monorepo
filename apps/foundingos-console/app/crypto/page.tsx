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

// Real, working micro-dashboard for FounderOS's own internal /crypto sidebar tile — same
// live pipeline as /finance (BRAND_PERSONALITIES + generateBrandAIOutput + quantum
// enrichment). Unlike Finance, FoundCrypto also has its own real, deployed standalone
// console (crypto-console) — that app is the deep, full experience; this page is FounderOS's
// own always-available internal summary tile, kept real rather than the static placeholder
// it used to be ("Crypto is managed as an internal FounderOS module — no standalone console
// or ports yet", which was stale: crypto-console has existed and been deployed for a while).
export default async function CryptoPage() {
  const layer = BRAND_PERSONALITIES.crypto
  const ai = generateBrandAIOutput('crypto')
  const quantum = await enrichBrandSignalWithQuantum(buildBrandSignal('crypto'))
  return (
    <BrandMicroDashboard
      brandSlug="crypto"
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

