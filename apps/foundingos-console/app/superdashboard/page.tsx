/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import SuperDashboardPage from './SuperDashboardPage'
import { aggregateBrandSignals } from '@foundingos/config/brandSignalFeed'
import { enrichBrandSignalsWithQuantum } from '@foundingos/config/quantum-orchestration-layer'
import { readVerificationStatus } from './server/verification-layer.server'
import { getTesterSummary } from './server/tester-metrics.server'
import { readSurveyFeedEntries } from './survey-feed-store.server'
import { checkAllBrandRouteHealth } from './route-health.server'
import { SuperDashSurveyGuardian } from '@foundingos/ui/superdash/SuperDashSurveyGuardian'

// FounderOS-only route: do not import or link this page from any brand console.
export default async function SuperDashboardRoute({ searchParams }: { searchParams: Promise<{ readOnly?: string }> }) {
  const { readOnly } = await searchParams
  const [quantumSignals, verificationStatus, testerSummary, surveyFeedEntries, routeHealth] = await Promise.all([
    enrichBrandSignalsWithQuantum(aggregateBrandSignals(new Date(0).toISOString())),
    readVerificationStatus(),
    getTesterSummary(),
    readSurveyFeedEntries(),
    checkAllBrandRouteHealth(),
  ])
  // Same real Guardian warnings the dedicated /system/guardian page computes (see
  // SuperDashSurveyGuardian.ts, the one real source of these strings) — fetched here too so
  // the "What Matters" AI summary can surface the real top issue without a second page load.
  const guardianWarnings = SuperDashSurveyGuardian(surveyFeedEntries, routeHealth)
  return (
    <SuperDashboardPage
      readOnly={readOnly === '1'}
      quantumSignals={quantumSignals}
      verificationStatus={verificationStatus}
      testerSummary={testerSummary}
      guardianWarnings={guardianWarnings}
    />
  )
}
