/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { answerBob } from '@founder-os/bob'
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

const text = (value: unknown) => String(value || '').trim()
const number = (value: unknown) => Math.max(0, Number(value || 0))
const date = (value: unknown) => value ? new Date(String(value)) : undefined
const platforms = (value: unknown) => Array.isArray(value) ? value.map(String) : []
const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

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

const generateCampaignCopy = (name: string, objective: string, audience: string) => ({ idea: `${name}: a focused ${objective.toLowerCase()} campaign for ${audience}.`, caption: `${name} is here. Discover what is useful, relevant, and ready for you.`, hashtags: '#LocalBusiness #CustomerFirst #FoundingOS', adCopy: `Turn interest into action with ${name}. Built for ${audience}, focused on ${objective.toLowerCase()}.` })
export const createCampaign = (tenantId: string, input: Record<string, unknown>) => { const name = text(input.name); const objective = text(input.objective) || 'Growth'; const audience = text(input.audience) || 'All customers'; return prisma.marketingCampaign.create({ data: { tenantId, name, objective, audience, platforms: platforms(input.platforms), status: text(input.status) || 'draft', scheduledAt: date(input.scheduledAt), ...generateCampaignCopy(name, objective, audience) } }) }
export const updateCampaign = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.marketingCampaign.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.status !== undefined ? { status: text(input.status) } : {}), ...(input.scheduledAt !== undefined ? { scheduledAt: date(input.scheduledAt) } : {}), ...(input.impressions !== undefined ? { impressions: number(input.impressions) } : {}), ...(input.engagements !== undefined ? { engagements: number(input.engagements) } : {}), ...(input.conversions !== undefined ? { conversions: number(input.conversions) } : {}), ...(input.revenuePence !== undefined ? { revenuePence: number(input.revenuePence) } : {}) } })

export const createSocialPost = (tenantId: string, input: Record<string, unknown>) => prisma.socialPost.create({ data: { tenantId, campaignId: text(input.campaignId) || undefined, platforms: platforms(input.platforms), content: text(input.content), mediaUrl: text(input.mediaUrl) || undefined, mediaType: text(input.mediaType) || undefined, status: date(input.scheduledAt) ? 'scheduled' : 'draft', scheduledAt: date(input.scheduledAt), autoPost: Boolean(input.autoPost) } })
export const updateSocialPost = (id: string, tenantId: string | undefined, input: Record<string, unknown>) => prisma.socialPost.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { ...(input.content !== undefined ? { content: text(input.content) } : {}), ...(input.status !== undefined ? { status: text(input.status), ...(text(input.status) === 'published' ? { publishedAt: new Date() } : {}) } : {}), ...(input.scheduledAt !== undefined ? { scheduledAt: date(input.scheduledAt) } : {}), ...(input.autoPost !== undefined ? { autoPost: Boolean(input.autoPost) } : {}) } })

export const generateMedia = async (tenantId: string, input: Record<string, unknown>, context: Record<string, unknown>) => { const format = text(input.format) || 'Social media content'; const brief = text(input.brief) || 'Create useful commercial content'; const output = answerBob(`Generate ${format}. Brief: ${brief}. Structured context: ${JSON.stringify(context)}`, { app: 'foundretail', tenantId }); return prisma.mediaGeneration.create({ data: { tenantId, format, brief, output, context: json(context) } }) }

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
