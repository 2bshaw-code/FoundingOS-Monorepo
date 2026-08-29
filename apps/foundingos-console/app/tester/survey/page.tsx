/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, type SurveyId } from '../tester-data'
import { SurveyEngine } from './SurveyEngine'

export default async function TesterSurveyPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = getTester(testerId)
  if (!tester) redirect('/tester/login')

  const survey = SURVEYS[tester.surveyId as SurveyId]

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{survey.title}</h1>
        <span>Tailored for {tester.moduleLabel}. Answers auto-save as you go — surveys can always be retaken.</span>
      </header>
      <SurveyEngine survey={survey} initialAnswers={tester.currentAnswers} moduleId={tester.moduleId} />
    </section>
  )
}
