/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real brand data — kept in sync by hand with packages/config/src/index.ts (not imported
// directly; that package reads process.env.NEXT_PUBLIC_* which isn't portable to Metro/React
// Native as-is). This app is scoped to exactly one brand, unlike foundingos-mobile.
export const BRAND = {
  slug: 'foundthat',
  name: 'FoundThat',
  accent: '#FFDD00',
  tagline: 'Discovery intelligence, on demand.',
  modules: ["Market Intel","Lead Capture","Data Quality","Reports"],
} as const

export const GROWTH_CONSOLE_URL = 'https://foundthat-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://foundthat-console-starter.foundingos.com'
