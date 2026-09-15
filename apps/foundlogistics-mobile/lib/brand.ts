/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'logistics',
  ...MOBILE_APP_CONFIGS.logistics,
  tagline: 'Fleet and freight, in flow.',
} as const

export const GROWTH_CONSOLE_URL = 'https://logistics-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://logistics-console-starter.foundingos.com'
