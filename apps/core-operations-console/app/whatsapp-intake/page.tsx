/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { createOrder } from '../lib/retail-api'

// WhatsApp Order Intake: staff paste in the customer's WhatsApp phone number and
// order text (as sent by the customer), and this creates a real Order with
// source: 'whatsapp' — same createSpecOrder path used by web/mobile order
// creation, so it emits the same order.confirmed event on the shared backbone.
export default function WhatsAppOrderIntakePage() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [totalPence, setTotalPence] = useState('')
  const [autoInvoice, setAutoInvoice] = useState(true)
  const [autoFulfil, setAutoFulfil] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')
    const order = await createOrder({
      totalPence: Math.round(Number(totalPence || 0) * 100),
      source: 'whatsapp',
      autoInvoice,
      autoFulfil,
      items: [{ raw: message }],
      notes: `WhatsApp order from ${phone}`,
    })
    setSubmitting(false)
    if (!order) { setFeedback('Could not create the order — please retry.'); return }
    setFeedback(`✓ Order ${order.reference} created from WhatsApp message.`)
    setPhone(''); setMessage(''); setTotalPence('')
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="WhatsApp Order Intake"
        description="Turn an incoming WhatsApp order message into a real order, invoice, and fulfilment trigger."
      />
      {feedback ? <p>{feedback}</p> : null}
      <form onSubmit={handleSubmit} className="module-row" style={{ borderColor: brandConfig.accent, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
        <label>
          Customer WhatsApp number
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+2547..." required style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          Order message (as sent by customer)
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="2x rice, 1x cooking oil" required style={{ display: 'block', width: '100%' }} rows={3} />
        </label>
        <label>
          Order total (£)
          <input type="number" step="0.01" value={totalPence} onChange={(event) => setTotalPence(event.target.value)} required style={{ display: 'block', width: '100%' }} />
        </label>
        <label>
          <input type="checkbox" checked={autoInvoice} onChange={(event) => setAutoInvoice(event.target.checked)} /> Auto-generate invoice
        </label>
        <label>
          <input type="checkbox" checked={autoFulfil} onChange={(event) => setAutoFulfil(event.target.checked)} /> Auto-trigger fulfilment
        </label>
        <button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create order from WhatsApp message'}</button>
      </form>
    </div>
  )
}
