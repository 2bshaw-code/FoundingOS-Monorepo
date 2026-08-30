/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { SURVEY_DEFINITIONS } from '@foundingos/config/surveys/survey-definitions'

export function SurveysOverview() {
  return (
    <section className="stack quantum-ambient-grid" style={{ padding: '48px 24px' }}>
      <header className="module-header header-premium">
        <p>FoundingOS · Survey System</p>
        <h1>FounderOS Surveys</h1>
        <span>Customer, Buyer, and Investor surveys — scored automatically and fed into SuperDash.</span>
      </header>
      <div className="module-card-grid">
        {Object.values(SURVEY_DEFINITIONS).map((definition) => (
          <Link key={definition.type} href={`/surveys/${definition.type}`} className="module-card card-premium quantum-card">
            <div className="module-card-top"><strong>{definition.title}</strong></div>
            <p>{definition.description}</p>
            <small>{definition.questions.length} questions</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SurveysOverview
