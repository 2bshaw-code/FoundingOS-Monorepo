/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Quantum Orchestration Layer (QOL) — the single entry point every consumer
// (brand websites, brand consoles, SuperDashboard, tester survey pipeline)
// should call for anything Quantum-related. It centralizes the raw Quantum
// API calls, normalizes their output, and applies QDE tone/text rules — so a
// future real Quantum backend only ever needs to be wired up here.
import {
  fetchQuantumForecast as clientFetchForecast,
  fetchQuantumAnomalies as clientFetchAnomalies,
  fetchQuantumOpportunities as clientFetchOpportunities,
  fetchQuantumPulse as clientFetchPulse,
  type QuantumForecast,
  type QuantumAnomaly,
  type QuantumOpportunity,
  type QuantumPulseReading,
} from './quantum-client.ts'
import { buildQuantumInsightSentence, quantumSignalEnrichmentRules } from './quantum-defined-engine.ts'
import { enrichBrandSignalWithQuantum, enrichBrandSignalsWithQuantum, buildQuantumForecastSparkline, type QuantumEnrichedFields } from './quantum-enrichment.ts'
import type { IntelBrandSlug } from '../brand-intelligence.ts'

export { enrichBrandSignalWithQuantum, enrichBrandSignalsWithQuantum, buildQuantumForecastSparkline }
export type { QuantumEnrichedFields }

export function fetchQuantumForecast(brandSlug: IntelBrandSlug): Promise<QuantumForecast | null> {
  return clientFetchForecast(brandSlug)
}

export async function fetchQuantumAnomaly(brandSlug: IntelBrandSlug): Promise<QuantumAnomaly | null> {
  return clientFetchAnomalies(brandSlug)
}

export async function fetchQuantumOpportunity(brandSlug: IntelBrandSlug): Promise<QuantumOpportunity | null> {
  return clientFetchOpportunities(brandSlug)
}

export function fetchQuantumPulse(brandSlug: IntelBrandSlug): Promise<QuantumPulseReading | null> {
  return clientFetchPulse(brandSlug)
}

export type UnifiedQuantumPayload = {
  brand: IntelBrandSlug
  forecast: string
  anomaly: string | null
  opportunity: string
  pulse: number | null
  insightSentence: string
  degraded: boolean
}

// Normalizes all four Quantum reads into one consistent, QDE-toned payload — the
// shape every UI surface (website/console/dashboard) should render from.
export async function buildUnifiedQuantumPayload(brandSlug: IntelBrandSlug, kpiLabel: string): Promise<UnifiedQuantumPayload> {
  const [forecast, anomaly, opportunity, pulse] = await Promise.all([
    fetchQuantumForecast(brandSlug),
    fetchQuantumAnomaly(brandSlug),
    fetchQuantumOpportunity(brandSlug),
    fetchQuantumPulse(brandSlug),
  ])

  const degraded = !forecast && !anomaly && !opportunity && !pulse
  const forecastDirection = forecast?.direction ?? 'flat'

  return {
    brand: brandSlug,
    forecast: forecast?.summary ?? quantumSignalEnrichmentRules.offlineForecastTemplate(kpiLabel),
    anomaly: anomaly?.summary ?? null,
    opportunity: opportunity?.summary ?? `${quantumSignalEnrichmentRules.offlineOpportunityPrefix} ${kpiLabel}`,
    pulse: pulse?.pulse ?? null,
    insightSentence: buildQuantumInsightSentence({ brand: brandSlug, kpi: kpiLabel, forecastDirection }),
    degraded,
  }
}
