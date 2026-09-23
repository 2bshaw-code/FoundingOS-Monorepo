/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { answerBob } from '@foundingos/bob'
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

const text = (value: unknown) => String(value || '').trim()
const number = (value: unknown) => Math.max(0, Number(value || 0))
const date = (value: unknown) => value ? new Date(String(value)) : undefined
const platforms = (value: unknown) => Array.isArray(value) ? value.map(String) : []
const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue
const optionalText = (value: unknown) => text(value) || null
const color = (value: unknown, fallback: string) => {
  const candidate = text(value)
  if (!candidate) return fallback
  if (!/^#[0-9a-f]{6}$/i.test(candidate)) throw Object.assign(new Error('Brand colours must use six-digit hex values.'), { status: 400 })
  return candidate.toUpperCase()
}
const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

type BrandVoiceRules = {
  tone: string
  approvedTerms: string[]
  avoidedTerms: string[]
}

const termList = (value: unknown) => text(value)
  .split(/[\n,]/)
  .map((term) => term.trim())
  .filter(Boolean)

const readBrandVoiceRules = (value: unknown): BrandVoiceRules => {
  const voice = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  return {
    tone: text(voice.tone),
    approvedTerms: termList(voice.approvedTerms),
    avoidedTerms: termList(voice.avoidedTerms),
  }
}

const enforceBrandTerms = (values: string[], rules: BrandVoiceRules) => {
  const content = values.join('\n').toLocaleLowerCase()
  const conflicts = rules.avoidedTerms.filter((term) => content.includes(term.toLocaleLowerCase()))
  if (conflicts.length) {
    throw Object.assign(new Error(`Content conflicts with prohibited brand terminology: ${conflicts.join(', ')}`), { status: 422 })
  }
}

export const getBrandProfile = (tenantId: string) => prisma.tenantBrandProfile.findUnique({ where: { tenantId } })

export const saveBrandProfile = async (tenantId: string, input: Record<string, unknown>) => {
  const companyName = text(input.companyName)
  if (!companyName) throw Object.assign(new Error('Company name is required.'), { status: 400 })
  const existing = await getBrandProfile(tenantId)
  const brandVoice = readBrandVoiceRules(input.brandVoice)
  const conflictingTerms = brandVoice.approvedTerms.filter((term) =>
    brandVoice.avoidedTerms.some((avoided) => avoided.toLocaleLowerCase() === term.toLocaleLowerCase()))
  if (conflictingTerms.length) {
    throw Object.assign(new Error(`Brand terms cannot be both approved and prohibited: ${conflictingTerms.join(', ')}`), { status: 400 })
  }
  const data = {
    companyName,
    tradingName: optionalText(input.tradingName),
    tagline: optionalText(input.tagline),
    logoUrl: optionalText(input.logoUrl),
    primaryColor: color(input.primaryColor, '#4A90E2'),
    secondaryColor: color(input.secondaryColor, '#101828'),
    accentColor: color(input.accentColor, '#7C3AED'),
    headingFont: text(input.headingFont) || 'Inter',
    bodyFont: text(input.bodyFont) || 'Inter',
    email: optionalText(input.email),
    phone: optionalText(input.phone),
    website: optionalText(input.website),
    address: optionalText(input.address),
    registrationNumber: optionalText(input.registrationNumber),
    taxNumber: optionalText(input.taxNumber),
    defaultLocale: text(input.defaultLocale) || 'en-GB',
    defaultCurrency: text(input.defaultCurrency) || 'GBP',
    invoicePrefix: text(input.invoicePrefix) || 'INV',
    paymentTerms: optionalText(input.paymentTerms),
    documentFooter: optionalText(input.documentFooter),
    brandVoice: json({
      tone: brandVoice.tone,
      approvedTerms: brandVoice.approvedTerms.join(', '),
      avoidedTerms: brandVoice.avoidedTerms.join(', '),
    }),
    socialLinks: json(input.socialLinks),
    version: (existing?.version ?? 0) + 1,
  }
  return prisma.tenantBrandProfile.upsert({ where: { tenantId }, create: { tenantId, ...data }, update: data })
}

type BrandedDocumentInput = {
  type: 'Order' | 'Invoice'
  reference: string
  status: string
  totalPence: number
  createdAt: Date
  dueAt?: Date | null
  detail?: string | null
}

async function renderBrandedDocument(tenantId: string, document: BrandedDocumentInput) {
  const profile = await getBrandProfile(tenantId)
  const company = profile?.tradingName || profile?.companyName || 'Your company'
  const locale = profile?.defaultLocale || 'en-GB'
  const currency = profile?.defaultCurrency || 'GBP'
  const amount = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(document.totalPence / 100)
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const logo = profile?.logoUrl ? `<img src="${escapeHtml(profile.logoUrl)}" alt="${escapeHtml(company)} logo" />` : `<div class="logo-fallback">${escapeHtml(company.slice(0, 1))}</div>`
  return `<!doctype html>
<html lang="${escapeHtml(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(document.type)} ${escapeHtml(document.reference)}</title>
<style>:root{--primary:${profile?.primaryColor || '#4A90E2'};--secondary:${profile?.secondaryColor || '#101828'};--accent:${profile?.accentColor || '#7C3AED'}}*{box-sizing:border-box}body{margin:0;background:#f3f5f8;color:var(--secondary);font-family:${escapeHtml(profile?.bodyFont || 'Inter')},Arial,sans-serif}.document{max-width:820px;margin:40px auto;background:#fff;border-top:8px solid var(--primary);padding:48px;box-shadow:0 18px 50px rgba(16,24,40,.12)}header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}.identity{display:flex;gap:16px;align-items:center}.identity img,.logo-fallback{width:64px;height:64px;object-fit:contain;border-radius:14px}.logo-fallback{display:grid;place-items:center;background:var(--primary);color:#fff;font-size:28px;font-weight:800}h1,h2{font-family:${escapeHtml(profile?.headingFont || 'Inter')},Arial,sans-serif}h1{margin:0;font-size:26px}.tagline,.muted{color:#667085}.document-title{text-align:right}.document-title h2{margin:0;color:var(--primary);font-size:32px}.details{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:44px 0;padding:24px;background:#f8fafc;border-radius:16px}.total{display:flex;justify-content:space-between;margin-top:36px;padding:22px 0;border-block:2px solid var(--primary);font-size:22px}.footer{margin-top:46px;padding-top:20px;border-top:1px solid #e4e7ec;color:#667085;font-size:12px;line-height:1.6}@media print{body{background:#fff}.document{margin:0;box-shadow:none}}</style></head>
<body><main class="document"><header><div class="identity">${logo}<div><h1>${escapeHtml(company)}</h1><div class="tagline">${escapeHtml(profile?.tagline || '')}</div></div></div><div class="document-title"><h2>${escapeHtml(document.type)}</h2><strong>${escapeHtml(document.reference)}</strong></div></header>
<section class="details"><div><strong>Issued</strong><p>${escapeHtml(dateFormatter.format(document.createdAt))}</p><strong>Status</strong><p>${escapeHtml(document.status)}</p></div><div>${document.dueAt ? `<strong>Due</strong><p>${escapeHtml(dateFormatter.format(document.dueAt))}</p>` : ''}<strong>Contact</strong><p>${escapeHtml(profile?.email || profile?.phone || profile?.website || '—')}</p></div></section>
${document.detail ? `<p>${escapeHtml(document.detail)}</p>` : ''}<div class="total"><strong>Total</strong><strong>${escapeHtml(amount)}</strong></div>
<footer class="footer">${escapeHtml(profile?.address || '')}<br>${profile?.registrationNumber ? `Registration: ${escapeHtml(profile.registrationNumber)} · ` : ''}${profile?.taxNumber ? `Tax: ${escapeHtml(profile.taxNumber)}` : ''}<p>${escapeHtml(profile?.paymentTerms || '')}</p><p>${escapeHtml(profile?.documentFooter || '')}</p></footer></main></body></html>`
}

export const invoiceDocument = async (id: string, tenantId: string) => {
  const stored = await prisma.brandedDocument.findUnique({ where: { tenantId_documentType_sourceId: { tenantId, documentType: 'invoice', sourceId: id } } })
  if (stored) return { filename: `${stored.reference}.html`, contentType: stored.contentType, content: stored.content, brandProfileVersion: stored.brandProfileVersion, brandProfileSnapshot: stored.brandProfileSnapshot, sourceSnapshot: stored.sourceSnapshot, generatedAt: stored.generatedAt }
  const invoice = await prisma.invoice.findFirstOrThrow({ where: { id, tenantId } })
  const profile = await getBrandProfile(tenantId)
  const content = await renderBrandedDocument(tenantId, { type: 'Invoice', reference: invoice.number, status: invoice.status, totalPence: invoice.totalPence, createdAt: invoice.createdAt, dueAt: invoice.dueAt })
  const created = await prisma.brandedDocument.create({ data: { tenantId, documentType: 'invoice', sourceId: id, reference: invoice.number, brandProfileVersion: profile?.version ?? 0, brandProfileSnapshot: json(profile), sourceSnapshot: json(invoice), content } })
  return { filename: `${created.reference}.html`, contentType: created.contentType, content: created.content, brandProfileVersion: created.brandProfileVersion, brandProfileSnapshot: created.brandProfileSnapshot, sourceSnapshot: created.sourceSnapshot, generatedAt: created.generatedAt }
}

export const orderDocument = async (id: string, tenantId: string) => {
  const stored = await prisma.brandedDocument.findUnique({ where: { tenantId_documentType_sourceId: { tenantId, documentType: 'order', sourceId: id } } })
  if (stored) return { filename: `${stored.reference}.html`, contentType: stored.contentType, content: stored.content, brandProfileVersion: stored.brandProfileVersion, brandProfileSnapshot: stored.brandProfileSnapshot, sourceSnapshot: stored.sourceSnapshot, generatedAt: stored.generatedAt }
  const order = await prisma.salesOrder.findFirstOrThrow({ where: { id, tenantId } })
  const profile = await getBrandProfile(tenantId)
  const content = await renderBrandedDocument(tenantId, { type: 'Order', reference: order.reference, status: order.status, totalPence: order.totalPence, createdAt: order.createdAt, detail: order.deliveryAddress })
  const created = await prisma.brandedDocument.create({ data: { tenantId, documentType: 'order', sourceId: id, reference: order.reference, brandProfileVersion: profile?.version ?? 0, brandProfileSnapshot: json(profile), sourceSnapshot: json(order), content } })
  return { filename: `${created.reference}.html`, contentType: created.contentType, content: created.content, brandProfileVersion: created.brandProfileVersion, brandProfileSnapshot: created.brandProfileSnapshot, sourceSnapshot: created.sourceSnapshot, generatedAt: created.generatedAt }
}

export const operationsSummary = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [inventory, orders, invoices, campaigns, socialPosts, media, deliveryOperators, deliveryVehicles, deliveryZones, deliveryAssignments, deliveryNotifications, locationProfiles] = await Promise.all([
    prisma.inventoryItem.findMany({ where, orderBy: { updatedAt: 'desc' } }),
    prisma.salesOrder.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.marketingCampaign.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.socialPost.findMany({ where, orderBy: { scheduledAt: 'asc' } }),
    prisma.mediaGeneration.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.deliveryOperator.findMany({ where, orderBy: { name: 'asc' } }),
    prisma.deliveryVehicle.findMany({ where, orderBy: { label: 'asc' } }),
    prisma.deliveryZone.findMany({ where, orderBy: { name: 'asc' } }),
    prisma.deliveryAssignment.findMany({ where, orderBy: { assignedAt: 'desc' } }),
    prisma.deliveryNotification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.locationProfile.findMany({ where, orderBy: { updatedAt: 'desc' } }),
  ])
  const completedDeliveries = deliveryAssignments.filter((assignment) => assignment.status === 'delivered')
  return { inventory, orders, invoices, campaigns, socialPosts, media, deliveryOperators, deliveryVehicles, deliveryZones, deliveryAssignments, deliveryNotifications, locationProfiles, metrics: { inventoryItems: inventory.length, lowStock: inventory.filter((item) => item.stock <= item.lowStockLevel).length, inventoryValuePence: inventory.reduce((sum, item) => sum + item.stock * item.pricePence, 0), orders: orders.length, orderRevenuePence: orders.reduce((sum, order) => sum + order.totalPence, 0), unpaidInvoices: invoices.filter((invoice) => !['paid', 'cancelled'].includes(invoice.status)).length, outstandingPence: invoices.filter((invoice) => invoice.status !== 'paid').reduce((sum, invoice) => sum + invoice.totalPence, 0), campaigns: campaigns.length, scheduledPosts: socialPosts.filter((post) => post.status === 'scheduled').length, activeDeliveries: deliveryAssignments.filter((assignment) => !['delivered', 'failed', 'cancelled'].includes(assignment.status)).length, delivered: completedDeliveries.length, deliveryRevenuePence: deliveryAssignments.reduce((sum, assignment) => sum + assignment.feePence, 0), deliverySuccessRate: deliveryAssignments.length ? Math.round(completedDeliveries.length / deliveryAssignments.length * 100) : 0 } }
}

