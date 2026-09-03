/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Real brand data, kept in sync by hand with packages/config/src/index.ts — not imported
// directly because that package reads process.env.NEXT_PUBLIC_* (a Next.js-only mechanism)
// and isn't portable to Metro/React Native as-is. Names, accents, and taglines below are the
// same real values used across every web console — update both places together if a brand's
// details change.
export type Brand = {
  slug: string
  name: string
  accent: string
  tagline: string
  modules: string[]
}

export const BRANDS: Brand[] = [
  { slug: 'retail', name: 'FoundRetail', accent: '#00FF66', tagline: 'Retail operations, connected.', modules: ['Customers', 'Inventory', 'Orders', 'Products'] },
  { slug: 'crypto', name: 'FoundCrypto', accent: '#9933FF', tagline: 'Market intelligence, always on.', modules: ['Charts', 'Signals', 'Automation', 'Risk'] },
  { slug: 'meat', name: 'FoundMeat', accent: '#FF0033', tagline: 'Supply chain clarity, cut to order.', modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'] },
  { slug: 'talent', name: 'FoundTalent', accent: '#FF8800', tagline: 'Hiring intelligence, made human.', modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'] },
  { slug: 'foundthat', name: 'FoundThat', accent: '#FFDD00', tagline: 'Discovery intelligence, on demand.', modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'] },
  { slug: 'finance', name: 'FoundFinance', accent: '#0033AA', tagline: 'Cashflow clarity, every day.', modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'] },
  { slug: 'health', name: 'FoundHealth', accent: '#33CCFF', tagline: 'Care operations, coordinated.', modules: ['Patients', 'Scheduling', 'Records', 'Compliance'] },
  { slug: 'logistics', name: 'FoundLogistics', accent: '#DC143C', tagline: 'Fleet and freight, in flow.', modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'] },
]

export const FOUNDINGOS_ACCENT = '#00E0FF'
