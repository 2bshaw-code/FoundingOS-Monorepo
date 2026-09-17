'use client'

import { useEffect, useMemo, useState, type SetStateAction } from 'react'

type OrderStatus = 'New' | 'Picking' | 'Ready' | 'Dispatched' | 'Delivered'
type StockStatus = 'Healthy' | 'Low stock' | 'Out of stock'

type OrderRecord = {
  id: string
  customer: string
  channel: string
  items: number
  total: number
  status: OrderStatus
  owner: string
  due: string
}

type InventoryRecord = {
  id: string
  sku: string
  product: string
  category: string
  available: number
  reserved: number
  reorderAt: number
  location: string
  supplier: string
}

type ActivityRecord = {
  id: string
  label: string
  detail: string
  time: string
}

const orderStatuses: OrderStatus[] = ['New', 'Picking', 'Ready', 'Dispatched', 'Delivered']

const seedOrders: OrderRecord[] = [
  { id: 'ORD-1054', customer: 'Amina Yusuf', channel: 'WhatsApp', items: 3, total: 184.5, status: 'New', owner: 'Maya', due: 'Today, 16:00' },
  { id: 'ORD-1053', customer: 'Harbour Cafe', channel: 'Web', items: 8, total: 426, status: 'Picking', owner: 'Noah', due: 'Today, 17:30' },
  { id: 'ORD-1052', customer: 'Daniel Okoro', channel: 'WhatsApp', items: 2, total: 79.98, status: 'Ready', owner: 'Maya', due: 'Today, 18:00' },
  { id: 'ORD-1051', customer: 'North & Co', channel: 'POS', items: 12, total: 912.4, status: 'Dispatched', owner: 'Ava', due: 'Tomorrow' },
  { id: 'ORD-1050', customer: 'Sofia Martins', channel: 'Web', items: 1, total: 42, status: 'Delivered', owner: 'Noah', due: 'Completed' },
]

const seedInventory: InventoryRecord[] = [
  { id: 'inv-1', sku: 'TSH-BLU-M', product: 'Essential T-shirt / Blue / M', category: 'Apparel', available: 8, reserved: 6, reorderAt: 12, location: 'Manchester', supplier: 'Northstar Textiles' },
  { id: 'inv-2', sku: 'TSH-WHT-L', product: 'Essential T-shirt / White / L', category: 'Apparel', available: 42, reserved: 8, reorderAt: 15, location: 'Manchester', supplier: 'Northstar Textiles' },
  { id: 'inv-3', sku: 'TOT-NAT-01', product: 'Canvas tote / Natural', category: 'Accessories', available: 0, reserved: 0, reorderAt: 10, location: 'Leeds', supplier: 'Field Goods' },
  { id: 'inv-4', sku: 'HD-GRY-M', product: 'Core hoodie / Grey / M', category: 'Apparel', available: 31, reserved: 4, reorderAt: 10, location: 'Bristol', supplier: 'Northstar Textiles' },
  { id: 'inv-5', sku: 'MUG-BLK-01', product: 'Studio mug / Black', category: 'Home', available: 16, reserved: 2, reorderAt: 8, location: 'Leeds', supplier: 'Kiln Works' },
]

