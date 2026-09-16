/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { adjustInventory, fetchInventoryMovements, fetchProducts, type InventoryMovement, type Product } from '../lib/retail-api'

export default function InventoryDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    Promise.all([fetchProducts(), fetchInventoryMovements()]).then(([nextProducts, nextMovements]) => {
      if (nextProducts === null) setError('Could not load inventory right now.')
      setProducts(nextProducts ?? [])
      setMovements(nextMovements ?? [])
      setLoading(false)
    })
  }

  useEffect(load, [])

  const totalUnits = products.reduce((sum, product) => sum + product.variants.reduce((s, v) => s + v.stock, 0), 0)
  const lowStockVariants = products.flatMap((product) => product.variants.filter((variant) => variant.stock <= 5).map((variant) => ({ product, variant })))

  async function handleAdjust(variantId: string, direction: 'in' | 'out', quantity: number) {
    const result = await adjustInventory({ variantId, direction, quantity, reason: 'manual-console-adjustment' })
    if (!result) {
      setFeedback('Could not record that adjustment — please retry.')
      return
    }
    setFeedback(`✓ Recorded ${direction === 'in' ? '+' : '-'}${quantity} units.`)
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Inventory Dashboard"
        description="Live stock levels and movements across all products and variants."
      />
      {loading ? <p>Loading inventory…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}

      <div className="module-metrics" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div className="module-row" style={{ borderColor: brandConfig.accent }}>
          <strong>{products.length}</strong>
          <div>Products tracked</div>
        </div>
        <div className="module-row" style={{ borderColor: brandConfig.accent }}>
          <strong>{totalUnits}</strong>
          <div>Total units on hand</div>
        </div>
        <div className="module-row" style={{ borderColor: lowStockVariants.length > 0 ? '#FF0033' : brandConfig.accent }}>
          <strong>{lowStockVariants.length}</strong>
          <div>Variants low on stock</div>
        </div>
      </div>

      <div className="module-table">
        {products.map((product) => (
          <div key={product.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{product.name}</strong>
            {product.variants.map((variant) => (
              <div key={variant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span>{variant.label} — {variant.stock} on hand{variant.stock <= 5 ? ' (low)' : ''}</span>
                <span>
                  <button onClick={() => handleAdjust(variant.id, 'in', 10)} style={{ marginRight: 8 }}>+10</button>
                  <button onClick={() => handleAdjust(variant.id, 'out', 1)}>-1</button>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 24 }}>Recent movements</h3>
      <div className="module-table">
        {movements.slice(0, 20).map((movement) => (
          <div key={movement.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            {movement.direction === 'in' ? '+' : '-'}{movement.quantity} · {movement.reason} · {new Date(movement.createdAt).toLocaleString('en-GB')}
          </div>
        ))}
      </div>
    </div>
  )
}
