/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
  fetchNoShowPredictions,
  type Appointment,
} from '../lib/health-api'

export default function AppointmentCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [riskByAppointment, setRiskByAppointment] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [patientId, setPatientId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [reason, setReason] = useState('')

  const load = () => {
    setError('')
    fetchAppointments().then((data) => {
      if (data === null) { setError('Could not load appointments right now.'); setLoading(false); return }
      setAppointments(data)
      setLoading(false)
    })
    fetchNoShowPredictions().then((predictions) => {
      if (!predictions) return
      const map: Record<string, number> = {}
      predictions.forEach((prediction) => { map[prediction.appointmentId] = prediction.risk })
      setRiskByAppointment(map)
    })
  }

  useEffect(load, [])

  async function book() {
    if (!patientId || !scheduledAt) { setFeedback('Enter a patient ID and time.'); return }
    const created = await createAppointment({ patientId, scheduledAt, reason })
    if (!created) { setFeedback('Could not book this appointment — please retry.'); return }
    setFeedback('✓ Appointment booked.')
    setPatientId(''); setScheduledAt(''); setReason('')
    load()
  }

  async function setStatus(appointment: Appointment, status: string) {
    const updated = await updateAppointmentStatus(appointment.id, status)
    if (!updated) { setFeedback('Could not update this appointment — please retry.'); return }
    setFeedback(`✓ Appointment marked ${status}.`)
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Appointment Calendar"
        description="Book and manage appointments, with no-show risk highlighted."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="Patient ID" />
        <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
        <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" />
        <button onClick={book}>Book appointment</button>
      </div>

      {loading ? <p>Loading appointments…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && appointments.length === 0 ? <p>No appointments yet.</p> : null}
      <div className="module-table">
        {appointments.map((appointment) => {
          const risk = riskByAppointment[appointment.id]
          return (
            <div key={appointment.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
              <strong>{new Date(appointment.scheduledAt).toLocaleString('en-GB')}</strong> · {appointment.status}
              {appointment.reason ? ` · ${appointment.reason}` : ''}
              {typeof risk === 'number' ? (
                <div style={{ fontSize: 12, opacity: 0.8 }}>No-show risk: {(risk * 100).toFixed(0)}%</div>
              ) : null}
              {appointment.status === 'scheduled' ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button onClick={() => setStatus(appointment, 'completed')}>Mark completed</button>
                  <button onClick={() => setStatus(appointment, 'no_show')}>Mark no-show</button>
                  <button onClick={() => setStatus(appointment, 'cancelled')}>Cancel</button>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