export const searchInventory = (tenantId: string | undefined, query: Record<string, unknown>) => prisma.inventoryItem.findMany({
  where: { ...(tenantId ? { tenantId } : {}), ...(text(query.search) ? { OR: [{ name: { contains: text(query.search), mode: 'insensitive' } }, { sku: { contains: text(query.search), mode: 'insensitive' } }, { supplierName: { contains: text(query.search), mode: 'insensitive' } }] } : {}), ...(text(query.category) ? { category: text(query.category) } : {}), ...(query.lowStock === 'true' ? { stock: { lte: 5 } } : {}) },
  orderBy: { updatedAt: 'desc' },
})

export const createInventoryItem = (tenantId: string, input: Record<string, unknown>) => prisma.inventoryItem.create({ data: { tenantId, name: text(input.name), sku: text(input.sku), category: text(input.category) || 'General', supplierName: text(input.supplierName) || undefined, supplierEmail: text(input.supplierEmail) || undefined, pricePence: number(input.pricePence), stock: number(input.stock), lowStockLevel: number(input.lowStockLevel || 5), variants: json(input.variants || []) } })
export const updateInventoryItem = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.inventoryItem.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.name !== undefined ? { name: text(input.name) } : {}), ...(input.category !== undefined ? { category: text(input.category) } : {}), ...(input.supplierName !== undefined ? { supplierName: text(input.supplierName) || null } : {}), ...(input.supplierEmail !== undefined ? { supplierEmail: text(input.supplierEmail) || null } : {}), ...(input.pricePence !== undefined ? { pricePence: number(input.pricePence) } : {}), ...(input.stock !== undefined ? { stock: number(input.stock) } : {}), ...(input.lowStockLevel !== undefined ? { lowStockLevel: number(input.lowStockLevel) } : {}), ...(input.variants !== undefined ? { variants: json(input.variants) } : {}) } })
export const deleteInventoryItem = (id: string, tenantId?: string) => prisma.inventoryItem.delete({ where: { id, ...(tenantId ? { tenantId } : {}) } })

