/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ImageSourcePropType } from 'react-native'
declare const require: (path: string) => ImageSourcePropType

export type BrandAvailability = 'overview' | 'live' | 'not_connected'

export type Brand = {
  id?: string
  slug: string
  name: string
  shortName: string
  default?: boolean
  logo: ImageSourcePropType
  accent: string
  tagline: string
  modules: string[]
  availability: BrandAvailability
  homeLabel: string
  icon: string
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
    shortName: 'Home',
    default: true,
    logo: require('../assets/logos/foundingos.png'),
    accent: FOUNDINGOS_ACCENT,
    tagline: 'FoundAI runs your business across Core.Operations, Core.Workforce and Core.Intelligence.',
    modules: ['Business Pulse', 'Approvals', 'Messaging', 'Event Feed', 'Team', 'Setup'],
    availability: 'overview',
    homeLabel: 'Overview',
    icon: '⌂',
    theme: {
      background: FOUNDINGOS_BASE,
      surface: FOUNDINGOS_SURFACE_GRADIENT,
      accent: FOUNDINGOS_ACCENT,
      glow: FOUNDINGOS_GLOW,
      quantumLines: 'enabled',
    },
  },
  {
    id: 'core_operations',
    slug: 'core_operations',
    name: 'Core.Operations',
    shortName: 'Ops',
    logo: require('../assets/logos/foundingos.png'),
    accent: '#26E07F',
    tagline: 'Orders, invoices, stock, deliveries, campaigns and messages — run by FoundAI.',
    modules: ['CRM', 'Orders', 'Invoices', 'Inventory', 'Marketing', 'Messaging'],
    availability: 'live',
    homeLabel: 'Core.Operations',
    icon: '⚙',
  },
  {
    id: 'core_workforce',
    slug: 'core_workforce',
    name: 'Core.Workforce',
    shortName: 'Workforce',
    logo: require('../assets/logos/foundingos.png'),
    accent: '#FFB703',
    tagline: 'Live hiring pipeline with governed shortlisting actions.',
    modules: ['Roles', 'Applicants', 'Pipeline', 'Interviews'],
    availability: 'live',
    homeLabel: 'Core.Workforce',
    icon: '◈',
  },
  {
    id: 'core_intelligence',
    slug: 'core_intelligence',
    name: 'Core.Intelligence',
    shortName: 'Intelligence',
    logo: require('../assets/logos/foundingos.png'),
    accent: '#A78BFA',
    tagline: 'Live intelligence using governed action evidence from Core.Operations.',
    modules: ['Accuracy', 'Learning', 'Signals', 'Audit Trail'],
    availability: 'live',
    homeLabel: 'Core.Intelligence',
    icon: '✦',
  },
]