function now() {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function money(value: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
}

function stockStatus(record: InventoryRecord): StockStatus {
  if (record.available === 0) return 'Out of stock'
  if (record.available <= record.reorderAt) return 'Low stock'
  return 'Healthy'
}

function usePersistentRecords<T>(key: string, seed: T[]) {
  const [records, setRecords] = useState<T[]>(seed)

  useEffect(() => {
    const stored = window.localStorage.getItem(key)
    if (stored) setRecords(JSON.parse(stored) as T[])
  }, [key])

  const updateRecords = (update: SetStateAction<T[]>) => {
    setRecords((current) => {
      const next = typeof update === 'function' ? update(current) : update
      window.localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return [records, updateRecords] as const
}

function WorkspaceHeader({ title, description, onCreate }: { title: string; description: string; onCreate: () => void }) {
  return (
    <header className="retail-workspace-header">
      <div>
        <p>Retail workspace</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
      <button type="button" className="retail-primary-action" onClick={onCreate}>+ Create new</button>
    </header>
  )
}

function ActivityToast({ activity }: { activity: ActivityRecord | null }) {
  if (!activity) return null
  return (
    <div className="retail-activity-toast" role="status">
      <i />
      <div><strong>{activity.label}</strong><span>{activity.detail} · {activity.time}</span></div>
    </div>
  )
}

function CEOBriefing({
  headline,
  summary,
  standing,
  risks,
  actions,
}: {
  headline: string
  summary: string
  standing: Array<{ label: string; value: string; meaning: string; tone?: 'good' | 'watch' | 'risk' }>
  risks: string[]
  actions: string[]
}) {
  return (
    <section className="ceo-briefing" aria-labelledby="ceo-briefing-title">
      <div className="ceo-briefing-heading">
        <div>
          <p>CEO briefing · plain English</p>
          <h2 id="ceo-briefing-title">{headline}</h2>
          <span>{summary}</span>
        </div>
        <span className="ceo-confidence">Based on current demo records</span>
      </div>
      <div className="ceo-standing-grid">
        {standing.map((item) => (
          <article key={item.label} data-tone={item.tone ?? 'good'}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.meaning}</p>
          </article>
        ))}
      </div>
      <div className="ceo-decision-grid">
        <article>
          <p>What needs attention</p>
          <ul>{risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
        </article>
        <article>
          <p>What I would do next</p>
          <ol>{actions.map((action) => <li key={action}>{action}</li>)}</ol>
        </article>
      </div>
    </section>
  )
}

function OrdersWorkspace() {
  const [orders, setOrders] = usePersistentRecords('foundingos-demo-retail-orders-v1', seedOrders)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | OrderStatus>('All')
  const [selectedId, setSelectedId] = useState(seedOrders[0].id)
  const [creating, setCreating] = useState(false)
  const [activity, setActivity] = useState<ActivityRecord | null>(null)
  const [draft, setDraft] = useState({ customer: '', channel: 'WhatsApp', items: '1', total: '', owner: 'Maya', due: 'Today' })

  const visible = useMemo(() => orders.filter((order) => {
    const matchesStatus = status === 'All' || order.status === status
    const haystack = `${order.id} ${order.customer} ${order.channel} ${order.owner}`.toLowerCase()
    return matchesStatus && haystack.includes(query.trim().toLowerCase())
  }), [orders, query, status])
  const selected = orders.find((order) => order.id === selectedId) ?? visible[0]

  const publish = (label: string, detail: string) => setActivity({ id: crypto.randomUUID(), label, detail, time: now() })

  const createOrder = () => {
    if (!draft.customer.trim() || !Number(draft.total)) return
    const nextNumber = 1055 + orders.length
    const order: OrderRecord = {
      id: `ORD-${nextNumber}`,
      customer: draft.customer.trim(),
      channel: draft.channel,
      items: Math.max(1, Number(draft.items) || 1),
      total: Number(draft.total),
      status: 'New',
      owner: draft.owner,
      due: draft.due,
    }
    setOrders((current) => [order, ...current])
    setSelectedId(order.id)
    setCreating(false)
    setDraft({ customer: '', channel: 'WhatsApp', items: '1', total: '', owner: 'Maya', due: 'Today' })
    publish('Order created', `${order.id} added to the Event Feed and ready for picking`)
  }

  const advanceOrder = (order: OrderRecord) => {
    const index = orderStatuses.indexOf(order.status)
    if (index === orderStatuses.length - 1) return
    const nextStatus = orderStatuses[index + 1]
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: nextStatus } : item))
    publish(`${order.id} moved to ${nextStatus}`, nextStatus === 'Delivered' ? 'Finance can now prepare reconciliation' : 'The assigned team has been notified')
  }

  const openCount = orders.filter((order) => order.status !== 'Delivered').length
  const revenue = orders.reduce((sum, order) => sum + order.total, 0)
  const waitingValue = orders.filter((order) => order.status !== 'Delivered').reduce((sum, order) => sum + order.total, 0)
  const urgentOrders = orders.filter((order) => order.status === 'New' || order.status === 'Ready').length

  return (
    <section className="retail-ops-workspace">
      <WorkspaceHeader title="Orders" description="Capture, fulfil, and track every order from WhatsApp, web, and point of sale." onCreate={() => setCreating(true)} />
      <ActivityToast activity={activity} />
      <CEOBriefing
        headline={urgentOrders > 0 ? `${urgentOrders} orders need attention today` : 'Order fulfilment is under control'}
        summary={`There are ${openCount} open orders worth ${money(waitingValue)}. The immediate goal is to move new orders into picking and dispatch everything already marked ready.`}
        standing={[
          { label: 'Sales represented here', value: money(revenue), meaning: 'Total value of the current demo order book.', tone: 'good' },
          { label: 'Cash still in motion', value: money(waitingValue), meaning: 'Order value not yet delivered and ready for final reconciliation.', tone: waitingValue > 1_000 ? 'watch' : 'good' },
          { label: 'Orders needing action', value: String(urgentOrders), meaning: 'New orders need triage; ready orders should be dispatched.', tone: urgentOrders > 2 ? 'risk' : 'watch' },
          { label: 'Completion rate', value: `${Math.round((orders.filter((order) => order.status === 'Delivered').length / Math.max(orders.length, 1)) * 100)}%`, meaning: 'Share of visible orders already delivered.', tone: 'good' },
        ]}
        risks={[
          `${orders.filter((order) => order.status === 'New').length} new order(s) have not entered picking.`,
          `${orders.filter((order) => order.status === 'Ready').length} packed order(s) are waiting for dispatch.`,
          `${money(waitingValue)} remains dependent on fulfilment completing cleanly.`,
        ]}
        actions={[
          'Assign every new order to a named owner.',
          'Dispatch ready orders before accepting avoidable delays.',
          'Notify customers automatically when each order changes status.',
        ]}
      />
      <div className="retail-stat-grid">
        <article><span>Open orders</span><strong>{openCount}</strong><small>{orders.filter((order) => order.status === 'New').length} need triage</small></article>
        <article><span>Order value</span><strong>{money(revenue)}</strong><small>Across visible demo records</small></article>
        <article><span>Ready to dispatch</span><strong>{orders.filter((order) => order.status === 'Ready').length}</strong><small>Warehouse queue</small></article>
        <article><span>Delivered</span><strong>{orders.filter((order) => order.status === 'Delivered').length}</strong><small>Ready for reconciliation</small></article>
      </div>

      <div className="retail-toolbar">
        <label><span>Search orders</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order, customer, channel, owner…" /></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | OrderStatus)}><option>All</option>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button type="button" onClick={() => { setOrders(seedOrders); publish('Demo data restored', 'Order records reset to their original state') }}>Reset demo data</button>
      </div>

      <div className="retail-record-layout">
        <div className="retail-table-panel">
          <div className="retail-table-heading"><div><strong>Order queue</strong><span>{visible.length} matching records</span></div><span>Updated just now</span></div>
          <div className="retail-table-scroll">
            <table className="retail-data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Channel</th><th>Items</th><th>Total</th><th>Status</th><th>Owner</th><th>Due</th></tr></thead>
              <tbody>{visible.map((order) => (
                <tr key={order.id} className={selected?.id === order.id ? 'is-selected' : undefined} onClick={() => setSelectedId(order.id)}>
                  <td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.channel}</td><td>{order.items}</td><td>{money(order.total)}</td>
                  <td><span className="retail-status" data-status={order.status}>{order.status}</span></td><td>{order.owner}</td><td>{order.due}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        {selected && <aside className="retail-detail-panel">
          <p>Selected order</p><h2>{selected.id}</h2><strong className="retail-detail-customer">{selected.customer}</strong>
          <dl><div><dt>Value</dt><dd>{money(selected.total)}</dd></div><div><dt>Channel</dt><dd>{selected.channel}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Due</dt><dd>{selected.due}</dd></div></dl>
          <div className="retail-progress">{orderStatuses.map((item) => <span key={item} className={orderStatuses.indexOf(item) <= orderStatuses.indexOf(selected.status) ? 'is-complete' : undefined}>{item}</span>)}</div>
          <button type="button" className="retail-primary-action" disabled={selected.status === 'Delivered'} onClick={() => advanceOrder(selected)}>
            {selected.status === 'Delivered' ? 'Order completed' : `Move to ${orderStatuses[orderStatuses.indexOf(selected.status) + 1]}`}
          </button>
          <button type="button" onClick={() => publish('Customer notified', `WhatsApp update prepared for ${selected.customer}`)}>Send WhatsApp update</button>
        </aside>}
      </div>

      {creating && <div className="retail-modal-backdrop" role="presentation" onMouseDown={() => setCreating(false)}>
        <section className="retail-modal" role="dialog" aria-modal="true" aria-labelledby="create-order-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="retail-modal-heading"><div><p>Retail workspace</p><h2 id="create-order-title">Create order</h2></div><button type="button" onClick={() => setCreating(false)} aria-label="Close">×</button></div>
          <div className="retail-form-grid">
            <label><span>Customer</span><input autoFocus value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></label>
            <label><span>Channel</span><select value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value })}><option>WhatsApp</option><option>Web</option><option>POS</option></select></label>
            <label><span>Number of items</span><input type="number" min="1" value={draft.items} onChange={(event) => setDraft({ ...draft, items: event.target.value })} /></label>
            <label><span>Order total</span><input type="number" min="0" step="0.01" value={draft.total} onChange={(event) => setDraft({ ...draft, total: event.target.value })} /></label>
            <label><span>Owner</span><select value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })}><option>Maya</option><option>Noah</option><option>Ava</option></select></label>
            <label><span>Due</span><input value={draft.due} onChange={(event) => setDraft({ ...draft, due: event.target.value })} /></label>
          </div>
          <footer><button type="button" onClick={() => setCreating(false)}>Cancel</button><button type="button" className="retail-primary-action" onClick={createOrder}>Create order</button></footer>
        </section>
      </div>}
    </section>
  )
}

