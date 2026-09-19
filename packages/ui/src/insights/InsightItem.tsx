/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { INSIGHT_DISPLAY_MAP, type InsightType } from '@foundingos/config/event-display-map'

export type InsightRecord = {
  id: string
  type: InsightType
  source: string
  payload: Record<string, unknown>
  createdAt: string
}

export function InsightItem({ insight }: { insight: InsightRecord }) {
  const [expanded, setExpanded] = useState(false)
  const display = INSIGHT_DISPLAY_MAP[insight.type]
  const title = typeof insight.payload.title === 'string' ? insight.payload.title : display.title
  const detail = typeof insight.payload.detail === 'string' ? insight.payload.detail : ''
  return (
    <button type="button" className="event-feed-item" onClick={() => setExpanded((value) => !value)} style={{ textAlign: 'left', width: '100%', borderLeftColor: display.color }}>
      <div className="event-feed-item-header">
        <span className="event-feed-icon">{display.icon}</span>
        <strong className="event-feed-title">{title}</strong>
        <span className="event-feed-source">{insight.source}</span>
        <time className="event-feed-timestamp">{new Date(insight.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</time>
      </div>
      <p>{detail}</p>
      {expanded ? <pre className="event-feed-payload">{JSON.stringify(insight.payload, null, 2)}</pre> : null}
    </button>
  )
}
