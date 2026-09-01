/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, categorizeCredential, SURVEY_INTRO, type SurveyId } from '../tester-data'
import { SurveyEngine } from './SurveyEngine'

export default async function TesterSurveyPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester) redirect('/tester/login')

  // Demo must always come before the survey for real testers/survey-takers/investors — a
  // tester/investor who hasn't viewed their assigned demo/briefing yet (status still
  // 'registered', or for investors still mid-briefing at 'briefing-viewed') is sent there
  // first, every time, no exceptions. Free roam / lawyer sessions never take a survey at all,
  // so they're exempt from this gate entirely (they can still browse here read-only if they
  // navigate here directly).
  const category = categorizeCredential(testerId)
  const isSurveyTaker = category === 'tester' || category === 'survey' || category === 'investor'
  const demoNotYetViewed = tester.status === 'registered' || tester.status === 'briefing-viewed'
  if (isSurveyTaker && demoNotYetViewed) {
    redirect(category === 'investor' ? '/investor' : `/tester/demo/${tester.moduleId}`)
  }

  const survey = SURVEYS[tester.surveyId as SurveyId]

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{survey.title}</h1>
        <span>Tailored for {tester.moduleLabel}. Answers auto-save as you go — surveys can always be retaken.</span>
      </header>
      <div className="module-card-grid" style={{ marginBottom: 20 }}>
        <article className="module-card fo-card">
          <div className="module-card-top"><span>ℹ</span><strong>Before you start</strong></div>
          <p>{SURVEY_INTRO}</p>
        </article>
      </div>
      <SurveyEngine survey={survey} initialAnswers={tester.currentAnswers} moduleId={tester.moduleId} />
    </section>
  )
}
