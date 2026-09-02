/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { readRealPipelineRollup } from '../../../superdashboard/monetary-store.server'

export const dynamic = 'force-dynamic'

// Real, database-backed cross-brand pipeline rollup (sum of every real CrmDeal row, across
// all brands) — same-origin only (SuperDash lives in this same app), so no CORS needed.
// Deliberately labeled "pipeline value", never "revenue" or "booked" anywhere this is
// consumed — a deal in pipeline is not yet real, recognized revenue.
export async function GET() {
  const rollup = await readRealPipelineRollup()
  return NextResponse.json({ rollup })
}
