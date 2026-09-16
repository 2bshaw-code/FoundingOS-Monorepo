/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import {
  fetchMedicalInvoices,
  createMedicalInvoice,
  sendMedicalInvoice,
  syncMedicalBillingToFinance,
  type MedicalInvoice,
} from '../lib/health-api'

export default function MedicalBillingPage() {
  const [invoices, setInvoices] = useState<MedicalInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [patientId, setPatientId] = useState('')
  const [amount, setAmount] = useState('')

  const load = () => {
    setError('')
    fetchMedicalInvoices().then((data) => {
      if (data === null) { setError('Could not load billing right now.'); setLoading(false); return }
      setInvoices(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function createInvoice() {
    const amountPence = Math.round(parseFloat(amount || '0') * 100)
    if (!patientId || !amountPence) { setFeedback('Enter a patient ID and amount.'); return }
    const created = await createMedicalInvoice({ patientId, amountPence })
    if (!created) { setFeedback('Could not create this invoice — please retry.'); return }
    setFeedback('✓ Medical invoice created.')
    setPatientId(''); setAmount('')
    load()
  }

  async function send(invoice: MedicalInvoice) {
    const updated = await sendMedicalInvoice(invoice.id)
    if (!updated) { setFeedback('Could not send this invoice — please retry.'); return }
    setFeedback('✓ Invoice sent to patient.')
    load()
  }

  async function sync(invoice: MedicalInvoice) {
    const updated = await syncMedicalBillingToFinance(invoice.id)
    if (!updated) { setFeedback('Could not sync to Finance — please retry.'); return }
    setFeedback('✓ Synced to Finance.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Medical Billing"
        description="Create, send, and reconcile patient invoices, synced through to Finance."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={patientId} onChange={(event) => setPatientId(event.target.value)} placeholder="Patient ID" />
        <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Amount (£)" />
        <button onClick={createInvoice}>Create invoice</button>
      </div>

      {loading ? <p>Loading invoices…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && invoices.length === 0 ? <p>No invoices yet.</p> : null}
      <div className="module-table">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>£{(invoice.amountPence / 100).toFixed(2)}</strong> · {invoice.status}
            <div style={{ fontSize: 12, opacity: 0.7 }}>Patient {invoice.patientId} · {new Date(invoice.createdAt).toLocaleDateString('en-GB')}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {!invoice.sentAt ? <button onClick={() => send(invoice)}>Send to patient</button> : <span style={{ fontSize: 12, opacity: 0.7 }}>Sent</span>}
              {!invoice.syncedToFinanceAt ? <button onClick={() => sync(invoice)}>Sync to Finance</button> : <span style={{ fontSize: 12, opacity: 0.7 }}>Synced</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
