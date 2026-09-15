/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { BrandConsoleConfig } from '../console'
import { LiveMap, type MapMarker } from '../live-map'

// FoundLogistics's real distribution/carrier console — reads and writes the live Shipment /
// DeliveryRoute data via /api/logistics/*. This replaces what would otherwise be a static demo
// module: every action here (assign route, mark delivered) is a real database write.

type Shipment = {
  id: string
  brandSlug: string
  reference: string
  transportType: string
  status: string
  destinationName: string
  destinationAddress: string
  destinationLat: number | null
  destinationLng: number | null
  weightKg: number
  eta: string | null
}

type RouteStop = { id: string; sequence: number; shipment: Shipment }
type DeliveryRoute = {
  id: string
  status: string
  currentLat: number | null
  currentLng: number | null
  depot: { id: string; name: string; lat: number; lng: number }
  driver: { id: string; name: string } | null
  vehicle: { id: string; registration: string } | null
  stops: RouteStop[]
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

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function DistributionModule({ config }: { config: BrandConsoleConfig }) {
  const accent = config.colors.accent
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [routes, setRoutes] = useState<DeliveryRoute[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRoute, setActiveRoute] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [shipmentData, routeData] = await Promise.all([
      api<{ shipments: Shipment[] }>('/api/logistics/shipments'),
      api<{ routes: DeliveryRoute[] }>('/api/logistics/routes'),
    ])
    setShipments(shipmentData?.shipments ?? [])
    setRoutes(routeData?.routes ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const bookedUnrouted = shipments.filter((s) => s.status === 'booked')

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const buildRoute = async () => {
    if (selectedIds.length === 0) return
    // Uses FoundLogistics's first depot on record — a real dispatcher UI would let you pick
    // one; kept simple here since most demo/single-depot setups only have one.
    const depotId = routes[0]?.depot.id
    if (!depotId) {
      alert('No depot configured yet — add one in the database before assigning routes.')
      return
    }
    await api('/api/logistics/routes', { method: 'POST', body: JSON.stringify({ depotId, shipmentIds: selectedIds }) })
    setSelectedIds([])
    refresh()
  }

  const markDelivered = async (shipmentId: string) => {
    await api('/api/logistics/shipments', { method: 'PATCH', body: JSON.stringify({ shipmentId, status: 'delivered' }) })
    refresh()
  }

  const mapMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = []
    const routesToShow = activeRoute ? routes.filter((r) => r.id === activeRoute) : routes
    routesToShow.forEach((route) => {
      markers.push({ id: `depot-${route.depot.id}`, lat: route.depot.lat, lng: route.depot.lng, label: `Depot — ${route.depot.name}`, kind: 'depot' })
      if (route.currentLat != null && route.currentLng != null) {
        markers.push({
          id: `vehicle-${route.id}`,
          lat: route.currentLat,
          lng: route.currentLng,
          label: `${route.vehicle?.registration ?? 'Vehicle'} — ${route.driver?.name ?? 'Unassigned driver'}`,
          kind: 'vehicle',
        })
      }
      route.stops.forEach((stop) => {
        if (stop.shipment.destinationLat != null && stop.shipment.destinationLng != null) {
          markers.push({
            id: `stop-${stop.id}`,
            lat: stop.shipment.destinationLat,
            lng: stop.shipment.destinationLng,
            label: `#${stop.sequence + 1} ${stop.shipment.destinationName} (${stop.shipment.reference})`,
            kind: 'stop',
          })
        }
      })
    })
    return markers
  }, [routes, activeRoute])

  const cardStyle: CSSProperties = { background: '#fff', borderRadius: 14, border: '1px solid #e6e8ec', padding: 18 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Distribution</h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0' }}>
          FoundLogistics's real carrier operations — shipments booked by every brand, fleet routes, and live tracking.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Fleet map</h2>
          {activeRoute && (
            <button onClick={() => setActiveRoute(null)} style={{ fontSize: 13, color: accent, background: 'none', border: 'none', cursor: 'pointer' }}>
              Show all routes
            </button>
          )}
        </div>
        <LiveMap markers={mapMarkers} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Booked shipments awaiting a route</h2>
            <button
              onClick={buildRoute}
              disabled={selectedIds.length === 0}
              style={{
                background: selectedIds.length ? accent : '#e6e8ec',
                color: selectedIds.length ? '#fff' : '#9ca3af',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                cursor: selectedIds.length ? 'pointer' : 'not-allowed',
              }}
            >
              Assign {selectedIds.length || ''} to route
            </button>
          </div>
          {loading ? (
            <p style={{ color: '#9ca3af' }}>Loading…</p>
          ) : bookedUnrouted.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No unrouted bookings right now.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#6b7280' }}>
                  <th></th>
                  <th>Reference</th>
                  <th>Brand</th>
                  <th>Destination</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {bookedUnrouted.map((s) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #f1f2f4' }}>
                    <td style={{ padding: '6px 0' }}>
                      <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelected(s.id)} />
                    </td>
                    <td>{s.reference}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.brandSlug}</td>
                    <td>{s.destinationName}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.transportType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 10px' }}>Active routes</h2>
          {routes.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No routes yet — assign booked shipments above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setActiveRoute(route.id)}
                  style={{
                    border: `1px solid ${activeRoute === route.id ? accent : '#e6e8ec'}`,
                    borderRadius: 10,
                    padding: 10,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                    <span>{route.depot.name}</span>
                    <span style={{ textTransform: 'capitalize', color: '#6b7280' }}>{route.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    {route.driver?.name ?? 'Unassigned driver'} · {route.vehicle?.registration ?? 'Unassigned vehicle'} · {route.stops.length} stop
                    {route.stops.length === 1 ? '' : 's'}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {route.stops.map((stop) => (
                      <div key={stop.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span>
                          #{stop.sequence + 1} {stop.shipment.destinationName} ({stop.shipment.reference})
                        </span>
                        {stop.shipment.status !== 'delivered' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markDelivered(stop.shipment.id)
                            }}
                            style={{ fontSize: 11, color: accent, background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Mark delivered
                          </button>
                        )}
                        {stop.shipment.status === 'delivered' && <span style={{ color: '#16a34a', fontSize: 11 }}>Delivered ✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 10px' }}>All shipments</h2>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#6b7280' }}>
              <th>Reference</th>
              <th>Brand</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Status</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} style={{ borderTop: '1px solid #f1f2f4' }}>
                <td style={{ padding: '6px 0' }}>{s.reference}</td>
                <td style={{ textTransform: 'capitalize' }}>{s.brandSlug}</td>
                <td>{s.destinationName}</td>
                <td style={{ textTransform: 'capitalize' }}>{s.transportType}</td>
                <td>{s.weightKg}kg</td>
                <td>{STATUS_LABEL[s.status] ?? s.status}</td>
                <td>{s.eta ? new Date(s.eta).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
