/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../tester/session'
import { getTester, upsertTester } from '../tester/store.server'
import { categorizeCredential, INVESTOR_NARRATION, NARRATION_PLAYER_SCRIPT, DEMO_INTRO } from '../tester/tester-data'
import { readBrandMetrics } from '../superdashboard/brand-metric-store.server'

// Real, read-only Investor briefing — reuses the same live BrandMetric data that powers
// SuperDashboard, gated to sessions whose credential category is genuinely 'investor'
// (INV-ALPHA / INV-OMEGA). No write actions, no Guardian/Autonomous internals exposed.
// Investors get a dedicated two-phase sequence — briefing (the business-plan narration),
// then demo (the live cross-brand data) — before the survey unlocks, matching the explicit
// "briefing → demo → survey" investor flow (one step more than the plain tester sequence).
export default async function InvestorPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester || categorizeCredential(testerId) !== 'investor') redirect('/tester/login')

  // Once both phases have been viewed, this page's job is done — send the investor straight
  // to their survey every time they land here again, never re-showing the briefing as a detour.
  if (tester.status !== 'registered' && tester.status !== 'briefing-viewed') redirect('/tester/survey')

  async function continueToDemo() {
    'use server'
    const current = await getTester(testerId!)
    if (current && current.status === 'registered') {
      await upsertTester(testerId!, { status: 'briefing-viewed' })
    }
    redirect('/investor')
  }

  async function continueToSurvey() {
    'use server'
    const current = await getTester(testerId!)
    if (current && (current.status === 'registered' || current.status === 'briefing-viewed')) {
      await upsertTester(testerId!, { status: 'demo-viewed' })
    }
    redirect('/tester/survey')
  }

  const isBriefingPhase = tester.status === 'registered'

  const brands = isBriefingPhase ? [] : await readBrandMetrics()
  const totalEngagement = brands.reduce((sum, brand) => sum + brand.totalEngagement, 0)

  return (
    <section className="stack">
      <header className="module-header">
        <p>FoundingOS Investor {isBriefingPhase ? 'Briefing' : 'Demo'}</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Read-only cross-brand engagement overview — live data, no admin actions.</span>
      </header>

      {isBriefingPhase ? (
        <div className="module-card-grid">
          <article className="module-card fo-card">
            <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
            <p>{DEMO_INTRO}</p>
          </article>

          <article className="module-card fo-card" data-narration={INVESTOR_NARRATION}>
            <div className="module-card-top"><span>🔊</span><strong>Narration — the FoundingOS story</strong></div>
            <p>{INVESTOR_NARRATION}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" data-narrate-btn>▶ Play narration</button>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input type="checkbox" id="demo-autoplay-toggle" />
                Auto-play next time
              </label>
            </div>
          </article>

          <article className="module-card fo-card">
            <div className="module-card-top"><span>→</span><strong>Ready for the live demo?</strong></div>
            <p>Once you've reviewed the briefing above, continue to the live cross-brand data demo.</p>
            <form action={continueToDemo}>
              <button type="submit" className="btn btn-primary">Continue to demo</button>
            </form>
          </article>
        </div>
      ) : (
        <>
          <div className="kpi-grid">
            <article className="dashboard-card fo-card good">
              <span>◈</span>
              <strong>{brands.length}</strong>
              <small>Brands reporting live data</small>
            </article>
            <article className="dashboard-card fo-card good">
              <span>Σ</span>
              <strong>{totalEngagement}</strong>
              <small>Total engagement (all brands)</small>
            </article>
          </div>

          <div className="console-grid">
            <article className="panel wide fo-card">
              <h2>Brand engagement — live, unfiltered SuperDash data</h2>
              <table className="superdashboard-brand-table">
                <thead>
                  <tr><th>Brand</th><th>Total engagement</th><th>Anomaly score</th><th>Last updated</th></tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.brandName}>
                      <td>{brand.brandName}</td>
                      <td>{brand.totalEngagement}</td>
                      <td>{brand.anomalyScore.toFixed(2)}</td>
                      <td>{brand.lastUpdated.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p><small>This table is the same live BrandMetric data referenced in the briefing narration — real engagement and anomaly scores, not illustrative numbers.</small></p>
            </article>
          </div>

          <div className="module-card-grid">
            <article className="module-card fo-card">
              <div className="module-card-top"><span>→</span><strong>Ready for the investor survey?</strong></div>
              <p>Once you've reviewed the live data above, continue to the investor survey.</p>
              <form action={continueToSurvey}>
                <button type="submit" className="btn btn-primary">Continue to survey</button>
              </form>
            </article>
          </div>
        </>
      )}
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </section>
  )
}
