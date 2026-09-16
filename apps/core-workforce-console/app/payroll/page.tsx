/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchPayrollRuns, triggerPayrollRun, syncPayrollToFinance, type PayrollRun } from '../lib/workforce-api'

export default function PayrollDashboardPage() {
  const [runs, setRuns] = useState<PayrollRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchPayrollRuns().then((data) => {
      if (data === null) { setError('Could not load payroll runs right now.'); setLoading(false); return }
      setRuns(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function trigger() {
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
    const created = await triggerPayrollRun({ periodStart, periodEnd })
    if (!created) { setFeedback('Could not trigger payroll — please retry.'); return }
    setFeedback('✓ Payroll run triggered.')
    load()
  }

  async function sync(run: PayrollRun) {
    const updated = await syncPayrollToFinance(run.id)
    if (!updated) { setFeedback('Could not sync to Finance — please retry.'); return }
    setFeedback('✓ Payroll run synced to Finance.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Payroll Dashboard"
        description="Trigger payroll runs and sync them through to Finance."
      />
      {feedback ? <p>{feedback}</p> : null}
      <button onClick={trigger}>Trigger payroll for this month</button>

      {loading ? <p>Loading payroll runs…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && runs.length === 0 ? <p>No payroll runs yet.</p> : null}
      <div className="module-table" style={{ marginTop: 16 }}>
        {runs.map((run) => (
          <div key={run.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>£{(run.totalPence / 100).toFixed(2)}</strong> · {run.status}
            <div>{new Date(run.periodStart).toLocaleDateString('en-GB')} – {new Date(run.periodEnd).toLocaleDateString('en-GB')}</div>
            {run.syncedToFinanceAt ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>Synced to Finance {new Date(run.syncedToFinanceAt).toLocaleString('en-GB')}</div>
            ) : (
              <button onClick={() => sync(run)}>Sync to Finance</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
