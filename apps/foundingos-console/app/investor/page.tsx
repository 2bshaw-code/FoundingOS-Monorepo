/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../tester/session'
import { getTester } from '../tester/store.server'
import { categorizeCredential } from '../tester/tester-data'
import { readBrandMetrics } from '../superdashboard/brand-metric-store.server'

// Real, read-only Investor view — reuses the same live BrandMetric data that powers
// SuperDashboard, gated to sessions whose credential category is genuinely 'investor'
// (INV-ALPHA / INV-OMEGA). No write actions, no Guardian/Autonomous internals exposed.
export default async function InvestorPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester || categorizeCredential(testerId) !== 'investor') redirect('/tester/login')

  const brands = await readBrandMetrics()
  const totalEngagement = brands.reduce((sum, brand) => sum + brand.totalEngagement, 0)

  return (
    <section className="stack">
      <header className="module-header">
        <p>FoundingOS Investor View</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Read-only cross-brand engagement overview — live data, no admin actions.</span>
      </header>

      <div className="kpi-grid">
        <article className="dashboard-card fo-card good">
          <span>◈</span>
          <strong>{brands.length}</strong>
          <small>Brands reporting live data</small>
        </article>
        <article className="dashboard-card fo-card good">
          <span>Σ</span>
          <strong>{totalEngagement}</strong>
          <small>Total engagement (all brands)</small>
        </article>
      </div>

      <div className="console-grid">
        <article className="panel wide fo-card">
          <h2>Brand engagement</h2>
          <table className="superdashboard-brand-table">
            <thead>
              <tr><th>Brand</th><th>Total engagement</th><th>Anomaly score</th><th>Last updated</th></tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.brandName}>
                  <td>{brand.brandName}</td>
                  <td>{brand.totalEngagement}</td>
                  <td>{brand.anomalyScore.toFixed(2)}</td>
                  <td>{brand.lastUpdated.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  )
}
