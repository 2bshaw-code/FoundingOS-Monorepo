/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchTimesheets, approveTimesheet, type Timesheet } from '../lib/workforce-api'

export default function TimesheetDashboardPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchTimesheets().then((data) => {
      if (data === null) { setError('Could not load timesheets right now.'); setLoading(false); return }
      setTimesheets(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function approve(timesheet: Timesheet) {
    const updated = await approveTimesheet(timesheet.id)
    if (!updated) { setFeedback('Could not approve this timesheet — please retry.'); return }
    setFeedback('✓ Timesheet approved.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Timesheet Dashboard"
        description="Approve submitted timesheets ahead of the next payroll run."
      />
      {loading ? <p>Loading timesheets…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && timesheets.length === 0 ? <p>No timesheets yet.</p> : null}
      <div className="module-table">
        {timesheets.map((timesheet) => (
          <div key={timesheet.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{timesheet.hours}h</strong> · {timesheet.status}
            <div>{new Date(timesheet.periodStart).toLocaleDateString('en-GB')} – {new Date(timesheet.periodEnd).toLocaleDateString('en-GB')}</div>
            {timesheet.status === 'pending' ? <button onClick={() => approve(timesheet)}>Approve</button> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
