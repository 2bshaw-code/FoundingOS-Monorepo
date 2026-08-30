/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'foundthat' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'

export type BrandTypography = { heading: string; body: string }

export type BrandDefinition = {
  slug: BrandSlug
  name: string
  legalName: string
  marketingName: string
  tagline: string
  description: string
  accent: string
  brandColors: { primary: string; accent: string }
  logo: string
  typography: BrandTypography
  socialHandle: string
  webUrl: string
  consoleUrl: string
  starterConsoleUrl: string
  dashboardUrl: string
  modules: string[]
  summary: string
}

const RAW_BRANDS: Record<BrandSlug, BrandDefinition> = {
  foundingos: {
    slug: 'foundingos',
    name: 'FoundingOS',
    legalName: 'FoundingOS',
    marketingName: 'FoundingOS',
    tagline: 'One ecosystem. Every brand connected.',
    description: 'The core command layer for the multi-brand SaaS ecosystem — govern every brand website, console, and subscription from one place.',
    accent: '#00E0FF',
    brandColors: { primary: '#00E0FF', accent: '#00E0FF' },
    webUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_WEB_URL || 'http://localhost:1000',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000'}/console`,
    logo: '⌂',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundingos',
    modules: ['Brand Registry', 'Subscriptions', 'Activity', 'Access Control', 'Quantum', 'CRM', 'Billing', 'Deliveries', 'Advanced Marketing Suite'],
    summary: 'The core command layer for the multi-brand SaaS ecosystem.',
  },
  retail: {
    slug: 'retail',
    name: 'FoundRetail',
    legalName: 'FoundRetail',
    marketingName: 'FoundRetail',
    tagline: 'Retail operations, connected.',
    description: 'FoundRetail helps growing businesses guide product discovery, support customers, and manage messaging-first retail workflows with more clarity and less manual effort.',
    accent: '#00FF66',
    brandColors: { primary: '#00FF66', accent: '#00FF66' },
    webUrl: process.env.NEXT_PUBLIC_RETAIL_WEB_URL || 'http://localhost:1001',
    consoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:8017',
    starterConsoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_STARTER_URL || 'http://localhost:8001',
    dashboardUrl: `${process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:8017'}/dashboard`,
    logo: '◉',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundretail',
    modules: ['Customers', 'Inventory', 'Orders', 'Products'],
    summary: 'Retail operations for catalogues, customers, orders, and teams.',
  },
  meat: {
    slug: 'meat',
    name: 'FoundMeat',
    legalName: 'FoundMeat',
    marketingName: 'FoundMeat',
    tagline: 'Supply chain clarity, cut to order.',
    description: 'Trade and supply chain operating software for meat businesses — suppliers, stock, traceability, and orders in one operating layer.',
    accent: '#FF0033',
    brandColors: { primary: '#FF0033', accent: '#FF0033' },
    webUrl: process.env.NEXT_PUBLIC_MEAT_WEB_URL || 'http://localhost:1002',
    consoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:8018',
    starterConsoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_STARTER_URL || 'http://localhost:8002',
    dashboardUrl: `${process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:8018'}/dashboard`,
    logo: '◆',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundmeat',
    modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'],
    summary: 'Trade and supply chain operating software for meat businesses.',
  },
  talent: {
    slug: 'talent',
    name: 'FoundTalent',
    legalName: 'FoundTalent',
    marketingName: 'FoundTalent',
    tagline: 'Hiring intelligence, made human.',
    description: 'Hiring analytics and workforce intelligence for modern teams — applicants, recruiters, jobs, and workforce intel in one place.',
    accent: '#FF8800',
    brandColors: { primary: '#FF8800', accent: '#FF8800' },
    webUrl: process.env.NEXT_PUBLIC_TALENT_WEB_URL || 'http://localhost:1004',
    consoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:8020',
    starterConsoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_STARTER_URL || 'http://localhost:8004',
    dashboardUrl: `${process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:8020'}/dashboard`,
    logo: '⬢',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundtalent',
    modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'],
    summary: 'Hiring analytics and workforce intelligence for modern teams.',
  },
  crypto: {
    slug: 'crypto',
    name: 'FoundCrypto',
    legalName: 'FoundCrypto',
    marketingName: 'FoundCrypto',
    tagline: 'Market intelligence, always on.',
    description: 'Crypto intelligence, monitoring, and automation control — charts, signals, automation, and risk in one console.',
    accent: '#9933FF',
    brandColors: { primary: '#9933FF', accent: '#9933FF' },
    webUrl: process.env.NEXT_PUBLIC_CRYPTO_WEB_URL || 'http://localhost:1005',
    consoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:8021',
    starterConsoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_STARTER_URL || 'http://localhost:8005',
    dashboardUrl: `${process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:8021'}/dashboard`,
    logo: '∞',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundcrypto',
    modules: ['Charts', 'Signals', 'Automation', 'Risk'],
    summary: 'Crypto intelligence, monitoring, and automation control.',
  },
  finance: {
    slug: 'finance',
    name: 'FoundFinance',
    legalName: 'FoundFinance',
    marketingName: 'FoundFinance',
    tagline: 'Cashflow clarity, every day.',
    description: 'Finance operations, cashflow visibility, and reconciliation tooling — invoicing, reconciliation, and reporting in one console.',
    accent: '#0033AA',
    brandColors: { primary: '#0033AA', accent: '#0033AA' },
    webUrl: process.env.NEXT_PUBLIC_FINANCE_WEB_URL || 'http://localhost:1006',
    consoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:8022',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_STARTER_URL || 'http://localhost:8006',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:8022'}/dashboard`,
    logo: '£',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundfinance',
    modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'],
    summary: 'Finance operations, cashflow visibility, and reconciliation tooling.',
  },
  health: {
    slug: 'health',
    name: 'FoundHealth',
    legalName: 'FoundHealth',
    marketingName: 'FoundHealth',
    tagline: 'Care operations, coordinated.',
    description: 'Health operations, scheduling, and compliance tracking — patients, scheduling, records, and compliance in one console.',
    accent: '#33CCFF',
    brandColors: { primary: '#33CCFF', accent: '#33CCFF' },
    webUrl: process.env.NEXT_PUBLIC_HEALTH_WEB_URL || 'http://localhost:1007',
    consoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:8023',
    starterConsoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_STARTER_URL || 'http://localhost:8007',
    dashboardUrl: `${process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:8023'}/dashboard`,
    logo: '✡',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundhealth',
    modules: ['Patients', 'Scheduling', 'Records', 'Compliance'],
    summary: 'Health operations, scheduling, and compliance tracking.',
  },
  logistics: {
    slug: 'logistics',
    name: 'FoundLogistics',
    legalName: 'FoundLogistics',
    marketingName: 'FoundLogistics',
    tagline: 'Fleet and freight, in flow.',
    description: 'Logistics operations, fleet tracking, and delivery orchestration — fleet, routes, warehousing, and deliveries in one console.',
    accent: '#DC143C',
    brandColors: { primary: '#DC143C', accent: '#DC143C' },
    webUrl: process.env.NEXT_PUBLIC_LOGISTICS_WEB_URL || 'http://localhost:1008',
    consoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:8024',
    starterConsoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_STARTER_URL || 'http://localhost:8008',
    dashboardUrl: `${process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:8024'}/dashboard`,
    logo: '▲',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundlogistics',
    modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'],
    summary: 'Logistics operations, fleet tracking, and delivery orchestration.',
  },
  foundthat: {
    slug: 'foundthat',
    name: 'FoundThat',
    legalName: 'FoundThat',
    marketingName: 'FoundThat',
    tagline: 'Discovery intelligence, on demand.',
    description: 'Discovery intelligence and data operations for local markets — market intel, lead capture, and data quality in one console.',
    accent: '#FFDD00',
    brandColors: { primary: '#FFDD00', accent: '#FFDD00' },
    webUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_WEB_URL || 'http://localhost:1003',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_URL || 'http://localhost:8019',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_STARTER_URL || 'http://localhost:8003',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_URL || 'http://localhost:8019'}/dashboard`,
    logo: '✦',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundthat',
    modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'],
    summary: 'Discovery intelligence and data operations for local markets.',
  },
}

// Deployment safety net: these cross-app links (webUrl/consoleUrl/starterConsoleUrl/dashboardUrl)
// point at a DIFFERENT app/origin, so they need a real NEXT_PUBLIC_*_URL env var set per deployed
// app to work correctly in production. If a deployment forgets to set one, this wrapper avoids
// ever emitting a dead http://localhost:XXXX link in a production build — it falls back to a
// relative path instead. Local dev is completely unaffected.
//
// Deliberately keyed on process.env.NODE_ENV (inlined identically into both the server-rendered
// HTML and the client bundle at build time) rather than window.location.hostname — the latter
// would differ between the server render pass (no `window`) and the client hydration pass,
// causing a React hydration mismatch. NODE_ENV is consistent across both, so this is safe.
const CROSS_APP_URL_KEYS = new Set(['webUrl', 'consoleUrl', 'starterConsoleUrl', 'dashboardUrl'])

function isProductionBuild() {
  return process.env.NODE_ENV === 'production'
}

function toSafeUrl(value: string): string {
  if (!value.includes('localhost') || !isProductionBuild()) return value
  try {
    const parsed = new URL(value)
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/'
  } catch {
    return '/'
  }
}

function wrapBrandUrls(definition: BrandDefinition): BrandDefinition {
  return new Proxy(definition, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value === 'string' && CROSS_APP_URL_KEYS.has(String(prop))) return toSafeUrl(value)
      return value
    },
  })
}

export const brands: Record<BrandSlug, BrandDefinition> = Object.fromEntries(
  (Object.entries(RAW_BRANDS) as [BrandSlug, BrandDefinition][]).map(([slug, definition]) => [slug, wrapBrandUrls(definition)]),
) as Record<BrandSlug, BrandDefinition>

export const brandList = Object.values(brands)

export function getBrand(slug: BrandSlug) {
  return brands[slug]
}