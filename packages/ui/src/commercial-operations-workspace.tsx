'use client'

import { useMemo, useState } from 'react'
import { ActivityToast, CEOBriefing, WorkspaceHeader, usePersistentRecords } from './retail-operations-workspace'

type DeliveryStatus = 'Unassigned' | 'Assigned' | 'Out for delivery' | 'Delivered' | 'Exception'
type InvoiceStatus = 'Draft' | 'Sent' | 'Overdue' | 'Paid'
type Activity = { id: string; label: string; detail: string; time: string }

type Delivery = {
  id: string
  order: string
  customer: string
  destination: string
  driver: string
  vehicle: string
  window: string
  status: DeliveryStatus
}

type Invoice = {
  id: string
  customer: string
  order: string
  amount: number
  issued: string
  due: string
  status: InvoiceStatus
  method: string
}

const deliveryFlow: DeliveryStatus[] = ['Unassigned', 'Assigned', 'Out for delivery', 'Delivered']
const seedDeliveries: Delivery[] = [
  { id: 'SHP-883', order: 'ORD-1054', customer: 'Amina Yusuf', destination: 'Manchester M14', driver: 'Unassigned', vehicle: '—', window: 'Today, 16:00–18:00', status: 'Unassigned' },
  { id: 'SHP-882', order: 'ORD-1053', customer: 'Harbour Cafe', destination: 'Leeds LS1', driver: 'Jordan', vehicle: 'VAN-04', window: 'Today, 15:00–17:00', status: 'Out for delivery' },
  { id: 'SHP-881', order: 'ORD-1052', customer: 'Daniel Okoro', destination: 'Bristol BS5', driver: 'Samira', vehicle: 'BIKE-12', window: 'Today, 14:00–16:00', status: 'Exception' },
  { id: 'SHP-880', order: 'ORD-1051', customer: 'North & Co', destination: 'Manchester M1', driver: 'Jordan', vehicle: 'VAN-04', window: 'Today, 12:00–14:00', status: 'Delivered' },
]

const seedInvoices: Invoice[] = [
  { id: 'INV-1054', customer: 'Amina Yusuf', order: 'ORD-1054', amount: 184.5, issued: '17 Sep', due: '24 Sep', status: 'Draft', method: 'Payment link' },
  { id: 'INV-1053', customer: 'Harbour Cafe', order: 'ORD-1053', amount: 426, issued: '12 Sep', due: '19 Sep', status: 'Sent', method: 'Bank transfer' },
  { id: 'INV-1048', customer: 'North & Co', order: 'ORD-1048', amount: 912.4, issued: '2 Sep', due: '16 Sep', status: 'Overdue', method: 'Bank transfer' },
  { id: 'INV-1047', customer: 'Sofia Martins', order: 'ORD-1047', amount: 42, issued: '10 Sep', due: '17 Sep', status: 'Paid', method: 'Card' },
]

const clock = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())
const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)

