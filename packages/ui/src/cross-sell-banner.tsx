/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { tickerItemsFor, type CrossSellWorkspace, type TickerItem } from '@foundingos/config/cross-sell'
import { productionRequest } from './workspace-production-client'

const ROTATE_MS = 6000

// Thin news-style strip pinned to the bottom of every workspace page, rotating through what
// the company's other packages would add. Hidden for the rest of the day when closed.
export function CrossSellTicker({ workspace, production }: { workspace: CrossSellWorkspace; production: boolean }) {
  const dismissKey = `foundingos-ticker-hidden-${workspace}-${new Date().toISOString().slice(0, 10)}`
  const [items, setItems] = useState<TickerItem[]>([])
  const [index, setIndex] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [requested, setRequested] = useState<Record<string, 'sending' | 'sent' | 'failed'>>({})

  useEffect(() => {
    try { setHidden(window.localStorage.getItem(dismissKey) === '1') } catch { /* private mode */ }
    if (!production) { setItems(tickerItemsFor(workspace, null)); return }
    productionRequest<Array<{ workspace: string; enabled: boolean }>>('/platform/workspaces')
      .then((rows) => setItems(tickerItemsFor(workspace, rows?.length ? new Set(rows.filter((row) => row.enabled).map((row) => row.workspace)) : null)))
      .catch(() => setItems(tickerItemsFor(workspace, null)))
  }, [dismissKey, production, workspace])

  useEffect(() => {
    if (items.length < 2) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [items.length])

  if (hidden || !items.length) return null
  const item = items[index % items.length]
  const state = requested[item.target]

  const request = async () => {
    setRequested((current) => ({ ...current, [item.target]: 'sending' }))
    try {
      await productionRequest('/platform/upgrade-request', { method: 'POST', body: JSON.stringify({ workspaces: [item.target], note: `Requested from the ${workspace} workspace ticker` }) })
      setRequested((current) => ({ ...current, [item.target]: 'sent' }))
    } catch {
      setRequested((current) => ({ ...current, [item.target]: 'failed' }))
    }
  }

  return (
    <aside aria-label="More from FoundingOS" aria-live="polite" className={`cross-sell-ticker cross-sell-${item.target}`}>
      <span className="cross-sell-ticker-tag">{item.owned ? 'In your plan' : 'New for you'}</span>
      <p key={index}><strong>{item.label}</strong><span>{item.text}</span>{item.owned ? null : <em>{item.price}</em>}</p>
      <div className="cross-sell-ticker-actions">
        {item.owned
          ? <Link href={`/app/${item.target}`}>Open {item.label} →</Link>
          : production
            ? <button disabled={state === 'sending' || state === 'sent'} onClick={() => void request()} type="button">{state === 'sent' ? 'Requested ✓' : state === 'sending' ? 'Requesting…' : state === 'failed' ? 'Try again' : `Add ${item.label}`}</button>
            : <Link href="/pricing">Add {item.label} →</Link>}
        <button aria-label="Hide for today" className="cross-sell-ticker-close" onClick={() => { try { window.localStorage.setItem(dismissKey, '1') } catch { /* private mode */ } setHidden(true) }} type="button">×</button>
      </div>
    </aside>
  )
}
