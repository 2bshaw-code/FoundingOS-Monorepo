/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import { ModuleHeader, consoleStyle, type BrandConsoleConfig } from '../console'
import { DEMO_PODS, DEMO_ACTIVITY, totalBalanceGbp, RISK_BADGE_COLOR, type ActivityEntry, type RiskLevel } from './crypto-wallet-data'

// Six real, dedicated Crypto views (Wallets/Portfolio/Transactions/Exchange/Charts/Analytics —
// these nav links already existed in every crypto-console sidebar, pointing at real routes that
// had no page behind them until now, silently falling through to a generic "Module: wallets"
// placeholder). Built around the genuinely good "invisible crypto" UX ideas — plain-language
// actions, risk-first design, a narrative activity feed, goal-based pots, an explicit opt-in
// "advanced" view — as honest, clearly-labeled DEMO interface polish. There is no real wallet, no
// blockchain integration, and no real money movement anywhere in these six views.

function DemoBanner() {
  return (
    <div className="quantum-narrator-panel" style={{ marginBottom: 4 }}>
      <p><small>Demo mode — every pod, balance, and activity below is synthetic and illustrative. No real wallet, blockchain, or money movement is involved.</small></p>
    </div>
  )
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: '#0b0b0b', background: RISK_BADGE_COLOR[risk] }}>
      {risk} risk
    </span>
  )
}

function formatBalance(balance: number, currency: string): string {
  if (currency === 'GBP') return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(balance)
  return `${balance} ${currency}`
}

