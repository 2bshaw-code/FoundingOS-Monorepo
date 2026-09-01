/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { readBrandMetrics } from '../../../superdashboard/brand-metric-store.server'

// Force dynamic rendering — without this, Next.js statically prerenders this GET handler
// at build time (before any real data exists) and serves that cached empty response
// forever, since nothing here signals a per-request data dependency otherwise.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await readBrandMetrics()
    return NextResponse.json({
      brands: rows.map((row) => ({
        brandName: row.brandName,
        totalEngagement: row.totalEngagement,
        anomalyScore: row.anomalyScore,
        categoryBreakdown: row.categoryBreakdown,
        lastUpdated: row.lastUpdated.toISOString(),
      })),
    })
  } catch (error) {
    console.error('brand-metrics read failed:', error)
    return NextResponse.json({ brands: [] })
  }
}
