/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getJSON, setJSON } from './local-store'
import { postBespokeAction } from './bespoke-actions'
import type { RetailPollResponse, RetailProduct, RetailTrendPoint } from './retail-poll'

export type DemoSaleLine = {
  productId: string
  sku: string
  name: string
  quantity: number
  unitPriceGbp: number
  lineTotalGbp: number
}

export type DemoSale = {
  id: string
  timestamp: string
  itemCount: number
  totalGbp: number
  lines: DemoSaleLine[]
}

export type DemoInventoryItem = {
  productId: string
  sku: string
  name: string
  category: string
  unitPriceGbp: number
  quantityOnHand: number
  parLevel: number
}

type RetailLedgerState = {
  inventory: DemoInventoryItem[]
  sales: DemoSale[]
  seededAt: string
  updatedAt: string
}

export type RetailDashboardProduct = RetailProduct & {
  localUnitsSoldToday: number
  localRevenueTodayGbp: number
  quantityOnHand: number
  parLevel: number
  lowStock: boolean
}

export type RetailDashboard = {
  summary: {
    revenueTodayGbp: number
    transactionsToday: number
    avgOrderValueGbp: number
    grossMarginPct: number
    demoRevenueTodayGbp: number
    demoTransactionsToday: number
    lowStockCount: number
  }
  trend: RetailTrendPoint[]
  products: RetailDashboardProduct[]
  topProducts: RetailDashboardProduct[]
  inventory: DemoInventoryItem[]
  recentSales: DemoSale[]
}

const STORE_KEY = 'fo_retail_demo_ops'

function roundMoney(value: number): number {
  return Number(value.toFixed(2))
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function floorToWindow(date: Date, windowMs: number): string {
  return new Date(Math.floor(date.getTime() / windowMs) * windowMs).toISOString()
}

function seedInventory(products: RetailProduct[]): DemoInventoryItem[] {
  return products.map((product) => ({
    productId: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    unitPriceGbp: product.priceGbp,
    quantityOnHand: product.inventoryOnHand,
    parLevel: Math.max(4, Math.round(product.inventoryOnHand * 0.3)),
  }))
}

function mergeInventory(products: RetailProduct[], inventory: DemoInventoryItem[]): DemoInventoryItem[] {
  const byId = new Map(inventory.map((item) => [item.productId, item]))
  return products.map((product) => {
    const existing = byId.get(product.id)
    if (!existing) {
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        unitPriceGbp: product.priceGbp,
        quantityOnHand: product.inventoryOnHand,
        parLevel: Math.max(4, Math.round(product.inventoryOnHand * 0.3)),
      }
    }
    return {
      ...existing,
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitPriceGbp: product.priceGbp,
    }
  })
}

async function saveState(state: RetailLedgerState): Promise<void> {
  await setJSON(STORE_KEY, state)
}

export async function getRetailLedger(products: RetailProduct[]): Promise<RetailLedgerState> {
  const fallback: RetailLedgerState = {
    inventory: seedInventory(products),
    sales: [],
    seededAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const existing = await getJSON<RetailLedgerState>(STORE_KEY, fallback)
  const mergedInventory = mergeInventory(products, existing.inventory)
  const changed =
    mergedInventory.length !== existing.inventory.length ||
    mergedInventory.some((item, index) => JSON.stringify(item) !== JSON.stringify(existing.inventory[index]))
  if (changed) {
    const nextState = { ...existing, inventory: mergedInventory, updatedAt: new Date().toISOString() }
    await saveState(nextState)
    return nextState
  }
  return existing
}

export async function recordDemoSale(
  lines: { productId: string; quantity: number }[],
  products: RetailProduct[]
): Promise<{ ok: true; state: RetailLedgerState; sale: DemoSale } | { ok: false; error: string }> {
  const state = await getRetailLedger(products)
  const productById = new Map(products.map((product) => [product.id, product]))
  const inventoryById = new Map(state.inventory.map((item) => [item.productId, item]))
  const normalized = lines.filter((line) => line.quantity > 0)

  if (normalized.length === 0) {
    return { ok: false, error: 'Add at least one product before completing a demo sale.' }
  }

  for (const line of normalized) {
    const product = productById.get(line.productId)
    const inventory = inventoryById.get(line.productId)
    if (!product || !inventory) {
      return { ok: false, error: 'One of these products is no longer available.' }
    }
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      return { ok: false, error: 'Sales quantities must be whole items.' }
    }
    if (inventory.quantityOnHand < line.quantity) {
      return { ok: false, error: `${product.name} only has ${inventory.quantityOnHand} left in this device ledger.` }
    }
  }

  const saleLines = normalized.map((line) => {
    const product = productById.get(line.productId)!
    const inventory = inventoryById.get(line.productId)!
    inventory.quantityOnHand -= line.quantity
    const lineTotalGbp = roundMoney(line.quantity * product.priceGbp)
    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: line.quantity,
      unitPriceGbp: product.priceGbp,
      lineTotalGbp,
    }
  })

  const itemCount = saleLines.reduce((sum, line) => sum + line.quantity, 0)
  const totalGbp = roundMoney(saleLines.reduce((sum, line) => sum + line.lineTotalGbp, 0))
  const sale: DemoSale = {
    id: `sale-${Date.now()}`,
    timestamp: new Date().toISOString(),
    itemCount,
    totalGbp,
    lines: saleLines,
  }

  const nextState: RetailLedgerState = {
    ...state,
    inventory: [...state.inventory],
    sales: [sale, ...state.sales],
    updatedAt: new Date().toISOString(),
  }
  await saveState(nextState)
  await postBespokeAction({ moduleId: 'retail-ledger', action: 'Record sale', note: `${itemCount} item(s), £${totalGbp}`, payload: sale })
  return { ok: true, state: nextState, sale }
}

