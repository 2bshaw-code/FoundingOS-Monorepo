/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import SuperDashboardPage from './SuperDashboardPage'
import { aggregateBrandSignals } from '@foundingos/config/brandSignalFeed'
import { enrichBrandSignalsWithQuantum } from '@foundingos/config/quantum-orchestration-layer'
import { readVerificationStatus } from './server/verification-layer.server'
import { getTesterSummary } from './server/tester-metrics.server'

// FounderOS-only route: do not import or link this page from any brand console.
export default async function SuperDashboardRoute({ searchParams }: { searchParams: Promise<{ readOnly?: string }> }) {
  const { readOnly } = await searchParams
  const [quantumSignals, verificationStatus, testerSummary] = await Promise.all([
    enrichBrandSignalsWithQuantum(aggregateBrandSignals(new Date(0).toISOString())),
    readVerificationStatus(),
    getTesterSummary(),
  ])
  return <SuperDashboardPage readOnly={readOnly === '1'} quantumSignals={quantumSignals} verificationStatus={verificationStatus} testerSummary={testerSummary} />
}
