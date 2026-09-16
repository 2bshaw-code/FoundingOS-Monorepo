/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { eventDisplayIcon, eventDisplayTitle, sourceColor } from '@foundingos/config/event-display-map'

export type FeedEvent = {
  id: string
  type: string
  source: string
  payload: unknown
  createdAt: string
}

export function EventItem({ event }: { event: FeedEvent }) {
  const [expanded, setExpanded] = useState(false)
  const color = sourceColor(event.source)

  return (
    <div className="event-feed-item" style={{ borderLeft: `3px solid ${color}` }}>
      <button
        type="button"
        className="event-feed-item-header"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <span className="event-feed-icon" aria-hidden="true">{eventDisplayIcon(event.type)}</span>
        <span className="event-feed-title">{eventDisplayTitle(event.type)}</span>
        <span className="event-feed-source" style={{ color }}>{event.source}</span>
        <span className="event-feed-timestamp">{new Date(event.createdAt).toLocaleString('en-GB')}</span>
      </button>
      {expanded ? (
        <pre className="event-feed-payload">{JSON.stringify(event.payload, null, 2)}</pre>
      ) : null}
    </div>
  )
}

export default EventItem
