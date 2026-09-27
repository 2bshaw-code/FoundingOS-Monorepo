'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Web rendering of the specialist operational tools defined in ops-registry.ts.
import { useEffect, useMemo, useState } from 'react'
import { opsPatch, readOps, str, type OpsField, type OpsInsight, type OpsRecordLike, type OpsSchema, type OpsTone, type OpsValues } from './ops-registry'
import { downloadCsv, penceFrom, poundsInput, type ProRecord, type SaveRecord } from './shared'

export const opsRecord = (record: ProRecord): OpsRecordLike => ({ id: record.id, name: record.name, secondary: record.secondary, status: record.status, owner: record.owner, dueDate: record.dueDate, valuePence: record.value ? penceFrom(record.value) : null, data: record.data })
const isDemo = (record: ProRecord) => !record.backendId
const toneClass = (tone?: OpsTone) => (tone === 'risk' ? ' is-danger' : tone === 'watch' ? ' is-warn' : tone === 'good' ? ' is-good' : '')

export function OpsInsightsPanel({ schema, records, statuses, onOpen }: { schema: OpsSchema; records: ProRecord[]; statuses: string[]; onOpen: (id: string) => void }) {
  const insight: OpsInsight = useMemo(() => schema.insights(records.map((record) => ({ record: opsRecord(record), v: readOps(opsRecord(record), schema, isDemo(record)) })), { statuses }), [records, schema, statuses])
  const [open, setOpen] = useState(true)
  if (!records.length) return null
  const exportRows = () => downloadCsv(`${schema.title.toLowerCase().replace(/\s+/g, '-')}-register.csv`, [['Name', 'Status', ...schema.fields.filter((field) => field.type !== 'checklist' && field.type !== 'score').map((field) => field.label)], ...records.map((record) => { const v = readOps(opsRecord(record), schema, isDemo(record)); return [record.name, record.status, ...schema.fields.filter((field) => field.type !== 'checklist' && field.type !== 'score').map((field) => field.type === 'money' ? poundsInput(Number(v[field.key]) || 0) : str(v[field.key]))] })])
  return <section className="pro-panel ops-insights" aria-label={`${schema.title} analysis`}>
    <header className="pro-panel-head">
      <div><span className="pro-eyebrow">Specialist view</span><strong>{schema.title} analysis</strong></div>
      <div className="pro-actions"><button type="button" onClick={exportRows}>Export CSV</button><button type="button" onClick={() => setOpen((value) => !value)}>{open ? 'Hide' : 'Show'}</button></div>
    </header>
    {open ? <>
      <div className="ops-kpis">{insight.kpis.map((kpi) => <div key={kpi.label} className={`ops-kpi${toneClass(kpi.tone)}`}><span>{kpi.label}</span><strong>{kpi.value}</strong></div>)}</div>
      {insight.alerts.length ? <ul className="ops-alerts">{insight.alerts.slice(0, 6).map((alert, index) => <li key={index} className={`ops-alert${toneClass(alert.tone)}`}><span>{alert.text}</span>{alert.recordId ? <button type="button" onClick={() => onOpen(alert.recordId as string)}>Open</button> : null}</li>)}</ul> : <p className="ops-clear">✓ Nothing needs attention — this is how a professional register looks.</p>}
      <div className="ops-visuals">
        {insight.bars.filter((bar) => bar.items.length).map((bar) => { const max = Math.max(1, ...bar.items.map((item) => item.value)); return <div key={bar.title} className="ops-bars"><h4>{bar.title}</h4>{bar.items.slice(0, 8).map((item) => <div key={item.label} className="ops-bar"><span>{item.label}</span><i style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }} /><b>{item.display}</b></div>)}</div> })}
        {insight.tables.filter((table) => table.rows.length).map((table) => <div key={table.title} className="ops-table"><h4>{table.title}</h4><table className="pro-table"><thead><tr>{table.columns.map((column, index) => <th key={column} className={table.numeric?.includes(index) ? 'n' : undefined}>{column}</th>)}</tr></thead><tbody>{table.rows.slice(0, 10).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index} className={table.numeric?.includes(index) ? 'n' : undefined}>{cell}</td>)}</tr>)}</tbody></table></div>)}
      </div>
    </> : null}
  </section>
}

