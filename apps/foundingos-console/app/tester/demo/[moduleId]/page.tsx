/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../../session'
import { getTester, upsertTester } from '../../store.server'
import { MODULE_NARRATION, MODULE_NARRATOR_STEPS, NARRATION_PLAYER_SCRIPT, BUSINESS_PLAN_NARRATION, OPENING_NARRATOR_LINE, TESTER_INSTRUCTION_CARD, WELCOME_BACK_NARRATOR_LINE, WELCOME_BACK_SOFT_LINE, DEMO_END_BELONGING_LINE, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, DEMO_INTRO, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, getFreeRoamHref, categorizeCredential, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, BRAND_ROW_NARRATOR_LINE, type ModuleId } from '../../tester-data'
import { GLOBAL_ACCESSIBILITY_SCRIPT, brands } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'

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
  // Every module gets the same practical six-beat walkthrough (what it does, how to use it,
  // what happens, behind the scenes, a real example, summary) with a short reactive narrator
  // voice-line per beat; modules with no dedicated detail sentence (operations/sales/branding/
  // console-navigation) still get the full treatment via the generic fallback below, so no demo
  // is left without the narrator.
  const narratorSteps = MODULE_NARRATOR_STEPS[moduleId as ModuleId] ?? [
    { step: '1 · What it does', text: "Alright, here's the fun part.", detail: `${tester.moduleLabel}: your assigned part of the FoundingOS multi-brand operating system.` },
    { step: '2 · How to use it', text: 'Let me walk you through it.', detail: `Open ${tester.moduleLabel} below and try whatever's on screen — it's all real and clickable.` },
    { step: '3 · What happens', text: 'Watch what happens next.', detail: `Every action in ${tester.moduleLabel} updates its numbers live — nothing here is a static screenshot.` },
    { step: '4 · Behind the scenes', text: "Here's the clever part.", detail: 'That same activity becomes a BrandMetric signal — Guardian keeps it in its own lane, Autonomous reacts to it, and SuperDash rolls it up live.' },
    { step: '5 · A real example', text: 'Nice — that worked perfectly.', detail: `Try one real action in ${tester.moduleLabel} now — you'll see it reflected the moment you use it.` },
    { step: '6 · Summary', text: "That's the gist — nice work.", detail: `That's ${tester.moduleLabel}, in short. Your survey's up next.` },
  ]
  const fullNarration = MODULE_NARRATION[moduleId as ModuleId] ?? narratorSteps.map((s) => s.text).join(' ')
  const switcherOptions = buildSwitcherOptions(categorizeCredential(testerId))

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
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
          <>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>👋</span><strong>Welcome</strong></div>
              <div className="quantum-narrator-panel">
                <p>{OPENING_NARRATOR_LINE}</p>
              </div>
            </article>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>ℹ</span><strong>{TESTER_INSTRUCTION_CARD.title}</strong></div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                {TESTER_INSTRUCTION_CARD.lines.map((line) => (
                  <li key={line}><small>{line}</small></li>
                ))}
              </ul>
              <div className="quantum-narrator-panel">
                <p>{TESTER_INSTRUCTION_CARD.narratorLine}</p>
              </div>
            </article>
          </>
        ) : (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>👋</span><strong>Welcome back</strong></div>
            <div className="quantum-narrator-panel">
              <p>{tester.status === 'complete' ? WELCOME_BACK_SOFT_LINE : WELCOME_BACK_NARRATOR_LINE}</p>
            </div>
          </article>
        )}

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
          <p>{DEMO_INTRO}</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>◈</span><strong>The business plan, in short</strong></div>
          <p>{BUSINESS_PLAN_NARRATION}</p>
        </article>

        <article className="module-card fo-card quantum-frame" data-narration={fullNarration}>
          <div className="module-card-top"><span>🔊</span><strong>Your narrator</strong></div>
          <div className="quantum-narrator-panel">
            <p>Alright, let's dive in.</p>
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
            <p>{beat.detail}</p>
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
            <p>{FREE_ROAM_UNLOCK_LINE}</p>
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

      <article className="module-card fo-card quantum-frame" style={{ marginTop: 24 }}>
        <div className="module-card-top"><span>🧭</span><strong>{SWITCHER_PANEL_TITLE}</strong></div>
        <div className="quantum-narrator-panel">
          <p>{SWITCHER_PANEL_NARRATOR_LINE}</p>
        </div>
        <form data-switcher-form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            {switcherOptions.map((option) => (
              <div key={option.code} data-code={option.code} data-href={option.href} data-available={String(option.available)} data-note={option.note ?? ''}>
                {option.available ? (
                  <Link href={option.href} className="btn btn-secondary quantum-btn" style={{ width: '100%', justifyContent: 'flex-start' }}>{option.code} · {option.label}</Link>
                ) : (
                  <div className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', opacity: 0.5, cursor: 'default' }}>
                    {option.code} · {option.label} <small style={{ marginLeft: 6 }}>({option.note})</small>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" data-switcher-code placeholder="Enter a code (e.g. R1, M1, S1)" style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} />
            <button type="submit" className="btn btn-primary quantum-btn">Go</button>
          </div>
          <p data-switcher-message><small></small></p>
        </form>
      </article>

      <div className="quantum-narrator-panel">
        <p>{BRAND_ROW_NARRATOR_LINE}</p>
      </div>
      <div className="quantum-brand-row">
        {(['foundingos', 'retail', 'meat', 'talent', 'crypto', 'foundthat'] as const).map((slug) => (
          <a key={slug} href={brands[slug].webUrl} className="quantum-brand-card" style={{ ['--brand-glow' as string]: brands[slug].accent }}>
            <span className="quantum-brand-card-dot" />
            {brands[slug].name}
          </a>
        ))}
      </div>

      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
    </section>
  )
}