export const createOrder = (tenantId: string, input: Record<string, unknown>) => prisma.salesOrder.create({ data: { tenantId, customerId: text(input.customerId) || undefined, reference: text(input.reference) || `ORD-${Date.now()}`, status: text(input.status) || 'open', totalPence: number(input.totalPence), paymentStatus: text(input.paymentStatus) || 'unpaid', paymentMethod: text(input.paymentMethod) || undefined, deliveryStatus: text(input.deliveryStatus) || 'unassigned', deliveryAddress: text(input.deliveryAddress) || undefined, notes: text(input.notes) || undefined } })
export const updateOrder = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.salesOrder.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.status !== undefined ? { status: text(input.status) } : {}), ...(input.paymentStatus !== undefined ? { paymentStatus: text(input.paymentStatus) } : {}), ...(input.paymentMethod !== undefined ? { paymentMethod: text(input.paymentMethod) } : {}), ...(input.deliveryStatus !== undefined ? { deliveryStatus: text(input.deliveryStatus) } : {}), ...(input.deliveryAddress !== undefined ? { deliveryAddress: text(input.deliveryAddress) } : {}), ...(input.notes !== undefined ? { notes: text(input.notes) } : {}) } })

export const createInvoice = (tenantId: string, input: Record<string, unknown>) => { const subtotalPence = number(input.subtotalPence); const taxPence = number(input.taxPence); return prisma.invoice.create({ data: { tenantId, customerId: text(input.customerId) || undefined, number: text(input.number) || `INV-${Date.now()}`, status: text(input.status) || 'draft', subtotalPence, taxPence, totalPence: subtotalPence + taxPence, dueAt: date(input.dueAt), items: json(input.items || []) } }) }
export const updateInvoice = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.invoice.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.status !== undefined ? { status: text(input.status), ...(text(input.status) === 'paid' ? { paidAt: new Date() } : {}) } : {}), ...(input.dueAt !== undefined ? { dueAt: date(input.dueAt) } : {}), ...(input.items !== undefined ? { items: json(input.items) } : {}) } })
export const sendInvoice = (id: string, tenantId?: string) => prisma.invoice.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status: 'sent', sentAt: new Date() } })

