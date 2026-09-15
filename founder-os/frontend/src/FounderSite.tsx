/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState, type CSSProperties } from 'react'
import { BrandCard, BrandLogo, Card } from '@founder-os/ui'
import { CoreOperationsBrandMark, IntelligenceBrandMark, CoreWorkforceBrandMark } from '@founder-os/brand-assets'
import { FounderOsLogo } from '@founder-os/ui/logo'
import { BobIntroCard } from './components/BobIntroCard'

type PublicCompany = { id: string; name: string; slug: string; publicWebsiteUrl: string | null; ownerConsoleUrl: string | null; merchantConsoleUrl: string | null; settings?: { brandColor?: string } | null; modules: Array<{ module: string }> }
type BrandHub = { slug: string; name: string; description: string; accent: string; features: string[]; siteUrl: string; loginUrl: string; ownerConsoleUrl: string; merchantConsoleUrl: string }
// CoreOperations and CoreOperations are deprecated brands (removed) — see
// /docs/deprecations.md. Suite names below map foundthis/core_intelligence to
// Core.Intelligence, core_operations to Core.Operations, and core_workforce to
// Core.Workforce.
const companyDetails: Record<string, { category: string; description: string; accent: string }> = {
  core_operations: { category: 'Core.Operations', description: 'Retail operations, staff consoles, customer workflows, and primary control in one connected workspace.', accent: '#25D366' },
  foundthis: { category: 'Core.Intelligence', description: 'Founder and owner KPIs, funnels, and reporting built from first-party operational data.', accent: '#FFD600' },
  core_intelligence: { category: 'Core.Intelligence', description: 'Founder and owner KPIs, funnels, and reporting built from first-party operational data.', accent: '#FFD600' },
  core_workforce: { category: 'Core.Workforce', description: 'Job ingestion, applicant scoring, labour market intelligence, and onboarding in one suite.', accent: '#F97316' },
}
const brandDefaults: Record<string, BrandHub> = {
  core_operations: { slug: 'core_operations', name: 'Core.Operations', description: 'Retail OS for product catalogues, customer messages, orders, and staff operations.', accent: '#25D366', features: ['Catalogue browsing', 'Orders and inventory', 'Customer messaging', 'Retail Manager and Staff consoles'], siteUrl: 'http://localhost:5210/console', loginUrl: 'http://localhost:5210/console', ownerConsoleUrl: 'http://localhost:5210/console', merchantConsoleUrl: 'http://localhost:5210/console' },
  foundthis: { slug: 'foundthis', name: 'Core.Intelligence', description: 'Founder and owner KPI, funnel, and reporting intelligence.', accent: '#FFD600', features: ['Market intelligence', 'KPI dashboards', 'Reports', 'Intelligence console'], siteUrl: 'http://localhost:5230/console', loginUrl: 'http://localhost:5230/console', ownerConsoleUrl: 'http://localhost:5230/console', merchantConsoleUrl: 'http://localhost:5230/console' },
  core_intelligence: { slug: 'foundthis', name: 'Core.Intelligence', description: 'Founder and owner KPI, funnel, and reporting intelligence.', accent: '#FFD600', features: ['Market intelligence', 'KPI dashboards', 'Reports', 'Intelligence console'], siteUrl: 'http://localhost:5230/console', loginUrl: 'http://localhost:5230/console', ownerConsoleUrl: 'http://localhost:5230/console', merchantConsoleUrl: 'http://localhost:5230/console' },
  core_workforce: { slug: 'core_workforce', name: 'Core.Workforce', description: 'Workforce intelligence, hiring analytics, and WhatsApp-native candidate workflows.', accent: '#F97316', features: ['Job ingestion', 'Applicant scoring', 'Hiring analytics', 'Workforce manager, recruiter, and applicant consoles'], siteUrl: 'http://localhost:5240/console', loginUrl: 'http://localhost:5240/console', ownerConsoleUrl: 'http://localhost:5240/console', merchantConsoleUrl: 'http://localhost:5240/console' },
}
const detailFor = (company: PublicCompany) => companyDetails[company.slug] || companyDetails[company.modules[0]?.module] || { category: 'FoundingOS company', description: 'A company managed through the FoundingOS control centre.', accent: '#006CFF' }
const companyMark = (company: PublicCompany) => company.slug === 'foundthis' || company.slug === 'core_intelligence' ? <IntelligenceBrandMark className="founder-site-brand-mark"/> : company.slug === 'core_workforce' ? <CoreWorkforceBrandMark className="founder-site-brand-mark"/> : company.slug === 'core_operations' ? <CoreOperationsBrandMark className="founder-site-brand-mark"/> : <span className="founder-site-brand-mark">{company.name.slice(0, 1)}</span>
export function FounderSite() {
  const [companies, setCompanies] = useState<PublicCompany[]>([])
  useEffect(() => {
    const root = import.meta.env.VITE_FOUNDER_API_URL.replace(/\/+$/, '')
    fetch(`${root}/api/v1/public/companies`).then((response) => response.ok ? response.json() : Promise.reject(new Error('Company profiles unavailable'))).then((response: { data: PublicCompany[] }) => setCompanies(response.data)).catch(() => setCompanies([]))
  }, [])
  return (
    <main className="founder-site">
      <nav className="founder-site-nav" aria-label="FoundingOS navigation">
        <a className="founder-site-brand" href="/founder-site">
          <FounderOsLogo className="founder-site-logo" />
          <span>FoundingOS</span>
        </a>
        <a className="founder-site-nav-link" href="/console">Console</a>
      </nav>

      <section className="founder-site-hero">
        <div className="founder-site-hero-copy">
          <p className="founder-site-eyebrow">FoundingOS</p>
          <h1>FoundingOS</h1>
          <p className="founder-site-subtitle">The unified operating system powering Core.Operations, Core.Workforce, and Core.Intelligence.</p>
          <a className="founder-site-primary" href="/console">Console</a>
        </div>
        <div className="founder-site-system" aria-label="FoundingOS brand network">
          <span className="founder-site-system-core">FoundingOS</span>
          {companies.map((company) => { const detail = detailFor(company); return <span key={company.id} style={{ borderColor: company.settings?.brandColor || detail.accent }}>{company.name}</span> })}
        </div>
      </section>

      <section className="founder-site-about" aria-labelledby="meet-bob-ai">
        <BobIntroCard
          className="founder-site-bob-intro"
          eyebrow="IntelligenceAI"
          id="meet-bob-ai"
          title="IntelligenceAI — The Best Onboarding Bot in the World."
          paragraphs={[
            'IntelligenceAI wasn’t created to be another chatbot. It was created to solve the single biggest problem in business software: people hate onboarding, people hate learning new systems, and people hate complicated dashboards.',
            'FoundingOS gives every user — from retail operators to recruiters, intelligence teams, and founders — one universal guide who knows exactly what they need.',
            'IntelligenceAI is simple, huge-capable, friendly, approachable, human-first, and a co-founder rather than a tool. It handles onboarding, setup, training, workflows, tasks, and questions instantly.',
          ]}
        />
      </section>

      <section className="founder-site-brands" aria-labelledby="brand-hub">
        <header>
          <p className="founder-site-eyebrow">Company links</p>
          <h2 id="brand-hub">Open every brand website in one place.</h2>
        </header>
        <div className="founder-site-brand-grid">
          {Object.values(brandDefaults).map((brand) => (
            <div key={brand.slug} className="founder-site-brand-card" style={{ '--brand-accent': brand.accent } as CSSProperties}>
              <BrandCard brand={brand.slug as any} title={brand.name} description={brand.description} accent={brand.accent}>
                <ul className="founder-site-brand-features">
                  {brand.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
                </ul>
                <div className="founder-site-actions">
                  <a href={brand.siteUrl} target="_blank" rel="noopener noreferrer">Open Console</a>
                </div>
              </BrandCard>
            </div>
          ))}
        </div>
      </section>

      <section className="founder-site-about" aria-labelledby="about-founder-os">
        <p className="founder-site-eyebrow">The parent company</p>
        <h2 id="about-founder-os">One master hub. Four focused operating systems.</h2>
        <p>FoundingOS is the private command layer for the FoundingOS ecosystem. It connects group oversight, system health, brand operations, and founder access while each company retains a clear public website and purpose-built console.</p>
      </section>

      <section className="founder-site-brands" aria-labelledby="founder-brands">
        <header>
          <p className="founder-site-eyebrow">Our operating companies</p>
          <h2 id="founder-brands">Built for real local economies</h2>
        </header>
        <div className="founder-site-brand-grid">
          {companies.map((company) => {
            const detail = detailFor(company)
            const style = { '--brand-accent': company.settings?.brandColor || detail.accent } as CSSProperties
            const actions = [{ label: 'Open Console', url: company.ownerConsoleUrl || company.merchantConsoleUrl || company.publicWebsiteUrl }]
            return <div key={company.id} className="founder-site-brand-card" style={style}><Card>{companyMark(company)}<p>{detail.category}</p><h3>{company.name}</h3><p className="founder-site-brand-description">{detail.description}</p><div className="founder-site-actions">{actions.map((action) => action.url ? <a key={action.label} href={action.url} target="_blank" rel="noopener noreferrer">{action.label}</a> : <span key={action.label} title="Link not available" aria-label={`${action.label}: Link not available`}>{action.label}</span>)}</div></Card></div>
          })}
          {companies.length === 0 && <p className="founder-site-company-empty">Company profiles will appear here when published from FoundingOS.</p>}
        </div>
      </section>

      <footer className="founder-site-footer">FoundingOS — one platform, three suites: Core.Operations, Core.Workforce, and Core.Intelligence.</footer>
    </main>
  )
}
