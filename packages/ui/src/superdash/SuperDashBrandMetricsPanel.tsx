/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Live brand engagement panel — real BrandMetric rows from Postgres, additive to (not a
// replacement for) the existing mock portfolio table above. Only brands with a working
// survey-feed pipeline (currently just FoundRetail) ever have a row here, so this
// intentionally shows fewer brands than the mock table until other brand sites are wired
// the same way retail-web was.
import { useEffect, useState } from 'react'

type BrandMetricRow = {
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string
}

export function SuperDashBrandMetricsPanel() {
  const [rows, setRows] = useState<BrandMetricRow[] | null>(null)

  useEffect(() => {
    fetch('/api/superdash/brand-metrics')
      .then((response) => response.json())
      .then((data) => setRows(data.brands ?? []))
      .catch(() => setRows([]))
  }, [])

  if (rows === null) return null

  return (
    <article className="panel wide fo-card" style={{ marginTop: 24 }}>
      <h2>Live Brand Engagement</h2>
      <p><small>Real per-brand engagement from actual tester survey submissions — populated as each brand website's survey feed sends data. Separate from the portfolio overview above, which still shows illustrative figures for brands not yet wired.</small></p>

      {rows.length === 0 ? (
        <p><small>No live brand engagement yet — submit a survey on a connected brand website to populate this.</small></p>
      ) : (
        <div className="module-card-grid">
          {rows.map((row) => (
            <div key={row.brandName} className="module-card fo-card">
              <div className="module-card-top">
                <strong>{row.brandName}</strong>
                <small>Score {row.anomalyScore.toFixed(2)}</small>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, margin: '4px 0' }}>{row.totalEngagement}<small style={{ fontSize: 12, fontWeight: 400 }}> total engagement</small></p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {Object.entries(row.categoryBreakdown).map(([category, count]) => (
                  <small key={category} className="found-ai-chip">{category}: {count}</small>
                ))}
              </div>
              <small style={{ display: 'block', marginTop: 8, opacity: 0.7 }}>Updated {new Date(row.lastUpdated).toLocaleString('en-GB', { timeZone: 'UTC' })}</small>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default SuperDashBrandMetricsPanel
