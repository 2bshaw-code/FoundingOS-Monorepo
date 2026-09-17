/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useState } from 'react'
import { INSIGHT_DISPLAY_MAP, type InsightType } from '@foundingos/config/event-display-map'
import { InsightItem, type InsightRecord } from './InsightItem'

type InsightsPanelProps = { apiBase: string; sourceScope?: string[]; compact?: boolean }
const TYPES: InsightType[] = ['prediction', 'risk', 'anomaly', 'suggestion']
const resolveApiPath = (base: string, path: string) => `${base.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`

export function InsightsPanel({ apiBase, sourceScope, compact = false }: InsightsPanelProps) {
  const [insights, setInsights] = useState<InsightRecord[]>([])
  const [type, setType] = useState<InsightType | 'all'>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch(resolveApiPath(apiBase, '/insights?limit=200'))
        if (!response.ok) throw new Error('failed to load insights')
        const body = await response.json()
        if (!cancelled) { setInsights(Array.isArray(body?.data) ? body.data : []); setError('') }
      } catch { if (!cancelled) setError('Could not load AI insights right now.') }
    }
    load()
    let stream: EventSource | null = null
    try {
      stream = new window.EventSource(resolveApiPath(apiBase, '/insights/stream'))
      stream.onmessage = (message) => {
        try { setInsights((current) => [JSON.parse(message.data) as InsightRecord, ...current].slice(0, 200)) } catch { /* malformed frame */ }
      }
    } catch { /* polling remains active */ }
    const interval = window.setInterval(load, 15_000)
    return () => { cancelled = true; stream?.close(); window.clearInterval(interval) }
  }, [apiBase])

  const filtered = useMemo(() => insights.filter((insight) => (
    (type === 'all' || insight.type === type) && (!sourceScope || sourceScope.includes(insight.source))
  )), [insights, sourceScope, type])

  return (
    <section className="stack">
      {!compact ? (
        <div className="event-feed-filters">
          <button type="button" className={type === 'all' ? 'event-feed-filter active' : 'event-feed-filter'} onClick={() => setType('all')}>All</button>
          {TYPES.map((item) => <button key={item} type="button" className={type === item ? 'event-feed-filter active' : 'event-feed-filter'} onClick={() => setType(item)}>{INSIGHT_DISPLAY_MAP[item].icon} {INSIGHT_DISPLAY_MAP[item].title}</button>)}
        </div>
      ) : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!filtered.length && !error ? <p>No generated insights yet. Publish an event or run the generator.</p> : null}
      <div className="event-feed-list">{filtered.slice(0, compact ? 10 : 200).map((insight) => <InsightItem key={insight.id} insight={insight} />)}</div>
    </section>
  )
}

export default InsightsPanel
