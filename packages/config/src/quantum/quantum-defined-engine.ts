/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Quantum Defined Engine (QDE) — the single shared definition layer for Quantum's
// identity, tone, onboarding, demo behaviour, and UI/section shape across every
// brand website, brand console, and FounderOS SuperDashboard.
//
// QDE is deterministic and brand-agnostic: it never reads live Quantum data itself
// (that's quantum-client.ts's job) — it only defines HOW Quantum speaks and what
// it looks like, so every surface stays consistent even if Quantum is offline.

export type QuantumIdentity = { name: string; tone: string; personality: string; color: string; tagline: string }

export type QuantumMessagingRules = { greeting: string; style: string; maxSentenceLength: number }

export type QuantumOnboardingStep = { id: string; title: string; description: string }

export type QuantumDemoStep = { id: string; title: string; description: string }

export type QuantumUIComponentId =
  | 'forecast-sparkline'
  | 'anomaly-badge'
  | 'opportunity-tile'
  | 'pulse-delta'
  | 'insight-sentence'
  | 'demo-cta'

export type QuantumWebsiteSection = { title: string; subtitle: string; ctaLabel: string }

export type QuantumConsoleSection = { title: string; subtitle: string; components: QuantumUIComponentId[] }

export type QuantumOverlayConfig = { components: QuantumUIComponentId[]; degraded: boolean }

const QUANTUM_IDENTITY: QuantumIdentity = {
  name: 'Quantum',
  tone: 'calm, precise, forward-looking',
  personality: 'A steady co-pilot that quietly forecasts what is coming next — never alarmist, always additive.',
  color: '#7FDBFF',
  tagline: 'Quantum sees what happens next.',
}

const QUANTUM_DEMO_CTA_LABEL = 'See Quantum in action'

const QUANTUM_MESSAGING_RULES: QuantumMessagingRules = {
  greeting: 'Quantum is watching this signal.',
  style: 'short, declarative, one idea per sentence',
  maxSentenceLength: 140,
}

const QUANTUM_ONBOARDING: QuantumOnboardingStep[] = [
  { id: 'intro', title: 'Meet Quantum', description: 'Quantum forecasts, flags anomalies, and surfaces opportunities across every brand signal.' },
  { id: 'forecast', title: 'See a forecast', description: 'Quantum projects where a KPI is headed next, using the signal your brand already produces.' },
  { id: 'anomaly', title: 'Spot an anomaly', description: 'Quantum flags anything that breaks the pattern before it becomes a problem.' },
]

const QUANTUM_DEMO_STEPS: QuantumDemoStep[] = [
  { id: 'baseline', title: 'Detect baseline patterns', description: "Quantum reads the brand's current signal to establish its normal range." },
  { id: 'anomaly', title: 'Identify anomalies', description: 'Quantum flags anything that breaks the established pattern.' },
  { id: 'forecast', title: 'Forecast next 7 days', description: 'Quantum projects where the primary KPI is headed over the coming week.' },
  { id: 'opportunity', title: 'Highlight opportunities', description: 'Quantum surfaces the highest-value action available right now.' },
  { id: 'insight', title: 'Generate Quantum insight sentence', description: 'Quantum writes one plain-English insight sentence summarising the above.' },
]

const QUANTUM_UI_COMPONENTS: QuantumUIComponentId[] = [
  'forecast-sparkline',
  'anomaly-badge',
  'opportunity-tile',
  'pulse-delta',
  'insight-sentence',
  'demo-cta',
]

// How Quantum is allowed to enrich a BrandSignal — deterministic rules, not live data.
export const quantumSignalEnrichmentRules = {
  offlineForecastTemplate: (kpi: string) => `${kpi} is projected to hold within its recent range.`,
  anomalyPulseThreshold: 80,
  offlineOpportunityPrefix: 'Quantum suggests exploring:',
  maxRiskScore: 100,
}

export function buildQuantumIdentity(): QuantumIdentity {
  return { ...QUANTUM_IDENTITY }
}

export function buildQuantumInsightSentence(input: { brand: string; kpi: string; forecastDirection: 'up' | 'down' | 'flat' }): string {
  const trend = input.forecastDirection === 'up' ? 'trending up' : input.forecastDirection === 'down' ? 'trending down' : 'holding steady'
  const sentence = `Quantum projects ${input.kpi} for ${input.brand} is ${trend} over the next period.`
  return sentence.slice(0, QUANTUM_MESSAGING_RULES.maxSentenceLength)
}

export function buildQuantumDemoSteps(): QuantumDemoStep[] {
  return QUANTUM_DEMO_STEPS.map((step) => ({ ...step }))
}

export function buildQuantumDemoCtaLabel(): string {
  return QUANTUM_DEMO_CTA_LABEL
}

export function buildQuantumOverlayConfig(quantumAvailable: boolean): QuantumOverlayConfig {
  return { components: quantumAvailable ? QUANTUM_UI_COMPONENTS : [], degraded: !quantumAvailable }
}

export function buildQuantumWebsiteSection(): QuantumWebsiteSection {
  return {
    title: 'Quantum Intelligence',
    subtitle: 'Quantum forecasts, flags anomalies, and surfaces opportunities for this brand in real time.',
    ctaLabel: QUANTUM_DEMO_CTA_LABEL,
  }
}

export function buildQuantumConsoleSection(): QuantumConsoleSection {
  return {
    title: 'Quantum panel',
    subtitle: 'Forecast, anomaly, and opportunity intelligence for this brand.',
    components: [...QUANTUM_UI_COMPONENTS],
  }
}

export function buildQuantumMessagingRules(): QuantumMessagingRules {
  return { ...QUANTUM_MESSAGING_RULES }
}

export function buildQuantumOnboarding(): QuantumOnboardingStep[] {
  return QUANTUM_ONBOARDING.map((step) => ({ ...step }))
}
