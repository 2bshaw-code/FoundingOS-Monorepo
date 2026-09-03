/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { QuantumSyncStatus } from './QuantumSyncStatus'
import { Sparkline } from './Sparkline'
import { aggregateBrandSignals, type BrandSignal } from '@foundingos/config/brandSignalFeed'
import { BRAND_PERSONALITIES } from '@foundingos/config/brand-intelligence'
import type { QuantumEnrichedFields } from '@foundingos/config/quantum-orchestration-layer'
import { SuperDashQuantumTiles } from '@foundingos/ui/superdash/SuperDashQuantumTiles'
import { SuperDashChat } from '@foundingos/ui/superdash/SuperDashChat'
import { SuperDashCommandBar } from '@foundingos/ui/superdash/SuperDashCommandBar'
import { useSuperDashCommandHandler } from '@foundingos/ui/superdash/SuperDashCommandHandler'
import { SuperDashAutoActions } from '@foundingos/ui/superdash/SuperDashAutoActions'
import { SuperDashCoaching } from '@foundingos/ui/superdash/SuperDashCoaching'
import { SuperDashNotifications } from '@foundingos/ui/superdash/SuperDashNotifications'
import { SuperDashTimeline } from '@foundingos/ui/superdash/SuperDashTimeline'
import { SuperDashGlobalSearch } from '@foundingos/ui/superdash/SuperDashGlobalSearch'
import { getSuperDashTiles } from '@foundingos/ui/superdash/getSuperDashTiles'
import { SuperDashAutonomous } from '@foundingos/ui/superdash/SuperDashAutonomous'
import { SuperDashPredictive } from '@foundingos/ui/superdash/SuperDashPredictive'
import { SuperDashAnomaly } from '@foundingos/ui/superdash/SuperDashAnomaly'
import { SuperDashInsight } from '@foundingos/ui/superdash/SuperDashInsight'
import { SuperDashScenario } from '@foundingos/ui/superdash/SuperDashScenario'
import { SuperDashGuardian } from '@foundingos/ui/superdash/SuperDashGuardian'
import { SuperDashCinematic } from '@foundingos/ui/superdash/SuperDashCinematic'
import { SuperDashTeamViewer } from '@foundingos/ui/superdash/SuperDashTeamViewer'
import { DemoMessageBoard } from '@foundingos/ui/demo-message-board'
import { SuperDashCommercialPanel } from '@foundingos/ui/superdash/SuperDashCommercialPanel'
import { SuperDashSurveyPanel } from '@foundingos/ui/superdash/SuperDashSurveyPanel'
import { SuperDashSurveyFeedPanel } from '@foundingos/ui/superdash/SuperDashSurveyFeedPanel'
import { SuperDashBrandMetricsPanel } from '@foundingos/ui/superdash/SuperDashBrandMetricsPanel'

type Tone = 'good' | 'watch' | 'risk'

type BrandRow = {
  brand: string
  marketing: number
  accounting: number
  serviceLoad: number
  previousServiceLoad: number
  messaging: number
  aiActions: number
  status: Tone
  marketingHistory: number[]
}

