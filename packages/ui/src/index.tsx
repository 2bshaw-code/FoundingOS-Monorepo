/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { commercialAddOns, commercialPlans, marketingPlanFeatures } from '@foundingos/config/commercial'
import { GlobalisationControls, GlobalisationProvider, LocalizedGbp } from './globalisation'
import { ThemeToggle } from './theme'
import { WorkflowWalkthrough } from './workflow-walkthrough'
import { WorkspacePreview, type WorkspacePreviewProduct } from './workspace-preview'
import { MessagingDemo } from './messaging-demo'

export { BrandDashboard as ConsoleDashboard, BrandModulePage as ModulePage, BrandSettingsPage as SettingsPage } from './console'
export { PremiumSocialLinks } from './social-links'
export { QuantumSphereLogo } from './QuantumSphereLogo'
export { QuantumBrandUpliftPanel } from './quantum-brand-uplift'
export { WebUsedCarShop } from './quantum-web-mirror'

type SuiteCard = {
  name: string
  summary: string
  accent: string
  href: string
}

type FounderPage = 'home' | 'suites' | 'workspaces' | 'consoles' | 'marketing' | 'intelligence' | 'pricing' | 'about' | 'contact'
export type WorkspaceSlug = 'retail' | 'logistics' | 'finance' | 'talent' | 'health'
export type ConsoleSlug = WorkspaceSlug

type WorkspaceProduct = WorkspacePreviewProduct & {
  slug: WorkspaceSlug
}

const suiteCards: SuiteCard[] = [
  {
    name: 'Core.Operations',
    summary: 'Retail, Logistics, Finance, and fulfilment-to-cash orchestration in one operating layer.',
    accent: '#4A90E2',
    href: '/suites#operations',
  },
  {
    name: 'Core.Workforce',
    summary: 'Talent, hiring, payroll, scheduling, and workforce operations across the organisation.',
    accent: '#F59E0B',
    href: '/suites#workforce',
  },
  {
    name: 'Core.Intelligence',
    summary: 'AI signals, event anomaly detection, forecasting, and predictive recommendations.',
    accent: '#7C3AED',
    href: '/intelligence',
  },
]

