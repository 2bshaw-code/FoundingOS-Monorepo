/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchShipments, type Shipment } from '../lib/logistics-api'

export default function ShipmentListPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchShipments().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load shipments right now.')
      else setShipments(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Shipments"
        description="Every shipment created from a confirmed retail order, tracked through to delivery."
      />
      {loading ? <p>Loading shipments…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && shipments.length === 0 ? <p>No shipments yet.</p> : null}
      <div className="module-table">
        {shipments.map((shipment) => (
          <Link key={shipment.id} href={`/shipments/${shipment.id}`} className="module-row" style={{ display: 'block', borderColor: brandConfig.accent, textDecoration: 'none', color: 'inherit' }}>
            <strong>Shipment {shipment.id.slice(0, 8)}</strong> · order {shipment.orderId.slice(0, 8)}
            <div>{shipment.status} · driver {shipment.driverId ? shipment.driverId.slice(0, 8) : 'unassigned'} · route {shipment.routeId ? shipment.routeId.slice(0, 8) : 'none'}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(shipment.createdAt).toLocaleString('en-GB')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
