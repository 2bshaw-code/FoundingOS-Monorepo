/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Real brand data — kept in sync by hand with packages/config/src/index.ts (not imported
// directly; that package reads process.env.NEXT_PUBLIC_* which isn't portable to Metro/React
// Native as-is). This app is scoped to exactly one brand, unlike foundingos-mobile.
export const BRAND = {
  slug: 'talent',
  name: 'FoundTalent',
  accent: '#FF8800',
  tagline: 'Hiring intelligence, made human.',
  modules: ["Applicants","Recruiters","Jobs","Workforce Intel"],
} as const

export const GROWTH_CONSOLE_URL = 'https://talent-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://talent-console-starter.foundingos.com'
