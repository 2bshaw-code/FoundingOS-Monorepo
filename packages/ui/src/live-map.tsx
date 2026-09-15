/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  kind: 'depot' | 'stop' | 'vehicle'
}

// Real, free map — Leaflet + OpenStreetMap tiles. No API key, no billing account required
// (unlike Google Maps / Mapbox, which both need a key even on their free tiers). This is the
// one live map component every console/web view of FoundLogistics's fleet renders through.
//
// Loaded dynamically on the client only: Leaflet reads `window`/`document` at import time and
// breaks Next.js server rendering if imported statically.
export function LiveMap({ markers, path, height = 420 }: { markers: MapMarker[]; path?: { lat: number; lng: number }[]; height?: number }) {
  const [ReactLeaflet, setReactLeaflet] = useState<typeof import('react-leaflet') | null>(null)
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, l]) => {
      if (!cancelled) {
        setReactLeaflet(rl)
        setLeaflet(l.default ?? l)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ReactLeaflet || !leaflet) {
    return (
      <div style={{ height, borderRadius: 12, background: '#eef1f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8390' }}>
        Loading map…
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = ReactLeaflet
  const center = markers[0] ?? { lat: 51.5072, lng: -0.1276 } // default: London, if no markers yet

  const iconFor = (kind: MapMarker['kind']) =>
    leaflet.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2);background:${
        kind === 'depot' ? '#2563eb' : kind === 'vehicle' ? '#16a34a' : '#f59e0b'
      }"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

  return (
    <div style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {path && path.length > 1 && <Polyline positions={path.map((p) => [p.lat, p.lng])} pathOptions={{ color: '#2563eb', weight: 3, dashArray: '6 6' }} />}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={iconFor(m.kind)}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