const workspaceProducts: WorkspaceProduct[] = [
  {
    slug: 'retail',
    name: 'Retail Workspace',
    suite: 'Core Operations',
    audience: 'For retailers, distributors, and multi-location operators',
    summary: 'Run products, inventory, orders, customers, and store activity from one workspace.',
    outcome: 'Know what is selling, what needs restocking, and which orders need action before revenue is lost.',
    modules: ['POS', 'Inventory', 'Suppliers', 'Sales', 'Customers', 'Orders', 'Products', 'Stores', 'Promotions', 'Inventory alerts'],
    metrics: [
      { label: 'Sales today', amountGbp: 18420, change: '+12.4%' },
      { label: 'Open orders', value: '148', change: '23 priority' },
      { label: 'Stock alerts', value: '12', change: '4 urgent' },
    ],
    workQueue: [
      { task: 'Approve replenishment', detail: '12 fast-moving products below safety stock', status: 'Action' },
      { task: 'Resolve delayed orders', detail: '8 orders have missed the packing SLA', status: 'Risk' },
      { task: 'Review promotion', detail: 'Weekend bundle is outperforming forecast', status: 'Insight' },
    ],
    workflow: ['Order received', 'Stock reserved', 'Pick and pack', 'Dispatch', 'Payment reconciled'],
    automation: 'Low-stock rules prepare replenishment recommendations using sales velocity and lead time.',
    insight: 'Demand for the 5 kg staple bundle is forecast to exceed available stock within four days.',
  },
  {
    slug: 'logistics',
    name: 'Logistics Workspace',
    suite: 'Core Operations',
    audience: 'For delivery networks, fleet teams, and fulfilment operators',
    summary: 'Coordinate shipments, routes, drivers, delivery exceptions, and proof of delivery.',
    outcome: 'See every delivery in motion and intervene before delays become customer or cash-flow problems.',
    modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries', 'Dispatch', 'Tracking', 'Maintenance', 'Fuel', 'Compliance', 'Route planner'],
    metrics: [
      { label: 'Active shipments', value: '286', change: '41 due today' },
      { label: 'On-time rate', value: '94.8%', change: '+2.1%' },
      { label: 'Exceptions', value: '9', change: '3 urgent' },
    ],
    workQueue: [
      { task: 'Reroute delayed vehicle', detail: 'Traffic delay threatens 6 delivery windows', status: 'Action' },
      { task: 'Verify proof of delivery', detail: '4 completed stops need recipient confirmation', status: 'Review' },
      { task: 'Consolidate route', detail: 'Two low-load routes can be combined tomorrow', status: 'Insight' },
    ],
    workflow: ['Order ready', 'Route assigned', 'Driver dispatched', 'Proof captured', 'Invoice released'],
    automation: 'Exception rules flag late stops and recommend reassignment based on location and capacity.',
    insight: 'Combining tomorrow’s East routes could reduce distance by 18% without affecting delivery windows.',
  },
  {
    slug: 'finance',
    name: 'Finance Workspace',
    suite: 'Core Operations',
    audience: 'For finance teams managing cash, invoices, suppliers, and reconciliation',
    summary: 'Control receivables, payables, collections, cash position, and mobile money reconciliation.',
    outcome: 'Connect operational delivery to invoices and payments so cash leakage and overdue balances are visible.',
    modules: ['Invoicing', 'Cashflow', 'Reconciliation', 'Reporting', 'Payables', 'Receivables', 'Forecasting', 'Risk', 'Compliance', 'Portfolio alerts'],
    metrics: [
      { label: 'Cash collected', amountGbp: 84260, change: '+8.7%' },
      { label: 'Invoices due', value: '37', change: '£26.4k base value' },
      { label: 'DSO', value: '31 days', change: '-4 days' },
    ],
    workQueue: [
      { task: 'Match mobile payments', detail: '18 transactions need invoice matching', status: 'Action' },
      { task: 'Contact overdue accounts', detail: '7 customers passed agreed payment terms', status: 'Risk' },
      { task: 'Review cash forecast', detail: 'Expected 14-day position improved by 9%', status: 'Insight' },
    ],
    workflow: ['Delivery confirmed', 'Invoice issued', 'Payment received', 'Transaction matched', 'Ledger updated'],
    automation: 'Payment matching links bank and mobile money references to open invoices and flags exceptions.',
    insight: 'Three customers account for 62% of overdue value; prioritised follow-up could release £11,800.',
  },
  {
    slug: 'talent',
    name: 'Talent Workspace',
    suite: 'Core Workforce',
    audience: 'For people teams, recruiters, workforce planners, and managers',
    summary: 'Manage candidates, employees, onboarding, scheduling, payroll inputs, and performance.',
    outcome: 'Move people from application to productive work with fewer handoffs and clearer workforce decisions.',
    modules: ['ATS', 'CRM', 'Onboarding', 'Candidates', 'Jobs', 'Pipelines', 'Interviews', 'Offers', 'Candidate pipeline', 'CV parser'],
    metrics: [
      { label: 'Active workforce', value: '412', change: '+18 this month' },
      { label: 'Open roles', value: '24', change: '9 priority' },
      { label: 'Payroll ready', value: '96%', change: '16 exceptions' },
    ],
    workQueue: [
      { task: 'Complete onboarding', detail: '11 new starters have outstanding documents', status: 'Action' },
      { task: 'Fill schedule gaps', detail: 'Three locations are below required weekend cover', status: 'Risk' },
      { task: 'Progress candidates', detail: '8 screened candidates match priority roles', status: 'Insight' },
    ],
    workflow: ['Candidate selected', 'Documents verified', 'Worker onboarded', 'Shift completed', 'Payroll approved'],
    automation: 'Readiness checks identify missing documents, schedule gaps, and payroll exceptions before deadlines.',
    insight: 'Promoting qualified internal candidates could fill four priority roles 19 days faster than external hiring.',
  },
  {
    slug: 'health',
    name: 'Health Workspace',
    suite: 'Core Operations',
    audience: 'For clinics, care providers, pharmacies, and health operations teams',
    summary: 'Coordinate patients, appointments, treatment operations, stock, billing, and compliance.',
    outcome: 'Give care and operations teams a shared view of demand, capacity, patient flow, and critical supplies.',
    modules: ['Patients', 'Appointments', 'Records', 'Compliance', 'Billing', 'Referrals', 'Staffing', 'Supplies', 'Telehealth', 'Appointment manager'],
    metrics: [
      { label: 'Appointments today', value: '164', change: '91% confirmed' },
      { label: 'Average wait', value: '18 min', change: '-6 min' },
      { label: 'Stock alerts', value: '7', change: '2 critical' },
    ],
    workQueue: [
      { task: 'Confirm appointments', detail: '14 patients have not confirmed today’s visit', status: 'Action' },
      { task: 'Replenish critical stock', detail: 'Two treatment items are below minimum level', status: 'Risk' },
      { task: 'Balance capacity', detail: 'Afternoon demand can move to an open care team', status: 'Insight' },
    ],
    workflow: ['Appointment booked', 'Patient checked in', 'Care delivered', 'Stock recorded', 'Payment reconciled'],
    automation: 'Capacity and stock rules flag pressure early and prepare follow-up actions for the operations team.',
    insight: 'Moving six flexible appointments to the afternoon would cut the morning wait forecast by 11 minutes.',
  },
]

