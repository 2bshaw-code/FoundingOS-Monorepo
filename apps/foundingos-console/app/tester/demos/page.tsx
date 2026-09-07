/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { MODULE_OPTIONS, adminTesterId, exploreTesterId } from '../tester-data'
import { QuantumSphereLogo } from '@foundingos/ui'

// A dedicated "Demos & Tutorials" tab for testers — mirrors the public website's own /demos
// page (every brand demo, in one place, separate from the Switcher Hub/survey/history content
// on /tester/dashboard) instead of dropping testers into one long mixed grid.
export default async function TesterDemosPage() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isAdminSession = adminId === 'super-founder-admin'

  let tester: Awaited<ReturnType<typeof getTester>> = null
  let realTesterId: string | null = null
  if (!isAdminSession) {
    const token = cookies().get(SESSION_COOKIE)?.value
    realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) redirect('/tester/login')

    tester = await getTester(realTesterId)
    if (!tester) redirect('/tester/login')
  }

  // "Investor Briefing" is its own dedicated page/flow (/investor), not a
  // /tester/demo/[moduleId] route — so it's shown as its own card, not in the generic grid.
  const gridModules = MODULE_OPTIONS.filter((option) => option.moduleId !== 'investor-overview')
  // Progress is only ever READ here (getTester, never getOrCreate) — browsing this grid must
  // never itself create a row for a module nobody has actually opened yet.
  const progress = await Promise.all(
    gridModules.map((option) => {
      if (isAdminSession) return getTester(adminTesterId(option.moduleId))
      if (tester!.moduleId === option.moduleId) return Promise.resolve(tester)
      return getTester(exploreTesterId(realTesterId!, option.moduleId))
    }),
  )

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>Demos &amp; Tutorials</h1>
        <span>Every real module's guided, step-by-step walkthrough — with real screenshots — in one place. Run or replay any of them, unlimited times.</span>
      </header>

      <article className="module-card fo-card quantum-frame">
        <div className="module-card-top"><span>◈</span><strong>All brand demos</strong></div>
        <p>Each demo is tracked under your own account, so you can pick up any of them at any time.</p>
        <div className="module-card-grid">
          {gridModules.map((option, index) => {
            const record = progress[index]
            const isOwnPrimary = !isAdminSession && tester!.moduleId === option.moduleId
            const label = !record || record.status === 'registered'
              ? 'Not started'
              : record.runs.length > 0
                ? `${record.runs.length} survey ${record.runs.length === 1 ? 'run' : 'runs'} completed`
                : 'Demo viewed'
            return (
              <article key={option.moduleId} className="module-card fo-card">
                <div className="module-card-top"><span>▣</span><strong>{option.moduleLabel}</strong>{isOwnPrimary ? <small style={{ marginLeft: 'auto', opacity: 0.6 }}>your assigned module</small> : null}</div>
                <p><small>{label}</small></p>
                <Link className="btn btn-primary quantum-btn" href={`/tester/demo/${option.moduleId}`}>
                  {record && record.runs.length > 0 ? 'Revisit demo' : 'Open demo'}
                </Link>
              </article>
            )
          })}
          <article className="module-card fo-card">
            <div className="module-card-top"><span>◇</span><strong>Investor Briefing</strong></div>
            <p><small>Real briefing → demo → survey flow, same as an investor session.</small></p>
            <Link className="btn btn-primary quantum-btn" href="/investor">Open investor briefing</Link>
          </article>
        </div>
      </article>
    </section>
  )
}
