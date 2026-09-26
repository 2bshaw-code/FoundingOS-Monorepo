'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useState } from 'react'
import { DocumentPanel } from './document-panel'
import { BusinessDocument, DocumentProfile } from './documents'
import { Deal, dealQuoteRecord, dealSources, dealStages, isOpenDeal, readDeal, stageProbability } from './models'
import { lastMonths, money, monthKey, monthLabel, penceFrom, poundsInput, ProRecord, ratio, SaveRecord, shortMoney, todayIso } from './shared'

export function DealPanel({ record, save, profile, createInvoice }: {
  record: ProRecord
  save: SaveRecord
  profile: DocumentProfile
  createInvoice: (doc: BusinessDocument, deal: Deal) => Promise<string>
}) {
  const initial = useMemo(() => readDeal(record), [record])
  const [deal, setDeal] = useState(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showQuote, setShowQuote] = useState(Boolean(record.data?.document))
  useEffect(() => { setDeal(initial); setDirty(false) }, [initial])

  const edit = (patch: Partial<Deal>) => { setDeal((current) => ({ ...current, ...patch })); setDirty(true) }
  const persist = async (next: Deal, status?: string, note = 'Deal saved') => {
    setBusy(true)
    setMessage('')
    try {
      await save({ valuePence: next.amountPence, status, data: { deal: next, secondary: next.company, email: next.email || undefined, phone: next.phone || undefined, dueDate: next.expectedClose || undefined } })
      setDeal(next)
      setDirty(false)
      setMessage(note)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save deal')
    } finally {
      setBusy(false)
    }
  }
  const weighted = Math.round((deal.amountPence * deal.probability) / 100)
  const stale = deal.nextStepDate && deal.nextStepDate < todayIso() && isOpenDeal(record.status)

  return (
    <section className="pro-panel pro-deal">
      <header className="pro-panel-head">
        <div><span className="pro-eyebrow">Deal · {record.status}</span><strong>{deal.company || record.name}</strong></div>
        <div className="pro-badges">
          <span className="pro-badge">{money(deal.amountPence)}</span>
          <span className="pro-badge">Weighted {money(weighted)}</span>
          {stale && <span className="pro-badge is-danger">Next step overdue</span>}
          {!deal.nextStep && isOpenDeal(record.status) && <span className="pro-badge is-warn">No next step</span>}
        </div>
      </header>
      <div className="pro-grid-2">
        <label>Company<input value={deal.company} onChange={(event) => edit({ company: event.target.value })} /></label>
        <label>Contact<input value={deal.contact} onChange={(event) => edit({ contact: event.target.value })} /></label>
        <label>Email<input type="email" value={deal.email} onChange={(event) => edit({ email: event.target.value })} /></label>
        <label>Phone<input value={deal.phone} onChange={(event) => edit({ phone: event.target.value })} /></label>
        <label>Deal value £<input inputMode="decimal" defaultValue={poundsInput(deal.amountPence)} key={`amt-${initial.amountPence}`} onBlur={(event) => edit({ amountPence: penceFrom(event.target.value) })} /></label>
        <label>Probability %<input type="number" min={0} max={100} value={deal.probability} onChange={(event) => edit({ probability: Math.min(100, Math.max(0, Number(event.target.value) || 0)) })} /></label>
        <label>Expected close<input type="date" value={deal.expectedClose} onChange={(event) => edit({ expectedClose: event.target.value })} /></label>
        <label>Source<select value={deal.source} onChange={(event) => edit({ source: event.target.value })}><option value="">Select…</option>{dealSources.map((source) => <option key={source}>{source}</option>)}</select></label>
        <label>Next step<input value={deal.nextStep} placeholder="e.g. Send revised proposal" onChange={(event) => edit({ nextStep: event.target.value })} /></label>
        <label>Next step date<input type="date" value={deal.nextStepDate} onChange={(event) => edit({ nextStepDate: event.target.value })} /></label>
      </div>
      {record.status === 'Lost' && <label>Lost reason<input value={deal.lostReason} onChange={(event) => edit({ lostReason: event.target.value })} /></label>}
      <div className="pro-actions">
        <button type="button" className="is-primary" disabled={busy || !dirty} onClick={() => void persist(deal)}>{busy ? 'Saving…' : dirty ? 'Save deal' : 'Saved'}</button>
        <div className="pro-stage-picker" role="group" aria-label="Move stage">
          {dealStages.filter((stage) => stage !== 'Won' && stage !== 'Lost').map((stage) => (
            <button type="button" key={stage} className={record.status === stage ? 'is-selected' : ''} disabled={busy} onClick={() => void persist({ ...deal, probability: stageProbability[stage] }, stage, `Moved to ${stage}`)}>{stage}</button>
          ))}
        </div>
        <button type="button" className="is-good" disabled={busy || record.status === 'Won'} onClick={() => void persist({ ...deal, probability: 100, closedAt: todayIso() }, 'Won', 'Deal won')}>Mark won</button>
        <button type="button" className="is-danger" disabled={busy || record.status === 'Lost'} onClick={() => { const reason = window.prompt('Why was this deal lost?', deal.lostReason || '') ?? ''; void persist({ ...deal, probability: 0, lostReason: reason, closedAt: todayIso() }, 'Lost', 'Deal marked lost') }}>Mark lost</button>
        {deal.email && <a className="pro-button" href={`mailto:${encodeURIComponent(deal.email)}?subject=${encodeURIComponent(record.name)}`}>Email contact</a>}
      </div>
      {message && <p className="pro-message" role="status">{message}</p>}
      {showQuote
        ? <DocumentPanel record={dealQuoteRecord(record, deal)} kind="quote" profile={profile} save={(patch) => save({ ...patch, name: undefined, data: { ...patch.data, secondary: deal.company, deal: { ...deal, amountPence: patch.valuePence ?? deal.amountPence } } })} statuses={dealStages} convertLabel="Convert to invoice" onConvert={(doc) => createInvoice(doc, deal)} />
        : <button type="button" className="pro-link" onClick={() => setShowQuote(true)}>+ Build a quote for this deal</button>}
    </section>
  )
}

