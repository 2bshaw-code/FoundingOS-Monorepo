/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { readBrandScrapeRows, readRecentEngagementLog, readRecentAnomalyLog } from '../scraping-store.server'
import { buildCustomerPipeline } from '../customer-pipeline-store.server'
import { ScrapingDashboard } from '@foundingos/ui/superdash/ScrapingDashboard'
import { CustomerPipelinePanel } from '@foundingos/ui/superdash/CustomerPipelinePanel'
import { RealPipelineValuePanel } from '@foundingos/ui/real-pipeline-value-panel'

// FounderOS-only route (same access model as /superdashboard itself — middleware.ts already
// gates this whole /superdashboard/* prefix: admin gets full read/write access, free-roam/
// investor/lawyer get read-only, tester/survey sessions are redirected away). Do not import
// or link this page from any brand console. The "Run Scrape" trigger itself is additionally
// admin-only at the API layer (/api/superdash/scraper/run checks for a real ADMIN_COOKIE),
// so a free-roam/investor/lawyer session can never actually trigger a write even if the
// button were visible — readOnly here just keeps the UI honest about that.
export const metadata = { title: 'Scraping & Pipeline | FoundingOS' }

export default async function ScrapingDashboardPage({ searchParams }: { searchParams: Promise<{ readOnly?: string }> }) {
  const { readOnly } = await searchParams
  const [rows, engagementLog, anomalyLog, pipeline] = await Promise.all([
    readBrandScrapeRows(),
    readRecentEngagementLog(),
    readRecentAnomalyLog(),
    buildCustomerPipeline(),
  ])

  return (
    <section className="stack" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
      <header className="module-header header-premium">
        <p>SuperDash</p>
        <h1>Scraping & Customer Pipeline</h1>
        <span>Real synthetic engagement data across all 8 brands, plus a segmentation view built on real survey submissions.</span>
      </header>

      <ScrapingDashboard initialRows={rows} initialEngagementLog={engagementLog} initialAnomalyLog={anomalyLog} readOnly={readOnly === '1'} />

      <CustomerPipelinePanel
        contacts={pipeline.contacts}
        stageCounts={pipeline.stageCounts}
        brandCounts={pipeline.brandCounts}
        totalContacts={pipeline.totalContacts}
        totalSubmissions={pipeline.totalSubmissions}
      />

      <RealPipelineValuePanel />
    </section>
  )
}
