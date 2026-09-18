'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

export type RetailSection = 'overview' | 'orders' | 'inventory' | 'products' | 'customers' | 'suppliers' | 'reports' | 'automations' | 'team' | 'settings'

type OrderStatus = 'New' | 'Picking' | 'Ready' | 'Dispatched' | 'Delivered'
type Order = { id: string; customerId: string; customer: string; channel: string; total: number; items: number; status: OrderStatus; owner: string; due: string }
type Product = { id: string; sku: string; name: string; category: string; price: number; stock: number; reorderAt: number; status: 'Active' | 'Draft' }
type Customer = { id: string; name: string; email: string; phone: string; orders: number; spent: number; segment: string; lastOrder: string }
type Supplier = { id: string; name: string; contact: string; products: number; leadTime: string; status: 'Healthy' | 'Watch'; nextDelivery: string }
type Automation = { id: string; name: string; description: string; enabled: boolean; runs: number; lastRun: string }
type TeamMember = { id: string; name: string; email: string; role: string; status: 'Active' | 'Invited'; lastActive: string }
type RetailState = {
  orders: Order[]
  products: Product[]
  customers: Customer[]
  suppliers: Supplier[]
  automations: Automation[]
  team: TeamMember[]
  settings: { businessName: string; currency: string; timezone: string; lowStockAlerts: boolean; orderUpdates: boolean }
}

const sections: Array<{ id: RetailSection; label: string; icon: string; group: string }> = [
  { id: 'overview', label: 'Overview', icon: '⌂', group: 'Workspace' },
  { id: 'orders', label: 'Orders', icon: '▦', group: 'Commerce' },
  { id: 'inventory', label: 'Inventory', icon: '◫', group: 'Commerce' },
  { id: 'products', label: 'Products', icon: '◇', group: 'Commerce' },
  { id: 'customers', label: 'Customers', icon: '○', group: 'Relationships' },
  { id: 'suppliers', label: 'Suppliers', icon: '↗', group: 'Relationships' },
  { id: 'reports', label: 'Reports', icon: '⌁', group: 'Insights' },
  { id: 'automations', label: 'Automations', icon: '✦', group: 'Insights' },
  { id: 'team', label: 'Team', icon: '◎', group: 'Admin' },
  { id: 'settings', label: 'Settings', icon: '⚙', group: 'Admin' },
]