function LogisticsWorkspace() {
  const [deliveries, setDeliveries] = usePersistentRecords('foundingos-demo-logistics-v1', seedDeliveries)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | DeliveryStatus>('All')
  const [selectedId, setSelectedId] = useState(seedDeliveries[0].id)
  const [activity, setActivity] = useState<Activity | null>(null)
  const visible = useMemo(() => deliveries.filter((delivery) => (status === 'All' || delivery.status === status) && `${delivery.id} ${delivery.order} ${delivery.customer} ${delivery.destination} ${delivery.driver}`.toLowerCase().includes(query.toLowerCase())), [deliveries, query, status])
  const selected = deliveries.find((delivery) => delivery.id === selectedId) ?? visible[0]
  const exceptions = deliveries.filter((delivery) => delivery.status === 'Exception').length
  const unassigned = deliveries.filter((delivery) => delivery.status === 'Unassigned').length
  const active = deliveries.filter((delivery) => !['Delivered', 'Exception'].includes(delivery.status)).length
  const publish = (label: string, detail: string) => setActivity({ id: crypto.randomUUID(), label, detail, time: clock() })

  const update = (delivery: Delivery, next: DeliveryStatus, patch: Partial<Delivery> = {}) => {
    setDeliveries((current) => current.map((item) => item.id === delivery.id ? { ...item, ...patch, status: next } : item))
    publish(`${delivery.id} moved to ${next}`, next === 'Delivered' ? 'Finance has been notified that invoicing can continue' : `${delivery.customer} can receive a WhatsApp update`)
  }

  return <section className="retail-ops-workspace">
    <WorkspaceHeader title="Logistics" description="Assign, dispatch, and recover every delivery without losing sight of the customer promise." onCreate={() => {
      const next: Delivery = { id: `SHP-${884 + deliveries.length}`, order: `ORD-${1055 + deliveries.length}`, customer: 'New customer', destination: 'Address needed', driver: 'Unassigned', vehicle: '—', window: 'Schedule needed', status: 'Unassigned' }
      setDeliveries((current) => [next, ...current]); setSelectedId(next.id); publish('Delivery created', `${next.id} is ready for assignment`)
    }} />
    <ActivityToast activity={activity} />
    <CEOBriefing headline={exceptions ? `${exceptions} delivery exception needs intervention` : unassigned ? `${unassigned} delivery needs an owner` : 'Deliveries are moving to plan'}
      summary={`There are ${active} active deliveries. The priority is to recover exceptions first, then assign anything unowned before its promised delivery window is at risk.`}
      standing={[
        { label: 'Active deliveries', value: String(active), meaning: 'Work currently moving through assignment and dispatch.', tone: 'good' },
        { label: 'Exceptions', value: String(exceptions), meaning: 'Deliveries blocked by an issue that requires a decision.', tone: exceptions ? 'risk' : 'good' },
        { label: 'Unassigned', value: String(unassigned), meaning: 'Customer promises that do not yet have a driver.', tone: unassigned ? 'watch' : 'good' },
        { label: 'Delivered', value: String(deliveries.filter((item) => item.status === 'Delivered').length), meaning: 'Completed handoffs ready for Finance.', tone: 'good' },
      ]}
      risks={[`${exceptions} customer delivery is blocked.`, `${unassigned} shipment has no driver or vehicle.`, 'Late delivery updates can delay invoicing and damage trust.']}
      actions={['Resolve delivery exceptions before assigning new work.', 'Assign every unowned shipment to a driver and vehicle.', 'Confirm delivery in the system so Finance can collect cash.']} />
    <div className="retail-stat-grid">
      <article><span>Active</span><strong>{active}</strong><small>Moving today</small></article><article><span>Exceptions</span><strong>{exceptions}</strong><small>Needs intervention</small></article><article><span>Unassigned</span><strong>{unassigned}</strong><small>Needs an owner</small></article><article><span>Completion</span><strong>{Math.round(deliveries.filter((item) => item.status === 'Delivered').length / deliveries.length * 100)}%</strong><small>Visible delivery set</small></article>
    </div>
    <div className="retail-toolbar"><label><span>Search deliveries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Shipment, order, customer, driver…" /></label><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | DeliveryStatus)}><option>All</option><option>Unassigned</option><option>Assigned</option><option>Out for delivery</option><option>Delivered</option><option>Exception</option></select></label><button type="button" onClick={() => setDeliveries(seedDeliveries)}>Reset demo data</button></div>
    <div className="retail-record-layout">
      <div className="retail-table-panel"><div className="retail-table-heading"><div><strong>Delivery control</strong><span>{visible.length} matching shipments</span></div><span>Live demo queue</span></div><div className="retail-table-scroll"><table className="retail-data-table"><thead><tr><th>Shipment</th><th>Order</th><th>Customer</th><th>Destination</th><th>Driver</th><th>Window</th><th>Status</th></tr></thead><tbody>{visible.map((delivery) => <tr key={delivery.id} className={selected?.id === delivery.id ? 'is-selected' : undefined} onClick={() => setSelectedId(delivery.id)}><td><strong>{delivery.id}</strong></td><td>{delivery.order}</td><td>{delivery.customer}</td><td>{delivery.destination}</td><td>{delivery.driver}</td><td>{delivery.window}</td><td><span className="retail-status" data-status={delivery.status}>{delivery.status}</span></td></tr>)}</tbody></table></div></div>
      {selected && <aside className="retail-detail-panel"><p>Selected delivery</p><h2>{selected.id}</h2><strong className="retail-detail-customer">{selected.customer}</strong><dl><div><dt>Order</dt><dd>{selected.order}</dd></div><div><dt>Driver</dt><dd>{selected.driver}</dd></div><div><dt>Vehicle</dt><dd>{selected.vehicle}</dd></div><div><dt>Window</dt><dd>{selected.window}</dd></div></dl>
        {selected.status === 'Unassigned' && <button className="retail-primary-action" type="button" onClick={() => update(selected, 'Assigned', { driver: 'Samira', vehicle: 'VAN-07' })}>Assign Samira · VAN-07</button>}
        {selected.status === 'Exception' && <button className="retail-primary-action" type="button" onClick={() => update(selected, 'Out for delivery')}>Resolve and resume</button>}
        {!['Unassigned', 'Exception', 'Delivered'].includes(selected.status) && <button className="retail-primary-action" type="button" onClick={() => update(selected, deliveryFlow[deliveryFlow.indexOf(selected.status) + 1])}>Move to {deliveryFlow[deliveryFlow.indexOf(selected.status) + 1]}</button>}
        <button type="button" onClick={() => publish('Customer update prepared', `WhatsApp status prepared for ${selected.customer}`)}>Send WhatsApp update</button>
      </aside>}
    </div>
  </section>
}

