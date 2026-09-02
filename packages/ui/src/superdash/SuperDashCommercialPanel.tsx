/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// SuperDash Commercial Panel — founder-level view of the Package Activation System.
// Entirely front-end: mocked/demo data only, no backend dependency, no routing changes.
import { useEffect, useState } from 'react'
import { BASE_TIERS, INDUSTRY_PACKS, PRICING_MODEL_LABELS, type PricingModel } from '@foundingos/config/package-model-d'
import { calculateAddOnPrice } from '@foundingos/config/pricing-engine'
import { readTesterProfile, type TesterProfile } from '@foundingos/config/tester-profile'

const PACKAGE_ANALYTICS = [
  { tier: 'Starter', accounts: 41, mrr: 1189 },
  { tier: 'Standard', accounts: 63, mrr: 4977 },
  { tier: 'Premium', accounts: 22, mrr: 3498 },
  { tier: 'Enterprise', accounts: 4, mrr: 8600 },
]

const RECOMMENDATION_LOGS = [
  { brand: 'FoundRetail', style: 'strong', reason: 'Fast growth trajectory + high data volume across 3 consoles.' },
  { brand: 'FoundHealth', style: 'subtle', reason: 'Moderate intelligence needs; QuantumOS adds value but isn\u2019t essential yet.' },
  { brand: 'FoundCrypto', style: 'strong', reason: 'High risk level + high expected usage — QuantumOS strongly indicated.' },
  { brand: 'FoundLogistics', style: 'none', reason: 'Small, steady operation — SystemOS alone is sufficient for now.' },
]

const USAGE_PROJECTIONS = { insights: 12400, simulations: 3100, anomalies: 890 }

const MODULE_UNLOCK_MAP = [
  { tier: 'Starter', modules: ['Core modules'] },
  { tier: 'Standard', modules: ['Core modules', 'Workflow modules'] },
  { tier: 'Premium', modules: ['Core modules', 'Workflow modules', 'All modules'] },
  { tier: 'Enterprise', modules: ['Core modules', 'Workflow modules', 'All modules', 'Custom modules'] },
]

const BRAND_HEALTH = INDUSTRY_PACKS.map((pack, index) => ({
  name: pack.name,
  uptime: 99.5 + (index % 3) * 0.15,
  stability: 90 + ((index * 7) % 10),
  performance: 85 + ((index * 5) % 12),
}))

function readinessScore() {
  const activationRate = PACKAGE_ANALYTICS.reduce((total, row) => total + row.accounts, 0)
  const strongRecs = RECOMMENDATION_LOGS.filter((log) => log.style === 'strong').length
  return Math.min(100, Math.round(40 + activationRate / 4 + strongRecs * 6))
}

type RealSubscription = { brandSlug: string; brandName: string; baseTier: string | null; industryPack: string | null; price: number; mrr: number; arr: number; currency: string; status: string }
type RealTotals = { totalMrr: number; totalArr: number; activeCount: number; currency: string }