const seedState: RetailState = {
  orders: [
    { id: 'ORD-1054', customerId: 'CUS-201', customer: 'Amina Yusuf', channel: 'WhatsApp', total: 184.5, items: 3, status: 'New', owner: 'Maya', due: 'Today, 16:00' },
    { id: 'ORD-1053', customerId: 'CUS-202', customer: 'Harbour Cafe', channel: 'Web', total: 426, items: 8, status: 'Picking', owner: 'Noah', due: 'Today, 17:30' },
    { id: 'ORD-1052', customerId: 'CUS-203', customer: 'Daniel Okoro', channel: 'WhatsApp', total: 79.98, items: 2, status: 'Ready', owner: 'Maya', due: 'Today, 18:00' },
    { id: 'ORD-1051', customerId: 'CUS-204', customer: 'North & Co', channel: 'POS', total: 912.4, items: 12, status: 'Dispatched', owner: 'Ava', due: 'Tomorrow' },
    { id: 'ORD-1050', customerId: 'CUS-205', customer: 'Sofia Martins', channel: 'Web', total: 42, items: 1, status: 'Delivered', owner: 'Noah', due: 'Completed' },
  ],
  products: [
    { id: 'PRO-101', sku: 'TSH-BLU-M', name: 'Essential T-shirt / Blue / M', category: 'Apparel', price: 28, stock: 8, reorderAt: 12, status: 'Active' },
    { id: 'PRO-102', sku: 'TSH-WHT-L', name: 'Essential T-shirt / White / L', category: 'Apparel', price: 28, stock: 42, reorderAt: 15, status: 'Active' },
    { id: 'PRO-103', sku: 'TOT-NAT-01', name: 'Canvas tote / Natural', category: 'Accessories', price: 18, stock: 0, reorderAt: 10, status: 'Active' },
    { id: 'PRO-104', sku: 'HD-GRY-M', name: 'Core hoodie / Grey / M', category: 'Apparel', price: 64, stock: 31, reorderAt: 10, status: 'Active' },
    { id: 'PRO-105', sku: 'MUG-BLK-01', name: 'Studio mug / Black', category: 'Home', price: 16, stock: 16, reorderAt: 8, status: 'Active' },
  ],
  customers: [
    { id: 'CUS-201', name: 'Amina Yusuf', email: 'amina@example.com', phone: '+44 7700 900201', orders: 8, spent: 1284.5, segment: 'VIP', lastOrder: 'Today' },
    { id: 'CUS-202', name: 'Harbour Cafe', email: 'orders@harbour.cafe', phone: '+44 7700 900202', orders: 24, spent: 6842, segment: 'Wholesale', lastOrder: 'Today' },
    { id: 'CUS-203', name: 'Daniel Okoro', email: 'daniel@example.com', phone: '+44 7700 900203', orders: 3, spent: 219.94, segment: 'New', lastOrder: 'Today' },
    { id: 'CUS-204', name: 'North & Co', email: 'buying@northco.com', phone: '+44 7700 900204', orders: 41, spent: 18290, segment: 'Wholesale', lastOrder: 'Yesterday' },
    { id: 'CUS-205', name: 'Sofia Martins', email: 'sofia@example.com', phone: '+44 7700 900205', orders: 5, spent: 486, segment: 'Returning', lastOrder: '2 days ago' },
  ],
  suppliers: [
    { id: 'SUP-31', name: 'Northstar Textiles', contact: 'Jules Martin', products: 18, leadTime: '5 days', status: 'Healthy', nextDelivery: '23 Sep' },
    { id: 'SUP-30', name: 'Field Goods', contact: 'Ama Boateng', products: 7, leadTime: '8 days', status: 'Watch', nextDelivery: '26 Sep' },
    { id: 'SUP-29', name: 'Kiln Works', contact: 'Tom Ellis', products: 4, leadTime: '4 days', status: 'Healthy', nextDelivery: '21 Sep' },
  ],
  automations: [
    { id: 'AUT-1', name: 'Low-stock replenishment', description: 'Prepare a supplier order when available stock crosses its reorder point.', enabled: true, runs: 18, lastRun: '12m ago' },
    { id: 'AUT-2', name: 'WhatsApp order confirmation', description: 'Confirm new WhatsApp orders and share the expected fulfilment window.', enabled: true, runs: 142, lastRun: '24m ago' },
    { id: 'AUT-3', name: 'Dispatch customer update', description: 'Notify the customer when an order leaves the warehouse.', enabled: true, runs: 96, lastRun: '1h ago' },
    { id: 'AUT-4', name: 'Lapsed customer recovery', description: 'Create a Marketing task after 45 days without a repeat order.', enabled: false, runs: 0, lastRun: 'Never' },
  ],
  team: [
    { id: 'USR-1', name: 'Bobby Shaw', email: 'bobby@foundingos.com', role: 'Owner', status: 'Active', lastActive: 'Now' },
    { id: 'USR-2', name: 'Maya Chen', email: 'maya@example.com', role: 'Operations Manager', status: 'Active', lastActive: '8m ago' },
    { id: 'USR-3', name: 'Noah Williams', email: 'noah@example.com', role: 'Fulfilment', status: 'Active', lastActive: '24m ago' },
    { id: 'USR-4', name: 'Ava Patel', email: 'ava@example.com', role: 'Finance', status: 'Invited', lastActive: 'Invite sent' },
  ],
  settings: { businessName: 'FoundingOS Demo Store', currency: 'GBP', timezone: 'Europe/London', lowStockAlerts: true, orderUpdates: true },
}

const STORAGE_KEY = 'foundingos-retail-business-application-v1'
const orderFlow: OrderStatus[] = ['New', 'Picking', 'Ready', 'Dispatched', 'Delivered']
const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)

