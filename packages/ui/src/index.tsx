/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { FoundAI } from './found-ai'
import { PremiumSocialLinks } from './social-links'
import { ThemeToggle } from './theme'
import { QuantumConsoleEntry } from './quantum-console-modal'
import { QuantumSphereLogo } from './QuantumSphereLogo'
import { CORE_MODULES } from '@foundingos/config/modules'
// Real, env-var-driven brand config (webUrl/consoleUrl/etc. read from each deployed
// app's NEXT_PUBLIC_*_URL vars, with the localhost-safety wrapper already applied).
// This replaces a previously-local, fully-hardcoded duplicate of this same data that
// never read any env var — every "Website"/"Console" link on this page was silently
// pointing at localhost in every production deployment until this fix.
import { brands, brandList, LOCKED_BRAND_COLORS, type BrandSlug, type BrandDefinition } from '@foundingos/config'
import { DEMO_BRAND_CARDS, getQuantumBrandUplift, type QuantumDemoBrandCard } from '@foundingos/config/quantum-brand-uplift'
import { QuantumBrandUpliftPanel } from './quantum-brand-uplift'
import { WebBrandModulePanel, WebBrandWheel, WebTutorialSystem } from './quantum-web-mirror'

type ComponentChildren = any
const consoleDashboardUrl = (brand: BrandDefinition) => brand.consoleUrl.replace(/\/+$/, '')
const isInternalHref = (href: string) => href.startsWith('/') || href.startsWith('#')
const signupOptions = [
  { label: 'Google account signup', href: '#google' },
  { label: 'Apple account signup', href: '#apple' },
  { label: 'Email signup', href: '#email' },
] as const

const founderPackages = [
  { slug: 'quantumos', name: 'QuantumOS', price: '£149/mo', description: 'The full FoundingOS command layer for leaders who want every brand, workflow, and AI decision in one view.', features: ['Portfolio command center', 'Globalisation controls', 'FoundAI orchestration', 'Cross-brand reporting'] },
  { slug: 'intelligenceos', name: 'IntelligenceOS', price: '£99/mo', description: 'Sharper analytics and automated context for teams that need more signal and less manual review.', features: ['Live analytics', 'Decision snapshots', 'Context-aware alerts', 'Shared task queues'] },
  { slug: 'systemos', name: 'SystemOS', price: '£59/mo', description: 'A practical control stack for setup, structure, and team access across the core platform.', features: ['Workspace setup', 'Access governance', 'Brand scaffolding', 'Workflow templates'] },
] as const

const founderPackageUrl = (slug: string) => `${brands.foundingos.consoleUrl.replace(/\/+$/, '')}/console/packages/${slug}`
const foundingOsConsoleUrl = brands.foundingos.consoleUrl.replace(/\/+$/, '')
const founderDemoUrl = (route: string) => `${foundingOsConsoleUrl}${route}`

