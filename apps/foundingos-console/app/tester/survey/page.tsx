/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, categorizeCredential, SURVEY_INTRO, NARRATOR_SURVEY_LINE, SURVEY_COMPLETE_NARRATOR_LINE, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, SECTION_NARRATOR_LINES, getFreeRoamHref, type SurveyId } from '../tester-data'
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

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{survey.title}</h1>
        <span>Tailored for {tester.moduleLabel}. Answers auto-save as you go — surveys can always be retaken.</span>
      </header>
      <div className="module-card-grid" style={{ marginBottom: 20 }}>
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>ℹ</span><strong>Before you start</strong></div>
          <div className="quantum-narrator-panel">
            <p>{NARRATOR_SURVEY_LINE}</p>
          </div>
          <p>{SURVEY_INTRO}</p>
        </article>
      </div>
      <SurveyEngine
        survey={survey}
        initialAnswers={tester.currentAnswers}
        moduleId={tester.moduleId}
        freeRoamHref={freeRoamHref}
        completeNarratorLine={SURVEY_COMPLETE_NARRATOR_LINE}
        freeRoamInviteLines={FREE_ROAM_INVITE_LINES}
        freeRoamTips={FREE_ROAM_TIPS}
        sectionNarratorLines={SECTION_NARRATOR_LINES}
      />
    </section>
  )
}
