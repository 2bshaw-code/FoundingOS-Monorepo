/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../../lib/session-auth'
import { readSurveyFeedEntries } from '../../../../superdashboard/survey-feed-store.server'
import { checkAllBrandRouteHealth } from '../../../../superdashboard/route-health.server'
import { SuperDashSurveyGuardian } from '@foundingos/ui/superdash/SuperDashSurveyGuardian'
import { SuperDashGuardian } from '@foundingos/ui/superdash/SuperDashGuardian'

// Real Guardian data for the native Guardian screen — the exact same live survey-feed log
// and route-health probe across all 8 brand websites that the real web Guardian page
// (apps/foundingos-console/app/system/guardian/page.tsx) reads, exposed as JSON. Admin-only,
// matching the web page's own middleware protection.
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session || session.scope !== 'admin') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })

  const [entries, routeHealth] = await Promise.all([readSurveyFeedEntries(), checkAllBrandRouteHealth()])
  const surveyWarnings = SuperDashSurveyGuardian(entries, routeHealth)
  const coreEnforcement = SuperDashGuardian()

  return NextResponse.json({
    hasIssues: surveyWarnings.length > 0,
    surveyWarnings,
    coreEnforcement,
  })
}