function FinanceWorkspace() {
  const [invoices, setInvoices] = usePersistentRecords('foundingos-demo-finance-v1', seedInvoices)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | InvoiceStatus>('All')
  const [selectedId, setSelectedId] = useState(seedInvoices[0].id)
  const [activity, setActivity] = useState<Activity | null>(null)
  const visible = useMemo(() => invoices.filter((invoice) => (status === 'All' || invoice.status === status) && `${invoice.id} ${invoice.customer} ${invoice.order} ${invoice.method}`.toLowerCase().includes(query.toLowerCase())), [invoices, query, status])
  const selected = invoices.find((invoice) => invoice.id === selectedId) ?? visible[0]
  const outstanding = invoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  const overdue = invoices.filter((invoice) => invoice.status === 'Overdue')
  const paid = invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  const publish = (label: string, detail: string) => setActivity({ id: crypto.randomUUID(), label, detail, time: clock() })

  const update = (invoice: Invoice, next: InvoiceStatus) => {
    setInvoices((current) => current.map((item) => item.id === invoice.id ? { ...item, status: next } : item))
    publish(`${invoice.id} marked ${next}`, next === 'Paid' ? `${money(invoice.amount)} added to reconciled receipts` : `Customer workflow updated for ${invoice.customer}`)
  }

  return <section className="retail-ops-workspace">
    <WorkspaceHeader title="Finance" description="See what has been billed, what is late, and what cash has actually arrived." onCreate={() => {
      const next: Invoice = { id: `INV-${1055 + invoices.length}`, customer: 'New customer', order: `ORD-${1055 + invoices.length}`, amount: 150, issued: 'Today', due: '7 days', status: 'Draft', method: 'Payment link' }
      setInvoices((current) => [next, ...current]); setSelectedId(next.id); publish('Invoice draft created', `${next.id} is ready for review`)
    }} />
    <ActivityToast activity={activity} />
    <CEOBriefing headline={overdue.length ? `${money(overdue.reduce((sum, invoice) => sum + invoice.amount, 0))} is overdue` : 'Collections are on track'}
      summary={`Customers still owe ${money(outstanding)} across the visible invoice book. Paid receipts total ${money(paid)}. Overdue invoices should be chased before new discretionary spending is approved.`}
      standing={[
        { label: 'Outstanding', value: money(outstanding), meaning: 'Billed or drafted value that has not yet become cash.', tone: outstanding > 1_000 ? 'watch' : 'good' },
        { label: 'Overdue', value: money(overdue.reduce((sum, invoice) => sum + invoice.amount, 0)), meaning: 'Money past its promised payment date.', tone: overdue.length ? 'risk' : 'good' },
        { label: 'Cash received', value: money(paid), meaning: 'Visible invoices already marked paid and reconciled.', tone: 'good' },
        { label: 'Collection rate', value: `${Math.round(invoices.filter((invoice) => invoice.status === 'Paid').length / invoices.length * 100)}%`, meaning: 'Share of invoices converted into received cash.', tone: 'watch' },
      ]}
      risks={[`${overdue.length} overdue invoice(s) require direct follow-up.`, `${invoices.filter((invoice) => invoice.status === 'Draft').length} draft invoice(s) have not been sent.`, `${money(outstanding)} is revenue on paper, not cash in the bank.`]}
      actions={['Send every approved draft invoice immediately.', 'Contact overdue customers with a payment link and clear deadline.', 'Reconcile paid receipts daily so cash decisions use accurate numbers.']} />
    <div className="retail-stat-grid"><article><span>Outstanding</span><strong>{money(outstanding)}</strong><small>Not yet collected</small></article><article><span>Overdue</span><strong>{money(overdue.reduce((sum, item) => sum + item.amount, 0))}</strong><small>Needs follow-up</small></article><article><span>Paid</span><strong>{money(paid)}</strong><small>Reconciled receipts</small></article><article><span>Invoices</span><strong>{invoices.length}</strong><small>Visible records</small></article></div>
    <div className="retail-toolbar"><label><span>Search invoices</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Invoice, order, customer, method…" /></label><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | InvoiceStatus)}><option>All</option><option>Draft</option><option>Sent</option><option>Overdue</option><option>Paid</option></select></label><button type="button" onClick={() => setInvoices(seedInvoices)}>Reset demo data</button></div>
    <div className="retail-record-layout">
      <div className="retail-table-panel"><div className="retail-table-heading"><div><strong>Receivables</strong><span>{visible.length} matching invoices</span></div><span>Browser-persisted demo data</span></div><div className="retail-table-scroll"><table className="retail-data-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Order</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th></tr></thead><tbody>{visible.map((invoice) => <tr key={invoice.id} className={selected?.id === invoice.id ? 'is-selected' : undefined} onClick={() => setSelectedId(invoice.id)}><td><strong>{invoice.id}</strong></td><td>{invoice.customer}</td><td>{invoice.order}</td><td>{money(invoice.amount)}</td><td>{invoice.issued}</td><td>{invoice.due}</td><td><span className="retail-status" data-status={invoice.status}>{invoice.status}</span></td></tr>)}</tbody></table></div></div>
      {selected && <aside className="retail-detail-panel"><p>Selected invoice</p><h2>{selected.id}</h2><strong className="retail-detail-customer">{selected.customer}</strong><dl><div><dt>Amount</dt><dd>{money(selected.amount)}</dd></div><div><dt>Order</dt><dd>{selected.order}</dd></div><div><dt>Due</dt><dd>{selected.due}</dd></div><div><dt>Method</dt><dd>{selected.method}</dd></div></dl><span className="retail-status" data-status={selected.status}>{selected.status}</span>
        {selected.status === 'Draft' && <button className="retail-primary-action" type="button" onClick={() => update(selected, 'Sent')}>Send invoice and payment link</button>}
        {selected.status !== 'Paid' && <button className="retail-primary-action" type="button" onClick={() => update(selected, 'Paid')}>Mark paid and reconcile</button>}
        <button type="button" onClick={() => publish('Payment reminder prepared', `WhatsApp reminder prepared for ${selected.customer}`)}>Send WhatsApp reminder</button>
      </aside>}
    </div>
  </section>
}

export function CommercialOperationsWorkspace({ moduleId }: { moduleId: string }) {
  return moduleId === 'logistics' ? <LogisticsWorkspace /> : <FinanceWorkspace />
}
