/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Survey Intelligence panel — reads the latest Customer/Buyer/Investor survey
// results from localStorage (Demo Mode). Purely front-end; no backend calls.
import { useEffect, useState } from 'react'
import { readSurveyResults, type SurveyResultEntry } from '@foundingos/config/surveys/survey-storage'
import { generateQuantumInterpretation } from '@foundingos/config/surveys/survey-engine'
import type { SurveyType } from '@foundingos/config/surveys/survey-definitions'

const SURVEY_LABELS: Record<SurveyType, string> = { customer: 'Customer', buyer: 'Buyer', investor: 'Investor' }

// Mocked trend deltas (Demo Mode only) — illustrative week-over-week movement.
const MOCK_TRENDS: Record<SurveyType, number> = { customer: 4, buyer: -2, investor: 6 }

function sentimentGlyph(sentiment: string) {
  return sentiment === 'positive' ? '▲' : sentiment === 'negative' ? '▼' : '●'
}

function SurveyResultCard({ type, entry }: { type: SurveyType; entry: SurveyResultEntry | null }) {
  const trend = MOCK_TRENDS[type]
  return (
    <div className="module-card fo-card">
      <div className="module-card-top">
        <strong>{SURVEY_LABELS[type]} Survey</strong>
        {entry && <small>{sentimentGlyph(entry.sentiment)} {entry.sentiment}</small>}
      </div>
      {entry ? (
        <>
          <p style={{ fontSize: 22, fontWeight: 700, margin: '4px 0' }}>{entry.score}<small style={{ fontSize: 12, fontWeight: 400 }}> /100</small></p>
          <small>{trend > 0 ? '+' : ''}{trend} vs last period (mocked)</small>
          <p style={{ marginTop: 8 }}>{entry.insight}</p>
          <p><small>{entry.risk}</small></p>
          <p><small>{entry.opportunity}</small></p>
          <p style={{ marginTop: 8, fontSize: 12, color: 'var(--accent, #00e0ff)' }}>{generateQuantumInterpretation(entry)}</p>
        </>
      ) : (
        <p><small>No {SURVEY_LABELS[type].toLowerCase()} survey completed yet.</small></p>
      )}
    </div>
  )
}

export function SuperDashSurveyPanel() {
  const [results, setResults] = useState<{ customer: SurveyResultEntry | null; buyer: SurveyResultEntry | null; investor: SurveyResultEntry | null } | null>(null)

  useEffect(() => {
    const store = readSurveyResults()
    setResults({
      customer: store.customer.at(-1) ?? null,
      buyer: store.buyer.at(-1) ?? null,
      investor: store.investor.at(-1) ?? null,
    })
  }, [])

  if (!results) return null

  const completed = [results.customer, results.buyer, results.investor].filter((entry): entry is SurveyResultEntry => Boolean(entry))
  const marketReadinessScore = completed.length > 0 ? Math.round(completed.reduce((total, entry) => total + entry.score, 0) / completed.length) : null

  return (
    <article className="panel wide fo-card" style={{ marginTop: 24 }}>
      <h2>Survey Intelligence</h2>
      <p><small>Customer, Buyer, and Investor survey results — deterministic AI scoring in Demo Mode, feeding directly into founder-level intelligence.</small></p>

      <div className="module-card-grid">
        <SurveyResultCard type="customer" entry={results.customer} />
        <SurveyResultCard type="buyer" entry={results.buyer} />
        <SurveyResultCard type="investor" entry={results.investor} />
        <div className="module-card fo-card">
          <div className="module-card-top"><strong>Market Readiness Score</strong></div>
          {marketReadinessScore !== null ? (
            <>
              <p style={{ fontSize: 22, fontWeight: 700, margin: '4px 0' }}>{marketReadinessScore}<small style={{ fontSize: 12, fontWeight: 400 }}> /100</small></p>
              <div className="quantum-confidence-track" aria-hidden="true">
                <div className="quantum-confidence-fill" style={{ width: `${marketReadinessScore}%` }} />
              </div>
              <small>Average across {completed.length} of 3 completed surveys.</small>
            </>
          ) : (
            <p><small>Complete at least one survey to see a combined score.</small></p>
          )}
        </div>
      </div>
    </article>
  )
}

export default SuperDashSurveyPanel
