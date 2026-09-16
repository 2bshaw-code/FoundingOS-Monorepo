/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { createTreatment, updateTreatmentStatus, type Treatment } from '../lib/health-api'

export default function TreatmentWorkflowPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [feedback, setFeedback] = useState('')
  const [patientId, setPatientId] = useState('')
  const [description, setDescription] = useState('')

  async function addTreatment() {
    if (!patientId || !description) { setFeedback('Enter a patient ID and description.'); return }
    const created = await createTreatment({ patientId, description, status: 'planned' })
    if (!created) { setFeedback('Could not create this treatment — please retry.'); return }
    setFeedback('✓ Treatment created.')
    setTreatments((prev) => [created, ...prev])
    setDescription('')
  }

  async function setStatus(treatment: Treatment, status: string) {
    const updated = await updateTreatmentStatus(treatment.id, status)
    if (!updated) { setFeedback('Could not update this treatment — please retry.'); return }
    setFeedback(`✓ Treatment marked ${status}.`)
    setTreatments((prev) => prev.map((item) => (item.id === treatment.id ? updated : item)))
  }

  useEffect(() => {}, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Treatment Workflow"
        description="Plan, start, and complete patient treatments."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="Patient ID" />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Treatment description" />
        <button onClick={addTreatment}>Create treatment</button>
      </div>

      {treatments.length === 0 ? <p>No treatments created this session yet.</p> : null}
      <div className="module-table">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{treatment.description}</strong> · {treatment.status}
            <div style={{ fontSize: 12, opacity: 0.7 }}>Patient {treatment.patientId}</div>
            {treatment.status !== 'completed' ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => setStatus(treatment, 'in_progress')}>Start</button>
                <button onClick={() => setStatus(treatment, 'completed')}>Complete</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
