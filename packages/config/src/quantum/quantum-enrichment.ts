/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Enriches a BrandSignal with optional Quantum fields. Purely additive — never
// touches the deterministic brand-ai-engine fields (insight/risk/opportunity/etc).
// Falls back to deterministic QDE rules whenever the live Quantum backend is
// unavailable (which is always, today — there is no Quantum backend in this repo).
import type { BrandSignal } from '../brandSignalFeed.ts'
import { fetchQuantumForecast, fetchQuantumAnomalies, fetchQuantumOpportunities, fetchQuantumPulse } from './quantum-client.ts'
import { buildQuantumInsightSentence, quantumSignalEnrichmentRules } from './quantum-defined-engine.ts'

export type QuantumEnrichedFields = {
  quantumForecast?: string
  quantumAnomaly?: string | null
  quantumOpportunity?: string
  quantumRiskScore?: number
  quantumPulseAdjustment?: number
  quantumInsightSentence?: string
}

export async function enrichBrandSignalWithQuantum(signal: BrandSignal): Promise<BrandSignal & QuantumEnrichedFields> {
  const [forecast, anomaly, opportunity, pulse] = await Promise.all([
    fetchQuantumForecast(signal.brand),
    fetchQuantumAnomalies(signal.brand),
    fetchQuantumOpportunities(signal.brand),
    fetchQuantumPulse(signal.brand),
  ])

  const kpiLabel = signal.kpi.split(':')[0]?.trim() || signal.kpi
  const forecastDirection = forecast?.direction ?? 'flat'

  const quantumForecast = forecast?.summary ?? quantumSignalEnrichmentRules.offlineForecastTemplate(kpiLabel)
  const quantumAnomaly = anomaly
    ? anomaly.summary
    : signal.pulse >= quantumSignalEnrichmentRules.anomalyPulseThreshold
      ? `${signal.brand} pulse (${signal.pulse}%) is above the anomaly threshold.`
      : null
  const quantumOpportunity = opportunity?.summary ?? `${quantumSignalEnrichmentRules.offlineOpportunityPrefix} ${signal.opportunity}`
  const quantumPulseAdjustment = pulse ? pulse.pulse - signal.pulse : 0
  const quantumRiskScore = Math.min(quantumSignalEnrichmentRules.maxRiskScore, Math.max(0, 100 - signal.contributionScore))
  const quantumInsightSentence = buildQuantumInsightSentence({ brand: signal.brand, kpi: kpiLabel, forecastDirection })

  return {
    ...signal,
    quantumForecast,
    quantumAnomaly,
    quantumOpportunity,
    quantumRiskScore,
    quantumPulseAdjustment,
    quantumInsightSentence,
  }
}

export async function enrichBrandSignalsWithQuantum(signals: BrandSignal[]): Promise<Array<BrandSignal & QuantumEnrichedFields>> {
  return Promise.all(signals.map((signal) => enrichBrandSignalWithQuantum(signal)))
}

// Deterministic forecast sparkline derived from the brand's own historical points +
// the Quantum pulse delta — used only when a live Quantum forecast series isn't available.
export function buildQuantumForecastSparkline(basePoints: number[], pulseAdjustment: number): number[] {
  return basePoints.map((value) => Math.round(value + pulseAdjustment / 10))
}
