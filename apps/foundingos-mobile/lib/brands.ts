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
}

export const BRANDS: Brand[] = [
  { slug: 'retail', name: 'FoundRetail', accent: '#00FF66', tagline: 'Retail operations, connected.' },
  { slug: 'crypto', name: 'FoundCrypto', accent: '#9933FF', tagline: 'Market intelligence, always on.' },
  { slug: 'meat', name: 'FoundMeat', accent: '#FF0033', tagline: 'Supply chain clarity, cut to order.' },
  { slug: 'talent', name: 'FoundTalent', accent: '#FF8800', tagline: 'Hiring intelligence, made human.' },
  { slug: 'foundthat', name: 'FoundThat', accent: '#FFDD00', tagline: 'Discovery intelligence, on demand.' },
  { slug: 'finance', name: 'FoundFinance', accent: '#0033AA', tagline: 'Cashflow clarity, every day.' },
  { slug: 'health', name: 'FoundHealth', accent: '#33CCFF', tagline: 'Care operations, coordinated.' },
  { slug: 'logistics', name: 'FoundLogistics', accent: '#DC143C', tagline: 'Fleet and freight, in flow.' },
]

export const FOUNDINGOS_ACCENT = '#00E0FF'
