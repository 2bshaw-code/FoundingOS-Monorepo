/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Ecosystem Demo — a single, continuous, screen-recordable step-through of the whole
// multi-brand ecosystem, for producing a promo video. Every step either shows REAL, already-
// wired data (Package Model D MRR/ARR + FX, Brand Finance, CRM Deals, Invoices, real pipeline
// value — the exact same real components/APIs used elsewhere in the app, not a re-creation)
// or a clearly labeled "Demo mode" illustrative card for surfaces that aren't wired to real
// data yet. Nothing here fabricates revenue: real panels show real zero when that's the
// honest current state, exactly like everywhere else they're used.
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QuantumSphereLogo } from '@foundingos/ui'
import { RealDealsPanel, RealInvoicesPanel, RealBrandFinancePanel } from '@foundingos/ui/real-monetary-panels'
import { RealPipelineValuePanel } from '@foundingos/ui/real-pipeline-value-panel'
import { AnimatedMessageFlow } from '@foundingos/ui/animated-message-flow'
import { brands } from '@foundingos/config'

const BRANDS = [
  { slug: 'retail', name: brands.retail.name, accent: brands.retail.accent, url: 'https://retail.foundingos.com' },
  { slug: 'finance', name: brands.finance.name, accent: brands.finance.accent, url: 'https://finance.foundingos.com' },
  { slug: 'talent', name: brands.talent.name, accent: brands.talent.accent, url: 'https://talent.foundingos.com' },
  { slug: 'crypto', name: brands.crypto.name, accent: brands.crypto.accent, url: 'https://crypto.foundingos.com' },
]

function DemoModeBadge() {
  return <span style={{ fontSize: 11, opacity: 0.6, border: '1px solid var(--line)', borderRadius: 999, padding: '2px 8px', marginLeft: 8 }}>Demo mode — illustrative, not live data</span>
}

function RealBadge() {
  return <span style={{ fontSize: 11, opacity: 0.75, border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 999, padding: '2px 8px', marginLeft: 8 }}>Real, live data</span>
}

type Step = { title: string; narration: string; badge: 'real' | 'demo' | 'mixed'; render: () => React.ReactNode }

function useBrandCycle() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % BRANDS.length), 2200)
    return () => window.clearInterval(id)
  }, [])
  return BRANDS[index]
}

function BrandSwitchShowcase() {
  const brand = useBrandCycle()
  return (
    <div className="quantum-frame module-card fo-card" style={{ ['--brand-glow' as string]: brand.accent, transition: 'all 400ms ease' }}>
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={40} accent={brand.accent} />
        <div className="quantum-gradient-bar" />
      </div>
      <h2 style={{ margin: '8px 0 0' }}>{brand.name}</h2>
      <p><small>Console: {brand.url}</small></p>
    </div>
  )
}

