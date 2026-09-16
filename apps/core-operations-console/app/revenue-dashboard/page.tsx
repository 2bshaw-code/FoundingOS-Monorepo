/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchRevenueRecognition, fetchDsoSummary, type RevenueRecognitionEntry, type DsoSummary } from '../lib/finance-api'

export default function RevenueDashboardPage() {
  const [entries, setEntries] = useState<RevenueRecognitionEntry[]>([])
  const [dso, setDso] = useState<DsoSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchRevenueRecognition(), fetchDsoSummary()]).then(([revenue, dsoSummary]) => {
      if (cancelled) return
      if (revenue === null) setError('Could not load revenue data right now.')
      else setEntries(revenue)
      setDso(dsoSummary)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const totalRecognisedPence = entries.reduce((sum, entry) => sum + entry.amountPence, 0)

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Revenue Dashboard"
        description="Recognised revenue by period, plus days-sales-outstanding and at-risk invoices."
      />
      {loading ? <p>Loading revenue…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error ? (
        <div className="module-row" style={{ borderColor: brandConfig.accent, marginBottom: 16 }}>
          <p>Total recognised revenue: £{(totalRecognisedPence / 100).toFixed(2)}</p>
          {dso ? (
            <>
              <p>Average DSO: {dso.avgDaysOutstanding} days</p>
              <p>Unpaid invoices: {dso.unpaidCount}</p>
              <p>At-risk invoices: {dso.atRiskCount}</p>
            </>
          ) : null}
        </div>
      ) : null}
      <h3>Revenue by period</h3>
      <div className="module-table">
        {entries.map((entry) => (
          <div key={entry.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{entry.period}</strong> · £{(entry.amountPence / 100).toFixed(2)}
          </div>
        ))}
        {!loading && !error && entries.length === 0 ? <p>No revenue recognised yet.</p> : null}
      </div>
    </div>
  )
}
