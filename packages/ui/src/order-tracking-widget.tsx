/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

// Public, customer-facing order tracking widget — shown on the brand's public marketing
// website (not the console). Calls the brand console's unauthenticated GET /api/track
// endpoint (no login required, same as any real carrier's public tracking page).

type TrackResult = {
  reference: string
  status: string
  transportType: string
  destinationName: string
  eta: string | null
  deliveredAt: string | null
  recipientName: string | null
}

const STATUS_LABEL: Record<string, string> = {
  requested: 'Requested',
  quoted: 'Quoted',
  booked: 'Booked',
  packed: 'Packed',
  collected: 'Collected',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  failed_delivery: 'Failed delivery',
  cancelled: 'Cancelled',
}

export function OrderTrackingWidget({ consoleUrl, accent = '#2563eb' }: { consoleUrl: string; accent?: string }) {
  const [reference, setReference] = useState('')
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const track = async () => {
    if (!reference.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${consoleUrl.replace(/\/+$/, '')}/api/track?reference=${encodeURIComponent(reference.trim())}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Could not find that order.')
        return
      }
      setResult(data)
    } catch {
      setError('Could not reach tracking right now — please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle: CSSProperties = { background: '#fff', borderRadius: 16, border: '1px solid #e6e8ec', padding: 24, maxWidth: 480 }
  const inputStyle: CSSProperties = { flex: 1, border: '1px solid #e6e8ec', borderRadius: 10, padding: '10px 14px', fontSize: 14 }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>Track your delivery</h3>
      <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 14px' }}>Enter your order reference to see live delivery status via FoundLogistics.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={inputStyle}
          placeholder="Order reference (e.g. ORD-1042)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && track()}
        />
        <button
          onClick={track}
          disabled={loading}
          style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, cursor: 'pointer' }}
        >
          {loading ? 'Tracking…' : 'Track'}
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 16, borderTop: '1px solid #f1f2f4', paddingTop: 14 }}>
          <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{STATUS_LABEL[result.status] ?? result.status}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
            To {result.destinationName} · {result.transportType} transport
          </p>
          {result.eta && !result.deliveredAt && <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Estimated arrival: {new Date(result.eta).toLocaleString()}</p>}
          {result.deliveredAt && (
            <p style={{ fontSize: 13, color: '#16a34a', margin: '4px 0 0' }}>
              Delivered {new Date(result.deliveredAt).toLocaleString()}{result.recipientName ? ` — signed by ${result.recipientName}` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
