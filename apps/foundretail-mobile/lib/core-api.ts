/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Points at the new core-operations/backend Retail Console API (Product, Variant,
// InventoryMovement, Order — see docs/console-requirements.md). This is separate
// from GROWTH_CONSOLE_URL (the legacy per-brand demo feed in retail-poll.ts) —
// CORE_API_BASE is the real FoundingOS Core.Operations-backed Retail Console service.
export const CORE_API_BASE = 'https://core-operations-api.foundingos.com/api/v1'

export type Variant = { id: string; productId: string; sku: string; label: string; pricePence: number; stock: number; attributes?: Record<string, unknown> }
export type Product = { id: string; name: string; sku: string; category: string; description?: string; pricePence: number; active: boolean; variants: Variant[] }
export type InventoryMovement = { id: string; productId?: string; variantId?: string; warehouseId?: string; quantity: number; direction: 'in' | 'out'; reason: string; createdAt: string }
export type RetailOrder = { id: string; customerId?: string; reference: string; status: string; totalPence: number; paymentStatus: string; deliveryStatus: string; source: string; createdAt: string }

async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await authedFetch(`${CORE_API_BASE}${path}`, init)
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchProducts = (search?: string) => coreApiFetch<Product[]>(`/retail/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
export const fetchInventoryMovements = (productId?: string) => coreApiFetch<InventoryMovement[]>(`/retail/inventory-movements${productId ? `?productId=${encodeURIComponent(productId)}` : ''}`)
export const fetchOrders = () => coreApiFetch<RetailOrder[]>('/retail/orders')

export const createProduct = (input: Record<string, unknown>) =>
  coreApiFetch<Product>('/retail/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const adjustInventory = (input: { productId?: string; variantId?: string; quantity: number; direction: 'in' | 'out'; reason?: string }) =>
  coreApiFetch<InventoryMovement>('/retail/inventory-movements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const createOrder = (input: Record<string, unknown>) =>
  coreApiFetch<RetailOrder>('/retail/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const updateOrderStatus = (id: string, status: string) =>
  coreApiFetch<RetailOrder>(`/retail/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
