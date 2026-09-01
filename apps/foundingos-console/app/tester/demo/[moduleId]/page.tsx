/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../../session'
import { getTester, upsertTester } from '../../store.server'

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
  const directModuleHref = moduleId === 'finance' ? '/finance' : moduleId === 'crypto' ? '/crypto' : null
  const hasCompletedSurvey = tester.runs.length > 0

  return (
    <section className="stack">
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
        {isSuperDashboardDemo ? (
          <article className="module-card fo-card">
            <div className="module-card-top"><span>◈</span><strong>SuperDashboard (read-only)</strong></div>
            <p>View the FounderOS cross-brand intelligence layer in read-only mode.</p>
            <Link className="btn btn-primary" href="/superdashboard?readOnly=1">Open SuperDashboard</Link>
          </article>
        ) : directModuleHref ? (
          <article className="module-card fo-card">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>Open the {tester.moduleLabel} module inside FounderOS.</p>
            <Link className="btn btn-primary" href={directModuleHref}>Open {tester.moduleLabel}</Link>
          </article>
        ) : (
          <article className="module-card fo-card">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>This module demo area is ready to activate once the {tester.moduleLabel} system goes live.</p>
          </article>
        )}

        {!hasCompletedSurvey && (
          <article className="module-card fo-card">
            <div className="module-card-top"><span>→</span><strong>Ready for your survey?</strong></div>
            <p>Once you've explored the demo above, continue to your tailored {tester.moduleLabel} survey.</p>
            <form action={continueToSurvey}>
              <button type="submit" className="btn btn-primary">Continue to survey</button>
            </form>
          </article>
        )}
      </div>
    </section>
  )
}