const BRAND_ROWS: BrandRow[] = [
  { brand: 'FoundRetail', marketing: 88, accounting: 96, serviceLoad: 42, previousServiceLoad: 39, messaging: 1240, aiActions: 68, status: 'good', marketingHistory: [80, 82, 85, 84, 87, 88] },
  { brand: 'FoundMeat', marketing: 76, accounting: 95, serviceLoad: 38, previousServiceLoad: 41, messaging: 640, aiActions: 54, status: 'good', marketingHistory: [70, 72, 74, 75, 75, 76] },
  { brand: 'FoundThat', marketing: 70, accounting: 88, serviceLoad: 26, previousServiceLoad: 24, messaging: 340, aiActions: 33, status: 'good', marketingHistory: [66, 67, 68, 69, 69, 70] },
  { brand: 'FoundTalent', marketing: 78, accounting: 93, serviceLoad: 45, previousServiceLoad: 40, messaging: 910, aiActions: 71, status: 'watch', marketingHistory: [73, 74, 76, 77, 77, 78] },
  { brand: 'FoundCrypto', marketing: 83, accounting: 85, serviceLoad: 55, previousServiceLoad: 60, messaging: 1580, aiActions: 97, status: 'watch', marketingHistory: [88, 86, 85, 84, 83, 83] },
  { brand: 'FoundFinance', marketing: 74, accounting: 99, serviceLoad: 14, previousServiceLoad: 14, messaging: 520, aiActions: 62, status: 'good', marketingHistory: [72, 73, 73, 74, 74, 74] },
  { brand: 'FoundHealth', marketing: 66, accounting: 92, serviceLoad: 48, previousServiceLoad: 37, messaging: 690, aiActions: 51, status: 'risk', marketingHistory: [70, 69, 68, 67, 66, 66] },
  { brand: 'FoundLogistics', marketing: 81, accounting: 90, serviceLoad: 63, previousServiceLoad: 58, messaging: 770, aiActions: 88, status: 'watch', marketingHistory: [77, 78, 79, 80, 80, 81] },
]

const PREDICTIVE_INSIGHTS = [
  'FoundCrypto messaging volume up 34% over 7 days — monitor support capacity.',
  'FoundLogistics service load projected to cross 70 tickets/day within 5 days.',
  'FoundFinance accounting health holding at 99% — no forecasted risk this quarter.',
]

const ANOMALIES = [
  { brand: 'FoundHealth', signal: 'Service load +31% week-over-week', tone: 'risk' as const },
  { brand: 'FoundCrypto', signal: 'Messaging volume spiking beyond staffing model', tone: 'watch' as const },
]

// Real brand signal feed (Retail/Meat/FoundThat/Talent/Crypto/Finance/Health/Logistics), separate
// from the mock rows above. Computed once at module load with a fixed timestamp so SSR and client hydration match exactly.
const BRAND_SIGNALS = aggregateBrandSignals(new Date(0).toISOString())

// Small per-brand identity-color dots only (Pulse Map) — the rest of SuperDashboard's
// chrome stays on FounderOS accent tokens; this mirrors the existing status-color pattern.
const BRAND_PERSONALITY_COLORS = Object.fromEntries(
  Object.values(BRAND_PERSONALITIES).map((layer) => [layer.brand, layer.color]),
) as Record<string, string>

const FORECAST_HORIZONS = ['24h', '7d', '30d'] as const
type ForecastHorizon = (typeof FORECAST_HORIZONS)[number]

const FORECAST_BY_HORIZON: Record<ForecastHorizon, { combinedRevenueTrend: string; combinedServiceLoadTrend: string; confidence: string }> = {
  '24h': { combinedRevenueTrend: '+0.4%', combinedServiceLoadTrend: '+1.1%', confidence: '92%' },
  '7d': { combinedRevenueTrend: '+1.6%', combinedServiceLoadTrend: '+3.4%', confidence: '89%' },
  '30d': { combinedRevenueTrend: '+4.8%', combinedServiceLoadTrend: '+9.2%', confidence: '86%' },
}

type ActionQueueItem = { id: string; description: string; state: 'pending' | 'approved' | 'dismissed' }

const INITIAL_ACTION_QUEUE: ActionQueueItem[] = [
  { id: 'aq-1', description: 'Reassign 8 overdue FoundHealth tickets to standby queue', state: 'pending' },
  { id: 'aq-2', description: 'Scale FoundCrypto messaging capacity +15% for weekend spike', state: 'pending' },
  { id: 'aq-3', description: 'Publish FoundTalent marketing recovery brief for brand lead review', state: 'pending' },
  ...BRAND_SIGNALS.map((signal) => ({
    id: `aq-signal-${signal.brand}`,
    description: `[${signal.brand}] ${signal.opportunity}`,
    state: 'pending' as const,
  })),
]

