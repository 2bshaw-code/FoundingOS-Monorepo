/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Unified Fulfilment-to-Cash dashboard — Phase 6. Joins Retail orders,
// Logistics shipments/delivery tasks, and Finance invoices/DSO into one
// view so an operator can see order → shipment → delivery → invoice →
// payment status for the whole fulfilment chain without switching
// consoles. Each data source degrades independently: if one API is
// unreachable, its column shows a fallback state rather than blocking
// the rest of the dashboard.

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchOrders, type RetailOrder } from '../lib/retail-api'
import { fetchShipments, fetchDeliveryTasks, type Shipment, type DeliveryTask } from '../lib/logistics-api'
import { fetchInvoices, fetchDsoSummary, type Invoice, type DsoSummary } from '../lib/finance-api'

type FulfilmentRow = {
  order: RetailOrder
  shipment?: Shipment
  deliveryTask?: DeliveryTask
  invoice?: Invoice
}

export default function FulfilmentToCashPage() {
  const [rows, setRows] = useState<FulfilmentRow[]>([])
  const [dso, setDso] = useState<DsoSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [partialFailure, setPartialFailure] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [orders, shipments, invoices, dsoSummary] = await Promise.all([
        fetchOrders(),
        fetchShipments(),
        fetchInvoices(),
        fetchDsoSummary(),
      ])

      if (cancelled) return

      const failures: string[] = []
      if (orders === null) failures.push('orders')
      if (shipments === null) failures.push('shipments')
      if (invoices === null) failures.push('invoices')
      if (failures.length > 0) setPartialFailure(`Could not load: ${failures.join(', ')}.`)

      const shipmentsByOrder = new Map((shipments ?? []).map((shipment) => [shipment.orderId, shipment]))
      const invoicesById = new Map((invoices ?? []).map((invoice) => [invoice.id, invoice]))

      // Delivery tasks are fetched per-shipment (no bulk endpoint), so pull
      // them for every known shipment in parallel and index by shipmentId.
      const taskLists = await Promise.all(
        (shipments ?? []).map((shipment) => fetchDeliveryTasks(shipment.id))
      )
      if (cancelled) return
      const taskByShipment = new Map<string, DeliveryTask>()
      taskLists.forEach((tasks, index) => {
        const shipment = (shipments ?? [])[index]
        const latest = (tasks ?? [])[0]
        if (shipment && latest) taskByShipment.set(shipment.id, latest)
      })

      const nextRows: FulfilmentRow[] = (orders ?? []).map((order) => {
        const shipment = shipmentsByOrder.get(order.id)
        return {
          order,
          shipment,
          deliveryTask: shipment ? taskByShipment.get(shipment.id) : undefined,
          invoice: invoicesById.get(order.id),
        }
      })

      setRows(nextRows)
      setDso(dsoSummary)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Fulfilment-to-Cash"
        description="Order → shipment → delivery → invoice → payment, in one view across Retail, Logistics, and Finance."
      />

      {dso ? (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{dso.avgDaysOutstanding.toFixed(1)} days</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Avg. days sales outstanding</div>
          </div>
          <div className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{dso.unpaidCount}</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Unpaid invoices</div>
          </div>
          <div className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{dso.atRiskCount}</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>At-risk invoices (AI-flagged)</div>
          </div>
        </div>
      ) : null}

      {loading ? <p>Loading fulfilment chain…</p> : null}
      {partialFailure ? <p className="module-error">{partialFailure}</p> : null}
      {!loading && rows.length === 0 ? <p>No orders yet.</p> : null}

      <div className="module-table">
        {rows.map((row) => (
          <div key={row.order.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{row.order.reference}</strong> · £{(row.order.totalPence / 100).toFixed(2)}
            <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap', fontSize: 13 }}>
              <span>Order: {row.order.status}</span>
              <span>Shipment: {row.shipment?.status ?? '—'}</span>
              <span>Delivery: {row.deliveryTask?.status ?? '—'}</span>
              <span>Invoice: {row.invoice?.status ?? '—'}</span>
              <span>Payment: {row.order.paymentStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
