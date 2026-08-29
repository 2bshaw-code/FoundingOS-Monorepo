export type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'it' | 'talent' | 'crypto'

export type BrandDefinition = {
  slug: BrandSlug
  name: string
  legalName: string
  accent: string
  logo: string
  webUrl: string
  consoleUrl: string
  modules: string[]
  summary: string
}

export const brands: Record<BrandSlug, BrandDefinition> = {
  foundingos: {
    slug: 'foundingos',
    name: 'FounderOS',
    legalName: 'FounderOS',
    accent: '#4A90E2',
    webUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_WEB_URL || 'http://localhost:3000',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:4000',
    logo: '⌂',
    modules: ['Brand Registry', 'Subscriptions', 'Activity', 'Access Control'],
    summary: 'The core command layer for the multi-brand SaaS ecosystem.',
  },
  retail: {
    slug: 'retail',
    name: 'FoundRetail',
    legalName: 'FoundRetail',
    accent: '#00C853',
    webUrl: process.env.NEXT_PUBLIC_RETAIL_WEB_URL || 'http://localhost:4001',
    consoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:3001',
    logo: '◉',
    modules: ['Customers', 'Inventory', 'Orders', 'Products'],
    summary: 'Retail operations for catalogues, customers, orders, and teams.',
  },
  meat: {
    slug: 'meat',
    name: 'FoundMeat',
    legalName: 'FoundMeat',
    accent: '#C62828',
    webUrl: process.env.NEXT_PUBLIC_MEAT_WEB_URL || 'http://localhost:4002',
    consoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:3002',
    logo: '◆',
    modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'],
    summary: 'Trade and supply chain operating software for meat businesses.',
  },
  it: {
    slug: 'it',
    name: 'FoundIT',
    legalName: 'FoundIT',
    accent: '#2962FF',
    webUrl: process.env.NEXT_PUBLIC_IT_WEB_URL || 'http://localhost:4003',
    consoleUrl: process.env.NEXT_PUBLIC_IT_CONSOLE_URL || 'http://localhost:3003',
    logo: '✦',
    modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'],
    summary: 'Discovery intelligence and data operations for local markets.',
  },
  talent: {
    slug: 'talent',
    name: 'FoundTalent',
    legalName: 'FoundTalent',
    accent: '#FFB300',
    webUrl: process.env.NEXT_PUBLIC_TALENT_WEB_URL || 'http://localhost:4004',
    consoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:3004',
    logo: '⬢',
    modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'],
    summary: 'Hiring analytics and workforce intelligence for modern teams.',
  },
  crypto: {
    slug: 'crypto',
    name: 'FoundCrypto',
    legalName: 'FoundCrypto',
    accent: '#8E24AA',
    webUrl: process.env.NEXT_PUBLIC_CRYPTO_WEB_URL || 'http://localhost:4005',
    consoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:3005',
    logo: '∞',
    modules: ['Charts', 'Signals', 'Automation', 'Risk'],
    summary: 'Crypto intelligence, monitoring, and automation control.',
  },
}

export const brandList = Object.values(brands)

export function getBrand(slug: BrandSlug) {
  return brands[slug]
}