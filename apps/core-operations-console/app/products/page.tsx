/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchProducts, type Product } from '../lib/retail-api'

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchProducts().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load the live product catalogue right now.')
      else setProducts(data)
      setLoading(false)
    })
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
