/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { SURVEYS, type SurveyId } from '../tester-data'
import { buildQuantumDemoCtaLabel } from '@foundingos/config/quantum-defined-engine'

export default async function TesterDashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = getTester(testerId)
  if (!tester) redirect('/tester/login')

  const survey = SURVEYS[tester.surveyId as SurveyId]
  const baseAnswered = survey.questions.filter((question) => tester.currentAnswers.some((answer) => answer.questionId === question.id)).length
  const progress = Math.round((baseAnswered / survey.questions.length) * 100)
  const hasCompletedOnce = tester.runs.length > 0
  const isMidRun = baseAnswered > 0 && baseAnswered < survey.questions.length

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
          <div className="module-card-top"><span>01</span><strong>{survey.title}</strong></div>
          <p>{survey.questions.length} tailored questions for {tester.moduleLabel}.</p>
          <Link className="btn btn-primary" href="/tester/survey">{surveyButtonLabel}</Link>
        </article>

        <article className="module-card fo-card">
          <div className="module-card-top"><span>02</span><strong>Module demo</strong></div>
          <p>{hasCompletedOnce ? 'Your survey is complete — replay the demo anytime.' : 'Complete your survey to unlock the module demo.'}</p>
          {hasCompletedOnce ? (
            <Link className="btn btn-primary" href={`/tester/demo/${tester.moduleId}`}>{demoButtonLabel}</Link>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>Go to demo</button>
          )}
          <p><small>{buildQuantumDemoCtaLabel()} — Quantum walks through forecast, anomaly, and opportunity for this module.</small></p>
        </article>

        <article className="module-card fo-card">
          <div className="module-card-top"><span>03</span><strong>Feedback anytime</strong></div>
          <p>Surveys stay open — start a fresh run whenever you have more feedback to share.</p>
          <Link className="btn btn-secondary" href="/tester/survey">Give more feedback</Link>
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