const brandConsideration: Record<BrandSlug, { painPoints: string[]; outcomes: string[]; reasons: string[] }> = {
  foundingos: { painPoints: [], outcomes: [], reasons: [] },
  retail: {
    painPoints: ['Stock levels are always a guess', 'Customer messages get lost across channels', 'Order and supplier data live in different systems'],
    outcomes: ['Real-time stock visibility', 'One inbox for every channel', 'Orders, stock, and suppliers in one view'],
    reasons: ['Retail moves too fast for spreadsheets', 'Customers expect instant replies everywhere', 'Store teams need one place to work from'],
  },
  meat: {
    painPoints: ['Cold chain compliance is hard to prove', 'Supplier lead times are unpredictable', 'Spoilage risk is spotted too late'],
    outcomes: ['Live cold chain compliance tracking', 'Supplier performance visibility', 'Early spoilage risk alerts'],
    reasons: ['Trade margins are thin and unforgiving', 'Compliance failures are costly', 'Supply timing changes daily'],
  },
  foundthat: {
    painPoints: ['Discovery signals are scattered', 'Lead capture is inconsistent', 'Data quality erodes trust in reports'],
    outcomes: ['Unified market intelligence', 'Consistent lead capture', 'Clean, trusted reporting data'],
    reasons: ['Local discovery needs constant signal', 'Leads are lost without fast follow-up', 'Bad data leads to bad decisions'],
  },
  talent: {
    painPoints: ['Hiring pipelines stall without visibility', 'Recruiter and candidate data live apart', 'Workforce demand is hard to forecast'],
    outcomes: ['Full pipeline visibility', 'Recruiters and candidates in one system', 'Workforce demand forecasting'],
    reasons: ['Time-to-hire directly costs revenue', 'Candidates expect a smooth process', 'Workforce planning needs real data'],
  },
  crypto: {
    painPoints: ['Market signals move faster than manual review', 'Wallets and exchanges are hard to track together', 'Risk exposure is discovered too late'],
    outcomes: ['Live market signal monitoring', 'Unified wallet and exchange view', 'Early risk exposure alerts'],
    reasons: ['Volatility punishes slow reactions', 'Portfolios span multiple platforms', 'Risk control needs to be continuous'],
  },
  finance: {
    painPoints: ['Cashflow visibility lags reality', 'Invoicing and reconciliation take too long', 'Financial risk is spotted after the fact'],
    outcomes: ['Real-time cashflow visibility', 'Faster invoicing and reconciliation', 'Earlier financial risk detection'],
    reasons: ['Cash position drives every decision', 'Manual reconciliation doesn\u2019t scale', 'Risk needs to be caught early, not late'],
  },
  health: {
    painPoints: ['Scheduling gaps hurt patient access', 'Records are hard to keep accurate and current', 'Compliance reporting takes too much manual effort'],
    outcomes: ['Smarter appointment scheduling', 'Accurate, current patient records', 'Streamlined compliance reporting'],
    reasons: ['Patient access depends on smooth scheduling', 'Records must be accurate and available', 'Compliance is non-negotiable'],
  },
  logistics: {
    painPoints: ['Fleet visibility is incomplete', 'Route delays are caught too late', 'Warehousing and deliveries are hard to coordinate'],
    outcomes: ['Full fleet visibility', 'Earlier route delay detection', 'Coordinated warehousing and delivery'],
    reasons: ['Delivery delays cost customer trust', 'Fleet utilisation drives margin', 'Warehousing and routes must stay in sync'],
  },
}

function consoleTitle(brand: BrandDefinition) {
  switch (brand.slug) {
    case 'retail':
      return 'Retail Manager Console'
    case 'meat':
      return 'Meat Operations Console'
    case 'talent':
      return 'Talent Command Console'
    case 'crypto':
      return 'Crypto Command Console'
    default:
      return `${brand.name} Console`
  }
}

function brandBadge(brand: BrandDefinition) {
  switch (brand.slug) {
    case 'retail':
      return '◉'
    case 'meat':
      return '◆'
    case 'talent':
      return '⬢'
    case 'crypto':
      return '∞'
    default:
      return '⌂'
  }
}

function DemoPreviewCard({ demo }: { demo: QuantumDemoBrandCard }) {
  const sourceBrand = brands[demo.sourceBrandSlug]
  const uplift = getQuantumBrandUplift(demo.sourceBrandSlug)
  const fallbackImage = uplift.demo.images[0] ?? demo.previewImage
  return (
    <article className="card-premium founder-demo-card">
      <div className="founder-demo-preview">
        <img src={founderDemoUrl(fallbackImage)} alt={`${demo.title} preview`} />
      </div>
      <div className="founder-demo-copy">
        <p className="eyebrow">{sourceBrand.name}</p>
        <h2>{demo.title}</h2>
        <p>{demo.description}</p>
      </div>
      <a className="btn btn-primary btn-premium founder-demo-cta" href={founderDemoUrl(demo.route)}>
        Open demo
      </a>
    </article>
  )
}

