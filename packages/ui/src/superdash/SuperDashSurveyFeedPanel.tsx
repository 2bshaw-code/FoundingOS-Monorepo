/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Cross-app survey feed panel for SuperDash — additive to, and independent from, the
// existing SuperDashSurveyPanel (Customer/Buyer/Investor). Reads the real survey feed
// submitted by brand websites (starting with retail-web) via /api/superdash/survey-feed,
// and reuses the existing, unmodified SuperDashAnomaly/SuperDashAutonomous functions on the
// resulting tiles — no changes were needed to those files.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSurveyFeedTiles, type SurveyFeedEntry } from './getSurveyFeedTiles'
import { SuperDashAnomaly } from './SuperDashAnomaly'
import { SuperDashAutonomous } from './SuperDashAutonomous'
import { SuperDashSurveyGuardian, type RouteHealthResult } from './SuperDashSurveyGuardian'
import type { SuperDashTileData } from './getSuperDashTiles'

function Tile({ tile }: { tile: SuperDashTileData }) {
  return (
    <Link href={tile.href} className="module-card fo-card">
      <div className="module-card-top">
        <strong>{tile.title}</strong>
        <small>{tile.score}</small>
      </div>
      <p style={{ fontSize: 12 }}>{tile.description}</p>
      <small style={{ fontSize: 11, opacity: 0.7 }}>{tile.aiHint}</small>
    </Link>
  )
}

export function SuperDashSurveyFeedPanel() {
  const [entries, setEntries] = useState<SurveyFeedEntry[] | null>(null)
  const [routeHealth, setRouteHealth] = useState<RouteHealthResult[]>([])

  useEffect(() => {
    fetch('/api/superdash/survey-feed').then((response) => response.json()).then((data) => setEntries(data.entries ?? [])).catch(() => setEntries([]))
    fetch('/api/superdash/route-health').then((response) => response.json()).then((data) => setRouteHealth(data.results ?? [])).catch(() => setRouteHealth([]))
  }, [])

  if (entries === null) return null

  const tiles = getSurveyFeedTiles(entries)
  const anomalies = SuperDashAnomaly(tiles)
  const autonomousActions = SuperDashAutonomous(tiles)
  const guardianWarnings = SuperDashSurveyGuardian(entries, routeHealth)

  return (
    <article className="panel wide fo-card" style={{ marginTop: 24 }}>
      <h2>Survey Feed Intelligence</h2>
      <p><small>Live tester survey submissions from FoundRetail (and future brand sites), flowing into anomaly detection, Guardian, and autonomous suggestions.</small></p>

      <div className="module-card-grid">
        {tiles.map((tile) => <Tile key={tile.id} tile={tile} />)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
        <strong style={{ fontSize: 13 }}>Anomaly Alerts ({anomalies.length})</strong>
        {anomalies.length === 0 ? <small>No anomalies detected.</small> : anomalies.map((anomaly) => <small key={anomaly}>{anomaly}</small>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
        <strong style={{ fontSize: 13 }}>Guardian Warnings ({guardianWarnings.length})</strong>
        {guardianWarnings.length === 0 ? <small>No warnings.</small> : guardianWarnings.map((warning) => <small key={warning}>{warning}</small>)}
        <Link href="/system/guardian" style={{ fontSize: 12 }}>View full Guardian status →</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
        <strong style={{ fontSize: 13 }}>Autonomous Fix Log ({autonomousActions.length})</strong>
        {autonomousActions.length === 0 ? <small>No suggestions right now.</small> : autonomousActions.map((action) => <small key={action.module + action.action}>{action.message}</small>)}
      </div>
    </article>
  )
}

export default SuperDashSurveyFeedPanel
