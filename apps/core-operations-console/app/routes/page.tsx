/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchRoutes, createRoute, type LogisticsRoute } from '../lib/logistics-api'

// Route Planner: waypoints are stored as JSON on the Route model. This screen
// lets an operator paste a simple "lat,lng" per line list to plan a route —
// a full interactive map can be layered on top of this same data later.
export default function RoutePlannerPage() {
  const [routes, setRoutes] = useState<LogisticsRoute[]>([])
  const [waypointsText, setWaypointsText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchRoutes().then((data) => {
      if (data === null) { setError('Could not load routes right now.'); setLoading(false); return }
      setRoutes(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function planRoute() {
    const waypoints = waypointsText.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const [lat, lng] = line.split(',').map((value) => Number(value.trim()))
      return { lat, lng }
    })
    if (waypoints.length < 2) { setFeedback('Add at least two waypoints (one per line, "lat,lng").'); return }
    const created = await createRoute({ waypoints })
    if (!created) { setFeedback('Could not create the route — please retry.'); return }
    setFeedback('✓ Route planned.')
    setWaypointsText('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Route Planner"
        description="Plan delivery routes from waypoints, ready to assign to a shipment."
      />
      {feedback ? <p>{feedback}</p> : null}
      <textarea
        value={waypointsText}
        onChange={(event) => setWaypointsText(event.target.value)}
        placeholder={'One waypoint per line, e.g.\n-1.286389,36.817223\n-1.292066,36.821945'}
        rows={6}
        style={{ width: '100%', maxWidth: 480 }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={planRoute}>Plan route</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Existing routes</h3>
      {loading ? <p>Loading routes…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && routes.length === 0 ? <p>No routes yet.</p> : null}
      <div className="module-table">
        {routes.map((route) => (
          <div key={route.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>Route {route.id.slice(0, 8)}</strong>
            {route.distanceKm ? ` · ${route.distanceKm.toFixed(1)} km` : ''}
            {route.durationMin ? ` · ${route.durationMin} min` : ''}
            <div style={{ fontSize: 12, opacity: 0.7 }}>{JSON.stringify(route.waypoints)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
