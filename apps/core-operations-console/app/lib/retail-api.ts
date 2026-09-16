/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Shared client-side fetch helper for the Retail Console spec API
// (Product, Variant, InventoryMovement, Order — core-operations/backend).
// Mirrors the mobile lib/core-api.ts convention. Fails gracefully so
// screens never block the console shell from rendering when the API is
// unreachable (e.g. local dev without the backend running).
export const CORE_API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-api.foundingos.com/api/v1'

export type Variant = { id: string; productId: string; label: string; sku: string; pricePence: number; stock: number; attributes?: Record<string, unknown> }
export type Product = { id: string; name: string; sku: string; category: string; description?: string; pricePence: number; active: boolean; variants: Variant[] }
export type InventoryMovement = { id: string; productId?: string; variantId?: string; warehouseId?: string; quantity: number; direction: 'in' | 'out'; reason: string; createdAt: string }
export type RetailOrder = { id: string; customerId?: string; reference: string; status: string; totalPence: number; paymentStatus: string; deliveryStatus: string; source: string; items?: unknown; createdAt: string }
export type LowInventoryPrediction = { productId: string; variantId: string; label: string; stock: number; dailyRunRate: number; daysUntilStockout: number | null; suggestedRestockQuantity: number }
export type FraudFlag = { orderId: string; reference: string; reason: string; severity: 'low' | 'medium' | 'high' }

function authHeaders(): HeadersInit | undefined {
  if (typeof window === 'undefined') return undefined
  const token = window.localStorage.getItem('foundingos_token')
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(`${CORE_API_BASE}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers || {}) },
    })
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchProducts = (search?: string) => coreApiFetch<Product[]>(`/retail/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
export const fetchProduct = async (id: string, all: Product[] | null) => all?.find((product) => product.id === id) ?? null
export const createProduct = (input: Record<string, unknown>) => coreApiFetch<Product>('/retail/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
export const updateProduct = (id: string, input: Record<string, unknown>) => coreApiFetch<Product>(`/retail/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const fetchOrders = () => coreApiFetch<RetailOrder[]>('/retail/orders')
export const fetchOrder = (id: string, all: RetailOrder[] | null) => all?.find((order) => order.id === id) ?? null
export const createOrder = (input: Record<string, unknown>) => coreApiFetch<RetailOrder>('/retail/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
export const updateOrderStatus = (id: string, input: Record<string, unknown>) => coreApiFetch<RetailOrder>(`/retail/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const fetchInventoryMovements = (productId?: string) => coreApiFetch<InventoryMovement[]>(`/retail/inventory-movements${productId ? `?productId=${encodeURIComponent(productId)}` : ''}`)
export const adjustInventory = (input: Record<string, unknown>) => coreApiFetch<InventoryMovement>('/retail/inventory-movements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const fetchLowInventoryPredictions = () => coreApiFetch<LowInventoryPrediction[]>('/retail/ai/predict-low-inventory')
export const fetchFraudFlags = () => coreApiFetch<FraudFlag[]>('/retail/ai/fraud-flags')
