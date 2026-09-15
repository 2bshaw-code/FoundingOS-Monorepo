/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { BrandConsoleConfig } from '../console'
import { LiveMap, type MapMarker } from '../live-map'

// Real distribution/fulfillment module for a product-selling brand (FoundRetail, FoundMeat,
// FoundHealth) — books shipments into FoundLogistics (our internal carrier) via
// /api/distribution and tracks them through to delivery. transportTypes is brand-specific
// (chilled/frozen for perishables, fragile for retail goods).

type RateOption = {
  optionName: string
  estimatedCost: number
  estimatedHours: number
  reliabilityScore: number
  efficiencyScore: number
  recommended: boolean
}

type Shipment = {
  id: string
  reference: string
  transportType: string
  status: string
  destinationName: string
  destinationAddress: string
  destinationLat: number | null
  destinationLng: number | null
  weightKg: number
  eta: string | null
  proofOfDelivery?: { recipientName: string; deliveredAt: string } | null
}

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function BrandDistributionModule({
  config,
  transportTypes,
  originLabel,
  originLat,
  originLng,
}: {
  config: BrandConsoleConfig
  transportTypes: string[]
  originLabel: string
  originLat: number
  originLng: number
}) {
  const accent = config.colors.accent
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [rateOptions, setRateOptions] = useState<RateOption[]>([])
  const [form, setForm] = useState({
    reference: '',
    destinationName: '',
    destinationAddress: '',
    destinationLat: '',
    destinationLng: '',
    transportType: transportTypes[0],
    weightKg: '1',
  })

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await api<{ shipments: Shipment[] }>('/api/distribution')
    setShipments(data?.shipments ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const bookShipment = async () => {
    const destLat = Number(form.destinationLat)
    const destLng = Number(form.destinationLng)
    if (!form.reference || !form.destinationName || !form.destinationAddress || !Number.isFinite(destLat) || !Number.isFinite(destLng)) {
      alert('Reference, destination name/address and a valid destination lat/lng are required.')
      return
    }
    const result = await api<{ ok: boolean; quotes: RateOption[] }>('/api/distribution', {
      method: 'POST',
      body: JSON.stringify({
        reference: form.reference,
        transportType: form.transportType,
        originAddress: originLabel,
        origin: { lat: originLat, lng: originLng },
        destinationName: form.destinationName,
        destinationAddress: form.destinationAddress,
        destination: { lat: destLat, lng: destLng },
        weightKg: Number(form.weightKg) || 1,
      }),
    })
    if (result?.quotes) setRateOptions(result.quotes)
    setForm({ reference: '', destinationName: '', destinationAddress: '', destinationLat: '', destinationLng: '', transportType: transportTypes[0], weightKg: '1' })
    refresh()
  }

  const mapMarkers: MapMarker[] = [
    { id: 'origin', lat: originLat, lng: originLng, label: originLabel, kind: 'depot' },
    ...shipments
      .filter((s) => s.destinationLat != null && s.destinationLng != null)
      .map((s) => ({ id: s.id, lat: s.destinationLat as number, lng: s.destinationLng as number, label: `${s.destinationName} (${s.reference})`, kind: 'stop' as const })),
  ]

  const cardStyle: CSSProperties = { background: '#fff', borderRadius: 14, border: '1px solid #e6e8ec', padding: 18 }
  const inputStyle: CSSProperties = { border: '1px solid #e6e8ec', borderRadius: 8, padding: '8px 10px', fontSize: 13, width: '100%' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Distribution</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0' }}>
          Book shipments into FoundLogistics (our internal carrier) and track them through to delivery — POD, ETA, live location.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 10px' }}>Book a shipment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input style={inputStyle} placeholder="Order reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
            <input style={inputStyle} placeholder="Destination (customer name)" value={form.destinationName} onChange={(e) => setForm({ ...form, destinationName: e.target.value })} />
            <input style={inputStyle} placeholder="Destination address" value={form.destinationAddress} onChange={(e) => setForm({ ...form, destinationAddress: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} placeholder="Destination lat" value={form.destinationLat} onChange={(e) => setForm({ ...form, destinationLat: e.target.value })} />
              <input style={inputStyle} placeholder="Destination lng" value={form.destinationLng} onChange={(e) => setForm({ ...form, destinationLng: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select style={inputStyle} value={form.transportType} onChange={(e) => setForm({ ...form, transportType: e.target.value })}>
                {transportTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input style={inputStyle} placeholder="Weight (kg)" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
            </div>
            <button onClick={bookShipment} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, cursor: 'pointer' }}>
              Get AI rate & book with FoundLogistics
            </button>
          </div>

          {rateOptions.length > 0 && (
            <div style={{ marginTop: 14, borderTop: '1px solid #f1f2f4', paddingTop: 10 }}>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 6px' }}>AI rate/efficiency options considered for the last booking:</p>
              {rateOptions.map((o) => (
                <div key={o.optionName} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                  <span>
                    {o.recommended ? '★ ' : ''}
                    {o.optionName}
                  </span>
                  <span>
                    £{o.estimatedCost} · {o.estimatedHours}h · {Math.round(o.reliabilityScore * 100)}% reliable
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 10px' }}>Live tracking</h2>
          <LiveMap markers={mapMarkers} height={320} />
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 10px' }}>Shipments</h2>
        {loading ? (
          <p style={{ color: '#9ca3af' }}>Loading…</p>
        ) : shipments.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No shipments booked yet.</p>
        ) : (
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6b7280' }}>
                <th>Reference</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Status</th>
                <th>ETA</th>
                <th>POD</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f1f2f4' }}>
                  <td style={{ padding: '6px 0' }}>{s.reference}</td>
                  <td>{s.destinationName}</td>
                  <td style={{ textTransform: 'capitalize' }}>{s.transportType}</td>
                  <td style={{ textTransform: 'capitalize' }}>{s.status.replaceAll('_', ' ')}</td>
                  <td>{s.eta ? new Date(s.eta).toLocaleString() : '—'}</td>
                  <td>{s.proofOfDelivery ? `Signed by ${s.proofOfDelivery.recipientName}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
