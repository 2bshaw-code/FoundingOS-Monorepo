/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { logSurveyFeedEntry, readSurveyFeedEntries, type SurveyFeedCategory } from '../../../superdashboard/survey-feed-store.server'
import { logEngagementSnapshot, logAnomalyIfDetected } from '../../../superdashboard/survey-feed-signals.server'
import { upsertBrandMetricOnSubmission } from '../../../superdashboard/brand-metric-store.server'

const VALID_CATEGORIES: SurveyFeedCategory[] = [
  'sales', 'marketing', 'product', 'support', 'operations',
  'finance', 'retailexp', 'uxui', 'branding', 'competitor',
]

// Universal SuperDash survey feed: any brand website's tester surveys forward their
// submissions here so SuperDash can show real cross-app tester activity, category health,
// anomalies, Guardian warnings, and autonomous suggestions — additive to, and independent
// from, the existing Customer/Buyer/Investor survey system.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const category = body?.category
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  try {
    await logSurveyFeedEntry({
      brand: typeof body?.brand === 'string' ? body.brand : 'unknown',
      category,
      tester: typeof body?.tester === 'string' && body.tester.trim() ? body.tester.trim() : null,
      responses: Array.isArray(body?.responses) ? body.responses.map(String) : [],
      timestamp: typeof body?.timestamp === 'number' ? body.timestamp : Date.now(),
    })
    // Best-effort historical signal logging — never blocks the submission response.
    await logEngagementSnapshot(category)
    await logAnomalyIfDetected(category)
    await upsertBrandMetricOnSubmission(typeof body?.brand === 'string' ? body.brand : 'unknown', category)
  } catch (error) {
    console.error('survey-feed persistence failed (submission still accepted):', error)
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  try {
    const entries = await readSurveyFeedEntries()
    return NextResponse.json({ entries })
  } catch (error) {
    console.error('survey-feed read failed:', error)
    return NextResponse.json({ entries: [] })
  }
}
