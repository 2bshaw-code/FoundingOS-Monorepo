/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { readSurveyFeedEntries } from '../../superdashboard/survey-feed-store.server'
import { checkAllBrandRouteHealth } from '../../superdashboard/route-health.server'
import { SuperDashSurveyGuardian } from '@foundingos/ui/superdash/SuperDashSurveyGuardian'
import { SuperDashGuardian } from '@foundingos/ui/superdash/SuperDashGuardian'

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
    <section className="stack quantum-ambient-grid" style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
      <header className="module-header header-premium">
        <p>Guardian Mode</p>
        <h1>{hasIssues ? 'Guardian detected an issue — please review.' : 'Guardian: all clear'}</h1>
        <span>Live checks across all 8 brand websites' survey feeds and route health.</span>
      </header>

      <article className="fo-card fo-panel-glow" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Survey feed warnings</h2>
        {surveyWarnings.length === 0 ? (
          <p><small>No warnings — every category has submissions and every route is responding.</small></p>
        ) : (
          <ul>
            {surveyWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        )}
      </article>

      <article className="fo-card fo-panel-glow" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Core enforcement</h2>
        <ul>
          {coreEnforcement.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </section>
  )
}
