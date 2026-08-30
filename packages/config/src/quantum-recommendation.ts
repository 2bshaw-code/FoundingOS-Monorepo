/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Deterministic, rules-based scoring — this is a demo "AI recommendation" that
// runs entirely client-side from onboarding form inputs. No external model or
// live business data feed is required.

export type BusinessSize = 'solo' | 'small' | 'medium' | 'large'
export type RiskLevel = 'low' | 'medium' | 'high'
export type GrowthTrajectory = 'flat' | 'steady' | 'fast'
export type DataVolume = 'low' | 'medium' | 'high'
export type IntelligenceNeeds = 'basic' | 'moderate' | 'advanced'

export type BusinessProfile = {
  businessSize: BusinessSize
  industry: string
  dataVolume: DataVolume
  intelligenceNeeds: IntelligenceNeeds
  riskLevel: RiskLevel
  growthTrajectory: GrowthTrajectory
  consoleCount: number
  expectedMonthlyUsage: number
}

export type RecommendationStyle = 'subtle' | 'strong' | 'none'

export type Recommendation = {
  style: RecommendationStyle
  score: number
  headline: string
  reason: string
}

const SIZE_SCORE: Record<BusinessSize, number> = { solo: 5, small: 15, medium: 25, large: 35 }
const RISK_SCORE: Record<RiskLevel, number> = { low: 5, medium: 15, high: 25 }
const GROWTH_SCORE: Record<GrowthTrajectory, number> = { flat: 0, steady: 10, fast: 20 }
const VOLUME_SCORE: Record<DataVolume, number> = { low: 5, medium: 12, high: 20 }
const INTEL_SCORE: Record<IntelligenceNeeds, number> = { basic: 5, moderate: 15, advanced: 25 }

function scoreQuantumFit(profile: BusinessProfile): number {
  const consoleScore = Math.min(20, profile.consoleCount * 4)
  const usageScore = Math.min(15, Math.round(profile.expectedMonthlyUsage / 100))
  const total =
    SIZE_SCORE[profile.businessSize] +
    RISK_SCORE[profile.riskLevel] +
    GROWTH_SCORE[profile.growthTrajectory] +
    VOLUME_SCORE[profile.dataVolume] +
    INTEL_SCORE[profile.intelligenceNeeds] +
    consoleScore +
    usageScore
  return Math.min(100, total)
}

export function recommendQuantumOS(profile: BusinessProfile): Recommendation {
  const score = scoreQuantumFit(profile)

  if (score >= 70) {
    return {
      style: 'strong',
      score,
      headline: 'Best choice — based on your business profile.',
      reason: `${profile.businessSize === 'large' ? 'A business of this size' : 'Your growth trajectory and risk profile'} typically gets the most value from full Quantum orchestration across every console.`,
    }
  }

  if (score >= 40) {
    return {
      style: 'subtle',
      score,
      headline: 'Recommended for your business.',
      reason: 'Your profile suggests QuantumOS would add useful cross-console visibility, though it isn\u2019t essential yet.',
    }
  }

  return {
    style: 'none',
    score,
    headline: 'Not required yet.',
    reason: 'Your current profile is well served by SystemOS alone — QuantumOS can be added anytime as you grow.',
  }
}
