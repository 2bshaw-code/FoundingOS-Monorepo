/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BaseTierName, PricingModel } from './package-model-d.ts'

export type QuantumAddOn = 'quantumos' | 'intelligenceos'

export type UsageInputs = {
  insights: number
  simulations: number
  anomalyDetections: number
  riskModels: number
  scenarioPacks: number
}

export const DEFAULT_USAGE: UsageInputs = {
  insights: 0,
  simulations: 0,
  anomalyDetections: 0,
  riskModels: 0,
  scenarioPacks: 0,
}

// Flat monthly price (Model A) per add-on.
const FLAT_PRICE: Record<QuantumAddOn, number> = {
  quantumos: 149,
  intelligenceos: 99,
}

// Tier multiplier (Model B) — the flat price scales with the customer's SystemOS base tier.
const TIER_MULTIPLIER: Record<BaseTierName, number> = {
  Starter: 0.6,
  Standard: 0.85,
  Premium: 1,
  Enterprise: 1.35,
}

// Per-unit usage rate (Model C), in GBP per unit per month.
const USAGE_RATE: Record<QuantumAddOn, Record<keyof UsageInputs, number>> = {
  quantumos: { insights: 0.4, simulations: 1.2, anomalyDetections: 0.9, riskModels: 2.5, scenarioPacks: 3 },
  intelligenceos: { insights: 0.3, simulations: 0.8, anomalyDetections: 0.6, riskModels: 1.5, scenarioPacks: 2 },
}

export type PriceBreakdownLine = { label: string; amount: number }
export type PriceResult = { amount: number; currency: 'GBP'; model: PricingModel; breakdown: PriceBreakdownLine[] }

export function calculateAddOnPrice(
  addOn: QuantumAddOn,
  model: PricingModel,
  options: { tier?: BaseTierName; usage?: Partial<UsageInputs> } = {},
): PriceResult {
  const flat = FLAT_PRICE[addOn]

  if (model === 'A') {
    return { amount: flat, currency: 'GBP', model, breakdown: [{ label: 'Flat monthly fee', amount: flat }] }
  }

  if (model === 'B') {
    const tier = options.tier ?? 'Standard'
    const multiplier = TIER_MULTIPLIER[tier]
    const amount = Math.round(flat * multiplier)
    return {
      amount,
      currency: 'GBP',
      model,
      breakdown: [
        { label: `Base fee (${tier} tier)`, amount: flat },
        { label: `${tier} tier multiplier ×${multiplier}`, amount },
      ],
    }
  }

  // Model C — usage-based
  const usage = { ...DEFAULT_USAGE, ...options.usage }
  const rates = USAGE_RATE[addOn]
  const breakdown: PriceBreakdownLine[] = (Object.keys(usage) as (keyof UsageInputs)[]).map((key) => ({
    label: `${usage[key]} × ${key} @ £${rates[key]}`,
    amount: Math.round(usage[key] * rates[key] * 100) / 100,
  }))
  const amount = Math.round(breakdown.reduce((total, line) => total + line.amount, 0) * 100) / 100
  return { amount, currency: 'GBP', model, breakdown }
}
