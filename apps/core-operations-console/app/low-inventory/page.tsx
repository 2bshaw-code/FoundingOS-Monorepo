/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchLowInventoryPredictions, type LowInventoryPrediction } from '../lib/retail-api'

// Surfaces the predictLowInventory AI automation (core-operations/backend), which
// projects days-until-stockout from the last 14 days of InventoryMovement history
// and suggests a restock quantity — the "Predict low inventory" / "Auto-suggest
// restock quantities" AI automations from the Retail Console spec.
export default function LowInventoryAlertsPage() {
  const [predictions, setPredictions] = useState<LowInventoryPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchLowInventoryPredictions().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load low-inventory predictions right now.')
      else setPredictions(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Low Inventory Alerts"
        description="AI-predicted stockouts based on the last 14 days of sales velocity, with suggested restock quantities."
      />
      {loading ? <p>Checking stock levels…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && predictions.length === 0 ? <p>No stockouts predicted in the next 7 days.</p> : null}
      <div className="module-table">
        {predictions.map((prediction) => (
          <div key={prediction.variantId} className="module-row" style={{ borderColor: '#FF0033' }}>
            <strong>{prediction.label}</strong>
            <div>{prediction.stock} on hand · selling ~{prediction.dailyRunRate}/day</div>
            <div>
              {prediction.daysUntilStockout !== null ? `${prediction.daysUntilStockout} days until stockout` : 'No recent sales velocity'}
              {' · '}Suggested restock: {prediction.suggestedRestockQuantity} units
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