const generateCampaignCopy = (name: string, objective: string, audience: string, tone?: string) => ({
  idea: `${name}: a focused ${objective.toLowerCase()} campaign for ${audience}.`,
  caption: `${name} is here. Discover what is useful, relevant, and ready for you.`,
  hashtags: '#LocalBusiness #CustomerFirst #FoundingOS',
  adCopy: `Turn interest into action with ${name}. Built for ${audience}, focused on ${objective.toLowerCase()}.${tone ? ` Brand tone: ${tone}.` : ''}`,
})
export const createCampaign = async (tenantId: string, input: Record<string, unknown>) => {
  const name = text(input.name)
  const objective = text(input.objective) || 'Growth'
  const audience = text(input.audience) || 'All customers'
  const profile = await getBrandProfile(tenantId)
  const voice = readBrandVoiceRules(profile?.brandVoice)
  enforceBrandTerms([name, objective, audience], voice)
  const generated = generateCampaignCopy(name, objective, audience, voice.tone)
  enforceBrandTerms(Object.values(generated), voice)
  return prisma.marketingCampaign.create({ data: { tenantId, name, objective, audience, platforms: platforms(input.platforms), status: text(input.status) || 'draft', scheduledAt: date(input.scheduledAt), ...generated } })
}
export const updateCampaign = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.marketingCampaign.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.status !== undefined ? { status: text(input.status) } : {}), ...(input.scheduledAt !== undefined ? { scheduledAt: date(input.scheduledAt) } : {}), ...(input.impressions !== undefined ? { impressions: number(input.impressions) } : {}), ...(input.engagements !== undefined ? { engagements: number(input.engagements) } : {}), ...(input.conversions !== undefined ? { conversions: number(input.conversions) } : {}), ...(input.revenuePence !== undefined ? { revenuePence: number(input.revenuePence) } : {}) } })

