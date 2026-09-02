/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../session'
import { QuantumSphereLogo } from '@foundingos/ui'

// A real, written reference — not a narrated demo. Every fact here is grounded in real,
// already-shipped systems documented elsewhere in this file/app (modules, CRM, FoundAI,
// narrator/audio, Package Model D, SuperDash/Guardian/Autonomous) — nothing invented.
// Viewable by any signed-in tester or admin (not gated to one assigned module, since this is
// meant to be a shared library of knowledge, not a per-tester demo).
export default async function BrandUserGuidePage() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const isAdmin = adminToken ? (await verifyToken('admin', adminToken)) === 'super-founder-admin' : false
  if (!isAdmin) {
    const token = cookies().get(SESSION_COOKIE)?.value
    const testerId = token ? await verifyToken('tester', token) : null
    if (!testerId) redirect('/tester/login')
  }

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Library</p>
        <h1>Brand User Guide</h1>
        <span>A real reference for running your brand on FoundingOS — modules, CRM, FoundAI, pricing, and how it all fits together.</span>
      </header>

      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>1</span><strong>Getting started</strong></div>
          <p>Sign in with your email and access code, accept the legal terms once, and you land on the Switcher Hub — the full list of every demo, survey, and Free Roam. Pick anything; nothing here is a one-way door.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>2</span><strong>Your brand console</strong></div>
          <p>Every brand — Retail, Meat, Logistics, Talent, Crypto, Finance, Health, and FoundThat — runs the same real console shape: a dashboard, an Intelligence panel, Settings, and a shared set of modules. Learn one console and you know them all.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>3</span><strong>Modules</strong></div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            <li><strong>Marketing Suite</strong> — campaigns, sends, and analytics in one real module (not separate tools).</li>
            <li><strong>Accounting</strong> — invoices, revenue, and financial health.</li>
            <li><strong>Messaging</strong> — conversations, templates, and automation across channels.</li>
            <li><strong>Customer Service</strong> — tickets, SLAs, and satisfaction.</li>
            <li><strong>AI Automation</strong> — the FoundAI-powered workflow module.</li>
          </ul>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>4</span><strong>CRM</strong></div>
          <p>One real relationship board per brand — contacts, companies, deals, pipeline, notes, tasks, and activity. It's a direct-access working tool (not a scripted demo), reachable from your console's sidebar or the Switcher Hub's CRM Demo link.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>5</span><strong>FoundAI, your assistant</strong></div>
          <p>The chat bubble in the bottom-right of every real page. It already knows which brand and page you're on, offers suggested prompts and smart actions relevant to that context, and can answer real questions about CRM, invoices, marketing, Package Model D, SuperDash, and more. Text-based by default; it can also read one of its short, lighthearted "FoundAI story" lines aloud if you click that action.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>6</span><strong>Narrator &amp; audio</strong></div>
          <p>Every guided demo has a short, human-voiced narrator line per step (never a long script). The separate "Audio: ON/OFF" button controls whether narration is ever spoken aloud — it defaults OFF, and turning it on only affects your own session. When it's on, 15 seconds after a page loads it will speak that page's first line once; every other line only plays when you click its own narrate button.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>7</span><strong>SuperDash, Guardian &amp; Autonomous</strong></div>
          <p>These sit above the brand layer (mainly for admin/investor view, though every demo explains them): SuperDash rolls every brand's real engagement and scraper health into one live view; Guardian keeps each brand's data in its own lane and flags anomalies; Autonomous reacts to real signals (auto-optimize or auto-coach) without a human needing to click anything.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>8</span><strong>Package Model D — pricing</strong></div>
          <p>SystemOS, IntelligenceOS, and QuantumOS base tiers, plus one industry pack per brand (e.g. RetailOS, CryptoOS). This is a real, informational pricing catalog — there's no payment processor wired up yet, so nothing here is ever charged automatically.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>◆</span><strong>Want the full guided tour?</strong></div>
          <p>The Complete FoundingOS Tour walks through everything on this page as a real, 8-step narrated demo — start there if you'd rather explore step by step than read.</p>
          <Link className="btn btn-secondary quantum-btn" href="/tester/dashboard">Back to the Switcher Hub</Link>
        </article>
      </div>
    </section>
  )
}
