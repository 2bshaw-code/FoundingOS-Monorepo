'use client'

import { useEffect, useMemo, useState } from 'react'
import { AIInsightsPanel } from '@foundingos/ui/ai-insights'
import { InsightsPanel } from '@foundingos/ui/insights'
import { eventDisplayIcon, eventDisplayTitle } from '@foundingos/config/event-display-map'

const CORE_OPERATIONS_API_BASE = '/api/core-operations/ops'
const resolveApiPath = (base: string, path: string) => `${base.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`

type FeedEvent = {
  id: string
  type: string
  source: string
  createdAt: string
  payload?: Record<string, unknown>
}

const pipelineStages = [
  { name: 'Order', current: 'Confirmed', owner: 'Retail', eta: '2m ago' },
  { name: 'Shipment', current: 'In transit', owner: 'Logistics', eta: '18 min' },
  { name: 'Delivery', current: 'On route', owner: 'Ops', eta: '42 min' },
  { name: 'Invoice', current: 'Generated', owner: 'Finance', eta: 'Awaiting payment' },
  { name: 'Payment', current: 'Received', owner: 'Treasury', eta: 'DSO 6.8d' },
]

function CompactEventFeed({ apiBase }: { apiBase: string }) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(resolveApiPath(apiBase, '/events?limit=8'))
        if (!response.ok) throw new Error('Event feed unavailable')
        const body = await response.json()
        if (!cancelled) {
          setEvents(Array.isArray(body?.data) ? body.data : [])
          setError('')
        }
      } catch {
        if (!cancelled) setError('Live event feed unavailable right now.')
      }
    }

    load()
    let stream: EventSource | null = null
    try {
      stream = new window.EventSource(resolveApiPath(apiBase, '/events/stream'))
      stream.onmessage = (message) => {
        try {
          const incoming = JSON.parse(message.data) as FeedEvent
          setEvents((current) => [incoming, ...current].slice(0, 8))
        } catch {
          // ignore malformed frames
        }
      }
    } catch {
      // ignore EventSource fallback below
    }

    const interval = window.setInterval(load, 15000)
    return () => { cancelled = true; stream?.close(); window.clearInterval(interval) }
  }, [apiBase])

  return (
    <section style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: 16, background: 'rgba(15,23,42,0.72)', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p style={{ margin: 0, color: '#8FA3C7', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Event feed</p>
          <h3 style={{ margin: '6px 0 0', fontSize: 20 }}>Live fulfilment-to-cash</h3>
        </div>
        <span style={{ color: '#34d399', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Live</span>
      </div>
      {error ? <p style={{ margin: 0, color: '#fca5a5' }}>{error}</p> : null}
      <div style={{ display: 'grid', gap: 10 }}>
        {events.map((event) => (
          <div key={event.id} style={{ border: '1px solid rgba(148,163,184,0.18)', borderRadius: 12, padding: 10, background: 'rgba(15,23,42,0.44)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{eventDisplayIcon(event.type)}</span>
                <strong style={{ fontSize: 13 }}>{eventDisplayTitle(event.type)}</strong>
              </div>
              <span style={{ color: '#94a3b8', fontSize: 11, textTransform: 'capitalize' }}>{event.source}</span>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: 11, marginTop: 8 }}>{new Date(event.createdAt).toLocaleString()}</div>
            {event.payload && Object.keys(event.payload).length ? (
              <pre style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 11, color: '#dbeafe' }}>
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function FulfilmentToCashPage() {
  const pipelineForecast = useMemo(() => ({
    dso: '6.8D',
    risk: 'Low',
    delays: '2.1%',
    collection: '94.3%',
  }), [])

  return (
    <main style={{ display: 'grid', gap: 24, padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <header
        style={{
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(14,116,144,0.3), rgba(15,23,42,0.9))',
          padding: 24,
        }}
      >
        <p style={{ margin: 0, color: '#7dd3fc', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Operating system</p>
        <h1 style={{ margin: '10px 0', fontSize: 'clamp(2rem, 3vw, 3rem)' }}>Fulfilment-to-Cash</h1>
        <p style={{ margin: 0, maxWidth: 820, color: '#dbeafe' }}>
          One live view from retail order confirmation through shipment, delivery completion, invoicing, and cash collection.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {[
          ['DSO', pipelineForecast.dso],
          ['Collection rate', pipelineForecast.collection],
          ['Delivery delay risk', pipelineForecast.delays],
          ['Risk profile', pipelineForecast.risk],
        ].map(([label, value]) => (
          <div key={label} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 14, padding: 18, background: 'rgba(15,23,42,0.7)' }}>
            <div style={{ color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {pipelineStages.map((stage, index) => (
          <div key={stage.name} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 15, padding: 16, background: 'rgba(11,18,32,0.78)', position: 'relative' }}>
            {index > 0 ? <div style={{ position: 'absolute', top: '50%', left: -12, width: 12, height: 2, background: '#334155' }} /> : null}
            <div style={{ color: '#7dd3fc', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{stage.name}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>{stage.current}</div>
            <div style={{ color: '#cbd5e1', marginTop: 4 }}>{stage.owner}</div>
            <div style={{ color: '#86efac', fontSize: 12, marginTop: 12 }}>{stage.eta}</div>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <CompactEventFeed apiBase={CORE_OPERATIONS_API_BASE} />
        <div style={{ display: 'grid', gap: 20 }}>
          <AIInsightsPanel
            apiBase={CORE_OPERATIONS_API_BASE}
            title="Retail-to-cash intelligence"
            sourceScope={['retail', 'logistics', 'finance']}
          />
          <InsightsPanel apiBase={CORE_OPERATIONS_API_BASE} sourceScope={['retail', 'logistics', 'finance']} compact />
        </div>
      </section>
    </main>
  )
}
