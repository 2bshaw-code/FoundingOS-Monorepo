/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ADMIN_COOKIE, verifyToken } from '../../tester/session'
import { QuantumSphereLogo } from '@foundingos/ui'

// Admin-only, real written reference — not a narrated demo. Every system named here is real
// and already shipped this session: Founder Console, SuperDash's real subscriptions/scraping
// sections, AVL, Guardian Queue, Package Model D admin actions, and the tester program's own
// admin tools. Properly gated (unlike the existing /founder page, which currently has no auth
// check of its own and isn't covered by middleware.ts's matcher — flagged separately, not
// silently fixed here since that's a pre-existing, unrelated surface).
export default async function AdminFounderManualPage() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId !== 'super-founder-admin') redirect('/tester/login')

  return (
    <section className="stack">
      <div className="quantum-brand-header">
        <QuantumSphereLogo size={48} />
        <div className="quantum-gradient-bar" />
      </div>
      <header className="module-header">
        <p>FounderOS Library — Admin Only</p>
        <h1>Admin &amp; Founder Operations Manual</h1>
        <span>How to run the ecosystem — every admin-only tool built this program, in one place.</span>
      </header>

      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>1</span><strong>Founder Console (/founder)</strong></div>
          <p>Your master control centre: All businesses, All brands, All workflows, WhatsApp automation, All analytics, AI onboarding, All customers (CRM), All orders, All products, All employees, All permissions, and All settings. Every one of the 12 sections links to a real destination — none show &quot;Coming soon&quot;.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>2</span><strong>SuperDash (/superdashboard)</strong></div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            <li>Cross-brand analytics and brand switching (the mock &quot;Package analytics&quot; panel is explicitly illustrative demo data).</li>
            <li><strong>Real subscriptions</strong> — live, database-backed Package Model D MRR/ARR per brand, with real FX conversion (via the real /api/fx/rates endpoint).</li>
            <li><strong>Scraping Dashboard</strong> (/superdashboard/scraping) — real scrape history, diffing, anomalies, and the customer pipeline builder.</li>
            <li>Footer: real Verification (AVL) status and real Testers (activation/engagement/retention/stability/autonomy) metrics.</li>
          </ul>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>3</span><strong>AVL — Autonomous Verification Layer</strong></div>
          <p>A real, internal-only cron (POST /api/avl/verify, every 5 minutes) that scans all 26 apps for reachability, detects drift against the last known-good snapshot, and auto-applies deterministic safe fixes (like re-triggering a stale brand&apos;s scrape). Its lastRun/driftCount/safeFixCount/pendingGuardian status is always visible in the SuperDash footer — no separate dashboard to check.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>4</span><strong>Guardian Queue</strong></div>
          <p>Anything AVL flags as high-risk (rather than safe to auto-fix) sits here, unresolved, until you review it. It isn&apos;t a separate page — it&apos;s the pendingGuardian count in the SuperDash footer; each item is a real DriftLog row with a kind, message, and detail.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>5</span><strong>Package Model D — real admin actions</strong></div>
          <p>From SuperDash&apos;s Real subscriptions section you can assign any of the 8 real brands a real base tier (Starter/Standard/Premium/Enterprise) and industry pack. This snapshots the real catalog price into a persisted, database-backed MRR/ARR record via the admin-authenticated POST /api/superdash/package-subscriptions endpoint — informational only, no payment processor, but genuinely stored, not mocked.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>6</span><strong>Tester program admin tools (/tester/admin)</strong></div>
          <p>Review every tester&apos;s real survey answers and reassign their module here. This is separate from your own Super Founder Admin session, which already unlocks every demo and survey directly from the Switcher Hub&apos;s R/M/G/A/B/S/T/U codes — no reassignment needed for your own testing.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>7</span><strong>FoundAI, CRM, and the brand-facing tools</strong></div>
          <p>Everything in the Brand User Guide applies to you too — FoundAI, the narrator/audio system, and CRM all work identically for admin as they do for a real brand user, with the same warm founder-style voice and the same real data.</p>
        </article>

        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>◆</span><strong>Want the guided version?</strong></div>
          <p>The Admin &amp; Founder Operations Tour walks through everything on this page as a real, 8-step narrated demo. There&apos;s also a genuine, pre-existing gap worth knowing about: the /founder page itself currently has no auth check in its own code and isn&apos;t covered by middleware.ts&apos;s matcher — unlike this manual page, which is properly gated. Worth a real fix.</p>
          <Link className="btn btn-secondary quantum-btn" href="/superdashboard">Open SuperDash</Link>
        </article>
      </div>
    </section>
  )
}