function useRetailState() {
  const [state, setState] = useState<RetailState>(seedState)
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) setState(JSON.parse(stored) as RetailState)
  }, [])
  const update = (mutate: (current: RetailState) => RetailState) => {
    setState((current) => {
      const next = mutate(current)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }
  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    setState(seedState)
  }
  return { state, update, reset }
}

function PageHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return <header className="retail-app-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div>{action}</header>
}

function MetricCard({ label, value, change, tone = 'good' }: { label: string; value: string; change: string; tone?: 'good' | 'watch' | 'risk' }) {
  return <article className="retail-app-metric" data-tone={tone}><span>{label}</span><strong>{value}</strong><small>{change}</small></article>
}

function OverviewPage({ state }: { state: RetailState }) {
  const revenue = state.orders.reduce((sum, order) => sum + order.total, 0)
  const attention = state.orders.filter((order) => ['New', 'Ready'].includes(order.status))
  const lowStock = state.products.filter((product) => product.stock <= product.reorderAt)
  return <>
    <PageHeading eyebrow="Retail command centre" title="Good morning, Bobby" copy="Here is what needs attention across sales, fulfilment, stock, and customers." />
    <section className="retail-app-metrics">
      <MetricCard label="Revenue represented" value={money(revenue)} change="+12.4% this week" />
      <MetricCard label="Open orders" value={String(state.orders.filter((order) => order.status !== 'Delivered').length)} change={`${attention.length} need action`} tone="watch" />
      <MetricCard label="Stock alerts" value={String(lowStock.length)} change="Across 2 locations" tone={lowStock.length ? 'risk' : 'good'} />
      <MetricCard label="Active customers" value={String(state.customers.length)} change="+8 this month" />
    </section>
    <section className="retail-app-dashboard-grid">
      <article className="retail-app-panel retail-app-chart-panel">
        <div className="retail-app-panel-heading"><div><p>Sales performance</p><h2>Revenue trend</h2></div><span>Last 7 days</span></div>
        <svg viewBox="0 0 620 220" role="img" aria-label="Seven-day revenue trend">
          <defs><linearGradient id="retailRevenue" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#24c47a" stopOpacity=".35" /><stop offset="1" stopColor="#24c47a" stopOpacity="0" /></linearGradient></defs>
          {[35, 80, 125, 170].map((y) => <line key={y} stroke="#23364d" x1="30" x2="600" y1={y} y2={y} />)}
          <path d="M30 175 L120 150 L210 159 L300 112 L390 126 L480 73 L600 39 L600 205 L30 205 Z" fill="url(#retailRevenue)" />
          <polyline fill="none" points="30,175 120,150 210,159 300,112 390,126 480,73 600,39" stroke="#24c47a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        </svg>
        <div className="retail-app-chart-labels"><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Today</span></div>
      </article>
      <article className="retail-app-panel">
        <div className="retail-app-panel-heading"><div><p>Priority queue</p><h2>Needs attention</h2></div><Link href="/test-workspaces/retail/orders">View orders</Link></div>
        <div className="retail-app-priorities">
          {attention.map((order) => <Link href="/test-workspaces/retail/orders" key={order.id}><i data-tone={order.status === 'New' ? 'risk' : 'watch'} /><div><strong>{order.id} · {order.customer}</strong><span>{order.status === 'New' ? 'Start picking' : 'Ready to dispatch'} · {money(order.total)}</span></div><b>→</b></Link>)}
          {lowStock.slice(0, 2).map((product) => <Link href="/test-workspaces/retail/inventory" key={product.id}><i data-tone="risk" /><div><strong>{product.name}</strong><span>{product.stock} available · reorder at {product.reorderAt}</span></div><b>→</b></Link>)}
        </div>
      </article>
    </section>
    <section className="retail-app-dashboard-grid lower">
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Orders</p><h2>Fulfilment pipeline</h2></div></div>
        <div className="retail-app-pipeline">{orderFlow.map((status) => <div key={status}><strong>{state.orders.filter((order) => order.status === status).length}</strong><span>{status}</span></div>)}</div>
      </article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Activity</p><h2>Latest events</h2></div></div>
        <ul className="retail-app-activity"><li><i />WhatsApp order ORD-1054 received <span>10m</span></li><li><i />Payment matched to ORD-1050 <span>24m</span></li><li><i />Low-stock alert created <span>42m</span></li><li><i />Delivery confirmation received <span>1h</span></li></ul>
      </article>
    </section>
  </>
}