export function WalletsView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const [explainMode, setExplainMode] = useState(false)

  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Your Pods" description="Every real account you hold — spending, savings, reputation, and task credits — in plain language, not jargon." />
      <DemoBanner />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary quantum-btn" onClick={() => setExplainMode((v) => !v)}>
          {explainMode ? '✓ Explain like I\u2019m 12 — ON' : 'Explain like I\u2019m 12'}
        </button>
      </div>
      <div className="module-card-grid">
        {DEMO_PODS.map((pod) => (
          <article key={pod.id} className="module-card fo-card quantum-frame">
            <div className="module-card-top">
              <span>{pod.kind === 'stablecoin' ? '💳' : pod.kind === 'reputation' ? '⭐' : '⏱'}</span>
              <strong>{pod.name}</strong>
              <span style={{ marginLeft: 'auto' }}><RiskBadge risk={pod.risk} /></span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 700 }}>{formatBalance(pod.balance, pod.currency)}</p>
            <p><small>{explainMode ? pod.explainLikeImTwelve : pod.plainDescription}</small></p>
            <p><small style={{ opacity: 0.65 }}>Why {pod.risk.toLowerCase()} risk: {pod.riskReason}</small></p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function PortfolioView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const total = totalBalanceGbp()
  const stablecoinPods = DEMO_PODS.filter((p) => p.kind === 'stablecoin')

  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Portfolio" description="How your real balance is spread across every pod — no charts required to understand it." />
      <DemoBanner />
      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame" style={{ gridColumn: '1 / -1' }}>
          <div className="module-card-top"><span>💰</span><strong>Total balance</strong></div>
          <p style={{ fontSize: 32, fontWeight: 700 }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(total)}</p>
          <p><small>Illustrative — up 2.1% this month, mostly from Growth Pot.</small></p>
        </article>
      </div>
      <article className="module-card fo-card quantum-frame">
        <div className="module-card-top"><span>◍</span><strong>Allocation</strong></div>
        <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
          {stablecoinPods.map((pod) => {
            const pct = Math.round((pod.balance / total) * 100)
            return (
              <div key={pod.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{pod.name}</span>
                  <span>{formatBalance(pod.balance, pod.currency)} · {pct}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </article>
    </section>
  )
}

export function TransactionsView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Activity" description="What actually happened, in plain English — never a transaction hash." />
      <DemoBanner />
      <article className="module-card fo-card quantum-frame">
        <div style={{ display: 'grid', gap: 12 }}>
          {DEMO_ACTIVITY.map((entry: ActivityEntry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{entry.direction === 'in' ? '↙' : '↗'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0 }}>{entry.narrative}</p>
                <small style={{ opacity: 0.6 }}>{entry.timestamp} · {entry.pod} · {entry.category}</small>
              </div>
              <strong style={{ color: entry.direction === 'in' ? RISK_BADGE_COLOR.Low : undefined }}>{entry.direction === 'in' ? '+' : '-'}{entry.amount.replace(/^[+-]/, '')}</strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

type Intent = 'pay' | 'split' | 'move' | 'request' | null

export function ExchangeView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const [intent, setIntent] = useState<Intent>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [people, setPeople] = useState('3')
  const [confirmed, setConfirmed] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const intents: { id: Intent; label: string; icon: string }[] = [
    { id: 'pay', label: 'Pay a friend', icon: '💸' },
    { id: 'split', label: 'Split a bill', icon: '➗' },
    { id: 'move', label: 'Move between pods', icon: '🔄' },
    { id: 'request', label: 'Request money', icon: '📥' },
  ]

  const summary = useMemo(() => {
    if (intent === 'pay' && recipient && amount) return `Pay ${recipient} £${amount}${reason ? ` for ${reason}` : ''}.`
    if (intent === 'split' && amount && people) return `Split £${amount} between ${people} people — each pays £${(Number(amount) / Number(people || '1')).toFixed(2)}.`
    if (intent === 'move' && amount) return `Move £${amount} from Main Pod into Growth Pot.`
    if (intent === 'request' && recipient && amount) return `Request £${amount} from ${recipient}.`
    return null
  }, [intent, recipient, amount, reason, people])

  function reset() {
    setIntent(null); setRecipient(''); setAmount(''); setReason(''); setPeople('3'); setConfirmed(false)
  }

  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Send, Pay & Split" description="Say what you want to do in plain language — the system works out the rest." />
      <DemoBanner />
      {!intent && (
        <div className="module-card-grid">
          {intents.map((option) => (
            <button key={option.id} type="button" className="module-card fo-card quantum-frame" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => setIntent(option.id)}>
              <div className="module-card-top"><span>{option.icon}</span><strong>{option.label}</strong></div>
            </button>
          ))}
        </div>
      )}
      {intent && !confirmed && (
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>{intents.find((i) => i.id === intent)?.icon}</span><strong>{intents.find((i) => i.id === intent)?.label}</strong></div>
          <div style={{ display: 'grid', gap: 10, marginTop: 8, maxWidth: 420 }}>
            {(intent === 'pay' || intent === 'request') && (
              <label>Who?<input className="quantum-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Reece" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} /></label>
            )}
            <label>Amount (£)<input className="quantum-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="20" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} /></label>
            {intent === 'pay' && (
              <label>What for? (optional)<input className="quantum-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="lunch" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} /></label>
            )}
            {intent === 'split' && (
              <label>Between how many people?<input className="quantum-input" value={people} onChange={(e) => setPeople(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} /></label>
            )}
            {summary && (
              <div className="quantum-narrator-panel">
                <p><strong>Here\u2019s what will happen:</strong> {summary}</p>
                <p><small><RiskBadge risk="Low" /> — reversible within 1 hour if it\u2019s a mistake. Pods update instantly, no gas fees, nothing technical to understand.</small></p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-primary quantum-btn" disabled={!summary} onClick={() => setConfirmed(true)}>Confirm</button>
              <button type="button" className="btn btn-secondary quantum-btn" onClick={reset}>Cancel</button>
            </div>
          </div>
        </article>
      )}
      {confirmed && summary && (
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>✓</span><strong>Done</strong></div>
          <p>{summary}</p>
          <p><small>Added to your Activity feed below (this session only — nothing is really sent).</small></p>
          <button type="button" className="btn btn-secondary quantum-btn" onClick={() => { setLog((current) => [summary, ...current]); reset() }}>Start another</button>
        </article>
      )}
      {log.length > 0 && (
        <article className="module-card fo-card">
          <div className="module-card-top"><span>📝</span><strong>This session\u2019s actions</strong></div>
          <ul>{log.map((entry, i) => <li key={i}><small>{entry}</small></li>)}</ul>
        </article>
      )}
    </section>
  )
}

export function ChartsView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  // Illustrative 14-point sparkline per pod — deterministic (no Math.random(), see this
  // session's hydration-safety lessons), just a fixed demo trend shape.
  const trend = [40, 44, 42, 48, 52, 50, 55, 58, 54, 60, 63, 61, 66, 70]
  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Charts (Advanced Mode)" description="Only shown because you asked for it — everything elsewhere in Crypto is chart-free by design." />
      <DemoBanner />
      {DEMO_PODS.filter((p) => p.kind === 'stablecoin').map((pod) => (
        <article key={pod.id} className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>📈</span><strong>{pod.name} — 14 day trend</strong></div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
            {trend.map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v}%`, background: 'var(--accent)', borderRadius: 2, opacity: 0.4 + (i / trend.length) * 0.6 }} />
            ))}
          </div>
          <p><small>Illustrative trend shape, not a real market feed.</small></p>
        </article>
      ))}
    </section>
  )
}

export function AnalyticsView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const riskCounts = DEMO_PODS.reduce<Record<RiskLevel, number>>((acc, pod) => {
    acc[pod.risk] = (acc[pod.risk] ?? 0) + 1
    return acc
  }, { Low: 0, Medium: 0, High: 0 })
  const splitCount = DEMO_ACTIVITY.filter((a) => a.category === 'Split & pay').length

  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Risk & Insights" description="Risk-first, in plain language — every rating comes with a real reason, never just a number." />
      <DemoBanner />
      <div className="module-card-grid">
        {(['Low', 'Medium', 'High'] as RiskLevel[]).map((level) => (
          <article key={level} className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span><RiskBadge risk={level} /></span></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>{riskCounts[level]}</p>
            <p><small>{riskCounts[level] === 1 ? 'pod' : 'pods'} at {level.toLowerCase()} risk</small></p>
          </article>
        ))}
      </div>
      <article className="module-card fo-card quantum-frame">
        <div className="module-card-top"><span>💡</span><strong>What\u2019s happening</strong></div>
        <p>Most of your recent activity ({splitCount} of {DEMO_ACTIVITY.length}) was splitting bills with friends — Main Pod is doing exactly what it\u2019s for.</p>
        <p>Growth Pot is your only Medium-risk pod — it can move up or down slightly, but Main Pod, Holiday Fund, and Rugby Tour Fund never will.</p>
      </article>
    </section>
  )
}
