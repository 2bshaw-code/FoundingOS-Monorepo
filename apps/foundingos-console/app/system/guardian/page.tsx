/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { readSurveyFeedEntries } from '../../superdashboard/survey-feed-store.server'
import { checkAllBrandRouteHealth } from '../../superdashboard/route-health.server'
import { SuperDashSurveyGuardian } from '@foundingos/ui/superdash/SuperDashSurveyGuardian'
import { SuperDashGuardian } from '@foundingos/ui/superdash/SuperDashGuardian'
import { GuardianAlertList } from '@foundingos/ui/guardian-ai'
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader } from '@foundingos/ui/quantum'

export const metadata = { title: 'System Alert | FoundingOS' }

// Real Guardian status page — reads the actual survey feed log and a live route-health
// probe across all 8 brand websites, rather than a static placeholder. Additive: does not
// touch the existing SuperDashGuardian() output, which is also shown here unchanged.
export default async function GuardianPage() {
  const [entries, routeHealth] = await Promise.all([readSurveyFeedEntries(), checkAllBrandRouteHealth()])
  const surveyWarnings = SuperDashSurveyGuardian(entries, routeHealth)
  const coreEnforcement = SuperDashGuardian()
  const hasIssues = surveyWarnings.length > 0

  return (
    <section className="q-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Guardian Mode"
        title={hasIssues ? 'Guardian detected an issue — please review.' : 'Guardian: all clear'}
        description="Live checks across all 8 brand websites' survey feeds and route health."
      />

      <QuantumCard brand={brands.foundingos}>
        <h2 className="q-text-h2">Survey feed warnings</h2>
        <GuardianAlertList warnings={surveyWarnings} />
      </QuantumCard>

      <QuantumCard brand={brands.foundingos}>
        <h2 className="q-text-h2">Core enforcement</h2>
        <ul>
          {coreEnforcement.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </QuantumCard>
    </section>
  )
}
