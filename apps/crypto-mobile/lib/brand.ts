/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real brand data — kept in sync by hand with packages/config/src/index.ts (not imported
// directly; that package reads process.env.NEXT_PUBLIC_* which isn't portable to Metro/React
// Native as-is). This app is scoped to exactly one brand, unlike foundingos-mobile.
export const BRAND = {
  slug: 'crypto',
  name: 'FoundCrypto',
  accent: '#9933FF',
  tagline: 'Market intelligence, always on.',
  modules: ["Charts","Signals","Automation","Risk"],
} as const

export const GROWTH_CONSOLE_URL = 'https://crypto-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://crypto-console-starter.foundingos.com'