const workspaceCards = workspaceProducts.map(({ slug, name, summary }) => ({
  name,
  href: `/workspaces/${slug}`,
  summary,
}))

const operatingLayers = [
  { label: 'Event Feed', value: 'Live', detail: 'Shared event backbone across all suites and workflows.' },
  { label: 'Insights Panel', value: 'Live', detail: 'Predictions, risks, anomalies, and workflow suggestions.' },
  { label: 'Fulfilment-to-Cash', value: 'Live', detail: 'Order → shipment → delivery → invoice → payment tracking.' },
  { label: 'Buyer subset flags', value: 'Configured', detail: 'Role-based access and market-specific feature toggles.' },
] as const

const packagePlans = [
  {
    name: 'Lite',
    priceGbp: commercialPlans.lite.monthlyPriceGbp,
    summary: 'Free basic access for one user, designed for low-data environments and offline-tolerant capture.',
    features: commercialPlans.lite.includedFeatures,
  },
  {
    name: 'Starter',
    priceGbp: commercialPlans.starter.monthlyPriceGbp,
    summary: 'Core Operations for a small team, with automatic sync and every supported language included.',
    features: commercialPlans.starter.includedFeatures,
  },
  {
    name: 'Growth',
    priceGbp: commercialPlans.growth.monthlyPriceGbp,
    summary: 'All three cores, team automation, operational intelligence, and advanced reporting.',
    features: commercialPlans.growth.includedFeatures,
  },
  {
    name: 'Enterprise',
    priceGbp: commercialPlans.enterprise.monthlyPriceGbp,
    summary: 'Custom governance, SSO, integrations, usage, support, and rollout requirements.',
    features: commercialPlans.enterprise.includedFeatures,
  },
] as const

function SiteNav() {
  return (
    <nav>
      <Link href="/">FoundingOS</Link>
      <div className="site-nav-links">
        <Link href="/suites">Suites</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/workspaces">Workspaces</Link>
        <Link className="nav-test-workspaces" href="/test-workspaces">Test workspaces</Link>
        <Link href="/workspaces/marketing">Marketing</Link>
        <Link href="/intelligence">Intelligence</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <GlobalisationControls />
        <ThemeToggle />
      </div>
    </nav>
  )
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="hero single-column">
      <div className="hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  )
}

