/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Three real, plain-language AI summaries for the top of SuperDash — computed entirely from
// data SuperDash already fetches and displays below (BRAND_ROWS/ANOMALIES from
// SuperDashboardPage.tsx, and the same real Guardian warnings /system/guardian shows). No new
// data source, no invented numbers: every sentence here is a direct, honest read of fields
// that are already real and already on this page.
import { useAIAssistance } from '../ai-assistance'

export type SuperDashBrandRow = {
  brand: string
  serviceLoad: number
  previousServiceLoad: number
  status: 'good' | 'watch' | 'risk'
}

export type SuperDashAnomaly = { brand: string; signal: string; tone: 'good' | 'watch' | 'risk' }

export type SuperDashAISummaryData = {
  dailySummary: string
  whatChanged: string | null
  whatMatters: { text: string; investigateLabel: string; investigateHref: string } | null
}

// Pure computation — exported so it can be unit-tested/reused without the component wrapper.
export function computeSuperDashAISummary(brandRows: SuperDashBrandRow[], anomalies: SuperDashAnomaly[], guardianWarnings: string[]): SuperDashAISummaryData {
  const riskCount = brandRows.filter((row) => row.status === 'risk').length
  const watchCount = brandRows.filter((row) => row.status === 'watch').length

  let dailySummary: string
  if (riskCount > 0) {
    const watchNote = watchCount > 0 ? `, and ${watchCount} more worth watching` : ''
    dailySummary = `${riskCount} of ${brandRows.length} brands ${riskCount > 1 ? 'need' : 'needs'} attention right now${watchNote}.`
  } else if (watchCount > 0) {
    dailySummary = `Everything's stable — just ${watchCount} brand${watchCount > 1 ? 's' : ''} worth keeping an eye on.`
  } else {
    dailySummary = `All ${brandRows.length} brands are in great shape today — nothing needs your attention.`
  }

  // Real delta: serviceLoad vs previousServiceLoad, already both present on every brand row.
  // The single biggest absolute change wins — "keep it simple, one change only."
  let whatChanged: string | null = null
  if (brandRows.length > 0) {
    const biggest = brandRows.reduce((a, b) => (Math.abs(b.serviceLoad - b.previousServiceLoad) > Math.abs(a.serviceLoad - a.previousServiceLoad) ? b : a))
    const delta = biggest.serviceLoad - biggest.previousServiceLoad
    if (delta !== 0) {
      const direction = delta > 0 ? 'up' : 'down'
      whatChanged = `${biggest.brand}'s service load is ${direction} ${Math.abs(delta)} (from ${biggest.previousServiceLoad} to ${biggest.serviceLoad}) since the last check.`
    }
  }

  // Priority: a real active Guardian warning first (it's the closest thing to an operational
  // "something needs a human" signal); otherwise the top real anomaly; otherwise the single
  // worst-flagged brand row. Never a fabricated "fix" — just the honest top thing to look at.
  // investigateHref always points at a real, relevant destination: Guardian's own page for a
  // Guardian-sourced item, or the anomaly card already further down this same SuperDash page
  // for anything else (no point linking Guardian for something Guardian never flagged).
  let whatMatters: { text: string; investigateLabel: string; investigateHref: string } | null = null
  if (guardianWarnings.length > 0) {
    whatMatters = { text: guardianWarnings[0], investigateLabel: 'Open Guardian', investigateHref: '/system/guardian' }
  } else if (anomalies.length > 0) {
    const topAnomaly = anomalies.find((anomaly) => anomaly.tone === 'risk') ?? anomalies[0]
    whatMatters = { text: `${topAnomaly.brand}: ${topAnomaly.signal}`, investigateLabel: 'View anomaly detection', investigateHref: '#anomaly-detection' }
  } else {
    const worstBrand = brandRows.find((row) => row.status === 'risk') ?? brandRows.find((row) => row.status === 'watch')
    if (worstBrand) whatMatters = { text: `${worstBrand.brand} is flagged as ${worstBrand.status} right now.`, investigateLabel: 'View brand performance', investigateHref: '#brand-performance' }
  }

  return { dailySummary, whatChanged, whatMatters }
}

export function SuperDashAISummary({ brandRows, anomalies, guardianWarnings }: { brandRows: SuperDashBrandRow[]; anomalies: SuperDashAnomaly[]; guardianWarnings: string[] }) {
  const aiEnabled = useAIAssistance()
  if (!aiEnabled) return null

  const summary = computeSuperDashAISummary(brandRows, anomalies, guardianWarnings)

  return (
    <div className="superdash-ai-summary">
      <div className="superdash-ai-card">
        <span className="ai-insight-badge">AI</span>
        <div>
          <strong>Daily summary</strong>
          <p>{summary.dailySummary}</p>
        </div>
      </div>

      {summary.whatChanged && (
        <div className="superdash-ai-card">
          <span className="ai-insight-badge">AI</span>
          <div>
            <strong>What changed</strong>
            <p>{summary.whatChanged}</p>
          </div>
        </div>
      )}

      {summary.whatMatters && (
        <div className="superdash-ai-card">
          <span className="ai-insight-badge">AI</span>
          <div>
            <strong>What matters</strong>
            <p>{summary.whatMatters.text}</p>
            <a href={summary.whatMatters.investigateHref} className="ai-hint-cta">Investigate — {summary.whatMatters.investigateLabel}</a>
          </div>
        </div>
      )}
    </div>
  )
}
