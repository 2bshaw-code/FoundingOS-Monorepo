/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ImageSourcePropType } from 'react-native'

declare const require: (path: string) => ImageSourcePropType

// Real brand data, kept in sync by hand with packages/config/src/index.ts — not imported
// directly because that package reads process.env.NEXT_PUBLIC_* (a Next.js-only mechanism)
// and isn't portable to Metro/React Native as-is. Names, accents, and taglines below are the
// same real values used across every web console — update both places together if a brand's
// details change.
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
    name: 'FoundingOS',
    default: true,
    logo: require('../assets/logos/foundingos.png'),
    accent: FOUNDINGOS_ACCENT,
    tagline: 'One ecosystem. Every brand connected.',
    modules: ['Superdash', 'Package Model D', 'AAL', 'Brand Registry'],
    theme: {
      background: FOUNDINGOS_BASE,
      surface: FOUNDINGOS_SURFACE_GRADIENT,
      accent: FOUNDINGOS_ACCENT,
      glow: FOUNDINGOS_GLOW,
      quantumLines: 'enabled',
    },
  },
  { id: 'retail', slug: 'retail', name: 'FoundRetail', logo: require('../assets/logos/retail.png'), accent: '#00A651', tagline: 'Retail operations, connected.', modules: ['Customers', 'Inventory', 'Orders', 'Products'] },
  { id: 'crypto', slug: 'crypto', name: 'FoundCrypto', logo: require('../assets/logos/crypto.png'), accent: '#9D00FF', tagline: 'Market intelligence, always on.', modules: ['Charts', 'Signals', 'Automation', 'Risk'] },
  { id: 'meat', slug: 'meat', name: 'FoundMeat', logo: require('../assets/logos/meat.png'), accent: '#FF3B3B', tagline: 'Supply chain clarity, cut to order.', modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'] },
  { id: 'talent', slug: 'talent', name: 'FoundTalent', logo: require('../assets/logos/talent.png'), accent: '#FF7A00', tagline: 'Hiring intelligence, made human.', modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'] },
  { id: 'foundthat', slug: 'foundthat', name: 'FoundThat', logo: require('../assets/logos/foundthat.png'), accent: '#FFD300', tagline: 'Discovery intelligence, on demand.', modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'] },
  { id: 'foundit', slug: 'foundit', name: 'FoundIt', logo: require('../assets/logos/foundit.png'), accent: '#FFD300', tagline: 'Local discovery, beautifully mapped.', modules: ['Discovery', 'Listings', 'Signals', 'Reports'] },
  { id: 'finance', slug: 'finance', name: 'FoundFinance', logo: require('../assets/logos/finance.png'), accent: '#A8A8A8', tagline: 'Cashflow clarity, every day.', modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'] },
  { id: 'health', slug: 'health', name: 'FoundHealth', logo: require('../assets/logos/health.png'), accent: '#4FC3F7', tagline: 'Care operations, coordinated.', modules: ['Patients', 'Scheduling', 'Records', 'Compliance'] },
  { id: 'logistics', slug: 'logistics', name: 'FoundLogistics', logo: require('../assets/logos/logistics.png'), accent: '#DC143C', tagline: 'Fleet and freight, in flow.', modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'] },
]
