/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../../session'
import { getTester } from '../../store.server'

export default async function TesterDemoPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = getTester(testerId)
  if (!tester) redirect('/tester/login')
  if (tester.moduleId !== moduleId) notFound()
  if (tester.runs.length === 0) redirect('/tester/dashboard')

  const isSuperDashboardDemo = moduleId === 'superdashboard-demo'
  const directModuleHref = moduleId === 'finance' ? '/finance' : moduleId === 'crypto' ? '/crypto' : null

  return (
    <section className="stack">
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{tester.moduleLabel} demo</h1>
        <span>Thanks for completing your survey — this is your assigned module demo.</span>
      </header>

      <div className="module-card-grid">
        <article className="module-card fo-card">
          <div className="module-card-top"><span>✓</span><strong>Survey complete</strong></div>
          <p>Your feedback has been recorded for {tester.moduleLabel}.</p>
        </article>

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
      </div>
    </section>
  )
}
