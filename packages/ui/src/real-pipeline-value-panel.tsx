/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Real, database-backed cross-brand pipeline value (sum of every real CrmDeal row) — same-
// origin fetch since this only ever renders inside SuperDash (foundingos-console itself).
// Deliberately labeled "pipeline value" everywhere, never "revenue" or "booked" — a deal in
// pipeline isn't yet recognized revenue.
import { useEffect, useState } from 'react'
import { useRealFxRates, FxHint } from '@foundingos/ui/real-monetary'

type Rollup = { totalDealValue: number; totalExpectedValue: number; totalProbabilityWeightedValue: number; dealCount: number }

function formatGbp(amount: number): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(amount)
  } catch {
    return `£${amount.toFixed(2)}`
  }
}

export function RealPipelineValuePanel() {
  const [rollup, setRollup] = useState<Rollup | null>(null)
  const [loaded, setLoaded] = useState(false)
  const fx = useRealFxRates()

  useEffect(() => {
    fetch('/api/superdash/pipeline-rollup')
      .then((r) => r.json())
      .then((data: { rollup: Rollup }) => setRollup(data.rollup ?? null))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded || !rollup) return null

  return (
    <article className="panel wide fo-card" style={{ marginTop: 16 }}>
      <div className="module-card-top"><strong>Real pipeline value (live, database-backed)</strong></div>
      <p><small>Sum of every real CRM deal across all brands — this is pipeline value, not booked or recognized revenue. Real zero until real deals exist.</small></p>
      <p style={{ margin: '6px 0' }}>
        Total pipeline value: {formatGbp(rollup.totalDealValue)}<FxHint amountBase={rollup.totalDealValue} baseCurrency="GBP" fx={fx} /> · Expected: {formatGbp(rollup.totalExpectedValue)} · Probability-weighted: {formatGbp(rollup.totalProbabilityWeightedValue)} · {rollup.dealCount} real deal{rollup.dealCount === 1 ? '' : 's'} across all brands
      </p>
    </article>
  )
}

export default RealPipelineValuePanel
