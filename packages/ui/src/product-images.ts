export type ProductImageRecord = {
  id: string
  reference?: string
  backendId?: string
  attachment?: string
  data?: Record<string, unknown> | null
}

const text = (value: unknown): string | null => typeof value === 'string' && value.trim() ? value.trim() : null

export function productImageUrl(product: ProductImageRecord): string | null {
  const images = product.data?.images
  const latest = Array.isArray(images) ? images.at(-1) : null
  const url = latest && typeof latest === 'object' ? text((latest as { url?: unknown }).url) : null
  return url ?? (product.attachment?.startsWith('data:image/') || product.attachment?.startsWith('https://') ? product.attachment : null)
}

export function linkedProductImage(record: ProductImageRecord, products: ProductImageRecord[]): string | null {
  const data = record.data
  const lines = Array.isArray(data?.items) ? data.items : Array.isArray(data?.lines) ? data.lines : []
  const firstLine = lines.find((line) => line && typeof line === 'object' && (text(line.productId) || text(line.productSku) || text(line.sku)))
  const id = text(data?.productId) ?? text(firstLine?.productId)
  const sku = text(data?.productSku) ?? text(data?.sku) ?? text(firstLine?.productSku) ?? text(firstLine?.sku)
  if (!id && !sku) return null
  const product = products.find((item) =>
    (id && (item.backendId === id || item.id === id))
    || (sku && (item.reference === sku || item.id === sku || item.data?.sku === sku)))
  return product ? productImageUrl(product) : null
}