// Package Activation System — demo/mock aggregate data for the SuperDash panel below. No live
// billing or usage-metering backend exists yet; these are illustrative founder-level projections.
const UPGRADE_PATHS = [
  { from: 'Starter', to: 'Standard', accounts: 18 },
  { from: 'Standard', to: 'Premium', accounts: 11 },
  { from: 'Premium', to: 'Enterprise', accounts: 3 },
]

const REVENUE_PROJECTION = { horizon: '30d', mrr: 18240, projectedMrr: 20460, addOnAttachRate: '61%' }

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function average(values: number[]) {
  return Math.round(sum(values) / values.length)
}

function delta(current: number, previous: number) {
  const diff = current - previous
  const sign = diff > 0 ? '+' : diff < 0 ? '' : '±'
  return `${sign}${diff}`
}

function SuperKPICard({ label, value, trend, icon, tone, history }: { label: string; value: string; trend: string; icon: string; tone: Tone; history: number[] }) {
  return (
    <article className={`dashboard-card fo-card card-premium ${tone}`}>
      <div className="superdashboard-kpi-head">
        <span>{icon}</span>
        <strong>{value}</strong>
      </div>
      <p>{label}</p>
      <Sparkline points={history} tone={tone} />
      {trend && <small>{trend}</small>}
    </article>
  )
}

