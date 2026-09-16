/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchOrders, type RetailOrder } from '../lib/retail-api'

export default function OrderListPage() {
  const [orders, setOrders] = useState<RetailOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchOrders().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load orders right now.')
      else setOrders(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Order List"
        description="All orders placed via web, mobile, and WhatsApp intake."
      />
      {loading ? <p>Loading orders…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && orders.length === 0 ? <p>No orders yet.</p> : null}
      <div className="module-table">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="module-row" style={{ display: 'block', borderColor: brandConfig.accent, textDecoration: 'none', color: 'inherit' }}>
            <strong>{order.reference}</strong> · £{(order.totalPence / 100).toFixed(2)}
            <div>{order.status} · payment {order.paymentStatus} · delivery {order.deliveryStatus} · via {order.source}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(order.createdAt).toLocaleString('en-GB')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
