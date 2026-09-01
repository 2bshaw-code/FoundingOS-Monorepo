/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../tester/session'
import { getTester, upsertTester } from '../tester/store.server'
import { categorizeCredential, INVESTOR_NARRATION, INVESTOR_NARRATOR_STEPS, NARRATION_PLAYER_SCRIPT, OPENING_NARRATOR_LINE, TESTER_INSTRUCTION_CARD, WELCOME_BACK_NARRATOR_LINE, WELCOME_BACK_SOFT_LINE, DEMO_END_BELONGING_LINE, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, SURVEY_COMPLETE_CELEBRATION_LINE, DEMO_INTRO, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, SURVEY_COMPLETE_NARRATOR_LINE, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT } from '../tester/tester-data'
import { GLOBAL_ACCESSIBILITY_SCRIPT, brands as brandRegistry } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'
import { readBrandMetrics } from '../superdashboard/brand-metric-store.server'

// Real, read-only Investor briefing — reuses the same live BrandMetric data that powers
// SuperDashboard, gated to sessions whose credential category is genuinely 'investor'
// (INV-ALPHA / INV-OMEGA). No write actions, no Guardian/Autonomous internals exposed.
// Investors get a dedicated two-phase sequence — briefing (the business-plan narration),
// then demo (the live cross-brand data) — before the survey unlocks, matching the explicit
// "briefing → demo → survey" investor flow (one step more than the plain tester sequence).
export default async function InvestorPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester || categorizeCredential(testerId) !== 'investor') redirect('/tester/login')

  // Only force the investor into the survey while it's genuinely still outstanding
  // ('demo-viewed' or mid-run 'in-progress'). Once a run is submitted, status becomes
  // 'complete' — at that point this page renders again (the live-data phase) so the Quantum
  // Free Roam invitation has a real place to live, instead of bouncing back to the survey.
  if (tester.status === 'demo-viewed' || tester.status === 'in-progress') redirect('/tester/survey')

  async function continueToDemo() {
    'use server'
    const current = await getTester(testerId!)
    if (current && current.status === 'registered') {
      await upsertTester(testerId!, { status: 'briefing-viewed' })
    }
    redirect('/investor')
  }

  async function continueToSurvey() {
    'use server'
    const current = await getTester(testerId!)
    if (current && (current.status === 'registered' || current.status === 'briefing-viewed')) {
      await upsertTester(testerId!, { status: 'demo-viewed' })
    }
    redirect('/tester/survey')
  }

  const isBriefingPhase = tester.status === 'registered'
  const hasCompletedSurvey = tester.runs.length > 0
  const switcherOptions = buildSwitcherOptions('investor')

  const brands = isBriefingPhase ? [] : await readBrandMetrics()
  const totalEngagement = brands.reduce((sum, brand) => sum + brand.totalEngagement, 0)

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FoundingOS Investor {isBriefingPhase ? 'Briefing' : 'Demo'}</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Read-only cross-brand engagement overview — live data, no admin actions.</span>
      </header>

      {isBriefingPhase ? (
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

          <article className="module-card fo-card quantum-frame" data-narration={INVESTOR_NARRATION}>
            <div className="module-card-top"><span>🔊</span><strong>Your narrator — the FoundingOS story</strong></div>
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

          {INVESTOR_NARRATOR_STEPS.map((beat) => (
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

          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>→</span><strong>Ready for the live demo?</strong></div>
            <p>Once you've reviewed the briefing above, continue to the live cross-brand data demo.</p>
            <p><small>{DEMO_END_BELONGING_LINE}</small></p>
            <form action={continueToDemo}>
              <button type="submit" className="btn btn-primary quantum-btn">Continue to demo</button>
            </form>
          </article>
        </div>
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
                <p>You're inside the OS now — this is the live data behind everything I just told you about. Nothing's staged, nothing's illustrative. Take a look.</p>
              </div>
            </article>
          </div>
          <div className="kpi-grid">
            <article className="dashboard-card fo-card good">
              <span>◈</span>
              <strong>{brands.length}</strong>
              <small>Brands reporting live data</small>
            </article>
            <article className="dashboard-card fo-card good">
              <span>Σ</span>
              <strong data-locale-number={totalEngagement}>{totalEngagement}</strong>
              <small>Total engagement (all brands) — shown in your local number format</small>
            </article>
          </div>

          <div className="console-grid">
            <article className="panel wide fo-card quantum-frame">
              <h2>Brand engagement — live, unfiltered SuperDash data</h2>
              <table className="superdashboard-brand-table">
                <thead>
                  <tr><th>Brand</th><th>Total engagement</th><th>Anomaly score</th><th>Last updated</th></tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.brandName}>
                      <td>{brand.brandName}</td>
                      <td data-locale-number={brand.totalEngagement}>{brand.totalEngagement}</td>
                      <td data-locale-number={brand.anomalyScore}>{brand.anomalyScore.toFixed(2)}</td>
                      <td>{brand.lastUpdated.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p><small>This table is the same live BrandMetric data referenced in the briefing narration — real engagement and anomaly scores, not illustrative numbers. Numbers reformat to your local number format automatically.</small></p>
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
                <strong data-simple-label="Explore Now">Jump Into Free Roam — Explore the Quantum WhatsApp OS</strong>
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
                <p>Once you've reviewed the live data above, continue to the investor survey.</p>
                <p><small>{DEMO_END_BELONGING_LINE}</small></p>
                <form action={continueToSurvey}>
                  <button type="submit" className="btn btn-primary quantum-btn">Continue to survey</button>
                </form>
              </article>
            </div>
          )}
        </>
      )}
      <div className="quantum-brand-row">
        {(['foundingos', 'retail', 'meat', 'talent', 'crypto', 'foundthat'] as const).map((slug) => (
          <a key={slug} href={brandRegistry[slug].webUrl} className="quantum-brand-card" style={{ ['--brand-glow' as string]: brandRegistry[slug].accent }}>
            <span className="quantum-brand-card-dot" />
            {brandRegistry[slug].name}
          </a>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
    </section>
  )
}