function InventoryWorkspace() {
  const [inventory, setInventory] = usePersistentRecords('foundingos-demo-retail-inventory-v1', seedInventory)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | StockStatus>('All')
  const [selectedId, setSelectedId] = useState(seedInventory[0].id)
  const [creating, setCreating] = useState(false)
  const [activity, setActivity] = useState<ActivityRecord | null>(null)
  const [draft, setDraft] = useState({ sku: '', product: '', category: 'Apparel', available: '0', reorderAt: '10', location: 'Manchester', supplier: '' })

  const visible = useMemo(() => inventory.filter((item) => {
    const matchesStatus = status === 'All' || stockStatus(item) === status
    return matchesStatus && `${item.sku} ${item.product} ${item.category} ${item.location} ${item.supplier}`.toLowerCase().includes(query.trim().toLowerCase())
  }), [inventory, query, status])
  const selected = inventory.find((item) => item.id === selectedId) ?? visible[0]
  const publish = (label: string, detail: string) => setActivity({ id: crypto.randomUUID(), label, detail, time: now() })

  const adjustStock = (item: InventoryRecord, amount: number) => {
    setInventory((current) => current.map((record) => record.id === item.id ? { ...record, available: Math.max(0, record.available + amount) } : record))
    publish(amount > 0 ? 'Stock received' : 'Stock adjusted', `${item.sku} changed by ${amount > 0 ? '+' : ''}${amount} units`)
  }

  const createItem = () => {
    if (!draft.sku.trim() || !draft.product.trim()) return
    const item: InventoryRecord = { id: crypto.randomUUID(), sku: draft.sku.trim().toUpperCase(), product: draft.product.trim(), category: draft.category, available: Number(draft.available) || 0, reserved: 0, reorderAt: Number(draft.reorderAt) || 0, location: draft.location, supplier: draft.supplier.trim() }
    setInventory((current) => [item, ...current])
    setSelectedId(item.id)
    setCreating(false)
    publish('Inventory item created', `${item.sku} added at ${item.location}`)
  }

  const lowStock = inventory.filter((item) => stockStatus(item) !== 'Healthy').length
  const units = inventory.reduce((sum, item) => sum + item.available, 0)
  const reserved = inventory.reduce((sum, item) => sum + item.reserved, 0)
  const outOfStock = inventory.filter((item) => stockStatus(item) === 'Out of stock').length

  return (
    <section className="retail-ops-workspace">
      <WorkspaceHeader title="Inventory" description="See available, reserved, and at-risk stock across every location." onCreate={() => setCreating(true)} />
      <ActivityToast activity={activity} />
      <CEOBriefing
        headline={outOfStock > 0 ? `${outOfStock} product is already out of stock` : lowStock > 0 ? `${lowStock} products need replenishment` : 'Stock coverage is healthy'}
        summary={`The business has ${units} units available and ${reserved} already promised to open orders. Replenishment should focus on products at or below their reorder threshold before sales are lost.`}
        standing={[
          { label: 'Available to sell', value: String(units), meaning: 'Physical units not yet consumed by completed sales.', tone: 'good' },
          { label: 'Already promised', value: String(reserved), meaning: 'Units reserved for customers and therefore not safely available.', tone: reserved > units * 0.3 ? 'watch' : 'good' },
          { label: 'Replenishment risks', value: String(lowStock), meaning: 'Products at low or zero stock that could block revenue.', tone: lowStock > 1 ? 'risk' : 'watch' },
          { label: 'Locations covered', value: String(new Set(inventory.map((item) => item.location)).size), meaning: 'Stores or stockrooms represented in this view.', tone: 'good' },
        ]}
        risks={[
          `${outOfStock} product(s) cannot currently be sold without replenishment.`,
          `${inventory.filter((item) => stockStatus(item) === 'Low stock').length} product(s) may run out if demand continues.`,
          `${reserved} units are committed and should not be counted as free stock.`,
        ]}
        actions={[
          'Reorder out-of-stock and low-stock products first.',
          'Confirm supplier lead times before promising new delivery dates.',
          'Move spare stock between locations when that is faster than purchasing.',
        ]}
      />
      <div className="retail-stat-grid">
        <article><span>Available units</span><strong>{units}</strong><small>Across {inventory.length} SKUs</small></article>
        <article><span>Low-stock alerts</span><strong>{lowStock}</strong><small>Replenishment required</small></article>
        <article><span>Reserved</span><strong>{reserved}</strong><small>Allocated to open orders</small></article>
        <article><span>Locations</span><strong>{new Set(inventory.map((item) => item.location)).size}</strong><small>Live stock locations</small></article>
      </div>
      <div className="retail-toolbar">
        <label><span>Search inventory</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SKU, product, supplier, location…" /></label>
        <label><span>Stock status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | StockStatus)}><option>All</option><option>Healthy</option><option>Low stock</option><option>Out of stock</option></select></label>
        <button type="button" onClick={() => { setInventory(seedInventory); publish('Demo data restored', 'Inventory records reset to their original state') }}>Reset demo data</button>
      </div>
      <div className="retail-record-layout">
        <div className="retail-table-panel">
          <div className="retail-table-heading"><div><strong>Stock ledger</strong><span>{visible.length} matching records</span></div><span>Browser-persisted demo data</span></div>
          <div className="retail-table-scroll"><table className="retail-data-table"><thead><tr><th>SKU</th><th>Product</th><th>Available</th><th>Reserved</th><th>Location</th><th>Supplier</th><th>Status</th></tr></thead>
            <tbody>{visible.map((item) => <tr key={item.id} className={selected?.id === item.id ? 'is-selected' : undefined} onClick={() => setSelectedId(item.id)}>
              <td><strong>{item.sku}</strong></td><td>{item.product}</td><td>{item.available}</td><td>{item.reserved}</td><td>{item.location}</td><td>{item.supplier}</td><td><span className="retail-status" data-status={stockStatus(item)}>{stockStatus(item)}</span></td>
            </tr>)}</tbody>
          </table></div>
        </div>
        {selected && <aside className="retail-detail-panel">
          <p>Selected inventory</p><h2>{selected.sku}</h2><strong className="retail-detail-customer">{selected.product}</strong>
          <dl><div><dt>Available</dt><dd>{selected.available}</dd></div><div><dt>Reserved</dt><dd>{selected.reserved}</dd></div><div><dt>Reorder at</dt><dd>{selected.reorderAt}</dd></div><div><dt>Location</dt><dd>{selected.location}</dd></div></dl>
          <span className="retail-status" data-status={stockStatus(selected)}>{stockStatus(selected)}</span>
          <button type="button" className="retail-primary-action" onClick={() => adjustStock(selected, 10)}>Receive 10 units</button>
          <button type="button" onClick={() => adjustStock(selected, -1)}>Record one unit sold</button>
        </aside>}
      </div>
      {creating && <div className="retail-modal-backdrop" role="presentation" onMouseDown={() => setCreating(false)}>
        <section className="retail-modal" role="dialog" aria-modal="true" aria-labelledby="create-item-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="retail-modal-heading"><div><p>Retail workspace</p><h2 id="create-item-title">Add inventory item</h2></div><button type="button" onClick={() => setCreating(false)} aria-label="Close">×</button></div>
          <div className="retail-form-grid">
            <label><span>SKU</span><input autoFocus value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></label>
            <label><span>Product</span><input value={draft.product} onChange={(event) => setDraft({ ...draft, product: event.target.value })} /></label>
            <label><span>Category</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Apparel</option><option>Accessories</option><option>Home</option><option>Other</option></select></label>
            <label><span>Available units</span><input type="number" min="0" value={draft.available} onChange={(event) => setDraft({ ...draft, available: event.target.value })} /></label>
            <label><span>Reorder threshold</span><input type="number" min="0" value={draft.reorderAt} onChange={(event) => setDraft({ ...draft, reorderAt: event.target.value })} /></label>
            <label><span>Location</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
            <label><span>Supplier</span><input value={draft.supplier} onChange={(event) => setDraft({ ...draft, supplier: event.target.value })} /></label>
          </div>
          <footer><button type="button" onClick={() => setCreating(false)}>Cancel</button><button type="button" className="retail-primary-action" onClick={createItem}>Add inventory item</button></footer>
        </section>
      </div>}
    </section>
  )
}

export function RetailOperationsWorkspace({ moduleId }: { moduleId: string }) {
  return moduleId === 'orders' ? <OrdersWorkspace /> : <InventoryWorkspace />
}
