/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Aggregates per-brand signals for FounderOS SuperDashboard consumption. Brand
// consoles only ever call buildBrandSignal(ownBrand) for their own micro-dashboard —
// aggregateBrandSignals() (the cross-brand view) is only ever imported by
// apps/foundingos-console/app/superdashboard, preserving SuperDashboard isolation.
import { BRAND_PERSONALITIES, type IntelBrandSlug } from './brand-intelligence.ts'
import { generateBrandAIOutput, type BrandAIOutput } from './brand-ai-engine.ts'

export type { IntelBrandSlug }

export type BrandSignal = {
  brand: IntelBrandSlug
  kpi: string
  insight: string
  risk: string
  opportunity: string
  microStory: string
  pulse: number
  contributionScore: number
  timestamp: string
  // Optional Quantum enrichment (see quantum/quantum-enrichment.ts) — never populated
  // by buildBrandSignal itself, so existing deterministic consumers are unaffected.
  quantumForecast?: string
  quantumAnomaly?: string | null
  quantumOpportunity?: string
  quantumRiskScore?: number
  quantumPulseAdjustment?: number
  quantumInsightSentence?: string
}

// Deterministic composite: pulse intensity weighted with how much signal detail (insight/risk/opportunity) exists.
function computeContributionScore(ai: BrandAIOutput): number {
  const richness = Math.min(30, Math.round((ai.insight.length + ai.risk.length + ai.opportunity.length) / 12))
  return Math.min(100, Math.round(ai.pulse * 0.7 + richness))
}

export function buildBrandSignal(brand: IntelBrandSlug, timestamp: string = new Date().toISOString()): BrandSignal {
  const layer = BRAND_PERSONALITIES[brand]
  const ai = generateBrandAIOutput(brand)
  const primaryKpi = layer.kpis[0]
  return {
    brand,
    kpi: primaryKpi ? `${primaryKpi.label}: ${primaryKpi.value}` : layer.name,
    insight: ai.insight,
    risk: ai.risk,
    opportunity: ai.opportunity,
    microStory: ai.microStory,
    pulse: ai.pulse,
    contributionScore: computeContributionScore(ai),
    timestamp,
  }
}

export function aggregateBrandSignals(timestamp?: string): BrandSignal[] {
  return (Object.keys(BRAND_PERSONALITIES) as IntelBrandSlug[]).map((brand) => buildBrandSignal(brand, timestamp))
}

// Converts a completed tester survey run into a brand signal (used for Finance/Crypto today).
export function buildSignalFromSurveyRun(brand: IntelBrandSlug, answers: { questionId: string; answer: string }[], completedAt: string): BrandSignal {
  const base = buildBrandSignal(brand, completedAt)
  const feedback = answers.map((answer) => answer.answer).find((answer) => answer.trim().length > 0)
  return feedback ? { ...base, insight: `${base.insight} (tester feedback: "${feedback.slice(0, 80)}")` } : base
}