function FieldInput({ field, value, onChange }: { field: OpsField; value: unknown; onChange: (value: unknown) => void }) {
  if (field.type === 'textarea') return <textarea rows={3} value={str(value)} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
  if (field.type === 'select') return <select value={str(value)} onChange={(event) => onChange(event.target.value)}><option value="">Choose…</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>
  if (field.type === 'money') return <input inputMode="decimal" value={value === undefined || value === '' ? '' : poundsInput(Number(value) || 0)} placeholder="£0.00" onChange={(event) => onChange(event.target.value === '' ? '' : penceFrom(event.target.value))} />
  if (field.type === 'number') return <input type="number" value={value === undefined ? '' : str(value)} onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))} />
  if (field.type === 'checklist') {
    const checked = Array.isArray(value) ? value.map(String) : []
    return <div className="ops-checklist">{field.items?.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={(event) => onChange(event.target.checked ? [...checked, item] : checked.filter((entry) => entry !== item))} />{item}</label>)}</div>
  }
  if (field.type === 'score') {
    const current = value && typeof value === 'object' ? value as Record<string, number> : {}
    return <div className="ops-scores">{field.criteria?.map((criterion) => <div key={criterion} className="ops-score"><span>{criterion}</span><div>{[1, 2, 3, 4, 5].map((score) => <button key={score} type="button" className={current[criterion] === score ? 'is-primary' : undefined} onClick={() => onChange({ ...current, [criterion]: score })}>{score}</button>)}</div></div>)}</div>
  }
  return <input type={field.type === 'date' ? 'date' : field.type === 'time' ? 'time' : 'text'} value={str(value)} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
}

export function OpsFormPanel({ schema, record, save }: { schema: OpsSchema; record: ProRecord; save: SaveRecord }) {
  const like = useMemo(() => opsRecord(record), [record])
  const initial = useMemo(() => readOps(like, schema, isDemo(record)), [like, schema, record])
  const [values, setValues] = useState<OpsValues>(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showLetter, setShowLetter] = useState(false)
  useEffect(() => { setValues(initial); setDirty(false); setMessage('') }, [initial])
  const summary = schema.summary?.(values, like) ?? []
  const letter = schema.letter ? schema.letter.build(values, like) : ''
  const persist = async () => {
    setBusy(true)
    try { await save(opsPatch(values, schema)); setDirty(false); setMessage('Saved') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save') } finally { setBusy(false) }
  }
  const wide = (field: OpsField) => field.type === 'textarea' || field.type === 'checklist' || field.type === 'score'
  return <section className="pro-panel ops-form" aria-label={`${schema.title} details`}>
    <header className="pro-panel-head">
      <div><span className="pro-eyebrow">{schema.title}</span><strong>{record.name}</strong></div>
      <div className="pro-badges">{summary.map((stat) => <span key={stat.label} className={`pro-badge${toneClass(stat.tone)}`}>{stat.label}: {stat.value}</span>)}</div>
    </header>
    <p className="ops-intro">{schema.intro}</p>
    <div className="pro-grid-2 ops-fields">
      {schema.fields.map((field) => {
        const input = <FieldInput field={field} value={values[field.key]} onChange={(value) => { setValues((current) => ({ ...current, [field.key]: value })); setDirty(true) }} />
        const caption = `${field.label}${field.unit ? ` (${field.unit})` : ''}`
        return field.type === 'checklist' || field.type === 'score'
          ? <fieldset className="ops-field-group ops-wide" key={field.key}><legend>{caption}</legend>{input}{field.hint ? <small>{field.hint}</small> : null}</fieldset>
          : <label className={wide(field) ? 'ops-wide' : undefined} key={field.key}><span>{caption}</span>{input}{field.hint ? <small>{field.hint}</small> : null}</label>
      })}
    </div>
    <div className="pro-actions">
      <button type="button" className="is-primary" disabled={busy || !dirty} onClick={() => void persist()}>{busy ? 'Saving…' : dirty ? `Save ${schema.title.toLowerCase()}` : 'Saved'}</button>
      {schema.letter ? <button type="button" onClick={() => setShowLetter((value) => !value)}>{showLetter ? 'Hide' : 'Generate'} {schema.letter.label.toLowerCase()}</button> : null}
      {message ? <span className="ops-message">{message}</span> : null}
    </div>
    {showLetter && schema.letter ? <div className="ops-letter">
      <pre>{letter}</pre>
      <div className="pro-actions">
        <button type="button" onClick={() => void navigator.clipboard?.writeText(letter)}>Copy</button>
        <button type="button" onClick={() => { const url = URL.createObjectURL(new Blob([letter], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `${schema.letter?.label.toLowerCase().replace(/\s+/g, '-')}-${record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`; link.click(); URL.revokeObjectURL(url) }}>Download</button>
      </div>
    </div> : null}
  </section>
}