export const createSocialPost = async (tenantId: string, input: Record<string, unknown>) => {
  const content = text(input.content)
  const profile = await getBrandProfile(tenantId)
  enforceBrandTerms([content], readBrandVoiceRules(profile?.brandVoice))
  return prisma.socialPost.create({ data: { tenantId, campaignId: text(input.campaignId) || undefined, platforms: platforms(input.platforms), content, mediaUrl: text(input.mediaUrl) || undefined, mediaType: text(input.mediaType) || undefined, status: date(input.scheduledAt) ? 'scheduled' : 'draft', scheduledAt: date(input.scheduledAt), autoPost: Boolean(input.autoPost) } })
}
export const updateSocialPost = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.socialPost.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.content !== undefined ? { content: text(input.content) } : {}), ...(input.status !== undefined ? { status: text(input.status), ...(text(input.status) === 'published' ? { publishedAt: new Date() } : {}) } : {}), ...(input.scheduledAt !== undefined ? { scheduledAt: date(input.scheduledAt) } : {}), ...(input.autoPost !== undefined ? { autoPost: Boolean(input.autoPost) } : {}) } })

export const generateMedia = async (tenantId: string, input: Record<string, unknown>, context: Record<string, unknown>) => {
  const format = text(input.format) || 'Social media content'
  const brief = text(input.brief) || 'Create useful commercial content'
  const profile = await getBrandProfile(tenantId)
  const voice = readBrandVoiceRules(profile?.brandVoice)
  enforceBrandTerms([brief], voice)
  const rules = `Tone: ${voice.tone || 'clear and helpful'}. Approved terminology: ${voice.approvedTerms.join(', ') || 'none specified'}. Never use: ${voice.avoidedTerms.join(', ') || 'none specified'}.`
  const output = answerBob(`Generate ${format}. Brief: ${brief}. Brand rules: ${rules} Structured context: ${JSON.stringify(context)}`, { app: 'core_operations', tenantId })
  enforceBrandTerms([output], voice)
  return prisma.mediaGeneration.create({ data: { tenantId, format, brief, output, context: json({ ...context, brandProfileVersion: profile?.version ?? 0 }) } })
}

