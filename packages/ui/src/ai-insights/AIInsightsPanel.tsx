/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildEventInsights, type EventInsights, type FeedEvent } from '@foundingos/config/event-insights'

type AIInsightsPanelProps = {
  apiBase: string
  title?: string
  sourceScope?: string[]
}

const FALLBACK_INSIGHTS: EventInsights = buildEventInsights([])
const resolveApiPath = (base: string, path: string) => `${base.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const color = level === 'high' ? '#00E676' : level === 'medium' ? '#FFD600' : '#9CA3AF'
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        border: `1px solid ${color}`,
        color,
        borderRadius: 999,
        padding: '2px 8px',
      }}
    >
      {level}
    </span>
  )
}

export function AIInsightsPanel({ apiBase, title = 'AI Insights Panel', sourceScope }: AIInsightsPanelProps) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(resolveApiPath(apiBase, '/events?limit=200'))
        if (!response.ok) throw new Error('failed to load events')
        const body = await response.json()
        if (!cancelled) {
          setEvents(Array.isArray(body?.data) ? body.data : [])
          setError('')
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Live event data is currently unavailable.')
          setLoading(false)
        }
      }
    }

    load()

    let source: EventSource | null = null
    try {
      source = new window.EventSource(resolveApiPath(apiBase, '/events/stream'))
      source.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data) as FeedEvent
          setEvents((prev) => [event, ...prev].slice(0, 500))
        } catch {
          // Ignore malformed stream frames.
        }
      }
    } catch {
      // EventSource unavailable; polling fallback below covers this.
    }

    const pollId = window.setInterval(load, 15_000)

    return () => {
      cancelled = true
      source?.close()
      window.clearInterval(pollId)
    }
  }, [apiBase])

  const scopedEvents = useMemo(
    () => (sourceScope ? events.filter((event) => sourceScope.includes(event.source)) : events),
    [events, sourceScope]
  )
  const insights = useMemo(
    () => (scopedEvents.length ? buildEventInsights(scopedEvents) : FALLBACK_INSIGHTS),
    [scopedEvents]
  )

  function renderColumn(label: string, rows: EventInsights['predictions']) {
    return (
      <article className="module-card card-premium">
        <div className="module-card-top">
          <span>{label}</span>
          <strong>{rows.length}</strong>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((row) => (
            <div key={`${label}-${row.title}`} style={{ display: 'grid', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{row.title}</p>
                <ConfidenceBadge level={row.confidence} />
              </div>
              <small>{row.detail}</small>
            </div>
          ))}
        </div>
      </article>
    )
  }

  return (
    <section className="stack" style={{ marginTop: 24 }}>
      <header className="module-header header-premium">
        <p>Core.Intelligence</p>
        <h2>{title}</h2>
        <span>Predictions, risk flags, workflow suggestions, and anomaly detection generated from live event-stream telemetry.</span>
      </header>
      {loading ? <p>Loading AI insights…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      <div className="module-card-grid">
        {renderColumn('Predictions', insights.predictions)}
        {renderColumn('Risk flags', insights.risks)}
        {renderColumn('Workflow suggestions', insights.suggestions)}
        {renderColumn('Anomalies', insights.anomalies)}
      </div>
    </section>
  )
}

export default AIInsightsPanel
