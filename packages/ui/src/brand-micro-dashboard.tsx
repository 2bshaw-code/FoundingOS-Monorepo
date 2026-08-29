/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Single-brand micro-dashboard shared by every brand console. Renders only the
// data it's given (its own brand's personality layer + AI output) — never
// cross-brand data, so this never touches FounderOS SuperDashboard isolation.
export type BrandMicroDashboardProps = {
  brandName: string
  color: string
  pulse: number
  microStory: string
  kpis: { label: string; value: string; trend?: string }[]
  sparkline: number[]
  insight: string
  risk: string
  opportunity: string
  recommendation: string
  // Quantum overlay is entirely optional — omit any/all fields and the section simply doesn't render.
  quantumForecast?: string
  quantumForecastSparkline?: number[]
  quantumAnomaly?: string | null
  quantumOpportunity?: string
  quantumPulseAdjustment?: number
  quantumInsightSentence?: string
  quantumDemoCtaLabel?: string
}

function MicroSparkline({ points }: { points: number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const coords = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: 28, color: 'var(--accent)' }}>
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BrandMicroDashboard({
  brandName,
  color,
  pulse,
  microStory,
  kpis,
  sparkline,
  insight,
  risk,
  opportunity,
  recommendation,
  quantumForecast,
  quantumForecastSparkline,
  quantumAnomaly,
  quantumOpportunity,
  quantumPulseAdjustment,
  quantumInsightSentence,
  quantumDemoCtaLabel,
}: BrandMicroDashboardProps) {
  const brandStyle = { '--brand-color': color } as React.CSSProperties
  const hasQuantumOverlay = Boolean(quantumForecast || quantumInsightSentence || quantumOpportunity)

  return (
    <section className="stack" style={brandStyle}>
      <header className="module-header header-premium">
        <p>Brand intelligence layer</p>
        <h1>{brandName}</h1>
        <span>Live KPIs, trend, and AI-generated signal for this brand only.</span>
      </header>

      <article className="brand-hero-card card-premium glow-premium">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="brand-pulse-dot" aria-hidden="true" />
          <strong>Hero moment</strong>
          <small>Pulse intensity {pulse}%</small>
        </div>
        <p>{microStory}</p>
      </article>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="dashboard-card card-premium good">
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            {kpi.trend && <small>{kpi.trend}</small>}
          </article>
        ))}
      </div>

      <div className="module-card-grid">
          <article className="module-card card-premium">
          <div className="module-card-top"><span>01</span><strong>Trend</strong></div>
          <MicroSparkline points={sparkline} />
        </article>
          <article className="module-card card-premium">
          <div className="module-card-top"><span>02</span><strong>Insight</strong></div>
          <p>{insight}</p>
        </article>
          <article className="module-card card-premium">
          <div className="module-card-top"><span>03</span><strong>Risk</strong></div>
          <p>{risk}</p>
        </article>
          <article className="module-card card-premium">
          <div className="module-card-top"><span>04</span><strong>Opportunity</strong></div>
          <p>{opportunity}</p>
        </article>
          <article className="module-card card-premium brand-spotlight-card">
          <div className="module-card-top"><span>05</span><strong>AI Spotlight</strong></div>
          <p>{recommendation}</p>
        </article>
      </div>

      {hasQuantumOverlay && (
        <div className="module-card-grid">
          {quantumForecastSparkline && (
            <article className="module-card card-premium">
              <div className="module-card-top"><span>Q1</span><strong>Quantum forecast</strong></div>
              <MicroSparkline points={quantumForecastSparkline} />
              {quantumForecast && <p>{quantumForecast}</p>}
            </article>
          )}
          {quantumAnomaly && (
            <article className="module-card card-premium">
              <div className="module-card-top"><span>Q2</span><strong>Quantum anomaly badge</strong></div>
              <p>{quantumAnomaly}</p>
            </article>
          )}
          {quantumOpportunity && (
            <article className="module-card card-premium">
              <div className="module-card-top"><span>Q3</span><strong>Quantum opportunity</strong></div>
              <p>{quantumOpportunity}</p>
            </article>
          )}
          {typeof quantumPulseAdjustment === 'number' && (
            <article className="module-card card-premium">
              <div className="module-card-top"><span>Q4</span><strong>Quantum pulse delta</strong></div>
              <p>{quantumPulseAdjustment > 0 ? '+' : ''}{quantumPulseAdjustment}%</p>
            </article>
          )}
          {quantumInsightSentence && (
            <article className="module-card card-premium brand-spotlight-card">
              <div className="module-card-top"><span>Q5</span><strong>Quantum insight</strong></div>
              <p>{quantumInsightSentence}</p>
              {quantumDemoCtaLabel && <span className="btn btn-secondary btn-premium" role="button" aria-disabled="true">{quantumDemoCtaLabel}</span>}
            </article>
          )}
        </div>
      )}
    </section>
  )
}
