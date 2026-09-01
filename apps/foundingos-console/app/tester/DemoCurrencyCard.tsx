/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { buildDemoCurrencyPanel, type DemoCurrencyPanelData } from './demo-currency'

// Fetches this app's own real, read-only FX proxy (/api/fx/rates — see route.ts for the
// real external source) on mount. The synthetic demo AMOUNT never changes (this stays a demo
// module); only the conversion RATE upgrades from the fixed synthetic multiplier to a real,
// live rate when the fetch succeeds. Falls back to synthetic rates silently and honestly
// (labeled as such) if the live fetch fails for any reason — never blocks rendering, never
// shows a stale number pretending to be live.
export function DemoCurrencyCard({ moduleId }: { moduleId: string }) {
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/fx/rates')
      .then((res) => res.json())
      .then((data: { live: boolean; rates: Record<string, number> | null; fetchedAt: string | null }) => {
        if (cancelled) return
        if (data.live && data.rates) {
          setLiveRates(data.rates)
          setFetchedAt(data.fetchedAt)
        }
      })
      .catch(() => {
        // Silent, honest fallback — synthetic rates remain in use, labeled as such below.
      })
      .finally(() => {
        if (!cancelled) setChecked(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const panel: DemoCurrencyPanelData = buildDemoCurrencyPanel(moduleId, liveRates)

  return (
    <article className="module-card fo-card quantum-frame">
      <div className="module-card-top"><span>🌍</span><strong>Demo currency simulation</strong></div>
      <p><small>
        {panel.ratesAreLive
          ? `Real, live exchange rates (open.er-api.com${fetchedAt ? `, fetched ${new Date(fetchedAt).toLocaleString()}` : ''}) applied to a synthetic demo amount — the amount is demo-only, the rate is real.`
          : checked
            ? 'Live FX unavailable right now — showing fixed synthetic demo rates instead.'
            : 'Checking for live exchange rates…'}
        {' '}Never a real price, never shown inside a real module.
      </small></p>
      <p style={{ fontSize: 20, fontWeight: 700, margin: '4px 0' }}>{panel.primary.formatted} <small style={{ fontWeight: 400, opacity: 0.6 }}>({panel.primary.code} · simulated locale)</small></p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13, opacity: 0.75 }}>
        {panel.secondary.map((c) => (
          <span key={c.code}>{c.formatted} <small>({c.code})</small></span>
        ))}
      </div>
    </article>
  )
}

export default DemoCurrencyCard