function OrdersPage({ state, update }: { state: RetailState; update: (mutate: (current: RetailState) => RetailState) => void }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | OrderStatus>('All')
  const [selectedId, setSelectedId] = useState(state.orders[0]?.id)
  const [creating, setCreating] = useState(false)
  const selected = state.orders.find((order) => order.id === selectedId) ?? state.orders[0]
  const visible = state.orders.filter((order) => (status === 'All' || order.status === status) && `${order.id} ${order.customer} ${order.channel}`.toLowerCase().includes(query.toLowerCase()))
  const advance = () => {
    if (!selected) return
    const next = orderFlow[orderFlow.indexOf(selected.status) + 1]
    if (!next) return
    update((current) => ({ ...current, orders: current.orders.map((order) => order.id === selected.id ? { ...order, status: next } : order) }))
  }
  const createOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const customer = String(form.get('customer'))
    const order: Order = { id: `ORD-${1060 + state.orders.length}`, customerId: 'CUS-NEW', customer, channel: String(form.get('channel')), total: Number(form.get('total')), items: Number(form.get('items')), status: 'New', owner: String(form.get('owner')), due: 'Today' }
    update((current) => ({ ...current, orders: [order, ...current.orders] }))
    setSelectedId(order.id)
    setCreating(false)
  }
  return <>
    <PageHeading eyebrow="Commerce" title="Orders" copy="Capture, fulfil, and track orders from WhatsApp, web, and point of sale." action={<button className="retail-app-primary" onClick={() => setCreating(true)} type="button">+ New order</button>} />
    <section className="retail-app-metrics compact"><MetricCard label="Open" value={String(state.orders.filter((order) => order.status !== 'Delivered').length)} change="Across all channels" /><MetricCard label="Ready" value={String(state.orders.filter((order) => order.status === 'Ready').length)} change="Awaiting dispatch" tone="watch" /><MetricCard label="Order value" value={money(state.orders.reduce((sum, order) => sum + order.total, 0))} change="Visible records" /></section>
    <div className="retail-app-toolbar"><input aria-label="Search orders" onChange={(event) => setQuery(event.target.value)} placeholder="Search orders or customers" value={query} /><select aria-label="Order status" onChange={(event) => setStatus(event.target.value as 'All' | OrderStatus)} value={status}><option>All</option>{orderFlow.map((item) => <option key={item}>{item}</option>)}</select><button type="button">Export</button></div>
    <section className="retail-app-record-layout">
      <div className="retail-app-table-card"><div className="retail-app-panel-heading"><div><p>Order queue</p><h2>{visible.length} orders</h2></div></div><div className="retail-app-table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Channel</th><th>Total</th><th>Status</th><th>Owner</th><th>Due</th></tr></thead><tbody>{visible.map((order) => <tr className={selected?.id === order.id ? 'selected' : ''} key={order.id} onClick={() => setSelectedId(order.id)}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.channel}</td><td>{money(order.total)}</td><td><span className={`retail-app-status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}>{order.status}</span></td><td>{order.owner}</td><td>{order.due}</td></tr>)}</tbody></table></div></div>
      {selected ? <aside className="retail-app-detail"><p>Selected order</p><h2>{selected.id}</h2><strong>{selected.customer}</strong><dl><div><dt>Value</dt><dd>{money(selected.total)}</dd></div><div><dt>Items</dt><dd>{selected.items}</dd></div><div><dt>Channel</dt><dd>{selected.channel}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Due</dt><dd>{selected.due}</dd></div></dl><div className="retail-app-stage">{orderFlow.map((item) => <span className={item === selected.status ? 'active' : ''} key={item}>{item}</span>)}</div>{selected.status !== 'Delivered' ? <button className="retail-app-primary" onClick={advance} type="button">Move to {orderFlow[orderFlow.indexOf(selected.status) + 1]}</button> : null}<button className="retail-app-secondary" type="button">Send WhatsApp update</button></aside> : null}
    </section>
    {creating ? <div className="retail-app-modal-backdrop"><form className="retail-app-modal" onSubmit={createOrder}><div><p>New order</p><h2>Create an order</h2></div><label>Customer<input name="customer" required /></label><div className="retail-app-form-grid"><label>Channel<select name="channel"><option>WhatsApp</option><option>Web</option><option>POS</option></select></label><label>Owner<select name="owner"><option>Maya</option><option>Noah</option><option>Ava</option></select></label><label>Items<input min="1" name="items" required type="number" /></label><label>Total (£)<input min="1" name="total" required step=".01" type="number" /></label></div><footer><button className="retail-app-secondary" onClick={() => setCreating(false)} type="button">Cancel</button><button className="retail-app-primary" type="submit">Create order</button></footer></form></div> : null}
  </>
}

