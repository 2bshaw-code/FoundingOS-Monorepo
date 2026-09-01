/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, categorizeCredential, SURVEY_INTRO, NARRATOR_SURVEY_LINE, DEMO_COMPLETE_CELEBRATION_LINE, SURVEY_COMPLETE_NARRATOR_LINE, SURVEY_COMPLETE_CELEBRATION_LINE, SURVEY_MISSION_NARRATOR_LINE, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, SIGNATURE_MOMENT_LINE, FREE_ROAM_FIRST_STEP_LINE, SECTION_NARRATOR_LINES, PACING_REASSURANCE_LINES, ACCESSIBILITY_REMINDER_LINES, TARGET_JOKES, MICRO_BREAK_LINES, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, getFreeRoamHref, type SurveyId } from '../tester-data'
import { brands } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'
import { SurveyEngine } from './SurveyEngine'

export default async function TesterSurveyPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester) redirect('/tester/login')

  // Demo must always come before the survey for real testers/survey-takers/investors/buyers/
  // customers — anyone who hasn't viewed their assigned demo/briefing yet (status still
  // 'registered', or for investors still mid-briefing at 'briefing-viewed') is sent there
  // first, every time, no exceptions. Free roam / lawyer sessions never take a survey at all,
  // so they're exempt from this gate entirely (they can still browse here read-only if they
  // navigate here directly).
  const category = categorizeCredential(testerId)
  const isSurveyTaker = category === 'tester' || category === 'survey' || category === 'investor' || category === 'buyer' || category === 'customer'
  const demoNotYetViewed = tester.status === 'registered' || tester.status === 'briefing-viewed'
  if (isSurveyTaker && demoNotYetViewed) {
    redirect(category === 'investor' ? '/investor' : `/tester/demo/${tester.moduleId}`)
  }

  const survey = SURVEYS[tester.surveyId as SurveyId]
  const freeRoamHref = getFreeRoamHref(tester.moduleId)
  // Captured BEFORE any submission this page load could make — true only if a full survey run
  // already existed prior to right now, so SurveyEngine can tell a genuine first-ever
  // completion (about to happen) apart from a repeat one.
  const hasCompletedSurveyBefore = tester.runs.length > 0
  const switcherOptions = buildSwitcherOptions(category)

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{survey.title}</h1>
        <span>Tailored for {tester.moduleLabel}. Answers auto-save as you go — surveys can always be retaken.</span>
      </header>
      <div className="module-card-grid" style={{ marginBottom: 20 }}>
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>ℹ</span><strong>Before you start</strong></div>
          <div className="quantum-narrator-panel">
            <p>{DEMO_COMPLETE_CELEBRATION_LINE}</p>
            <p>{NARRATOR_SURVEY_LINE}</p>
          </div>
          <p>{SURVEY_INTRO}</p>
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
                    <a href={option.href} className="btn btn-secondary quantum-btn" style={{ width: '100%', justifyContent: 'flex-start' }}>{option.code} · {option.label}</a>
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
      </div>
      <SurveyEngine
        survey={survey}
        initialAnswers={tester.currentAnswers}
        moduleId={tester.moduleId}
        freeRoamHref={freeRoamHref}
        completeNarratorLine={SURVEY_COMPLETE_NARRATOR_LINE}
        completeCelebrationLine={SURVEY_COMPLETE_CELEBRATION_LINE}
        freeRoamEnteredLine={FREE_ROAM_ENTERED_LINE}
        emotionalClosingLine={EMOTIONAL_CLOSING_LINE}
        signatureMomentLine={SIGNATURE_MOMENT_LINE}
        freeRoamFirstStepLine={FREE_ROAM_FIRST_STEP_LINE}
        hasCompletedSurveyBefore={hasCompletedSurveyBefore}
        freeRoamInviteLines={FREE_ROAM_INVITE_LINES}
        freeRoamTips={FREE_ROAM_TIPS}
        sectionNarratorLines={SECTION_NARRATOR_LINES}
        pacingReassuranceLines={PACING_REASSURANCE_LINES}
        accessibilityReminderLines={ACCESSIBILITY_REMINDER_LINES}
        targetJokes={TARGET_JOKES}
        missionNarratorLine={SURVEY_MISSION_NARRATOR_LINE}
        microBreakLines={MICRO_BREAK_LINES}
        switcherOptions={switcherOptions}
        switcherTitle={SWITCHER_PANEL_TITLE}
        switcherNarratorLine={SWITCHER_PANEL_NARRATOR_LINE}
        freeRoamUnlockLine={FREE_ROAM_UNLOCK_LINE}
      />
      <div className="quantum-brand-row">
        {(['foundingos', 'retail', 'meat', 'talent', 'crypto', 'foundthat'] as const).map((slug) => (
          <a key={slug} href={brands[slug].webUrl} className="quantum-brand-card" style={{ ['--brand-glow' as string]: brands[slug].accent }}>
            <span className="quantum-brand-card-dot" />
            {brands[slug].name}
          </a>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
    </section>
  )
}
