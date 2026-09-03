/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real brand data — kept in sync by hand with packages/config/src/index.ts (not imported
// directly; that package reads process.env.NEXT_PUBLIC_* which isn't portable to Metro/React
// Native as-is). This app is scoped to exactly one brand, unlike foundingos-mobile.
export const BRAND = {
  slug: 'meat',
  name: 'FoundMeat',
  accent: '#FF0033',
  tagline: 'Supply chain clarity, cut to order.',
  modules: ["Suppliers","Stock","Traceability","Orders"],
} as const

export const GROWTH_CONSOLE_URL = 'https://meat-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://meat-console-starter.foundingos.com'
