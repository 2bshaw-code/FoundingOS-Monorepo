/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import { DataWorkbench, ModuleHeader, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { DEMO_PRODUCTS, DEMO_SUPPLIERS, DEMO_CUSTOMERS, DEMO_ORDERS, DEMO_PROMOTIONS, DEMO_BASKET_ITEMS } from './retail-operations-data'

// Seven real, dedicated FoundRetail views (POS/Inventory/Suppliers/Customers/Orders/Promotions
// Manager/Inventory Alerts) — every one of these nav links already existed in retail-console's
// sidebar, pointing at real routes with no page behind any of them (falling through to a
// generic "Item/Type/Status/Owner" placeholder shared by every unrelated module). Built with
// real, tailored fields per view — honest "sell anything in minutes" demo content, clearly
// illustrative, no real payment processor or stock system underneath.

function DemoBanner({ text }: { text?: string }) {
  return (
    <div className="quantum-narrator-panel" style={{ marginBottom: 4 }}>
      <p><small>{text ?? 'Demo mode — every product, order, and figure below is synthetic and illustrative.'}</small></p>
    </div>
  )
}

const inventoryFields: DataField[] = [
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category', type: 'select', options: ['Apparel', 'Accessories', 'Homeware', 'Stationery'] },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'reorderAt', label: 'Reorder at' },
]
const inventoryRows = (): DataRow[] => DEMO_PRODUCTS.map((p, i) => ({
  id: `inv-${i}`,
  values: { name: p.name, category: p.category, price: p.price, stock: String(p.stock), reorderAt: String(p.reorderAt) },
}))

export function InventoryView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const lowStock = DEMO_PRODUCTS.filter((p) => p.stock <= p.reorderAt).length
  return (
    <section className="stack" style={accentStyle}>
      <DemoBanner />
      <DataWorkbench
        title="Inventory"
        description="Live stock levels for every product, with reorder points so nothing runs out unnoticed."
        fields={inventoryFields}
        rows={inventoryRows()}
        cards={[
          { label: 'Products tracked', value: String(DEMO_PRODUCTS.length), trend: 'Illustrative', icon: '▣' },
          { label: 'Below reorder point', value: String(lowStock), trend: lowStock ? 'Needs action' : 'All healthy', icon: '!' },
          { label: 'Total units on hand', value: String(DEMO_PRODUCTS.reduce((s, p) => s + p.stock, 0)), trend: 'Illustrative', icon: '#' },
        ]}
        accentStyle={accentStyle}
        pageSize={6}
        emptyCopy="Add your first product to start tracking stock."
      />
    </section>
  )
}

export function InventoryAlertsView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const alerts = DEMO_PRODUCTS.filter((p) => p.stock <= p.reorderAt)
  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Inventory alerts" description="Anything at or below its reorder point shows here first, so restocking never depends on remembering." />
      <DemoBanner />
      <div className="module-card-grid">
        {alerts.length === 0 && (
          <article className="module-card fo-card"><p>Nothing needs restocking right now — every product is above its reorder point.</p></article>
        )}
        {alerts.map((p) => (
          <article key={p.name} className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>!</span><strong>{p.name}</strong></div>
            <p style={{ fontSize: 24, fontWeight: 700 }}>{p.stock} left</p>
            <p><small>Reorder point is {p.reorderAt} — {p.stock <= p.reorderAt ? 'below threshold, order more soon.' : 'still healthy.'}</small></p>
          </article>
        ))}
      </div>
    </section>
  )
}

const supplierFields: DataField[] = [
  { key: 'name', label: 'Supplier' },
  { key: 'leadTime', label: 'Lead time' },
  { key: 'lastOrder', label: 'Last order', type: 'date' },
  { key: 'reliability', label: 'Reliability', type: 'select', options: ['High', 'Medium', 'Low'] },
]
const supplierRows = (): DataRow[] => DEMO_SUPPLIERS.map((s, i) => ({
  id: `sup-${i}`,
  values: { name: s.name, leadTime: s.leadTime, lastOrder: s.lastOrder, reliability: s.reliability },
}))

export function SuppliersView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="stack" style={accentStyle}>
      <DemoBanner />
      <DataWorkbench
        title="Suppliers"
        description="Every supplier you work with, their typical lead time, and how reliable they've been."
        fields={supplierFields}
        rows={supplierRows()}
        cards={[
          { label: 'Suppliers', value: String(DEMO_SUPPLIERS.length), trend: 'Illustrative', icon: '▣' },
          { label: 'High reliability', value: String(DEMO_SUPPLIERS.filter((s) => s.reliability === 'High').length), trend: 'Good', icon: '✓' },
        ]}
        accentStyle={accentStyle}
        pageSize={6}
        emptyCopy="Add your first supplier."
      />
    </section>
  )
}

const customerFields: DataField[] = [
  { key: 'name', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'orders', label: 'Orders' },
  { key: 'lifetimeSpend', label: 'Lifetime spend' },
  { key: 'lastOrder', label: 'Last order', type: 'date' },
]
const customerRows = (): DataRow[] => DEMO_CUSTOMERS.map((c, i) => ({
  id: `cust-${i}`,
  values: { name: c.name, email: c.email, orders: String(c.orders), lifetimeSpend: c.lifetimeSpend, lastOrder: c.lastOrder },
}))

