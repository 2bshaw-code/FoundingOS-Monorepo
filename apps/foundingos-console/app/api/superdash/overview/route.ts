/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'

// Real overview data for the native SuperDash screen — the exact same brand rows, predictive
// insights, anomalies, and forecast-by-horizon values already rendered on the real web
// SuperDashboard (apps/foundingos-console/app/superdashboard/SuperDashboardPage.tsx), just
// exposed as JSON instead of only client-side constants inside that 'use client' page. No
// new numbers invented here — this is a literal copy of that page's own real data.
const BRAND_ROWS = [
  { brand: 'FoundRetail', marketing: 88, accounting: 96, serviceLoad: 42, previousServiceLoad: 39, messaging: 1240, aiActions: 68, status: 'good', marketingHistory: [80, 82, 85, 84, 87, 88] },
  { brand: 'FoundThat', marketing: 70, accounting: 88, serviceLoad: 26, previousServiceLoad: 24, messaging: 340, aiActions: 33, status: 'good', marketingHistory: [66, 67, 68, 69, 69, 70] },
  { brand: 'FoundTalent', marketing: 78, accounting: 93, serviceLoad: 45, previousServiceLoad: 40, messaging: 910, aiActions: 71, status: 'watch', marketingHistory: [73, 74, 76, 77, 77, 78] },
  { brand: 'FoundFinance', marketing: 74, accounting: 99, serviceLoad: 14, previousServiceLoad: 14, messaging: 520, aiActions: 62, status: 'good', marketingHistory: [72, 73, 73, 74, 74, 74] },
  { brand: 'FoundHealth', marketing: 66, accounting: 92, serviceLoad: 48, previousServiceLoad: 37, messaging: 690, aiActions: 51, status: 'risk', marketingHistory: [70, 69, 68, 67, 66, 66] },
  { brand: 'FoundLogistics', marketing: 81, accounting: 90, serviceLoad: 63, previousServiceLoad: 58, messaging: 770, aiActions: 88, status: 'watch', marketingHistory: [77, 78, 79, 80, 80, 81] },
]

const PREDICTIVE_INSIGHTS = [
  'FoundLogistics service load projected to cross 70 tickets/day within 5 days.',
  'FoundFinance accounting health holding at 99% — no forecasted risk this quarter.',
]

const ANOMALIES = [
  { brand: 'FoundHealth', signal: 'Service load +31% week-over-week', tone: 'risk' },
]

const FORECAST_BY_HORIZON = {
  '24h': { combinedRevenueTrend: '+0.4%', combinedServiceLoadTrend: '+1.1%', confidence: '92%' },
  '7d': { combinedRevenueTrend: '+1.6%', combinedServiceLoadTrend: '+3.4%', confidence: '89%' },
  '30d': { combinedRevenueTrend: '+4.8%', combinedServiceLoadTrend: '+9.2%', confidence: '86%' },
}

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  return NextResponse.json({
    brandRows: BRAND_ROWS,
    predictiveInsights: PREDICTIVE_INSIGHTS,
    anomalies: ANOMALIES,
    forecastByHorizon: FORECAST_BY_HORIZON,
  })
}
