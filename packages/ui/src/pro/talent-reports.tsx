'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { talentModules } from '../talent-workspace'
import { opsSchemaFor } from './ops-registry'
import { OpsInsightsPanel } from './ops-panel'
import type { LoadRecords, ProRecord } from './shared'
import { loadTalentReportSources, talentReportModules } from './talent-report-data'

export function TalentReportsPage({ loadRecords, production }: { loadRecords: LoadRecords; production: boolean }) {
  const loader = useRef(loadRecords)
  loader.current = loadRecords
  const [data, setData] = useState<Record<string, ProRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const root = production ? '/app' : '/test-workspaces'
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setData({})
    void loadTalentReportSources(loader.current)
      .then((results) => { if (active) setData(results) })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Recruitment reports could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [production, revision])
  return <>
    <header className="retail-app-heading"><div><p>Core.Workforce · Recruiter desk</p><h1>Recruitment reports</h1><span>Jobs, candidate sources, follow-ups, client feedback, recruiter activity and placement fees from your recorded Talent work.</span></div><div className="pro-actions"><button disabled={loading} onClick={() => setRevision((value) => value + 1)} type="button">Refresh reports</button><button disabled={loading || Boolean(error)} onClick={() => window.print()} type="button">Print report summary / PDF</button></div></header>
    <section className="pro-panel"><p>{production ? 'Recorded tenant data' : 'Demo / browser simulation'} · Reports cover the records returned by each module, not a reconciled external-provider warehouse. Activity covers today and the preceding six calendar dates; other measures cover the loaded register.</p><div className="pro-actions">{talentModules.filter((module) => talentReportModules.some((id) => id === module.id)).map((module) => <Link key={module.id} href={`${root}/talent/${module.id}`}>Open {module.label.toLowerCase()}</Link>)}</div></section>
    {loading ? <p role="status">Loading recruitment reports…</p> : error ? <section className="pro-panel"><p role="alert">{error} Reports are unavailable; missing data is not counted as zero.</p><button onClick={() => setRevision((value) => value + 1)} type="button">Retry reports</button></section> : talentReportModules.map((id) => {
      const module = talentModules.find((item) => item.id === id)!
      const schema = opsSchemaFor('talent', id)!
      const records = data[id] ?? []
      return <section key={id} aria-label={`${module.label} report`}>
        <h2>{module.label}</h2>
        {records.length ? <OpsInsightsPanel schema={schema} records={records} statuses={module.statuses ?? []} onOpen={() => { window.location.assign(`${root}/talent/${id}`) }} /> : <p>No {module.label.toLowerCase()} records loaded. <Link href={`${root}/talent/${id}#new`}>Add {module.label.toLowerCase()}</Link></p>}
      </section>
    })}
  </>
}