const coordinate = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : undefined
const radians = (degrees: number) => degrees * Math.PI / 180
const distanceKm = (originLat?: number, originLng?: number, destinationLat?: number, destinationLng?: number) => {
  if ([originLat, originLng, destinationLat, destinationLng].some((value) => value === undefined)) return 0
  const deltaLat = radians(destinationLat! - originLat!)
  const deltaLng = radians(destinationLng! - originLng!)
  const value = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(originLat!)) * Math.cos(radians(destinationLat!)) * Math.sin(deltaLng / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)) * 10) / 10
}
const routeEstimate = async (originLat?: number, originLng?: number, destinationLat?: number, destinationLng?: number) => {
  const fallbackDistance = distanceKm(originLat, originLng, destinationLat, destinationLng)
  if ([originLat, originLng, destinationLat, destinationLng].some((value) => value === undefined)) return { distanceKm: fallbackDistance, estimatedMinutes: 0, source: 'coordinates-required' }
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destinationLng},${destinationLat}?overview=false`, { signal: AbortSignal.timeout(7_000) })
    const data = await response.json() as { routes?: Array<{ distance: number; duration: number }> }
    const route = data.routes?.[0]
    if (!response.ok || !route) throw new Error('Route unavailable')
    return { distanceKm: Math.round(route.distance / 100) / 10, estimatedMinutes: Math.ceil(route.duration / 60), source: 'osrm' }
  } catch { return { distanceKm: fallbackDistance, estimatedMinutes: fallbackDistance ? Math.ceil(fallbackDistance / 0.5) : 0, source: 'geometric-fallback' } }
}

export const createDeliveryOperator = (tenantId: string, input: Record<string, unknown>) => prisma.deliveryOperator.create({ data: { tenantId, name: text(input.name), phone: text(input.phone).replace(/\D/g, ''), role: text(input.role) || 'rider', status: text(input.status) || 'available', phoneVerified: Boolean(input.phoneVerified) } })
export const updateDeliveryOperator = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.deliveryOperator.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.name !== undefined ? { name: text(input.name) } : {}), ...(input.phone !== undefined ? { phone: text(input.phone).replace(/\D/g, '') } : {}), ...(input.role !== undefined ? { role: text(input.role) } : {}), ...(input.status !== undefined ? { status: text(input.status) } : {}), ...(input.phoneVerified !== undefined ? { phoneVerified: Boolean(input.phoneVerified) } : {}), ...(input.active !== undefined ? { active: Boolean(input.active) } : {}) } })
export const createDeliveryVehicle = (tenantId: string, input: Record<string, unknown>) => prisma.deliveryVehicle.create({ data: { tenantId, registration: text(input.registration).toUpperCase(), label: text(input.label), vehicleType: text(input.vehicleType) || 'van', capacityKg: number(input.capacityKg), status: text(input.status) || 'available' } })
export const updateDeliveryVehicle = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.deliveryVehicle.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.label !== undefined ? { label: text(input.label) } : {}), ...(input.vehicleType !== undefined ? { vehicleType: text(input.vehicleType) } : {}), ...(input.capacityKg !== undefined ? { capacityKg: number(input.capacityKg) } : {}), ...(input.status !== undefined ? { status: text(input.status) } : {}), ...(input.currentLat !== undefined ? { currentLat: coordinate(input.currentLat), currentLng: coordinate(input.currentLng), lastLocationAt: new Date() } : {}), ...(input.active !== undefined ? { active: Boolean(input.active) } : {}) } })
export const createDeliveryZone = (tenantId: string, input: Record<string, unknown>) => prisma.deliveryZone.create({ data: { tenantId, name: text(input.name), postcodePrefixes: json(Array.isArray(input.postcodePrefixes) ? input.postcodePrefixes : text(input.postcodePrefixes).split(',').map((value) => value.trim()).filter(Boolean)), feePence: number(input.feePence), estimatedMinutes: number(input.estimatedMinutes), feeMode: text(input.feeMode) || 'zone', cashOnDeliveryAllowed: Boolean(input.cashOnDeliveryAllowed) } })
export const updateDeliveryZone = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.deliveryZone.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.name !== undefined ? { name: text(input.name) } : {}), ...(input.postcodePrefixes !== undefined ? { postcodePrefixes: json(input.postcodePrefixes) } : {}), ...(input.feePence !== undefined ? { feePence: number(input.feePence) } : {}), ...(input.estimatedMinutes !== undefined ? { estimatedMinutes: number(input.estimatedMinutes) } : {}), ...(input.feeMode !== undefined ? { feeMode: text(input.feeMode) } : {}), ...(input.cashOnDeliveryAllowed !== undefined ? { cashOnDeliveryAllowed: Boolean(input.cashOnDeliveryAllowed) } : {}), ...(input.active !== undefined ? { active: Boolean(input.active) } : {}) } })

export const assignDelivery = async (tenantId: string, input: Record<string, unknown>) => {
  const originLat = coordinate(input.originLat); const originLng = coordinate(input.originLng); const destinationLat = coordinate(input.destinationLat); const destinationLng = coordinate(input.destinationLng)
  const route = await routeEstimate(originLat, originLng, destinationLat, destinationLng)
  const routeDistanceKm = route.distanceKm
  const zone = text(input.zoneId) ? await prisma.deliveryZone.findFirst({ where: { id: text(input.zoneId), tenantId } }) : null
  const estimatedMinutes = number(input.estimatedMinutes) || zone?.estimatedMinutes || route.estimatedMinutes
  const feePence = number(input.feePence) || zone?.feePence || Math.ceil(routeDistanceKm * 100)
  const event = { status: 'assigned', detail: `Delivery assigned via ${route.source}`, at: new Date().toISOString() }
  const assignment = await prisma.deliveryAssignment.upsert({ where: { tenantId_orderId: { tenantId, orderId: text(input.orderId) } }, create: { tenantId, orderId: text(input.orderId), operatorId: text(input.operatorId) || undefined, vehicleId: text(input.vehicleId) || undefined, zoneId: text(input.zoneId) || undefined, feePence, routeDistanceKm, estimatedMinutes, originLat, originLng, destinationLat, destinationLng, timeline: json([event]) }, update: { operatorId: text(input.operatorId) || null, vehicleId: text(input.vehicleId) || null, zoneId: text(input.zoneId) || null, status: 'assigned', feePence, routeDistanceKm, estimatedMinutes, originLat, originLng, destinationLat, destinationLng, timeline: json([event]), completedAt: null } })
  if (text(input.recipient)) await prisma.deliveryNotification.create({ data: { tenantId, assignmentId: assignment.id, recipient: text(input.recipient), message: text(input.message) || `Delivery ${assignment.orderId} has been assigned.`, channel: text(input.channel) || 'whatsapp' } })
  return assignment
}
export const updateDeliveryAssignment = async (id: string, tenantId: string | undefined, input: Record<string, unknown>) => {
  const assignment = await prisma.deliveryAssignment.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) } })
  const status = text(input.status) || assignment.status
  const timeline = Array.isArray(assignment.timeline) ? assignment.timeline : []
  const updated = await prisma.deliveryAssignment.update({ where: { id }, data: { status, timeline: json([...timeline, { status, detail: text(input.detail) || `Delivery marked ${status}`, at: new Date().toISOString() }]), ...(['delivered', 'failed', 'cancelled'].includes(status) ? { completedAt: new Date() } : {}) } })
  if (text(input.recipient)) await prisma.deliveryNotification.create({ data: { tenantId: updated.tenantId, assignmentId: updated.id, recipient: text(input.recipient), message: text(input.message) || `Delivery update: ${status.replace(/_/g, ' ')}.`, channel: text(input.channel) || 'whatsapp', status: 'queued' } })
  return updated
}
export const updateDeliveryNotification = (id: string, tenantId: string | undefined, status: string) => prisma.deliveryNotification.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status, ...(status === 'sent' ? { sentAt: new Date() } : {}) } })

export const saveLocationProfile = (tenantId: string, input: Record<string, unknown>) => prisma.locationProfile.upsert({ where: { tenantId }, create: { tenantId, label: text(input.label) || 'Primary location', latitude: coordinate(input.latitude), longitude: coordinate(input.longitude), locality: text(input.locality) || undefined, countryCode: text(input.countryCode) || undefined, timezone: text(input.timezone) || undefined, source: text(input.source) || 'manual', gpsEnabled: input.gpsEnabled !== false, ipFallbackEnabled: input.ipFallbackEnabled !== false }, update: { ...(input.label !== undefined ? { label: text(input.label) } : {}), ...(input.latitude !== undefined ? { latitude: coordinate(input.latitude), longitude: coordinate(input.longitude) } : {}), ...(input.locality !== undefined ? { locality: text(input.locality) || null } : {}), ...(input.countryCode !== undefined ? { countryCode: text(input.countryCode) || null } : {}), ...(input.timezone !== undefined ? { timezone: text(input.timezone) || null } : {}), ...(input.source !== undefined ? { source: text(input.source) } : {}), ...(input.gpsEnabled !== undefined ? { gpsEnabled: Boolean(input.gpsEnabled) } : {}), ...(input.ipFallbackEnabled !== undefined ? { ipFallbackEnabled: Boolean(input.ipFallbackEnabled) } : {}) } })

export const detectLocation = async (input: Record<string, unknown>, ipAddress?: string) => {
  const latitude = coordinate(input.latitude); const longitude = coordinate(input.longitude)
  if (latitude !== undefined && longitude !== undefined) return { latitude, longitude, locality: text(input.locality), countryCode: text(input.countryCode), timezone: text(input.timezone) || Intl.DateTimeFormat().resolvedOptions().timeZone, source: 'gps' }
  const ip = String(ipAddress || '').replace(/^::ffff:/, '')
  if (!ip || ['127.0.0.1', '::1'].includes(ip)) return { latitude: 51.5072, longitude: -0.1276, locality: 'London', countryCode: 'GB', timezone: 'Europe/London', source: 'development-fallback' }
  const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(5_000) })
  const data = await response.json() as { success?: boolean; latitude?: number; longitude?: number; city?: string; country_code?: string; timezone?: { id?: string } }
  if (!response.ok || data.success === false || data.latitude === undefined || data.longitude === undefined) throw new Error('IP location unavailable')
  return { latitude: data.latitude, longitude: data.longitude, locality: data.city || '', countryCode: data.country_code || '', timezone: data.timezone?.id || 'UTC', source: 'ip' }
}

export const weatherAt = async (latitude: number, longitude: number, timezone = 'auto') => {
  const query = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m', timezone })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { signal: AbortSignal.timeout(7_000) })
  if (!response.ok) throw new Error('Weather service unavailable')
  const data = await response.json() as { current?: Record<string, number | string>; current_units?: Record<string, string>; timezone?: string }
  return { latitude, longitude, timezone: data.timezone || timezone, temperature: data.current?.temperature_2m, apparentTemperature: data.current?.apparent_temperature, weatherCode: data.current?.weather_code, windSpeed: data.current?.wind_speed_10m, units: data.current_units || {}, observedAt: data.current?.time || new Date().toISOString() }
}
