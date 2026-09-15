/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

export type RetailTrendPoint = {
  bucketStart: string
  revenueGbp: number
}

export type RetailProduct = {
  id: string
  sku: string
  name: string
  category: string
  priceGbp: number
  inventoryOnHand: number
  unitsSoldToday: number
  revenueTodayGbp: number
}

export type RetailPollResponse = {
  mode: 'demo'
  source: string
  generatedAt: string
  refreshIntervalMinutes: number
  currency: 'GBP'
  summary: {
    revenueTodayGbp: number
    transactionsToday: number
    avgOrderValueGbp: number
    grossMarginPct: number
  }
  trend: RetailTrendPoint[]
  products: RetailProduct[]
}

// Demo sales snapshot from this brand's own retail console endpoint — deterministic,
// seeded server-side, no external services or secrets.
export async function fetchRetailSnapshot(): Promise<RetailPollResponse | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await fetch(`${GROWTH_CONSOLE_URL}/api/retail/poll`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
