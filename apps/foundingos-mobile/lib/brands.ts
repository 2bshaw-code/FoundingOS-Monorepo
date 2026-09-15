/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ImageSourcePropType } from 'react-native'
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

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
  modules: readonly string[]
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
  { id: 'retail', slug: 'retail', ...MOBILE_APP_CONFIGS.retail, logo: require('../assets/logos/retail.png'), tagline: 'Retail operations, connected.' },
  { id: 'talent', slug: 'talent', ...MOBILE_APP_CONFIGS.talent, logo: require('../assets/logos/talent.png'), tagline: 'Hiring intelligence, made human.' },
  { id: 'foundthat', slug: 'foundthat', ...MOBILE_APP_CONFIGS.foundthat, logo: require('../assets/logos/foundthat.png'), tagline: 'Discovery intelligence, on demand.' },
  { id: 'finance', slug: 'finance', ...MOBILE_APP_CONFIGS.finance, logo: require('../assets/logos/finance.png'), tagline: 'Cashflow clarity, every day.' },
  { id: 'health', slug: 'health', ...MOBILE_APP_CONFIGS.health, logo: require('../assets/logos/health.png'), tagline: 'Care operations, coordinated.' },
  { id: 'logistics', slug: 'logistics', ...MOBILE_APP_CONFIGS.logistics, logo: require('../assets/logos/logistics.png'), tagline: 'Fleet and freight, in flow.' },
]
