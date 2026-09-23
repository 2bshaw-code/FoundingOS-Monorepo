/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FounderOS-only route (same convention as ../page.tsx): do not import or
// link this page from any brand console. Phase 36 — read-only internal view
// of the telemetry collected by Phases 28-31, filterable by suite/tenant via
// query params. Data comes from telemetry-summary-store.server.ts; see that
// file for the internal-API-token requirement and its documented blocker.
import { readTelemetrySummary } from '../telemetry-summary-store.server'

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export default async function TelemetryDashboardRoute({
  searchParams,
}: {
  searchParams: Promise<{ suite?: string; since?: string; tenant?: string }>
}) {
  const { suite, since } = await searchParams
  const summary = await readTelemetrySummary({ suite, since })
  const isConfigured = summary.totalEvents > 0 || summary.byName.length > 0

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#1a1a2e' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Telemetry — Internal</h1>
      <p style={{ color: '#666', marginTop: 0 }}>
        Cross-tenant action volume, error rate, and workspace activity from Phases 28-31&apos;s ingestion
        pipeline. Founder/internal roles only — not linked from any brand console.
      </p>

      {!isConfigured && (
        <p style={{ background: '#fff3cd', padding: '0.75rem 1rem', borderRadius: 6 }}>
          No data returned — either no events have been ingested yet, or this environment is missing
          <code> CORE_OPERATIONS_API_BASE</code>/<code>CORE_OPERATIONS_INTERNAL_TOKEN</code>. See{' '}
          <code>telemetry-summary-store.server.ts</code>.
        </p>
      )}

      <section style={{ display: 'flex', gap: '1.5rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
        <Stat label="Total events" value={summary.totalEvents} />
        <Stat label="Errors" value={summary.errorCount} />
        <Stat label="Error rate" value={formatPercent(summary.errorRate)} />
        <Stat label="Offline events" value={summary.offlineEventCount} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Table title="By suite" rows={summary.bySuite.map((r) => [r.suite, r.count])} />
        <Table title="By tenant" rows={summary.byTenant.map((r) => [r.tenantId, r.count])} />
        <Table title="Top event names" rows={summary.byName.slice(0, 15).map((r) => [r.name, r.count])} />
        <Table
          title="Recent events"
          rows={summary.recent.slice(0, 15).map((r) => [`${r.suite}/${r.name}`, new Date(r.occurredAt).toLocaleString()])}
        />
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ background: '#f6f6fb', borderRadius: 8, padding: '1rem 1.5rem', minWidth: 140 }}>
      <div style={{ fontSize: '0.8rem', color: '#666' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>{value}</div>
    </div>
  )
}

function Table({ title, rows }: { title: string; rows: Array<[string, string | number]> }) {
  return (
    <div>
      <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h2>
      {rows.length === 0 ? (
        <p style={{ color: '#999' }}>No data.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map(([key, value], index) => (
              <tr key={`${key}-${index}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.35rem 0' }}>{key}</td>
                <td style={{ padding: '0.35rem 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
