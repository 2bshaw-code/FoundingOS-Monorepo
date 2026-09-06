/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../session'
import { getTester, upsertTester, getOrCreateAdminTester } from '../../store.server'
import { MODULE_NARRATOR_STEPS, buildNarratorSteps, NARRATION_PLAYER_SCRIPT, BUSINESS_PLAN_FACTS, OPENING_NARRATOR_LINE, TESTER_INSTRUCTION_CARD, WELCOME_BACK_NARRATOR_LINE, WELCOME_BACK_SOFT_LINE, DEMO_END_BELONGING_LINE, FREE_ROAM_ENTERED_LINE, FREE_ROAM_UNLOCK_LINE, EMOTIONAL_CLOSING_LINE, DEMO_INTRO, FREE_ROAM_INVITE_LINES, FREE_ROAM_TIPS, getFreeRoamHref, categorizeCredential, SWITCHER_PANEL_TITLE, SWITCHER_PANEL_NARRATOR_LINE, buildSwitcherOptions, SWITCHER_CODE_SCRIPT, BRAND_ROW_NARRATOR_LINE, adminTesterId, exploreTesterId, findModuleOption, SUPER_FOUNDER_ADMIN_EMAIL, type ModuleId } from '../../tester-data'
import { GLOBAL_ACCESSIBILITY_SCRIPT, brands } from '@foundingos/config'
import { getQuantumBrandUpliftForDemo } from '@foundingos/config/quantum-brand-uplift'
import { QuantumSphereLogo } from '@foundingos/ui'
import { AnimatedMessageFlow } from '@foundingos/ui/animated-message-flow'
import { QuantumDemoViewer } from '@foundingos/ui/quantum-demo'
import { QuantumTextField } from '@foundingos/ui/quantum'
import { DemoCurrencyCard } from '../../DemoCurrencyCard'

