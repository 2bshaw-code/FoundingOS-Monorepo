/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchPatients, createPatient, type Patient } from '../lib/health-api'

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const load = () => {
    setError('')
    fetchPatients().then((data) => {
      if (data === null) { setError('Could not load patients right now.'); setLoading(false); return }
      setPatients(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function addPatient() {
    if (!name) { setFeedback('Enter a patient name.'); return }
    const created = await createPatient({ name, phone })
    if (!created) { setFeedback('Could not add this patient — please retry.'); return }
    setFeedback('✓ Patient added.')
    setName(''); setPhone('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Patient List"
        description="Every registered patient across the clinic."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Patient name" />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" />
        <button onClick={addPatient}>Add patient</button>
      </div>

      {loading ? <p>Loading patients…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && patients.length === 0 ? <p>No patients yet.</p> : null}
      <div className="module-table">
        {patients.map((patient) => (
          <div key={patient.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{patient.name}</strong>{patient.phone ? ` · ${patient.phone}` : ''}
            {patient.dateOfBirth ? ` · DOB ${new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}` : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