// Real, database-backed section — genuinely separate from the mock panels below it (which
// keep their own "illustrative demo data" label, per this OS's own honesty rules). Reads
// real BrandSubscription rows via /api/superdash/package-subscriptions (same-origin, no
// payment processor — still no real billing, just a real, persisted record of which real
// tier/pack each brand is actually assigned to). Real zero across the board is the honest
// current state (no real paying customers yet), not a bug.
function RealSubscriptionsSection() {
  const [subscriptions, setSubscriptions] = useState<RealSubscription[]>([])
  const [totals, setTotals] = useState<RealTotals | null>(null)
  const [fxRates, setFxRates] = useState<Record<string, number> | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/superdash/package-subscriptions').then((r) => r.json()).catch(() => null),
      fetch('/api/fx/rates').then((r) => r.json()).catch(() => null),
    ]).then(([subs, fx]) => {
      if (subs) {
        setSubscriptions(subs.subscriptions ?? [])
        setTotals(subs.totals ?? null)
      }
      if (fx?.live && fx.rates) setFxRates(fx.rates)
      setLoaded(true)
    })
  }, [])

  if (!loaded) return null

  // Real MRR is stored in GBP; FX rates come back USD-based, so convert GBP -> USD -> target.
  const gbpToUsd = fxRates?.GBP ? 1 / fxRates.GBP : null
  const fxEquivalent = (amountGbp: number, code: string) => {
    if (!fxRates || !gbpToUsd || !fxRates[code]) return null
    const amountUsd = amountGbp * gbpToUsd
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: code === 'JPY' ? 0 : 2 }).format(amountUsd * fxRates[code])
  }

  return (
    <div className="module-card fo-card" style={{ marginBottom: 16 }}>
      <strong>Real subscriptions <small style={{ opacity: 0.55, fontWeight: 400 }}>(live MRR/ARR{totals && totals.totalMrr === 0 ? ' — currently 0, honestly, until a real subscription is assigned' : ''} — database-backed, informational only, no payment processor)</small></strong>
      <p style={{ margin: '6px 0' }}>
        Total real MRR: £{totals?.totalMrr.toLocaleString() ?? 0} · Real ARR: £{totals?.totalArr.toLocaleString() ?? 0} · {totals?.activeCount ?? 0} of {subscriptions.length} brands active
        {fxRates && totals && totals.totalMrr > 0 ? (
          <>
            {' '}<small style={{ opacity: 0.7 }}>
              (FX view: {fxEquivalent(totals.totalMrr, 'USD') ?? '—'} · {fxEquivalent(totals.totalMrr, 'EUR') ?? '—'} MRR — real live rate, read-only)
            </small>
          </>
        ) : !fxRates ? (
          <small style={{ opacity: 0.6 }}> (FX unavailable, showing base currency only)</small>
        ) : null}
      </p>
      <ul style={{ margin: 0 }}>
        {subscriptions.map((s) => (
          <li key={s.brandSlug}>
            {s.brandName}: {s.status === 'active' ? `${s.baseTier ?? '—'}${s.industryPack ? ` + ${s.industryPack}` : ''} — £${s.mrr}/mo` : 'no real subscription yet'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SuperDashCommercialPanel() {
  const [testerMode, setTesterMode] = useState(false)
  const [quantumActive, setQuantumActive] = useState(true)
  const [intelligenceActive, setIntelligenceActive] = useState(true)
  const [testerProfile, setTesterProfile] = useState<TesterProfile | null>(null)
  const readiness = readinessScore()

  // Purely cosmetic — reads the front-end-only tester profile (if any) to personalize
  // this panel. Never affects any calculation, recommendation, or activation state.
  useEffect(() => {
    setTesterProfile(readTesterProfile())
  }, [])

  return (
    <article className="panel wide fo-card" style={{ marginTop: 24 }}>
      <div className="module-card-top">
        <strong>Commercial layer (Package Activation System)</strong>
        {testerProfile && <small style={{ marginLeft: 8, color: 'var(--muted-foreground, #9ca3af)' }}>Signed in as {testerProfile.name}</small>}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginLeft: 'auto' }}>
          <input type="checkbox" checked={testerMode} onChange={(e) => setTesterMode(e.target.checked)} /> Tester mode
        </label>
      </div>

      <RealSubscriptionsSection />

      <div className="module-card-grid">
        <div className="module-card fo-card">
          <strong>Package analytics <small style={{ opacity: 0.55, fontWeight: 400 }}>(illustrative demo data)</small></strong>
          <ul>
            {PACKAGE_ANALYTICS.map((row) => (
              <li key={row.tier}>{row.tier}: {row.accounts} accounts · £{row.mrr.toLocaleString()} MRR</li>
            ))}
          </ul>
        </div>

        <div className="module-card fo-card">
          <strong>Pricing model comparison (QuantumOS)</strong>
          <ul>
            {(['A', 'B', 'C'] as PricingModel[]).map((model) => {
              const price = calculateAddOnPrice('quantumos', model, { tier: 'Standard', usage: { insights: 500, simulations: 40, anomalyDetections: 20, riskModels: 5, scenarioPacks: 3 } })
              return <li key={model}>{PRICING_MODEL_LABELS[model]}: £{price.amount}/mo</li>
            })}
          </ul>
        </div>

        <div className="module-card fo-card">
          <strong>AI recommendation log</strong>
          <ul>
            {RECOMMENDATION_LOGS.map((log) => (
              <li key={log.brand}>{log.brand} — <em>{log.style}</em>: {log.reason}</li>
            ))}
          </ul>
        </div>

        <div className="module-card fo-card">
          <strong>Usage projections (mocked)</strong>
          <p>Insights: {USAGE_PROJECTIONS.insights.toLocaleString()}/mo</p>
          <p>Simulations: {USAGE_PROJECTIONS.simulations.toLocaleString()}/mo</p>
          <p>Anomaly detections: {USAGE_PROJECTIONS.anomalies.toLocaleString()}/mo</p>
        </div>

        <div className="module-card fo-card">
          <strong>Module unlock map</strong>
          {MODULE_UNLOCK_MAP.map((row) => (
            <p key={row.tier}><strong>{row.tier}:</strong> {row.modules.join(', ')}</p>
          ))}
        </div>

        <div className="module-card fo-card">
          <strong>Brand health indicators</strong>
          <ul>
            {BRAND_HEALTH.slice(0, 4).map((row) => (
              <li key={row.name}>{row.name}: {row.uptime.toFixed(2)}% uptime, {row.stability}% stability</li>
            ))}
          </ul>
        </div>

        <div className="module-card fo-card">
          <strong>Add-on activation status</strong>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span className={`quantum-anomaly-dot ${quantumActive ? '' : 'inactive'}`} aria-hidden="true" />
            QuantumOS: {quantumActive ? 'Active' : 'Inactive'}
            <button type="button" className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setQuantumActive((v) => !v)}>Toggle</button>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`quantum-anomaly-dot ${intelligenceActive ? '' : 'inactive'}`} aria-hidden="true" />
            IntelligenceOS: {intelligenceActive ? 'Active' : 'Inactive'}
            <button type="button" className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setIntelligenceActive((v) => !v)}>Toggle</button>
          </label>
        </div>

        <div className="module-card fo-card">
          <strong>Commercial readiness meter</strong>
          <div className="quantum-confidence-track" aria-hidden="true">
            <div className="quantum-confidence-fill" style={{ width: `${readiness}%` }} />
          </div>
          <p>{readiness}% — demo-mode readiness (activation + recommendation signal, not a valuation figure)</p>
        </div>
      </div>

      {testerMode && (
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted-foreground, #9ca3af)' }}>
          Tester mode: showing illustrative/demo states only across the panels above — no live account data is affected.
        </p>
      )}
    </article>
  )
}

export default SuperDashCommercialPanel
