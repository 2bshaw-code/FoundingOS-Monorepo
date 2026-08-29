/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Deterministic FoundAI-style heuristic — no external calls, mirrors the tester
// survey follow-up engine. Each brand's AI output is derived from its own
// personality layer only, so no cross-brand data crosses this boundary.
import { BRAND_PERSONALITIES, type IntelBrandSlug } from './brand-intelligence.ts'

export type BrandAIOutput = {
  insight: string
  risk: string
  opportunity: string
  recommendation: string
  microStory: string
  pulse: number
}

export function generateBrandAIOutput(brand: IntelBrandSlug): BrandAIOutput {
  const layer = BRAND_PERSONALITIES[brand]
  return {
    insight: layer.insightTile,
    risk: layer.riskTile,
    opportunity: layer.opportunityTile,
    recommendation: `Prioritise: ${layer.opportunityTile}`,
    microStory: layer.microStory,
    pulse: layer.basePulse,
  }
}
