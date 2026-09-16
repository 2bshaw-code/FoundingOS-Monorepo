/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../../brand-config'
import { fetchInvoices, sendInvoice, partialPayment, type Invoice } from '../../lib/finance-api'

export default function InvoiceDetailPage() {
  const params = useParams<{ invoiceId: string }>()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [amountGbp, setAmountGbp] = useState('')

  const load = () => {
    setError('')
    fetchInvoices().then((invoices) => {
      if (invoices === null) { setError('Could not load this invoice right now.'); setLoading(false); return }
      setInvoice(invoices.find((candidate) => candidate.id === params.invoiceId) ?? null)
      setLoading(false)
    })
  }

  useEffect(load, [params.invoiceId])

  async function handleSend() {
    if (!invoice) return
    const updated = await sendInvoice(invoice.id)
    if (!updated) { setFeedback('Could not send this invoice — please retry.'); return }
    setFeedback('✓ Invoice sent via WhatsApp.')
    load()
  }

  async function handlePartialPayment() {
    if (!invoice || !amountGbp) return
    const payment = await partialPayment(invoice.id, Math.round(Number(amountGbp) * 100))
    if (!payment) { setFeedback('Could not record this payment — please retry.'); return }
    setFeedback('✓ Payment recorded.')
    setAmountGbp('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Invoice Detail"
        description="Send the invoice, record partial payments, and track its status."
      />
      {loading ? <p>Loading invoice…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && !invoice ? <p>Invoice not found.</p> : null}

      {invoice ? (
        <div className="module-row" style={{ borderColor: brandConfig.accent }}>
          <h2>{invoice.number}</h2>
          <p>Total: £{(invoice.totalPence / 100).toFixed(2)}</p>
          <p>Status: {invoice.status}</p>
          {invoice.dueAt ? <p>Due: {new Date(invoice.dueAt).toLocaleDateString('en-GB')}</p> : null}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handleSend}>Send via WhatsApp</button>
          </div>
          <h3 style={{ marginTop: 16 }}>Record a payment</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={amountGbp} onChange={(event) => setAmountGbp(event.target.value)} placeholder="Amount (£)" type="number" />
            <button onClick={handlePartialPayment}>Record payment</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