function InventoryPage({ state, update }: { state: RetailState; update: (mutate: (current: RetailState) => RetailState) => void }) {
  const [selectedId, setSelectedId] = useState(state.products[0]?.id)
  const [query, setQuery] = useState('')
  const selected = state.products.find((product) => product.id === selectedId) ?? state.products[0]
  const visible = state.products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase()))
  const adjust = (amount: number) => selected && update((current) => ({ ...current, products: current.products.map((product) => product.id === selected.id ? { ...product, stock: Math.max(0, product.stock + amount) } : product) }))
  return <>
    <PageHeading eyebrow="Commerce" title="Inventory" copy="Control available stock, reorder points, and product availability across locations." action={<button className="retail-app-primary" type="button">+ Stock transfer</button>} />
    <section className="retail-app-metrics compact"><MetricCard label="Units available" value={String(state.products.reduce((sum, item) => sum + item.stock, 0))} change="Across visible products" /><MetricCard label="Low stock" value={String(state.products.filter((item) => item.stock > 0 && item.stock <= item.reorderAt).length)} change="Replenishment needed" tone="watch" /><MetricCard label="Out of stock" value={String(state.products.filter((item) => item.stock === 0).length)} change="Revenue at risk" tone="risk" /></section>
    <div className="retail-app-toolbar"><input aria-label="Search inventory" onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU" value={query} /><button type="button">All locations</button><button type="button">Export</button></div>
    <section className="retail-app-record-layout"><div className="retail-app-table-card"><div className="retail-app-panel-heading"><div><p>Stock ledger</p><h2>{visible.length} products</h2></div></div><div className="retail-app-table-scroll"><table><thead><tr><th>Product</th><th>SKU</th><th>Available</th><th>Reorder at</th><th>Status</th><th>Value</th></tr></thead><tbody>{visible.map((product) => { const status = product.stock === 0 ? 'Out of stock' : product.stock <= product.reorderAt ? 'Low stock' : 'Healthy'; return <tr className={selected?.id === product.id ? 'selected' : ''} key={product.id} onClick={() => setSelectedId(product.id)}><td><strong>{product.name}</strong></td><td>{product.sku}</td><td>{product.stock}</td><td>{product.reorderAt}</td><td><span className={`retail-app-status status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span></td><td>{money(product.stock * product.price)}</td></tr> })}</tbody></table></div></div>
      {selected ? <aside className="retail-app-detail"><p>Inventory record</p><h2>{selected.sku}</h2><strong>{selected.name}</strong><div className="retail-app-stock-number">{selected.stock}<span>units available</span></div><dl><div><dt>Unit price</dt><dd>{money(selected.price)}</dd></div><div><dt>Reorder point</dt><dd>{selected.reorderAt}</dd></div><div><dt>Category</dt><dd>{selected.category}</dd></div></dl><div className="retail-app-adjust"><button onClick={() => adjust(-1)} type="button">−</button><button onClick={() => adjust(1)} type="button">+</button><button onClick={() => adjust(20)} type="button">Receive 20</button></div><button className="retail-app-primary" type="button">Create purchase order</button></aside> : null}
    </section>
  </>
}

function DirectoryPage<T extends { id: string }>({ title, eyebrow, copy, columns, rows, render, onCreate }: { title: string; eyebrow: string; copy: string; columns: string[]; rows: T[]; render: (row: T) => React.ReactNode; onCreate: () => void }) {
  const [query, setQuery] = useState('')
  const visible = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()))
  const exportRows = () => {
    const blob = new Blob([JSON.stringify(visible, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `foundingos-${title.toLowerCase()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return <><PageHeading eyebrow={eyebrow} title={title} copy={copy} action={<button className="retail-app-primary" onClick={onCreate} type="button">+ Add {title.slice(0, -1).toLowerCase()}</button>} /><div className="retail-app-toolbar"><input aria-label={`Search ${title.toLowerCase()}`} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} value={query} /><span className="retail-app-record-count">{visible.length} matching</span><button onClick={exportRows} type="button">Export JSON</button></div><div className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>Directory</p><h2>{visible.length} records</h2></div></div><div className="retail-app-table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{visible.map((row) => <tr key={row.id}>{render(row)}</tr>)}</tbody></table></div></div></>
}

function ReportsPage({ state }: { state: RetailState }) {
  return <><PageHeading eyebrow="Insights" title="Reports" copy="Monitor revenue, order performance, customer value, and stock efficiency." action={<button className="retail-app-primary" type="button">Export report</button>} /><section className="retail-app-metrics"><MetricCard label="Net sales" value="£18,642" change="+12.4% vs prior period" /><MetricCard label="Average order" value={money(state.orders.reduce((sum, order) => sum + order.total, 0) / state.orders.length)} change="+£8.20 this month" /><MetricCard label="Repeat rate" value="38.4%" change="+4.1 points" /><MetricCard label="Sell-through" value="72%" change="+6.3 points" /></section><section className="retail-app-dashboard-grid"><article className="retail-app-panel retail-app-chart-panel"><div className="retail-app-panel-heading"><div><p>Revenue</p><h2>Sales by channel</h2></div><span>Last 30 days</span></div><div className="retail-app-bars">{[['WhatsApp',78],['Web',64],['POS',51],['Wholesale',38]].map(([label, width]) => <div key={label}><span>{label}</span><i><b style={{ width: `${width}%` }} /></i><strong>{width}%</strong></div>)}</div></article><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Top products</p><h2>By revenue</h2></div></div><ol className="retail-app-ranking">{state.products.slice(0, 5).map((product, index) => <li key={product.id}><b>{index + 1}</b><div><strong>{product.name}</strong><span>{product.stock} units available</span></div><em>{money(product.price * (18 - index * 2))}</em></li>)}</ol></article></section></>
}

function AutomationsPage({ state, update }: { state: RetailState; update: (mutate: (current: RetailState) => RetailState) => void }) {
  return <><PageHeading eyebrow="Workflow engine" title="Automations" copy="Remove repetitive admin with controlled triggers, approvals, and customer updates." action={<button className="retail-app-primary" type="button">+ New automation</button>} /><div className="retail-app-automation-grid">{state.automations.map((automation) => <article className="retail-app-panel" key={automation.id}><div className="retail-app-panel-heading"><div><p>{automation.enabled ? 'Active' : 'Paused'}</p><h2>{automation.name}</h2></div><button aria-label={`Toggle ${automation.name}`} className={`retail-app-toggle ${automation.enabled ? 'active' : ''}`} onClick={() => update((current) => ({ ...current, automations: current.automations.map((item) => item.id === automation.id ? { ...item, enabled: !item.enabled } : item) }))} type="button"><i /></button></div><p>{automation.description}</p><footer><span>{automation.runs} runs</span><span>Last run {automation.lastRun}</span></footer></article>)}</div></>
}

function SettingsPage({ state, update }: { state: RetailState; update: (mutate: (current: RetailState) => RetailState) => void }) {
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); update((current) => ({ ...current, settings: { businessName: String(form.get('businessName')), currency: String(form.get('currency')), timezone: String(form.get('timezone')), lowStockAlerts: form.get('lowStockAlerts') === 'on', orderUpdates: form.get('orderUpdates') === 'on' } })) }
  return <><PageHeading eyebrow="Administration" title="Settings" copy="Configure this workspace’s identity, localisation, and operational notifications." /><form className="retail-app-settings retail-app-panel" onSubmit={save}><section><h2>Business details</h2><p>Used across orders, customer messages, reports, and workspace headers.</p><label>Business name<input defaultValue={state.settings.businessName} name="businessName" /></label><div className="retail-app-form-grid"><label>Currency<select defaultValue={state.settings.currency} name="currency"><option>GBP</option><option>USD</option><option>EUR</option></select></label><label>Timezone<select defaultValue={state.settings.timezone} name="timezone"><option>Europe/London</option><option>Africa/Lagos</option><option>America/New_York</option></select></label></div></section><section><h2>Notifications</h2><label className="retail-app-check"><input defaultChecked={state.settings.lowStockAlerts} name="lowStockAlerts" type="checkbox" /> Alert operations when stock falls below its reorder point</label><label className="retail-app-check"><input defaultChecked={state.settings.orderUpdates} name="orderUpdates" type="checkbox" /> Send customer updates when order status changes</label></section><footer><button className="retail-app-primary" type="submit">Save settings</button></footer></form></>
}

export function RetailBusinessApplication({ section = 'overview' }: { section?: RetailSection }) {
  const { state, update, reset } = useRetailState()
  const [notice, setNotice] = useState('')
  const [command, setCommand] = useState('')
  const groups = [...new Set(sections.map((item) => item.group))]
  const addProduct = () => {
    const product: Product = { id: `PRO-${110 + state.products.length}`, sku: `NEW-${110 + state.products.length}`, name: 'New product', category: 'Uncategorised', price: 0, stock: 0, reorderAt: 5, status: 'Draft' }
    update((current) => ({ ...current, products: [product, ...current.products] }))
    setNotice('Draft product created. Select Products to complete its details.')
  }
  const addCustomer = () => {
    const customer: Customer = { id: `CUS-${210 + state.customers.length}`, name: 'New customer', email: 'email@example.com', phone: 'Add phone', orders: 0, spent: 0, segment: 'New', lastOrder: 'Never' }
    update((current) => ({ ...current, customers: [customer, ...current.customers] }))
    setNotice('Customer record created.')
  }
  const addSupplier = () => {
    const supplier: Supplier = { id: `SUP-${40 + state.suppliers.length}`, name: 'New supplier', contact: 'Contact needed', products: 0, leadTime: 'Set lead time', status: 'Watch', nextDelivery: 'Not scheduled' }
    update((current) => ({ ...current, suppliers: [supplier, ...current.suppliers] }))
    setNotice('Supplier record created.')
  }
  const inviteMember = () => {
    const member: TeamMember = { id: `USR-${10 + state.team.length}`, name: 'Invited teammate', email: `teammate${state.team.length + 1}@example.com`, role: 'Staff', status: 'Invited', lastActive: 'Invite sent' }
    update((current) => ({ ...current, team: [...current.team, member] }))
    setNotice('Team invitation created.')
  }
  return <main className="retail-product-shell">
    <aside className="retail-product-sidebar">
      <Link className="retail-product-brand" href="/"><span>F</span><div><strong>FoundingOS</strong><small>Retail Workspace</small></div></Link>
      <div className="retail-product-store"><span>FS</span><div><strong>{state.settings.businessName}</strong><small>Demo organisation</small></div><b>⌄</b></div>
      <nav aria-label="Retail workspace navigation">{groups.map((group) => <div key={group}><p>{group}</p>{sections.filter((item) => item.group === group).map((item) => <Link aria-current={section === item.id ? 'page' : undefined} className={section === item.id ? 'active' : ''} href={item.id === 'overview' ? '/test-workspaces/retail' : `/test-workspaces/retail/${item.id}`} key={item.id}><i>{item.icon}</i>{item.label}{item.id === 'orders' ? <em>{state.orders.filter((order) => order.status !== 'Delivered').length}</em> : null}</Link>)}</div>)}</nav>
      <Link className="retail-product-switcher" href="/test-workspaces/logistics">Switch workspace <span>↗</span></Link>
    </aside>
    <section className="retail-product-main">
      <header className="retail-product-topbar"><form onSubmit={(event) => { event.preventDefault(); setNotice(command ? `FoundingOS searched the Retail workspace for “${command}”.` : 'Enter a command or search term.'); setCommand('') }}><span>⌕</span><input aria-label="Search Retail workspace" onChange={(event) => setCommand(event.target.value)} placeholder="Search orders, customers, products, or ask FoundingOS…" value={command} /></form><div><button aria-label="Notifications" type="button">♢<i /></button><span className="retail-product-user">BS</span></div></header>
      <div className="retail-product-content">
        {notice ? <div className="retail-product-notice" role="status"><span>✓</span>{notice}<button onClick={() => setNotice('')} type="button">×</button></div> : null}
        {section === 'overview' ? <OverviewPage state={state} /> : null}
        {section === 'orders' ? <OrdersPage state={state} update={update} /> : null}
        {section === 'inventory' ? <InventoryPage state={state} update={update} /> : null}
        {section === 'products' ? <DirectoryPage title="Products" eyebrow="Catalogue" copy="Manage sellable products, pricing, categories, and publishing state." columns={['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status']} rows={state.products} onCreate={addProduct} render={(product) => <><td><strong>{product.name}</strong></td><td>{product.sku}</td><td>{product.category}</td><td>{money(product.price)}</td><td>{product.stock}</td><td><span className={`retail-app-status status-${product.status.toLowerCase()}`}>{product.status}</span></td></>} /> : null}
        {section === 'customers' ? <DirectoryPage title="Customers" eyebrow="Relationships" copy="Keep customer identity, contact history, order value, and segmentation connected." columns={['Customer', 'Contact', 'Segment', 'Orders', 'Lifetime value', 'Last order']} rows={state.customers} onCreate={addCustomer} render={(customer) => <><td><strong>{customer.name}</strong><small>{customer.id}</small></td><td>{customer.email}<small>{customer.phone}</small></td><td>{customer.segment}</td><td>{customer.orders}</td><td>{money(customer.spent)}</td><td>{customer.lastOrder}</td></>} /> : null}
        {section === 'suppliers' ? <DirectoryPage title="Suppliers" eyebrow="Supply chain" copy="Track supplier ownership, catalogue coverage, lead times, and expected deliveries." columns={['Supplier', 'Contact', 'Products', 'Lead time', 'Health', 'Next delivery']} rows={state.suppliers} onCreate={addSupplier} render={(supplier) => <><td><strong>{supplier.name}</strong><small>{supplier.id}</small></td><td>{supplier.contact}</td><td>{supplier.products}</td><td>{supplier.leadTime}</td><td><span className={`retail-app-status status-${supplier.status.toLowerCase()}`}>{supplier.status}</span></td><td>{supplier.nextDelivery}</td></>} /> : null}
        {section === 'reports' ? <ReportsPage state={state} /> : null}
        {section === 'automations' ? <AutomationsPage state={state} update={update} /> : null}
        {section === 'team' ? <DirectoryPage title="Team" eyebrow="Administration" copy="Control access, operational roles, invitations, and workspace responsibility." columns={['Team member', 'Email', 'Role', 'Status', 'Last active']} rows={state.team} onCreate={inviteMember} render={(member) => <><td><strong>{member.name}</strong></td><td>{member.email}</td><td>{member.role}</td><td><span className={`retail-app-status status-${member.status.toLowerCase()}`}>{member.status}</span></td><td>{member.lastActive}</td></>} /> : null}
        {section === 'settings' ? <SettingsPage state={state} update={update} /> : null}
      </div>
      <footer className="retail-product-footer"><span>Interactive demo · changes saved in this browser</span><button onClick={reset} type="button">Reset workspace data</button></footer>
    </section>
  </main>
}
