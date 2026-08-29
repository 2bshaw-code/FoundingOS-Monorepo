/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import { discoverItemLinks, parseScrapedMetadata, safeUrl } from '../src/scraping.js'

test('metadata parsing detects organization and merchant contacts', () => {
  const html = `<!doctype html><html><head><title>Free display cabinet</title><meta property="og:site_name" content="North Street Furnishings"><meta property="og:description" content="Free for collection"><script type="application/ld+json">{"@type":"Product","name":"Cabinet","seller":{"@type":"Organization","name":"North Street Furnishings"}}</script></head><body><a href="mailto:reuse@example.com">Email</a><a href="tel:+441234567890">Call</a></body></html>`
  const metadata = parseScrapedMetadata(html, new URL('https://listings.example/items/cabinet'))
  assert.equal(metadata.title, 'Free display cabinet')
  assert.equal(metadata.organization, 'North Street Furnishings')
  assert.equal(metadata.contactEmail, 'reuse@example.com')
  assert.equal(metadata.contactPhone, '+441234567890')
})

test('source discovery uses selectors, resolves links, and rejects other hosts', () => {
  const html = `<section class="listing"><a class="item" href="/free/chair">Chair</a></section><section class="listing"><a class="item" href="https://other.example/free/table">Table</a></section><a class="item" href="/outside-selector">Ignore</a>`
  const links = discoverItemLinks(html, new URL('https://community.example/free'), '.listing', 'a.item', 20)
  assert.deepEqual(links, ['https://community.example/free/chair'])
})

test('scraper blocks loopback and local network targets', async () => {
  await assert.rejects(() => safeUrl('http://127.0.0.1:3230/private'), /Private or local network/)
  await assert.rejects(() => safeUrl('file:///etc/passwd'), /Only HTTP and HTTPS/)
})
