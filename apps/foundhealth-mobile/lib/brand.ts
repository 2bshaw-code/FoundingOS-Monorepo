/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'health',
  ...MOBILE_APP_CONFIGS.health,
  tagline: 'Care operations, coordinated.',
} as const

export const GROWTH_CONSOLE_URL = 'https://health-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://health-console-starter.foundingos.com'
