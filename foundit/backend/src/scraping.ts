/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import dns from 'node:dns/promises'
import net from 'node:net'
import { load } from 'cheerio'
import { prisma } from './auth.js'

const privateAddress = (address: string) => {
  if (net.isIPv4(address)) {
    const [first, second] = address.split('.').map(Number)
    return first === 10 || first === 127 || (first === 169 && second === 254) || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168)
  }
  return address === '::1' || address.startsWith('fc') || address.startsWith('fd') || address.startsWith('fe80:')
}

export const safeUrl = async (value: unknown) => {
  const url = new URL(String(value || ''))
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS links can be scraped')
  const addresses = await dns.lookup(url.hostname, { all: true })
  if (!addresses.length || addresses.some(({ address }) => privateAddress(address))) throw new Error('Private or local network links cannot be scraped')
  return url
}

const absoluteUrl = (value: string | undefined, base: URL) => {
  if (!value) return undefined
  try { return new URL(value, base).toString() } catch { return undefined }
}

export const listScrapedLinks = (tenantId?: string) => prisma.scrapedLink.findMany({
  where: tenantId ? { OR: [{ tenantId }, { tenantId: null }] } : undefined,
  orderBy: { scrapedAt: 'desc' },
  take: 100,
})

const readJsonLdOrganizations = ($: ReturnType<typeof load>) => {
  const names: string[] = []
  $('script[type="application/ld+json"]').each((_index, element) => {
    try {
      const root = JSON.parse($(element).text()) as unknown
      const visit = (value: unknown, key = '') => {
        if (Array.isArray(value)) return value.forEach((item) => visit(item, key))
        if (!value || typeof value !== 'object') return
        const record = value as Record<string, unknown>
        const type = String(record['@type'] || '').toLowerCase()
        if (typeof record.name === 'string' && (['organization', 'localbusiness', 'store', 'seller'].some((item) => type.includes(item)) || ['seller', 'brand', 'provider', 'manufacturer'].includes(key))) names.push(record.name.trim())
        Object.entries(record).forEach(([childKey, child]) => visit(child, childKey))
      }
      visit(root)
    } catch { /* Invalid JSON-LD is ignored; regular metadata still applies. */ }
  })
  return names.find(Boolean)
}

export const parseScrapedMetadata = (html: string, url: URL) => {
  const $ = load(html)
  const title = $('meta[property="og:title"]').attr('content')?.trim() || $('title').text().trim() || url.hostname
  const description = $('meta[property="og:description"]').attr('content')?.trim() || $('meta[name="description"]').attr('content')?.trim() || undefined
  const imageUrl = absoluteUrl($('meta[property="og:image"]').attr('content'), url)
  const organization = readJsonLdOrganizations($) || $('meta[property="og:site_name"]').attr('content')?.trim() || undefined
  const contactEmail = $('a[href^="mailto:"]').first().attr('href')?.replace(/^mailto:/i, '').split('?')[0]?.trim() || undefined
  const contactPhone = $('a[href^="tel:"]').first().attr('href')?.replace(/^tel:/i, '').trim() || undefined
  return { title, description, imageUrl, organization, contactEmail, contactPhone }
}

export const fetchScrapePage = async (value: unknown) => {
  const url = await safeUrl(value)
  const response = await fetch(url, { headers: { 'User-Agent': 'FoundingOS-FoundThis/1.0 (+https://founder-os.local)' }, signal: AbortSignal.timeout(10_000), redirect: 'follow' })
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) throw new Error('Source is not an HTML page')
  const html = await response.text()
  if (html.length > 2_000_000) throw new Error('Source page is too large')
  return { url, html }
}

export const discoverItemLinks = (html: string, base: URL, itemSelector?: string | null, linkSelector?: string | null, limit = 20) => {
  const $ = load(html)
  const selector = itemSelector ? `${itemSelector} ${linkSelector || 'a[href]'}` : linkSelector || 'a[href]'
  const links = new Set<string>()
  $(selector).each((_index, element) => {
    const href = $(element).attr('href')
    const absolute = absoluteUrl(href, base)
    if (absolute && new URL(absolute).hostname === base.hostname && absolute !== base.toString()) links.add(absolute)
  })
  return [...links].slice(0, Math.max(1, Math.min(limit, 100)))
}

export const scrapeLink = async (value: unknown, tenantId?: string, details: Record<string, unknown> = {}) => {
  const { url, html } = await fetchScrapePage(value)
  const { title, description, imageUrl, organization, contactEmail, contactPhone } = parseScrapedMetadata(html, url)
  const merchantName = details.merchantName ? String(details.merchantName) : organization
  const companyName = details.companyName ? String(details.companyName) : organization
  return prisma.scrapedLink.upsert({
    where: { url: url.toString() },
    create: { url: url.toString(), sourceHost: url.hostname, title: title.slice(0, 300), description: description?.slice(0, 1000), imageUrl, tenantId, sourceId: details.sourceId ? String(details.sourceId) : undefined, merchantName, companyName, contactEmail: details.contactEmail ? String(details.contactEmail) : contactEmail, contactPhone: details.contactPhone ? String(details.contactPhone) : contactPhone, priority: Boolean(details.priority), listingFeePence: Number(details.listingFeePence || 0), placementFeePence: Number(details.placementFeePence || 0), deliveryFeePence: Number(details.deliveryFeePence || 0), premiumFeePence: Number(details.premiumFeePence || 0) },
    update: { sourceHost: url.hostname, title: title.slice(0, 300), description: description?.slice(0, 1000), imageUrl, tenantId, sourceId: details.sourceId ? String(details.sourceId) : undefined, merchantName, companyName, contactEmail: details.contactEmail ? String(details.contactEmail) : contactEmail, contactPhone: details.contactPhone ? String(details.contactPhone) : contactPhone, priority: Boolean(details.priority), listingFeePence: Number(details.listingFeePence || 0), placementFeePence: Number(details.placementFeePence || 0), deliveryFeePence: Number(details.deliveryFeePence || 0), premiumFeePence: Number(details.premiumFeePence || 0), status: 'available', scrapedAt: new Date() },
  })
}