export default function SuperDashboardPage({ readOnly = false, quantumSignals = [], verificationStatus, testerSummary }: { readOnly?: boolean; quantumSignals?: Array<BrandSignal & QuantumEnrichedFields>; verificationStatus?: { lastRun: string | null; driftCount: number; safeFixCount: number; pendingGuardian: number }; testerSummary?: { activation: string; engagement: number; retention: number; stability: number; autonomy: string } }) {
  const handleCommand = useSuperDashCommandHandler()
  const superDashTiles = useMemo(() => getSuperDashTiles(), [])
  const autoActions = useMemo(
    () => superDashTiles.map((t) => SuperDashAutoActions(t.score, t.id)).filter((a) => a !== null),
    [superDashTiles],
  )
  const autonomousActions = useMemo(() => SuperDashAutonomous(superDashTiles), [superDashTiles])
  const anomalies = useMemo(() => SuperDashAnomaly(superDashTiles), [superDashTiles])
  const predictive = useMemo(() => SuperDashPredictive([1.0, 1.1, 0.9, 1.2, 1.3]), [])
  const [horizon, setHorizon] = useState<ForecastHorizon>('30d')
  const [actionQueue, setActionQueue] = useState(INITIAL_ACTION_QUEUE)

  // Quantum enrichment is purely additive — augments the existing panels below via brand lookup,
  // never replaces the deterministic BRAND_SIGNALS/BRAND_ROWS data those panels already render.
  const quantumByBrand = useMemo(() => new Map(quantumSignals.map((signal) => [signal.brand, signal])), [quantumSignals])

  // Memoized selectors — recomputed only when the underlying brand snapshot changes.
  const aggregates = useMemo(() => ({
    avgMarketing: average(BRAND_ROWS.map((row) => row.marketing)),
    avgAccounting: average(BRAND_ROWS.map((row) => row.accounting)),
    totalServiceLoad: sum(BRAND_ROWS.map((row) => row.serviceLoad)),
    totalMessaging: sum(BRAND_ROWS.map((row) => row.messaging)),
    totalAiActions: sum(BRAND_ROWS.map((row) => row.aiActions)),
  }), [])

  const ecosystemScore = useMemo(() => {
    // Weighted composite: marketing 30%, accounting 30%, AI actions 20%, service load (inverted) 20%.
    const serviceLoadScore = Math.max(0, 100 - aggregates.totalServiceLoad / BRAND_ROWS.length)
    const aiActionsScore = Math.min(100, aggregates.totalAiActions / BRAND_ROWS.length)
    return Math.round(aggregates.avgMarketing * 0.3 + aggregates.avgAccounting * 0.3 + aiActionsScore * 0.2 + serviceLoadScore * 0.2)
  }, [aggregates])

  const forecast = FORECAST_BY_HORIZON[horizon]
  const hasAnomalies = ANOMALIES.length > 0

  function resolveAction(id: string, state: ActionQueueItem['state']) {
    setActionQueue((current) => current.map((item) => (item.id === id ? { ...item, state } : item)))
  }

  const summaryMetrics: Array<{ label: string; value: string; trend: string; icon: string; tone: Tone; history: number[] }> = [
    { label: 'Marketing performance', value: `${aggregates.avgMarketing}%`, trend: 'Across 8 brands', icon: '▲', tone: 'good', history: [80, 82, 83, 84, 82, aggregates.avgMarketing] },
    { label: 'Accounting health', value: `${aggregates.avgAccounting}%`, trend: 'Across 8 brands', icon: '£', tone: 'good', history: [90, 91, 92, 93, 92, aggregates.avgAccounting] },
    { label: 'Service load', value: aggregates.totalServiceLoad.toLocaleString('en-GB'), trend: 'Open tickets, all brands', icon: '◌', tone: aggregates.totalServiceLoad > 250 ? 'watch' : 'good', history: [210, 225, 240, 260, 270, aggregates.totalServiceLoad] },
    { label: 'Messaging activity', value: aggregates.totalMessaging.toLocaleString('en-GB'), trend: 'Messages / day', icon: '✉', tone: 'good', history: [6200, 6800, 7100, 7600, 7900, aggregates.totalMessaging] },
    { label: 'AI actions', value: aggregates.totalAiActions.toLocaleString('en-GB'), trend: 'Autonomous actions / day', icon: '✦', tone: 'good', history: [560, 610, 650, 700, 780, aggregates.totalAiActions] },
    { label: 'System health', value: '99.9%', trend: 'Global infrastructure', icon: '✓', tone: 'good', history: [99.6, 99.7, 99.8, 99.9, 99.9, 99.9] },
    { label: 'Global ecosystem score', value: `${ecosystemScore}`, trend: 'Weighted composite KPI', icon: '◈', tone: ecosystemScore >= 80 ? 'good' : ecosystemScore >= 60 ? 'watch' : 'risk', history: [78, 80, 81, 82, 83, ecosystemScore] },
  ]

  return (
    <section className="stack quantum-ambient-grid">
      <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
      <header className="module-header header-premium">
        <p>FounderOS · Cross-brand intelligence</p>
        <h1>SuperDashboard</h1>
        <span>Live marketing, accounting, service, messaging, and AI signal for every brand in the group — FounderOS only.</span>
      </header>

      <div className="kpi-grid">
        {summaryMetrics.map((metric) => <SuperKPICard key={metric.label} {...metric} />)}
      </div>

      <div className="module-card-grid">
        <article className="module-card fo-card panel-premium">
          <div className="module-card-top"><span>01</span><strong>FoundAI predictive insights</strong></div>
          <ul>
            {PREDICTIVE_INSIGHTS.map((insight) => <li key={insight}>{insight}</li>)}
          </ul>
        </article>

        <article className="module-card fo-card panel-premium">
          <div className="module-card-top"><span>02</span><strong>Autonomous action queue</strong></div>
          <ul className="superdashboard-action-queue">
            {actionQueue.map((item) => (
              <li key={item.id} className={`action-${item.state}`}>
                <span>{item.description}</span>
                {item.state === 'pending' && !readOnly ? (
                  <div className="superdashboard-action-buttons">
                    <button type="button" className="btn-premium" onClick={() => resolveAction(item.id, 'approved')}>Approve</button>
                    <button type="button" className="btn-premium" onClick={() => resolveAction(item.id, 'dismissed')}>Dismiss</button>
                  </div>
                ) : (
                  <small>{item.state === 'pending' ? 'Read-only' : item.state === 'approved' ? 'Approved' : 'Dismissed'}</small>
                )}
              </li>
            ))}
          </ul>
        </article>

        <article className="module-card fo-card panel-premium">
          <div className="module-card-top">
            <span>03</span>
            <strong>Anomaly detection {hasAnomalies && <span className="quantum-sync-dot" aria-hidden="true" />}</strong>
          </div>
          <ul>
            {ANOMALIES.map((anomaly) => (
              <li key={anomaly.brand}><strong>{anomaly.brand}</strong> — {anomaly.signal}</li>
            ))}
          </ul>
        </article>

        <article className="module-card fo-card panel-premium">
          <div className="module-card-top"><span>◈</span><strong>Scraping & Customer Pipeline</strong></div>
          <p><small>Real synthetic engagement data across all 8 brands, a manual "Run Scrape" trigger, and a customer pipeline view built from real survey submissions.</small></p>
          <Link className="btn btn-primary" href={readOnly ? '/superdashboard/scraping?readOnly=1' : '/superdashboard/scraping'}>Open Scraping Dashboard</Link>
        </article>

        <article className="module-card fo-card panel-premium">
          <div className="module-card-top"><span>04</span><strong>Cross-brand forecasting</strong></div>
          <div className="superdashboard-horizon-selector" role="tablist" aria-label="Forecast horizon">
            {FORECAST_HORIZONS.map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={horizon === option}
                className={horizon === option ? 'active' : ''}
                onClick={() => setHorizon(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="module-card-meta">
            <small>Revenue {forecast.combinedRevenueTrend}</small>
            <small>Service load {forecast.combinedServiceLoadTrend}</small>
          </div>
          <p>Confidence: {forecast.confidence}</p>
        </article>
      </div>

      <div className="console-grid">
        <article className="panel panel-premium wide fo-card">
          <h2>Brand performance matrix</h2>
          <table className="superdashboard-brand-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Marketing</th>
                <th>Accounting</th>
                <th>Service load</th>
                <th>Load Δ (WoW)</th>
                <th>Messaging / day</th>
                <th>AI actions / day</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {BRAND_ROWS.map((row) => (
                <tr key={row.brand}>
                  <td>{row.brand}</td>
                  <td>{row.marketing}%</td>
                  <td>{row.accounting}%</td>
                  <td>{row.serviceLoad}</td>
                  <td>{delta(row.serviceLoad, row.previousServiceLoad)}</td>
                  <td>{row.messaging.toLocaleString('en-GB')}</td>
                  <td>{row.aiActions}</td>
                  <td className={`status-${row.status}`}>{row.status === 'good' ? 'Stable' : row.status === 'watch' ? 'Watch' : 'At risk'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel fo-card fo-panel-glow">
          <h2>Quantum Sync Layer</h2>
          <QuantumSyncStatus nodes={BRAND_ROWS.length} pulseStrength={78} />
          <p>Real-time cross-brand state stream. All modules on this page update from the same synchronized snapshot — no layout shift on refresh.</p>
        </article>

        <article className="panel wide fo-card">
          <h2>Insight heatmap — risk intensity per brand</h2>
          <div className="superdashboard-heatmap">
            {BRAND_ROWS.map((row) => (
              <div key={row.brand} className={`superdashboard-heat-cell status-${row.status}`}>
                <strong>{row.brand}</strong>
                <small>{row.status === 'good' ? 'Low' : row.status === 'watch' ? 'Elevated' : 'High'} risk</small>
              </div>
            ))}
          </div>
          {quantumSignals.length > 0 && (
            <div className="superdashboard-heatmap">
              {quantumSignals.filter((signal) => signal.quantumAnomaly).map((signal) => (
                <div key={`quantum-anomaly-${signal.brand}`} className="superdashboard-heat-cell status-watch">
                  <strong style={{ textTransform: 'capitalize' }}>{signal.brand} · Quantum anomaly</strong>
                  <small>{signal.quantumAnomaly}</small>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel wide fo-card">
          <h2>Brand intelligence signals</h2>
          <p><small>Live feed from each brand's personality layer (Commerce Pulse, Supply Chain Heat, System Integrity, Recruitment Velocity, Market Volatility, Cashflow Stability).</small></p>
          <div className="superdashboard-heatmap">
            {BRAND_SIGNALS.map((signal) => (
              <div key={signal.brand} className="superdashboard-heat-cell status-good">
                <strong style={{ textTransform: 'capitalize' }}>{signal.brand}</strong>
                <small>{signal.kpi}</small>
              </div>
            ))}
          </div>
          <table className="superdashboard-brand-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Insight</th>
                <th>Risk</th>
                <th>Opportunity</th>
                <th>Micro-story</th>
                <th>Quantum insight</th>
              </tr>
            </thead>
            <tbody>
              {BRAND_SIGNALS.map((signal) => (
                <tr key={signal.brand}>
                  <td style={{ textTransform: 'capitalize' }}>{signal.brand}</td>
                  <td>{signal.insight}</td>
                  <td>{signal.risk}</td>
                  <td>{signal.opportunity}</td>
                  <td>{signal.microStory}</td>
                  <td>{quantumByBrand.get(signal.brand)?.quantumInsightSentence ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel fo-card">
          <h2>Pulse map</h2>
          <div className="superdashboard-heatmap">
            {BRAND_SIGNALS.map((signal) => {
              const quantum = quantumByBrand.get(signal.brand)
              return (
                <div key={signal.brand} className="superdashboard-heat-cell status-good">
                  <span className="brand-pulse-dot" style={{ '--brand-color': BRAND_PERSONALITY_COLORS[signal.brand] } as React.CSSProperties} aria-hidden="true" />
                  <strong style={{ textTransform: 'capitalize' }}>{signal.brand}</strong>
                  <small>Pulse {signal.pulse}%{quantum && typeof quantum.quantumPulseAdjustment === 'number' ? ` (Quantum ${quantum.quantumPulseAdjustment > 0 ? '+' : ''}${quantum.quantumPulseAdjustment}%)` : ''}</small>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel fo-card">
          <h2>Contribution scoreboard</h2>
          <table className="superdashboard-brand-table">
            <thead>
              <tr><th>Rank</th><th>Brand</th><th>Contribution score</th><th>Quantum opportunity</th></tr>
            </thead>
            <tbody>
              {[...BRAND_SIGNALS]
                .sort((a, b) => b.contributionScore - a.contributionScore)
                .map((signal, index) => (
                  <tr key={signal.brand}>
                    <td>#{index + 1}</td>
                    <td style={{ textTransform: 'capitalize' }}>{signal.brand}</td>
                    <td>{signal.contributionScore}</td>
                    <td>{quantumByBrand.get(signal.brand)?.quantumOpportunity ?? '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </article>

        <article className="panel wide fo-card">
          <h2>Revenue &amp; upgrade paths (founder-level)</h2>
          <p><small>Model D package system — SystemOS tiers, industry packs, hardware packs, and QuantumOS/IntelligenceOS add-ons. Superdash remains unrestricted.</small></p>
          <div className="module-card-grid">
            <div className="module-card fo-card">
              <strong>Upgrade paths</strong>
              <ul>
                {UPGRADE_PATHS.map((path) => (
                  <li key={`${path.from}-${path.to}`}>{path.from} → {path.to}: {path.accounts} accounts</li>
                ))}
              </ul>
            </div>
            <div className="module-card fo-card">
              <strong>Revenue projection ({REVENUE_PROJECTION.horizon})</strong>
              <p>MRR £{REVENUE_PROJECTION.mrr.toLocaleString('en-GB')} → £{REVENUE_PROJECTION.projectedMrr.toLocaleString('en-GB')}</p>
              <small>Add-on attach rate: {REVENUE_PROJECTION.addOnAttachRate}</small>
            </div>
          </div>
        </article>
      </div>

      <SuperDashCommercialPanel />
      <SuperDashSurveyPanel />
      <SuperDashSurveyFeedPanel />
      <SuperDashBrandMetricsPanel />

      <article className="panel fo-card" style={{ marginTop: 24 }}>
        <SuperDashCinematic>
        <h2>Core module quantum tiles</h2>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground, #9ca3af)', marginBottom: 12 }}>
          Quantum-enhanced overview of every core module registered in the ecosystem.
        </p>
        <SuperDashQuantumTiles />

        <SuperDashNotifications tiles={superDashTiles} />

        <SuperDashInsight tiles={superDashTiles} />

        {autonomousActions.map((action, index) => (
          <div key={index} className="superdash-slide-up" style={{ fontSize: 12, marginTop: 8 }}>{action.message}</div>
        ))}

        {anomalies.map((anomaly, index) => (
          <div key={index} className="superdash-slide-up" style={{ fontSize: 12, marginTop: 8 }}>{anomaly}</div>
        ))}

        <div className="superdash-fade-in" style={{ fontSize: 12, marginTop: 8 }}>
          Predicted next score: {predictive.nextScore} ({predictive.trendDirection})
        </div>

        {autoActions.map((action, index) => (
          <SuperDashCoaching key={index} moduleId={action!.message.split(' ')[0]} score={parseFloat(superDashTiles[index]?.score ?? '1')} />
        ))}

        <SuperDashTimeline history={[1.0, 1.1, 0.9, 1.2, 1.3]} />

        <SuperDashScenario moduleId="marketing" score="1.1" />

        <SuperDashChat />
        <SuperDashCommandBar onCommand={handleCommand} />
        <SuperDashGlobalSearch tiles={superDashTiles} onCommand={handleCommand} />

        <SuperDashTeamViewer />

        <DemoMessageBoard config={{ name: 'FoundingOS', logo: '⌂' }} variant="global" />

        <section className="panel panel-premium quantum-card" style={{ marginTop: 24 }}>
          <span className="quantum-corner-marker">⌂</span>
          <h3 className="header-premium">Why FoundingOS Pays for Itself</h3>
          <ul className="checklist-list">
            {['Time saved', 'Staff saved', 'Mistakes avoided', 'Revenue increased', 'Chaos eliminated', 'Control restored'].map((item) => (
              <li key={item} className="checklist-item"><span>{item}</span></li>
            ))}
          </ul>
        </section>

        <div className="superdash-fade-in" style={{ fontSize: 12, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SuperDashGuardian().map((g, i) => (
            <div key={i}>{g}</div>
          ))}
        </div>

        {verificationStatus && (
          <footer style={{ fontSize: 11, opacity: 0.6, marginTop: 24, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            Verification: {verificationStatus.lastRun ? new Date(verificationStatus.lastRun).toLocaleString('en-GB', { timeZone: 'UTC' }) : 'never run'} • {verificationStatus.driftCount} drift • {verificationStatus.safeFixCount} safe-fixed • {verificationStatus.pendingGuardian} pending Guardian
          </footer>
        )}

        {testerSummary && (
          <footer style={{ fontSize: 11, opacity: 0.6, marginTop: 4, paddingTop: 4 }}>
            Testers: {testerSummary.activation} activation • {testerSummary.engagement} engagement • {testerSummary.retention} retention • {testerSummary.stability} stability • {testerSummary.autonomy} autonomy
          </footer>
        )}
        </SuperDashCinematic>
      </article>
    </section>
  )
}
