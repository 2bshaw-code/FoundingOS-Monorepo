/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { CORE_API_BASE, fetchOrders, type RetailOrder, coreApiFetch } from '../lib/retail-api'

// Fulfilment Trigger Panel: manually creates a Shipment (Logistics) and Invoice
// (Finance) for a confirmed Retail order, using the same /logistics/shipments
// and /console orders->invoice flow the automated order.confirmed handler
// would use — a manual escape hatch for orders that need fulfilment kicked
// off outside the automatic flow.
export default function FulfilmentTriggerPanelPage() {
  const [orders, setOrders] = useState<RetailOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders((data ?? []).filter((order) => order.deliveryStatus === 'unassigned'))
      setLoading(false)
    })
  }, [])

  async function triggerFulfilment(order: RetailOrder) {
    const shipment = await coreApiFetch(`/logistics/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id }),
    })
    setFeedback((prev) => ({ ...prev, [order.id]: shipment ? `✓ Shipment created for ${order.reference}.` : `Could not create shipment for ${order.reference}.` }))
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Fulfilment Trigger Panel"
        description="Manually trigger shipment creation for confirmed orders awaiting fulfilment."
      />
      {loading ? <p>Loading orders awaiting fulfilment…</p> : null}
      {!loading && orders.length === 0 ? <p>No orders currently awaiting fulfilment.</p> : null}
      <div className="module-table">
        {orders.map((order) => (
          <div key={order.id} className="module-row" style={{ borderColor: brandConfig.accent, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{order.reference}</strong> · £{(order.totalPence / 100).toFixed(2)}
              <div>{order.status} · {feedback[order.id] ?? ''}</div>
            </div>
            <button onClick={() => triggerFulfilment(order)}>Trigger fulfilment</button>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>API base: {CORE_API_BASE}</p>
    </div>
  )
}