export function SalesForecastPanel({ records }: { records: ProRecord[] }) {
  const deals = records.map((record) => ({ record, deal: readDeal(record) }))
  const open = deals.filter(({ record }) => isOpenDeal(record.status))
  const won = deals.filter(({ record }) => record.status === 'Won')
  const lost = deals.filter(({ record }) => record.status === 'Lost')
  const pipeline = open.reduce((sum, { deal }) => sum + deal.amountPence, 0)
  const weighted = open.reduce((sum, { deal }) => sum + Math.round((deal.amountPence * deal.probability) / 100), 0)
  const wonValue = won.reduce((sum, { deal }) => sum + deal.amountPence, 0)
  const noNextStep = open.filter(({ deal }) => !deal.nextStep).length
  const overdue = open.filter(({ deal }) => deal.nextStepDate && deal.nextStepDate < todayIso()).length
  const pastClose = open.filter(({ deal }) => deal.expectedClose && deal.expectedClose < todayIso()).length
  const months = lastMonths(3, new Date(Date.now() + 62 * 86_400_000))
  const byMonth = months.map((key) => ({
    key,
    value: open.filter(({ deal }) => (deal.expectedClose ? monthKey(deal.expectedClose) : '') === key).reduce((sum, { deal }) => sum + Math.round((deal.amountPence * deal.probability) / 100), 0),
  }))
  const undated = open.filter(({ deal }) => !deal.expectedClose).reduce((sum, { deal }) => sum + Math.round((deal.amountPence * deal.probability) / 100), 0)
  const maxMonth = Math.max(1, undated, ...byMonth.map((month) => month.value))
  return (
    <section className="pro-panel pro-forecast">
      <header className="pro-panel-head"><div><span className="pro-eyebrow">Sales forecast</span><strong>Weighted {money(weighted)}</strong></div></header>
      <div className="pro-kpis">
        <div><span>Open pipeline</span><b>{shortMoney(pipeline)}</b><small>{open.length} deal{open.length === 1 ? '' : 's'}</small></div>
        <div><span>Won</span><b>{shortMoney(wonValue)}</b><small>{won.length} deal{won.length === 1 ? '' : 's'}</small></div>
        <div><span>Win rate</span><b>{ratio(won.length, won.length + lost.length, 0)}</b><small>won ÷ closed</small></div>
        <div><span>Average deal</span><b>{shortMoney(won.length ? Math.round(wonValue / won.length) : open.length ? Math.round(pipeline / open.length) : 0)}</b><small>{won.length ? 'won deals' : 'open deals'}</small></div>
      </div>
      <div className="pro-bars">
        {byMonth.map((month) => <div key={month.key}><span>{monthLabel(month.key)}</span><i style={{ width: `${(month.value / maxMonth) * 100}%` }} /><b>{shortMoney(month.value)}</b></div>)}
        {undated > 0 && <div><span>No date</span><i style={{ width: `${(undated / maxMonth) * 100}%`, opacity: 0.45 }} /><b>{shortMoney(undated)}</b></div>}
      </div>
      <ul className="pro-alerts">
        {noNextStep > 0 && <li className="is-warn">{noNextStep} open deal{noNextStep === 1 ? '' : 's'} with no next step</li>}
        {overdue > 0 && <li className="is-danger">{overdue} deal{overdue === 1 ? '' : 's'} with an overdue next step</li>}
        {pastClose > 0 && <li className="is-warn">{pastClose} deal{pastClose === 1 ? '' : 's'} past expected close date — update or close out</li>}
        {!noNextStep && !overdue && !pastClose && <li className="is-good">Pipeline hygiene is clean</li>}
      </ul>
    </section>
  )
}