export default async function TesterDemoPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params

  // Real Super Founder Admin gets its own pseudo-tester row per module (see adminTesterId's
  // doc comment) so it can run/replay every real module's demo, with real tracking under its
  // own email — never the separate passcode-only /tester/admin reviewer (id === 'admin'),
  // whose access is completely unchanged.
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isSuperFounderAdminSession = adminId === 'super-founder-admin'

  let testerId: string
  let tester: Awaited<ReturnType<typeof getTester>>
  // True whenever /tester/survey needs an explicit ?moduleId= to know which survey to render —
  // admin always needs it (no single assigned module), and so does any real session exploring
  // a module that isn't their own primary assignment.
  let needsModuleQueryParam = isSuperFounderAdminSession
  let realTesterIdForCategory: string | null = null
  if (isSuperFounderAdminSession) {
    const moduleOption = findModuleOption(moduleId)
    if (!moduleOption) notFound()
    testerId = adminTesterId(moduleId)
    tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, SUPER_FOUNDER_ADMIN_EMAIL)
  } else {
    const token = cookies().get(SESSION_COOKIE)?.value
    const realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) redirect('/tester/login')
    realTesterIdForCategory = realTesterId

    const ownTester = await getTester(realTesterId)
    if (!ownTester) redirect('/tester/login')

    if (ownTester.moduleId === moduleId) {
      // Their own real, primary assigned module — completely unchanged from before.
      testerId = realTesterId
      tester = ownTester
    } else {
      // Every real session can now browse and try any real module's demo — not just the one
      // they were originally assigned — exactly like admin already could. Tracked under its
      // own namespaced per-module row (this tester's own real email, own real runs/status) so
      // exploring never touches or overwrites their actual assigned-module progress.
      const moduleOption = findModuleOption(moduleId)
      if (!moduleOption) notFound()
      testerId = exploreTesterId(realTesterId, moduleId)
      tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, ownTester.email)
      needsModuleQueryParam = true
    }
  }

  // Marks the demo as viewed (first time only — never regresses a tester who has already
  // progressed past this point) and sends them on to their real survey. Demo must always
  // come before the survey now, so this is the only way forward from here. A moduleId is
  // carried whenever /tester/survey can't infer which survey to render from the session's own
  // single primary record alone (admin, or a real session exploring a non-primary module).
  async function continueToSurvey() {
    'use server'
    const current = await getTester(testerId)
    if (current && current.status === 'registered') {
      await upsertTester(testerId, { status: 'demo-viewed' })
    }
    redirect(needsModuleQueryParam ? `/tester/survey?moduleId=${moduleId}` : '/tester/survey')
  }

  const isSuperDashboardDemo = moduleId === 'superdashboard-demo'
  // Real, existing FoundingOS console module pages (plus the real retail-web brand site for
  // the buyer persona) — every one of these is a genuinely active, working demo today, not a
  // placeholder. Only modules with no real page at all (operations/sales/branding/
  // console-navigation) fall through to the informational card below, which is itself the
  // real demo content for those — never a "coming later" placeholder.
  const directModuleHref =
    moduleId === 'finance' ? '/finance'
    : moduleId === 'crypto' ? '/crypto'
    : moduleId === 'marketing-suite' ? '/modules/marketing'
    : moduleId === 'accounting' ? '/modules/accounting'
    : moduleId === 'customer-service' ? '/modules/customer-service'
    : moduleId === 'messaging' ? '/modules/messaging'
    : moduleId === 'ai-automation' ? '/modules/foundai-demo'
    : moduleId === 'sales' ? '/modules/sales'
    : moduleId === 'customer-overview' ? '/modules/customer-service'
    : moduleId === 'buyer-overview' ? 'https://retail.foundingos.com'
    : moduleId === 'crm-overview' ? '/crm'
    : moduleId === 'foundingos-overview' ? '/superdashboard?readOnly=1'
    : moduleId === 'admin-overview' ? '/founder'
    : null
  const hasCompletedSurvey = tester.runs.length > 0
  // "Free Roam" here is real, read-only revisiting of whatever real page this tester's module
  // already unlocks (their own directModuleHref, or SuperDashboard read-only) — not a separate
  // /free-roam route, which doesn't exist.
  const freeRoamHref = getFreeRoamHref(moduleId)
  // Every module gets the same practical six-beat walkthrough (what it does, how to use it,
  // what happens, behind the scenes, a real example, summary) with a short reactive narrator
  // voice-line per beat; modules with no dedicated detail sentence (operations/sales/branding/
  // console-navigation) still get the full treatment via the generic fallback below, so no demo
  // is left without the narrator.
  const narratorSteps = MODULE_NARRATOR_STEPS[moduleId as ModuleId] ?? buildNarratorSteps(
    tester.moduleLabel,
    `your assigned part of the FoundingOS multi-brand operating system`,
    moduleId as ModuleId,
  )
  // categorizeCredential must use the real underlying tester id, never a synthetic explore id
  // (exploreTesterId's "::explore::" suffix would break the credential-prefix checks it does).
  const switcherOptions = buildSwitcherOptions(isSuperFounderAdminSession ? 'admin' : categorizeCredential(realTesterIdForCategory!))
  const { brand: demoBrand, uplift } = getQuantumBrandUpliftForDemo(moduleId)
  const demoImages = uplift.demoImageRequirements
  const demoSteps = [...uplift.demoSteps, ...narratorSteps.map((step) => {
    const [, title = step.step] = step.step.split(' · ')
    return `${title}: ${step.detail}`
  })]

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Tester Program</p>
        <h1>{tester.moduleLabel} demo</h1>
        <span>
          {hasCompletedSurvey
            ? `Revisiting the ${tester.moduleLabel} demo.`
            : needsModuleQueryParam
              ? `Exploring the ${tester.moduleLabel} demo before starting its survey.`
              : `Explore your assigned module demo before starting your ${tester.moduleLabel} survey.`}
        </span>
      </header>

      {/* Prominent, always-visible Audio control — real fix for it previously being buried
          inside a mid-page card where it was easy to miss. suppressHydrationWarning: see the
          long-form explanation kept below on the button itself for why this is needed. */}
      <div className="quantum-audio-bar">
        <button type="button" data-audio-toggle suppressHydrationWarning>🔊 Audio: ON</button>
        <label>
          <input type="checkbox" id="narrator-enabled-toggle" defaultChecked />
          Narrator text: ON / OFF
        </label>
      </div>

      {/* The tutorial wizard is the main box on this page — everything else below it (welcome
          note, business plan facts, message-style preview, currency card) is real, genuinely
          useful, but secondary context, and now reads that way instead of competing for equal
          visual weight in one long grid of same-sized cards. */}
      <div className="quantum-demo-hero">
        <QuantumDemoViewer
          title={`How to use ${tester.moduleLabel}`}
          images={demoImages}
          steps={demoSteps}
          story={uplift.story}
          icon={uplift.icon}
          sphereVariant={uplift.sphereVariant}
          brand={demoBrand}
          onCompleteDemo={continueToSurvey}
        />
      </div>

      <div className="module-card-grid quantum-section-spaced">
        {isSuperDashboardDemo ? (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>◈</span><strong>SuperDashboard (read-only)</strong></div>
            <p>View the FounderOS cross-brand intelligence layer in read-only mode.</p>
            <Link className="btn btn-primary quantum-btn" href="/superdashboard?readOnly=1">Open SuperDashboard</Link>
          </article>
        ) : directModuleHref ? (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>Open the {tester.moduleLabel} module inside FounderOS.</p>
            <Link className="btn btn-primary quantum-btn" href={directModuleHref}>Open {tester.moduleLabel}</Link>
          </article>
        ) : (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>▣</span><strong>{tester.moduleLabel}</strong></div>
            <p>This is your assigned {tester.moduleLabel} module overview for this tester program.</p>
          </article>
        )}

        {!hasCompletedSurvey && (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>→</span><strong>Ready for your survey?</strong></div>
            <p>Once you've explored the demo above, continue to your tailored {tester.moduleLabel} survey.</p>
            <p><small>{DEMO_END_BELONGING_LINE}</small></p>
            <form action={continueToSurvey}>
              <button type="submit" className="btn btn-primary quantum-btn">Continue to survey</button>
            </form>
          </article>
        )}
      </div>

      <p className="quantum-demo-secondary-label">More about this demo</p>
      <div className="module-card-grid">
        {tester.status === 'registered' ? (
          <>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>👋</span><strong>Welcome</strong></div>
              <div className="quantum-narrator-panel">
                <p>{OPENING_NARRATOR_LINE}</p>
              </div>
            </article>
            <article className="module-card fo-card quantum-frame">
              <div className="module-card-top"><span>ℹ</span><strong>{TESTER_INSTRUCTION_CARD.title}</strong></div>
              <ul className="quantum-compact-list">
                {TESTER_INSTRUCTION_CARD.lines.map((line) => (
                  <li key={line}><small>{line}</small></li>
                ))}
              </ul>
              <div className="quantum-narrator-panel">
                <p>{TESTER_INSTRUCTION_CARD.narratorLine}</p>
              </div>
            </article>
          </>
        ) : (
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>👋</span><strong>Welcome back</strong></div>
            <div className="quantum-narrator-panel">
              <p>{tester.status === 'complete' ? WELCOME_BACK_SOFT_LINE : WELCOME_BACK_NARRATOR_LINE}</p>
            </div>
          </article>
        )}

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>ℹ</span><strong>Before you begin</strong></div>
          <p>{DEMO_INTRO}</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>◈</span><strong>The business plan, in short</strong></div>
          <ul className="quantum-compact-list">
            {BUSINESS_PLAN_FACTS.map((fact) => (
              <li key={fact}><small>{fact}</small></li>
            ))}
          </ul>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>💬</span><strong>Message style preview</strong></div>
          <p><small>A quick, lighthearted look at how FoundAI banter feels across familiar messaging styles — purely for fun, not a real conversation log.</small></p>
          <AnimatedMessageFlow />
        </article>

        <DemoCurrencyCard moduleId={moduleId} />
      </div>


      {hasCompletedSurvey && (
        <div className="stack quantum-section-spaced-lg">
          <div className="quantum-narrator-panel">
            <p>{FREE_ROAM_UNLOCK_LINE}</p>
            <p>{FREE_ROAM_INVITE_LINES[0]}</p>
            <p>{FREE_ROAM_INVITE_LINES[1]} {FREE_ROAM_INVITE_LINES[2]}</p>
            <p><small>{FREE_ROAM_TIPS.join(' ')}</small></p>
          </div>
          <Link href={freeRoamHref} className="quantum-freeroam-box">
            <strong data-simple-label="Explore Now">Jump Into Free Roam — Explore the Quantum WhatsApp OS</strong>
            <small>{FREE_ROAM_ENTERED_LINE} Read-only exploration of your unlocked module — nothing you click can break anything.</small>
          </Link>
          <div className="quantum-narrator-panel">
            <p>{EMOTIONAL_CLOSING_LINE}</p>
          </div>
        </div>
      )}

      <article className="module-card fo-card quantum-frame quantum-section-spaced-lg">
        <div className="module-card-top"><span>🧭</span><strong>{SWITCHER_PANEL_TITLE}</strong></div>
        <div className="quantum-narrator-panel">
          <p>{SWITCHER_PANEL_NARRATOR_LINE}</p>
        </div>
        <form data-switcher-form className="quantum-switcher-form">
          <div className="quantum-switcher-options">
            {switcherOptions.map((option) => (
              <div key={option.code} data-code={option.code} data-href={option.href} data-available={String(option.available)} data-note={option.note ?? ''}>
                {option.available ? (
                  <Link href={option.href} className="btn btn-secondary quantum-btn quantum-switcher-option">{option.code} · {option.label}</Link>
                ) : (
                  <div className="btn btn-secondary quantum-switcher-option quantum-switcher-option-disabled">
                    {option.code} · {option.label} <small>({option.note})</small>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="quantum-switcher-code-row">
            <QuantumTextField label="Switcher code" type="text" data-switcher-code placeholder="Enter a code (e.g. R1, M1, S1)" />
            <button type="submit" className="btn btn-primary quantum-btn">Go</button>
          </div>
          <p data-switcher-message><small></small></p>
        </form>
      </article>

      <div className="quantum-narrator-panel">
        <p>{BRAND_ROW_NARRATOR_LINE}</p>
      </div>
      <div className="quantum-brand-row">
        {(['foundingos', 'retail', 'meat', 'talent', 'crypto', 'foundthat', 'finance', 'health', 'logistics'] as const).map((slug) => (
          <a key={slug} href={brands[slug].webUrl} className={`quantum-brand-card brand-${slug}`}>
            <span className="quantum-brand-card-dot" />
            {brands[slug].name}
          </a>
        ))}
      </div>

      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: GLOBAL_ACCESSIBILITY_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SWITCHER_CODE_SCRIPT }} />
    </section>
  )
}
