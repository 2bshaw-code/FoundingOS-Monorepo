import assert from 'node:assert/strict'
import { test } from 'node:test'
import { linkedProductImage, productImageUrl } from './product-images'

const product = { id: 'PRO-101', backendId: 'product-uuid', reference: 'SKU-101', data: { sku: 'SKU-101', images: [{ url: 'https://example.com/old.jpg' }, { url: 'https://example.com/current.jpg' }] } }

test('uses the latest canonical product photo', () => {
  assert.equal(productImageUrl(product), 'https://example.com/current.jpg')
  assert.equal(linkedProductImage({ id: 'order-1', data: { productId: 'product-uuid' } }, [product]), 'https://example.com/current.jpg')
  assert.equal(linkedProductImage({ id: 'return-1', data: { items: [{ sku: 'SKU-101' }] } }, [product]), 'https://example.com/current.jpg')
})

test('does not guess by name or show an unrelated image', () => {
  assert.equal(linkedProductImage({ id: 'other', data: { productSku: 'SKU-999' } }, [product]), null)
  assert.equal(linkedProductImage({ id: 'other', data: { note: 'SKU-101' } }, [product]), null)
})
