/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared Quantum Intelligence section for brand websites. Purely additive — a new
// route per brand-web app, never edits the existing bespoke homepage files.
export type QuantumIntelligenceSectionProps = {
  brandName: string
  sectionTitle: string
  sectionSubtitle: string
  forecast: string
  anomaly: string | null
  opportunity: string
  pulse: number | null
  insightSentence: string
  demoCtaLabel: string
}

export function QuantumIntelligenceSection({
  brandName,
  sectionTitle,
  sectionSubtitle,
  forecast,
  anomaly,
  opportunity,
  pulse,
  insightSentence,
  demoCtaLabel,
}: QuantumIntelligenceSectionProps) {
  return (
    <section className="stack">
      <header className="module-header header-premium">
        <p>{brandName}</p>
        <h1>{sectionTitle}</h1>
        <span>{sectionSubtitle}</span>
      </header>

      <div className="module-card-grid">
        <article className="module-card fo-card card-premium">
          <div className="module-card-top"><span>01</span><strong>Forecast</strong></div>
          <p>{forecast}</p>
        </article>
        <article className="module-card fo-card card-premium">
          <div className="module-card-top"><span>02</span><strong>Anomaly</strong></div>
          <p>{anomaly ?? 'No anomalies detected right now.'}</p>
        </article>
        <article className="module-card fo-card card-premium">
          <div className="module-card-top"><span>03</span><strong>Opportunity</strong></div>
          <p>{opportunity}</p>
        </article>
        <article className="module-card fo-card card-premium">
          <div className="module-card-top"><span>04</span><strong>Pulse delta</strong></div>
          <p>{pulse === null ? 'No live pulse delta available.' : `${pulse > 0 ? '+' : ''}${pulse}%`}</p>
        </article>
        <article className="module-card fo-card card-premium brand-spotlight-card">
          <div className="module-card-top"><span>05</span><strong>Quantum insight</strong></div>
          <p>{insightSentence}</p>
          <span className="btn btn-secondary btn-premium" role="button" aria-disabled="true">{demoCtaLabel}</span>
        </article>
      </div>
    </section>
  )
}