function consoleStyle(brand: BrandDefinition): React.CSSProperties {
  return {
    '--accent': brand.accent,
  } as React.CSSProperties
}

function kpiWidgets(brand: BrandDefinition) {
  const widgets: Record<string, Array<{ label: string; value: string; trend: string; icon: string; tone: 'good' | 'watch' | 'risk' }>> = {
    retail: [
      { label: 'Sales', value: '£18.6k', trend: 'Today', icon: '£', tone: 'good' },
      { label: 'Orders', value: '142', trend: 'Open', icon: '▦', tone: 'watch' },
      { label: 'Stock Levels', value: '87%', trend: 'Healthy', icon: '◍', tone: 'good' },
    ],
    meat: [
      { label: 'Batch Quality', value: '97%', trend: 'Audit ready', icon: '✓', tone: 'good' },
      { label: 'Logistics Status', value: '9 live', trend: 'In transit', icon: '▦', tone: 'watch' },
      { label: 'Compliance %', value: '96%', trend: 'Within limits', icon: '◌', tone: 'good' },
    ],
    it: [
      { label: 'System Health', value: '99.98%', trend: '30 days', icon: '✓', tone: 'good' },
      { label: 'Alerts', value: '6', trend: '2 critical', icon: '!', tone: 'risk' },
      { label: 'Data Throughput', value: '1.8M', trend: 'events/day', icon: '▦', tone: 'good' },
    ],
    talent: [
      { label: 'Applicants', value: '1,284', trend: 'Active', icon: '◍', tone: 'good' },
      { label: 'Jobs Active', value: '38', trend: 'Hiring', icon: '▦', tone: 'watch' },
      { label: 'Recruiter Pipeline', value: '72%', trend: 'Moving', icon: '◌', tone: 'good' },
    ],
    crypto: [
      { label: 'Wallet Balance', value: '£284k', trend: '+4.8%', icon: '£', tone: 'good' },
      { label: 'Trigger Activity', value: '26', trend: 'Open', icon: '▦', tone: 'watch' },
      { label: 'Automation Status', value: '92%', trend: 'Live', icon: '◍', tone: 'good' },
    ],
    foundingos: [
      { label: 'Platforms Live', value: '5', trend: 'Connected', icon: '◍', tone: 'good' },
      { label: 'Modules Active', value: '48', trend: 'Across brands', icon: '▦', tone: 'watch' },
      { label: 'Open Actions', value: '24', trend: 'Needs review', icon: '!', tone: 'risk' },
    ],
  }
  return widgets[brand.slug] ?? widgets.foundingos
}

function OdometerKPI({ metric, index }: { metric: { label: string; value: string; trend: string; icon: string; tone: 'good' | 'watch' | 'risk' }; index: number }) {
  const fill = [86, 72, 61][index % 3]
  return (
    <article className={`dashboard-card ${metric.tone}`}>
      <span>{metric.icon} {metric.label}</span>
      <strong className="odometer">{metric.value}</strong>
      <div className="odometer-track" aria-hidden="true">
        <span className="odometer-fill" style={{ '--odometer-fill': `${fill}%` } as React.CSSProperties} />
      </div>
      <small>{metric.trend}</small>
    </article>
  )
}

