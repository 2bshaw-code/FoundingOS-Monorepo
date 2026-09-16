/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'

// Points at the core-operations/backend Retail Console spec API (Product,
// Variant — see docs/console-requirements.md). Client-side fetch mirrors the
// mobile lib/core-api.ts convention; fails gracefully if unreachable so this
// screen never blocks the console shell from rendering.
const CORE_API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-api.foundingos.com/api/v1'

type Variant = { id: string; label: string; sku: string; pricePence: number; stock: number }
type Product = { id: string; name: string; sku: string; category: string; pricePence: number; active: boolean; variants: Variant[] }

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('foundingos_token') : null
        const response = await fetch(`${CORE_API_BASE}/retail/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!response.ok) throw new Error('request failed')
        const data = await response.json()
        if (!cancelled) setProducts(data?.data ?? [])
      } catch {
        if (!cancelled) setError('Could not load the live product catalogue right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Product Catalog"
        description="Products and variants from the Retail Console backend (Core.Operations)."
      />
      {loading ? <p>Loading products…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && products.length === 0 ? <p>No products yet.</p> : null}
      <div className="module-table">
        {products.map((product) => (
          <div key={product.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <div>
              <strong>{product.name}</strong>
              <div>{product.sku} · {product.category} · £{(product.pricePence / 100).toFixed(2)}</div>
            </div>
            {product.variants.length > 0 ? (
              <div>
                {product.variants.map((variant) => (
                  <span key={variant.id} style={{ marginRight: 12 }}>
                    {variant.label}: {variant.stock}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
