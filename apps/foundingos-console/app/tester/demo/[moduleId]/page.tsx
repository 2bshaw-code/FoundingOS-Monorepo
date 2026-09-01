/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../../session'
import { getTester, upsertTester } from '../../store.server'
import { MODULE_NARRATION, MODULE_NARRATOR_STEPS, NARRATION_PLAYER_SCRIPT, BUSINESS_PLAN_NARRATION, OPENING_NARRATOR_LINE, WELCOME_BACK_NARRATOR_LINE, DEMO_END_BELONGING_LINE, FREE_ROAM_ENTERED_LINE, EMOTIONAL_CLOSING_LINE, DEMO_INTRO, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, getFreeRoamHref, type ModuleId } from '../../tester-data'
import { GLOBAL_ACCESSIBILITY_SCRIPT } from '@foundingos/config'

export default async function TesterDemoPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester) redirect('/tester/login')
  if (tester.moduleId !== moduleId) notFound()

  // Marks the demo as viewed (first time only — never regresses a tester who has already
  // progressed past this point) and sends them on to their real survey. Demo must always
  // come before the survey now, so this is the only way forward from here.
  async function continueToSurvey() {
    'use server'
    const current = await getTester(testerId!)
    if (current && current.status === 'registered') {
      await upsertTester(testerId!, { status: 'demo-viewed' })
    }
    redirect('/tester/survey')
  }

  const isSuperDashboardDemo = moduleId === 'superdashboard-demo'
  // Real, existing FoundingOS console module pages (plus the real retail-web brand site for
  // the buyer persona) — every one of these is a genuinely active, working demo today, not a
  // placeholder. Only modules with no real page at all (operations/sales/branding/
  // console-navigation) fall through to the informational card below, which is itself the
  // real demo content for those — never a "coming later" placeholder.
  const directModuleHref =
    moduleId === 'finance' ? '/finance'
    : moduleId === 'crypto' ? '/crypto'
    : moduleId === 'marketing-suite' ? '/modules/marketing'
    : moduleId === 'accounting' ? '/modules/accounting'
    : moduleId === 'customer-service' ? '/modules/customer-service'
    : moduleId === 'messaging' ? '/modules/messaging'
    : moduleId === 'ai-automation' ? '/modules/foundai-demo'
    : moduleId === 'customer-overview' ? '/modules/customer-service'
    : moduleId === 'buyer-overview' ? 'https://retail.foundingos.com'
    : null
  const hasCompletedSurvey = tester.runs.length > 0
  // "Free Roam" here is real, read-only revisiting of whatever real page this tester's module
  // already unlocks (their own directModuleHref, or SuperDashboard read-only) — not a separate
  // /free-roam route, which doesn't exist.
  const freeRoamHref = getFreeRoamHref(moduleId)
  // Every module gets the same six-beat narrator walkthrough (intro, explanation, humour,
  // insight, mission, wrap-up) in the same warm founder-style voice; modules with no dedicated
  // detail sentence (operations/sales/branding/console-navigation) still get the full six-beat
  // treatment via the generic fallback below, so no demo is left without the narrator.
  const narratorSteps = MODULE_NARRATOR_STEPS[moduleId as ModuleId] ?? [
    { step: '1 · Intro', text: `Welcome inside the Quantum WhatsApp OS — let me show you around ${tester.moduleLabel}.` },
    { step: '2 · Explanation', text: `${BUSINESS_PLAN_NARRATION} This module, ${tester.moduleLabel}, is your assigned part of that same FoundingOS multi-brand operating system.` },
    { step: '3 · Humour', text: "This module is one of my favourites. Don't tell Guardian. Watch how IntelligenceOS reacts here — it's like magic, but with maths." },
    { step: '4 · Insight', text: "You're inside the OS now. Everything you see is live, real, and reactive — every click, every message flows straight into a BrandMetric signal, rolled into SuperDash in real time." },
    { step: '5 · Mission', text: "And here's the whole point of it, honestly: we're building the WhatsApp OS — the operating system for real human engagement. Everything you see here is designed to understand people, react to behaviour, and help brands operate in real time." },
    { step: '6 · Wrap-up', text: `That's ${tester.moduleLabel}, in a nutshell. Take your time exploring, and when you're ready, I'll walk you into a quick survey — thanks for sticking with me this far.` },
  ]
  const fullNarration = MODULE_NARRATION[moduleId as ModuleId] ?? narratorSteps.map((s) => s.text).join(' ')

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{tester.moduleLabel} demo</h1>
        <span>
          {hasCompletedSurvey
            ? `Revisiting your assigned module demo for ${tester.moduleLabel}.`
            : `Explore your assigned module demo before starting your ${tester.moduleLabel} survey.`}
        </span>
      </header>

      <div className="module-card-grid">
        {tester.status === 'registered' ? (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>👋</span><strong>Welcome</strong></div>
            <div className="quantum-narrator-panel">
              <p>{OPENING_NARRATOR_LINE}</p>
            </div>
          </article>
        ) : (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>👋</span><strong>Welcome back</strong></div>
            <div className="quantum-narrator-panel">
              <p>{WELCOME_BACK_NARRATOR_LINE}</p>
            </div>
          </article>
        )}

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
          <p>{DEMO_INTRO}</p>
        </article>

        <article className="module-card fo-card quantum-frame" data-narration={fullNarration}>
          <div className="module-card-top"><span>🔊</span><strong>Your narrator</strong></div>
          <div className="quantum-narrator-panel">
            <p>Welcome inside the Quantum WhatsApp OS — hit play any time and I'll walk you through the whole thing.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary quantum-btn" data-narrate-btn>▶ Play narration</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" id="demo-autoplay-toggle" />
              Auto-play next time
            </label>
          </div>
        </article>

        {narratorSteps.map((beat) => (
          <article key={beat.step} className="module-card fo-card quantum-frame">
            <div className="module-card-top">
              <span className="quantum-step-badge">{beat.step.split(' · ')[0]}</span>
              <strong>{beat.step.split(' · ')[1]}</strong>
            </div>
            <div className="quantum-narrator-panel">
              <p>{beat.text}</p>
            </div>
          </article>
        ))}

        {isSuperDashboardDemo ? (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>◈</span><strong>SuperDashboard (read-only)</strong></div>
            <p>View the FounderOS cross-brand intelligence layer in read-only mode.</p>
            <Link className="btn btn-primary quantum-btn" href="/superdashboard?readOnly=1">Open SuperDashboard</Link>
          </article>
        ) : directModuleHref ? (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>Open the {tester.moduleLabel} module inside FounderOS.</p>
            <Link className="btn btn-primary quantum-btn" href={directModuleHref}>Open {tester.moduleLabel}</Link>
          </article>
        ) : (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>This is your assigned {tester.moduleLabel} module overview for this tester program.</p>
          </article>
        )}

        {!hasCompletedSurvey && (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>→</span><strong>Ready for your survey?</strong></div>
            <p>Once you've explored the demo above, continue to your tailored {tester.moduleLabel} survey.</p>
            <p><small>{DEMO_END_BELONGING_LINE}</small></p>
            <form action={continueToSurvey}>
              <button type="submit" className="btn btn-primary quantum-btn">Continue to survey</button>
            </form>
          </article>
        )}
      </div>

      {hasCompletedSurvey && (
        <div className="stack" style={{ marginTop: 24 }}>
          <div className="quantum-narrator-panel">
            <p>{FREE_ROAM_INVITE_LINES[0]}</p>
            <p>{FREE_ROAM_INVITE_LINES[1]} {FREE_ROAM_INVITE_LINES[2]}</p>
            <p><small>{FREE_ROAM_TIPS.join(' ')}</small></p>
          </div>
          <Link href={freeRoamHref} className="quantum-freeroam-box">
            <strong data-simple-label="Explore Now">Jump Into Free Roam — Explore the Quantum WhatsApp OS</strong>
            <small>{FREE_ROAM_ENTERED_LINE} Read-only exploration of your unlocked module — nothing you click can break anything.</small>
          </Link>
          <div className="quantum-narrator-panel">
            <p>{EMOTIONAL_CLOSING_LINE}</p>
          </div>
        </div>
      )}
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
    </section>
  )
}
