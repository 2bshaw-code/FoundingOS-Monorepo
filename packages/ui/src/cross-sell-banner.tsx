/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { crossSellFor, type CrossSellOffer, type CrossSellWorkspace } from '@foundingos/config/cross-sell'
import { productionRequest } from './workspace-production-client'

const DISMISS_DAYS = 7

// Shows what the company's *other* packages would add, from the point of view of this
// workspace. Production tenants only see packages they haven't switched on; the demo shows all.
export function CrossSellBanner({ workspace, production }: { workspace: CrossSellWorkspace; production: boolean }) {
  const dismissKey = `foundingos-cross-sell-dismissed-${workspace}`
  const [offers, setOffers] = useState<CrossSellOffer[]>([])
  const [hidden, setHidden] = useState(true)
  const [requested, setRequested] = useState<Record<string, 'sending' | 'sent' | 'failed'>>({})

  useEffect(() => {
    try {
      const until = Number(window.localStorage.getItem(dismissKey) || 0)
      setHidden(until > Date.now())
    } catch { setHidden(false) }
    if (!production) { setOffers(crossSellFor(workspace, null)); return }
    productionRequest<Array<{ workspace: string; enabled: boolean }>>('/platform/workspaces')
      .then((rows) => setOffers(crossSellFor(workspace, rows?.length ? new Set(rows.filter((row) => row.enabled).map((row) => row.workspace)) : null)))
      .catch(() => setOffers([]))
  }, [dismissKey, production, workspace])

  if (hidden || !offers.length) return null

  const dismiss = () => {
    try { window.localStorage.setItem(dismissKey, String(Date.now() + DISMISS_DAYS * 86_400_000)) } catch { /* private mode */ }
    setHidden(true)
  }
  const request = async (target: string) => {
    setRequested((current) => ({ ...current, [target]: 'sending' }))
    try {
      await productionRequest('/platform/upgrade-request', { method: 'POST', body: JSON.stringify({ workspaces: [target], note: `Requested from the ${workspace} workspace banner` }) })
      setRequested((current) => ({ ...current, [target]: 'sent' }))
    } catch {
      setRequested((current) => ({ ...current, [target]: 'failed' }))
    }
  }

  return (
    <aside aria-label="More from FoundingOS" className="cross-sell">
      <header>
        <span>More from FoundingOS</span>
        <button aria-label="Hide for a week" onClick={dismiss} type="button">×</button>
      </header>
      <div className="cross-sell-grid">
        {offers.map((offer) => (
          <article className={`cross-sell-card cross-sell-${offer.target}`} key={offer.target}>
            <p className="cross-sell-eyebrow">{offer.label} · {offer.price}</p>
            <h3>{offer.headline}</h3>
            <ul>{offer.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            <div className="cross-sell-actions">
              {production
                ? <button disabled={requested[offer.target] === 'sending' || requested[offer.target] === 'sent'} onClick={() => void request(offer.target)} type="button">{requested[offer.target] === 'sent' ? 'Requested ✓ — we’ll switch it on' : requested[offer.target] === 'sending' ? 'Requesting…' : requested[offer.target] === 'failed' ? 'Try again' : `Add ${offer.label}`}</button>
                : <Link href="/pricing">Add {offer.label}</Link>}
              <Link href={`/test-workspaces/${offer.target}`}>See it in action →</Link>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}