export async function restockDemoProduct(
  productId: string,
  quantity: number,
  products: RetailProduct[]
): Promise<{ ok: true; state: RetailLedgerState; item: DemoInventoryItem } | { ok: false; error: string }> {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, error: 'Restock amounts must be whole items.' }
  }
  const state = await getRetailLedger(products)
  const item = state.inventory.find((entry) => entry.productId === productId)
  if (!item) {
    return { ok: false, error: 'Could not find that product in this device ledger.' }
  }
  item.quantityOnHand += quantity
  const nextState: RetailLedgerState = { ...state, inventory: [...state.inventory], updatedAt: new Date().toISOString() }
  await saveState(nextState)
  await postBespokeAction({ moduleId: 'retail-ledger', action: 'Restock product', note: `${item.name} +${quantity}`, payload: { productId, quantity } })
  return { ok: true, state: nextState, item }
}

export function buildRetailDashboard(snapshot: RetailPollResponse, state: RetailLedgerState): RetailDashboard {
  const now = new Date()
  const todaySales = state.sales.filter((sale) => isSameLocalDay(new Date(sale.timestamp), now))
  const localRevenueTodayGbp = roundMoney(todaySales.reduce((sum, sale) => sum + sale.totalGbp, 0))
  const localProductTotals = new Map<string, { quantity: number; revenueGbp: number }>()

  for (const sale of todaySales) {
    for (const line of sale.lines) {
      const existing = localProductTotals.get(line.productId) ?? { quantity: 0, revenueGbp: 0 }
      localProductTotals.set(line.productId, {
        quantity: existing.quantity + line.quantity,
        revenueGbp: roundMoney(existing.revenueGbp + line.lineTotalGbp),
      })
    }
  }

  const inventoryById = new Map(state.inventory.map((item) => [item.productId, item]))
  const products: RetailDashboardProduct[] = snapshot.products.map((product) => {
    const local = localProductTotals.get(product.id) ?? { quantity: 0, revenueGbp: 0 }
    const inventory = inventoryById.get(product.id)
    const quantityOnHand = inventory?.quantityOnHand ?? product.inventoryOnHand
    const parLevel = inventory?.parLevel ?? Math.max(4, Math.round(product.inventoryOnHand * 0.3))
    return {
      ...product,
      unitsSoldToday: product.unitsSoldToday + local.quantity,
      revenueTodayGbp: roundMoney(product.revenueTodayGbp + local.revenueGbp),
      localUnitsSoldToday: local.quantity,
      localRevenueTodayGbp: local.revenueGbp,
      quantityOnHand,
      parLevel,
      lowStock: quantityOnHand <= parLevel,
    }
  })

  const trend = snapshot.trend.map((point) => ({ ...point }))
  const intervalMs = trend.length > 1 ? new Date(trend[1].bucketStart).getTime() - new Date(trend[0].bucketStart).getTime() : 30 * 60 * 1000
  const trendIndex = new Map(trend.map((point, index) => [point.bucketStart, index]))

  for (const sale of todaySales) {
    const bucketStart = floorToWindow(new Date(sale.timestamp), intervalMs)
    const index = trendIndex.get(bucketStart)
    if (index !== undefined) {
      trend[index] = { ...trend[index], revenueGbp: roundMoney(trend[index].revenueGbp + sale.totalGbp) }
    }
  }

  const revenueTodayGbp = roundMoney(snapshot.summary.revenueTodayGbp + localRevenueTodayGbp)
  const transactionsToday = snapshot.summary.transactionsToday + todaySales.length
  const avgOrderValueGbp = transactionsToday > 0 ? roundMoney(revenueTodayGbp / transactionsToday) : 0
  const topProducts = [...products].sort((a, b) => {
    if (b.unitsSoldToday !== a.unitsSoldToday) return b.unitsSoldToday - a.unitsSoldToday
    return b.revenueTodayGbp - a.revenueTodayGbp
  })
  const inventory = [...state.inventory].sort((a, b) => a.quantityOnHand - b.quantityOnHand)

  return {
    summary: {
      revenueTodayGbp,
      transactionsToday,
      avgOrderValueGbp,
      grossMarginPct: snapshot.summary.grossMarginPct,
      demoRevenueTodayGbp: localRevenueTodayGbp,
      demoTransactionsToday: todaySales.length,
      lowStockCount: products.filter((product) => product.lowStock).length,
    },
    trend,
    products,
    topProducts,
    inventory,
    recentSales: state.sales.slice(0, 8),
  }
}
