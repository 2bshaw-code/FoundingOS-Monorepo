/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, categorizeCredential, getFreeRoamHref, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, BRAND_ROW_NARRATOR_LINE, type SurveyId } from '../tester-data'
import { buildQuantumDemoCtaLabel } from '@foundingos/config/quantum-defined-engine'
import { GLOBAL_ACCESSIBILITY_SCRIPT, brands } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'

export default async function TesterDashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester) redirect('/tester/login')

  // Real testers/survey-takers/buyers/customers land here first, right after login + legal —
  // this page is now their Demo & Survey Switcher hub (UI-only change: no backend routing,
  // role, or auth logic touched — the login API still sends these categories here exactly as
  // before). From here they can jump straight into their own assigned demo/survey, or explore
  // anything else the Switcher genuinely allows for their session. Free roam / investor /
  // lawyer sessions never take a survey at all, so they're exempt and see the dashboard as-is.
  const category = categorizeCredential(testerId)
  const isSurveyTaker = category === 'tester' || category === 'survey' || category === 'buyer' || category === 'customer'

  if (isSurveyTaker) {
    const hasCompletedSurvey = tester.runs.length > 0
    const primaryHref = tester.status === 'registered'
      ? `/tester/demo/${tester.moduleId}`
      : hasCompletedSurvey
        ? getFreeRoamHref(tester.moduleId)
        : '/tester/survey'
    const primaryLabel = tester.status === 'registered'
      ? `Start your ${tester.moduleLabel} demo`
      : hasCompletedSurvey
        ? 'Jump into Free Roam'
        : `Continue to your ${tester.moduleLabel} survey`
    const switcherOptions = buildSwitcherOptions(category)

    return (
      <section className="stack">
        <div className="quantum-brand-header">
          <QuantumSphereLogo size={48} />
          <div className="quantum-gradient-bar" />
        </div>
        <header className="module-header">
          <p>FounderOS Tester Program</p>
          <h1>Welcome, {tester.email}</h1>
          <span>Assigned module: {tester.moduleLabel}</span>
        </header>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>→</span><strong>{primaryLabel}</strong></div>
          <p>Pick up right where you left off, or explore anything else below first.</p>
          <Link className="btn btn-primary quantum-btn" href={primaryHref}>{primaryLabel}</Link>
        </article>

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

        <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
      </section>
    )
  }

  const survey = SURVEYS[tester.surveyId as SurveyId]
  const baseAnswered = survey.questions.filter((question) => tester.currentAnswers.some((answer) => answer.questionId === question.id)).length
  const progress = Math.round((baseAnswered / survey.questions.length) * 100)
  const hasCompletedOnce = tester.runs.length > 0
  const isMidRun = baseAnswered > 0 && baseAnswered < survey.questions.length
  const demoViewed = !isSurveyTaker || tester.status !== 'registered' // Free roam etc. are never gated.

  const surveyButtonLabel = isMidRun ? 'Continue survey' : hasCompletedOnce ? 'Redo survey' : 'Start survey'
  const demoButtonLabel = hasCompletedOnce ? 'Redo demo' : 'Go to demo'

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Assigned module: {tester.moduleLabel}</span>
      </header>

      <div className="kpi-grid">
        <article className="dashboard-card fo-card good">
          <span>▣</span>
          <strong>{tester.moduleLabel}</strong>
          <small>Assigned module</small>
        </article>
        <article className="dashboard-card fo-card good">
          <span>◌</span>
          <strong>{progress}%</strong>
          <small>Current survey progress</small>
        </article>
        <article className="dashboard-card fo-card good">
          <span>✓</span>
          <strong>{tester.runs.length}</strong>
          <small>Completed survey runs</small>
        </article>
      </div>

      <div className="module-card-grid">
        <article className="module-card fo-card">
          <div className="module-card-top"><span>01</span><strong>Module demo</strong></div>
          <p>{demoViewed ? 'Revisit your assigned module demo anytime.' : 'Explore your assigned module demo before starting the survey.'}</p>
          <Link className="btn btn-primary" href={`/tester/demo/${tester.moduleId}`}>{demoButtonLabel}</Link>
          <p><small>{buildQuantumDemoCtaLabel()} — Quantum walks through forecast, anomaly, and opportunity for this module.</small></p>
        </article>

        <article className="module-card fo-card">
          <div className="module-card-top"><span>02</span><strong>{survey.title}</strong></div>
          <p>{survey.questions.length} tailored questions for {tester.moduleLabel}.</p>
          {demoViewed ? (
            <Link className="btn btn-primary" href="/tester/survey">{surveyButtonLabel}</Link>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>Complete the demo first</button>
          )}
        </article>

        <article className="module-card fo-card">
          <div className="module-card-top"><span>03</span><strong>Feedback anytime</strong></div>
          <p>Surveys stay open — start a fresh run whenever you have more feedback to share.</p>
          {demoViewed ? (
            <Link className="btn btn-secondary" href="/tester/survey">Give more feedback</Link>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>Complete the demo first</button>
          )}
        </article>
      </div>

      {tester.runs.length > 0 && (
        <div className="console-grid">
          <article className="panel wide fo-card">
            <h2>Survey history</h2>
            <table className="superdashboard-brand-table">
              <thead>
                <tr><th>Run</th><th>Completed</th><th>Answers</th><th>Brand insight</th><th>Pulse</th><th>Contribution</th></tr>
              </thead>
              <tbody>
                {tester.runs.map((run, index) => (
                  <tr key={run.id}>
                    <td>#{index + 1}</td>
                    <td>{new Date(run.completedAt).toLocaleString()}</td>
                    <td>{run.answers.length}</td>
                    <td>{run.signal ? run.signal.insight : '—'}</td>
                    <td>{run.signal ? `${run.signal.pulse}%` : '—'}</td>
                    <td>{run.signal ? run.signal.contributionScore : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tester.runs.some((run) => run.signal) && (
              <p><small>Latest micro-story: {[...tester.runs].reverse().find((run) => run.signal)?.signal?.microStory}</small></p>
            )}
          </article>
        </div>
      )}
    </section>
  )
}
