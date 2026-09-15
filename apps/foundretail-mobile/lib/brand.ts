/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'retail',
  ...MOBILE_APP_CONFIGS.retail,
  tagline: 'Retail operations, connected.',
} as const

export const GROWTH_CONSOLE_URL = 'https://retail-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://retail-console-starter.foundingos.com'