function SecondaryPage({ page, workspaceSlug }: { page: Exclude<FounderPage, 'home'>; workspaceSlug?: WorkspaceSlug }) {
  if ((page === 'workspaces' || page === 'consoles') && workspaceSlug) {
    const product = workspaceProducts.find((candidate) => candidate.slug === workspaceSlug)
    if (product) return <WorkspacePreview product={product} />
  }

  if (page === 'suites') return (
    <>
      <PageIntro eyebrow="Your business operating system" title="Three connected core suites" copy="An operating system is the shared foundation that keeps your teams, workflows, data, and decisions connected. Choose the layer your organisation needs now." />
      <section className="module-grid">
        {suiteCards.map((suite) => (
          <article id={suite.name.split('.')[1].toLowerCase()} key={suite.name} className="card-premium" style={{ borderTop: `3px solid ${suite.accent}` }}>
            <p className="eyebrow">Suite</p><h2>{suite.name}</h2><p>{suite.summary}</p>
            <Link className="btn btn-secondary" href={suite.name === 'Core.Intelligence' ? '/intelligence' : '/workspaces'}>Explore capabilities</Link>
          </article>
        ))}
      </section>
    </>
  )

  if (page === 'workspaces' || page === 'consoles') return (
    <>
      <PageIntro eyebrow="One account · Modular workspaces" title="Every part of the business, inside one FoundingOS" copy="Retail, Logistics, Finance, Marketing, Talent, and Health are connected workspaces—not separate products or operating systems. Your team signs into one account and sees the workspaces their role and plan enable." />
      <section className="module-grid">
        {workspaceCards.map((workspace, index) => (
          <article id={workspace.name.split(' ')[0].toLowerCase()} key={workspace.name} className="card-premium">
            <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p><h2>{workspace.name}</h2><p>{workspace.summary}</p>
            <p>Connected to the Event Feed, Insights Panel, shared permissions, and suite-wide navigation.</p>
            <Link className="btn btn-primary" href={`/test-workspaces/${workspace.name.split(' ')[0].toLowerCase()}`}>Test workspace</Link>
            <Link className="text-link" href={workspace.href}>View capabilities</Link>
          </article>
        ))}
        <article id="marketing" className="card-premium">
          <p className="eyebrow">06</p><h2>Marketing Workspace</h2>
          <p>Campaigns, audiences, brand-aware content, publishing, conversion, and revenue attribution.</p>
          <Link className="btn btn-primary" href="/test-workspaces/marketing">Test workspace</Link>
          <Link className="text-link" href="/workspaces/marketing">View capabilities</Link>
        </article>
      </section>
    </>
  )

  if (page === 'marketing') return (
    <>
      <PageIntro
        eyebrow="Marketing Workspace · Core Operations"
        title="Turn business activity into campaigns that drive revenue"
        copy="Marketing was not removed. It is part of Core Operations, connecting customer records, products, promotions, orders, channels, and campaign results in one operating workflow."
      />
      <div className="hero-actions">
        <Link className="btn btn-primary" href="/test-workspaces/marketing">Test Marketing workspace</Link>
      </div>
      <section className="marketing-flow">
        {[
          ['01', 'Choose an objective', 'Start with repeat purchases, product launches, stock movement, customer reactivation, or local awareness.'],
          ['02', 'Build the audience', 'Use first-party customer and order data to select a relevant audience without external scraping.'],
          ['03', 'Create channel content', 'Prepare campaign ideas, captions, hashtags, ad copy, WhatsApp messages, email, and social content.'],
          ['04', 'Schedule and approve', 'Save drafts, schedule channel posts, use approval workflows, and control automatic publishing.'],
          ['05', 'Connect results to revenue', 'Track impressions, engagements, conversions, attributed revenue, and operational follow-up.'],
          ['06', 'Stay on brand everywhere', 'Brand Studio applies your approved logo, colours, typography, company details, and voice to campaigns, orders, and invoices.'],
        ].map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}
      </section>

      <section className="product-preview marketing-preview" aria-label="Marketing Workspace sample">
        <aside className="preview-sidebar">
          <div className="preview-brand"><span>F</span><strong>FoundingOS</strong></div>
          <p>Marketing Workspace</p>
          <ul>{['Overview', 'Campaigns', 'Audiences', 'Content studio', 'Publishing calendar', 'Analytics'].map((module, index) => <li className={index === 0 ? 'active' : ''} key={module}>{module}</li>)}</ul>
        </aside>
        <div className="preview-workspace">
          <header><div><p className="eyebrow">Campaign command centre</p><h2>Marketing overview</h2></div><span className="demo-badge">Sample data</span></header>
          <div className="preview-metrics">
            <article><p>Campaigns live</p><strong>12</strong><span>+3 this week</span></article>
            <article><p>Reach</p><strong>48.2k</strong><span>+6%</span></article>
            <article><p>Conversion</p><strong>3.8%</strong><span>Revenue connected</span></article>
          </div>
          <div className="preview-panels">
            <article>
              <div className="panel-heading"><div><p className="eyebrow">Publishing calendar</p><h3>Campaign queue</h3></div><span>3 ready</span></div>
              <div className="work-queue">
                <div><span className="status-dot status-insight" /><div><strong>Restock announcement</strong><p>WhatsApp · Returning customers · Today 14:00</p></div><small>Approved</small></div>
                <div><span className="status-dot" /><div><strong>Weekend bundle</strong><p>Instagram + Facebook · Local audience · Friday</p></div><small>Review</small></div>
                <div><span className="status-dot status-action" /><div><strong>Customer win-back</strong><p>Email · Inactive 30 days · Draft</p></div><small>Draft</small></div>
              </div>
            </article>
            <article className="insight-card"><p className="eyebrow">Core Intelligence</p><h3>Recommended campaign</h3><p>Promote the newly replenished staple bundle to 186 customers who previously purchased it and have not ordered this month.</p><button type="button">Create campaign draft</button></article>
          </div>
        </div>
      </section>

      <WorkflowWalkthrough />

      <section className="module-grid">
        {(Object.entries(marketingPlanFeatures) as Array<[keyof typeof marketingPlanFeatures, string[]]>).map(([tier, features]) => (
          <article key={tier} className="card-premium">
            <p className="eyebrow">{tier === 'lite' ? 'Free' : tier}</p>
            <h2>{tier[0].toUpperCase() + tier.slice(1)} marketing</h2>
            <ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <Link className="btn btn-primary" href="/pricing">Compare plans</Link>
          </article>
        ))}
      </section>

      <section className="product-explainer">
        <article><p className="eyebrow">Channels</p><h2>Meet customers where they are</h2><p>WhatsApp, email, Facebook, Instagram, LinkedIn, and X publishing workflows are represented in the current product.</p></article>
        <article><p className="eyebrow">First-party data</p><h2>No scraping dependency</h2><p>Audiences and recommendations use your own customers, products, orders, campaign activity, and operational events.</p></article>
        <article><p className="eyebrow">Connected operations</p><h2>Marketing that can fulfil</h2><p>Campaign demand can be checked against inventory, fulfilment capacity, invoices, payments, and customer history. Brand Studio keeps every customer-facing output consistent.</p></article>
      </section>
    </>
  )

  if (page === 'intelligence') return (
    <>
      <PageIntro eyebrow="Core.Intelligence" title="From operating events to clear action" copy="FoundingOS turns cross-suite signals into predictions, risk flags, anomalies, and workflow suggestions." />
      <div className="hero-actions">
        <Link className="btn btn-primary" href="/test-workspaces/intelligence">Test Intelligence workspace</Link>
      </div>
      <section className="module-grid">
        {operatingLayers.map((layer) => <article key={layer.label} className="card-premium"><p className="eyebrow">{layer.value}</p><h2>{layer.label}</h2><p>{layer.detail}</p></article>)}
      </section>
    </>
  )

  if (page === 'pricing') return (
    <>
      <PageIntro eyebrow="Modular pricing" title="Start with one core. Connect the whole OS." copy="Packages are modular so buyers can begin with the operating capability they need and add shared intelligence as they grow." />
      <section className="module-grid">
        {packagePlans.map((plan) => (
          <article key={plan.name} className="card-premium">
            <p className="eyebrow">{plan.priceGbp === null ? 'Custom' : plan.priceGbp === 0 ? 'Free' : <><LocalizedGbp amount={plan.priceGbp} />/month</>}</p>
            <h2>{plan.name}</h2>
            <p>{plan.summary}</p>
            <h3>What you access</h3>
            <ul>{commercialPlans[plan.name.toLowerCase() as keyof typeof commercialPlans].access.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Enabled workspaces</h3>
            <ul>{commercialPlans[plan.name.toLowerCase() as keyof typeof commercialPlans].includedWorkspaces.map((item) => <li key={item}>{item}</li>)}</ul>
            <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <Link className="btn btn-primary" href="/contact">{plan.name === 'Lite' ? 'Start with Lite' : 'Talk to FoundingOS'}</Link>
          </article>
        ))}
        <article className="card-premium">
          <p className="eyebrow"><LocalizedGbp amount={commercialAddOns.languagePack.monthlyPriceGbp} />/month on Lite</p>
          <h2>{commercialAddOns.languagePack.name}</h2>
          <p>{commercialAddOns.languagePack.description} Included at no extra cost from Starter upward.</p>
        </article>
      </section>
    </>
  )

  if (page === 'about') return (
    <>
      <PageIntro eyebrow="About FoundingOS" title="One operating system for emerging-market businesses" copy="FoundingOS is a business operating system: it unifies commerce, logistics, finance, workforce, and health operations without forcing teams into disconnected point tools." />
      <section className="module-grid">
        <article><h2>Shared by design</h2><p>Identity, permissions, telemetry, events, and intelligence are common infrastructure—not duplicated integrations.</p></article>
        <article><h2>Built for real workflows</h2><p>WhatsApp, mobile money, intermittent connectivity, and cross-team handoffs are part of the operating model.</p></article>
        <article><h2>Clear architecture</h2><p>Core.Operations, Core.Workforce, and Core.Intelligence remain the stable product architecture.</p></article>
      </section>
    </>
  )

  return (
    <>
      <PageIntro eyebrow="Contact" title="See FoundingOS around your operating model" copy="Tell us which workflows, markets, and teams you need to connect. We will map the right suite configuration." />
      <section className="module-grid">
        <article><h2>Product and partnerships</h2><p>Email <a className="text-link" href="mailto:hello@foundingos.com">hello@foundingos.com</a> to request a walkthrough, integration discussion, or acquisition package.</p></article>
        <article><h2>What to include</h2><p>Your operating verticals, current systems, target markets, and the workflow you most want to simplify.</p></article>
      </section>
    </>
  )
}

export function FounderLauncher({ page = 'home', workspaceSlug, consoleSlug }: { page?: FounderPage; workspaceSlug?: WorkspaceSlug; consoleSlug?: ConsoleSlug }) {
  return (
    <GlobalisationProvider>
    <main className="site-shell" style={{ ['--accent' as any]: '#24C47A' }}>
      <SiteNav />

      {page !== 'home' ? <SecondaryPage page={page} workspaceSlug={workspaceSlug ?? consoleSlug} /> : <>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">One operating system for your business</p>
          <h1>FoundingOS</h1>
          <p>
            OS means <strong>Operating System</strong>: run Retail, Logistics, Finance, Marketing,
            Talent, and Health from one connected platform—starting with WhatsApp.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/#how-it-works">See how it works</Link>
            <Link className="btn btn-secondary" href="/intelligence">Open Intelligence</Link>
            <Link className="btn btn-secondary" href="/workspaces/marketing">Explore Marketing</Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="FoundingOS OS suite overview">
          <div className="hero-panel card-premium glow-premium" style={{ background: 'linear-gradient(135deg, rgba(16,151,105,0.98), rgba(37,99,235,0.94) 58%, rgba(124,58,237,0.9))' }}>
            <span>Your business operating system</span>
            <strong>FoundingOS</strong>
            <ul>
              <li>Core.Operations</li>
              <li>Core.Workforce</li>
              <li>Core.Intelligence</li>
              <li>Shared Event Feed</li>
              <li>Shared Insights Panel</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="messaging-first">
        <div className="messaging-first-copy">
          <p className="eyebrow">WhatsApp-first by design</p>
          <h2>Run the business from the conversation your team already opens.</h2>
          <p>FoundingOS connects everyday messages to the same customers, orders, deliveries, invoices, campaigns, and operating events used by every workspace. People can work through familiar conversations while FoundingOS keeps the structured system of record behind them.</p>
          <div className="channel-pills" aria-label="Messaging channel direction">
            <span className="channel-live">WhatsApp · first</span>
            <span>Telegram · planned</span>
            <span>SMS · planned</span>
            <span>Messenger · planned</span>
            <span>Instagram · planned</span>
          </div>
        </div>
        <div className="messaging-status">
          <article>
            <span>Implemented foundation</span>
            <strong>Meta WhatsApp Cloud API</strong>
            <p>Verified webhook security and authenticated outbound text delivery are wired. Each business connects its approved Meta credentials.</p>
          </article>
          <article>
            <span>One operational record</span>
            <strong>Chat becomes structured work</strong>
            <p>Messaging actions can connect to delivery notifications, campaigns, customers, orders, and the shared Event Feed.</p>
          </article>
          <article>
            <span>Channel-ready architecture</span>
            <strong>More than one inbox</strong>
            <p>Telegram and other channels follow the same adapter contract as their production provider connections are completed.</p>
          </article>
        </div>
      </section>

      <MessagingDemo />

      <section className="module-grid">
        {suiteCards.map((suite) => (
          <article key={suite.name} className="card-premium" style={{ borderTop: `3px solid ${suite.accent}` }}>
            <p className="eyebrow">Suite</p>
            <h2>{suite.name}</h2>
            <p>{suite.summary}</p>
            <Link className="btn btn-secondary" href={suite.href}>Explore</Link>
          </article>
        ))}
      </section>

      <section className="module-grid">
        {workspaceCards.map((workspace, index) => (
          <article key={workspace.name} className="card-premium">
            <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
            <h2>{workspace.name}</h2>
            <p>{workspace.summary}</p>
            <Link className="btn btn-primary" href={`/test-workspaces/${workspace.name.split(' ')[0].toLowerCase()}`}>Test workspace</Link>
            <Link className="text-link" href={workspace.href}>View capabilities</Link>
          </article>
        ))}
      </section>

      <section className="module-grid">
        <article className="card-premium" style={{ borderTop: '3px solid #EC4899' }}>
          <p className="eyebrow">Core Operations workspace</p>
          <h2>Marketing Workspace</h2>
          <p>Campaigns, audiences, channel content, scheduling, analytics, and revenue attribution connected to live operations.</p>
          <Link className="btn btn-primary" href="/test-workspaces/marketing">Test workspace</Link>
          <Link className="text-link" href="/workspaces/marketing">View capabilities</Link>
        </article>
        {operatingLayers.map((layer) => (
          <article key={layer.label} className="card-premium">
            <p className="eyebrow">{layer.value}</p>
            <h2>{layer.label}</h2>
            <p>{layer.detail}</p>
          </article>
        ))}
      </section>

      <WorkflowWalkthrough />

      <section className="module-grid">
        {packagePlans.map((plan) => (
          <article key={plan.name} className="card-premium">
            <p className="eyebrow">{plan.priceGbp === null ? 'Custom' : plan.priceGbp === 0 ? 'Free' : <><LocalizedGbp amount={plan.priceGbp} />/month</>}</p>
            <h2>{plan.name}</h2>
            <p>{plan.summary}</p>
          </article>
        ))}
      </section>

      </>}

      <footer className="site-footer">
        <div>
          <strong>FoundingOS</strong>
          <p>Shared operating stack for market-facing operations, workforce, and intelligence.</p>
        </div>
      </footer>
    </main>
    </GlobalisationProvider>
  )
}

export function BrandMarketingPage() {
  return <FounderLauncher />
}

export function MarketingPage() {
  return <FounderLauncher />
}

export default function HomePage() {
  return <FounderLauncher />
}
