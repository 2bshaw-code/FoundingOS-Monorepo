'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BusinessDocument, DocumentKind, DocumentLine, DocumentProfile, documentLabel, documentTotals, emailDocumentLink,
  emptyProfile, lineId, printDocument, readDocument, readProfile, VatRate, vatRates,
} from './documents'
import { addDays, daysBetween, money, penceFrom, poundsInput, ProRecord, SaveRecord, todayIso } from './shared'

const PROFILE_KEY = 'foundingos.document-profile'

export function useDocumentProfile(scope: string, load?: () => Promise<Record<string, unknown> | null>, persist?: (profile: DocumentProfile) => Promise<void>) {
  const loader = useRef(load)
  loader.current = load
  const [profile, setProfile] = useState<DocumentProfile>(() => {
    if (typeof window === 'undefined') return emptyProfile
    try { return readProfile(JSON.parse(window.localStorage.getItem(PROFILE_KEY) || '{}')) } catch { return emptyProfile }
  })
  useEffect(() => {
    let active = true
    if (!scope) return
    loader.current?.().then((data) => { if (active && data) setProfile(readProfile(data)) }).catch(() => undefined)
    return () => { active = false }
  }, [scope])
  const save = async (next: DocumentProfile) => {
    setProfile(next)
    try { window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    await persist?.(next)
  }
  return { profile, save }
}

const paidStatus = (kind: DocumentKind) => (kind === 'quote' ? 'Accepted' : 'Paid')

export function DocumentPanel({ record, kind, profile, save, statuses, onConvert, convertLabel }: {
  record: ProRecord
  kind: DocumentKind
  profile: DocumentProfile
  save: SaveRecord
  statuses?: string[]
  onConvert?: (doc: BusinessDocument) => Promise<string>
  convertLabel?: string
}) {
  const initial = useMemo(() => readDocument(record, kind, profile), [record, kind, profile])
  const [doc, setDoc] = useState<BusinessDocument>(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [payment, setPayment] = useState({ amount: '', date: todayIso(), method: 'Bank transfer', reference: '' })
  useEffect(() => { setDoc(initial); setDirty(false); setMessage('') }, [initial])

  const totals = documentTotals(doc)
  const overdueDays = kind !== 'quote' && totals.balance > 0 ? daysBetween(doc.dueDate, todayIso()) : 0
  const edit = (patch: Partial<BusinessDocument>) => { setDoc((current) => ({ ...current, ...patch })); setDirty(true) }
  const editLine = (id: string, patch: Partial<DocumentLine>) => edit({ lines: doc.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)) })

  const persist = async (next: BusinessDocument, extra: { status?: string } = {}, note = 'Saved') => {
    setBusy(true)
    setMessage('')
    try {
      const nextTotals = documentTotals(next)
      await save({
        name: (kind === 'bill' ? next.party.name : next.number) || record.name,
        valuePence: kind === 'credit-note' ? -nextTotals.total : nextTotals.total,
        data: { document: next, secondary: kind === 'bill' ? `${next.lines[0]?.description || 'Bill'} · bill ${next.number}` : next.party.name, email: next.party.email || undefined, dueDate: next.dueDate },
        ...extra,
      })
      setDoc(next)
      setDirty(false)
      setMessage(note)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  const recordPayment = () => {
    const amountPence = penceFrom(payment.amount || poundsInput(totals.balance))
    if (amountPence <= 0) return setMessage('Enter a payment amount')
    const next = { ...doc, payments: [...doc.payments, { id: lineId(), date: payment.date, amountPence, method: payment.method, reference: payment.reference }] }
    const settled = documentTotals(next).balance <= 0
    setPayment({ amount: '', date: todayIso(), method: payment.method, reference: '' })
    void persist(next, settled && statuses?.includes('Paid') ? { status: 'Paid' } : {}, settled ? 'Paid in full' : `Payment of ${money(amountPence)} recorded`)
  }

  const markSent = () => {
    const sentStatus = statuses?.find((status) => ['Sent', 'Approved', 'Issued'].includes(status))
    void persist({ ...doc, sentAt: new Date().toISOString() }, sentStatus ? { status: sentStatus } : {}, 'Marked as sent')
  }

  const print = () => { if (!printDocument(doc, profile)) setMessage('Allow pop-ups to print or save as PDF') }

  return (
    <section className="pro-panel pro-document">
      <header className="pro-panel-head">
        <div>
          <span className="pro-eyebrow">{documentLabel[kind]}</span>
          <strong>{doc.number}</strong>
        </div>
        <div className="pro-badges">
          {overdueDays > 0 && <span className="pro-badge is-danger">{overdueDays}d overdue</span>}
          {kind !== 'quote' && totals.balance <= 0 && totals.total > 0 && <span className="pro-badge is-good">Paid</span>}
          {doc.sentAt && <span className="pro-badge">Sent {doc.sentAt.slice(0, 10)}</span>}
        </div>
      </header>

      <div className="pro-grid-3">
        <label>Number<input value={doc.number} onChange={(event) => edit({ number: event.target.value })} /></label>
        <label>Issue date<input type="date" value={doc.issueDate} onChange={(event) => edit({ issueDate: event.target.value, dueDate: addDays(event.target.value, doc.termsDays) })} /></label>
        <label>{kind === 'quote' ? 'Valid for (days)' : 'Terms (days)'}<input type="number" min={0} value={doc.termsDays} onChange={(event) => { const termsDays = Number(event.target.value) || 0; edit({ termsDays, dueDate: addDays(doc.issueDate, termsDays) }) }} /></label>
        <label>{kind === 'quote' ? 'Valid until' : 'Due date'}<input type="date" value={doc.dueDate} onChange={(event) => edit({ dueDate: event.target.value })} /></label>
        <label>PO / reference<input value={doc.poReference} onChange={(event) => edit({ poReference: event.target.value })} /></label>
        <label>Discount %<input type="number" min={0} max={100} value={doc.discountPercent} onChange={(event) => edit({ discountPercent: Number(event.target.value) || 0 })} /></label>
      </div>

      <div className="pro-grid-2">
        <label>{kind === 'bill' ? 'Supplier' : 'Customer'}<input value={doc.party.name} onChange={(event) => edit({ party: { ...doc.party, name: event.target.value } })} /></label>
        <label>Email<input type="email" value={doc.party.email} onChange={(event) => edit({ party: { ...doc.party, email: event.target.value } })} /></label>
        <label>Address<textarea rows={2} value={doc.party.address} onChange={(event) => edit({ party: { ...doc.party, address: event.target.value } })} /></label>
        <label>VAT number<input value={doc.party.vatNumber} onChange={(event) => edit({ party: { ...doc.party, vatNumber: event.target.value } })} /></label>
      </div>

      <table className="pro-lines">
        <thead><tr><th>Description</th><th>Qty</th><th>Unit £</th><th>VAT</th><th className="n">Net</th><th /></tr></thead>
        <tbody>
          {doc.lines.map((line) => (
            <tr key={line.id}>
              <td><input value={line.description} placeholder="Item or service" onChange={(event) => editLine(line.id, { description: event.target.value })} /></td>
              <td><input type="number" step="any" value={line.quantity} onChange={(event) => editLine(line.id, { quantity: Number(event.target.value) || 0 })} /></td>
              <td><input inputMode="decimal" defaultValue={poundsInput(line.unitPence)} key={`${line.id}-${line.unitPence}`} onBlur={(event) => editLine(line.id, { unitPence: penceFrom(event.target.value) })} /></td>
              <td><select value={line.vatRate} onChange={(event) => editLine(line.id, { vatRate: Number(event.target.value) as VatRate })}>{vatRates.map((rate) => <option key={rate.value} value={rate.value}>{rate.label}</option>)}</select></td>
              <td className="n">{money(Math.round(line.quantity * line.unitPence))}</td>
              <td><button type="button" className="pro-icon" aria-label="Remove line" disabled={doc.lines.length === 1} onClick={() => edit({ lines: doc.lines.filter((item) => item.id !== line.id) })}>×</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="pro-link" onClick={() => edit({ lines: [...doc.lines, { id: lineId(), description: '', quantity: 1, unitPence: 0, vatRate: 20 }] })}>+ Add line</button>

      <dl className="pro-totals">
        <div><dt>Subtotal</dt><dd>{money(totals.gross)}</dd></div>
        {totals.discount > 0 && <div><dt>Discount</dt><dd>−{money(totals.discount)}</dd></div>}
        <div><dt>Net</dt><dd>{money(totals.net)}</dd></div>
        <div><dt>VAT</dt><dd>{money(totals.vat)}</dd></div>
        <div className="is-total"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
        {kind !== 'quote' && totals.paid > 0 && <div><dt>Paid</dt><dd>−{money(totals.paid)}</dd></div>}
        {kind !== 'quote' && <div className="is-total"><dt>Balance</dt><dd>{money(Math.max(0, totals.balance))}</dd></div>}
      </dl>

      <label>Notes / terms<textarea rows={2} value={doc.notes} onChange={(event) => edit({ notes: event.target.value })} /></label>

      {kind !== 'quote' && totals.balance > 0 && (
        <div className="pro-payment">
          <strong>{kind === 'bill' ? 'Record payment made' : 'Record payment received'}</strong>
          <div className="pro-grid-4">
            <input inputMode="decimal" placeholder={poundsInput(totals.balance)} value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} />
            <input type="date" value={payment.date} onChange={(event) => setPayment({ ...payment, date: event.target.value })} />
            <select value={payment.method} onChange={(event) => setPayment({ ...payment, method: event.target.value })}>{['Bank transfer', 'Card', 'Direct debit', 'Cash', 'Cheque', 'Other'].map((method) => <option key={method}>{method}</option>)}</select>
            <input placeholder="Reference" value={payment.reference} onChange={(event) => setPayment({ ...payment, reference: event.target.value })} />
          </div>
          <button type="button" disabled={busy} onClick={recordPayment}>Record payment</button>
        </div>
      )}
      {doc.payments.length > 0 && (
        <ul className="pro-list">{doc.payments.map((item) => <li key={item.id}><span>{item.date} · {item.method}{item.reference ? ` · ${item.reference}` : ''}</span><b>{money(item.amountPence)}</b></li>)}</ul>
      )}

      <div className="pro-actions">
        <button type="button" className="is-primary" disabled={busy || !dirty} onClick={() => void persist(doc)}>{busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
        <button type="button" onClick={print}>Print / PDF</button>
        {kind !== 'bill' && <a className="pro-button" href={doc.party.email ? emailDocumentLink(doc, profile) : undefined} onClick={(event) => { if (!doc.party.email) { event.preventDefault(); setMessage('Add the customer email first') } }}>Email</a>}
        {kind !== 'bill' && !doc.sentAt && <button type="button" disabled={busy} onClick={markSent}>Mark sent</button>}
        {kind === 'quote' && statuses?.includes(paidStatus(kind)) && <button type="button" disabled={busy} onClick={() => void persist(doc, { status: paidStatus(kind) }, 'Quote accepted')}>Mark accepted</button>}
        {onConvert && <button type="button" disabled={busy} onClick={() => { setBusy(true); onConvert(doc).then(setMessage).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not convert')).finally(() => setBusy(false)) }}>{convertLabel || 'Convert to invoice'}</button>}
      </div>
      {!profile.businessName && <p className="pro-hint">Add your business, VAT and bank details under Document settings so they appear on printed documents.</p>}
      {message && <p className="pro-message" role="status">{message}</p>}
    </section>
  )
}

export function DocumentSettingsPanel({ profile, onSave }: { profile: DocumentProfile; onSave: (profile: DocumentProfile) => Promise<void> }) {
  const [draft, setDraft] = useState(profile)
  const [message, setMessage] = useState('')
  useEffect(() => setDraft(profile), [profile])
  const field = (key: keyof DocumentProfile, label: string, multiline = false) => (
    <label key={key}>{label}{multiline
      ? <textarea rows={2} value={String(draft[key])} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
      : <input value={String(draft[key])} onChange={(event) => setDraft({ ...draft, [key]: key === 'defaultTermsDays' ? Number(event.target.value) || 0 : event.target.value })} />}</label>
  )
  return (
    <details className="pro-panel pro-settings">
      <summary>Document settings — business, VAT and bank details</summary>
      <div className="pro-grid-2">
        {field('businessName', 'Business name')}{field('email', 'Accounts email')}
        {field('address', 'Address', true)}{field('phone', 'Phone')}
        {field('vatNumber', 'VAT registration number')}{field('companyNumber', 'Company number')}
        {field('bankName', 'Bank')}{field('accountName', 'Account name')}
        {field('sortCode', 'Sort code')}{field('accountNumber', 'Account number')}
        {field('iban', 'IBAN (optional)')}{field('defaultTermsDays', 'Default payment terms (days)')}
        {field('footer', 'Document footer', true)}
      </div>
      <div className="pro-actions">
        <button type="button" className="is-primary" onClick={() => onSave(draft).then(() => setMessage('Document settings saved')).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not save'))}>Save settings</button>
      </div>
      {message && <p className="pro-message" role="status">{message}</p>}
    </details>
  )
}
