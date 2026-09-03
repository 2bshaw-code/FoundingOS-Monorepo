/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real brand data — kept in sync by hand with packages/config/src/index.ts (not imported
// directly; that package reads process.env.NEXT_PUBLIC_* which isn't portable to Metro/React
// Native as-is). This app is scoped to exactly one brand, unlike foundingos-mobile.
export const BRAND = {
  slug: 'retail',
  name: 'FoundRetail',
  accent: '#00FF66',
  tagline: 'Retail operations, connected.',
  modules: ["Customers","Inventory","Orders","Products"],
} as const

export const GROWTH_CONSOLE_URL = 'https://retail-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://retail-console-starter.foundingos.com'
