/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Shared, cross-console Event Feed (Phase 7B). Subscribes to
// GET /events/stream (SSE) for real-time updates with a GET /events
// fallback for the initial load and for browsers/proxies that don't
// support SSE. Every console mounts this the same way — only the
// apiBase differs, since Retail/Logistics/Finance events are stored by
// core-operations but every suite's console reads the same feed.
import { useEffect, useMemo, useState } from 'react'
import { EventItem, type FeedEvent } from './EventItem'

const SOURCES = ['retail', 'logistics', 'finance', 'talent', 'health'] as const

type EventFeedProps = {
  apiBase: string
  // Optional allow-list of sources to restrict this instance to (e.g. the
  // Fulfilment-to-Cash dashboard only cares about retail/logistics/finance).
  // When omitted, all five suites are shown.
  sourceFilter?: string[]
  // Compact mode drops the filter chips and caps the visible list — used for
  // embedding a mini feed inside another dashboard rather than a full page.
  compact?: boolean
}

export function EventFeed({ apiBase, sourceFilter: allowedSources, compact = false }: EventFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [error, setError] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const visibleSources = allowedSources ?? SOURCES

  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      try {
        const response = await fetch(`${apiBase}/events?limit=200`)
        if (!response.ok) throw new Error('failed to load events')
        const body = await response.json()
        if (!cancelled) setEvents(body.data ?? [])
      } catch {
        if (!cancelled) setError('Could not load the event feed right now.')
      }
    }

    loadInitial()

    let source: EventSource | null = null
    try {
      source = new window.EventSource(`${apiBase}/events/stream`)
      source.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data) as FeedEvent
          setEvents((prev) => [event, ...prev].slice(0, 500))
        } catch {
          // ignore malformed SSE frames
        }
      }
      source.onerror = () => {
        // SSE connection dropped — the periodic GET /events fallback below
        // keeps the feed roughly fresh even without a live stream.
      }
    } catch {
      // EventSource unavailable (older browser / SSR) — rely on polling only.
    }

    const pollId = window.setInterval(loadInitial, 15_000)

    return () => {
      cancelled = true
      source?.close()
      window.clearInterval(pollId)
    }
  }, [apiBase])

  const scoped = useMemo(
    () => (allowedSources ? events.filter((event) => allowedSources.includes(event.source)) : events),
    [events, allowedSources]
  )

  const filtered = useMemo(
    () => (sourceFilter === 'all' ? scoped : scoped.filter((event) => event.source === sourceFilter)),
    [scoped, sourceFilter]
  )

  const visibleFiltered = compact ? filtered.slice(0, 10) : filtered

  const grouped = useMemo(() => {
    const groups = new Map<string, FeedEvent[]>()
    scoped.forEach((event) => {
      const list = groups.get(event.source) ?? []
      list.push(event)
      groups.set(event.source, list)
    })
    return groups
  }, [scoped])

  return (
    <div className="event-feed">
      {!compact ? (
        <div className="event-feed-filters">
          <button
            type="button"
            className={sourceFilter === 'all' ? 'event-feed-filter active' : 'event-feed-filter'}
            onClick={() => setSourceFilter('all')}
          >
            All
          </button>
          {visibleSources.map((source) => (
            <button
              key={source}
              type="button"
              className={sourceFilter === source ? 'event-feed-filter active' : 'event-feed-filter'}
              onClick={() => setSourceFilter(source)}
            >
              {source[0].toUpperCase() + source.slice(1)} ({(grouped.get(source) ?? []).length})
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="module-error">{error}</p> : null}
      {visibleFiltered.length === 0 && !error ? <p>No events yet.</p> : null}

      <div className="event-feed-list">
        {visibleFiltered.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default EventFeed
