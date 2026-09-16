/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchPayments, reconcileMobileMoney, refundPayment, type Payment } from '../lib/finance-api'

export default function PaymentReconciliationPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchPayments().then((data) => {
      if (data === null) { setError('Could not load payments right now.'); setLoading(false); return }
      setPayments(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function reconcile(paymentId: string) {
    const updated = await reconcileMobileMoney(paymentId, { provider: 'mpesa' })
    if (!updated) { setFeedback('Could not reconcile this payment — please retry.'); return }
    setFeedback('✓ Payment reconciled via mobile money.')
    load()
  }

  async function refund(paymentId: string) {
    const refunded = await refundPayment(paymentId)
    if (!refunded) { setFeedback('Could not refund this payment — please retry.'); return }
    setFeedback('✓ Payment refunded.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Payment Reconciliation"
        description="Reconcile pending payments — including mobile money — and issue refunds."
      />
      {loading ? <p>Loading payments…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && payments.length === 0 ? <p>No payments yet.</p> : null}
      <div className="module-table">
        {payments.map((payment) => (
          <div key={payment.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>£{(Math.abs(payment.amountPence) / 100).toFixed(2)}</strong> · {payment.status}
            {payment.invoiceId ? ` · invoice ${payment.invoiceId.slice(0, 8)}` : ''}
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(payment.createdAt).toLocaleString('en-GB')}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {payment.status === 'pending' ? <button onClick={() => reconcile(payment.id)}>Reconcile (mobile money)</button> : null}
              {payment.status === 'succeeded' ? <button onClick={() => refund(payment.id)}>Refund</button> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
