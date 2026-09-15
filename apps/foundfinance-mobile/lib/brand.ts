/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MOBILE_APP_CONFIGS } from '@foundingos/ui/mobile'

export const BRAND = {
  slug: 'finance',
  ...MOBILE_APP_CONFIGS.finance,
  tagline: 'Cashflow clarity, every day.',
} as const

export const GROWTH_CONSOLE_URL = 'https://finance-console.foundingos.com'
export const STARTER_CONSOLE_URL = 'https://finance-console-starter.foundingos.com'
