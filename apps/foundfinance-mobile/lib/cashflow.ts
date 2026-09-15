/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

export type CashflowTrendPoint = { date: string; inflowUsd: number; outflowUsd: number }
export type SpendCategory = { category: string; amountUsd: number }
export type PendingApproval = {
  id: string
  kind: 'invoice' | 'expense'
  supplier: string
  category: string
  amountUsd: number
}

export type CashflowResponse = {
  mode: 'demo'
  source: string
  generatedAt: string
  refreshIntervalMinutes: number
  cashPositionUsd: number
  trend: CashflowTrendPoint[]
  spendByCategory: SpendCategory[]
  pendingApprovals: PendingApproval[]
}

// Real, live-feeling cash position + trend + spend-by-category + pending approvals feed — the
// same deterministic demo-mode generator pattern that powers apps/crypto-mobile's price feed
// (see apps/finance-console/app/api/finance/cashflow), reseeded every 3 minutes server-side,
// no API keys/secrets required on either side.
export async function fetchCashflow(): Promise<CashflowResponse | null> {
  if (IS_DEMO_MODE) {
    return {
      mode: 'demo',
      source: 'demo-mock',
      generatedAt: new Date(0).toISOString(),
      refreshIntervalMinutes: 3,
      cashPositionUsd: 128000,
      trend: [],
      spendByCategory: [],
      pendingApprovals: [],
    }
  }
  try {
    const response = await fetch(`${GROWTH_CONSOLE_URL}/api/finance/cashflow`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
