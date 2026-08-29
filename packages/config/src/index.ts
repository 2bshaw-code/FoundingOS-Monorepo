/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'it' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'

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

export const brands: Record<BrandSlug, BrandDefinition> = {
  foundingos: {
    slug: 'foundingos',
    name: 'FoundingOS',
    legalName: 'FoundingOS',
    marketingName: 'FoundingOS',
    tagline: 'One ecosystem. Every brand connected.',
    description: 'The core command layer for the multi-brand SaaS ecosystem — govern every brand website, console, and subscription from one place.',
    accent: '#4A90E2',
    brandColors: { primary: '#4A90E2', accent: '#4A90E2' },
    webUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_WEB_URL || 'http://localhost:3000',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:4000',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:4000',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:4000'}/console`,
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
    accent: '#00C853',
    brandColors: { primary: '#00C853', accent: '#00C853' },
    webUrl: process.env.NEXT_PUBLIC_RETAIL_WEB_URL || 'http://localhost:3001',
    consoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:4002',
    starterConsoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_STARTER_URL || 'http://localhost:4001',
    dashboardUrl: `${process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:4002'}/dashboard`,
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
    accent: '#C62828',
    brandColors: { primary: '#C62828', accent: '#C62828' },
    webUrl: process.env.NEXT_PUBLIC_MEAT_WEB_URL || 'http://localhost:3002',
    consoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:4004',
    starterConsoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_STARTER_URL || 'http://localhost:4003',
    dashboardUrl: `${process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:4004'}/dashboard`,
    logo: '◆',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundmeat',
    modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'],
    summary: 'Trade and supply chain operating software for meat businesses.',
  },
  it: {
    slug: 'it',
    name: 'FoundThat',
    legalName: 'FoundThat',
    marketingName: 'FoundThat',
    tagline: 'Discovery intelligence, on demand.',
    description: 'Discovery intelligence and data operations for local markets — market intel, lead capture, and data quality in one console.',
    accent: '#2962FF',
    brandColors: { primary: '#2962FF', accent: '#2962FF' },
    webUrl: process.env.NEXT_PUBLIC_IT_WEB_URL || 'http://localhost:3003',
    consoleUrl: process.env.NEXT_PUBLIC_IT_CONSOLE_URL || 'http://localhost:4006',
    starterConsoleUrl: process.env.NEXT_PUBLIC_IT_CONSOLE_STARTER_URL || 'http://localhost:4005',
    dashboardUrl: `${process.env.NEXT_PUBLIC_IT_CONSOLE_URL || 'http://localhost:4006'}/dashboard`,
    logo: '✦',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundthat',
    modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'],
    summary: 'Discovery intelligence and data operations for local markets.',
  },
  talent: {
    slug: 'talent',
    name: 'FoundTalent',
    legalName: 'FoundTalent',
    marketingName: 'FoundTalent',
    tagline: 'Hiring intelligence, made human.',
    description: 'Hiring analytics and workforce intelligence for modern teams — applicants, recruiters, jobs, and workforce intel in one place.',
    accent: '#FFB300',
    brandColors: { primary: '#FFB300', accent: '#FFB300' },
    webUrl: process.env.NEXT_PUBLIC_TALENT_WEB_URL || 'http://localhost:3004',
    consoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:4008',
    starterConsoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_STARTER_URL || 'http://localhost:4007',
    dashboardUrl: `${process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:4008'}/dashboard`,
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
    accent: '#8E24AA',
    brandColors: { primary: '#8E24AA', accent: '#8E24AA' },
    webUrl: process.env.NEXT_PUBLIC_CRYPTO_WEB_URL || 'http://localhost:3005',
    consoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:4010',
    starterConsoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_STARTER_URL || 'http://localhost:4009',
    dashboardUrl: `${process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:4010'}/dashboard`,
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
    accent: '#D4AF37',
    brandColors: { primary: '#D4AF37', accent: '#D4AF37' },
    webUrl: process.env.NEXT_PUBLIC_FINANCE_WEB_URL || 'http://localhost:3006',
    consoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:4012',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_STARTER_URL || 'http://localhost:4011',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:4012'}/dashboard`,
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
    accent: '#00A896',
    brandColors: { primary: '#00A896', accent: '#00A896' },
    webUrl: process.env.NEXT_PUBLIC_HEALTH_WEB_URL || 'http://localhost:3007',
    consoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:4014',
    starterConsoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_STARTER_URL || 'http://localhost:4013',
    dashboardUrl: `${process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:4014'}/dashboard`,
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
    accent: '#FF6F00',
    brandColors: { primary: '#FF6F00', accent: '#FF6F00' },
    webUrl: process.env.NEXT_PUBLIC_LOGISTICS_WEB_URL || 'http://localhost:3008',
    consoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:4016',
    starterConsoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_STARTER_URL || 'http://localhost:4015',
    dashboardUrl: `${process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:4016'}/dashboard`,
    logo: '▲',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundlogistics',
    modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'],
    summary: 'Logistics operations, fleet tracking, and delivery orchestration.',
  },
}

export const brandList = Object.values(brands)

export function getBrand(slug: BrandSlug) {
  return brands[slug]
}