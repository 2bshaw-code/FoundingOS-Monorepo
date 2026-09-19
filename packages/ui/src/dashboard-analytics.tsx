'use client'

type AnalyticsSeries = {
  label: string
  value: string
  change: string
  tone: 'cyan' | 'green' | 'amber' | 'pink'
  points: number[]
}

const suiteAnalytics: Record<string, { title: string; summary: string; series: AnalyticsSeries[]; funnel: Array<{ label: string; value: number }> }> = {
  'Core.Operations': {
    title: 'Commercial performance',
    summary: 'Orders, fulfilment, and collected revenue are moving together. Conversion is improving, but overdue cash still needs attention.',
    series: [
      { label: 'Revenue', value: '£18.6k', change: '+12.4%', tone: 'green', points: [46, 54, 51, 63, 67, 74, 82] },
      { label: 'Orders', value: '142', change: '+8.1%', tone: 'cyan', points: [38, 42, 48, 45, 57, 62, 68] },
      { label: 'Fulfilment rate', value: '94.2%', change: '+3.6%', tone: 'amber', points: [66, 69, 68, 73, 76, 79, 84] },
    ],
    funnel: [{ label: 'Enquiries', value: 240 }, { label: 'Orders', value: 142 }, { label: 'Delivered', value: 118 }, { label: 'Paid', value: 96 }],
  },
  'Core.Workforce': {
    title: 'Hiring and people performance',
    summary: 'Candidate flow is healthy. Interview capacity and onboarding completion are the two constraints most likely to slow growth.',
    series: [
      { label: 'Qualified candidates', value: '186', change: '+16.8%', tone: 'cyan', points: [34, 41, 45, 52, 56, 65, 72] },
      { label: 'Interview conversion', value: '38%', change: '+5.2%', tone: 'green', points: [42, 39, 47, 49, 54, 57, 61] },
      { label: 'Time to hire', value: '18 days', change: '-3 days', tone: 'amber', points: [82, 78, 75, 69, 66, 61, 56] },
    ],
    funnel: [{ label: 'Applicants', value: 1284 }, { label: 'Qualified', value: 186 }, { label: 'Interviewed', value: 72 }, { label: 'Offers', value: 24 }],
  },
  'Core.Intelligence': {
    title: 'Business health and decision trends',
    summary: 'Operational signals remain stable. Two high-impact risks need decisions, while recommendation adoption is trending upward.',
    series: [
      { label: 'Events analysed', value: '1.8m', change: '+21.3%', tone: 'cyan', points: [39, 46, 51, 58, 64, 72, 88] },
      { label: 'Risks resolved', value: '87%', change: '+9.4%', tone: 'green', points: [48, 52, 57, 63, 66, 73, 81] },
      { label: 'Recommendation adoption', value: '71%', change: '+14.1%', tone: 'pink', points: [31, 36, 43, 49, 55, 62, 70] },
    ],
    funnel: [{ label: 'Signals', value: 420 }, { label: 'Insights', value: 96 }, { label: 'Recommendations', value: 38 }, { label: 'Actions completed', value: 27 }],
  },
}

function Sparkline({ points }: { points: number[] }) {
  const maximum = Math.max(...points)
  const minimum = Math.min(...points)
  const range = maximum - minimum || 1
  const coordinates = points.map((point, index) => `${(index / (points.length - 1)) * 100},${34 - ((point - minimum) / range) * 30}`).join(' ')
  const area = `0,36 ${coordinates} 100,36`
  return (
    <svg className="suite-trend-chart" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={area} fill="currentColor" opacity=".12" />
      <polyline points={coordinates} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DashboardAnalytics({ suite }: { suite: string }) {
  const analytics = suiteAnalytics[suite] ?? suiteAnalytics['Core.Operations']
  const funnelMaximum = Math.max(...analytics.funnel.map((step) => step.value))

  return (
    <section className="suite-analytics" aria-label={`${suite} trends`}>
      <div className="suite-analytics-heading">
        <div>
          <p className="eyebrow">Seven-day trends · simulated data</p>
          <h2>{analytics.title}</h2>
          <p>{analytics.summary}</p>
        </div>
        <span>Updated now</span>
      </div>
      <div className="suite-trend-grid">
        {analytics.series.map((series) => (
          <article key={series.label} className={`suite-trend-card tone-${series.tone}`}>
            <div><span>{series.label}</span><strong>{series.value}</strong><em>{series.change}</em></div>
            <Sparkline points={series.points} />
            <small>Mon · Tue · Wed · Thu · Fri · Sat · Today</small>
          </article>
        ))}
      </div>
      <article className="suite-funnel">
        <div>
          <p className="eyebrow">Conversion journey</p>
          <h3>Where activity becomes an outcome</h3>
        </div>
        <div className="suite-funnel-bars">
          {analytics.funnel.map((step, index) => (
            <div key={step.label}>
              <span>{step.label}</span>
              <i style={{ width: `${Math.max(18, (step.value / funnelMaximum) * 100)}%` }} />
              <strong>{step.value.toLocaleString('en-GB')}</strong>
              {index > 0 && <small>{Math.round((step.value / analytics.funnel[index - 1].value) * 100)}% from previous</small>}
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
