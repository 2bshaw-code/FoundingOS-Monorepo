/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Purpose-built workspace screens (till, work queue, ledger, stock room, signal
// feed), realistic sample data per module, and the FoundAI command bar that
// proposes actions on a module's records for the owner to approve.

import { useMemo, useState, type FormEvent } from 'react'
import type { ModuleKpi } from './module-profiles'
import { moduleSamples } from './sample-data'

export { moduleSamples }

export type WorkspaceLayout = 'till' | 'queue' | 'ledger' | 'stock' | 'feed'
export type LayoutRecord = { id: string; name: string; secondary: string; value: string; status: string; owner: string; updated: string; dueDate?: string; quantity?: number; reorderPoint?: number; imageUrl?: string }

const layouts: Record<string, WorkspaceLayout> = {
  'retail/point-of-sale': 'till',
  'retail/orders': 'queue', 'retail/fulfilment': 'queue', 'retail/returns': 'queue', 'retail/service': 'queue', 'retail/production-orders': 'queue',
  'logistics/dispatch': 'queue', 'logistics/deliveries': 'queue', 'logistics/exceptions': 'queue', 'logistics/routes': 'queue',
  'health/triage': 'queue', 'health/follow-ups': 'queue', 'health/compliance': 'queue',
  'finance/approvals': 'queue', 'hr/time-off': 'queue', 'hr/onboarding': 'queue', 'hr/timesheets': 'queue', 'hr/sickness': 'queue', 'talent/references': 'queue',
  'finance/invoices': 'ledger', 'finance/bills': 'ledger', 'finance/expenses': 'ledger', 'finance/payments': 'ledger', 'finance/reconciliation': 'ledger', 'finance/tax': 'ledger',
  'retail/payments': 'ledger', 'retail/purchasing': 'ledger', 'logistics/billing': 'ledger', 'logistics/quotes': 'ledger', 'health/billing': 'ledger', 'health/claims': 'ledger', 'hr/payroll': 'ledger', 'talent/placements': 'ledger',
  'retail/inventory': 'stock', 'health/inventory': 'stock',
  'intelligence/signals': 'feed', 'intelligence/risks': 'feed', 'intelligence/anomalies': 'feed', 'intelligence/recommendations': 'feed',
}

export const getWorkspaceLayout = (workspace: string, moduleId: string): WorkspaceLayout | undefined => layouts[`${workspace}/${moduleId}`]

// Verb shown on the primary button for a record in a given stage, and the stage it moves to.
const steps: Record<string, Record<string, [string, string]>> = {
  orders: { New: ['Start picking', 'Picking'], Picking: ['Mark ready', 'Ready'], Ready: ['Mark delivered', 'Delivered'] },
  fulfilment: { Queued: ['Start picking', 'Picking'], Picking: ['Mark packed', 'Packed'], Packed: ['Dispatch', 'Dispatched'] },
  returns: { Requested: ['Approve return', 'Approved'], Approved: ['Mark received', 'Received'], Received: ['Issue refund', 'Refunded'] },
  service: { Open: ['Assign to me', 'Assigned'], Assigned: ['Reply to customer', 'Waiting'], Waiting: ['Resolve', 'Resolved'] },
  'production-orders': { Planned: ['Start production', 'In production'], 'In production': ['Send to QC', 'Quality check'], 'Quality check': ['Pass QC', 'Complete'] },
  dispatch: { Unassigned: ['Assign driver', 'Assigned'], Assigned: ['Mark loaded', 'Loaded'], Loaded: ['Depart', 'Departed'] },
  deliveries: { Booked: ['Send out', 'Out for delivery'], 'Out for delivery': ['Mark delivered', 'Delivered'], Attempted: ['Rebook & deliver', 'Delivered'] },
  exceptions: { Open: ['Investigate', 'Investigating'], Investigating: ['Start recovery', 'Recovering'], Recovering: ['Resolve', 'Resolved'] },
  routes: { Planned: ['Optimise route', 'Optimised'], Optimised: ['Start route', 'Active'], Active: ['Complete route', 'Complete'] },
  triage: { New: ['Assess', 'Assessed'], Assessed: ['Assign clinician', 'Assigned'], Assigned: ['Complete', 'Complete'] },
  approvals: { Requested: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Close', 'Complete'] },
  'time-off': { Requested: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Mark taken', 'Complete'] },
  invoices: { Draft: ['Send invoice', 'Sent'], Sent: ['Record payment', 'Paid'], Overdue: ['Record payment', 'Paid'] },
  bills: { Received: ['Approve', 'Approved'], Approved: ['Schedule payment', 'Scheduled'], Scheduled: ['Mark paid', 'Paid'] },
  expenses: { Submitted: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Reimburse', 'Reimbursed'] },
  payments: { Pending: ['Authorise', 'Authorised'], Authorised: ['Mark paid', 'Paid'], Paid: ['Reconcile', 'Reconciled'] },
  reconciliation: { Unmatched: ['Suggest match', 'Suggested'], Suggested: ['Accept match', 'Matched'], Matched: ['Verify', 'Verified'] },
  purchasing: { Draft: ['Approve', 'Approved'], Approved: ['Place order', 'Ordered'], Ordered: ['Mark received', 'Received'] },
  billing: { Draft: ['Issue', 'Issued'], Issued: ['Mark paid', 'Paid'], Paid: ['Reconcile', 'Reconciled'] },
  claims: { Prepared: ['Submit claim', 'Submitted'], Submitted: ['Start review', 'Review'], Review: ['Mark settled', 'Settled'] },
  payroll: { Preparing: ['Submit for review', 'Review'], Review: ['Approve run', 'Approved'], Approved: ['Pay staff', 'Paid'] },
  signals: { Detected: ['Enrich', 'Enriched'], Enriched: ['Review', 'Reviewed'], Reviewed: ['Resolve', 'Resolved'] },
  risks: { Open: ['Investigate', 'Investigating'], Investigating: ['Mitigate', 'Mitigating'], Mitigating: ['Resolve', 'Resolved'] },
  anomalies: { Detected: ['Investigate', 'Investigating'], Investigating: ['Recover', 'Recovering'], Recovering: ['Resolve', 'Resolved'] },
  recommendations: { Proposed: ['Review', 'Review'], Review: ['Approve', 'Approved'], Approved: ['Execute', 'Executed'] },
}

export function nextStep(moduleId: string, status: string, statuses: string[]): { label: string; to: string } | null {
  const custom = steps[moduleId]?.[status]
  if (custom) return { label: custom[0], to: custom[1] }
  const index = statuses.indexOf(status)
  if (index < 0 || index >= statuses.length - 1) return null
  return { label: `Move to ${statuses[index + 1]}`, to: statuses[index + 1] }
}


const money = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
const gbp = (value: number) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || '•'
const daysUntil = (dueDate?: string) => {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(due.getTime())) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / 86400000)
}
const isOverdue = (record: LayoutRecord, statuses: string[]) => record.status === 'Overdue' || (record.status !== statuses.at(-1) && (daysUntil(record.dueDate) ?? 1) < 0)
const dueLabel = (dueDate?: string) => {
  const days = daysUntil(dueDate)
  if (days === null) return '—'
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Today'
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
const plainDate = (dueDate?: string) => dueDate ? new Date(`${dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'
const severity = (record: LayoutRecord): 'high' | 'medium' | 'low' => {
  const text = `${record.value} ${record.secondary}`.toLowerCase()
  if (/high|urgent/.test(text)) return 'high'
  if (/medium|soon/.test(text)) return 'medium'
  return 'low'
}

export type WorkspaceViewProps = {
  layout: WorkspaceLayout
  moduleId: string
  noun: string
  fields: { name: string; secondary: string; value: string; owner: string }
  records: LayoutRecord[]
  statuses: string[]
  selectedId?: string
  onSelect: (id: string) => void
  onMove: (record: LayoutRecord, status: string) => void
  onNote: (record: LayoutRecord, note: string) => void
  onCount: (record: LayoutRecord, quantity: number) => void
  onSell: (sale: { summary: string; total: number; method: string }) => Promise<void>
  catalogue: LayoutRecord[]
  busy: boolean
}

export function ModuleWorkspaceView(props: WorkspaceViewProps) {
  if (props.layout === 'till') return <TillView {...props} />
  if (props.layout === 'ledger') return <LedgerView {...props} />
  if (props.layout === 'stock') return <StockView {...props} />
  if (props.layout === 'feed') return <FeedView {...props} />
  return <QueueView {...props} />
}

function StatusTabs({ statuses, records, active, onChange }: { statuses: string[]; records: LayoutRecord[]; active: string; onChange: (status: string) => void }) {
  return <div className="mw-tabs" role="tablist">
    {['all', ...statuses].map((status) => <button aria-selected={active === status} key={status} onClick={() => onChange(status)} role="tab" type="button">
      {status === 'all' ? 'All' : status}<b>{status === 'all' ? records.length : records.filter((record) => record.status === status).length}</b>
    </button>)}
  </div>
}

function QueueView({ moduleId, fields, records, statuses, selectedId, onSelect, onMove, busy, noun }: WorkspaceViewProps) {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? records : records.filter((record) => record.status === tab)
  return <div className="mw-card">
    <StatusTabs active={tab} onChange={setTab} records={records} statuses={statuses} />
    <div className="mw-queue">
      {rows.map((record) => {
        const step = nextStep(moduleId, record.status, statuses)
        const late = isOverdue(record, statuses)
        return <article className={`mw-queue-row${selectedId === record.id ? ' selected' : ''}${late ? ' late' : ''}`} key={record.id} onClick={() => onSelect(record.id)}>
          <div className="mw-queue-main">{record.imageUrl ? <img alt="" className="mw-product-photo" src={record.imageUrl} /> : null}<strong>{record.name}</strong><span>{record.secondary}</span></div>
          <div className="mw-queue-meta"><small>{fields.value}</small><b>{record.value}</b></div>
          <div className="mw-queue-meta"><small>{fields.owner}</small><span className="mw-avatar-line"><i>{initials(record.owner)}</i>{record.owner}</span></div>
          <div className="mw-queue-meta"><small>{record.dueDate ? 'Due' : 'Updated'}</small><span className={late ? 'mw-late' : ''}>{record.dueDate ? dueLabel(record.dueDate) : record.updated}</span></div>
          <span className="mw-chip" data-stage={statuses.indexOf(record.status)}>{record.status}</span>
          {step ? <button className="mw-action" disabled={busy} onClick={(event) => { event.stopPropagation(); onMove(record, step.to) }} type="button">{step.label}</button> : <span className="mw-done">✓ Done</span>}
        </article>
      })}
      {rows.length === 0 ? <p className="mw-empty">Nothing in {tab === 'all' ? 'this queue' : `“${tab}”`}. No {noun}s waiting here.</p> : null}
    </div>
  </div>
}

function LedgerView({ moduleId, fields, records, statuses, selectedId, onSelect, onMove, onNote, busy }: WorkspaceViewProps) {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? records : records.filter((record) => record.status === tab)
  const totals = statuses.map((status) => ({ status, total: records.filter((record) => record.status === status).reduce((sum, record) => sum + money(record.value), 0) }))
  const overdueRecords = records.filter((record) => isOverdue(record, statuses))
  return <div className="mw-card">
    <div className="mw-ledger-totals">
      {totals.map(({ status, total }) => <button aria-pressed={tab === status} key={status} onClick={() => setTab(tab === status ? 'all' : status)} type="button"><small>{status}</small><strong>{gbp(total)}</strong></button>)}
      {overdueRecords.length && !statuses.includes('Overdue') ? <div className="mw-ledger-alert"><small>Overdue</small><strong>{gbp(overdueRecords.reduce((sum, record) => sum + money(record.value), 0))}</strong></div> : null}
    </div>
    <div className="mw-table-scroll"><table className="mw-ledger">
      <thead><tr><th>{fields.name}</th><th>{fields.secondary}</th><th>Due</th><th className="num">{fields.value}</th><th>Status</th><th /></tr></thead>
      <tbody>
        {rows.map((record) => {
          const step = nextStep(moduleId, record.status, statuses)
          const late = isOverdue(record, statuses)
          return <tr className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
            <td>{record.imageUrl ? <img alt="" className="mw-product-photo" src={record.imageUrl} /> : null}<strong>{record.name}</strong></td>
            <td className="muted">{record.secondary}</td>
            <td className={late ? 'mw-late' : ''}>{record.status === statuses.at(-1) ? plainDate(record.dueDate) : dueLabel(record.dueDate)}</td>
            <td className="num"><strong>{record.value}</strong></td>
            <td><span className="mw-chip" data-late={late || undefined} data-stage={statuses.indexOf(record.status)}>{late && record.status !== 'Overdue' ? 'Overdue' : record.status}</span></td>
            <td className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
              {late ? <button disabled={busy} onClick={() => onNote(record, 'Payment reminder sent on WhatsApp')} type="button">Send reminder</button> : null}
              {step ? <button className="mw-action" disabled={busy} onClick={() => onMove(record, step.to)} type="button">{step.label}</button> : <span className="mw-done">✓</span>}
            </td>
          </tr>
        })}
      </tbody>
      <tfoot><tr><td colSpan={3}>{rows.length} {rows.length === 1 ? 'item' : 'items'}</td><td className="num"><strong>{gbp(rows.reduce((sum, record) => sum + money(record.value), 0))}</strong></td><td colSpan={2} /></tr></tfoot>
    </table></div>
  </div>
}

function StockView({ records, selectedId, onSelect, onCount, onNote, busy }: WorkspaceViewProps) {
  const [counting, setCounting] = useState<string | null>(null)
  const [count, setCount] = useState('')
  const low = records.filter((record) => (record.quantity ?? 0) <= (record.reorderPoint ?? 0))
  const submit = (event: FormEvent, record: LayoutRecord) => {
    event.preventDefault()
    const quantity = Number(count)
    if (!Number.isFinite(quantity) || quantity < 0) return
    onCount(record, quantity)
    setCounting(null)
    setCount('')
  }
  return <div className="mw-card">
    {low.length ? <div className="mw-banner risk">⚠ {low.length} {low.length === 1 ? 'item is' : 'items are'} at or below the reorder point: {low.map((record) => record.name).join(', ')}</div> : <div className="mw-banner good">✓ Every item is above its reorder point</div>}
    <div className="mw-table-scroll"><table className="mw-ledger mw-stock">
      <thead><tr><th>Item</th><th>Supplier · SKU</th><th>On hand</th><th className="num">Reorder at</th><th /></tr></thead>
      <tbody>
        {records.map((record) => {
          const quantity = record.quantity ?? money(record.value)
          const reorder = record.reorderPoint ?? 0
          const isLow = quantity <= reorder
          const fill = Math.min(100, Math.round((quantity / Math.max(reorder * 3, 1)) * 100))
          return <tr className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
            <td><strong>{record.name}</strong></td>
            <td className="muted">{record.secondary}</td>
            <td><div className="mw-level" data-low={isLow || undefined}><em><i style={{ width: `${fill}%` }} /></em><span>{quantity} units</span></div></td>
            <td className="num">{reorder}</td>
            <td className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
              {counting === record.id ? <form className="mw-inline-form" onSubmit={(event) => submit(event, record)}><input aria-label={`Counted units of ${record.name}`} autoFocus min={0} onChange={(event) => setCount(event.target.value)} placeholder="Counted" type="number" value={count} /><button className="mw-action" type="submit">Save</button></form> : <button disabled={busy} onClick={() => { setCounting(record.id); setCount('') }} type="button">Count</button>}
              {isLow ? <button className="mw-action" disabled={busy} onClick={() => onNote(record, `Reorder requested: ${Math.max(reorder * 3 - quantity, reorder)} units`)} type="button">Reorder</button> : null}
            </td>
          </tr>
        })}
      </tbody>
    </table></div>
  </div>
}

function FeedView({ moduleId, records, statuses, selectedId, onSelect, onMove, busy }: WorkspaceViewProps) {
  const [showResolved, setShowResolved] = useState(false)
  const done = statuses.at(-1)
  const rank = { high: 0, medium: 1, low: 2 }
  const rows = [...records].filter((record) => showResolved || record.status !== done).sort((a, b) => rank[severity(a)] - rank[severity(b)])
  return <div className="mw-card">
    <div className="mw-feed-head"><span>{rows.length} {showResolved ? 'items' : 'need attention'}</span><label><input checked={showResolved} onChange={(event) => setShowResolved(event.target.checked)} type="checkbox" /> Show resolved</label></div>
    <div className="mw-feed">
      {rows.map((record) => {
        const step = nextStep(moduleId, record.status, statuses)
        const level = severity(record)
        return <article className={`mw-feed-item${selectedId === record.id ? ' selected' : ''}`} data-severity={level} key={record.id} onClick={() => onSelect(record.id)}>
          <span className="mw-severity">{level}</span>
          <div><strong>{record.name}</strong><p>{record.secondary} · {record.updated} · {record.status}</p></div>
          <div className="mw-row-actions" onClick={(event) => event.stopPropagation()}>
            {step ? <button className="mw-action" disabled={busy} onClick={() => onMove(record, step.to)} type="button">{step.label}</button> : null}
            {record.status !== done && done ? <button disabled={busy} onClick={() => onMove(record, done)} type="button">Dismiss</button> : null}
          </div>
        </article>
      })}
      {rows.length === 0 ? <p className="mw-empty">All clear. Nothing needs your attention.</p> : null}
    </div>
  </div>
}

function TillView({ records, catalogue, onSell, busy, statuses, selectedId, onSelect }: WorkspaceViewProps) {
  const [basket, setBasket] = useState<Record<string, number>>({})
  const [method, setMethod] = useState('Card')
  const [done, setDone] = useState('')
  const items = catalogue.filter((product) => money(product.value) > 0)
  const lines = items.filter((product) => basket[product.id]).map((product) => ({ product, qty: basket[product.id] }))
  const total = lines.reduce((sum, line) => sum + money(line.product.value) * line.qty, 0)
  const add = (id: string, delta: number) => setBasket((current) => {
    const qty = Math.max(0, (current[id] ?? 0) + delta)
    const next = { ...current, [id]: qty }
    if (!qty) delete next[id]
    return next
  })
  const charge = async () => {
    if (!lines.length) return
    const summary = lines.map((line) => `${line.qty > 1 ? `${line.qty} × ` : ''}${line.product.name}`).join(', ')
    await onSell({ summary, total, method })
    setBasket({})
    setDone(`${gbp(total)} taken by ${method.toLowerCase()}`)
  }
  const paid = records.filter((record) => ['Paid', 'Closed'].includes(record.status))
  return <div className="mw-till">
    <section className="mw-card mw-till-products">
      <header className="mw-card-head"><strong>Products</strong><small>Tap to add to the basket</small></header>
      <div className="mw-tiles">
        {items.map((product) => <button className="mw-tile" key={product.id} onClick={() => { add(product.id, 1); setDone('') }} type="button">
          {product.imageUrl ? <img alt="" className="mw-product-photo" src={product.imageUrl} /> : <i>{initials(product.name)}</i>}<strong>{product.name}</strong><span>{product.value}</span>{basket[product.id] ? <b>{basket[product.id]}</b> : null}
        </button>)}
        {items.length === 0 ? <p className="mw-empty">Add products with prices in Products to sell them here.</p> : null}
      </div>
    </section>
    <section className="mw-card mw-basket">
      <header className="mw-card-head"><strong>Basket</strong>{lines.length ? <button onClick={() => setBasket({})} type="button">Clear</button> : null}</header>
      {lines.length ? <ul>{lines.map((line) => <li key={line.product.id}>
        <span>{line.product.name}</span>
        <div className="mw-qty"><button aria-label={`Remove one ${line.product.name}`} onClick={() => add(line.product.id, -1)} type="button">−</button><b>{line.qty}</b><button aria-label={`Add one ${line.product.name}`} onClick={() => add(line.product.id, 1)} type="button">+</button></div>
        <strong>{gbp(money(line.product.value) * line.qty)}</strong>
      </li>)}</ul> : <p className="mw-empty">{done ? `✓ ${done}` : 'Basket is empty'}</p>}
      <div className="mw-basket-total"><span>Total</span><strong>{gbp(total)}</strong></div>
      <div className="mw-pay-methods" role="group">{['Card', 'Cash', 'Mobile money'].map((option) => <button aria-pressed={method === option} key={option} onClick={() => setMethod(option)} type="button">{option}</button>)}</div>
      <button className="mw-charge" disabled={busy || !lines.length} onClick={() => void charge()} type="button">Charge {gbp(total)}</button>
    </section>
    <section className="mw-card mw-till-sales">
      <header className="mw-card-head"><strong>Today’s sales</strong><small>{paid.length} paid · {gbp(paid.reduce((sum, record) => sum + money(record.value), 0))}</small></header>
      <ul>{records.map((record) => <li className={selectedId === record.id ? 'selected' : ''} key={record.id} onClick={() => onSelect(record.id)}>
        <div><strong>{record.name}</strong><span>{record.secondary}</span></div><b>{record.value}</b><span className="mw-chip" data-stage={statuses.indexOf(record.status)}>{record.status}</span>
      </li>)}</ul>
    </section>
  </div>
}

// ── FoundAI command bar ──────────────────────────────────────────────────────

type AiKind = 'advance' | 'remind' | 'reorder' | 'summary' | 'top' | 'first'
type AiAction = { label: string; kind: AiKind; note?: string }
export type AiPlan = { title: string; lines: string[]; targets: LayoutRecord[]; apply?: { label: string; kind: 'advance' | 'note'; note?: string } }

const aiActions: Record<string, AiAction[]> = {
  'point-of-sale': [{ label: 'Summarise today’s takings', kind: 'summary' }, { label: 'Close the till', kind: 'advance' }, { label: 'Show biggest sales', kind: 'top' }],
  orders: [{ label: 'Move orders to the next step', kind: 'advance' }, { label: 'Message customers with late orders', kind: 'remind', note: 'Delay update sent to customer on WhatsApp' }, { label: 'Summarise today’s orders', kind: 'summary' }],
  fulfilment: [{ label: 'Pick and pack the queue', kind: 'advance' }, { label: 'Find late shipments', kind: 'remind', note: 'Courier chased and customer updated' }, { label: 'Summarise fulfilment', kind: 'summary' }],
  returns: [{ label: 'Approve new returns', kind: 'first' }, { label: 'Refund received returns', kind: 'advance' }, { label: 'Summarise returns', kind: 'summary' }],
  service: [{ label: 'Assign unassigned tickets', kind: 'first' }, { label: 'Reply to overdue tickets', kind: 'remind', note: 'FoundAI drafted a reply for approval' }, { label: 'Summarise the queue', kind: 'summary' }],
  inventory: [{ label: 'Reorder everything running low', kind: 'reorder', note: 'Purchase order drafted by FoundAI' }, { label: 'Summarise stock health', kind: 'summary' }, { label: 'Show highest stock', kind: 'top' }],
  invoices: [{ label: 'Chase overdue invoices on WhatsApp', kind: 'remind', note: 'Payment reminder sent on WhatsApp' }, { label: 'Send all draft invoices', kind: 'first' }, { label: 'Summarise money owed', kind: 'summary' }],
  bills: [{ label: 'Approve bills received', kind: 'first' }, { label: 'Show bills due soon', kind: 'remind', note: 'Payment scheduled before due date' }, { label: 'Summarise what we owe', kind: 'summary' }],
  expenses: [{ label: 'Review submitted expenses', kind: 'first' }, { label: 'Show largest claims', kind: 'top' }, { label: 'Summarise spend', kind: 'summary' }],
  reconciliation: [{ label: 'Suggest matches for unmatched lines', kind: 'first' }, { label: 'Accept suggested matches', kind: 'advance' }, { label: 'Summarise reconciliation', kind: 'summary' }],
  purchasing: [{ label: 'Approve draft purchase orders', kind: 'first' }, { label: 'Chase late deliveries from suppliers', kind: 'remind', note: 'Supplier chased for delivery date' }, { label: 'Summarise spend with suppliers', kind: 'summary' }],
  candidates: [{ label: 'Screen new applicants', kind: 'first' }, { label: 'Show strongest candidates', kind: 'top' }, { label: 'Summarise hiring', kind: 'summary' }],
  'time-off': [{ label: 'Review new requests', kind: 'first' }, { label: 'Summarise who is off', kind: 'summary' }],
  payroll: [{ label: 'Prepare the next pay run', kind: 'advance' }, { label: 'Summarise payroll', kind: 'summary' }],
  'sales-pipeline': [{ label: 'Follow up stalled deals', kind: 'remind', note: 'Follow-up message drafted by FoundAI' }, { label: 'Show biggest deals', kind: 'top' }, { label: 'Forecast this month', kind: 'summary' }],
  crm: [{ label: 'Find customers to re-engage', kind: 'first' }, { label: 'Show most valuable customers', kind: 'top' }, { label: 'Summarise customers', kind: 'summary' }],
  campaigns: [{ label: 'Schedule draft campaigns', kind: 'first' }, { label: 'Show best performing', kind: 'top' }, { label: 'Summarise campaigns', kind: 'summary' }],
  signals: [{ label: 'Triage new signals', kind: 'first' }, { label: 'Summarise what changed', kind: 'summary' }],
  risks: [{ label: 'Start mitigating open risks', kind: 'first' }, { label: 'Summarise risk exposure', kind: 'summary' }],
  anomalies: [{ label: 'Investigate new anomalies', kind: 'first' }, { label: 'Summarise anomalies', kind: 'summary' }],
  recommendations: [{ label: 'Approve recommendations under review', kind: 'advance' }, { label: 'Show highest value', kind: 'top' }, { label: 'Summarise recommendations', kind: 'summary' }],
}
const fallbackActions: AiAction[] = [{ label: 'Move work to the next step', kind: 'advance' }, { label: 'Find overdue items', kind: 'remind', note: 'Follow-up sent by FoundAI' }, { label: 'Summarise this module', kind: 'summary' }]
export const moduleAiActions = (moduleId: string) => aiActions[moduleId] ?? fallbackActions

const describe = (record: LayoutRecord) => `${record.name} — ${record.secondary} · ${record.value}`

export function planAiAction(action: AiAction, records: LayoutRecord[], statuses: string[], noun: string, moduleLabel: string, kpis: ModuleKpi[]): AiPlan {
  const done = statuses.at(-1)
  if (action.kind === 'summary') {
    const lines = kpis.length ? kpis.map((kpi) => `${kpi.label}: ${kpi.value}`) : [`${records.length} ${noun}s in ${moduleLabel}`]
    const stages = statuses.map((status) => `${records.filter((record) => record.status === status).length} ${status.toLowerCase()}`).join(' · ')
    return { title: `${moduleLabel} at a glance`, lines: [...lines, ...(statuses.length ? [stages] : [])], targets: [] }
  }
  if (action.kind === 'top') {
    const targets = [...records].sort((a, b) => money(b.value) - money(a.value)).slice(0, 3)
    return { title: `Top ${targets.length} ${noun}s by value`, lines: targets.map(describe), targets }
  }
  if (action.kind === 'reorder') {
    const targets = records.filter((record) => (record.quantity ?? Infinity) <= (record.reorderPoint ?? -1))
    return { title: targets.length ? `${targets.length} ${targets.length === 1 ? 'item needs' : 'items need'} reordering` : 'Nothing needs reordering', lines: targets.map((record) => `${record.name}: ${record.quantity} on hand, reorder at ${record.reorderPoint}`), targets, apply: targets.length ? { label: `Draft ${targets.length} purchase ${targets.length === 1 ? 'order' : 'orders'}`, kind: 'note', note: action.note } : undefined }
  }
  if (action.kind === 'remind') {
    let targets = records.filter((record) => isOverdue(record, statuses))
    if (!targets.length) targets = records.filter((record) => record.status !== done && (daysUntil(record.dueDate) ?? 99) <= 3)
    return { title: targets.length ? `${targets.length} ${noun}${targets.length === 1 ? '' : 's'} need chasing` : `Nothing overdue in ${moduleLabel}`, lines: targets.map((record) => `${describe(record)} · ${dueLabel(record.dueDate)}`), targets, apply: targets.length ? { label: `Send ${targets.length} follow-up${targets.length === 1 ? '' : 's'}`, kind: 'note', note: action.note } : undefined }
  }
  const targets = action.kind === 'first' ? records.filter((record) => record.status === statuses[0]) : records.filter((record) => record.status !== done && statuses.includes(record.status))
  return { title: targets.length ? `${targets.length} ${noun}${targets.length === 1 ? '' : 's'} ready to move on` : `Nothing waiting in ${moduleLabel}`, lines: targets.map((record) => `${record.name}: ${record.status} → ${statuses[statuses.indexOf(record.status) + 1] ?? record.status}`), targets, apply: targets.length ? { label: `Move ${targets.length} ${noun}${targets.length === 1 ? '' : 's'} on`, kind: 'advance' } : undefined }
}

const intentFor = (text: string, actions: AiAction[]): AiAction => {
  const query = text.toLowerCase()
  const byKind = (kind: AiKind) => actions.find((action) => action.kind === kind)
  if (/overdue|late|chase|remind|unpaid|follow/.test(query)) return byKind('remind') ?? { label: text, kind: 'remind', note: 'Follow-up sent by FoundAI' }
  if (/stock|reorder|run out|low/.test(query)) return byKind('reorder') ?? { label: text, kind: 'reorder', note: 'Purchase order drafted by FoundAI' }
  if (/biggest|top|largest|best|most/.test(query)) return byKind('top') ?? { label: text, kind: 'top' }
  if (/new|approve|assign|screen|review|triage|send/.test(query)) return byKind('first') ?? byKind('advance') ?? { label: text, kind: 'first' }
  if (/move|advance|process|next|clear|close|pay/.test(query)) return byKind('advance') ?? { label: text, kind: 'advance' }
  return byKind('summary') ?? { label: text, kind: 'summary' }
}

export type LiveAnswer = { answer: string; suggestedActions: string[]; citations: Array<{ reference: string; name: string }>; model: string }

export function ModuleAiBar({ moduleId, moduleLabel, noun, records, statuses, kpis, onApply, askLive }: { moduleId: string; moduleLabel: string; noun: string; records: LayoutRecord[]; statuses: string[]; kpis: ModuleKpi[]; onApply: (plan: AiPlan) => Promise<void>; askLive?: (question: string) => Promise<LiveAnswer> }) {
  const actions = useMemo(() => moduleAiActions(moduleId), [moduleId])
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<AiPlan | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState('')
  const [live, setLive] = useState<LiveAnswer | null>(null)
  const [thinking, setThinking] = useState(false)
  const [liveError, setLiveError] = useState('')
  const run = (action: AiAction) => {
    setApplied('')
    setLive(null)
    setLiveError('')
    setPlan(planAiAction(action, records, statuses, noun, moduleLabel, kpis))
  }
  const ask = async (event: FormEvent) => {
    event.preventDefault()
    const question = prompt.trim()
    if (!question) return
    setPrompt('')
    if (!askLive) {
      run(intentFor(question, actions))
      return
    }
    setPlan(null)
    setApplied('')
    setLive(null)
    setLiveError('')
    setThinking(true)
    try {
      setLive(await askLive(question))
    } catch (cause) {
      setLiveError(cause instanceof Error ? cause.message : 'FoundAI could not answer right now.')
      setPlan(planAiAction(intentFor(question, actions), records, statuses, noun, moduleLabel, kpis))
    } finally {
      setThinking(false)
    }
  }
  const approve = async () => {
    if (!plan?.apply) return
    setApplying(true)
    try {
      await onApply(plan)
      setApplied(`✓ Done: ${plan.apply.label.toLowerCase()}. Every change is recorded in each ${noun}'s activity log.`)
      setPlan(null)
    } finally {
      setApplying(false)
    }
  }
  return <section className="mw-ai">
    <form className="mw-ai-input" onSubmit={(event) => void ask(event)}>
      <span className="mw-ai-badge">FoundAI</span>
      <input aria-label={`Ask FoundAI about ${moduleLabel}`} onChange={(event) => setPrompt(event.target.value)} placeholder={`Ask or tell FoundAI to do something in ${moduleLabel.toLowerCase()}…`} value={prompt} />
      <button disabled={thinking} type="submit">{thinking ? 'Thinking…' : 'Ask'}</button>
    </form>
    <div className="mw-ai-chips">{actions.map((action) => <button key={action.label} onClick={() => run(action)} type="button">{action.label}</button>)}</div>
    {plan ? <div className="mw-ai-plan">
      <header><strong>{plan.title}</strong><button aria-label="Dismiss" onClick={() => setPlan(null)} type="button">×</button></header>
      {plan.lines.length ? <ul>{plan.lines.slice(0, 6).map((line) => <li key={line}>{line}</li>)}</ul> : null}
      {plan.apply ? <footer><small>Nothing changes until you approve.</small><button className="mw-action" disabled={applying} onClick={() => void approve()} type="button">{applying ? 'Working…' : `Approve: ${plan.apply.label}`}</button></footer> : null}
    </div> : null}
    {live ? <div className="mw-ai-plan">
      <header><strong>FoundAI</strong><button aria-label="Dismiss" onClick={() => setLive(null)} type="button">×</button></header>
      <p className="mw-ai-answer">{live.answer}</p>
      {live.suggestedActions.length ? <><small className="mw-ai-label">Suggested next steps</small><ul>{live.suggestedActions.map((action) => <li key={action}>{action}</li>)}</ul></> : null}
      {live.citations.length ? <p className="mw-ai-sources">Based on: {live.citations.map((citation) => citation.name || citation.reference).join(', ')}</p> : null}
    </div> : null}
    {liveError ? <p className="mw-ai-error">Live FoundAI is unavailable ({liveError}). Showing a quick answer from this module instead.</p> : null}
    {applied ? <p className="mw-ai-applied">{applied}</p> : null}
    {!askLive ? <p className="mw-ai-note">Demo mode: answers come from this module’s sample data. When you’re signed in, typed questions are answered by FoundAI from your real business records.</p> : null}
  </section>
}
