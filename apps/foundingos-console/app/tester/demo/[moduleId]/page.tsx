/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, verifyToken } from '../../session'
import { getTester, upsertTester } from '../../store.server'
import { MODULE_NARRATION, NARRATION_PLAYER_SCRIPT, BUSINESS_PLAN_NARRATION, DEMO_INTRO, type ModuleId } from '../../tester-data'

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
  // Real, existing FoundingOS console module pages — every one of these is a genuinely
  // active, working demo today, not a placeholder. Only modules with no console-side page
  // at all (operations/sales/branding/console-navigation) fall through to the informational
  // card below, which is itself the real demo content for those — never a "coming later"
  // placeholder.
  const directModuleHref =
    moduleId === 'finance' ? '/finance'
    : moduleId === 'crypto' ? '/crypto'
    : moduleId === 'marketing-suite' ? '/modules/marketing'
    : moduleId === 'accounting' ? '/modules/accounting'
    : moduleId === 'customer-service' ? '/modules/customer-service'
    : moduleId === 'messaging' ? '/modules/messaging'
    : moduleId === 'ai-automation' ? '/modules/foundai-demo'
    : null
  const hasCompletedSurvey = tester.runs.length > 0
  // Every module's narration embeds the same full business-plan story (MODULE_NARRATION
  // already does this for the modules with a dedicated detail sentence); modules with no
  // dedicated detail (operations/sales/branding/console-navigation) still get the full
  // business-plan story plus a generic module line, so every demo — with no exceptions —
  // covers the business plan.
  const narration = MODULE_NARRATION[moduleId as ModuleId]
    ?? `${BUSINESS_PLAN_NARRATION} This module, ${tester.moduleLabel}, is your assigned part of that same FoundingOS multi-brand operating system.`

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
        <article className="module-card fo-card">
          <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
          <p>{DEMO_INTRO}</p>
        </article>

        <article className="module-card fo-card" data-narration={narration}>
          <div className="module-card-top"><span>🔊</span><strong>Narration</strong></div>
          <p>{narration}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" data-narrate-btn>▶ Play narration</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" id="demo-autoplay-toggle" />
              Auto-play next time
            </label>
          </div>
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
            <p>This is your assigned {tester.moduleLabel} module overview for this tester program.</p>
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
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </section>
  )
}
