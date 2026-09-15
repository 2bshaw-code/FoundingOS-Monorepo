/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'foundthat',
  ...MOBILE_APP_CONFIGS.foundthat,
  tagline: 'Discovery intelligence, on demand.',
} as const

export const GROWTH_CONSOLE_URL = 'https://foundthat-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://foundthat-console-starter.foundingos.com'
