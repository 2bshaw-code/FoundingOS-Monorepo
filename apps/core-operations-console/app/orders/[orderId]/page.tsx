/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../../brand-config'
import { fetchOrders, updateOrderStatus, type RetailOrder } from '../../lib/retail-api'

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<RetailOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchOrders().then((orders) => {
      if (orders === null) { setError('Could not load this order right now.'); setLoading(false); return }
      setOrder(orders.find((candidate) => candidate.id === params.orderId) ?? null)
      setLoading(false)
    })
  }

  useEffect(load, [params.orderId])

  async function transition(status: string) {
    if (!order) return
    const updated = await updateOrderStatus(order.id, { status })
    if (!updated) { setFeedback('Could not update order status — please retry.'); return }
    setFeedback(`✓ Order marked ${status}.`)
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Order Detail"
        description="Order status, payment, and delivery timeline."
      />
      {loading ? <p>Loading order…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && !order ? <p>Order not found.</p> : null}

      {order ? (
        <div className="module-row" style={{ borderColor: brandConfig.accent }}>
          <h2>{order.reference}</h2>
          <p>Total: £{(order.totalPence / 100).toFixed(2)}</p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Delivery: {order.deliveryStatus}</p>
          <p>Source: {order.source}</p>
          <p>Placed: {new Date(order.createdAt).toLocaleString('en-GB')}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => transition('confirmed')}>Confirm</button>
            <button onClick={() => transition('fulfilled')}>Mark fulfilled</button>
            <button onClick={() => transition('cancelled')}>Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
