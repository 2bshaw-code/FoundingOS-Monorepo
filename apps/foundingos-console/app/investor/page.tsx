/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../tester/session'
import { getTester, upsertTester, getOrCreateAdminTester } from '../tester/store.server'
import { categorizeCredential, INVESTOR_NARRATOR_STEPS, NARRATION_PLAYER_SCRIPT, OPENING_NARRATOR_LINE, TESTER_INSTRUCTION_CARD, WELCOME_BACK_NARRATOR_LINE, WELCOME_BACK_SOFT_LINE, DEMO_END_BELONGING_LINE, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, SURVEY_COMPLETE_CELEBRATION_LINE, DEMO_INTRO, BUSINESS_PLAN_FACTS, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, SURVEY_COMPLETE_NARRATOR_LINE, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, BRAND_ROW_NARRATOR_LINE, PLATFORM_CAPABILITIES, INVESTOR_EVIDENCE_REQUIRED, adminTesterId, SUPER_FOUNDER_ADMIN_EMAIL, type CredentialCategory, SUITE_ROW } from '../tester/tester-data'
import { GLOBAL_ACCESSIBILITY_SCRIPT } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'
import { DemoWizard } from '../tester/demo/DemoWizard'

const ADMIN_INVESTOR_MODULE_ID = 'investor-overview'