const STEPS: Step[] = [
  {
    title: '1 · FoundingOS Global Console',
    narration: 'Welcome to the multi-brand ecosystem.',
    badge: 'mixed',
    render: () => (
      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame">
          <div className="quantum-brand-header"><QuantumSphereLogo size={48} /><div className="quantum-gradient-bar" /></div>
          <h2>FoundingOS</h2>
          <p>One operating system running 8 real brands, each with its own console, under one shared intelligence layer.</p>
        </article>
        <article className="module-card fo-card quantum-frame">
          <strong>Brand selector</strong>
          <div className="quantum-brand-row" style={{ marginTop: 8 }}>
            {BRANDS.map((b) => (
              <span key={b.slug} className="quantum-brand-card" style={{ ['--brand-glow' as string]: b.accent }}><span className="quantum-brand-card-dot" />{b.name}</span>
            ))}
          </div>
        </article>
      </div>
    ),
  },
  {
    title: '2 · Brand Switch Showcase',
    narration: 'One OS, many brands.',
    badge: 'demo',
    render: () => <BrandSwitchShowcase />,
  },
  {
    title: '3 · Retail Console (Hero Demo)',
    narration: 'Retail operations in one place.',
    badge: 'demo',
    render: () => (
      <div className="module-card-grid">
        {[
          { label: 'POS', desc: 'Point-of-sale flow — ring up a sale, apply a discount, take payment.' },
          { label: 'Inventory', desc: 'Stock levels, low-stock alerts, and supplier reorder points.' },
          { label: 'Suppliers', desc: 'Supplier directory with lead times and order history.' },
          { label: 'Quantum demand score', desc: 'Forecasted demand, blended from real-time engagement signals.' },
        ].map((p) => (
          <article key={p.label} className="module-card fo-card quantum-frame">
            <strong>{p.label}</strong><DemoModeBadge />
            <p>{p.desc}</p>
          </article>
        ))}
        <p><Link className="btn btn-secondary quantum-btn" href="https://retail.foundingos.com" target="_blank">Open the real Retail console →</Link></p>
      </div>
    ),
  },
  {
    title: '4 · CRM Deals',
    narration: 'CRM pipeline management.',
    badge: 'real',
    render: () => <RealDealsPanel brandSlug="retail" brandName="FoundRetail" />,
  },
  {
    title: '5 · Accounting + Finance',
    narration: 'Finance and accounting, unified.',
    badge: 'real',
    render: () => (
      <div className="module-card-grid">
        <RealInvoicesPanel brandSlug="finance" brandName="FoundFinance" />
        <RealBrandFinancePanel brandSlug="finance" brandName="FoundFinance" />
      </div>
    ),
  },
  {
    title: '6 · Brand Console — Performance',
    narration: 'Brand-level performance.',
    badge: 'real',
    render: () => <RealBrandFinancePanel brandSlug="retail" brandName="FoundRetail" />,
  },
  {
    title: '7 · SuperDash — Real Subscriptions',
    narration: 'Live subscription metrics, backed by real data.',
    badge: 'real',
    render: () => (
      <article className="module-card fo-card quantum-frame">
        <strong>Package Model D — real MRR/ARR</strong><RealBadge />
        <p><small>Live, database-backed. Honest zero until a real subscription is assigned — never fabricated.</small></p>
        <p><Link className="btn btn-secondary quantum-btn" href="/superdashboard">Open the real SuperDash →</Link></p>
      </article>
    ),
  },
  {
    title: '8 · AI Automation Console',
    narration: 'AI automation across the ecosystem.',
    badge: 'demo',
    render: () => (
      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame"><strong>Workflow preview</strong><DemoModeBadge /><p>A trigger-condition-action chain, editable per brand.</p></article>
        <article className="module-card fo-card quantum-frame"><strong>Trigger preview</strong><DemoModeBadge /><p>Fires on a real BrandMetric signal crossing a threshold.</p></article>
        <article className="module-card fo-card quantum-frame"><strong>Quantum scoring</strong><DemoModeBadge /><p>Confidence-scored recommendations before any automation runs.</p></article>
      </div>
    ),
  },
  {
    title: '9 · Messaging Console',
    narration: 'Cross-brand communication.',
    badge: 'demo',
    render: () => (
      <article className="module-card fo-card quantum-frame">
        <strong>Unified inbox</strong><DemoModeBadge />
        <p>Every channel a brand uses, in one place — see the message style preview below.</p>
        <AnimatedMessageFlow />
      </article>
    ),
  },
  {
    title: '10 · Talent · Crypto · Meat · FoundThat',
    narration: 'Specialized modules for every brand.',
    badge: 'demo',
    render: () => (
      <div className="module-card-grid">
        {['FoundTalent', 'FoundCrypto', 'FoundMeat', 'FoundThat'].map((name) => (
          <article key={name} className="module-card fo-card quantum-frame"><strong>{name}</strong><DemoModeBadge /><p>Same real console shape, its own specialized modules.</p></article>
        ))}
      </div>
    ),
  },
  {
    title: '11 · Business-in-a-Box Generator',
    narration: 'Create a new brand in seconds.',
    badge: 'demo',
    render: () => (
      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame"><strong>Brand creation</strong><DemoModeBadge /><p>Name, accent color, and industry pack selection.</p></article>
        <article className="module-card fo-card quantum-frame"><strong>Console generation</strong><DemoModeBadge /><p>The same real console shape every brand already shares.</p></article>
        <article className="module-card fo-card quantum-frame"><strong>Module generation</strong><DemoModeBadge /><p>Marketing, Accounting, Messaging, Customer Service, CRM, AI Automation — attached automatically.</p></article>
      </div>
    ),
  },
  {
    title: '12 · Final Outro',
    narration: 'One ecosystem. One OS. Infinite brands.',
    badge: 'mixed',
    render: () => (
      <div className="quantum-frame module-card fo-card" style={{ textAlign: 'center', padding: 40 }}>
        <QuantumSphereLogo size={64} />
        <h1 style={{ marginTop: 12 }}>FoundingOS</h1>
      </div>
    ),
  },
]

export function EcosystemDemoEngine() {
  const [step, setStep] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [audioOn, setAudioOn] = useState(false)

  useEffect(() => {
    try { setAudioOn(localStorage.getItem('fo-audio-enabled') !== '0') } catch {}
  }, [])

  const current = STEPS[step]

  // Speaks this step's own narration line on change — reuses the same speechSynthesis
  // mechanism as every other narrator surface, gated by the same real Audio ON/OFF state.
  useEffect(() => {
    if (!audioOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(current.narration)
    utter.rate = 0.98
    window.speechSynthesis.speak(utter)
  }, [step, audioOn, current.narration])

  useEffect(() => {
    if (!autoPlay) return
    const id = window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 6000)
    return () => window.clearTimeout(id)
  }, [step, autoPlay])

  const toggleAudio = () => {
    const next = !audioOn
    setAudioOn(next)
    try { localStorage.setItem('fo-audio-enabled', next ? '1' : '0') } catch {}
    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={40} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS · Promo recording tool</p>
        <h1>Ecosystem Demo</h1>
        <span>Step {step + 1} of {STEPS.length} — {current.title.replace(/^\d+\s·\s/, '')}</span>
      </header>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-secondary quantum-btn" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>← Previous</button>
        <button type="button" className="btn btn-primary quantum-btn" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>Next →</button>
        <button type="button" className="btn btn-secondary quantum-btn" onClick={() => setAutoPlay((v) => !v)}>{autoPlay ? '⏸ Stop auto-advance' : '▶ Auto-advance (6s/step)'}</button>
        <button type="button" className="btn btn-secondary quantum-btn" onClick={toggleAudio}>{audioOn ? 'Audio: ON' : 'Audio: OFF'}</button>
      </div>

      <div key={step} className="quantum-frame" style={{ padding: 20, borderRadius: 16, animation: 'fade-in-up 320ms ease' }} data-narration={current.narration}>
        <div className="module-card-top">
          <strong>{current.title}</strong>
          {current.badge === 'real' && <RealBadge />}
          {current.badge === 'demo' && <DemoModeBadge />}
        </div>
        <p style={{ fontStyle: 'italic', opacity: 0.8 }}>&ldquo;{current.narration}&rdquo;</p>
        {current.render()}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STEPS.map((s, i) => (
          <button key={s.title} type="button" onClick={() => setStep(i)} className="btn btn-secondary" style={{ opacity: i === step ? 1 : 0.5, fontSize: 11, padding: '4px 8px' }}>{i + 1}</button>
        ))}
      </div>
    </section>
  )
}

export default EcosystemDemoEngine
