/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../session'
import { getTester } from '../store.server'
import { categorizeCredential, getFreeRoamHref, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, NARRATION_PLAYER_SCRIPT, BRAND_ROW_NARRATOR_LINE, MODULE_OPTIONS, adminTesterId, exploreTesterId } from '../tester-data'
import { buildQuantumDemoCtaLabel } from '@foundingos/config/quantum-defined-engine'
import { GLOBAL_ACCESSIBILITY_SCRIPT, brands } from '@foundingos/config'
import { QuantumSphereLogo } from '@foundingos/ui'

// suppressHydrationWarning on the `[data-audio-toggle]` button below: real root-cause fix for
// the "audio label reverts to its default shortly after page load" bug. NARRATION_PLAYER_SCRIPT's
// inline <script> tag runs synchronously during initial HTML parse — before this page's JS
// bundle loads and React's own hydration commit runs — so it may already have set the button's
// real stored-preference text before React reconciles. Without this prop, React's hydration
// treats its own SSR text as ground truth and silently overwrites the script's correction back
// to the static default. This is the same, documented React pattern used for content that
// legitimately differs between server and client (e.g. a live timestamp) — it tells React to
// trust the DOM's existing text for that one node instead of re-asserting its own.
export default async function TesterDashboardPage() {
  // Real Super Founder Admin only (see tester-data.ts's adminTesterId doc comment) — never the
  // separate passcode-only /tester/admin reviewer (id === 'admin'), whose access is unchanged.
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isAdminSession = adminId === 'super-founder-admin'

  // Every real session (tester/survey/buyer/customer/investor/lawyer/free-roam) now gets the
  // exact same full-access layout admin always had — every demo, every survey, unlocked,
  // nothing gated by category. Previously this page had three different layouts (admin's full
  // grid, a restricted Switcher-only view for survey-takers, and a completely separate
  // KPI-card layout for free-roam/investor/lawyer) — unified into one so "same as admin"
  // genuinely means the same for every real session, not just a similar-looking subset.
  let tester: Awaited<ReturnType<typeof getTester>> = null
  let realTesterId: string | null = null
  if (!isAdminSession) {
    const token = cookies().get(SESSION_COOKIE)?.value
    realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) redirect('/tester/login')

    tester = await getTester(realTesterId)
    if (!tester) redirect('/tester/login')
  }

  const category = isAdminSession ? 'admin' : categorizeCredential(realTesterId!)
  const switcherOptions = buildSwitcherOptions(category)

  // "Investor Briefing" is its own module — a real, dedicated page/flow (/investor), not a
  // /tester/demo/[moduleId] route — so it's shown as its own card, not in the generic grid.
  const gridModules = MODULE_OPTIONS.filter((option) => option.moduleId !== 'investor-overview')
  // Progress is only ever READ here (getTester, never getOrCreate) — browsing this grid must
  // never itself create a row for a module nobody has actually opened yet. Admin's own primary
  // module progress lives under its per-module admin-<moduleId> id; a real tester's own primary
  // assigned module uses their real record directly (no separate lookup needed, already have
  // it); every other module (for anyone) checks its own namespaced explore record, created only
  // once that module's demo page is actually visited.
  const progress = await Promise.all(
    gridModules.map((option) => {
      if (isAdminSession) return getTester(adminTesterId(option.moduleId))
      if (tester!.moduleId === option.moduleId) return Promise.resolve(tester)
      return getTester(exploreTesterId(realTesterId!, option.moduleId))
    }),
  )

  const primaryHref = !isAdminSession && tester
    ? (tester.status === 'registered'
      ? `/tester/demo/${tester.moduleId}`
      : tester.runs.length > 0
        ? getFreeRoamHref(tester.moduleId)
        : '/tester/survey')
    : null
  const primaryLabel = !isAdminSession && tester
    ? (tester.status === 'registered'
      ? `Start your ${tester.moduleLabel} demo`
      : tester.runs.length > 0
        ? 'Jump into Free Roam'
        : `Continue to your ${tester.moduleLabel} survey`)
    : null

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{isAdminSession ? 'Admin — full access' : `Welcome, ${tester!.email}`}</h1>
        <span>
          {isAdminSession
            ? 'Every demo and every survey, unlocked — nothing hidden, nothing gated.'
            : `Assigned module: ${tester!.moduleLabel} — but every other demo and survey below is just as open to you.`}
        </span>
      </header>

      <article className="module-card fo-card quantum-frame">
        <div className="module-card-top"><span>◈</span><strong>All modules</strong></div>
        <p>Run or replay any real module's demo, unlimited times — each one tracked under your own account.</p>
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

      <article className="module-card fo-card quantum-frame" data-narration={SWITCHER_PANEL_NARRATOR_LINE}>
        <div className="module-card-top"><span>🧭</span><strong>{SWITCHER_PANEL_TITLE}</strong></div>
        <div className="quantum-narrator-panel">
          <p>{SWITCHER_PANEL_NARRATOR_LINE}</p>
        </div>
        <button type="button" className="btn btn-secondary quantum-btn" data-audio-toggle suppressHydrationWarning>Audio: ON</button>
        <form data-switcher-form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            {switcherOptions.map((option) => (
              <div key={option.code} data-code={option.code} data-href={option.href} data-available={String(option.available)} data-note={option.note ?? ''}>
                {option.available ? (
                  <Link href={option.href} className="btn btn-secondary quantum-btn" style={{ width: '100%', justifyContent: 'flex-start' }}>{option.code} · {option.label}</Link>
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

      {isAdminSession ? (
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>◆</span><strong>Back to SuperDash</strong></div>
          <p>Your admin tools (SuperDash, Guardian, tester results) are always one click away.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-secondary quantum-btn" href="/superdashboard">Open SuperDash</Link>
            <Link className="btn btn-secondary quantum-btn" href="/tester/admin">Tester results</Link>
          </div>
        </article>
      ) : (
        <article className="module-card fo-card" style={{ opacity: 0.85 }}>
          <div className="module-card-top"><span>→</span><strong>Pick up where you left off</strong></div>
          <p><small>{primaryLabel} — or choose anything else above.</small></p>
          <Link className="btn btn-secondary quantum-btn" href={primaryHref!}>{primaryLabel}</Link>
          <p><small>{buildQuantumDemoCtaLabel()} — Quantum walks through forecast, anomaly, and opportunity for whichever module you open.</small></p>
        </article>
      )}

      {!isAdminSession && tester!.runs.length > 0 && (
        <div className="console-grid">
          <article className="panel wide fo-card">
            <h2>Your survey history — {tester!.moduleLabel}</h2>
            <table className="superdashboard-brand-table">
              <thead>
                <tr><th>Run</th><th>Completed</th><th>Answers</th><th>Brand insight</th><th>Pulse</th><th>Contribution</th></tr>
              </thead>
              <tbody>
                {tester!.runs.map((run, index) => (
                  <tr key={run.id}>
                    <td>#{index + 1}</td>
                    <td>{new Date(run.completedAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</td>
                    <td>{run.answers.length}</td>
                    <td>{run.signal ? run.signal.insight : '—'}</td>
                    <td>{run.signal ? `${run.signal.pulse}%` : '—'}</td>
                    <td>{run.signal ? run.signal.contributionScore : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tester!.runs.some((run) => run.signal) && (
              <p><small>Latest micro-story: {[...tester!.runs].reverse().find((run) => run.signal)?.signal?.microStory}</small></p>
            )}
          </article>
        </div>
      )}

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

      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </section>
  )
}