export function CustomersView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="stack" style={accentStyle}>
      <DemoBanner />
      <DataWorkbench
        title="Customers"
        description="Every customer who's bought from you, how often, and how much they've spent."
        fields={customerFields}
        rows={customerRows()}
        cards={[
          { label: 'Customers', value: String(DEMO_CUSTOMERS.length), trend: 'Illustrative', icon: '◎' },
          { label: 'Repeat customers', value: String(DEMO_CUSTOMERS.filter((c) => c.orders > 1).length), trend: 'Good sign', icon: '✓' },
        ]}
        accentStyle={accentStyle}
        pageSize={6}
        emptyCopy="Your first customer will appear here after their first order."
      />
    </section>
  )
}

const orderFields: DataField[] = [
  { key: 'id', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status', type: 'select', options: ['New', 'Packed', 'Shipped', 'Delivered'] },
]
const orderRows = (): DataRow[] => DEMO_ORDERS.map((o) => ({
  id: o.id,
  values: { id: o.id, customer: o.customer, items: o.items, total: o.total, status: o.status },
}))

export function OrdersView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="stack" style={accentStyle}>
      <DemoBanner />
      <DataWorkbench
        title="Orders"
        description="Every order, who it's for, and where it is in the fulfilment process."
        fields={orderFields}
        rows={orderRows()}
        cards={[
          { label: 'Open orders', value: String(DEMO_ORDERS.filter((o) => o.status !== 'Delivered').length), trend: 'In progress', icon: '▣' },
          { label: 'Delivered', value: String(DEMO_ORDERS.filter((o) => o.status === 'Delivered').length), trend: 'Complete', icon: '✓' },
        ]}
        accentStyle={accentStyle}
        pageSize={6}
        emptyCopy="Orders will appear here as customers buy."
      />
    </section>
  )
}

const promotionFields: DataField[] = [
  { key: 'name', label: 'Promotion' },
  { key: 'discount', label: 'Discount' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Scheduled', 'Ended'] },
  { key: 'redemptions', label: 'Redemptions' },
]
const promotionRows = (): DataRow[] => DEMO_PROMOTIONS.map((p, i) => ({
  id: `promo-${i}`,
  values: { name: p.name, discount: p.discount, status: p.status, redemptions: String(p.redemptions) },
}))

export function PromotionsManagerView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="stack" style={accentStyle}>
      <DemoBanner />
      <DataWorkbench
        title="Promotions manager"
        description="Create and schedule discounts, and see how many times each one has been used."
        fields={promotionFields}
        rows={promotionRows()}
        cards={[
          { label: 'Active now', value: String(DEMO_PROMOTIONS.filter((p) => p.status === 'Active').length), trend: 'Live', icon: '✓' },
          { label: 'Total redemptions', value: String(DEMO_PROMOTIONS.reduce((s, p) => s + p.redemptions, 0)), trend: 'Illustrative', icon: '#' },
        ]}
        accentStyle={accentStyle}
        pageSize={6}
        emptyCopy="Create your first promotion."
      />
    </section>
  )
}

// POS is the one genuinely bespoke view here (not a DataWorkbench table) — a real, clickable
// checkout flow: ring up items, see the running total, take payment. This is the "sell anything
// in minutes" flagship moment; the basket math and receipt are real client-side logic, but no
// real card payment, printer, or till hardware is involved anywhere.
export function PosView({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const [basket, setBasket] = useState<{ name: string; price: number }[]>(DEMO_BASKET_ITEMS)
  const [paid, setPaid] = useState(false)
  const total = useMemo(() => basket.reduce((s, i) => s + i.price, 0), [basket])

  function addItem(product: { name: string; price: string }) {
    const price = Number(product.price.replace(/[^0-9.]/g, ''))
    setBasket((prev) => [...prev, { name: product.name, price }])
    setPaid(false)
  }
  function removeItem(index: number) {
    setBasket((prev) => prev.filter((_, i) => i !== index))
    setPaid(false)
  }

  return (
    <section className="stack" style={accentStyle}>
      <ModuleHeader config={config} title="Point of Sale" description="Ring up a sale, see the total, and take payment — the real flow behind 'sell anything in minutes'." />
      <DemoBanner text="Demo mode — this checkout calculates a real running total from the items you add, but no real card payment is taken." />
      <div className="module-card-grid">
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>▣</span><strong>Tap a product to add it</strong></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {DEMO_PRODUCTS.map((p) => (
              <button key={p.name} type="button" className="btn btn-secondary quantum-btn" onClick={() => addItem(p)}>
                {p.name} — {p.price}
              </button>
            ))}
          </div>
        </article>
        <article className="module-card fo-card quantum-frame">
          <div className="module-card-top"><span>🧾</span><strong>Basket</strong></div>
          {basket.length === 0 && <p><small>Basket is empty — tap a product to add it.</small></p>}
          {basket.map((item, i) => (
            <div key={`${item.name}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>{item.name}</span>
              <span>
                £{item.price.toFixed(2)}{' '}
                <button type="button" className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 12 }} onClick={() => removeItem(i)}>Remove</button>
              </span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary quantum-btn"
            style={{ marginTop: 10, width: '100%' }}
            disabled={basket.length === 0}
            onClick={() => setPaid(true)}
          >
            {paid ? '✓ Payment taken' : `Take payment — £${total.toFixed(2)}`}
          </button>
          {paid && <p style={{ marginTop: 8 }}><small>Sale complete. In a real store this would print/email a receipt and update Inventory and Orders automatically.</small></p>}
        </article>
      </div>
    </section>
  )
}
