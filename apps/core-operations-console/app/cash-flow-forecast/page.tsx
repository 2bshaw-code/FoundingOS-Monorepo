/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchCashFlowPredictions, generateCashFlowPrediction, type CashFlowPrediction } from '../lib/finance-api'

export default function CashFlowForecastPage() {
  const [predictions, setPredictions] = useState<CashFlowPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchCashFlowPredictions().then((data) => {
      if (data === null) { setError('Could not load cash flow predictions right now.'); setLoading(false); return }
      setPredictions(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function generate() {
    const period = new Date().toISOString().slice(0, 7)
    const created = await generateCashFlowPrediction(period)
    if (!created) { setFeedback('Could not generate a forecast — please retry.'); return }
    setFeedback('✓ Cash flow forecast generated for this month.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Cash Flow Forecast"
        description="Predicted inflow and outflow for the current period, based on unpaid invoices and pending payments."
      />
      {feedback ? <p>{feedback}</p> : null}
      <button onClick={generate}>Generate forecast for this month</button>
      {loading ? <p>Loading forecasts…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && predictions.length === 0 ? <p>No forecasts yet.</p> : null}
      <div className="module-table" style={{ marginTop: 16 }}>
        {predictions.map((prediction) => (
          <div key={prediction.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{prediction.period}</strong>
            <div>Inflow: £{(prediction.predictedInflowPence / 100).toFixed(2)} · Outflow: £{(prediction.predictedOutflowPence / 100).toFixed(2)}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Confidence: {Math.round(prediction.confidence * 100)}% · generated {new Date(prediction.generatedAt).toLocaleString('en-GB')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
