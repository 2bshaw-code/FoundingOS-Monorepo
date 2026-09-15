/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'talent',
  ...MOBILE_APP_CONFIGS.talent,
  tagline: 'Hiring intelligence, made human.',
} as const

export const GROWTH_CONSOLE_URL = 'https://talent-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://talent-console-starter.foundingos.com'
