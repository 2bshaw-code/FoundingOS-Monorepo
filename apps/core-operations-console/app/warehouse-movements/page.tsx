/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchInventoryMovements, adjustInventory, type InventoryMovement } from '../lib/retail-api'

// Warehouse Movement Map: groups InventoryMovement records by warehouseId so
// operators can see stock flowing in/out of each warehouse, and move stock
// between warehouses (recorded as an "out" from the source + "in" to the
// destination — both are just InventoryMovement rows).
export default function WarehouseMovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [productId, setProductId] = useState('')
  const [fromWarehouse, setFromWarehouse] = useState('')
  const [toWarehouse, setToWarehouse] = useState('')
  const [quantity, setQuantity] = useState('')

  const load = () => {
    setError('')
    fetchInventoryMovements().then((data) => {
      if (data === null) { setError('Could not load warehouse movements right now.'); setLoading(false); return }
      setMovements(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function moveStock() {
    if (!productId || !fromWarehouse || !toWarehouse || !quantity) { setFeedback('Fill in product, both warehouses, and quantity.'); return }
    const qty = Number(quantity)
    const out = await adjustInventory({ productId, warehouseId: fromWarehouse, quantity: qty, direction: 'out', reason: `transfer to ${toWarehouse}` })
    const inMove = await adjustInventory({ productId, warehouseId: toWarehouse, quantity: qty, direction: 'in', reason: `transfer from ${fromWarehouse}` })
    if (!out || !inMove) { setFeedback('Could not complete the warehouse transfer — please retry.'); return }
    setFeedback('✓ Stock moved between warehouses.')
    setQuantity('')
    load()
  }

  const byWarehouse = movements.reduce<Record<string, InventoryMovement[]>>((acc, movement) => {
    const key = movement.warehouseId ?? 'unassigned'
    acc[key] = acc[key] ?? []
    acc[key].push(movement)
    return acc
  }, {})

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Warehouse Movements"
        description="Inventory flowing in and out of each warehouse, and transfers between them."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={productId} onChange={(event) => setProductId(event.target.value)} placeholder="Product ID" />
        <input value={fromWarehouse} onChange={(event) => setFromWarehouse(event.target.value)} placeholder="From warehouse" />
        <input value={toWarehouse} onChange={(event) => setToWarehouse(event.target.value)} placeholder="To warehouse" />
        <input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Quantity" type="number" />
        <button onClick={moveStock}>Transfer stock</button>
      </div>

      {loading ? <p>Loading movements…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && Object.keys(byWarehouse).length === 0 ? <p>No movements yet.</p> : null}
      {Object.entries(byWarehouse).map(([warehouseId, list]) => (
        <div key={warehouseId} style={{ marginTop: 16 }}>
          <h3>Warehouse: {warehouseId}</h3>
          <div className="module-table">
            {list.map((movement) => (
              <div key={movement.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
                {movement.direction === 'in' ? '+' : '-'}{movement.quantity} · {movement.reason}
                <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(movement.createdAt).toLocaleString('en-GB')}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