// Real, read-only Investor briefing — what FoundingOS is and does today, plus the evidence
// checklist a valuation needs. Gated to sessions whose credential category is genuinely 'investor'
// (INV-ALPHA / INV-OMEGA), or the real Super Founder Admin (see tester-data.ts's
// adminTesterId doc comment — never the separate passcode-only /tester/admin reviewer).
// Investors get a dedicated two-phase sequence — briefing (the business-plan narration),
// then demo (the platform capabilities) — before the survey unlocks, matching the explicit
// "briefing → demo → survey" investor flow (one step more than the plain tester sequence).
// Admin gets the exact same two-phase flow, with its own real progress under its own email.
export default async function InvestorPage() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isSuperFounderAdminSession = adminId === 'super-founder-admin'

  let testerId: string
  let tester: Awaited<ReturnType<typeof getTester>>
  let category: CredentialCategory
  if (isSuperFounderAdminSession) {
    testerId = adminTesterId(ADMIN_INVESTOR_MODULE_ID)
    tester = await getOrCreateAdminTester(testerId, ADMIN_INVESTOR_MODULE_ID, 'Investor Briefing', 'survey-investor', SUPER_FOUNDER_ADMIN_EMAIL)
    category = 'admin'
  } else {
    const token = cookies().get(SESSION_COOKIE)?.value
    const realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) redirect('/tester/login')
    testerId = realTesterId

    tester = await getTester(testerId)
    if (!tester || categorizeCredential(testerId) !== 'investor') redirect('/tester/login')
    category = 'investor'
  }

  // Only force the investor into the survey while it's genuinely still outstanding
  // ('demo-viewed' or mid-run 'in-progress'). Once a run is submitted, status becomes
  // 'complete' — at that point this page renders again (the live-data phase) so the Quantum
  // Free Roam invitation has a real place to live, instead of bouncing back to the survey.
  if (tester.status === 'demo-viewed' || tester.status === 'in-progress') {
    redirect(isSuperFounderAdminSession ? `/tester/survey?moduleId=${ADMIN_INVESTOR_MODULE_ID}` : '/tester/survey')
  }

  async function continueToDemo() {
    'use server'
    const current = await getTester(testerId)
    if (current && current.status === 'registered') {
      await upsertTester(testerId, { status: 'briefing-viewed' })
    }
    redirect('/investor')
  }

  async function continueToSurvey() {
    'use server'
    const current = await getTester(testerId)
    if (current && (current.status === 'registered' || current.status === 'briefing-viewed')) {
      await upsertTester(testerId, { status: 'demo-viewed' })
    }
    redirect(isSuperFounderAdminSession ? `/tester/survey?moduleId=${ADMIN_INVESTOR_MODULE_ID}` : '/tester/survey')
  }

  const isBriefingPhase = tester.status === 'registered'
  const hasCompletedSurvey = tester.runs.length > 0
  const switcherOptions = buildSwitcherOptions(category)


  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FoundingOS Investor {isBriefingPhase ? 'Briefing' : 'Demo'}</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Read-only FoundingOS platform briefing — what it is, what it does today, and the evidence behind it.</span>
      </header>

      {isBriefingPhase ? (
        <>
          <div className="quantum-audio-bar">
            <button type="button" data-audio-toggle suppressHydrationWarning>🔊 Audio: ON</button>
            <label>
              <input type="checkbox" id="narrator-enabled-toggle" defaultChecked />
              Narrator text: ON / OFF
            </label>
          </div>

          <div className="quantum-demo-hero">
            <DemoWizard steps={INVESTOR_NARRATOR_STEPS} />
          </div>

          <div className="module-card-grid" style={{ marginTop: 16 }}>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>→</span><strong>Ready for the live demo?</strong></div>
              <p>Once you've reviewed the briefing above, continue to the platform walkthrough.</p>
              <p><small>{DEMO_END_BELONGING_LINE}</small></p>
              <form action={continueToDemo}>
                <button type="submit" className="btn btn-primary quantum-btn">Continue to demo</button>
              </form>
            </article>
          </div>

          <p className="quantum-demo-secondary-label">More about this briefing</p>
          <div className="module-card-grid">
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

            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
              <p>{DEMO_INTRO}</p>
            </article>

            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>◈</span><strong>The business plan, in short</strong></div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                {BUSINESS_PLAN_FACTS.map((fact) => (
                  <li key={fact}><small>{fact}</small></li>
                ))}
              </ul>
            </article>
          </div>
        </>
      ) : (
        <>
          <div className="module-card-grid">
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>👋</span><strong>Welcome back</strong></div>
              <div className="quantum-narrator-panel">
                <p>{tester.status === 'complete' ? WELCOME_BACK_SOFT_LINE : WELCOME_BACK_NARRATOR_LINE}</p>
              </div>
            </article>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>🔊</span><strong>Your narrator</strong></div>
              <div className="quantum-narrator-panel">
                <p>This is what FoundingOS does today. Every capability below is live in the web and mobile apps — traction figures are shared by the founder, never staged here.</p>
              </div>
            </article>
          </div>

          <div className="console-grid">
            <article className="panel wide fo-card quantum-frame">
              <h2>What FoundingOS does today</h2>
              <div className="module-card-grid">
                {PLATFORM_CAPABILITIES.map((item) => (
                  <article className="module-card fo-card" key={item.title}>
                    <div className="module-card-top"><span>◈</span><strong>{item.title}</strong></div>
                    <p><small>{item.detail}</small></p>
                  </article>
                ))}
              </div>
            </article>
            <article className="panel wide fo-card quantum-frame">
              <h2>Traction and valuation evidence</h2>
              <p><small>A valuation depends on these figures. They come from SuperDash and Stripe and are provided by the founder on request — this briefing does not invent or estimate them.</small></p>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                {INVESTOR_EVIDENCE_REQUIRED.map((item) => <li key={item}><small>{item}</small></li>)}
              </ul>
            </article>
          </div>

          {hasCompletedSurvey ? (
            <div className="stack" style={{ marginTop: 24 }}>
              <div className="quantum-narrator-panel">
                <p>{FREE_ROAM_UNLOCK_LINE}</p>
                <p>{SURVEY_COMPLETE_NARRATOR_LINE}</p>
                <p>{SURVEY_COMPLETE_CELEBRATION_LINE}</p>
                <p>{FREE_ROAM_INVITE_LINES[0]}</p>
                <p>{FREE_ROAM_INVITE_LINES[1]} {FREE_ROAM_INVITE_LINES[2]}</p>
                <p><small>{FREE_ROAM_TIPS.join(' ')}</small></p>
              </div>
              <Link href="/superdashboard?readOnly=1" className="quantum-freeroam-box">
                <strong data-simple-label="Explore Now">Jump Into Free Roam — Explore FoundingOS</strong>
                <small>{FREE_ROAM_ENTERED_LINE} Read-only exploration of SuperDash — nothing you click can break anything.</small>
              </Link>
              <div className="quantum-narrator-panel">
                <p>{EMOTIONAL_CLOSING_LINE}</p>
              </div>

              <article className="module-card fo-card quantum-frame">
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
                    <input type="text" data-switcher-code placeholder="Enter a code (e.g. R1, M1, S4)" style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} />
                    <button type="submit" className="btn btn-primary quantum-btn">Go</button>
                  </div>
                  <p data-switcher-message><small></small></p>
                </form>
              </article>
            </div>
          ) : (
            <div className="module-card-grid">
              <article className="module-card fo-card quantum-frame">
                <div className="module-card-top"><span>→</span><strong>Ready for the investor survey?</strong></div>
                <p>Once you've reviewed the platform above, continue to the investor survey.</p>
                <p><small>{DEMO_END_BELONGING_LINE}</small></p>
                <form action={continueToSurvey}>
                  <button type="submit" className="btn btn-primary quantum-btn">Continue to survey</button>
                </form>
              </article>
            </div>
          )}
        </>
      )}
      <div className="quantum-narrator-panel">
        <p>{BRAND_ROW_NARRATOR_LINE}</p>
      </div>
      <div className="quantum-brand-row">
        {SUITE_ROW.map((suite) => (
          <a key={suite.name} href={suite.href} className="quantum-brand-card" style={{ ['--brand-glow' as string]: suite.accent }}>
            <span className="quantum-brand-card-dot" />
            {suite.name}
          </a>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
    </section>
  )
}
