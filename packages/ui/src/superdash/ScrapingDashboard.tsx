/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// SuperDash's unified Scraping Dashboard — shows the REAL per-brand engagement data written
// by each brand console's own /api/scrape/refresh route, plus a manual "Run Scrape" trigger
// that calls those same real endpoints on demand.
//
// Honesty note, shown directly in the UI: every brand's "scraper" here is an explicitly
// synthetic, deterministic generator (no external network calls, no paid APIs) — this
// dashboard displays that real (but synthetic) data plainly labeled as such, never implying
// real external market/competitor scraping is happening.
import { useEffect, useState } from 'react'

type BrandScrapeRow = {
  slug: string
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string | null
  hasScraperConnected: boolean
}

type EngagementLogRow = { brandName: string | null; score: number; totalEngagement: number | null; categoryBreakdown: Record<string, number> | null; recordedAt: string }
type AnomalyLogRow = { brandName: string | null; message: string; score: number; totalEngagement: number | null; detectedAt: string }

type ScrapeRunResult = {
  slug: string
  brandName: string
  ok: boolean
  mode?: 'live' | 'demo'
  itemCount?: number
  category?: string
  isSpike?: boolean
  totalEngagement?: number
  anomalyScore?: number
  error?: string
}

export function ScrapingDashboard({
  initialRows,
  initialEngagementLog,
  initialAnomalyLog,
  readOnly = false,
}: {
  initialRows: BrandScrapeRow[]
  initialEngagementLog: EngagementLogRow[]
  initialAnomalyLog: AnomalyLogRow[]
  readOnly?: boolean
}) {
  const [rows, setRows] = useState(initialRows)
  const [running, setRunning] = useState(false)
  const [lastRunResults, setLastRunResults] = useState<ScrapeRunResult[] | null>(null)
  const [runError, setRunError] = useState('')

  async function runScrape() {
    setRunning(true)
    setRunError('')
    try {
      const response = await fetch('/api/superdash/scraper/run', { method: 'POST' })
      if (!response.ok) {
        setRunError(response.status === 401 ? 'Admin session required to run a scrape.' : `Run failed (HTTP ${response.status}).`)
        return
      }
      const data = await response.json()
      setLastRunResults(data.results ?? [])
      // Refresh the brand rows so the table reflects whatever the run just wrote.
      const refreshed = await fetch('/api/superdash/brand-metrics').then((r) => r.json()).catch(() => null)
      if (refreshed?.brands) {
        setRows((current) =>
          current.map((row) => {
            const match = refreshed.brands.find((b: { brandName: string }) => b.brandName === row.brandName)
            return match ? { ...row, totalEngagement: match.totalEngagement, anomalyScore: match.anomalyScore, categoryBreakdown: match.categoryBreakdown, lastUpdated: match.lastUpdated } : row
          }),
        )
      }
    } catch {
      setRunError('Something went wrong running the scrape.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="stack">
      <article className="panel wide fo-card">
        <h2>Synthetic engagement data — demo mode</h2>
        <p><small>
          Every "scraper" below is a real, deployed, deterministic generator (no external network calls, no paid
          APIs) — it produces genuine synthetic engagement data and writes it into the real BrandMetric table for
          that brand. This is NOT real external market or competitor scraping; it's the same honest synthetic
          engagement layer already used across the ecosystem for demo/testing purposes.
        </small></p>
      </article>

      <article className="panel wide fo-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0 }}>All brands — latest scrape</h2>
          {readOnly ? (
            <small>Read-only session — write access disabled.</small>
          ) : (
            <button type="button" className="btn btn-primary" onClick={runScrape} disabled={running}>
              {running ? 'Running…' : 'Run Scrape (all brands)'}
            </button>
          )}
        </div>
        {runError && <p><small style={{ color: 'var(--danger, #ff5c5c)' }}>{runError}</small></p>}

        <table className="superdashboard-brand-table" style={{ marginTop: 16 }}>
          <thead>
            <tr><th>Brand</th><th>Total engagement</th><th>Anomaly score</th><th>Category breakdown</th><th>Last updated</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug}>
                <td>{row.brandName}</td>
                <td>{row.totalEngagement}</td>
                <td>{row.anomalyScore.toFixed(2)}</td>
                <td>
                  {Object.keys(row.categoryBreakdown).length === 0 ? '—' : Object.entries(row.categoryBreakdown).map(([cat, count]) => `${cat}: ${count}`).join(', ')}
                </td>
                <td>{row.lastUpdated ? new Date(row.lastUpdated).toLocaleString() : 'Never scraped'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {lastRunResults && (
        <article className="panel wide fo-card">
          <h2>Last run results</h2>
          <table className="superdashboard-brand-table">
            <thead>
              <tr><th>Brand</th><th>Status</th><th>Items</th><th>Category</th><th>Spike?</th></tr>
            </thead>
            <tbody>
              {lastRunResults.map((result) => (
                <tr key={result.slug}>
                  <td>{result.brandName}</td>
                  <td className={result.ok ? 'status-good' : 'status-risk'}>{result.ok ? (result.mode === 'demo' ? 'OK (demo mode)' : 'OK') : `Error: ${result.error}`}</td>
                  <td>{result.itemCount ?? '—'}</td>
                  <td>{result.category ?? '—'}</td>
                  <td>{result.isSpike ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      )}

      <article className="panel wide fo-card">
        <h2>Recent high-engagement events</h2>
        <p><small>Real EngagementLog rows — only written when a brand's scraped/submitted engagement crosses the real high-engagement threshold Autonomous uses, so this is a genuine "notable events" feed, not a padded timeline.</small></p>
        {initialEngagementLog.length === 0 ? (
          <p><small>No high-engagement events recorded yet.</small></p>
        ) : (
          <ul style={{ display: 'grid', gap: 8, paddingLeft: 18 }}>
            {initialEngagementLog.map((entry, index) => (
              <li key={index}><small>{entry.brandName ?? 'Unknown brand'} — score {entry.score.toFixed(2)}, {entry.totalEngagement ?? 0} total — {new Date(entry.recordedAt).toLocaleString()}</small></li>
            ))}
          </ul>
        )}
      </article>

      <article className="panel wide fo-card">
        <h2>Anomaly log</h2>
        {initialAnomalyLog.length === 0 ? (
          <p><small>No anomalies detected yet.</small></p>
        ) : (
          <ul style={{ display: 'grid', gap: 8, paddingLeft: 18 }}>
            {initialAnomalyLog.map((entry, index) => (
              <li key={index}><small>{entry.message} — {new Date(entry.detectedAt).toLocaleString()}</small></li>
            ))}
          </ul>
        )}
      </article>
    </div>
  )
}

export default ScrapingDashboard
