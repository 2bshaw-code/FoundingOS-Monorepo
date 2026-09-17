/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ImageSourcePropType } from 'react-native'
declare const require: (path: string) => ImageSourcePropType

// Kept as BRANDS temporarily for route/store compatibility while the original multi-brand
// mobile prototype is migrated. Customer-facing values represent FoundingOS workspaces.
export type Brand = {
  id?: string
  slug: string
  name: string
  default?: boolean
  logo: ImageSourcePropType
  accent: string
  tagline: string
  modules: string[]
  theme?: {
    background: string
    surface: string
    accent: string
    glow: string
    quantumLines: 'enabled'
  }
}

export const FOUNDINGOS_BASE = '#001B3D'
export const FOUNDINGOS_SURFACE = '#002455'
export const FOUNDINGOS_SURFACE_GRADIENT = 'linear-gradient(180deg, #002455 0%, #001B3D 100%)'
export const FOUNDINGOS_ACCENT = '#4CC9FF'
export const FOUNDINGOS_GLOW = 'rgba(76, 201, 255, 0.45)'

export const BRANDS: Brand[] = [
  {
    id: 'foundingos',
    slug: 'foundingos',
    name: 'FoundingOS Home',
    default: true,
    logo: require('../assets/logos/foundingos.png'),
    accent: FOUNDINGOS_ACCENT,
    tagline: 'One account. Every enabled workspace connected.',
    modules: ['Operations', 'Workforce', 'Intelligence', 'Event Feed', 'WhatsApp'],
    theme: {
      background: FOUNDINGOS_BASE,
      surface: FOUNDINGOS_SURFACE_GRADIENT,
      accent: FOUNDINGOS_ACCENT,
      glow: FOUNDINGOS_GLOW,
      quantumLines: 'enabled',
    },
  },
  { id: 'retail', slug: 'retail', name: 'Retail Workspace', accent: '#00A651', logo: require('../assets/logos/retail.png'), tagline: 'Products, stock, customers, orders, and stores.', modules: ['POS', 'Inventory', 'Customers', 'Orders', 'Products', 'Stores'] },
  { id: 'logistics', slug: 'logistics', name: 'Logistics Workspace', accent: '#DC143C', logo: require('../assets/logos/logistics.png'), tagline: 'Fleet, routes, dispatch, warehousing, and delivery.', modules: ['Fleet', 'Routes', 'Dispatch', 'Warehousing', 'Deliveries', 'Tracking'] },
  { id: 'finance', slug: 'finance', name: 'Finance Workspace', accent: '#A8A8A8', logo: require('../assets/logos/finance.png'), tagline: 'Invoices, cashflow, reconciliation, and risk.', modules: ['Invoicing', 'Cashflow', 'Reconciliation', 'Payables', 'Receivables', 'Reporting'] },
  { id: 'marketing', slug: 'marketing', name: 'Marketing Workspace', accent: '#EC4899', logo: require('../assets/logos/foundingos.png'), tagline: 'Campaigns, audiences, content, and revenue attribution.', modules: ['Campaigns', 'Audiences', 'Content', 'Scheduling', 'Analytics', 'Attribution'] },
  { id: 'talent', slug: 'talent', name: 'Talent Workspace', accent: '#FF7A00', logo: require('../assets/logos/talent.png'), tagline: 'Candidates, jobs, pipelines, interviews, and offers.', modules: ['Candidates', 'Jobs', 'Pipelines', 'Interviews', 'Offers', 'Onboarding'] },
  { id: 'health', slug: 'health', name: 'Health Workspace', accent: '#4FC3F7', logo: require('../assets/logos/health.png'), tagline: 'Patients, appointments, records, billing, and supplies.', modules: ['Patients', 'Appointments', 'Records', 'Treatments', 'Billing', 'Supplies'] },
]
