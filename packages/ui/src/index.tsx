/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { BobAI } from './bob-ai'
import { PremiumSocialLinks } from './social-links'
import { ThemeToggle } from './theme'

type ComponentChildren = any
// Widened to match @foundingos/config's BrandSlug so BrandDefinition values from
// the config package remain structurally assignable to these component props.
type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'it' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'
type BrandDefinition = {
  slug: BrandSlug
  name: string
  legalName: string
  accent: string
  brandColors: { primary: string; accent: string }
  logo: string
  webUrl: string
  consoleUrl: string
  starterConsoleUrl: string
  dashboardUrl: string
  modules: string[]
  summary: string
}

const brands: Record<BrandSlug, BrandDefinition> = {
  foundingos: {
    slug: 'foundingos',
    name: 'FoundingOS',
    legalName: 'FoundingOS',
    accent: '#4A90E2',
    brandColors: { primary: '#4A90E2', accent: '#4A90E2' },
    webUrl: 'http://localhost:3000',
    consoleUrl: 'http://localhost:4000',
    starterConsoleUrl: 'http://localhost:4000',
    dashboardUrl: 'http://localhost:4000/console',
    logo: '⌂',
    modules: ['Brand Registry', 'Subscriptions', 'Activity', 'Access Control'],
    summary: 'The core command layer for the multi-brand SaaS ecosystem.',
  },
  retail: {
    slug: 'retail',
    name: 'FoundRetail',
    legalName: 'FoundRetail',
    accent: '#00C853',
    brandColors: { primary: '#00C853', accent: '#00C853' },
    webUrl: 'http://localhost:3001',
    consoleUrl: 'http://localhost:4002',
    starterConsoleUrl: 'http://localhost:4001',
    dashboardUrl: 'http://localhost:4002/dashboard',
    logo: '◉',
    modules: ['Customers', 'Inventory', 'Orders', 'Products'],
    summary: 'Retail operations for catalogues, customers, orders, and teams.',
  },
  meat: {
    slug: 'meat',
    name: 'FoundMeat',
    legalName: 'FoundMeat',
    accent: '#C62828',
    brandColors: { primary: '#C62828', accent: '#C62828' },
    webUrl: 'http://localhost:3002',
    consoleUrl: 'http://localhost:4004',
    starterConsoleUrl: 'http://localhost:4003',
    dashboardUrl: 'http://localhost:4004/dashboard',
    logo: '◆',
    modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'],
    summary: 'Trade and supply chain operating software for meat businesses.',
  },
  it: {
    slug: 'it',
    name: 'FoundThat',
    legalName: 'FoundThat',
    accent: '#2962FF',
    brandColors: { primary: '#2962FF', accent: '#2962FF' },
    webUrl: 'http://localhost:3003',
    consoleUrl: 'http://localhost:4006',
    starterConsoleUrl: 'http://localhost:4005',
    dashboardUrl: 'http://localhost:4006/dashboard',
    logo: '✦',
    modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'],
    summary: 'Discovery intelligence and data operations for local markets.',
  },
  talent: {
    slug: 'talent',
    name: 'FoundTalent',
    legalName: 'FoundTalent',
    accent: '#FFB300',
    brandColors: { primary: '#FFB300', accent: '#FFB300' },
    webUrl: 'http://localhost:3004',
    consoleUrl: 'http://localhost:4008',
    starterConsoleUrl: 'http://localhost:4007',
    dashboardUrl: 'http://localhost:4008/dashboard',
    logo: '⬢',
    modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'],
    summary: 'Hiring analytics and workforce intelligence for modern teams.',
  },
  crypto: {
    slug: 'crypto',
    name: 'FoundCrypto',
    legalName: 'FoundCrypto',
    accent: '#8E24AA',
    brandColors: { primary: '#8E24AA', accent: '#8E24AA' },
    webUrl: 'http://localhost:3005',
    consoleUrl: 'http://localhost:4010',
    starterConsoleUrl: 'http://localhost:4009',
    dashboardUrl: 'http://localhost:4010/dashboard',
    logo: '∞',
    modules: ['Charts', 'Signals', 'Automation', 'Risk'],
    summary: 'Crypto intelligence, monitoring, and automation control.',
  },
  finance: {
    slug: 'finance',
    name: 'FoundFinance',
    legalName: 'FoundFinance',
    accent: '#D4AF37',
    brandColors: { primary: '#D4AF37', accent: '#D4AF37' },
    webUrl: 'http://localhost:3006',
    consoleUrl: 'http://localhost:4012',
    starterConsoleUrl: 'http://localhost:4011',
    dashboardUrl: 'http://localhost:4012/dashboard',
    logo: '£',
    modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'],
    summary: 'Finance operations, cashflow visibility, and reconciliation tooling.',
  },
  health: {
    slug: 'health',
    name: 'FoundHealth',
    legalName: 'FoundHealth',
    accent: '#00A896',
    brandColors: { primary: '#00A896', accent: '#00A896' },
    webUrl: 'http://localhost:3007',
    consoleUrl: 'http://localhost:4014',
    starterConsoleUrl: 'http://localhost:4013',
    dashboardUrl: 'http://localhost:4014/dashboard',
    logo: '✚',
    modules: ['Patients', 'Scheduling', 'Records', 'Compliance'],
    summary: 'Health operations, scheduling, and compliance tracking.',
  },
  logistics: {
    slug: 'logistics',
    name: 'FoundLogistics',
    legalName: 'FoundLogistics',
    accent: '#FF6F00',
    brandColors: { primary: '#FF6F00', accent: '#FF6F00' },
    webUrl: 'http://localhost:3008',
    consoleUrl: 'http://localhost:4016',
    starterConsoleUrl: 'http://localhost:4015',
    dashboardUrl: 'http://localhost:4016/dashboard',
    logo: '▲',
    modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'],
    summary: 'Logistics operations, fleet tracking, and delivery orchestration.',
  },
}