export function Button({ href, children, variant = 'primary' }: { href?: string; children: ComponentChildren; variant?: 'primary' | 'secondary' }) {
  const className = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'
  if (!href) return <button className={className}>{children}</button>
  return isInternalHref(href) ? <Link className={className} href={href}>{children}</Link> : <a className={className} href={href}>{children}</a>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className || ''}`} />
}

export function Modal({ title, children }: { title: string; children: ComponentChildren }) {
  return <div className="modal"><section><h2>{title}</h2>{children}</section></div>
}

export function Topbar({ brand }: { brand: BrandDefinition }) {
  return (
    <header className="topbar glow-premium" style={consoleStyle(brand)}>
      <div className="topbar-title">
        <QuantumSphereLogo size={28} />
        <div>
          <strong>{consoleTitle(brand)}</strong>
          <span>{brand.name} command center</span>
        </div>
      </div>
      <div className="topbar-actions">
        <ThemeToggle />
      </div>
    </header>
  )
}

export function Sidebar({ brand }: { brand: BrandDefinition }) {
  const moduleCards = brand.modules.map((module, index) => ({
    label: module,
    href: `/modules/${module.toLowerCase().replaceAll(' ', '-')}`,
    icon: ['▣', '◍', '◌', '◆'][index % 4],
    summary: `${module} live workspace`,
  }))

  const cards = [
    { label: 'Dashboard', href: '/dashboard', icon: '▦', summary: 'Live operating overview' },
    { label: 'CRM', href: '/crm', icon: '◎', summary: 'Pipeline and records' },
    ...moduleCards,
    { label: 'Settings', href: '/settings', icon: '⚙', summary: 'Brand controls' },
  ]

  return (
    <aside className="sidebar glow-premium" style={consoleStyle(brand)}>
      <Link className="sidebar-brand" href="/console">
        <QuantumSphereLogo size={38} />
        <div>
          <strong>{consoleTitle(brand)}</strong>
          <span>{brand.summary}</span>
        </div>
      </Link>
      <div className="nav-card-grid">
        {cards.map((card) => (
          <a key={card.href} className="nav-card" href={card.href}>
            <span className="nav-card-icon">{card.icon}</span>
            <div>
              <strong>{card.label}</strong>
              <p>{card.summary}</p>
            </div>
          </a>
        ))}
      </div>
    </aside>
  )
}

export function ConsoleShell({ brand, children }: { brand: BrandDefinition; children: ComponentChildren }) {
  return <div className="console-shell"><Sidebar brand={brand} /><main><Topbar brand={brand} /><div className="workspace">{children}</div></main></div>
}

const brandGradient = (brand: BrandDefinition) => {
  switch (brand.slug) {
    case 'crypto':
      return 'linear-gradient(135deg, color-mix(in srgb, #8E24AA 64%, var(--surface-strong)), color-mix(in srgb, #512DA8 32%, var(--surface)))'
    case 'meat':
      return 'linear-gradient(135deg, color-mix(in srgb, #C62828 64%, var(--surface-strong)), color-mix(in srgb, #7F1D1D 32%, var(--surface)))'
    case 'talent':
      return `linear-gradient(135deg, color-mix(in srgb, ${LOCKED_BRAND_COLORS.talent} 64%, var(--surface-strong)), color-mix(in srgb, ${LOCKED_BRAND_COLORS.talent} 32%, var(--surface)))`
    default:
      return `linear-gradient(135deg, color-mix(in srgb, ${brand.accent} 62%, var(--surface-strong)), color-mix(in srgb, ${brand.accent} 18%, var(--surface)))`
  }
}

export function BrandMarketingPage({ brand, page = 'home' }: { brand: BrandDefinition; page?: string }) {
  const headline = page === 'home' ? `${brand.name} for modern operators` : `${brand.name} ${page}`
  const dashboardLink = consoleDashboardUrl(brand)
  const packagePlans = founderPackages
  const accentStyle = { '--accent': brand.accent, '--accent-secondary': brand.slug === 'crypto' ? '#512DA8' : brand.accent } as React.CSSProperties

  return (
    <main className="site-shell" style={accentStyle}>
      <nav>
        <Link href="/">{brand.name}</Link>
        <div className="site-nav-links">
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          {isInternalHref(dashboardLink) ? <Link href={dashboardLink}>Dashboard</Link> : <a href={dashboardLink}>Dashboard</a>}
          <ThemeToggle />
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{brand.legalName}</p>
          <h1>{headline}</h1>
          <p>{brand.summary}</p>
          <div className="hero-actions">
          <Link href={founderPackageUrl(packagePlans[0]?.slug ?? 'quantumos')} className="btn btn-primary">Choose your package</Link>
            {isInternalHref(dashboardLink) ? <Link href={dashboardLink} className="btn btn-secondary">Chat with FoundAI</Link> : <a href={dashboardLink} className="btn btn-secondary">Chat with FoundAI</a>}
          </div>
        </div>

        <div className="hero-visual" aria-label={`${brand.name} overview`}>
          <div className="hero-panel card-premium glow-premium" style={{ background: brandGradient(brand) }}>
            <span>Brand operating layer</span>
            <strong>{brand.name}</strong>
            <ul>
              {brand.modules.map((module) => <li key={module}>{module}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <QuantumBrandUpliftPanel brand={brand} />

      <section id="pricing" className="module-grid">
        {packagePlans.map((plan) => (
          <article key={plan.slug} className="card-premium">
            <p className="eyebrow">{plan.price}</p>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <Link className="btn btn-primary btn-premium" href={founderPackageUrl(plan.slug)}>Open {plan.name}</Link>
          </article>
        ))}
      </section>
      <section id="signup" className="module-grid">
        <article className="card-premium">
          <h2 className="header-premium">Sign up your team</h2>
          <p>Choose the account method that fits the business best, then continue into the console onboarding flow.</p>
          <div className="signup-grid">
            {signupOptions.map((option) => <a key={option.label} href={option.href} className="signup-chip">{option.label}</a>)}
          </div>
        </article>
      </section>
      <section id="contact" className="module-grid">
        <article className="card-premium">
          <h2 className="header-premium">Connect with {brand.name}</h2>
          <p>Use the same social and messaging channels as the rest of the FoundingOS ecosystem.</p>
          <PremiumSocialLinks accent={brand.accent} mode="inline" label="Social & messaging" />
        </article>
      </section>
      <footer className="site-footer">
        <PremiumSocialLinks accent={brand.accent} mode="full" label="Social & messaging" />
      </footer>
      <FoundAI brand={brand} />
    </main>
  )
}

export function MarketingPage({ brand, page = 'home' }: { brand: BrandDefinition; page?: string }) {
  return <BrandMarketingPage brand={brand} page={page} />
}

export function FounderLauncher() {
  const foundAiActions = ['Open Retail dashboard', 'Check Meat compliance', 'Review FoundThat market intel', 'Find Talent candidates', 'Show Crypto wallet balance']
  const packagePlans = founderPackages

  return (
    <main className="site-shell founder-shell" style={{ '--accent': LOCKED_BRAND_COLORS.foundingos } as React.CSSProperties}>
      <nav className="quantum-header quantum-ambient-grid">
        <Link href="/">FoundingOS</Link>
        <div className="quantum-header-links">
          <a href="#top">Home</a>
          <a href="#pricing">Intelligence</a>
          <a href="#found-ai">Insights</a>
          {/* Real one-click path into the console's full Demo & Survey Switcher hub (every
              real module demo + every survey, exactly like admin/testers already see once
              inside) — an already-authenticated session (admin or tester; the session cookie
              is shared across .foundingos.com) goes straight there; a signed-out visitor is
              safely bounced to the real sign-in page by the console's own middleware, so this
              link is never a broken/unsafe shortcut either way. */}
          <a href={`${brands.foundingos.consoleUrl}/tester/dashboard`}>Console</a>
          <a href="#contact">Support</a>
        </div>
        <div className="site-nav-links">
          <ThemeToggle />
        </div>
      </nav>
      <section className="hero quantum-ambient-grid" id="top">
        <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
        <div className="hero-copy">
          <p className="eyebrow">FoundingOS</p>
          <h1>One ecosystem. Every brand connected.</h1>
          <p className="quantum-positioning-statement">FoundingOS — The Operating System for WhatsApp, Telegram, and global message-based businesses.</p>
          <p>Launch brand websites, govern subscriptions, and manage the shared SaaS platform from a single command layer.</p>
          <p className="quantum-hero-promise">Powered by Quantum intelligence — real-time signals, always on.</p>
        </div>
        <div className="hero-visual" aria-label="FoundingOS overview">
          <div className="hero-panel card-premium glow-premium quantum-card" style={{ background: brandGradient(brands.foundingos) }}>
            <span className="quantum-corner-marker">⌂</span>
            <span>Platform hub</span>
            <strong>FoundingOS</strong>
            <ul>{brandList.filter((brand) => brand.slug !== 'foundingos').map((brand) => <li key={brand.slug}>{brand.name}</li>)}</ul>
          </div>
        </div>
      </section>
      <section id="why-foundingos" className="module-grid">
        <article className="card-premium" style={{ gridColumn: '1 / -1' }}>
          <h2 className="header-premium">Why FoundingOS Exists</h2>
          <p>Growing businesses hit the same wall — too many disconnected tools, no single source of truth, and no time left to actually run the business.</p>
        </article>
        <article className="card-premium quantum-card">
          <span className="quantum-corner-marker">⌂</span>
          <h3>The chaos problem</h3>
          <p>Too many tools, too many dashboards — teams lose hours just switching between systems that don't talk to each other.</p>
        </article>
        <article className="card-premium quantum-card">
          <span className="quantum-corner-marker">⌂</span>
          <h3>The fragmentation problem</h3>
          <p>Data silos and no single source of truth mean every team sees a different version of the same business.</p>
        </article>
        <article className="card-premium quantum-card">
          <span className="quantum-corner-marker">⌂</span>
          <h3>The intelligence gap</h3>
          <p>Without unified insights, decisions get made on gut feel instead of what's actually happening across the brand.</p>
        </article>
        <article className="card-premium quantum-card">
          <span className="quantum-corner-marker">⌂</span>
          <h3>The automation gap</h3>
          <p>Too much manual work still happens by hand, slowing teams down and leaving room for costly mistakes.</p>
        </article>
        <article className="card-premium quantum-card">
          <span className="quantum-corner-marker">⌂</span>
          <h3>The control problem</h3>
          <p>Businesses feel overwhelmed, reacting to problems instead of steering the brand with confidence.</p>
        </article>
      </section>
      <section id="pricing" className="module-grid">
        {packagePlans.map((plan) => (
          <article key={plan.slug} className="card-premium">
            <p className="eyebrow">{plan.price}</p>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <Link className="btn btn-primary btn-premium" href={founderPackageUrl(plan.slug)}>Open {plan.name}</Link>
          </article>
        ))}
      </section>
      <section id="signup" className="module-grid">
        <article className="card-premium">
          <h2 className="header-premium">Sign up your team</h2>
          <p>Pick the account method that suits the rollout and continue into FoundingOS onboarding.</p>
          <div className="signup-grid">
            {signupOptions.map((option) => <a key={option.label} href={option.href} className="signup-chip">{option.label}</a>)}
          </div>
        </article>
      </section>
      <WebBrandWheel />
      <section id="brand-demos" className="module-grid founder-demo-menu">
        <article className="card-premium founder-demo-intro">
          <h2 className="header-premium">FoundingOS brand demos</h2>
          <p>Preview every brand demo before entering the guided Quantum walkthrough.</p>
        </article>
        {DEMO_BRAND_CARDS.map((demo) => <DemoPreviewCard key={demo.id} demo={demo} />)}
      </section>
      <WebTutorialSystem />
      <section id="found-ai" className="founder-found-ai-intro">
        <div className="founder-found-ai-avatar">F</div>
        <div className="founder-found-ai-copy">
          <p className="eyebrow">FoundAI</p>
          <h2>Meet FoundAI.</h2>
          <p>FoundAI — The Best Onboarding Bot in the World.</p>
          <p>FoundAI wasn’t created to be another chatbot. It wasn’t designed to be a gimmick, a feature, or a support tool. FoundAI was created to solve the single biggest problem in business software: people hate onboarding, people hate learning new systems, and people hate complicated dashboards.</p>
          <p>FoundingOS fixes that by giving every user — from retail staff to meat suppliers, recruiters, IT teams, crypto traders, and founders — one universal guide who knows exactly what they need.</p>
          <p>FoundAI is simple, huge-capable, friendly, approachable, human-first, and a co-founder rather than a tool. It handles onboarding, setup, training, workflows, tasks, and questions instantly.</p>
          <p>FoundAI is the assistant that makes FoundingOS usable by SMEs, large companies, suppliers, retail staff, job seekers, recruiters, IT teams, crypto traders, and founders. It is the best onboarding assistant in the world, and it is the heart of the entire FoundingOS ecosystem.</p>
          <div className="hero-actions">
            {isInternalHref(`${consoleDashboardUrl(brands.foundingos)}/console`)
              ? <Link className="btn btn-primary btn-premium" href={`${consoleDashboardUrl(brands.foundingos)}/console`}>Meet FoundAI</Link>
              : <a className="btn btn-primary btn-premium" href={`${consoleDashboardUrl(brands.foundingos)}/console`}>Meet FoundAI</a>}
          </div>
        </div>
        <div className="founder-found-ai-actions">
          {foundAiActions.map((action) => <button key={action} type="button" className="found-ai-chip">{action}</button>)}
        </div>
      </section>
      <section className="module-grid">
        {brandList.filter((brand) => brand.slug !== 'foundingos').map((brand) => (
          <article key={brand.slug} className="card-premium brand-directory-card">
            <QuantumSphereLogo size={48} />
            <h2>{brand.name}</h2>
            <p>{brand.summary}</p>
            <details className="brand-read-more">
              <summary>Read more</summary>
              <div className="consideration-grid">
                <div>
                  <p className="quantum-nav-desc"><strong>Pain points</strong></p>
                  <ul>{brandConsideration[brand.slug].painPoints.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
                <div>
                  <p className="quantum-nav-desc"><strong>Outcomes</strong></p>
                  <ul>{brandConsideration[brand.slug].outcomes.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
                <div>
                  <p className="quantum-nav-desc"><strong>Why this console exists</strong></p>
                  <ul>{brandConsideration[brand.slug].reasons.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </div>
            </details>
            <WebBrandModulePanel brand={brand} />
            <div className="hero-actions">
              <a className="btn btn-primary btn-premium founder-demo-cta" href={founderDemoUrl(`/demo/${brand.slug}`)}>{brand.name} Demo</a>
              <QuantumConsoleEntry brandName={brand.name} glyph={brand.logo} starterUrl={brand.starterConsoleUrl} growthUrl={brand.consoleUrl} />
            </div>
          </article>
        ))}
      </section>
      <section id="core-modules" className="module-grid">
        <article className="card-premium" style={{ gridColumn: '1 / -1' }}>
          <h2 className="header-premium">Core Modules</h2>
          <p>Every console in the FoundingOS ecosystem ships with these core modules.</p>
        </article>
        {CORE_MODULES.map((moduleItem) => (
          <article key={moduleItem.id} className="card-premium premium-card premium-fade-in">
            <h2>{moduleItem.label}</h2>
            <p>{moduleItem.description}</p>
          </article>
        ))}
      </section>
      <section id="contact" className="module-grid">
        <article className="card-premium">
          <h2 className="header-premium">Connect with FoundingOS</h2>
          <p>Explore the full social and messaging network used throughout the platform.</p>
          <PremiumSocialLinks accent={LOCKED_BRAND_COLORS.foundingos} mode="inline" label="Social & messaging" />
        </article>
      </section>
      <footer className="site-footer">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 16, fontSize: 13 }}>
          <Link href="/legal">Legal &amp; Privacy</Link>
          <Link href="/contact">Contact &amp; Support</Link>
        </div>
        <PremiumSocialLinks accent={LOCKED_BRAND_COLORS.foundingos} mode="full" label="Social & messaging" />
      </footer>
      <FoundAI brand={brands.foundingos} />
    </main>
  )
}

export { PremiumSocialLinks } from './social-links'
export { QuantumSphereLogo } from './QuantumSphereLogo'
export { QuantumBrandUpliftPanel } from './quantum-brand-uplift'
export { WebBrandModulePanel, WebBrandWheel, WebCustomerJourney, WebTutorialSystem, WebUsedCarShop } from './quantum-web-mirror'

export function ConsoleDashboard({ brand }: { brand: BrandDefinition }) {
  const widgets = kpiWidgets(brand)
  return (
    <section className="stack" style={consoleStyle(brand)}>
      <header className="module-header">
        <p>{consoleTitle(brand)}</p>
        <h1>{brand.name} Dashboard</h1>
        <span>{brand.summary}</span>
      </header>
      <div className="kpi-grid">
        {widgets.map((metric, index) => <OdometerKPI key={metric.label} metric={metric} index={index} />)}
      </div>
      <div className="module-card-grid">
        {brand.modules.map((module, index) => (
          <Link key={module} className="module-card" href={`/modules/${module.toLowerCase().replaceAll(' ', '-')}`}>
            <div className="module-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{module}</strong>
            </div>
            <p>{module} live workspace with branded controls, summaries, and quick actions.</p>
            <div className="module-card-meta">
              <small>Live metrics</small>
              <small>Open queue</small>
            </div>
          </Link>
        ))}
      </div>
      <ActivityLog brand={brand} />
    </section>
  )
}

export function SettingsPage({ brand }: { brand: BrandDefinition }) {
  return (
    <section className="stack" style={consoleStyle(brand)}>
      <header className="module-header">
        <p>{consoleTitle(brand)}</p>
        <h1>{brand.name} Settings</h1>
        <span>Accent, access policy, billing, and module availability are controlled with brand isolation.</span>
      </header>
      <div className="settings-grid">
        <article className="panel"><h2>Access policy</h2><p>Manage workspace permissions and session rules.</p></article>
        <article className="panel"><h2>Automation</h2><p>Enable branded quick actions and alerts.</p></article>
        <article className="panel"><h2>Appearance</h2><p>Control theme surfaces and console glow.</p></article>
      </div>
    </section>
  )
}

export function ModulePage({ brand, moduleId }: { brand: BrandDefinition; moduleId: string }) {
  const moduleName = brand.modules.find((module) => module.toLowerCase().replaceAll(' ', '-') === moduleId) || moduleId
  return (
    <section className="stack" style={consoleStyle(brand)}>
      <header className="module-header">
        <p>{consoleTitle(brand)}</p>
        <h1>{moduleName}</h1>
        <span>{moduleName} is active for {brand.name}. Activity, permissions, and subscription limits are scoped to this brand.</span>
      </header>
      <div className="module-card-grid">
        <article className="module-card module-card-static">
          <strong>Operational summary</strong>
          <p>Live queue, approvals, and brand tasks are ready.</p>
        </article>
        <article className="module-card module-card-static">
          <strong>Quick actions</strong>
          <p>Open, review, and publish from the console.</p>
        </article>
      </div>
    </section>
  )
}

export function ActivityLog({ brand }: { brand: BrandDefinition }) {
  return (
    <div className="panel activity-panel">
      <h2>Activity log</h2>
      <ul>
        <li>{brand.name} workspace opened</li>
        <li>Subscription checked</li>
        <li>Module permissions refreshed</li>
      </ul>
    </div>
  )
}

export default function RemovedLogin() {
  return null
}
