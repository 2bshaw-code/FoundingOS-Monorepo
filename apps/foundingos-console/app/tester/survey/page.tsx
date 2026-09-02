/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../session'
import { getTester, getOrCreateAdminTester } from '../store.server'
import { SURVEYS, categorizeCredential, SURVEY_INTRO, NARRATOR_SURVEY_LINE, DEMO_COMPLETE_CELEBRATION_LINE, SURVEY_COMPLETE_NARRATOR_LINE, SURVEY_COMPLETE_CELEBRATION_LINE, SURVEY_MISSION_NARRATOR_LINE, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, SIGNATURE_MOMENT_LINE, FREE_ROAM_FIRST_STEP_LINE, SECTION_NARRATOR_LINES, PACING_REASSURANCE_LINES, ACCESSIBILITY_REMINDER_LINES, TARGET_JOKES, MICRO_BREAK_LINES, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, NARRATION_PLAYER_SCRIPT, getFreeRoamHref, BRAND_ROW_NARRATOR_LINE, adminTesterId, exploreTesterId, findModuleOption, SUPER_FOUNDER_ADMIN_EMAIL, type CredentialCategory, type SurveyId } from '../tester-data'
import { brands } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'
import { SurveyEngine } from './SurveyEngine'

export default async function TesterSurveyPage({ searchParams }: { searchParams: Promise<{ moduleId?: string }> }) {
  // Real Super Founder Admin only (see tester-data.ts's adminTesterId doc comment) — never the
  // separate passcode-only /tester/admin reviewer (id === 'admin'), whose access is unchanged.
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isSuperFounderAdminSession = adminId === 'super-founder-admin'

  let testerId: string
  let tester: Awaited<ReturnType<typeof getTester>>
  let category: CredentialCategory
  // True whenever the demo-not-yet-viewed redirect below should send this session back to a
  // specific module's demo page (?moduleId=) rather than the generic dashboard — admin always
  // (no single assigned module), and so does any real session exploring a non-primary module.
  let exploredModuleId: string | null = null
  if (isSuperFounderAdminSession) {
    const { moduleId: requestedModuleId } = await searchParams
    const moduleOption = requestedModuleId ? findModuleOption(requestedModuleId) : null
    // Admin has no single assigned module the way a real tester does — without a real,
    // valid moduleId to say which survey to render, send it back to the Switcher hub to pick one.
    if (!moduleOption) redirect('/tester/dashboard')
    testerId = adminTesterId(moduleOption.moduleId)
    tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, SUPER_FOUNDER_ADMIN_EMAIL)
    category = 'admin'
    exploredModuleId = moduleOption.moduleId
  } else {
    const token = cookies().get(SESSION_COOKIE)?.value
    const realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) redirect('/tester/login')

    const ownTester = await getTester(realTesterId)
    if (!ownTester) redirect('/tester/login')
    category = categorizeCredential(realTesterId)

    const { moduleId: requestedModuleId } = await searchParams
    if (requestedModuleId && requestedModuleId !== ownTester.moduleId) {
      // Every real session can now take any real module's survey — not just the one they were
      // originally assigned — exactly like admin already could. Tracked under its own
      // namespaced per-module row (own real email, own real runs/status), same mechanism as
      // /tester/demo/[moduleId]'s explore path, so it never touches their real assigned-module
      // progress.
      const moduleOption = findModuleOption(requestedModuleId)
      if (!moduleOption) redirect('/tester/dashboard')
      testerId = exploreTesterId(realTesterId, requestedModuleId)
      tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, ownTester.email)
      exploredModuleId = moduleOption.moduleId
    } else {
      // Their own real, primary assigned module — completely unchanged from before.
      testerId = realTesterId
      tester = ownTester
    }
  }

  // Demo must always come before the survey for real testers/survey-takers/investors/buyers/
  // customers — anyone who hasn't viewed their assigned demo/briefing yet (status still
  // 'registered', or for investors still mid-briefing at 'briefing-viewed') is sent to their
  // Switcher hub (/tester/dashboard, or the investor briefing) first, every time, no
  // exceptions. Free roam / lawyer sessions never take a survey at all, so they're exempt from
  // this gate entirely (they can still browse here read-only if they navigate here directly).
  // Admin (or any real session exploring a non-primary module) gets sent back to that specific
  // module's demo page (we already know which module from exploredModuleId above) rather than
  // the generic hub.
  const isSurveyTaker = category === 'tester' || category === 'survey' || category === 'investor' || category === 'buyer' || category === 'customer' || category === 'admin'
  const demoNotYetViewed = tester.status === 'registered' || tester.status === 'briefing-viewed'
  if (isSurveyTaker && demoNotYetViewed) {
    redirect(category === 'investor' ? '/investor' : exploredModuleId ? `/tester/demo/${exploredModuleId}` : '/tester/dashboard')
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
        <article className="module-card fo-card quantum-frame" data-narration={NARRATOR_SURVEY_LINE}>
          <div className="module-card-top"><span>ℹ</span><strong>Before you start</strong></div>
          <div className="quantum-narrator-panel">
            <p>{DEMO_COMPLETE_CELEBRATION_LINE}</p>
            <p>{NARRATOR_SURVEY_LINE}</p>
          </div>
          <button type="button" className="btn btn-secondary quantum-btn" data-audio-toggle suppressHydrationWarning>Audio: ON</button>
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
      <div className="quantum-narrator-panel">
        <p>{BRAND_ROW_NARRATOR_LINE}</p>
      </div>
      <div className="quantum-brand-row">
        {(['foundingos', 'retail', 'meat', 'talent', 'crypto', 'foundthat', 'finance', 'health', 'logistics'] as const).map((slug) => (
          <a key={slug} href={brands[slug].webUrl} className="quantum-brand-card" style={{ ['--brand-glow' as string]: brands[slug].accent }}>
            <span className="quantum-brand-card-dot" />
            {brands[slug].name}
          </a>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </section>
  )
}