const brandList = Object.values(brands)
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

function consoleTitle(brand: BrandDefinition) {
  switch (brand.slug) {
    case 'retail':
      return 'Retail Manager Console'
    case 'meat':
      return 'Meat Operations Console'
    case 'it':
      return 'IT Command Console'
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
    case 'it':
      return '✦'
    case 'talent':
      return '⬢'
    case 'crypto':
      return '∞'
    default:
      return '⌂'
  }
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
        <span className="brand-logo small">{brandBadge(brand)}</span>
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
        <span className="brand-logo">{brandBadge(brand)}</span>
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
    case 'it':
      return 'linear-gradient(135deg, color-mix(in srgb, #2962FF 64%, var(--surface-strong)), color-mix(in srgb, #1D4ED8 32%, var(--surface)))'
    case 'talent':
      return 'linear-gradient(135deg, color-mix(in srgb, #FFB300 64%, var(--surface-strong)), color-mix(in srgb, #F59E0B 32%, var(--surface)))'
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
      <BobAI brand={brand} />
    </main>
  )
}

export function MarketingPage({ brand, page = 'home' }: { brand: BrandDefinition; page?: string }) {
  return <BrandMarketingPage brand={brand} page={page} />
}

export function FounderLauncher() {
  const bobActions = ['Open Retail dashboard', 'Check Meat compliance', 'Review IT alerts', 'Find Talent candidates', 'Show Crypto wallet balance']
  const packagePlans = founderPackages

  return (
    <main className="site-shell founder-shell" style={{ '--accent': '#4A90E2' } as React.CSSProperties}>
      <nav>
        <Link href="/">FoundingOS</Link>
        <div className="site-nav-links">
          <a href={`${brands.foundingos.consoleUrl}/console`}>Console</a>
          <ThemeToggle />
        </div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">FoundingOS</p>
          <h1>One ecosystem. Every brand connected.</h1>
          <p>Launch brand websites, govern subscriptions, and manage the shared SaaS platform from a single command layer.</p>
        </div>
        <div className="hero-visual" aria-label="FoundingOS overview">
          <div className="hero-panel card-premium glow-premium" style={{ background: brandGradient(brands.foundingos) }}>
            <span>Platform hub</span>
            <strong>FoundingOS</strong>
            <ul>{brandList.filter((brand) => brand.slug !== 'foundingos').map((brand) => <li key={brand.slug}>{brand.name}</li>)}</ul>
          </div>
        </div>
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
      <section className="founder-bob-intro">
        <div className="founder-bob-avatar">B</div>
        <div className="founder-bob-copy">
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
        <div className="founder-bob-actions">
          {bobActions.map((action) => <button key={action} type="button" className="bob-chip">{action}</button>)}
        </div>
      </section>
      <section className="module-grid">
        {brandList.filter((brand) => brand.slug !== 'foundingos').map((brand) => (
          <article key={brand.slug} className="card-premium">
            <h2>{brand.name}</h2>
            <p>{brand.summary}</p>
            {isInternalHref(brand.webUrl)
              ? <Link className="btn btn-primary btn-premium" style={{ backgroundColor: brand.brandColors.primary, borderColor: brand.brandColors.accent }} href={brand.webUrl}>Open Website</Link>
              : <a className="btn btn-primary btn-premium" style={{ backgroundColor: brand.brandColors.primary, borderColor: brand.brandColors.accent }} href={brand.webUrl}>Open Website</a>}
          </article>
        ))}
      </section>
      <section id="contact" className="module-grid">
        <article className="card-premium">
          <h2 className="header-premium">Connect with FoundingOS</h2>
          <p>Explore the full social and messaging network used throughout the platform.</p>
          <PremiumSocialLinks accent="#4A90E2" mode="inline" label="Social & messaging" />
        </article>
      </section>
      <footer className="site-footer">
        <PremiumSocialLinks accent="#4A90E2" mode="full" label="Social & messaging" />
      </footer>
      <BobAI brand={brands.foundingos} />
    </main>
  )
}

export { PremiumSocialLinks } from './social-links'

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
