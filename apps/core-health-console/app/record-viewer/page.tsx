/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchRecords, createRecord, type MedicalRecord } from '../lib/health-api'

export default function RecordViewerPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [patientId, setPatientId] = useState('')
  const [summary, setSummary] = useState('')
  const [filterPatientId, setFilterPatientId] = useState('')

  const load = (patient?: string) => {
    setError('')
    fetchRecords(patient || undefined).then((data) => {
      if (data === null) { setError('Could not load records right now.'); setLoading(false); return }
      setRecords(data)
      setLoading(false)
    })
  }

  useEffect(() => load(), [])

  async function addRecord() {
    if (!patientId || !summary) { setFeedback('Enter a patient ID and summary.'); return }
    const created = await createRecord({ patientId, summary })
    if (!created) { setFeedback('Could not add this record — please retry.'); return }
    setFeedback('✓ Record added.')
    setSummary('')
    load(filterPatientId)
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Record Viewer"
        description="View and add clinical records for a patient."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <input
          value={filterPatientId}
          onChange={(event) => setFilterPatientId(event.target.value)}
          placeholder="Filter by patient ID"
        />
        <button onClick={() => load(filterPatientId)}>Filter</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="Patient ID" />
        <input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Record summary" />
        <button onClick={addRecord}>Add record</button>
      </div>

      {loading ? <p>Loading records…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && records.length === 0 ? <p>No records yet.</p> : null}
      <div className="module-table">
        {records.map((record) => (
          <div key={record.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{record.summary}</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Patient {record.patientId} · {new Date(record.createdAt).toLocaleString('en-GB')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
