/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// QuantumOS Polish — pure front-end demo enhancements for the per-brand intelligence
// layer. No backend calls, no routing changes; everything here is deterministic and
// derived from the brand's own pulse/kpis already passed down from the server page.
import { useMemo, useState } from 'react'

export type PersonalityMode = 'Analytical' | 'Aggressive' | 'Conservative'

const PERSONALITY_MODES: PersonalityMode[] = ['Analytical', 'Aggressive', 'Conservative']

const PERSONALITY_TONE: Record<PersonalityMode, { confidenceShift: number; blurb: string }> = {
  Analytical: { confidenceShift: 0, blurb: 'Balances signal and caution — recommendations favour evidence over speed.' },
  Aggressive: { confidenceShift: 12, blurb: 'Leans into growth signals faster — higher confidence, higher variance.' },
  Conservative: { confidenceShift: -12, blurb: 'Weights risk more heavily — slower to commit, steadier recommendations.' },
}

const SCENARIOS = [
  { id: 'demand-surge', label: 'Demand Surge', description: 'Model a sudden spike in customer demand across this brand.' },
  { id: 'supply-shock', label: 'Supply Shock', description: 'Model a supplier disruption affecting fulfilment.' },
  { id: 'risk-spike', label: 'Risk Spike', description: 'Model a sudden increase in operational or market risk.' },
] as const

type ScenarioId = (typeof SCENARIOS)[number]['id']

const SCENARIO_IMPACT: Record<ScenarioId, { pulseDelta: number; note: string }> = {
  'demand-surge': { pulseDelta: 14, note: 'Service load would rise fastest in the first 5–7 days; consider staffing buffer.' },
  'supply-shock': { pulseDelta: -9, note: 'Fulfilment delay risk increases; supplier diversification reduces exposure.' },
  'risk-spike': { pulseDelta: -6, note: 'Anomaly monitoring frequency should increase during elevated-risk windows.' },
}

const INSIGHT_PACKS: Record<string, string[]> = {
  retail: ['Basket size trending up 6% week-over-week.', 'Repeat-customer rate holding above 40%.', 'Weekend traffic outperforming weekday by 22%.'],
  meat: ['Supplier lead time steady at 3.2 days.', 'Cold-chain compliance at 98%.', 'Premium cut demand up 9% this month.'],
  foundthat: ['Engagement steady across active workflows.', 'Support response time improving week-over-week.', 'Adoption trending upward across new accounts.'],
  talent: ['Time-to-hire down 11% this quarter.', 'Candidate response rate improving.', 'Referral pipeline share rising.'],
  crypto: ['Volatility elevated vs 30-day average.', 'Automation coverage steady at 74%.', 'Alert precision improving week-over-week.'],
  finance: ['Portfolio risk within target band.', 'Client review cadence on schedule.', 'Compliance flags trending down.'],
  health: ['Appointment no-show rate improving.', 'Patient satisfaction steady above target.', 'Wait time trending down.'],
  logistics: ['On-time delivery rate steady above 94%.', 'Route efficiency improving week-over-week.', 'Fleet utilisation trending up.'],
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function QuantumScenarioPanel({ brandSlug, pulse }: { brandSlug: string; pulse: number }) {
  const [mode, setMode] = useState<PersonalityMode>('Analytical')
  const [months, setMonths] = useState(6)
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null)

  const baseConfidence = clampConfidence(50 + pulse / 2)
  const confidence = clampConfidence(baseConfidence + PERSONALITY_TONE[mode].confidenceShift)
  const insights = INSIGHT_PACKS[brandSlug] ?? INSIGHT_PACKS.retail

  const forecastNote = useMemo(() => {
    const trendPerMonth = mode === 'Aggressive' ? 1.4 : mode === 'Conservative' ? 0.6 : 1
    const projected = clampConfidence(pulse + trendPerMonth * months)
    return `Projected pulse in ${months} month${months === 1 ? '' : 's'}: ${projected}%`
  }, [mode, months, pulse])

  return (
    <div className="quantum-scenario-panel">
      <div className="module-card-grid">
        <article className="module-card card-premium">
          <div className="module-card-top"><span>◈</span><strong>Quantum confidence meter</strong></div>
          <div className="quantum-confidence-track" aria-hidden="true">
            <div className="quantum-confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
          <p>{confidence}% confidence — {mode} mode</p>
        </article>

        <article className="module-card card-premium">
          <div className="module-card-top"><span>◈</span><strong>Personality mode</strong></div>
          <div className="quantum-mode-switch" role="tablist" aria-label="QuantumOS personality mode">
            {PERSONALITY_MODES.map((option) => (
              <button key={option} type="button" role="tab" aria-selected={mode === option} className={mode === option ? 'active' : ''} onClick={() => setMode(option)}>
                {option}
              </button>
            ))}
          </div>
          <p>{PERSONALITY_TONE[mode].blurb}</p>
        </article>

        <article className="module-card card-premium">
          <div className="module-card-top"><span>◈</span><strong>Forecast slider</strong></div>
          <input type="range" min={1} max={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="quantum-forecast-slider" aria-label="Forecast horizon in months" />
          <p>{forecastNote}</p>
        </article>
      </div>

      <h3 style={{ marginTop: 20 }}>Scenario simulations</h3>
      <div className="module-card-grid">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className={`module-card card-premium quantum-scenario-card ${activeScenario === scenario.id ? 'active' : ''}`}
            style={{ textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setActiveScenario(scenario.id)}
          >
            <div className="module-card-top"><span>▶</span><strong>{scenario.label}</strong></div>
            <p>{scenario.description}</p>
            {activeScenario === scenario.id && (
              <div className="quantum-scenario-result">
                <span>{SCENARIO_IMPACT[scenario.id].pulseDelta > 0 ? '+' : ''}{SCENARIO_IMPACT[scenario.id].pulseDelta}% pulse</span>
                <p>{SCENARIO_IMPACT[scenario.id].note}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Quantum insight pack</h3>
      <ul className="quantum-insight-pack">
        {insights.map((line) => (
          <li key={line} className="quantum-anomaly-card">
            <span className="quantum-anomaly-dot" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuantumScenarioPanel
